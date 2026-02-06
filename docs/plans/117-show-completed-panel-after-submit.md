# Task Plan: 회고 제출 후 CompletedPanel View 표시

**Issue**: #117
**Type**: Bug
**Created**: 2026-02-06
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 제출 후 사용자에게 "회고가 제출되었습니다" 라는 단순 메시지만 표시되고 있음. 제출 후에는 `RetrospectiveCompletedPanel`의 탭 뷰(회고 내용 + 회고 분석)를 보여줘야 사용자가 바로 제출된 내용을 확인할 수 있음.

### Objectives

1. 회고 제출 성공 후 `CompletedRetrospectiveView` (탭 뷰)를 렌더링
2. 기존 완료된 회고 클릭 시의 동작과 동일한 UX 제공

### Scope

**In Scope**:

- `RetrospectiveDetailPanel`의 제출 완료 상태 렌더링 로직 수정
- 제출 후 `CompletedRetrospectiveView`로 전환

**Out of Scope**:

- `CompletedRetrospectiveView` 자체의 기능 변경
- API 변경

---

## 2. Requirements

### Functional Requirements

**FR-1**: 제출 후 CompletedPanel View 표시

- 제출 성공 시 현재의 완료 메시지 대신 `CompletedRetrospectiveView`를 렌더링
- 회고 내용 탭과 회고 분석 탭이 정상 동작해야 함

**FR-2**: 헤더 유지

- 제출 후에도 닫기, 확대/축소, 더보기(링크복사/내보내기/삭제) 기능 유지

### Technical Requirements

**TR-1**: 기존 컴포넌트 재사용

- `CompletedRetrospectiveView`를 그대로 import하여 사용
- `RetrospectiveCompletedPanel`의 헤더 패턴을 참고

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: `RetrospectiveDetailPanel` 내부에서 `CompletedRetrospectiveView` 렌더링

- **Rationale**: 가장 단순한 변경. `isSubmitted` 상태일 때 기존 완료 메시지 대신 `CompletedRetrospectiveView`를 렌더링하면 됨
- **Approach**: `isSubmitted === true`일 때의 렌더링 블록(라인 519-554)을 수정하여 `RetrospectiveCompletedPanel`과 동일한 레이아웃으로 변경
- **Trade-offs**: 패널 전환 없이 같은 컴포넌트 내에서 뷰만 전환하므로 상태 관리가 간단함
- **Alternative**: `TeamDashboardPage`에서 `isSelectedCompleted`를 `true`로 전환하여 `RetrospectiveCompletedPanel`로 교체하는 방법도 있으나, 불필요한 상위 컴포넌트 수정이 필요

### Component Flow

```
제출 버튼 클릭
    ↓
handleSubmitConfirm() → API 호출 성공
    ↓
isSubmitted = true
    ↓
RetrospectiveDetailPanel 내부에서
CompletedRetrospectiveView 렌더링
(+ 헤더: 닫기/확대/더보기)
```

---

## 4. Implementation Plan

### Phase 1: Core Implementation

**Tasks**:

1. `RetrospectiveDetailPanel`의 `isSubmitted` 상태 렌더링 블록(라인 519-554)을 수정
2. `CompletedRetrospectiveView`를 import
3. 기존 완료 메시지를 `RetrospectiveCompletedPanel`의 레이아웃(헤더 + CompletedRetrospectiveView)으로 교체

**Files to Modify**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY) - 제출 완료 상태 렌더링 로직

**Estimated Effort**: Small

### Phase 2: Verification

**Tasks**:

1. 빌드 검증
2. 타입체크
3. 린트

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 회고 제출 후 `CompletedRetrospectiveView`가 사이드패널에 표시됨
- [ ] 회고 내용 탭과 회고 분석 탭이 정상적으로 동작
- [ ] 헤더의 닫기/확대/더보기 기능 정상 동작
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: CompletedRetrospectiveView의 props 호환

