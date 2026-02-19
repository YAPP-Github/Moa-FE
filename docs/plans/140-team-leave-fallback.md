# Task Plan: 팀 나가기 기능 추가 및 모든 팀을 나갈 경우 fallback 페이지 추가

**Issue**: #140
**Type**: Feature
**Created**: 2026-02-19
**Status**: In Progress

---

## 1. Overview

### Problem Statement

현재 팀 나가기 기능의 UI(`LeaveTeamModal`)와 API(`deleteRetroRoom`)는 구현되어 있으나, 팀을 나간 후의 사용자 경험이 충분히 고려되지 않았다.

- 팀 나가기 후 항상 `/`로 이동하여 MainPage에서 다시 리다이렉트하는 비효율적 플로우
- `NoTeamEmptyState`에 "팀 생성하기"만 있고 "팀 참여하기" CTA가 없음
- 모든 팀을 나간 사용자가 다시 팀에 합류할 수 있는 경로가 부족

### Objectives

1. 팀 나가기 후 남은 팀이 있으면 해당 팀으로 직접 이동 (불필요한 리다이렉트 제거)
2. 모든 팀을 나간 경우 fallback 페이지(`NoTeamEmptyState`)에서 팀 생성/참여 모두 가능하도록 개선
3. 캐시 무효화 및 사이드바 갱신이 정상적으로 동작하도록 보장

### Scope

**In Scope**:

- `DashboardHeader`의 팀 나가기 후 리다이렉트 로직 개선
- `NoTeamEmptyState`에 "팀 참여하기" CTA 추가
- `JoinTeamDialog` 컴포넌트 생성 (기존 `JoinTeamForm` 재사용)

**Out of Scope**:

- 팀 나가기 API 변경 (기존 DELETE 엔드포인트 유지)
- 팀 나가기 확인 모달(LeaveTeamModal) UI 변경

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 나가기 후 스마트 리다이렉트

- 남은 팀이 있으면 → 첫 번째 남은 팀 대시보드로 이동
- 남은 팀이 없으면 → `/`로 이동 (NoTeamEmptyState 표시)

**FR-2**: NoTeamEmptyState에 팀 참여 CTA 추가

- "팀 생성하기" 버튼 유지
- "팀 참여하기" 버튼 추가
- 각 버튼 클릭 시 해당 Dialog 표시

### Technical Requirements

**TR-1**: React Query 캐시 무효화

- `useDeleteRetroRoom` mutation의 기존 캐시 무효화 활용 (이미 구현됨)
- 사이드바의 `useRetroRooms` suspenseQuery가 자동 갱신됨

**TR-2**: FSD 아키텍처 준수

- `JoinTeamDialog`는 `features/team/ui/`에 배치
- 직접 import 사용, barrel export 금지

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: 캐시 기반 스마트 리다이렉트 (mutation 전 캐시 읽기)

- **Rationale**: 팀 나가기 후 `/`로 이동 → MainPage 리다이렉트의 2단계 네비게이션을 1단계로 줄임
- **Approach**: `handleLeaveConfirm`에서 **mutation 호출 전에** `queryClient.getQueryData`로 현재 팀 목록을 읽고, 삭제할 팀을 제외한 나머지를 미리 계산. `onSuccess`에서는 계산된 결과로 네비게이션만 수행
- **Trade-offs**: mutation 전에 캐시를 읽으므로 `invalidateQueries` 타이밍 문제 회피. `mutate` + `onSuccess` 패턴으로 프로젝트 에러 핸들링 규칙(Layer 2 글로벌 핸들러) 준수

**Decision 2**: JoinTeamDialog 분리

- **Rationale**: `CreateTeamDialog`와 동일한 패턴으로 `JoinTeamDialog` 생성. 기존 `JoinTeamForm` 재사용
- **Approach**: Dialog 쉘만 새로 만들고, 내부 폼은 기존 `JoinTeamForm` 사용

### Component Design

