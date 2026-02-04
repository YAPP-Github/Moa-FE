# Task Plan: 인증 방식을 localStorage에서 쿠키 기반으로 변경

**Issue**: #90
**Type**: Refactor
**Created**: 2026-02-04
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 인증 토큰(accessToken, refreshToken)을 localStorage에 저장하고 있어 XSS 공격에 취약합니다.

- 현재 상황: 프론트엔드에서 OAuth Provider와 직접 토큰 교환 후 localStorage에 저장
- 문제점: localStorage는 JavaScript로 접근 가능하여 XSS 공격 시 토큰 탈취 위험
- 해결 필요성: 백엔드에서 쿠키 기반 인증으로 API 변경, HttpOnly 쿠키로 보안 강화

### Objectives

1. 모든 API 요청에 `withCredentials: true` 설정하여 쿠키 자동 전송
2. OAuth 콜백에서 인가 코드(code)만 백엔드로 전송 (토큰 교환은 백엔드에서 처리)
3. localStorage 토큰 관리 로직 완전 제거
4. 인증 상태 확인 방식을 서버 API 기반으로 변경

### Scope

**In Scope**:

- Axios 인스턴스에 `withCredentials: true` 설정
- OAuth 콜백 로직 변경 (code만 전송)
- localStorage 토큰 저장/조회 로직 제거
- 토큰 갱신 로직 쿠키 기반으로 변경
- 인증 상태 확인 방식 변경
- 로그아웃 로직 변경

**Out of Scope**:

- 백엔드 API 수정 (이미 완료된 것으로 가정)
- CORS 설정 (백엔드 담당)
- 새로운 인증 방식 추가 (예: 이메일 인증)

### User Context

> "로그인 형식, 인증 인가 형식을 쿠키로 바꾸고 할 꺼야... 소셜 로그인 쪽에서는 인가 코드를 받고 서버로 보내주는... 그런 형식이지"

**핵심 요구사항**:

1. OAuth 인가 코드를 백엔드로 전송 (프론트에서 토큰 교환 제거)
2. 모든 API에 `credentials: 'include'` 설정
3. 토큰은 서버가 Set-Cookie로 관리

---

## 2. Requirements

### Functional Requirements

**FR-1**: 소셜 로그인 플로우 변경

- OAuth Provider에서 인가 코드만 수신
- 백엔드 `/api/v1/auth/social-login`에 `{provider, code}` 전송
- 응답: 기존 회원은 쿠키로 access_token, refresh_token 수신
- 응답: 신규 회원은 쿠키로 signup_token 수신

**FR-2**: 회원가입 플로우 변경

- signup_token 쿠키가 자동으로 전송됨
- 백엔드 `/api/v1/auth/signup`에 `{nickname}` 전송
- 응답: 쿠키로 access_token, refresh_token 수신

**FR-3**: 토큰 갱신 플로우 변경

- 401 응답 시 `/api/v1/auth/token/refresh` 호출
- refresh_token 쿠키가 자동으로 전송됨
- 응답: 쿠키로 새로운 access_token, refresh_token 수신

**FR-4**: 로그아웃 플로우 변경

- `/api/v1/auth/logout` 호출
- 쿠키가 자동으로 전송됨
- 응답: 서버가 쿠키 삭제

### Technical Requirements

**TR-1**: Axios 설정

- 모든 요청에 `withCredentials: true` 설정
- Authorization 헤더 자동 추가 로직 제거

**TR-2**: 인증 상태 관리

- 서버 API로 인증 상태 확인 (예: `/api/v1/auth/me` 또는 기존 API 활용)
- localStorage 의존성 완전 제거

**TR-3**: 타입 호환성

- Orval 생성 API 타입과 호환 유지
- 기존 응답 타입에서 accessToken, refreshToken 필드 무시

### Non-Functional Requirements

**NFR-1**: 보안

- HttpOnly 쿠키로 XSS 공격 방어 (서버 설정)
- CSRF 보호 (SameSite 쿠키 속성)

**NFR-2**: 사용자 경험

