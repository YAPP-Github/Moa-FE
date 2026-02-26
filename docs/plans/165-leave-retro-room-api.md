# Task Plan: 팀 나가기 API 전환 및 OWNER 역할 제거

**Issue**: #165
**Type**: Feature
**Created**: 2026-02-26
**Status**: In Progress

---

## 1. Overview

### Problem Statement

백엔드 API 변경으로 기존 팀 탈퇴 API(`DELETE /api/v1/retro-rooms/{retroRoomId}`)가 제거되고, 새로운 팀 나가기 API(`POST /api/v1/retro-rooms/{retroRoomId}/leave`)가 추가됐다.
또한 OWNER 역할이 없어짐에 따라 모든 팀원이 팀 이름을 수정할 수 있게 됐다.
기존 코드는 삭제 API 기반으로 동작 중이므로, 프론트엔드를 새 API에 맞게 전환하지 않으면 팀 나가기 기능이 동작하지 않는다.

### Objectives

1. `POST /api/v1/retro-rooms/{retroRoomId}/leave` API 연동
2. 기존 DELETE 기반 팀 삭제 로직을 나가기 로직으로 교체
3. OWNER role 관련 코드 및 목 데이터 정리

### Scope

**In Scope**:

- `team.api.ts` — `leaveRetroRoom` 함수 추가, `deleteRetroRoom` 제거
- `team.mutations.ts` — `useLeaveRetroRoom` 추가, `useDeleteRetroRoom` 제거
- `team/model/schema.ts` — 나가기 응답 스키마 추가
- `DashboardHeader.tsx` — 새 mutation 사용
- `mocks/handlers/team.ts` — DELETE → POST /leave 핸들러 교체
- `mocks/fixtures/team.ts` — OWNER role → MEMBER 변경

**Out of Scope**:

- LeaveTeamModal UI 변경 (현재 UI 그대로)
- 팀 이름 수정 UI 변경 (이미 누구나 수정 가능한 구조)
- 오류 에러 메시지 커스텀 처리 (글로벌 에러 핸들러 위임)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 나가기 API 연동

- `POST /api/v1/retro-rooms/{retroRoomId}/leave` 호출
- 성공 시 `{ leftAt: string, retroRoomId: number }` 응답 처리
- 성공 후 팀 목록 쿼리 캐시 무효화 → 남은 팀으로 네비게이션

**FR-2**: 오류 처리

- 400: 진행 중인 회고가 있어 탈퇴 불가 → 글로벌 토스트 (서버 메시지 그대로)
- 403: 해당 회고방의 멤버가 아님 → 글로벌 토스트
- 404: 회고방 없음 → 글로벌 토스트

**FR-3**: MSW 목 데이터 업데이트

- DELETE 핸들러 제거, POST /leave 핸들러 추가
- OWNER role → MEMBER로 통일

### Technical Requirements

**TR-1**: API 컨벤션 준수

- `customInstance` 사용
- Zod 스키마로 응답 런타임 검증 (`leaveRetroRoomResponseSchema`)
- `baseResponseSchema` 래퍼 활용

**TR-2**: mutation 패턴 유지

- `onSuccess`에서 `teamQueryKeys.rooms` 캐시 무효화
- 에러 처리는 Layer 2 (글로벌 MutationCache)에 위임

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/team/
│   ├── api/
│   │   ├── team.api.ts         (MODIFY - deleteRetroRoom 제거, leaveRetroRoom 추가)
│   │   └── team.mutations.ts   (MODIFY - useDeleteRetroRoom 제거, useLeaveRetroRoom 추가)
│   └── model/
│       └── schema.ts           (MODIFY - leaveRetroRoomResponseSchema 추가)
├── pages/team-dashboard/ui/
│   └── DashboardHeader.tsx     (MODIFY - useLeaveRetroRoom 사용)
└── shared/api/mocks/
    ├── handlers/team.ts        (MODIFY - DELETE → POST /leave)
    └── fixtures/team.ts        (MODIFY - OWNER → MEMBER)
```

### Design Decisions

**Decision 1**: 에러 처리를 글로벌에 위임

- **Rationale**: 400/403/404 에러 모두 서버 메시지 토스트로 충분. 별도 UI 분기 불필요
- **Approach**: `DashboardHeader.tsx`에서 `mutateAsync` 호출 시 catch 블록 없이 글로벌 처리
- **Impact**: LOW — 기존 패턴과 동일

**Decision 2**: `deleteRetroRoom` 완전 제거

- **Rationale**: 백엔드에서 API가 제거됐으므로 사용 시 404 오류 발생
- **Approach**: 관련 함수, mutation hook, import를 모두 제거
- **Impact**: MEDIUM — `DashboardHeader.tsx`에서 참조 변경 필요

### API Design

**Endpoint**: `POST /api/v1/retro-rooms/{retroRoomId}/leave`

**Response (200)**:
```json
{
  "code": "string",
  "isSuccess": true,
  "message": "string",
  "result": {
    "leftAt": "string",
    "retroRoomId": 0
  }
}
```

**Error Responses**: 400, 401, 403, 404

### Data Models

```typescript
// leaveRetroRoomResponseSchema result
const leaveRetroRoomResultSchema = z.object({
  leftAt: z.string(),
  retroRoomId: z.number(),
});
```

---

## 4. Implementation Plan

### Phase 1: 스키마 및 API 함수 변경

**Tasks**:

1. `schema.ts`에 `leaveRetroRoomResponseSchema` 추가
2. `team.api.ts`에서 `deleteRetroRoom` 제거, `leaveRetroRoom` 추가

**Files to Modify**:

- `src/features/team/model/schema.ts` (MODIFY)
- `src/features/team/api/team.api.ts` (MODIFY)

### Phase 2: Mutation Hook 및 UI 변경

**Tasks**:

1. `team.mutations.ts`에서 `useDeleteRetroRoom` 제거, `useLeaveRetroRoom` 추가
2. `DashboardHeader.tsx`에서 새 mutation hook 사용

**Files to Modify**:

- `src/features/team/api/team.mutations.ts` (MODIFY)
- `src/pages/team-dashboard/ui/DashboardHeader.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: MSW 목 업데이트

