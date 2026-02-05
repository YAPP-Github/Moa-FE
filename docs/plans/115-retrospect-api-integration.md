# Task Plan: 회고 시작, 완료, 어시스턴트, 임시저장 API 연동

**Issue**: #115
**Type**: Feature
**Created**: 2026-02-06
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 참여 플로우에서 핵심 기능들(회고 시작, 완료, AI 어시스턴트, 임시저장)이 백엔드 API와 연동되지 않은 상태입니다.

- 현재 `RetrospectiveDetailPanel`에서 임시저장은 localStorage만 사용
- 회고 제출은 TODO 주석만 있고 실제 API 호출 없음
- AI 어시스턴트는 3초 타임아웃 시뮬레이션으로 Mock 데이터 표시
- 백엔드 API(API-014, 016, 017, 029)는 이미 준비되어 있음

### Objectives

1. `useCreateParticipant` hook 구현 (회고 시작/참석자 등록)
2. `useSubmitRetrospect` hook 구현 (회고 최종 제출)
3. `useAssistantGuide` hook 구현 (AI 어시스턴트)
4. `useSaveDraft` hook 구현 (임시저장)
5. UI 컴포넌트에서 해당 hooks 연동

### Scope

**In Scope**:

- 4개의 mutation hooks 생성
- `RetrospectiveDetailPanel`에서 hooks 연동
- 에러 핸들링 및 로딩 상태 처리
- 성공/실패 시 toast 메시지

**Out of Scope**:

- 회고 분석 API (API-022) - 별도 이슈로 처리
- 댓글/좋아요 API - 이미 별도 구현 예정

---

## 2. Requirements

### Functional Requirements

**FR-1**: 회고 참석자 등록 (시작)

- 회고 시작 시 `createParticipant` API 호출
- 성공 시 회고 질문 목록 표시
- 실패 시 에러 토스트 표시

**FR-2**: 회고 최종 제출 (완료)

- 모든 질문에 답변 작성 후 제출 가능
- `submitRetrospect` API 호출
- 성공 시 localStorage 임시저장 삭제 및 완료 뷰 전환
- 실패 시 에러 토스트 표시

**FR-3**: AI 어시스턴트 가이드

- "회고 어시스턴트" 버튼 클릭 시 `assistantGuide` API 호출
- 현재 질문 ID와 작성 중인 내용 전달
- 응답받은 가이드 목록 표시
- "다시 생성" 시 재요청

**FR-4**: 임시저장

- localStorage + API 병행 저장 전략
- 자동저장: localStorage만 (debounce)
- 수동저장: localStorage + API 동시 저장
- 닫기 시 변경사항 있으면 저장 확인 모달

### Technical Requirements

**TR-1**: React Query Mutation Hooks

- `@tanstack/react-query` 사용
- 기존 `retrospective.mutations.ts` 패턴 따름
- 성공 시 관련 쿼리 무효화

**TR-2**: 타입 안전성

- generated API 타입 활용
- `AssistantRequest`, `SubmitRetrospectRequest`, `DraftSaveRequest` 등

**TR-3**: 에러 핸들링

- API 에러 시 toast 메시지 표시
- 네트워크 에러 처리

### Non-Functional Requirements

**NFR-1**: 사용자 경험

- 로딩 상태 시각적 피드백 (버튼 disabled, 스피너)
- 낙관적 업데이트 (임시저장)
- 토스트 메시지로 결과 알림

---

## 3. Architecture & Design

### Directory Structure

```
src/features/retrospective/
├── api/
│   ├── retrospective.mutations.ts  # 수정 - 4개 hooks 추가
│   └── retrospective.queries.ts    # 기존 유지
├── model/
│   └── types.ts                    # 기존 유지
└── ui/
    └── ...                         # UI는 widgets에서 수정

src/widgets/retrospective-detail-panel/
└── ui/
    └── RetrospectiveDetailPanel.tsx  # 수정 - hooks 연동
```

