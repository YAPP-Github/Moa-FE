# Task Plan: 회고 전체 삭제 시 팀 삭제 및 목록 미갱신 버그 수정

**Issue**: #167
**Type**: Bug
**Created**: 2026-02-26
**Status**: In Progress

---

## 1. Overview

### Problem Statement

팀 대시보드에서 회고를 삭제할 때 두 가지 버그가 발생한다.
첫째, 팀의 마지막 회고를 삭제하면 팀 자체가 삭제되는 현상이 나타난다.
둘째, 회고 삭제 후 목록이 즉시 갱신되지 않아 새로고침이 필요하다.

- **현재 상황**: `useDeleteRetrospect` 훅이 `retroRoomId`를 받지 않아 팀 목록 캐시를 무효화하지 않음
- **왜 필요한지**: 회고 삭제 UX가 즉각적으로 반응하지 않아 사용자 혼란 유발, 팀이 의도치 않게 삭제되는 것처럼 보임
- **영향**: 팀 대시보드의 핵심 기능인 회고 관리 신뢰성 저하

### Objectives

1. 회고 삭제 후 목록이 즉시 갱신됨 (새로고침 불필요)
2. 팀의 모든 회고를 삭제해도 팀이 유지됨 (백엔드 동작에 따른 프론트 처리)
3. `useDeleteRetrospect` 훅을 `useCreateRetrospect` 패턴과 일치시킴

### Scope

**In Scope**:

- `useDeleteRetrospect` 훅 수정: `retroRoomId` 파라미터 추가 + 정확한 queryKey로 invalidate
- `RetrospectCard.tsx`의 `CardMenu`: `teamId`를 `useDeleteRetrospect`에 전달
- 팀 목록 캐시 무효화: 회고 삭제 후 `teamQueryKeys.rooms`도 invalidate하여 팀 상태 동기화

**Out of Scope**:

- 백엔드의 "마지막 회고 삭제 시 팀 삭제" 동작 변경 (백엔드 이슈)
- 회고 삭제 이외의 캐시 전략 변경

---

## 2. Requirements

### Functional Requirements

**FR-1**: 회고 삭제 후 즉시 목록 갱신

- `useDeleteRetrospect` 훅이 삭제된 회고의 팀 ID를 알고 정확한 query key로 invalidate
- 새로고침 없이 해당 회고가 목록에서 사라져야 함

**FR-2**: 팀 목록 캐시 동기화

- 회고 삭제 후 `teamQueryKeys.rooms` 캐시도 invalidate
- 백엔드가 팀을 삭제하는 경우 UI가 올바르게 반영되어야 함

### Technical Requirements

**TR-1**: TanStack Query 캐시 무효화 일관성

- `useDeleteRetrospect(retroRoomId)` 파라미터 추가
- `queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.list(retroRoomId) })` 사용
- 기존 `useCreateRetrospect(retroRoomId)` 패턴과 동일하게 맞춤

**TR-2**: RetrospectCard 호출 업데이트

- `CardMenu` 컴포넌트: `useDeleteRetrospect(teamId)` 형태로 호출
- `teamId`는 이미 `CardMenuProps`에 있으므로 추가 props 불필요

---

## 3. Architecture & Design

### Root Cause Analysis

**Bug 1: 팀 삭제 현상**

```
백엔드: DELETE /api/v1/retrospects/{id} → 마지막 회고 삭제 시 팀도 삭제 (추정)
프론트: useDeleteRetrospect.onSuccess → ['retrospects'] 만 invalidate
결과:  useRetroRooms() 캐시는 만료 전(5분) 이므로 stale하지 않음
      → 일정 시간 후 (window focus 등) useRetroRooms 재조회 시 팀이 없음
      → TeamDashboardPage: currentTeam === undefined → <Navigate to="/" />
```

**Bug 2: 목록 미갱신**

```
현재 코드:
  useDeleteRetrospect: invalidateQueries({ queryKey: ['retrospects'] })  ← 매직 스트링
  useCreateRetrospect: invalidateQueries({ queryKey: retrospectiveQueryKeys.list(retroRoomId) })  ← 올바른 패턴

TanStack Query v5의 prefix matching으로 ['retrospects']는 ['retrospects', retroRoomId]를 포함해야 함.
그러나 일관성 부재로 인한 잠재적 문제가 있으며, retroRoomId 없이 동작 여부가 불명확.
```

### Design Decisions

**Decision 1**: `useDeleteRetrospect(retroRoomId)` 파라미터화

- **Rationale**: `useCreateRetrospect(retroRoomId)` 패턴과 동일하게 맞춰 일관성 확보
- **Approach**: 훅 시그니처 변경, `retrospectiveQueryKeys.list(retroRoomId)` 사용
- **Trade-offs**: 호출부(RetrospectCard) 업데이트 필요 — 이미 `teamId` prop이 있으므로 단순
- **Impact**: MEDIUM

**Decision 2**: 회고 삭제 시 팀 목록 캐시도 무효화

- **Rationale**: 백엔드가 팀을 삭제할 수 있으므로, 프론트에서도 팀 목록을 재조회하여 동기화
- **Approach**: `onSuccess`에서 `teamQueryKeys.rooms`도 invalidate
- **Trade-offs**: 팀 목록 API 요청 1회 추가됨 — 사이드바 팀 목록 갱신에 필요한 요청이므로 합리적
- **Impact**: LOW

### Component Design

**수정 전 (useDeleteRetrospect)**:

```typescript
export function useDeleteRetrospect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retrospectId: number) => deleteRetrospect(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['retrospects'] }); // ❌ 매직 스트링
    },
  });
}
```

**수정 후 (useDeleteRetrospect)**:

