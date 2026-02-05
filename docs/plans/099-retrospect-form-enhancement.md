# Task Plan: 회고 생성 폼 수정 (회고 방식 세부 내용 추가, 첨부 링크 연동, 에러 핸들링)

**Issue**: #99
**Type**: Enhancement
**Created**: 2026-02-05
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 생성 폼의 완성도를 높이기 위해 UI/UX 개선 및 안정성 강화가 필요합니다.

- 현재 회고 방식 선택 시 간단한 설명만 제공되어 사용자가 각 방식(KPT, 4L, 5F, PMI, 자유 회고)의 구체적인 내용을 파악하기 어려움
- 첨부 링크 기능의 실제 API 연동 확인 필요
- API 호출 실패 시 적절한 에러 처리가 없어 사용자에게 피드백이 제공되지 않음

### Objectives

1. 각 회고 방식별 세부 항목 설명 추가 (KPT → Keep, Problem, Try 등)
2. 첨부 링크 API 연동 확인 및 필요 시 수정
3. API 에러 발생 시 Toast 메시지로 사용자에게 피드백 제공

### Scope

**In Scope**:

- `RETROSPECT_METHOD_DESCRIPTIONS`에 세부 항목 설명 추가
- `MethodSelector` UI에서 세부 항목 표시
- `useCreateRetrospect` mutation에 에러 핸들링 추가
- Toast 메시지로 에러/성공 피드백 제공

**Out of Scope**:

- 링크 유효성 검증 (이미 Zod 스키마에서 URL 형식 검증 중)
- 회고 방식 추가/삭제
- 다국어(i18n) 지원

---

## 2. Requirements

### Functional Requirements

**FR-1**: 회고 방식별 세부 설명 표시

- 각 회고 방식 카드 확장 시 세부 항목 목록 표시
- KPT: Keep, Problem, Try 각각의 의미 설명
- 4L: Liked, Learned, Lacked, Longed for 설명
- 5F: Fact, Feeling, Finding, Future action, Feedback 설명
- PMI: Plus, Minus, Interesting 설명
- 자유 회고: 자유롭게 작성 가능하다는 안내

**FR-2**: 에러 핸들링 및 사용자 피드백

- API 호출 실패 시 Toast 메시지로 에러 표시
- 네트워크 오류, 서버 오류 등 구분하여 메시지 제공

### Technical Requirements

**TR-1**: 기존 Toast 시스템 활용

- `useToast` 훅 사용
- `warning` variant로 에러 메시지 표시

**TR-2**: 타입 안전성 유지

- TypeScript 타입 정의 유지
- Zod 스키마 검증 유지

### Non-Functional Requirements

**NFR-1**: 사용자 경험

- 에러 메시지는 명확하고 이해하기 쉬워야 함
- 세부 설명은 가독성 있게 표시

---

## 3. Architecture & Design

### Directory Structure

```
src/features/retrospective/
├── api/
│   └── retrospective.mutations.ts   # (MODIFY) 에러 핸들링 추가
├── model/
│   └── constants.ts                 # (MODIFY) 세부 설명 추가
└── ui/
    ├── CreateRetrospectForm.tsx     # (MODIFY) 에러 핸들링 통합
    └── steps/
        └── MethodSelector.tsx       # (MODIFY) 세부 항목 UI 표시
```

### Design Decisions

**Decision 1**: 세부 설명 데이터 구조

- **Rationale**: 각 회고 방식별 세부 항목을 구조화하여 관리
- **Approach**: `RETROSPECT_METHOD_DETAILS` 상수 추가 (배열 형태)
- **Trade-offs**: 하드코딩이지만 현재 규모에서는 충분함
- **Impact**: LOW

**Decision 2**: 에러 핸들링 위치

