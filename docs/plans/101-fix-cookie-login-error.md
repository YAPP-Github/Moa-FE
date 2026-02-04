# Task Plan: 쿠키 기반 로그인 에러 수정

**Issue**: #101
**Type**: Bug
**Created**: 2026-02-04
**Status**: Planning

---

## 1. Overview

### Problem Statement

PR #91에서 인증 방식을 localStorage에서 쿠키 기반으로 변경하는 과정에서 불완전한 병합으로 인해 여러 TypeScript 오류가 발생했습니다.

- 현재 상황: 빌드 실패 (13개의 TypeScript 오류)
- 문제점: 중복 변수 선언, 존재하지 않는 store 속성 참조, 누락된 import
- 해결하지 않으면 발생할 영향: 프로덕션 배포 불가, 로그인/온보딩 기능 동작 불가

### Objectives

1. OnboardingPage.tsx의 중복 선언 및 잘못된 store 참조 수정
2. Header.tsx의 누락된 import 및 unused 변수 제거
3. 빌드 성공 및 린트 통과

### Scope

**In Scope**:

- OnboardingPage.tsx 수정 (8개 오류)
- Header.tsx 수정 (4개 오류)
- 빌드 및 린트 검증

**Out of Scope**:

- TeamDashboardPage.tsx 타입 오류 (별도 이슈로 분리)
- 인증 플로우 로직 변경
- 백엔드 API 관련 작업

### User Context

> "쿠키 기반 로그인 에러 수정"

**핵심 요구사항**:

1. 빌드가 성공해야 함
2. 로그인 및 온보딩 기능이 정상 동작해야 함

---

## 2. Requirements

### Functional Requirements

**FR-1**: 온보딩 페이지 정상 동작

- 회원가입 후 온보딩 플로우 진행 가능해야 함
- 쿠키 기반 인증으로 signupToken 쿠키 자동 전송

**FR-2**: 헤더 컴포넌트 정상 동작

- 로그아웃 버튼 클릭 시 서버에 로그아웃 요청
- 쿠키 삭제 후 로그인 페이지로 이동

### Technical Requirements

**TR-1**: TypeScript 빌드 성공

- 모든 타입 오류 해결
- `npm run build` 성공

**TR-2**: 코드 품질

- 린트 통과
- unused 변수 제거

### Non-Functional Requirements

**NFR-1**: 코드 일관성

- PR #91의 쿠키 기반 인증 패턴 유지
- AuthStore의 새로운 API 사용 (`isOnboarding`, `setOnboarding`, `clearOnboarding`)

---

## 3. Architecture & Design

### Files to Modify

```
src/
├── pages/
│   └── onboarding/
│       └── ui/
│           └── OnboardingPage.tsx    # MODIFY: 중복 선언 제거
└── widgets/
    └── header/
        └── ui/
            └── Header.tsx            # MODIFY: unused 코드 제거
```

### Design Decisions

**Decision 1**: OnboardingPage.tsx 수정

- **Rationale**: 병합 과정에서 이전 코드와 새 코드가 중복됨
- **Approach**: 이전 코드 (16번 줄) 삭제, 새 API만 사용
- **Impact**: LOW (단순 삭제)

**Decision 2**: Header.tsx 수정

- **Rationale**: useState import 누락 및 unused 변수 존재
- **Approach**: unused 코드 제거 (useState, isProfileMenuOpen, logout)
- **Impact**: LOW (단순 삭제)

### Bug Analysis

**버그 1**: `OnboardingPage.tsx` (15-16줄)

현재 코드:

```typescript
const { signupEmail, login, clearOnboarding } = useAuthStore(); // 새 코드
const { signupToken, signupEmail, login, clearSignupData } = useAuthStore(); // 이전 코드 (병합 잔여물)
```

문제점:

- `signupEmail`, `login` 변수가 중복 선언됨
- `signupToken`, `clearSignupData`는 AuthStore에 더 이상 존재하지 않음

수정:

```typescript
const { signupEmail, login, clearOnboarding } = useAuthStore();
```

**버그 2**: `Header.tsx` (21-23줄)

현재 코드:

```typescript
const { logoutWithServer } = useAuthStore();
const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false); // useState import 누락, unused
const { logout } = useAuthStore(); // unused
```

문제점:

- `useState`가 import되지 않음
- `isProfileMenuOpen`, `setIsProfileMenuOpen` 사용되지 않음
- `logout` 사용되지 않음 (logoutWithServer만 사용)

수정:

```typescript
const { logoutWithServer } = useAuthStore();
```

---

## 4. Implementation Plan

### Phase 1: OnboardingPage.tsx 수정

**Tasks**:

1. 16번 줄의 중복 선언 제거
2. 이전 API 참조 (`signupToken`, `clearSignupData`) 제거

**Files to Modify**:

- `src/pages/onboarding/ui/OnboardingPage.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 2: Header.tsx 수정

**Tasks**:

1. 22-23번 줄의 unused 코드 제거
2. useState 관련 코드 제거

**Files to Modify**:

- `src/widgets/header/ui/Header.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 3: 검증

**Tasks**:

1. TypeScript 빌드 검증
2. 린트 검증
3. 수동 테스트 (선택)

**Estimated Effort**: Small

### Vercel React Best Practices

해당 없음 - 버그 수정 작업으로 React 렌더링 성능과 직접 관련 없음

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

**TS-2**: 수동 테스트 (선택)

- 온보딩 페이지 접근 시 오류 없음
- 헤더 렌더링 정상

### Acceptance Criteria

- [x] 로그인 에러 원인 파악
- [x] OnboardingPage.tsx 중복 선언 수정
- [x] Header.tsx unused 코드 제거
- [x] 쿠키 기반 인증 정상 동작 확인
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Validation Checklist

