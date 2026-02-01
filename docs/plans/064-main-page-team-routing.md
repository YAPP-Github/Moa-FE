# Task Plan: 로그인 후 메인 페이지 팀 유무에 따른 조건부 리다이렉팅 구현

**Issue**: #64
**Type**: Feature
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

로그인 후 메인 페이지에 진입했을 때, 사용자의 팀(회고방) 소속 여부에 따라 다른 페이지로 리다이렉트해야 합니다.

- 현재 `MainPage.tsx`는 `NoTeamEmptyState` 컴포넌트만 표시하고 있으며, TODO 주석으로 조건부 렌더링 구현이 필요함을 명시
- 팀이 있는 사용자는 `/teams/:teamId` (DashboardLayout)로, 팀이 없는 사용자는 `/` (PlainLayout)에서 팀 생성 유도 화면 표시
- 레이아웃이 다르므로 조건부 렌더링보다 **조건부 리다이렉팅** 전략이 더 적합

### Objectives

1. 서버 API를 통해 사용자의 팀 목록 조회
2. 팀 유무에 따른 조건부 리다이렉팅 구현
3. 로딩/에러 상태 처리
4. `/teams/:teamId` 라우트 및 페이지 생성

### Scope

**In Scope**:

- 팀 목록 조회 API 연동 (React Query)
- 팀 유무에 따른 조건부 리다이렉팅
- `/teams/:teamId` 라우트 및 TeamDashboardPage 생성
- 로딩/에러 상태 처리

**Out of Scope**:

- 회고 목록 상세 기능 (별도 이슈로 진행)
- 팀 선택/전환 기능
- 사이드바 팀 목록 표시 (별도 이슈로 진행)

### User Context

> "로그인 후 메인 페이지 구현 - 팀이 있을 경우 / 팀이 없을 경우 다르게 라우팅 해야 함"

**핵심 요구사항**:

1. 팀이 없으면 `/`에서 `NoTeamEmptyState` 표시 (PlainLayout)
2. 팀이 있으면 `/teams/:teamId`로 리다이렉트 (DashboardLayout)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 목록 조회

- 로그인한 사용자의 팀(회고방) 목록을 API로 조회
- 사용 API: `getApi().listRetroRooms()`
- 응답 타입: `RetroRoomListResponse { result: RetroRoomListItem[] }`

**FR-2**: 조건부 리다이렉팅

- `result.length === 0`: 팀이 없음 → `/`에서 `NoTeamEmptyState` 표시
- `result.length > 0`: 팀이 있음 → `/teams/{firstTeamId}`로 리다이렉트

**FR-3**: 로딩 상태 처리

- API 호출 중 간단한 스피너 표시 (`/` 페이지 내)
- 별도 로딩 페이지 불필요 (API 응답이 빠름)

**FR-4**: 에러 상태 처리

- API 호출 실패 시 에러 메시지 표시
- 재시도 옵션 제공

**FR-5**: TeamDashboardPage

- `/teams/:teamId` 라우트에서 팀 대시보드 표시
- DashboardLayout 사용 (사이드바 포함)

### Technical Requirements

**TR-1**: React Query 사용

- `useQuery` 훅으로 팀 목록 조회
- 쿼리 키: `['retroRooms']` (기존 mutation invalidation과 일치)
- `staleTime` 설정으로 불필요한 재요청 방지

**TR-2**: FSD 아키텍처 준수

- API 훅: `src/features/team/api/team.queries.ts` (CREATE)
- 메인 페이지: `src/pages/main/ui/MainPage.tsx` (MODIFY)
- 팀 대시보드 페이지: `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (CREATE)

**TR-3**: 타입 안전성

- Orval 생성 타입 사용 (`RetroRoomListItem`, `RetroRoomListResponse`)
- 직접 import 방식 사용

**TR-4**: React Router

- `useNavigate` 훅으로 리다이렉트
- `replace: true` 옵션으로 히스토리 스택 관리

### Non-Functional Requirements

**NFR-1**: 성능

- 리다이렉트 시 깜빡임 최소화
- 로딩 UI는 최소한으로 유지

**NFR-2**: 사용자 경험

- 팀 생성 성공 후 자동으로 `/teams/:teamId`로 이동
- URL이 상태를 반영 (북마크/공유 가능)

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── team/
│       ├── api/
│       │   ├── team.mutations.ts  (기존)
│       │   └── team.queries.ts    (CREATE)
│       └── ui/
│           └── NoTeamEmptyState.tsx  (MODIFY - onSuccess 콜백)
├── pages/
│   ├── main/
│   │   └── ui/
│   │       └── MainPage.tsx          (MODIFY - 리다이렉트 로직)
│   └── team-dashboard/
│       └── ui/
│           └── TeamDashboardPage.tsx (CREATE)
└── app/
    └── App.tsx                       (MODIFY - 라우트 추가)
```