### Design Decisions

**Decision 1**: localStorage + API 병행 임시저장 전략

- **Rationale**: 네트워크 불안정 시에도 데이터 손실 방지
- **Approach**:
  - 자동저장(타이핑 중): localStorage만 (빠른 응답)
  - 수동저장("임시저장" 버튼): localStorage + API 동시 저장
  - 패널 열 때: localStorage 우선, 없으면 API에서 조회
- **Trade-offs**: 약간의 코드 복잡성 증가, 데이터 일관성 관리 필요
- **Impact**: MEDIUM

**Decision 2**: 어시스턴트 상태 관리

- **Rationale**: 질문별로 독립적인 어시스턴트 상태 필요
- **Approach**:
  - `questionId`를 키로 어시스턴트 응답 캐싱
  - "다시 생성" 시 해당 질문의 캐시만 무효화
- **Impact**: LOW

### API Design

**1. 회고 참석자 등록 (API-014)**

```typescript
// POST /api/v1/retrospects/{retrospectId}/participants
createParticipant(retrospectId: number): Promise<CreateParticipantResponse>

// Response
interface CreateParticipantResponse {
  memberId: number;
  nickname: string;
  participantId: number;
}
```

**2. 회고 최종 제출 (API-017)**

```typescript
// POST /api/v1/retrospects/{retrospectId}/submit
submitRetrospect(retrospectId: number, request: SubmitRetrospectRequest): Promise<SubmitRetrospectResponse>

interface SubmitRetrospectRequest {
  answers: SubmitAnswerItem[]; // 정확히 5개
}

interface SubmitAnswerItem {
  questionNumber: number; // 1~5
  content: string;        // 1~1000자
}
```

**3. AI 어시스턴트 (API-029)**

```typescript
// POST /api/v1/retrospects/{retrospectId}/questions/{questionId}/assistant
assistantGuide(retrospectId: number, questionId: number, request: AssistantRequest): Promise<AssistantResponse>

interface AssistantRequest {
  content?: string | null; // 현재 입력된 답변 (최대 1000자)
}

interface AssistantResponse {
  guideType: 'INITIAL' | 'PERSONALIZED';
  guides: GuideItem[];      // 최대 3개
  questionContent: string;
  questionId: number;
  remainingCount: number;   // 이번 달 남은 사용 횟수
}
```

**4. 임시저장 (API-016)**

```typescript
// PUT /api/v1/retrospects/{retrospectId}/drafts
saveDraft(retrospectId: number, request: DraftSaveRequest): Promise<DraftSaveResponse>

interface DraftSaveRequest {
  drafts: DraftItem[]; // 1~5개
}

interface DraftItem {
  questionNumber: number; // 1~5
  content?: string | null;
}
```

---

## 4. Implementation Plan

### Phase 1: Mutation Hooks 생성

**Tasks**:

1. `useCreateParticipant` hook 추가
2. `useSubmitRetrospect` hook 추가
3. `useAssistantGuide` hook 추가
4. `useSaveDraft` hook 추가

**Files to Modify**:

- `src/features/retrospective/api/retrospective.mutations.ts` (MODIFY)

**Code**:

```typescript
// useCreateParticipant
export function useCreateParticipant(retrospectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getApi().createParticipant(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospect", retrospectId] });
    },
  });
}

// useSubmitRetrospect
export function useSubmitRetrospect(retrospectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SubmitRetrospectRequest) =>
      getApi().submitRetrospect(retrospectId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retrospect", retrospectId] });
      queryClient.invalidateQueries({ queryKey: ["retrospects"] });
    },
  });
}

// useAssistantGuide
export function useAssistantGuide(retrospectId: number, questionId: number) {
  return useMutation({
    mutationFn: (request: AssistantRequest) =>
      getApi().assistantGuide(retrospectId, questionId, request),
  });
}

// useSaveDraft
export function useSaveDraft(retrospectId: number) {
  return useMutation({
    mutationFn: (request: DraftSaveRequest) =>
      getApi().saveDraft(retrospectId, request),
  });
}
```