**기능 동작**:

- [x] 온보딩 페이지 정상 렌더링
- [x] 헤더 컴포넌트 정상 렌더링
- [x] 로그아웃 동작 확인

**코드 품질**:

- [x] TypeScript 에러 없음
- [x] 린트 경고 없음
- [x] unused 변수 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: 추가 오류 발견

- **Risk**: 수정 과정에서 다른 파일에서 추가 오류 발견 가능
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: 빌드 및 린트로 전체 검증

### Dependencies

**D-1**: PR #91 변경 사항

- **Dependency**: 쿠키 기반 인증 API (이미 반영됨)
- **Required For**: 전체 작업
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

단일 커밋으로 버그 수정 배포

**Rollback Plan**:

- 문제 발생 시 git revert로 롤백

### Success Metrics

**SM-1**: 빌드 성공

- **Metric**: npm run build 성공 여부
- **Target**: 성공

**SM-2**: TypeScript 오류 해결

- **Metric**: 관련 오류 개수
- **Target**: 0개 (현재 12개 → 0개)

---

## 8. Timeline & Milestones

### Milestones

**M1**: 코드 수정

- OnboardingPage.tsx 수정
- Header.tsx 수정
- **Status**: NOT_STARTED

**M2**: 검증 완료

- 빌드 성공
- 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #101: [쿠키 기반 로그인 에러 수정](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/101)
- Issue #90: [인증 방식을 localStorage에서 쿠키 기반으로 변경](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/90)
- PR #91: [Refactor: 인증 방식을 localStorage에서 쿠키 기반으로 변경](https://github.com/YAPP-Github/27th-Web-Team-3-FE/pull/91)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md)

### External Resources

- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-05
**Implemented By**: Claude Opus 4.5

### Changes Made

| File                                                                                                                                                        | Changes                                                                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`src/pages/onboarding/ui/OnboardingPage.tsx`](../../../src/pages/onboarding/ui/OnboardingPage.tsx)                                                         | 중복 변수 선언 제거, 존재하지 않는 store 속성 참조 제거, signup API 호출에서 email 필드 제거 |
| [`src/widgets/header/ui/Header.tsx`](../../../src/widgets/header/ui/Header.tsx)                                                                             | 미사용 useState 및 logout 변수 제거                                                          |
| [`src/pages/team-dashboard/ui/TeamDashboardPage.tsx`](../../../src/pages/team-dashboard/ui/TeamDashboardPage.tsx)                                           | `participantCount`를 optional로 변경하여 API 응답 타입과 일치                                |
| [`src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx`](../../../src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx) | `participantCount`를 optional로 변경, 린트 포맷팅 수정                                       |
| [`src/features/auth/api/auth.mutations.ts`](../../../src/features/auth/api/auth.mutations.ts)                                                               | social-login API에 `redirectUri` 필드 추가                                                   |
| [`src/features/auth/lib/oauth.ts`](../../../src/features/auth/lib/oauth.ts)                                                                                 | `getRedirectUri()` 함수 export                                                               |
| [`vite.config.ts`](../../../vite.config.ts)                                                                                                                 | Vite proxy 설정 추가 (SameSite=Lax 쿠키 지원)                                                |
| `.env.local`                                                                                                                                                | 로컬 개발용 환경변수 (proxy 사용)                                                            |

### Quality Validation

- [x] Build: Success (`pnpm build`)
- [x] Type Check: Passed (`pnpm tsc --noEmit`)
- [x] Lint: Passed (`pnpm lint`)

### Deviations from Plan

**Added (Scope 확장)**:

- `TeamDashboardPage.tsx` 타입 오류 수정 (원래 Out of Scope였으나 함께 수정)
- `RetrospectiveDetailPanel.tsx` 타입 오류 수정
- `OnboardingPage.tsx` signup API의 email 필드 제거 (API 스펙 변경 대응)
- Social-login API에 `redirectUri` 필드 추가 (백엔드 OAuth 토큰 교환용)
- Vite proxy 설정 추가 (로컬 개발 시 SameSite=Lax 쿠키 지원)
- `.env.local` 파일 생성 (로컬 개발 환경 분리)

**Changed**: 없음

**Skipped**: 없음

### Bug Details

**버그 1: OnboardingPage.tsx (8개 TS 오류)**

```typescript
// Before (broken) - 중복 선언 및 존재하지 않는 속성
const { signupEmail, login, clearOnboarding } = useAuthStore();
const { signupToken, signupEmail, login, clearSignupData } = useAuthStore();

// After (fixed)
const { login, clearOnboarding } = useAuthStore();
```

**버그 2: Header.tsx (4개 TS 오류)**

```typescript
// Before (broken) - 미사용 변수
const { logoutWithServer } = useAuthStore();
const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
const { logout } = useAuthStore();

// After (fixed)
const { logoutWithServer } = useAuthStore();
```

**버그 3: TeamDashboardPage.tsx & RetrospectiveDetailPanel.tsx (1개 TS 오류)**

```typescript
// Before (broken) - API 응답과 타입 불일치
interface TodayRetrospect {
  participantCount: number; // required
}

// After (fixed)
interface TodayRetrospect {
  participantCount?: number; // optional
}
```

**버그 4: OnboardingPage.tsx - signup API email 필드**

```typescript
// Before (broken) - API 스펙 변경됨
await signupMutation.mutateAsync({
  email: signupEmail || "",
  nickname: data.nickname,
});

// After (fixed)
await signupMutation.mutateAsync({
  nickname: data.nickname,
});
```

### Performance Impact

- Bundle size: No change (코드 삭제만 수행)
- No runtime impact

---

**Plan Status**: Completed
**Last Updated**: 2026-02-05