- 로그인/로그아웃 플로우 동일하게 유지
- 페이지 새로고침 시 인증 상태 유지

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── auth/
│       ├── api/
│       │   └── auth.mutations.ts      # MODIFY: API 호출 변경
│       ├── lib/
│       │   ├── oauth.ts               # MODIFY: exchangeCodeForToken 제거
│       │   └── token.ts               # DELETE: localStorage 로직 제거
│       ├── model/
│       │   ├── store.ts               # MODIFY: 토큰 저장 로직 제거
│       │   └── types.ts               # KEEP: 타입 유지
│       └── ui/
│           ├── AuthProvider.tsx       # MODIFY: 초기화 로직 변경
│           ├── routes/
│           │   ├── PrivateRoute.tsx   # KEEP: 상태 기반 유지
│           │   ├── PublicRoute.tsx    # KEEP: 상태 기반 유지
│           │   └── OnboardingRoute.tsx # KEEP: 상태 기반 유지
│           └── steps/
│               └── LoginStep.tsx      # MODIFY: login() 호출 변경
├── pages/
│   ├── callback/
│   │   └── ui/
│   │       └── CallbackPage.tsx       # MODIFY: exchangeCodeForToken 제거
│   └── onboarding/
│       └── ui/
│           └── OnboardingPage.tsx     # MODIFY: login() 호출 변경
├── shared/
│   └── api/
│       └── instance.ts                # MODIFY: withCredentials 추가
└── widgets/
    └── header/
        └── ui/
            └── Header.tsx             # MODIFY: logoutWithServer() 사용
```

### Design Decisions

**Decision 1**: localStorage 완전 제거

- **Rationale**: 쿠키 기반 인증에서 프론트엔드 토큰 저장 불필요
- **Approach**: `token.ts` 파일 삭제, 모든 import 제거
- **Trade-offs**: 인증 상태 확인을 위해 서버 호출 필요 (초기 로딩 시)
- **Impact**: HIGH

**Decision 2**: 인증 상태 확인 방식

- **Rationale**: localStorage 없이 인증 상태를 알 방법 필요
- **Approach**: 앱 초기화 시 서버 API 호출로 인증 여부 확인
- **Alternatives Considered**:
  - 옵션 A: `/api/v1/auth/me` 엔드포인트 호출 (권장)
  - 옵션 B: 기존 API 호출 시 401로 판단
- **Impact**: MEDIUM

**Decision 3**: OAuth 인가 코드 방식

- **Rationale**: 백엔드에서 토큰 교환 처리하여 보안 강화
- **Approach**: 프론트에서 code만 파싱하여 백엔드로 전송
- **Benefit**: Client Secret이 프론트에 노출되지 않음
- **Impact**: MEDIUM

### Component Design

**인증 플로우 (변경 후)**:

```
User clicks "Login with Google"
    ↓
Redirect to Google OAuth
    ↓
Google redirects to /callback?code=xxx&state=Google
    ↓
CallbackPage: parseOAuthCallback() → {code, provider}
    ↓
socialLogin({provider, code}) → Server exchanges code for token
    ↓
Server sets HttpOnly cookies (access_token, refresh_token)
    ↓
Response: {isNewMember: false} → navigate('/')
    ↓
AuthProvider: initialize() → Server validates cookie
    ↓
isAuthenticated = true
```

**토큰 갱신 플로우 (변경 후)**:

```
API request fails with 401
    ↓
Axios interceptor catches error
    ↓
POST /api/v1/auth/token/refresh (cookies auto-sent)
    ↓
Server validates refresh_token cookie
    ↓
Server sets new access_token, refresh_token cookies
    ↓
Retry original request (cookies auto-sent)
```

### Data Models

```typescript
// 변경된 소셜 로그인 요청
interface SocialLoginRequest {
  provider: 'Google' | 'Kakao';
  code: string; // 인가 코드 (accessToken 대신)
}

// 변경된 소셜 로그인 응답 (토큰 필드 제거 가능)
interface SocialLoginResponse {
  isNewMember: boolean;
  email?: string; // 신규 회원 시 온보딩용
  // accessToken, refreshToken, signupToken은 쿠키로 전달
}