- **Rationale**: mutation 레벨에서 에러를 잡아 Toast로 표시
- **Approach**: `useCreateRetrospect` 훅에 `onError` 콜백 추가 또는 `CreateRetrospectForm`에서 try-catch
- **Trade-offs**: Form 레벨에서 처리하면 더 유연하게 에러 메시지 커스터마이징 가능
- **Impact**: MEDIUM

### Component Design

**세부 설명 데이터 구조**:

```typescript
interface MethodDetail {
  title: string;
  description: string;
}

export const RETROSPECT_METHOD_DETAILS: Record<string, MethodDetail[]> = {
  [RetrospectMethod.KPT]: [
    { title: "Keep", description: "잘한 점, 계속 유지할 것" },
    { title: "Problem", description: "문제점, 개선이 필요한 것" },
    { title: "Try", description: "시도해볼 것, 액션 아이템" },
  ],
  // ...
};
```

**에러 핸들링 플로우**:

```
User Submit
    ↓
handleSubmit (try)
    ↓
createRetrospect API
    ↓ (error)
catch → showToast({ variant: 'warning', message: '...' })
    ↓ (success)
setIsComplete(true)
```

---

## 4. Implementation Plan

### Phase 1: 세부 설명 데이터 추가

**Tasks**:

1. `constants.ts`에 `RETROSPECT_METHOD_DETAILS` 상수 추가
2. 각 회고 방식별 세부 항목 정의

**Files to Create/Modify**:

- `src/features/retrospective/model/constants.ts` (MODIFY)

### Phase 2: MethodSelector UI 수정

**Tasks**:

1. `MethodSelector`에서 세부 항목 목록 표시
2. AccordionContent 내부에 리스트 형태로 렌더링

**Files to Create/Modify**:

- `src/features/retrospective/ui/steps/MethodSelector.tsx` (MODIFY)

### Phase 3: 에러 핸들링 추가

**Tasks**:

1. `CreateRetrospectForm`의 `handleSubmit`에 try-catch 추가
2. Toast 메시지로 에러 피드백 제공
3. 성공 시에도 Toast 메시지 표시 (선택적)

**Files to Create/Modify**:

- `src/features/retrospective/ui/CreateRetrospectForm.tsx` (MODIFY)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 시 함수형 업데이트 패턴 사용

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] 회고 방식별 세부 설명(하위 항목) 추가
- [ ] 첨부 링크 API 연동 확인 및 수정
- [ ] 에러 핸들링 로직 추가 (Toast 메시지 등)
- [ ] 빌드 및 타입 체크 통과

### Validation Checklist

**기능 동작**:

- [ ] KPT 선택 시 Keep, Problem, Try 설명 표시
- [ ] 4L 선택 시 Liked, Learned, Lacked, Longed for 설명 표시
- [ ] 5F 선택 시 5개 항목 설명 표시
- [ ] PMI 선택 시 Plus, Minus, Interesting 설명 표시
- [ ] 자유 회고 선택 시 안내 문구 표시
- [ ] API 에러 시 Toast 메시지 표시
- [ ] 첨부 링크 정상 전송 확인

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 스펙 불일치

- **Risk**: 첨부 링크 API가 예상과 다를 수 있음
- **Impact**: LOW
- **Mitigation**: 현재 코드 분석 결과 `referenceUrls`가 이미 올바르게 전송되고 있음

### Dependencies

**D-1**: Toast 시스템

- **Dependency**: `useToast` 훅 및 `ToastContainer`
- **Status**: AVAILABLE
- **Location**: `src/shared/ui/toast/Toast.tsx`

---

## 7. Rollout & Monitoring

### Deployment Strategy

- PR 머지 후 자동 배포 (Vercel)
- 별도 롤아웃 단계 불필요

### Success Metrics

**SM-1**: 에러 발생 시 사용자 피드백 제공

- **Metric**: Toast 메시지 표시 여부
- **Target**: 100% 에러 케이스에서 메시지 표시

---

## 8. Timeline & Milestones

### Milestones

**M1**: 세부 설명 추가

