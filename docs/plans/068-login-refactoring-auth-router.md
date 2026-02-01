# Task Plan: 로그인 리팩토링 및 인증 라우터 구현

**Issue**: #68
**Type**: Refactor
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 인증 시스템에 다음과 같은 문제가 있습니다:

- 라우터 가드가 없어 인증되지 않은 사용자가 보호된 라우트(`/`, `/teams/:teamId`)에 직접 접근 가능
- 이미 로그인된 사용자가 `/signin`에 접근해도 리다이렉트되지 않음
- 회원가입/로그인 로직이 `SigninPage.tsx`에 집중되어 있어 복잡하고 유지보수 어려움
- OAuth 콜백 처리, 회원가입 플로우, 팀 생성/가입 로직이 한 컴포넌트에 혼재

### Objectives

1. PrivateRoute/PublicRoute 컴포넌트를 구현하여 인증 기반 라우팅 제어
2. 회원가입/로그인 로직을 분리하여 코드 가독성 및 유지보수성 향상
3. 인증 상태 초기화 로직을 앱 시작점에서 처리

### Scope

**In Scope**:

- PrivateRoute 컴포넌트 구현 (인증되지 않은 사용자 → `/signin` 리다이렉트)
- PublicRoute 컴포넌트 구현 (인증된 사용자 → `/` 리다이렉트)
- `App.tsx` 라우팅 구조 개선
- 인증 초기화 로직 정리
- SigninPage 로직 분리 및 정리

**Out of Scope**:

- 토큰 새로고침 로직 (별도 이슈로 분리)
- 테스트용 이메일 로그인 삭제 (유지)
- 로그아웃 UI 추가 (별도 이슈)

---

## 2. Requirements

### Functional Requirements

**FR-1**: PrivateRoute 구현

- 인증되지 않은 사용자가 보호된 라우트 접근 시 `/signin`으로 리다이렉트
- 인증 로딩 중에는 로딩 UI 표시
- 적용 대상: `/`, `/teams/:teamId`

**FR-2**: PublicRoute 구현

- 이미 로그인된 사용자가 `/signin` 접근 시 `/`로 리다이렉트
- OAuth 콜백 처리 중에는 리다이렉트하지 않음

**FR-3**: 인증 초기화

- 앱 시작 시 localStorage의 토큰 유효성 확인
- `isLoading` 상태 동안 라우트 접근 지연

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 라우트 가드 컴포넌트: `src/features/auth/ui/`
- 인증 훅: `src/features/auth/lib/` 또는 기존 store 활용

**TR-2**: React Router v7 호환

- `<Navigate>` 컴포넌트 사용
- `useLocation` 훅으로 현재 경로 추적

### Non-Functional Requirements

**NFR-1**: 코드 가독성

- 단일 책임 원칙 적용
- 컴포넌트별 역할 명확화

**NFR-2**: 사용자 경험

- 인증 로딩 중 깜빡임 없는 UI
- 빠른 리다이렉트 처리

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── app/
│   └── App.tsx                    # 라우팅 구조 개선
├── features/
│   └── auth/
│       ├── ui/
│       │   ├── PrivateRoute.tsx   # (CREATE) 인증 필요 라우트 가드
│       │   ├── PublicRoute.tsx    # (CREATE) 비인증 전용 라우트 가드
│       │   ├── AuthProvider.tsx   # (CREATE) 인증 초기화 Provider
│       │   └── ... (기존 파일)
│       ├── lib/
│       │   ├── oauth.ts           # OAuth 로직 (기존)
│       │   └── token.ts           # 토큰 관리 (기존)
│       └── model/
│           └── store.ts           # Zustand 스토어 (수정)
├── pages/
│   └── signin/
│       └── ui/
│           └── SigninPage.tsx     # 로직 분리 및 정리
└── widgets/
    └── layout/
        └── ui/
            └── DashboardLayout.tsx
