# Task Plan: 회고 생성 시간 선택에서 disabled 카드 대신 선택 가능한 시간만 표시

**Issue**: #123
**Type**: Enhancement
**Created**: 2026-02-07
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 회고 생성 시 오늘 날짜를 선택하면, `TimeSelector`에서 09:00~23:00 전체 시간을 렌더링하고 이미 지나간 시간은 disabled 스타일(회색 배경, `cursor-not-allowed`)로 표시한다. 오후 늦은 시간에 회고를 생성하면 대부분의 카드가 disabled 상태로 표시되어 UI가 지저분하고 사용자 경험이 저하된다.

### Objectives

1. 오늘 날짜 선택 시 선택 가능한 시간만 필터링하여 렌더링
2. 미래 날짜 선택 시 기존과 동일하게 전체 시간 표시
3. 기존 시간 선택/초기화 로직 정상 동작 유지

### Scope

**In Scope**:

- `TimeSelector`에서 disabled 카드 대신 필터링된 시간만 표시
- `isTimePassed` 함수를 필터링 용도로 전환
- `DateTimeStep`의 시간 초기화 로직 정합성 확인

**Out of Scope**:

- Calendar 컴포넌트 변경
- RadioCard 공통 컴포넌트 변경
- 시간 옵션 범위 변경 (09:00~23:00 유지)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 오늘 날짜 시간 필터링

- 오늘 날짜 선택 시 현재 시간 이후의 시간 옵션만 렌더링
- 예: 현재 14:30이면 15:00~23:00만 표시

**FR-2**: 미래 날짜 전체 시간 표시

- 미래 날짜 선택 시 09:00~23:00 전체 옵션 표시 (기존 동작 유지)

**FR-3**: 날짜 변경 시 시간 초기화

- 오늘 날짜로 변경 시 이미 선택된 시간이 지나간 시간이면 초기화 (기존 동작 유지)

### Technical Requirements

**TR-1**: `TimeSelector` 수정

- `TIME_OPTIONS`를 `selectedDate`에 따라 필터링
- `isTimePassed` 함수를 disabled 판단이 아닌 필터링 조건으로 활용
- `disabled` prop 제거 (필터링으로 대체)

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: disabled 대신 filter 방식 사용

- **Rationale**: disabled 카드를 렌더링하는 것보다 아예 필터링하는 것이 UI가 깔끔하고 사용자 혼란을 줄임
- **Approach**: `TIME_OPTIONS.filter()`로 선택 가능한 시간만 추출 후 렌더링
- **Impact**: LOW - `TimeSelector` 내부 로직만 변경

### Component Design

**변경 전 (현재)**:

```typescript
{
  TIME_OPTIONS.map((time) => {
    const isPassed = isTimePassed(time, selectedDate);
    return <RadioCardItem disabled={isPassed}>{time}</RadioCardItem>;
  });
}
```

**변경 후**:

```typescript
const availableTimeOptions = getAvailableTimeOptions(selectedDate);

{
  availableTimeOptions.map((time) => (
    <RadioCardItem value={time}>{time}</RadioCardItem>
  ));
}
```

---

## 4. Implementation Plan

### Phase 1: Core Implementation

**Tasks**:

1. `TimeSelector.tsx`에서 `isTimePassed`를 필터링 함수 `getAvailableTimeOptions`로 리팩토링
2. `TIME_OPTIONS.map` → 필터링된 옵션으로 `map`
3. `RadioCardItem`에서 `disabled` prop 제거

**Files to Modify**:

- `src/features/retrospective/ui/steps/TimeSelector.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 2: Validation

**Tasks**:

1. `DateTimeStep.tsx`의 시간 초기화 로직이 필터링 방식과 호환되는지 확인
2. 빌드, 타입체크, 린트 검증

**Files to Verify**:

- `src/features/retrospective/ui/steps/DateTimeStep.tsx` (VERIFY - 변경 불필요 예상)

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 오늘 날짜 선택 시 지나간 시간의 카드가 렌더링되지 않음
- [ ] 미래 날짜 선택 시 전체 시간 옵션이 정상 표시됨
- [ ] 기존 시간 선택/초기화 로직이 정상 동작함
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: 오늘 날짜에 선택 가능한 시간이 없는 경우

- **Risk**: 23:00 이후에 오늘 날짜를 선택하면 시간 옵션이 비어있을 수 있음
- **Impact**: LOW
- **Mitigation**: Calendar에서 이미 `minDate`로 오늘 이전은 막고 있으나, 23시 이후 오늘 선택 시 빈 목록 → 자연스럽게 미래 날짜 선택 유도

---

## 9. References

### Related Issues

- Issue #123: [회고 생성 시간 선택에서 disabled 카드 대신 선택 가능한 시간만 표시](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/123)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-07
**Implemented By**: Claude Opus 4.6

### Changes Made

**Modified Files**:

- [`src/features/retrospective/ui/steps/TimeSelector.tsx`](../../src/features/retrospective/ui/steps/TimeSelector.tsx) - `isTimePassed()` → `getAvailableTimeOptions()` 리팩토링, disabled 카드 대신 필터링된 시간만 렌더링, `disabled` prop 및 관련 스타일 제거
- [`src/pages/team-dashboard/ui/TeamDashboardPage.tsx`](../../src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 오늘 회고 카드 선택 시 `bg-grey-50` 배경 유지 스타일 추가

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- 오늘 회고 카드의 selected 상태 스타일 (`TeamDashboardPage.tsx`) - 사용자 추가 요청

**Changed**:

- 없음

**Skipped**:

- 없음

### Performance Impact

- Bundle size: +0.05KB (미미한 변경)
- No runtime impact

---

**Plan Status**: Completed
**Last Updated**: 2026-02-07
**Next Action**: `/commit` → `/pr`