- constants.ts 및 MethodSelector 수정
- **Status**: NOT_STARTED

**M2**: 에러 핸들링 추가

- CreateRetrospectForm에 try-catch 및 Toast 추가
- **Status**: NOT_STARTED

**M3**: 검증 및 완료

- 빌드, 타입 체크, 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #99: [회고 생성 폼 수정](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/99)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [React Hook Form - useFieldArray](https://react-hook-form.com/docs/usefieldarray)
- [TanStack Query - useMutation](https://tanstack.com/query/latest/docs/framework/react/reference/useMutation)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-06
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Modified

**회고 폼 관련**:

- `src/features/retrospective/model/constants.ts` - 회고 방식별 세부 설명 추가 (RETROSPECT_METHOD_DETAILS)
- `src/features/retrospective/model/schema.ts` - 스키마 수정
- `src/features/retrospective/ui/CreateRetrospectForm.tsx` - 에러 핸들링 및 Toast 메시지 추가, CompleteStep 연동
- `src/features/retrospective/ui/steps/MethodSelector.tsx` - 세부 항목 UI 표시
- `src/features/retrospective/ui/steps/MethodStep.tsx` - 메서드 변경 콜백 추가
- `src/features/retrospective/ui/steps/DateTimeStep.tsx` - UI 개선
- `src/features/retrospective/ui/steps/TimeSelector.tsx` - 시간 선택 UI 개선
- `src/features/retrospective/ui/steps/ReferenceStep.tsx` - 첨부 링크 UI 개선
- `src/features/retrospective/ui/steps/CompleteStep.tsx` - 완료 화면 UI 개선 (FormHeader → 독립 헤더, 공유하기 영역 추가)
- `src/features/retrospective/ui/steps/FormHeader.tsx` - 폼 헤더 컴포넌트

**새로 생성된 파일**:

- `src/features/retrospective/ui/steps/FreeQuestionsStep.tsx` - 자유 회고 질문 입력 스텝
- `src/shared/ui/icons/IcCalendar.tsx` - 캘린더 아이콘
- `src/shared/assets/icons/ic_calendar.svg` - 캘린더 아이콘 SVG
- `src/shared/assets/icons/ic_link.svg` - 링크 아이콘 SVG

#### Key Implementation Details

1. **회고 방식별 세부 설명**: KPT, 4L, 5F, PMI, 자유 회고 각각의 세부 항목 설명 추가
2. **에러 핸들링**: `handleSubmit`에 try-catch 추가, `showToast`로 에러 피드백 제공
3. **CompleteStep 독립 헤더**: MultiStepForm 외부에서 렌더링되므로 `useStepContext` 대신 직접 닫기 버튼 구현
4. **공유하기 영역**: 48x48 원형 버튼 + "링크복사" 텍스트 (API 연동은 추후)
5. **자유 회고 지원**: `isFreeMethod` 상태로 조건부 FreeQuestionsStep 렌더링

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [ ] Lint: 기존 에러 존재 (이번 작업과 무관)

### Deviations from Plan

**Added**:

- CompleteStep에 공유하기(링크복사) 영역 추가 (shareLink prop)
- 자유 회고 선택 시 질문 입력 스텝 (FreeQuestionsStep) 추가
- IcCalendar 아이콘 컴포넌트 추가

**Changed**:

- CompleteStep이 MultiStepForm 외부에서 렌더링되므로 FormHeader 대신 독립 헤더 사용

**Skipped**:

- shareLink API 연동 (초대 링크 API 미정의 상태)

### Follow-up Tasks

- [ ] 초대 링크 API 정의 후 shareLink 연동
- [ ] 린트 에러 일괄 수정 (별도 이슈)

### Notes

- CompleteStep의 shareLink는 현재 빈 문자열로 전달 (API 준비 후 연동 예정)
- 기존 린트 에러는 이번 작업 범위 외

---

**Plan Status**: Completed
**Last Updated**: 2026-02-06