### URL Structure

```
/                    # 진입점 (리다이렉트 허브) - PlainLayout
/teams/:teamId       # 팀 대시보드 - DashboardLayout
/signin              # 로그인 (기존)
```

### Design Decisions

**Decision 1**: 조건부 리다이렉팅 전략

- **Rationale**: 레이아웃이 완전히 다르므로 (PlainLayout vs DashboardLayout) 별도 페이지로 분리하는 것이 적합
- **Approach**: `/`에서 팀 목록 조회 후 팀 유무에 따라 리다이렉트
- **Trade-offs**:
  - 장점: 각 페이지가 자신의 레이아웃에만 집중, URL이 상태 반영, FSD 원칙 준수
  - 단점: 추가 라우트 필요
- **Alternatives Considered**: 조건부 렌더링 (한 페이지에서 레이아웃 분기 - 복잡도 증가)
- **Impact**: HIGH

**Decision 2**: `/teams/:teamId` URL 구조

- **Rationale**: 여러 팀 지원 시 확장성, URL로 상태 표현, 공유/북마크 가능
- **Implementation**: 첫 번째 팀으로 리다이렉트, 나중에 팀 전환 기능 추가 가능
- **Benefit**: 자연스러운 URL 구조, 나중에 `/teams/:teamId/retrospectives/:retroId` 확장 가능

### Component Design

**MainPage 흐름 (리다이렉트 허브)**:

```typescript
function MainPage() {
  const { data, isLoading, isError } = useRetroRooms();
  const navigate = useNavigate();

  // 로딩 중: 간단한 스피너
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // 에러 처리
  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  // 팀 있음: 리다이렉트
  if (data?.result.length > 0) {
    navigate(`/teams/${data.result[0].retroRoomId}`, { replace: true });
    return null;
  }

  // 팀 없음: 팀 생성 유도
  return <NoTeamEmptyState />;
}
```

**App.tsx 라우트 구조**:

```typescript
<Routes>
  <Route path="/signin" element={<SigninPage />} />
  <Route
    path="/"
    element={
      <PlainLayout>
        <MainPage />
      </PlainLayout>
    }
  />
  <Route
    path="/teams/:teamId"
    element={
      <DashboardLayout>
        <TeamDashboardPage />
      </DashboardLayout>
    }
  />
</Routes>
```

### Data Models

```typescript
// 기존 Orval 생성 타입 사용
import type {
  RetroRoomListItem,
  RetroRoomListResponse,
} from "@/shared/api/generated/index";

// RetroRoomListItem = { orderIndex, retroRoomId, retroRoomName }
// RetroRoomListResponse = { result: RetroRoomListItem[] }
```

### API Design

**Endpoint**: `GET /api/retro-rooms` (listRetroRooms)

**Response**:

```json
{
  "result": [
    {
      "retroRoomId": 1,
      "retroRoomName": "팀 이름",
      "orderIndex": 0
    }
  ]
}
```

---

## 4. Implementation Plan

### Phase 1: API 연동

**Tasks**:

1. `useRetroRooms` query hook 생성
2. 쿼리 키 및 옵션 설정

**Files to Create/Modify**:

- `src/features/team/api/team.queries.ts` (CREATE)

**Estimated Effort**: Small

### Phase 2: 라우팅 및 리다이렉트

**Tasks**:

1. `/teams/:teamId` 라우트 추가 (App.tsx)
2. TeamDashboardPage 생성 (기본 UI)
3. MainPage 리다이렉트 로직 구현
4. 로딩/에러 상태 처리

**Files to Create/Modify**:

- `src/app/App.tsx` (MODIFY - 라우트 추가)
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (CREATE)
- `src/pages/main/ui/MainPage.tsx` (MODIFY - 리다이렉트 로직)

**Dependencies**: Phase 1 완료 필요

### Phase 3: 팀 생성 연동

**Tasks**:

1. 팀 생성 성공 후 `/teams/:teamId`로 이동
2. NoTeamEmptyState onSuccess 콜백 수정

**Files to Create/Modify**:

- `src/features/team/ui/NoTeamEmptyState.tsx` (MODIFY)
- `src/features/team/ui/CreateTeamForm.tsx` (MODIFY)

### Vercel React Best Practices

**HIGH**:

- `server-cache-react`: React Query 캐싱 활용
- `async-error-boundaries`: 에러 바운더리로 에러 상태 처리

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지
- `rerender-functional-setstate`: 함수형 상태 업데이트

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 조건부 렌더링 검증