```

### Design Decisions

**Decision 1**: 클라이언트 사이드 라우트 가드 사용

- **Rationale**: Vite SPA 환경에서 서버 사이드 미들웨어 불가능
- **Approach**: `PrivateRoute`, `PublicRoute` 래퍼 컴포넌트 사용
- **Trade-offs**: 초기 로딩 시 인증 체크 필요, 서버리스 환경에 적합
- **Impact**: MEDIUM

**Decision 2**: AuthProvider로 초기화 분리

- **Rationale**: 인증 초기화를 앱 루트에서 한 번만 실행
- **Approach**: Provider 패턴으로 `useAuthStore.initialize()` 호출
- **Benefit**: 여러 컴포넌트에서 중복 초기화 방지

**Decision 3**: OAuth 콜백 상태 체크

- **Rationale**: OAuth 리다이렉트 시 URL에 `code` 파라미터가 있으면 처리 중
- **Approach**: `PublicRoute`에서 OAuth 콜백 감지 시 리다이렉트 스킵
- **Benefit**: OAuth 플로우 중단 방지

### Component Design

**PrivateRoute**:

```typescript
interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
```

**PublicRoute**:

```typescript
interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const isOAuthCallback = window.location.search.includes("code=");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // OAuth 콜백 중이면 리다이렉트하지 않음
  if (isAuthenticated && !isOAuthCallback) {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

**AuthProvider**:

```typescript
function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isLoading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return children;
}
```

### Flow Diagram

```
App Start
    ↓
AuthProvider (initialize)
    ↓
Check localStorage tokens
    ↓
Set isAuthenticated / isLoading
    ↓
Route Rendering
    ↓
┌─────────────────────────────────────┐
│  /signin (PublicRoute)              │
│  ├─ isAuthenticated? → Redirect /   │
│  └─ else → Show SigninPage          │
├─────────────────────────────────────┤
│  / or /teams/:id (PrivateRoute)     │
│  ├─ !isAuthenticated? → Redirect /signin │
│  └─ else → Show Protected Content   │
└─────────────────────────────────────┘
```

---

## 4. Implementation Plan

### Phase 1: 인증 라우트 가드 구현

**Tasks**:

1. `PrivateRoute.tsx` 생성
2. `PublicRoute.tsx` 생성
3. `AuthProvider.tsx` 생성
4. `App.tsx`에 라우트 가드 적용

**Files to Create/Modify**:

- `src/features/auth/ui/PrivateRoute.tsx` (CREATE)
- `src/features/auth/ui/PublicRoute.tsx` (CREATE)
- `src/features/auth/ui/AuthProvider.tsx` (CREATE)
- `src/app/App.tsx` (MODIFY)
- `src/main.tsx` (MODIFY) - AuthProvider 적용

### Phase 2: SigninPage 로직 정리

**Tasks**:

1. OAuth 콜백 처리 로직을 커스텀 훅으로 분리
2. 회원가입 제출 로직 정리
3. 불필요한 상태 및 중복 코드 제거

**Files to Create/Modify**:

- `src/features/auth/lib/useOAuthCallback.ts` (CREATE) - OAuth 콜백 처리 훅
- `src/pages/signin/ui/SigninPage.tsx` (MODIFY)

### Phase 3: 품질 검증 및 정리

**Tasks**:

1. 빌드 및 타입 체크
2. 린트 통과 확인
3. 수동 테스트 (인증/비인증 라우팅)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (FSD 준수)

**HIGH**:

- `server-serialization`: 클라이언트 전용 코드 분리 (`'use client'` 불필요, Vite SPA)

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 최적화
- `rerender-memo`: 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 타입: Manual E2E
- 테스트 케이스:
  - 비로그인 상태에서 `/` 접근 → `/signin` 리다이렉트
  - 비로그인 상태에서 `/teams/1` 접근 → `/signin` 리다이렉트
  - 로그인 상태에서 `/signin` 접근 → `/` 리다이렉트
  - OAuth 콜백 중 리다이렉트 안됨
  - 로그인 후 정상 페이지 접근

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] PrivateRoute 컴포넌트 구현
- [x] PublicRoute 컴포넌트 구현
- [x] 보호된 라우트에 인증 가드 적용 (`/`, `/teams/:teamId`)
- [x] 로그인된 사용자의 `/signin` 접근 시 리다이렉트
- [x] 회원가입/로그인 로직 정리
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 비인증 사용자 → 보호 라우트 접근 불가
- [ ] 인증 사용자 → `/signin` 접근 시 메인으로 리다이렉트
- [ ] OAuth 플로우 정상 동작
- [ ] 테스트용 이메일 로그인 정상 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 준수

---

## 6. Risks & Dependencies

### Risks

**R-1**: OAuth 콜백 중 리다이렉트 충돌

- **Risk**: PublicRoute가 OAuth 콜백을 감지하지 못하고 리다이렉트할 수 있음
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**: URL 파라미터 `code` 존재 여부로 OAuth 콜백 상태 판단

**R-2**: 인증 상태 초기화 타이밍

- **Risk**: `isLoading` 동안 잘못된 리다이렉트 발생 가능
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: AuthProvider에서 초기화 완료 전까지 전체 로딩 UI 표시

### Dependencies

**D-1**: Zustand AuthStore

- **Dependency**: 기존 `useAuthStore` 구조 유지
- **Required For**: 모든 라우트 가드 컴포넌트
- **Status**: AVAILABLE

**D-2**: React Router v7

- **Dependency**: `Navigate`, `useLocation` 컴포넌트/훅
- **Required For**: 리다이렉트 구현
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 개발 브랜치에서 구현 및 테스트
2. PR 생성 및 코드 리뷰
3. main 브랜치 머지 후 Vercel 자동 배포

**Rollback Plan**:

- 문제 발생 시 이전 커밋으로 revert
- 라우트 가드 제거 후 재배포

### Success Metrics

**SM-1**: 인증 라우팅 정상 동작

- **Metric**: 비인증 사용자 보호 라우트 접근 차단
- **Target**: 100% 차단
- **Measurement**: 수동 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: 라우트 가드 구현

- PrivateRoute, PublicRoute, AuthProvider 완성
- App.tsx 적용
- **Status**: NOT_STARTED

**M2**: SigninPage 리팩토링

- OAuth 콜백 훅 분리
- 로직 정리
- **Status**: NOT_STARTED

**M3**: 품질 검증

- 빌드, 타입체크, 린트 통과
- 수동 테스트 완료
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #68: [로그인 리팩토링 및 인증 라우터 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/68)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처](.claude/rules/fsd.md)

### External Resources

- [React Router v7 - Protected Routes](https://reactrouter.com/en/main/start/tutorial#protected-routes)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-01
**Next Action**: 사용자 승인 후 Phase 1 시작
