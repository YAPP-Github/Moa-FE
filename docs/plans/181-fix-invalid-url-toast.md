# Plan: 유효하지 않은 URL 입력 시 Warning 토스트 표시 및 재시도 수정

**Issue**: #181
**Branch**: `fix/181-invalid-url-toast`
**Type**: Bug Fix

---

## 1. Overview

### Problem

회고 생성 폼에서 URL 입력 시, 서버가 유효하지 않다고 판단한 URL이 제출되면 `ApiError`가
`Uncaught (in promise)`로 발생한다. 이로 인해:

1. Warning 토스트가 표시되지 않음 (기대: 노란색 토스트)
2. 에러 발생 후 폼 상태가 깨져 재시도 불가

### Root Cause

`CreateRetrospectForm.tsx`의 `handleSubmit`에서 `mutateAsync`를 try/catch 없이 호출.
서버 에러 발생 시 `mutateAsync`가 throw → RHF `handleSubmit`이 에러를 re-throw →
`Uncaught (in promise)` 발생. 글로벌 `MutationCache.onError`가 토스트를 표시하지만,
컴포넌트 레벨에서 unhandled rejection이 폼 상태를 깨뜨림.

### Goal

- 서버 URL 유효성 검사 실패 시 노란색 warning 토스트 표시
- 에러 발생 후 URL 수정 및 재시도 정상 동작
- 콘솔 `Uncaught (in promise)` 에러 제거

### Scope

`CreateRetrospectForm.tsx` 단일 파일 수정 (try/catch 추가)

---

## 2. Requirements

### Functional Requirements

- **FR-1**: 유효하지 않은 URL 제출 시 노란색(warning) 토스트 표시
- **FR-2**: 토스트 메시지는 서버 응답 메시지 그대로 표시 (`유효하지 않은 URL 형식입니다.`)
- **FR-3**: 에러 발생 후 URL 수정 시 재제출 가능

### Technical Requirements

- **TR-1**: `mutateAsync` 에러를 try/catch로 처리하여 unhandled rejection 방지
- **TR-2**: 에러 토스트는 기존 글로벌 핸들러(`MutationCache.onError`)에 위임 (중복 처리 금지)
- **TR-3**: 기존 성공 플로우 유지

---

## 3. Architecture & Design

### 현재 에러 흐름

```
ReferenceUrlStep.handleConfirmClick
  → 클라이언트 유효성 검사 (isValidUrl)
  → 통과 시 hidden submit button 클릭
  → MultiStepForm.handleSubmit 실행
  → CreateRetrospectForm.handleSubmit (async)
    → mutateAsync() ← 에러 발생 (try/catch 없음)
    → throw → RHF re-throw → Uncaught in promise ❌
    → MutationCache.onError → toast (실행되지만 form 깨짐)
```

### 수정 후 에러 흐름

```
ReferenceUrlStep.handleConfirmClick
  → 클라이언트 유효성 검사 (isValidUrl)
  → 통과 시 hidden submit button 클릭
  → MultiStepForm.handleSubmit 실행
  → CreateRetrospectForm.handleSubmit (async)
    → try { mutateAsync() } catch { return }  ← 에러 잡기
    → MutationCache.onError → toast ✅
    → 폼 상태 정상 유지, 재시도 가능 ✅
```

### Design Decision

에러 처리를 컴포넌트에서 직접 하지 않고 catch 블록에서 `return`만 수행.
토스트는 글로벌 핸들러에 위임 (에러 규칙 규칙 준수: Layer 2에서 처리).

---

## 4. Implementation Plan

### 변경 파일

| 파일 | 변경 내용 |
|---|---|
| `src/features/retrospective/ui/CreateRetrospectForm.tsx` | `handleSubmit`에 try/catch 추가 |

### 구현

```typescript
// src/features/retrospective/ui/CreateRetrospectForm.tsx

const handleSubmit = async (data: CreateRetrospectFormData) => {
  const filteredUrls = data.referenceUrls?.filter((url) => url.trim() !== '');
  const questions = data.questions.filter((q) => q.trim() !== '');

  try {
    await createRetrospect({
      retroRoomId,
      projectName: data.projectName,
      retrospectDate: format(data.retrospectDate, 'yyyy-MM-dd'),
      retrospectMethod: data.retrospectMethod,
      questions,
      referenceUrls: filteredUrls?.length ? filteredUrls : undefined,
    });
  } catch {
    // 에러 토스트는 MutationCache.onError (queryClient.ts)에서 자동 처리
    return;
  }

  showToast({ variant: 'success', message: '회고 생성 완료!' });
  onSuccess?.();
  onClose();
};
```

---

## 5. Quality Gates

### Validation Checklist

- [ ] `pnpm run build` 성공
- [ ] `pnpm tsc --noEmit` 타입 오류 없음
- [ ] `pnpm run lint` 린트 통과

### 수동 테스트 시나리오

1. **정상 URL 제출**: 유효한 URL 입력 → 성공 토스트 표시, 모달 닫힘
2. **무효 URL 제출**: 서버가 거부하는 URL 입력 → warning 토스트 표시, 폼 유지
3. **재시도**: 무효 URL → 에러 후 유효 URL로 수정 → 성공 제출 가능
4. **콘솔 확인**: `Uncaught (in promise)` 에러 없음

---

## 6. Risks & Dependencies

### Risks

| 리스크 | 가능성 | 영향 | 완화 |
|---|---|---|---|
| 다른 mutation에 동일 패턴 존재 | 낮음 | 낮음 | 해당 이슈는 URL 특화 버그 |

### Dependencies

- 글로벌 에러 핸들러 (`queryClient.ts`) 정상 동작 ← 이미 확인됨

---

## 7. References

- Issue #181: https://github.com/YAPP-Github/Moa-FE/issues/181
- `CreateRetrospectForm.tsx`: `src/features/retrospective/ui/CreateRetrospectForm.tsx`
- `queryClient.ts`: `src/app/providers/queryClient.ts`
- 에러 핸들링 규칙: `.claude/rules/error-handling.md` (Layer 2 → Layer 3 패턴)

---

## Implementation Summary

**Completion Date**: 2026-02-27
**Implemented By**: Claude Sonnet 4.6

### Changes Made

#### Files Modified

- [src/features/retrospective/api/retrospective.mutations.ts](src/features/retrospective/api/retrospective.mutations.ts) — `useCreateRetrospect`에 `meta: { skipGlobalError: true }` 추가
- [src/features/retrospective/ui/CreateRetrospectForm.tsx](src/features/retrospective/ui/CreateRetrospectForm.tsx) — `handleSubmit`에 try/catch 추가, `ApiError` import

#### Key Implementation Details

- `skipGlobalError: true`로 글로벌 핸들러 억제 → 컴포넌트에서 직접 toast 제어
- catch 블록에서 `ApiError`이면 서버 메시지 사용, 아니면 fallback `'올바른 URL 형식을 확인해 주세요!'`
- 성공 플로우는 기존 그대로 유지

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Changed**: 계획에서는 글로벌 핸들러에 위임(단순 `return`)이었으나, 서버 메시지 말투(`~습니다`) 대신 `~주세요!` 스타일 커스텀 메시지를 위해 `skipGlobalError: true` 방식으로 변경

### Sub-agents Used

- `react-developer` (issue #181): 구현 가이드 제공
