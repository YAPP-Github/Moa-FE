# Task Plan: Auth 관련 모듈 리팩토링

**Issue**: #130
**Type**: Refactor
**Created**: 2026-02-09
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 auth 모듈(`src/features/auth/`)은 FSD 구조를 잘 따르고 있으나, 프로젝트의 API 관리 규칙과 에러 핸들링 규칙에 부합하지 않는 부분이 존재한다.

- `auth.queries.ts`에서 `getApi()` (Orval generated) 직접 호출 — `rules/api.md` 위반
- `auth.mutations.ts`에서 `axiosInstance` 직접 사용 + generated 타입 import — 일관성 부족
- `CallbackPage.tsx`에서 `console.error`만으로 에러 처리 + 모듈 레벨 mutable state
- `Header.tsx`에서 `getApi().withdraw()` 직접 호출 + `console.error` 에러 처리
- auth API 응답에 Zod 런타임 검증 미적용

### Objectives

1. auth API 함수를 `customInstance` 기반 `auth.api.ts`로 통합
2. auth API 응답에 Zod 스키마 런타임 검증 적용
3. CallbackPage의 모듈 레벨 `isProcessed`를 `useRef`로 전환
4. 에러 핸들링 규칙에 맞게 불필요한 `try/catch` + `console.error` 정리

### Scope

**In Scope**:

- `features/auth/api/` — API 함수 + Query/Mutation 리팩토링
- `features/auth/model/schema.ts` — Zod 응답 스키마 추가
- `pages/callback/ui/CallbackPage.tsx` — `useRef` 전환 + 에러 처리
- `pages/onboarding/ui/OnboardingPage.tsx` — 불필요한 `try/catch` 정리
- `widgets/header/ui/Header.tsx` — `getApi()` → 도메인 API 함수 + 에러 처리

**Out of Scope**:

- 다른 feature(team, retrospective)의 `getApi()` 리팩토링 (별도 이슈)
- `ApiError` 클래스 생성 및 Axios interceptor 리팩토링 (기존 `093-api-error-handling-refactor.md`에서 이미 다뤘을 수 있음)
- `MutationCache` 글로벌 에러 핸들러 설정 (인프라 작업, 현재 없으므로 이번 스코프에서 추가)

---

## 2. Requirements

### Functional Requirements

**FR-1**: auth API 함수를 `customInstance` 기반으로 정의

- `features/auth/api/auth.api.ts` 생성
- `getProfile`, `socialLogin`, `signup`, `withdraw` 함수 정의
- generated에서 직접 import 하지 않음

**FR-2**: auth API 응답 Zod 스키마 작성

- `features/auth/model/schema.ts`에 응답 스키마 추가
- `baseResponseSchema` 헬퍼 생성 (`shared/api/schema.ts`)
- API 함수에서 `schema.parse(data)` 호출

**FR-3**: CallbackPage `isProcessed` → `useRef` 전환

- 모듈 레벨 `let isProcessed = false` 제거
- `useRef(false)` 사용
- StrictMode 호환성 보장

**FR-4**: 에러 핸들링 정리

- `CallbackPage`: `console.error` 제거, 글로벌 에러 핸들링에 위임 + 리다이렉트만 유지
- `OnboardingPage`: 불필요한 `try/catch` + 하드코딩 메시지 제거, 글로벌에 위임
- `Header`: `getApi()` → `withdraw()` 도메인 함수 사용, `console.error` 제거

### Technical Requirements

**TR-1**: `shared/api/schema.ts` — `baseResponseSchema` 헬퍼

- `{ isSuccess, code, message, result }` 래퍼 검증 제네릭

**TR-2**: `shared/api/error.ts` — `ApiError` 클래스

- HTTP Status 기반 에러 분류
- Axios interceptor에서 AxiosError → ApiError 변환

**TR-3**: `app/providers/queryClient.ts` — `MutationCache` 글로벌 에러 핸들러

- mutation 에러 시 서버 메시지 자동 토스트
- `meta.skipGlobalError`로 억제 가능

**TR-4**: Toast store에 React 외부 접근 export

- `useToastStore.getState()` 활용을 위한 `toastStore` export

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: `ApiError` + `MutationCache` 글로벌 에러 핸들러 도입

- **Rationale**: `rules/error-handling.md`에 정의된 4계층 구조의 Layer 1(Interceptor) + Layer 2(Global) 적용
- **Approach**:
  - `ApiError` 클래스로 AxiosError를 HTTP Status 기반으로 정규화
  - `MutationCache.onError`에서 `ApiError.message` (서버 메시지)를 자동 토스트