**플로우 다이어그램**:

```
팀 나가기 버튼 클릭
    ↓
LeaveTeamModal (확인 체크 + 확인 버튼)
    ↓
deleteRetroRoom.mutate(roomId)
    ↓
mutation 전: queryClient.getQueryData → 남은 팀 미리 계산
    ↓
onSuccess:
    ├─ 남은 팀 > 0 → navigate(/teams/{nextTeamId})
    └─ 남은 팀 = 0 → navigate(/)
    ↓
queryClient.invalidateQueries → 사이드바 자동 갱신
```

### Data Models

기존 타입 활용, 신규 타입 없음:

```typescript
// 기존: features/team/model/schema.ts
type RetroRoomListItem = {
  orderIndex: number;
  retroRoomId: number;
  retroRoomName: string;
};
```

---

## 4. Implementation Plan

### Phase 1: JoinTeamDialog 생성

**Tasks**:

1. `JoinTeamDialog` 생성 — `CreateTeamDialog`와 동일 패턴, `JoinTeamForm` 래핑

**Files to Create/Modify**:

- `src/features/team/ui/JoinTeamDialog.tsx` (CREATE)

**Estimated Effort**: Small

### Phase 2: NoTeamEmptyState 개선

**Tasks**:

1. "팀 참여하기" 버튼 추가
2. `JoinTeamDialog` 연동

**Files to Create/Modify**:

- `src/features/team/ui/NoTeamEmptyState.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 3: 팀 나가기 후 리다이렉트 개선

**Tasks**:

1. `handleLeaveConfirm`에서 queryClient 활용한 스마트 리다이렉트 구현

**Files to Create/Modify**:

- `src/pages/team-dashboard/ui/DashboardHeader.tsx` (MODIFY)

**Dependencies**: Phase 1, 2 완료 불필요 (독립적)

**Estimated Effort**: Small

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: NoTeamEmptyState의 불필요한 리렌더링 방지 (Dialog 상태가 2개로 늘어남)

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 팀 나가기 후 남은 팀이 있으면 해당 팀 대시보드로 이동
- [ ] 팀 나가기 후 남은 팀이 없으면 NoTeamEmptyState 표시
- [ ] NoTeamEmptyState에서 "팀 생성하기" 동작 확인
- [ ] NoTeamEmptyState에서 "팀 참여하기" 동작 확인
- [ ] 사이드바 팀 목록 자동 갱신 확인
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 팀 나가기 확인 모달 정상 표시
- [ ] 체크박스 체크 후 확인 버튼 활성화
- [ ] 삭제 API 호출 성공
- [ ] 리다이렉트 정상 동작 (남은 팀 유/무)

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 레이어 규칙 준수

---

## 6. Risks & Dependencies

### Risks

**R-1**: 캐시 데이터 타이밍

- **Risk**: `onSuccess`에서 `getQueryData` 호출 시 이미 invalidation이 시작되어 stale 상태일 수 있음
- **Impact**: LOW
- **Mitigation**: mutation 호출 전에 캐시 데이터를 미리 읽어 남은 팀을 계산 (해결됨)

### Dependencies

**D-1**: 기존 DELETE API

- **Dependency**: `DELETE /api/v1/retro-rooms/{retroRoomId}` 엔드포인트
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

단일 PR로 배포. 기존 기능의 점진적 개선이므로 feature flag 불필요.

---

## 8. Timeline & Milestones

### Estimated Timeline

- **Phase 1 (JoinTeamDialog)**: ~15분
- **Phase 2 (NoTeamEmptyState)**: ~15분
- **Phase 3 (리다이렉트 개선)**: ~15분
- **검증 & 정리**: ~15분
- **Total**: ~1시간

---

## 9. References

### Related Issues

- Issue #140: [팀 나가기 기능 추가 및 모든 팀을 나갈 경우 fallback 페이지 추가](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/140)

### Documentation

- [CLAUDE.md](../../.claude/CLAUDE.md)
- [FSD 아키텍처](../../.claude/rules/fsd.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-19
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Files Created

- `src/features/team/ui/JoinTeamDialog.tsx` — JoinTeamForm을 래핑하는 Dialog 컴포넌트 (CreateTeamDialog 패턴)
- `src/shared/ui/error-boundary/ApiErrorBoundary.tsx` — 404 → redirect, 기타 에러 → fallback 처리하는 재사용 Error Boundary

#### Files Modified

- `src/features/team/ui/NoTeamEmptyState.tsx` — "팀 참여하기" 버튼 및 JoinTeamDialog 추가
- `src/pages/team-dashboard/ui/DashboardHeader.tsx` — 팀 삭제 후 스마트 리다이렉트 (mutation 전 캐시 읽기 → 마지막 남은 팀으로 이동)
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` — currentTeam 검증 + Suspense + ApiErrorBoundary 래핑
- `src/pages/team-dashboard/ui/DashboardContent.tsx` — useSuspenseQuery 기반으로 단순화 (수동 에러/로딩 핸들링 제거)
- `src/pages/main/ui/MainPage.tsx` — 리다이렉트 대상을 첫 번째 팀 → 마지막 팀으로 변경
- `src/features/team/ui/CreateTeamForm.tsx` — `await invalidateQueries` 후 생성된 팀으로 navigate
- `src/features/team/ui/JoinTeamForm.tsx` — `await invalidateQueries` 후 참여한 팀으로 navigate
- `src/features/team/api/team.queries.ts` — `queryOptions` 헬퍼 도입으로 type-safe `getQueryData` 지원, `useSuspenseQuery` 전환
- `src/features/retrospective/api/retrospective.queries.ts` — `useRetrospects`를 `useSuspenseQuery`로 전환
- `src/features/team/api/team.api.ts` — `deleteRetroRoom`에서 Zod 검증 제거 (DELETE 응답 본문 불필요)
- `src/features/team/model/schema.ts` — `deleteRetroRoomResponseSchema` 제거

