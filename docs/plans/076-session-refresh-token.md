# Task Plan: 로그인 세션 종료 처리 및 리프래시 토큰 사용

**Issue**: #76
**Type**: Feature
**Created**: 2026-02-02
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 인증 시스템에서 accessToken만 API 요청에 사용하고, refreshToken을 활용한 토큰 갱신 로직이 없어 다음과 같은 문제가 발생합니다:

- accessToken 만료 시 사용자가 갑자기 로그아웃되거나 API 요청이 실패함
- 세션 만료 시 적절한 에러 핸들링 없이 API 요청이 계속 실패
- `src/shared/api/instance.ts`에 response interceptor가 없어 401 에러 처리가 되지 않음

### Objectives

1. accessToken 만료 시 refreshToken을 사용하여 자동으로 토큰 갱신
2. 토큰 갱신 실패 시 (refreshToken도 만료) 자동 로그아웃 처리 및 로그인 페이지로 리다이렉트
3. 401 에러 발생 시 적절한 핸들링 (토큰 갱신 시도 → 실패 시 로그아웃)
4. 토큰 갱신 중 중복 요청 방지 (동시에 여러 API 요청이 401을 받았을 때)

### Scope

**In Scope**:

- Axios response interceptor에서 401 에러 감지 및 토큰 갱신 로직 구현
- refreshToken을 사용한 accessToken 갱신 API 연동
- 토큰 갱신 실패 시 자동 로그아웃 및 로그인 페이지 리다이렉트
- 토큰 갱신 중 중복 요청 방지 (Promise queue 사용)
- 로그아웃 시 서버 API 호출하여 refreshToken 무효화

**Out of Scope**:

- 토큰 만료 전 선제적 갱신 (preemptive refresh)
- JWT 디코딩을 통한 만료 시간 체크
- 토큰 만료 타이머 설정

---

## 2. Requirements

### Functional Requirements

**FR-1**: 401 에러 발생 시 자동 토큰 갱신

- API 요청 시 401 Unauthorized 응답을 받으면 refreshToken으로 새 토큰 발급
- 새 토큰 발급 성공 시 원래 요청을 재시도
- 실패한 원래 요청은 새 accessToken으로 다시 시도

**FR-2**: 토큰 갱신 중복 요청 방지

- 동시에 여러 API 요청이 401을 받았을 때 토큰 갱신은 한 번만 수행
- 나머지 요청들은 갱신 완료 후 새 토큰으로 재시도

**FR-3**: 토큰 갱신 실패 시 로그아웃

- refreshToken도 만료되어 갱신 실패 시 자동 로그아웃
- localStorage 토큰 삭제 및 인증 상태 초기화
- 로그인 페이지(`/signin`)로 리다이렉트

**FR-4**: 로그아웃 시 서버 토큰 무효화

- 로그아웃 시 서버 API를 호출하여 refreshToken 무효화
- 서버 호출 실패 시에도 클라이언트 토큰은 삭제

### Technical Requirements

**TR-1**: Axios Response Interceptor 구현

- `src/shared/api/instance.ts`에 response interceptor 추가
- 401 에러 감지 및 토큰 갱신 로직 포함

**TR-2**: FSD 아키텍처 준수

- 토큰 갱신 로직은 `src/features/auth/lib/` 또는 `src/shared/api/`에 배치
- Zustand store 직접 접근이 필요한 로직 분리

**TR-3**: 기존 API 활용

- 이미 생성된 `getApi().refreshToken()` 사용
- 이미 생성된 `getApi().logout()` 사용

### Non-Functional Requirements

**NFR-1**: 사용자 경험

- 토큰 갱신은 사용자에게 보이지 않게 백그라운드에서 처리
- 갱신 중 추가 요청도 대기 후 정상 처리

**NFR-2**: 보안

- refreshToken 만료 시 즉시 로그아웃하여 보안 유지
- 로그아웃 시 서버에서 refreshToken 무효화

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── shared/
│   └── api/
│       ├── instance.ts              # MODIFY: response interceptor 추가
│       └── generated/index.ts       # 기존 API (refreshToken, logout)
└── features/
    └── auth/
        ├── lib/
        │   ├── token.ts             # 기존 토큰 저장/조회
        │   └── refresh.ts           # CREATE: 토큰 갱신 로직
        ├── model/
        │   └── store.ts             # MODIFY: forceLogout 액션 추가
        └── api/
            └── auth.mutations.ts    # 기존 mutation hooks