- 팀 목록이 비어있을 때 NoTeamEmptyState 렌더링
- 팀 목록이 있을 때 TeamDashboardContent 렌더링
- 로딩 중 로딩 UI 표시
- 에러 시 에러 UI 표시

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] 팀 목록 조회 API 연동 (useRetroRooms hook)
- [ ] 팀이 없을 경우 `/`에서 NoTeamEmptyState 표시
- [ ] 팀이 있을 경우 `/teams/:teamId`로 리다이렉트
- [ ] `/teams/:teamId` 라우트 및 TeamDashboardPage 생성
- [ ] 로딩 상태 처리 (간단한 스피너)
- [ ] 에러 상태 처리
- [ ] 팀 생성 성공 후 `/teams/:teamId`로 이동
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] `/` 진입 시 팀 목록 API 호출
- [ ] 팀이 없으면 `/`에서 NoTeamEmptyState 표시
- [ ] 팀이 있으면 `/teams/:teamId`로 리다이렉트
- [ ] `/teams/:teamId`에서 TeamDashboardPage 표시 (DashboardLayout)
- [ ] 팀 생성 성공 후 `/teams/:teamId`로 이동

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 직접 import 방식 사용 (barrel export 미사용)
- [ ] FSD 아키텍처 준수

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 응답 지연

- **Risk**: 팀 목록 조회 API 응답이 느릴 경우 UX 저하
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: 로딩 skeleton 표시, staleTime 설정
- **Status**: 모니터링

**R-2**: 인증 토큰 만료

- **Risk**: 토큰 만료 시 API 호출 실패
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: Axios interceptor에서 토큰 갱신 처리 (기존 구현 확인 필요)
- **Status**: 기존 구현 활용

### Dependencies

**D-1**: listRetroRooms API

- **Dependency**: 백엔드 API 정상 동작
- **Required For**: 팀 목록 조회
- **Status**: AVAILABLE (Orval로 이미 생성됨)
- **Owner**: Backend

**D-2**: 인증 시스템

- **Dependency**: 로그인 상태 및 토큰 관리
- **Required For**: API 호출 시 Authorization 헤더
- **Status**: AVAILABLE (기존 구현)
- **Owner**: Frontend

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Phase-based Rollout**:

1. Phase 1: 개발 환경에서 테스트
2. Phase 2: PR 리뷰 후 main 브랜치 머지
3. Phase 3: Vercel 프리뷰 배포에서 검증

**Rollback Plan**:

- 이슈 발생 시 이전 커밋으로 revert
- 기존 NoTeamEmptyState만 표시하는 상태로 복구

### Success Metrics

**SM-1**: 정상 동작

- **Metric**: 팀 유무에 따른 올바른 화면 표시
- **Target**: 100% 정확도
- **Measurement**: 수동 테스트

**SM-2**: 성능

- **Metric**: API 호출 후 화면 전환 시간
- **Target**: 1초 이내
- **Measurement**: 개발자 도구 Network 탭

---

## 8. Timeline & Milestones

### Milestones

**M1**: API 연동 완료

- useRetroRooms hook 구현
- 테스트 통과
- **Status**: NOT_STARTED

**M2**: 조건부 렌더링 구현

- MainPage 수정
- App.tsx 레이아웃 분기
- **Status**: NOT_STARTED

**M3**: 품질 검증 완료

- 빌드/타입체크/린트 통과
- 수동 테스트 완료
- **Status**: NOT_STARTED

### Estimated Timeline

- **Setup (Phase 1)**: 30분
- **Core Implementation (Phase 2)**: 1-2시간
- **Polish (Phase 3)**: 30분
- **Total**: 2-3시간

---

## 9. References

### Related Issues

- Issue #64: [로그인 후 메인 페이지 팀 유무에 따른 조건부 라우팅 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/64)
- Issue #60: 새 팀 생성 기능 (관련)
- Issue #62: 소셜 로그인 기능 (관련)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Orval Documentation](https://orval.dev/)

### Key Files

- `src/shared/api/generated/index.ts` - Orval 생성 API (listRetroRooms, RetroRoomListItem)
- `src/features/team/api/team.mutations.ts` - 팀 관련 mutation hooks
- `src/features/team/ui/NoTeamEmptyState.tsx` - 팀 없음 상태 컴포넌트
- `src/widgets/layout/ui/DashboardLayout.tsx` - 대시보드 레이아웃
- `src/app/App.tsx` - 라우팅 설정

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-01
**Next Action**: 사용자 승인 후 구현 시작
