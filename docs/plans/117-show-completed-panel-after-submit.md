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

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-06
**Next Action**: 사용자 승인 후 구현 시작