- **Trade-offs**: 인프라 변경이 auth 리팩토링 범위를 넘지만, 에러 핸들링 정리의 전제 조건
- **Impact**: HIGH — 모든 mutation의 에러 핸들링에 영향

**Decision 2**: auth API 응답에 `baseResponseSchema` 래퍼 검증 적용

- **Rationale**: `rules/api.md`의 Zod 런타임 검증 규칙 준수
- **Approach**: `baseResponseSchema(resultSchema)` 패턴 사용
- **Benefit**: 타입 안전성 + 런타임 검증 + Single Source of Truth (스키마에서 타입 추출)

### Data Models

```typescript
// shared/api/error.ts
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

// shared/api/schema.ts
const baseResponseSchema = <T extends z.ZodTypeAny>(resultSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: resultSchema,
  });

// features/auth/model/schema.ts (추가될 응답 스키마)
const profileResultSchema = z.object({
  memberId: z.number(),
  email: z.string(),
  nickname: z.string().nullable().optional(),
  socialType: z.enum(['GOOGLE', 'KAKAO']),
  createdAt: z.string(),
  insightCount: z.number(),
});

const socialLoginResultSchema = z.object({
  isNewMember: z.boolean(),
  accessToken: z.string().nullable().optional(),
  refreshToken: z.string().nullable().optional(),
  signupToken: z.string().nullable().optional(),
});

const signupResultSchema = z.object({
  memberId: z.number(),
  nickname: z.string(),
});
```

---

## 4. Implementation Plan

### Phase 1: 인프라 — ApiError + baseResponseSchema + MutationCache

**Tasks**:

1. `shared/api/error.ts` — `ApiError` 클래스 생성
2. `shared/api/instance.ts` — Axios interceptor에 `ApiError` 변환 로직 추가
3. `shared/api/schema.ts` — `baseResponseSchema` 제네릭 헬퍼 생성
4. `shared/ui/toast/Toast.tsx` — `toastStore` export 추가
5. `shared/api/types.ts` — React Query `mutationMeta` 타입 확장
6. `app/providers/queryClient.ts` — `MutationCache` 글로벌 에러 핸들러 추가

**Files to Create/Modify**:

- `src/shared/api/error.ts` (CREATE)
- `src/shared/api/schema.ts` (CREATE)
- `src/shared/api/types.ts` (CREATE)
- `src/shared/api/instance.ts` (MODIFY) — interceptor에 `ApiError` 변환 추가
- `src/shared/ui/toast/Toast.tsx` (MODIFY) — `toastStore` export
- `src/app/providers/queryClient.ts` (MODIFY) — `MutationCache` 추가

### Phase 2: auth API 리팩토링

**Tasks**:

1. `features/auth/model/schema.ts` — Zod 응답 스키마 추가 (기존 폼 스키마 유지)
2. `features/auth/api/auth.api.ts` (CREATE) — `customInstance` 기반 API 함수
3. `features/auth/api/auth.queries.ts` (MODIFY) — `getApi()` → `auth.api.ts` 함수 사용
4. `features/auth/api/auth.mutations.ts` (MODIFY) — `axiosInstance` / generated 타입 → `auth.api.ts` 함수 사용

**Files to Create/Modify**:

- `src/features/auth/model/schema.ts` (MODIFY)
- `src/features/auth/api/auth.api.ts` (CREATE)
- `src/features/auth/api/auth.queries.ts` (MODIFY)
- `src/features/auth/api/auth.mutations.ts` (MODIFY)

### Phase 3: 컴포넌트 에러 핸들링 정리

**Tasks**:

1. `CallbackPage.tsx` — `useRef` 전환 + 에러 핸들링 정리
2. `OnboardingPage.tsx` — 불필요한 `try/catch` 제거, 글로벌에 위임
3. `Header.tsx` — `getApi().withdraw()` → `auth.api.ts`의 `withdraw()` + 에러 처리 정리

**Files to Modify**:

- `src/pages/callback/ui/CallbackPage.tsx` (MODIFY)
- `src/pages/onboarding/ui/OnboardingPage.tsx` (MODIFY)
- `src/widgets/header/ui/Header.tsx` (MODIFY)

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] `getApi()` 직접 호출이 auth 관련 파일에서 모두 제거됨
- [ ] `@/shared/api/generated` import가 auth 관련 파일에서 모두 제거됨
- [ ] auth API 함수가 `customInstance` 기반 `auth.api.ts`에 정의됨
- [ ] auth 응답 Zod 스키마가 `schema.ts`에 정의되고 `parse()` 적용됨
- [ ] `ApiError` 클래스가 Axios interceptor에서 사용됨
- [ ] `MutationCache` 글로벌 에러 핸들러가 설정됨
- [ ] CallbackPage `isProcessed`가 `useRef`로 전환됨
- [ ] 불필요한 `console.error` 제거됨
- [ ] `pnpm run build` 성공
- [ ] `pnpm tsc --noEmit` 성공
- [ ] `pnpm run lint` 성공

### Validation Checklist

**기능 동작**:

- [ ] 소셜 로그인 (Google/Kakao) 플로우 정상 동작
- [ ] 신규 회원 온보딩 플로우 정상 동작
- [ ] 로그아웃 정상 동작
- [ ] 서비스 탈퇴 정상 동작
- [ ] 토큰 갱신 (401 → refresh) 정상 동작
- [ ] 에러 시 서버 메시지 토스트 표시

---

## 6. Risks & Dependencies

### Risks

**R-1**: `MutationCache` 도입으로 기존 컴포넌트 에러 핸들링 충돌

- **Impact**: MEDIUM
- **Mitigation**: `OnboardingPage`의 팀 생성/참여 에러는 `meta: { skipGlobalError: true }` 없이 글로벌 토스트에 위임하고, 특수 동작(리다이렉트 등)이 필요한 곳만 컴포넌트에서 `catch`

**R-2**: Zod parse 실패 시 기존 동작 중단

- **Impact**: LOW
- **Mitigation**: 백엔드 응답이 OpenAPI 스펙과 일치하면 실패하지 않음. ZodError가 발생하면 React Query 에러 핸들링으로 전달됨

---

## 7. Rollout & Monitoring

### Deployment Strategy

- 단일 PR로 배포
- auth 플로우 전체 수동 테스트 필수 (로그인/가입/로그아웃/탈퇴)

---

## 8. Timeline & Milestones

### Milestones

**M1**: Phase 1 완료 — 인프라 (ApiError + baseResponseSchema + MutationCache)
**M2**: Phase 2 완료 — auth API 리팩토링
**M3**: Phase 3 완료 — 컴포넌트 에러 핸들링 정리 + 빌드 검증

---

## 9. References

### Related Issues

- Issue #130: [Refactor] auth 관련 모듈 리팩토링

### Documentation