```

### Design Decisions

**Decision 1**: Response Interceptor에서 토큰 갱신 처리

- **Rationale**: 모든 API 요청에 대해 일관된 401 처리가 필요
- **Approach**: Axios response interceptor에서 401 감지 → 토큰 갱신 → 원래 요청 재시도
- **Trade-offs**: interceptor 로직이 복잡해지지만, 각 API 호출마다 에러 처리를 반복하지 않아도 됨
- **Alternatives Considered**: React Query의 onError에서 처리 → 일관성 부족, 코드 중복
- **Impact**: HIGH

**Decision 2**: 토큰 갱신 로직을 별도 파일로 분리 (`refresh.ts`)

- **Rationale**: 순환 의존성 방지 (instance.ts ↔ store.ts)
- **Implementation**: `refresh.ts`에서 토큰 갱신 로직 관리, instance.ts에서 import
- **Benefit**: 테스트 용이성, 관심사 분리

**Decision 3**: Promise Queue 패턴으로 중복 요청 방지

- **Rationale**: 동시에 여러 401 에러 발생 시 토큰 갱신은 한 번만 수행
- **Implementation**: `isRefreshing` 플래그와 `failedQueue` 배열 사용
- **Benefit**: 불필요한 토큰 갱신 API 호출 방지, 서버 부하 감소

### Component Design

**토큰 갱신 플로우**:

```
API Request
    ↓
Response 401?
    ├─ NO → Return Response
    └─ YES → Is Refreshing?
              ├─ YES → Add to Queue → Wait for Refresh
              └─ NO → Set isRefreshing = true
                       ↓
                    Call refreshToken API
                       ↓
                    Success?
                       ├─ YES → Update Tokens
                       │         ↓
                       │        Process Queue (retry all)
                       │         ↓
                       │        Retry Original Request
                       └─ NO → Clear Tokens
                                ↓
                               Reject Queue
                                ↓
                               Force Logout + Redirect
```

**핵심 로직 의사코드**:

```typescript
// src/features/auth/lib/refresh.ts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