**Tasks**:

1. `handlers/team.ts` — DELETE 핸들러 → POST /leave 핸들러로 교체
2. `fixtures/team.ts` — OWNER role → MEMBER 변경

**Files to Modify**:

- `src/shared/api/mocks/handlers/team.ts` (MODIFY)
- `src/shared/api/mocks/fixtures/team.ts` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 유지 (barrel export 사용 금지)

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] `POST /api/v1/retro-rooms/{retroRoomId}/leave` API 연동 완료
- [ ] 기존 DELETE 기반 삭제 로직 제거
- [ ] MSW 목 핸들러 업데이트 (POST /leave)
- [ ] 멤버 role에서 OWNER 제거 (MEMBER로 통일)
- [ ] 팀 이름 수정이 모든 멤버에게 허용됨
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 팀 나가기 버튼 클릭 → 모달 → 확인 → POST /leave 호출
- [ ] 나가기 성공 후 남은 팀으로 이동 (없으면 홈)
- [ ] 진행 중인 회고 있을 때 400 → 글로벌 토스트 표시

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] `deleteRetroRoom` 참조 완전 제거

---

## 6. Risks & Dependencies

### Risks

**R-1**: 마지막 멤버 탈퇴 시 자동 삭제 응답

- **Risk**: 마지막 멤버가 나가면 서버에서 회고방이 자동 삭제됨. 응답이 다를 수 있음
- **Impact**: LOW
- **Mitigation**: 현재 탈퇴 후 네비게이션 로직이 빈 팀 목록 처리를 이미 포함함

### Dependencies

**D-1**: 백엔드 API

- **Dependency**: `POST /api/v1/retro-rooms/{retroRoomId}/leave` 배포 완료
- **Status**: AVAILABLE (이슈 배경에 명시됨)

---

## 7. References

### Related Issues

- Issue #165: [[Feature] 팀 나가기 API 전환 및 OWNER 역할 제거](https://github.com/YAPP-Github/Moa-FE/issues/165)
- Issue #140: 팀 나가기 fallback (관련 선행 작업)

### Documentation

- [API 관리 규칙](../../.claude/rules/api.md)
- [에러 핸들링 규칙](../../.claude/rules/error-handling.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-26
**Implemented By**: Claude Sonnet 4.6

### Changes Made

#### Files Modified

- [`src/features/team/model/schema.ts`](../../src/features/team/model/schema.ts) — `leaveRetroRoomResponseSchema` 추가 (`leftAt`, `retroRoomId`)
- [`src/features/team/api/team.api.ts`](../../src/features/team/api/team.api.ts) — `deleteRetroRoom` 제거, `leaveRetroRoom` 추가 (`POST /api/v1/retro-rooms/{id}/leave`)
- [`src/features/team/api/team.mutations.ts`](../../src/features/team/api/team.mutations.ts) — `useDeleteRetroRoom` 제거, `useLeaveRetroRoom` 추가
- [`src/pages/team-dashboard/ui/DashboardHeader.tsx`](../../src/pages/team-dashboard/ui/DashboardHeader.tsx) — `useLeaveRetroRoom` 사용, 나가기 성공 토스트 추가
- [`src/features/team/ui/CreateTeamForm.tsx`](../../src/features/team/ui/CreateTeamForm.tsx) — 토스트 메시지 `'팀 생성이 완료되었어요!'`로 수정
- [`src/features/team/ui/JoinTeamForm.tsx`](../../src/features/team/ui/JoinTeamForm.tsx) — 토스트 메시지 `'팀 참여가 완료되었어요!'`로 수정
- [`src/shared/api/mocks/handlers/team.ts`](../../src/shared/api/mocks/handlers/team.ts) — DELETE 핸들러 → `POST /leave` 핸들러로 교체, 응답 `leftAt` 필드 반영
- [`src/shared/api/mocks/fixtures/team.ts`](../../src/shared/api/mocks/fixtures/team.ts) — `role: 'OWNER'` → `role: 'MEMBER'` 전체 교체

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- 팀 생성/참여 성공 토스트 메시지 문구 수정 (`'새로운 팀이 생성되었습니다.'` → `'팀 생성이 완료되었어요!'`, `'팀에 입장했습니다.'` → `'팀 참여가 완료되었어요!'`) — 사용자 요청으로 추가

**Changed**:

- 없음

**Skipped**:

- 없음

### Performance Impact

- Bundle size: 변화 없음 (로직 교체만, 새 의존성 없음)
- Runtime: 영향 없음

---

**Plan Status**: Completed
**Last Updated**: 2026-02-26