### Phase 2: UI 연동

**Tasks**:

1. `RetrospectiveDetailPanel`에서 hooks import
2. 임시저장 버튼에 `useSaveDraft` 연동
3. 제출하기 버튼에 `useSubmitRetrospect` 연동
4. AI 어시스턴트 버튼에 `useAssistantGuide` 연동
5. 로딩 상태 및 에러 핸들링 추가

**Files to Modify**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY)

**Key Changes**:

```typescript
// Import hooks
import {
  useSubmitRetrospect,
  useAssistantGuide,
  useSaveDraft,
} from "@/features/retrospective/api/retrospective.mutations";

// 컴포넌트 내부
const submitMutation = useSubmitRetrospect(retrospect.retrospectId);
const saveDraftMutation = useSaveDraft(retrospect.retrospectId);
const assistantMutation = useAssistantGuide(
  retrospect.retrospectId,
  currentQuestionId
);

// handleSubmitConfirm 수정
const handleSubmitConfirm = async () => {
  try {
    await submitMutation.mutateAsync({
      answers: answers.map((content, index) => ({
        questionNumber: index + 1,
        content,
      })),
    });
    removeDraftFromStorage(retrospect.retrospectId);
    showToast({ variant: "success", message: "회고 제출이 완료되었어요!" });
    setIsSubmitted(true);
  } catch {
    showToast({
      variant: "error",
      message: "제출에 실패했어요. 다시 시도해주세요.",
    });
  }
};

// handleSaveDraft 수정
const handleSaveDraft = async () => {
  saveDraftToStorage(retrospect.retrospectId, answers);
  setSavedDraft([...answers]);

  try {
    await saveDraftMutation.mutateAsync({
      drafts: answers.map((content, index) => ({
        questionNumber: index + 1,
        content: content || null,
      })),
    });
    showToast({ variant: "success", message: "임시저장 되었어요!" });
  } catch {
    showToast({
      variant: "warning",
      message: "서버 저장에 실패했지만, 로컬에 저장되었어요.",
    });
  }
};

// handleAssistantGenerate 수정
const handleAssistantGenerate = async () => {
  if (assistantMutation.isPending) return;

  try {
    const response = await assistantMutation.mutateAsync({
      content: currentAnswer || null,
    });
    setAssistantData(response.result);
    setIsAssistantGenerated(true);
  } catch {
    showToast({
      variant: "error",
      message: "AI 어시스턴트 생성에 실패했어요.",
    });
  }
};
```

### Phase 3: 상태 관리 및 UI 개선

**Tasks**:

1. 로딩 상태에 따른 버튼 disabled 처리
2. 어시스턴트 응답 데이터로 UI 업데이트
3. Mock 데이터 제거

**Files to Modify**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY)

### Vercel React Best Practices

**HIGH**:

- `server-serialization`: API 응답 타입 안전하게 처리

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 시 함수형 setState 사용
- `rerender-memo`: 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 회고 참여 플로우 전체 테스트
- 네트워크 에러 시나리오 테스트
- 임시저장 동작 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] `useCreateParticipant` hook 구현
- [x] `useSubmitRetrospect` hook 구현
- [x] `useAssistantGuide` hook 구현
- [x] `useSaveDraft` hook 구현
- [ ] 회고 시작 버튼 클릭 시 참석자 등록 API 호출
- [ ] 회고 완료 버튼 클릭 시 최종 제출 API 호출
- [ ] 회고 어시스턴트 버튼 클릭 시 AI 가이드 API 호출
- [ ] 임시저장 플로우 구현 (localStorage + API)
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 응답 형식 불일치