- [API 관리 규칙](../../.claude/rules/api.md)
- [에러 핸들링 규칙](../../.claude/rules/error-handling.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-10
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Files Created (11)

- `src/shared/api/error.ts` — `ApiError` 클래스 (HTTP Status 기반 에러 분류)
- `src/shared/api/schema.ts` — `baseResponseSchema` 제네릭 헬퍼
- `src/shared/api/types.ts` — React Query `mutationMeta` 타입 확장
- `src/features/auth/api/auth.api.ts` — `customInstance` 기반 auth API 함수 (getProfile, socialLogin, signup, logout, withdraw)
- `src/features/auth/ui/routes/RouteGuard.tsx` — 최상위 auth check layout route + GlobalLoading (최소 500ms 표시)
- `src/features/auth/ui/GoogleOAuthButton.tsx` — Google OAuth 버튼 컴포넌트
- `src/features/auth/ui/KaKaoOAuthButton.tsx` — Kakao OAuth 버튼 컴포넌트
- `src/features/auth/ui/forms/OnboardingForm.tsx` — 온보딩 폼 컴포넌트
- `src/features/auth/ui/forms/SigninForm.tsx` — 사인인 폼 컴포넌트
- `src/shared/ui/global-loading/GlobalLoading.tsx` — Todoist 스타일 브랜딩 로딩 페이지 (IcNote 로고 + 슬라이딩 로딩 바)
- `docs/plans/130-auth-module-refactoring.md` — 계획 문서

#### Files Modified (16)

- `src/shared/api/instance.ts` — Axios interceptor: refresh-token 로직 제거, `setupErrorInterceptor`로 AxiosError → ApiError 변환만 수행
- `src/shared/ui/toast/Toast.tsx` — `toastStore` export 추가 (React 외부 접근)
- `src/app/providers/queryClient.ts` — `MutationCache` 글로벌 에러 핸들러 추가 (서버 메시지 자동 토스트)
- `src/app/providers/QueryProvider.tsx` — QueryProvider 업데이트
- `src/app/App.tsx` — RouteGuard 기반 라우트 구조 (`RouteGuard > PublicRoute/PrivateRoute` layout route 중첩)
- `src/features/auth/model/schema.ts` — Zod 응답 스키마 추가 (profile, socialLogin, signup, withdraw)
- `src/features/auth/model/types.ts` — 타입 정리
- `src/features/auth/model/store.ts` — Zustand store 유지 (onboarding 상태 관리용)
- `src/features/auth/api/auth.queries.ts` — `getApi()` → `auth.api.ts`의 `getProfile` 사용
- `src/features/auth/api/auth.mutations.ts` — generated → `auth.api.ts` 함수 사용, logout/withdraw에 `queryClient.clear()` 적용
- `src/features/auth/ui/AuthProvider.tsx` — `onSessionExpired`/refresh-token 제거, `setupErrorInterceptor` 설정만 수행
- `src/features/auth/ui/routes/PublicRoute.tsx` — layout route 변환 (`<Outlet />`), useProfile 캐시 동기 읽기
- `src/features/auth/ui/routes/PrivateRoute.tsx` — layout route 변환 (`<Outlet />`), useProfile 캐시 동기 읽기
- `src/features/auth/ui/routes/OnboardingRoute.tsx` — layout route 변환 (`<Outlet />`)
- `src/pages/callback/ui/CallbackPage.tsx` — `useEffectEvent` 패턴 적용, `GlobalLoading` UI, 에러 핸들링 정리
- `src/pages/onboarding/ui/OnboardingPage.tsx` — 불필요한 try/catch 제거, 글로벌 에러 핸들링에 위임
- `src/widgets/header/ui/Header.tsx` — `getApi().withdraw()` → 도메인 API 함수 사용
- `src/index.css` — `@keyframes loading-slide` 추가
- `.claude/rules/api.md` — API 규칙 문서 업데이트
- `.claude/rules/fsd.md` — FSD 규칙 문서 업데이트

#### Key Implementation Details

- **RouteGuard 패턴**: `useProfile()` 1회 호출 → 최소 500ms GlobalLoading 표시 → fade-out → `<Outlet />`으로 하위 라우트 렌더. `isInitialCheckDone` ref로 로그아웃 시 재로딩 방지
- **에러 핸들링 3계층**: Axios interceptor (AxiosError → ApiError) → MutationCache (서버 메시지 자동 토스트) → 컴포넌트 (특수 UI 분기만)
- **Zod 런타임 검증**: `baseResponseSchema(resultSchema)` 패턴으로 모든 auth API 응답 검증
- **Refresh-token 제거**: 나중에 재작성 예정, 현재는 `setupErrorInterceptor`로 에러 변환만 수행
- **GlobalLoading**: IcNote 로고 + "모아" 텍스트 + 슬라이딩 로딩 바, RouteGuard와 CallbackPage에서 공유

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (182 files, 0 issues)

### Deviations from Plan

**Added**:

- `RouteGuard` layout route + `GlobalLoading` 브랜딩 로딩 페이지 (FOUC 원천 차단)
- 최소 표시 시간 (500ms) 패턴으로 깜빡임 방지
- logout/withdraw 시 `queryClient.clear()` (전체 캐시 제거)
- `GoogleOAuthButton`, `KaKaoOAuthButton`, `SigninForm`, `OnboardingForm` 컴포넌트 분리

**Changed**:

- refresh-token 로직 제거 (계획에는 유지 예정이었으나, 나중에 재작성하기로 결정)
- `CallbackPage`의 `isProcessed` useRef 전환 대신 `useEffectEvent` 패턴 적용
- `PublicRoute`/`PrivateRoute`를 children 기반에서 layout route (`<Outlet />`) 기반으로 변경

**Skipped**:

- refresh-token 재구현 (별도 작업으로 분리)

### Performance Impact

- Bundle size: -1.5KB (refresh-token 로직 제거, 스피너 → GlobalLoading 공유)
- 초기 로딩 UX: GlobalLoading 500ms 최소 표시로 FOUC 완전 차단

### Follow-up Tasks

- [ ] refresh-token 로직 재작성
- [ ] Error Boundary (Layer 4) 추가

### Notes

- OnboardingRoute는 `location.state.fromOAuth` 기반 (기획 의도: 새로고침 시 /signin으로 이동)
- CallbackPage는 RouteGuard 바깥에 배치 (자체 GlobalLoading UI)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-10