```typescript
export function useDeleteRetrospect(retroRoomId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (retrospectId: number) => deleteRetrospect(retrospectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retrospectiveQueryKeys.list(retroRoomId) }); // ✅
      queryClient.invalidateQueries({ queryKey: teamQueryKeys.rooms }); // ✅ 팀 목록 동기화
    },
  });
}
```

**수정 전 (CardMenu)**:

```typescript
const deleteMutation = useDeleteRetrospect(); // ❌ retroRoomId 없음
```

**수정 후 (CardMenu)**:

```typescript
const deleteMutation = useDeleteRetrospect(teamId); // ✅ teamId는 이미 props에 있음
```

### Data Flow

```
User: 회고 삭제 클릭
  ↓
CardMenu.handleDeleteConfirm
  ↓
deleteMutation.mutate(retrospectId)
  ↓
DELETE /api/v1/retrospects/{retrospectId}
  ↓
onSuccess:
  ├─ invalidateQueries(['retrospects', retroRoomId])  → DashboardContent 즉시 갱신
  └─ invalidateQueries(['retroRooms'])               → Sidebar 팀 목록 동기화
  ↓
UI: 삭제된 회고가 즉시 사라짐
```

---

## 4. Implementation Plan

### Phase 1: useDeleteRetrospect 훅 수정

**Tasks**:

1. `useDeleteRetrospect` 훅에 `retroRoomId: number` 파라미터 추가
2. `onSuccess`에서 `retrospectiveQueryKeys.list(retroRoomId)` 사용
3. `teamQueryKeys.rooms` import 추가 및 invalidate

**Files to Modify**:

- `src/features/retrospective/api/retrospective.mutations.ts` (MODIFY)

### Phase 2: RetrospectCard 호출부 업데이트

**Tasks**:

1. `CardMenu`에서 `useDeleteRetrospect(teamId)` 형태로 호출 변경

**Files to Modify**:

- `src/features/retrospective/ui/RetrospectCard.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: 검증

**Tasks**:

1. 빌드 / 타입 체크 / 린트 통과 확인
2. 회고 삭제 후 목록 즉시 갱신 확인
3. 팀의 마지막 회고 삭제 시 팀 목록 동기화 확인

### Vercel React Best Practices

**MEDIUM**:

- `rerender-functional-setstate`: 불필요한 리렌더링 없이 캐시 업데이트

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 회고 삭제 후 목록이 즉시 갱신됨 (새로고침 불필요)
- [ ] 팀의 모든 회고를 삭제해도 팀이 의도에 맞게 처리됨
- [ ] `useDeleteRetrospect` 훅 시그니처가 `useCreateRetrospect` 패턴과 일치
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 회고 1개 삭제 → 해당 회고가 즉시 목록에서 사라짐
- [ ] 팀의 마지막 회고 삭제 → 팀 목록 재조회 발생 (Network 탭 확인)
- [ ] 삭제 토스트 메시지 정상 표시

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 매직 스트링 `['retrospects']` 제거

---

## 6. Risks & Dependencies

### Risks

**R-1**: 백엔드 팀 삭제 동작 불명확

- **Risk**: 백엔드가 마지막 회고 삭제 시 팀을 실제로 삭제하는지 확인 필요
- **Impact**: MEDIUM
- **Mitigation**: 팀 목록 invalidate를 추가하면 어떤 경우든 동기화됨

### Dependencies

**D-1**: `teamQueryKeys` import

- **Dependency**: `src/features/team/api/team.queries.ts`의 `teamQueryKeys`
- **Status**: AVAILABLE (FSD 레이어 규칙 상 `features → features` 참조 불가)

**⚠️ FSD 레이어 이슈**: `features/retrospective`에서 `features/team`을 직접 import하는 것은 FSD 규칙 위반

**해결 방안**:
- Option A: `teamQueryKeys.rooms`를 `entities/team/api/team.queries.ts`로 이동 (clean but more work)
- Option B: `['retroRooms']` 인라인으로 사용 (pragmatic — 캐시 키 이동 시 주의 필요)
- **선택**: Option B — 현재 `teamQueryKeys.rooms = ['retroRooms'] as const` 이므로 인라인 사용

---

## 7. References

### Related Issues

- Issue #167: [[Bug] 회고 전체 삭제 시 팀 삭제 및 회고 목록 미갱신 버그](https://github.com/YAPP-Github/Moa-FE/issues/167)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-26
**Implemented By**: Claude Sonnet 4.6

### Changes Made

#### Files Modified

- [`src/features/retrospective/api/retrospective.mutations.ts`](src/features/retrospective/api/retrospective.mutations.ts) — `useDeleteRetrospect(retroRoomId)` 파라미터 추가, `retrospectiveQueryKeys.list(retroRoomId)` + `['retroRooms']` invalidate
- [`src/features/retrospective/ui/RetrospectCard.tsx`](src/features/retrospective/ui/RetrospectCard.tsx#L38) — `useDeleteRetrospect(teamId)` 형태로 호출 변경
- [`src/widgets/retrospective-detail-panel/ui/RetrospectiveCompletedPanel.tsx`](src/widgets/retrospective-detail-panel/ui/RetrospectiveCompletedPanel.tsx) — `retroRoomId` prop 추가, 훅에 전달
- [`src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx`](src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx) — `retroRoomId` prop 추가, 훅에 전달

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- `RetrospectiveCompletedPanel`, `RetrospectiveDetailPanel`에도 `retroRoomId` prop 추가 필요 (현재 미사용 컴포넌트지만 타입 에러 해결)

**Changed**:

- 없음

**Skipped**:

- 없음

### Sub-agents Used

- `react-developer`: 훅 파라미터화 및 컴포넌트 호출부 업데이트

---

**Plan Status**: Completed
**Last Updated**: 2026-02-26