// 변경된 회원가입 요청
interface SignupRequest {
  nickname: string;
  // signupToken은 쿠키로 자동 전송
}

// 로그아웃 요청
interface LogoutRequest {
  // body 없음, 쿠키로 자동 전송
}
```

### API Design

**소셜 로그인**: `POST /api/v1/auth/social-login`

```json
// Request
{
  "provider": "Google",
  "code": "4/0AQlEd8..."
}

// Response (Set-Cookie: access_token, refresh_token)
{
  "isSuccess": true,
  "result": {
    "isNewMember": false
  }
}
```

**토큰 갱신**: `POST /api/v1/auth/token/refresh`

```json
// Request: body 없음 (refresh_token은 쿠키로 전송)

// Response (Set-Cookie: access_token, refresh_token 갱신)
{
  "isSuccess": true,
  "result": {}
}
```

---

## 4. Implementation Plan

### Phase 1: Axios 설정 변경

**Tasks**:

1. `axiosInstance`에 `withCredentials: true` 추가
2. 요청 인터셉터에서 Authorization 헤더 추가 로직 제거
3. 응답 인터셉터에서 토큰 저장 로직 제거

**Files to Modify**:

- `src/shared/api/instance.ts` (MODIFY)

**Estimated Effort**: Small

### Phase 2: 토큰 저장소 제거

**Tasks**:

1. `token.ts` 파일 삭제
2. 모든 import 문 제거 및 코드 수정
3. `store.ts`에서 토큰 관련 로직 제거

**Files to Modify**:

- `src/features/auth/lib/token.ts` (DELETE)
- `src/features/auth/model/store.ts` (MODIFY)
- `src/shared/api/instance.ts` (MODIFY - import 제거)

**Dependencies**: Phase 1 완료

**Estimated Effort**: Medium

### Phase 3: OAuth 플로우 변경

**Tasks**:

1. `oauth.ts`에서 `exchangeCodeForToken` 함수 제거
2. `CallbackPage`에서 code만 백엔드로 전송하도록 변경
3. `auth.mutations.ts`에서 socialLogin 요청 변경

**Files to Modify**:

- `src/features/auth/lib/oauth.ts` (MODIFY)
- `src/pages/callback/ui/CallbackPage.tsx` (MODIFY)
- `src/features/auth/api/auth.mutations.ts` (MODIFY)

**Dependencies**: Phase 2 완료

**Estimated Effort**: Medium

### Phase 4: 인증 상태 관리 변경

**Tasks**:

1. `store.ts`의 `initialize()` 함수 변경 (서버 API 호출)
2. `login()`, `logout()` 함수 간소화
3. `AuthProvider`에서 비동기 초기화 처리

**Files to Modify**:

- `src/features/auth/model/store.ts` (MODIFY)
- `src/features/auth/ui/AuthProvider.tsx` (MODIFY)

**Dependencies**: Phase 3 완료

**Estimated Effort**: Medium

### Phase 5: UI 컴포넌트 수정

**Tasks**:

1. `LoginStep`에서 login() 호출 변경
2. `OnboardingPage`에서 회원가입 완료 처리 변경
3. `Header`에서 logoutWithServer() 사용 확인

**Files to Modify**:

- `src/features/auth/ui/steps/LoginStep.tsx` (MODIFY)
- `src/pages/onboarding/ui/OnboardingPage.tsx` (MODIFY)
- `src/widgets/header/ui/Header.tsx` (MODIFY)

**Dependencies**: Phase 4 완료

**Estimated Effort**: Small

### Phase 6: 테스트 및 검증

**Tasks**:

1. 로그인 플로우 테스트 (Google, Kakao)
2. 회원가입 플로우 테스트
3. 토큰 갱신 테스트 (401 시나리오)
4. 로그아웃 테스트
5. 빌드 및 린트 검증

**Estimated Effort**: Medium

### Vercel React Best Practices

**해당 없음**: 이 리팩토링은 인증 로직 변경으로, React 렌더링 성능과 직접 관련 없음

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 타입: E2E (수동)
- 테스트 케이스:
  - Google 로그인 → 메인 페이지 이동
  - Kakao 로그인 → 메인 페이지 이동
  - 신규 회원 → 온보딩 → 메인 페이지 이동
  - 페이지 새로고침 → 인증 상태 유지
  - 토큰 만료 → 자동 갱신 → 요청 재시도
  - 로그아웃 → 로그인 페이지 이동

**TS-2**: 빌드 및 타입 체크

```bash
pnpm run build        # 빌드 성공 필수
npx tsc --noEmit      # 타입 오류 없음
pnpm run lint         # 린트 통과
```

### Acceptance Criteria

- [ ] Axios 인스턴스에 `withCredentials: true` 설정
- [ ] OAuth 콜백에서 인가 코드만 백엔드로 전송
- [ ] localStorage 토큰 저장/조회 로직 제거
- [ ] 토큰 갱신 로직을 쿠키 기반으로 변경
- [ ] 인증 상태 확인 방식 변경
- [ ] 로그아웃 시 서버에서 쿠키 삭제
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] Google 소셜 로그인 정상 동작
- [ ] Kakao 소셜 로그인 정상 동작
- [ ] 신규 회원 온보딩 플로우 정상 동작
- [ ] 로그아웃 정상 동작
- [ ] 페이지 새로고침 시 인증 상태 유지
- [ ] 401 에러 시 토큰 갱신 및 재시도

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] token.ts 파일 완전 삭제

---

## 6. Risks & Dependencies

### Risks

**R-1**: 백엔드 API 호환성

- **Risk**: 백엔드 API가 예상과 다르게 동작할 수 있음
- **Impact**: HIGH
- **Probability**: LOW
- **Mitigation**: API 스펙 문서 사전 확인, 백엔드 개발자와 협의
- **Status**: 백엔드 API 변경 완료 가정

**R-2**: CORS 설정

- **Risk**: `withCredentials: true` 사용 시 CORS 설정 필요
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**: 백엔드에서 `Access-Control-Allow-Credentials: true` 설정 확인
- **Status**: 백엔드 담당

**R-3**: 로컬 개발 환경

- **Risk**: localhost에서 Secure 쿠키 사용 불가
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 개발 환경에서 Secure 플래그 제거 요청
- **Status**: 백엔드 담당

### Dependencies

**D-1**: 백엔드 API 변경

- **Dependency**: 쿠키 기반 인증 API 완료
- **Required For**: 전체 작업
- **Status**: AVAILABLE (가정)

**D-2**: CORS 설정

- **Dependency**: 백엔드 CORS 설정
- **Required For**: API 호출
- **Status**: AVAILABLE (가정)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**단일 배포**:

- 모든 변경사항을 하나의 PR로 배포
- 기능 플래그 없이 전체 교체

**Rollback Plan**:

- 문제 발생 시 이전 커밋으로 롤백
- localStorage 기반 코드 복구 (git revert)

### Success Metrics

**SM-1**: 로그인 성공률

- **Metric**: 소셜 로그인 성공/실패 비율
- **Target**: 기존과 동일하거나 향상

**SM-2**: 보안 강화

- **Metric**: localStorage에 토큰 저장 여부
- **Target**: 토큰이 localStorage에 없음

---

## 8. Timeline & Milestones

### Milestones

**M1**: Axios 설정 및 토큰 저장소 제거

- Phase 1, 2 완료
- 빌드 성공 확인

**M2**: OAuth 및 인증 플로우 변경

- Phase 3, 4 완료
- 로그인/로그아웃 동작 확인

**M3**: UI 수정 및 최종 검증

- Phase 5, 6 완료
- 모든 테스트 통과

---

## 9. References

### Related Issues

- Issue #90: [인증 방식을 localStorage에서 쿠키 기반으로 변경](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/90)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md)

### External Resources

- [MDN: Cookies and CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [Axios withCredentials](https://axios-http.com/docs/req_config)
- [OWASP: Session Management](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/06-Session_Management_Testing/02-Testing_for_Cookies_Attributes)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-04
**Next Action**: Phase 1 시작 - Axios 설정 변경