function processQueue(error: Error | null, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

export async function handleTokenRefresh(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = getRefreshToken();
    const response = await refreshTokenApi(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = response.result;

    setTokens(accessToken, newRefreshToken);
    processQueue(null, accessToken);

    return accessToken;
  } catch (error) {
    processQueue(error, null);
    forceLogout();
    throw error;
  } finally {
    isRefreshing = false;
  }
}
```

### Data Models

```typescript
// 기존 API 응답 타입 (generated/index.ts)
interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface LogoutRequest {
  refreshToken: string;
}

// 토큰 갱신 큐 아이템
interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}
```

### API Design

**토큰 갱신 API** (이미 존재):

- Endpoint: `POST /api/v1/auth/token/refresh`
- Request: `{ refreshToken: string }`
- Response: `{ accessToken: string, refreshToken: string }`

**로그아웃 API** (이미 존재):

- Endpoint: `POST /api/v1/auth/logout`
- Request: `{ refreshToken: string }`
- Response: 성공 응답

---

## 4. Implementation Plan

### Phase 1: 토큰 갱신 로직 구현

**Tasks**:

1. `src/features/auth/lib/refresh.ts` 생성 - 토큰 갱신 핵심 로직
2. Promise queue 패턴 구현 (isRefreshing, failedQueue)
3. 토큰 갱신 성공/실패 시 콜백 처리

**Files to Create/Modify**:

- `src/features/auth/lib/refresh.ts` (CREATE)

**Estimated Effort**: Medium

### Phase 2: Response Interceptor 구현

**Tasks**:

1. `src/shared/api/instance.ts`에 response interceptor 추가
2. 401 에러 감지 시 토큰 갱신 로직 호출
3. 원래 요청 재시도 로직 구현

**Files to Create/Modify**:

- `src/shared/api/instance.ts` (MODIFY)

**Dependencies**: Phase 1 완료 필요

**Estimated Effort**: Medium

### Phase 3: 로그아웃 개선

**Tasks**:

1. `src/features/auth/model/store.ts`에 forceLogout 액션 추가
2. 로그아웃 시 서버 API 호출 로직 추가
3. 리다이렉트 로직 구현

**Files to Create/Modify**:

- `src/features/auth/model/store.ts` (MODIFY)

**Dependencies**: Phase 1, Phase 2 완료 필요

**Estimated Effort**: Small

### Phase 4: 검증 및 테스트

**Tasks**:

1. 빌드 및 타입 체크
2. 수동 테스트 (토큰 만료 시나리오)

**Files to Create/Modify**:

- 없음 (검증만)

**Estimated Effort**: Small

### Vercel React Best Practices

이 작업에 해당하는 React 컴포넌트 변경이 없으므로, 해당 사항 없음.

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

**TS-2**: 수동 테스트 시나리오

1. 정상 API 요청 → 성공 (기존 동작 유지)
2. 401 에러 발생 → 토큰 갱신 → 원래 요청 재시도 성공
3. 401 에러 + refreshToken 만료 → 로그아웃 → `/signin` 리다이렉트
4. 동시 다중 401 에러 → 토큰 갱신 1회만 수행 → 모든 요청 재시도 성공

### Acceptance Criteria

- [x] Axios response interceptor에서 401 에러 감지 및 토큰 갱신 로직 구현
- [x] refreshToken을 사용한 accessToken 갱신 API 연동
- [x] 토큰 갱신 실패 시 자동 로그아웃 및 로그인 페이지 리다이렉트
- [x] 토큰 갱신 중 중복 요청 방지 (Promise queue 사용)
- [x] 빌드 성공 및 타입 에러 없음

### Validation Checklist

**기능 동작**:

- [ ] 401 에러 시 토큰 갱신 후 원래 요청 재시도
- [ ] 동시 다중 요청 시 갱신 1회만 수행
- [ ] refreshToken 만료 시 로그아웃 및 리다이렉트

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거

---

## 6. Risks & Dependencies

### Risks

**R-1**: 순환 의존성 발생 가능

- **Risk**: instance.ts → store.ts → instance.ts 순환 참조
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**: 토큰 갱신 로직을 별도 파일(`refresh.ts`)로 분리하여 의존성 체인 단절
- **Status**: 계획에 반영됨

**R-2**: 토큰 갱신 중 무한 루프

- **Risk**: 갱신 요청 자체가 401을 반환할 경우 무한 루프
- **Impact**: HIGH
- **Probability**: LOW
- **Mitigation**: 갱신 요청에는 interceptor를 적용하지 않거나, 특정 URL 예외 처리

### Dependencies

**D-1**: 백엔드 토큰 갱신 API

- **Dependency**: `POST /api/v1/auth/token/refresh` 정상 동작
- **Required For**: 토큰 갱신 기능 전체
- **Status**: AVAILABLE (이미 구현됨)

**D-2**: 백엔드 로그아웃 API

- **Dependency**: `POST /api/v1/auth/logout` 정상 동작
- **Required For**: 서버 토큰 무효화
- **Status**: AVAILABLE (이미 구현됨)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Rollout**:

1. PR 생성 및 코드 리뷰
2. 개발 환경에서 수동 테스트
3. 메인 브랜치 머지 후 Vercel 배포

**Rollback Plan**:

- 문제 발생 시 해당 커밋 revert
- 기존 동작 (401 에러 시 그냥 실패) 복원

### Success Metrics

**SM-1**: 세션 만료로 인한 사용자 이탈 감소

- **Metric**: 401 에러 후 성공적으로 재시도된 요청 비율
- **Target**: 90% 이상

**SM-2**: 불필요한 로그아웃 감소

- **Metric**: 사용자가 수동으로 로그인해야 하는 횟수
- **Target**: refreshToken 만료 시에만 로그아웃

---

## 8. Timeline & Milestones

### Milestones

**M1**: 토큰 갱신 로직 구현 완료

- refresh.ts 생성 및 Promise queue 패턴 구현
- **Status**: NOT_STARTED

**M2**: Response Interceptor 통합 완료

- instance.ts에 interceptor 추가 및 동작 확인
- **Status**: NOT_STARTED

**M3**: 전체 기능 완료 및 검증

- 로그아웃 개선 + 빌드/타입 체크 통과
- **Status**: NOT_STARTED

### Estimated Timeline

- **Phase 1 (토큰 갱신 로직)**: Small
- **Phase 2 (Response Interceptor)**: Medium
- **Phase 3 (로그아웃 개선)**: Small
- **Phase 4 (검증)**: Small

---

## 9. References

### Related Issues

- Issue #76: [로그인 세션 종료 처리 및 리프래시 토큰 사용](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/76)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [Axios Interceptors Documentation](https://axios-http.com/docs/interceptors)
- [JWT Refresh Token Best Practices](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/)

### Key Files

- `src/shared/api/instance.ts` - Axios 인스턴스
- `src/features/auth/lib/token.ts` - 토큰 저장/조회
- `src/features/auth/model/store.ts` - 인증 상태 관리
- `src/shared/api/generated/index.ts` - API 정의 (refreshToken, logout)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.
> 작업 중에는 비워두고, 완료 후 자동 생성됩니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-02
**Next Action**: 사용자 승인 후 구현 시작