- **Risk**: generated API 타입과 실제 응답이 다를 수 있음
- **Impact**: MEDIUM
- **Mitigation**: 런타임 타입 체크, 에러 핸들링 강화

**R-2**: 질문 ID 매핑

- **Risk**: 현재 UI는 인덱스(0-based) 사용, API는 questionNumber(1-based)
- **Impact**: LOW
- **Mitigation**: 변환 로직 명확히 구현

### Dependencies

**D-1**: 백엔드 API

- **Dependency**: API-014, 016, 017, 029가 정상 동작해야 함
- **Status**: AVAILABLE

**D-2**: generated API 타입

- **Dependency**: `src/shared/api/generated/index.ts`
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. hooks 구현 및 테스트
2. UI 연동
3. 코드 리뷰
4. 머지 후 Vercel Preview 테스트

### Success Metrics

- 회고 제출 성공률
- AI 어시스턴트 응답 시간
- 임시저장 데이터 유실률

---

## 8. Timeline & Milestones

### Milestones

**M1**: Mutation Hooks 구현

- 4개 hooks 생성
- **Status**: NOT_STARTED

**M2**: UI 연동

- `RetrospectiveDetailPanel` 수정
- **Status**: NOT_STARTED

**M3**: 테스트 및 검증

- 빌드/타입체크/린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #115: [회고 시작, 완료, 어시스턴트, 임시저장 API 연동](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/115)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-06
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveCompletedPanel.tsx` - 완료된 회고용 별도 패널 컴포넌트

#### Files Modified

- `src/features/retrospective/api/retrospective.mutations.ts` - 6개 mutation hooks 추가

  - `useCreateParticipant` (회고 참석자 등록)
  - `useSubmitRetrospect` (회고 최종 제출)
  - `useAssistantGuide` (AI 어시스턴트)
  - `useSaveDraft` (임시저장)
  - `useDeleteRetrospect` (회고 삭제)
  - `useExportRetrospect` (회고 내보내기)

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` - 주요 변경사항:

  - 모든 mutation hooks 연동
  - 드롭다운 메뉴 API 연동 (링크복사, 내보내기, 삭제하기)
  - 사이드바 토글 기능 (`lastSelectedPanel` 상태 관리)
  - 패널 애니메이션 제거
  - hover 효과를 아이콘/텍스트 색상 변경으로 수정
  - 삭제 시 브라우저 confirm 제거 (바로 삭제)
  - 내보내기 시 PDF 다운로드 (`window.open`)

- `src/shared/ui/side-panel/SidePanel.tsx` - 애니메이션 제거 (직접 조건부 렌더링)

### Key Implementation Details

- localStorage + API 병행 임시저장 전략 구현
- 질문별 AI 어시스턴트 상태 관리 (questionId를 키로 캐싱)
- 오늘 제출 여부 localStorage 추적으로 제출 완료 상태 유지
- PDF 내보내기: `window.open(exportUrl, "_blank")` 방식

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (163 formatting fixes applied)

### Deviations from Plan

**Added**:

- `useDeleteRetrospect`, `useExportRetrospect` hooks (계획에 없던 추가 기능)
- `RetrospectiveCompletedPanel` 분리 (완료된 회고용 별도 컴포넌트)
- 사이드바 토글 버튼 (IcOpen) 기능
- 드롭다운 메뉴 API 연동

**Changed**:

- 패널 애니메이션 전부 제거 (사용자 요청)
- hover 효과를 배경색 변경에서 아이콘/텍스트 색상 변경으로 수정
- 삭제 시 confirm 프롬프트 제거

### Performance Impact

- 패널 애니메이션 제거로 렌더링 성능 개선
- 불필요한 상태 관리 (isAnimating, shouldRender) 제거

### Follow-up Tasks

- [ ] 회고 분석 API (API-022) 연동
- [ ] 댓글/좋아요 API 연동

---

**Plan Status**: Completed
**Last Updated**: 2026-02-06