- **Risk**: `CompletedRetrospectiveView`에 필요한 props(`retrospectId`, `projectName`, `retrospectMethod`, `participantCount`, `totalParticipants`)가 `RetrospectiveDetailPanel`의 `retrospect` prop에서 모두 제공 가능한지 확인 필요
- **Impact**: LOW
- **Mitigation**: 코드 분석 결과 `retrospect` 인터페이스에 모든 필드 존재하나 `participantCount`/`totalParticipants`는 optional. 기본값 처리 필요

---

## 7. Timeline & Milestones

### Estimated Timeline

- **Core Implementation**: 15분
- **Verification**: 5분
- **Total**: 20분

---

## 8. References

### Related Issues

- Issue #117: [회고 제출 후 CompletedPanel View를 보여줘야 함](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/117)

---

## 9. Implementation Summary

**Completion Date**: 2026-02-06
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Phase 1 (Previous Commits): CompletedPanel View 전환

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` — 제출 후 `CompletedRetrospectiveView`로 전환 렌더링
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` — 이미 제출된 회고 클릭 시 CompletedPanel 표시

#### Phase 2 (Current Changes): 회고 완료 View API 연동

**React Query Hooks 추가:**

- `src/features/retrospective/api/retrospective.queries.ts` — `useResponses(retrospectId, category)`, `useComments(responseId)` 훅 추가
- `src/features/retrospective/api/retrospective.mutations.ts` — `useCreateComment(responseId)`, `useToggleLike()`, `useAnalyzeRetrospective(retrospectId)` 훅 추가

**컴포넌트 API 연동:**

- `src/features/retrospective/ui/CompletedRetrospectiveView.tsx` — `useRetrospectDetail`로 질문 목록 조회, `useAnalyzeRetrospective`로 AI 분석 호출, `retrospectId`/`questions`를 ContentTab에 전달, `analysisData`를 AnalysisResult에 전달
- `src/features/retrospective/ui/RetrospectiveContentTab.tsx` — 모든 mock 데이터 제거, `useResponses`로 답변 데이터 조회 (카테고리 필터링), `useComments`/`useCreateComment`로 댓글 기능, `useToggleLike`로 좋아요 기능, `CommentSection` 서브컴포넌트 분리
- `src/features/retrospective/ui/RetrospectiveAnalysisResult.tsx` — 모든 mock 데이터 제거, `AnalysisResponse` props로 `insight`/`emotionRank`/`personalMissions` 렌더링
- `src/features/retrospective/ui/AnalysisEmptyState.tsx` — `isLoading` prop 추가, 분석 중 버튼 비활성화 및 "분석 중..." 텍스트 표시

**타입 정리:**

- `src/features/retrospective/model/types.ts` — 불필요한 mock용 타입 4개 제거 (`RetrospectiveAnswer`, `KeywordRanking`, `Mission`, `RetrospectiveAnalysis`), `RetrospectiveTabType`과 `CompletedRetrospectiveViewProps` 유지

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed (0 errors)
- [x] Lint: Passed (0 errors in modified files)

### Deviations from Plan

**Added**:

- 회고 완료 View API 연동 전체 구현 (원래 계획은 CompletedPanel View 전환만 포함)
- `CommentSection`을 별도 서브컴포넌트로 분리 (각 댓글 섹션이 독립적 상태 관리)
- Enter 키로 댓글 작성 지원

**Changed**:

- 없음

**Skipped**:

- 없음

### Performance Impact

- Bundle size: 변동 없음 (604.38KB, mock 데이터 제거로 상쇄)
- API 호출 추가: responses, comments 쿼리 (staleTime 2분 캐시)

### Commits

```
822e7cf - docs(plans): add plan document for issue #117
92ca3b0 - fix(retrospective): show CompletedPanel view after submission and for already-submitted retrospectives
(unstaged) - feat(retrospective): integrate API for completed retrospective view
```

### Follow-up Tasks

- [ ] 좋아요 상태 반영 (현재 항상 IcHeartInactive 표시, 좋아요 활성 상태 아이콘 필요)
- [ ] 답변 목록 무한 스크롤 (현재 size=100으로 조회)
- [ ] 댓글 목록 무한 스크롤 (현재 size=100으로 조회)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-06