#### Key Implementation Details

- **캐시 전략 이원화**: Create/Join은 `await invalidateQueries` 후 navigate (서버가 Single Source of Truth), Delete는 mutation 전 캐시 읽기 후 즉시 navigate (현재 페이지가 무효화되므로 refetch 전 이동 필수)
- **Suspense + Error Boundary 패턴**: `useRetrospects`를 `useSuspenseQuery`로 전환, `ApiErrorBoundary`로 404 자동 리다이렉트
- **`queryOptions` 헬퍼**: `retroRoomsQueryOptions`로 `getQueryData` 타입 추론 자동화
- **DELETE Zod 검증 제거**: DELETE 응답 본문 파싱 불필요, `ZodError` 토스트 문제 해결

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- `ApiErrorBoundary` 생성 — 404 에러 핸들링을 위한 재사용 Error Boundary (계획에 없던 추가)
- `useSuspenseQuery` 전환 — DashboardContent의 에러 핸들링을 Error Boundary 기반으로 변경
- `queryOptions` 헬퍼 도입 — type-safe `getQueryData` 지원
- Create/Join 후 해당 팀으로 navigate — 기존에는 첫 번째 팀으로 이동하던 문제 수정
- DELETE API Zod 검증 제거 — 응답 본문 파싱 시 ZodError 발생 문제 수정

**Changed**:

- 캐시 전략: 원래 계획(mutation 전 캐시 읽기)에서 Create/Join은 `await invalidateQueries` 패턴으로 변경, Delete만 원래 계획 유지
- 리다이렉트 대상: 첫 번째 팀 → 마지막 팀으로 변경

**Skipped**:

- 없음

### Performance Impact

- Bundle size: +1.5KB (ApiErrorBoundary, JoinTeamDialog)
- 런타임 영향 없음

### Follow-up Tasks

- 없음

---

**Plan Status**: Completed
**Last Updated**: 2026-02-19
