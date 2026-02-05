# Task Plan: 백엔드 API 변경 대응 및 클라이언트 로그인 세션 유지 기능 추가

**Issue**: #107
**Type**: Feature
**Created**: 2026-02-05
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 쿠키 기반 인증으로 전환은 완료되었으나(PR #91, #102), `initialize()` 함수가 비어있어 페이지 새로고침 시 인증 상태를 확인할 수 없습니다.

- 현재 상황: 로그인 후 페이지 새로고침 시 `isAuthenticated`가 `false`로 초기화됨
- 문제점: 사용자가 새로고침할 때마다 다시 로그인해야 함
- 해결 필요성: 서버에 인증 상태 확인 API를 호출하여 세션 유지

### Objectives

1. 앱 초기화 시 서버 API 호출로 인증 상태 확인
2. 페이지 새로고침 후에도 로그인 상태 유지
3. 백엔드 API 변경사항 대응 (필요 시)

### Scope

**In Scope**:

- `initialize()` 함수에 인증 상태 확인 로직 구현
- 서버 `/api/v1/members/me` API 호출로 인증 여부 확인
- `isLoading` 상태를 활용한 초기화 중 UI 처리
- 인증 확인 실패 시 적절한 처리

**Out of Scope**:

- OAuth 플로우 변경 (이미 완료)
- 토큰 갱신 로직 변경 (이미 401 인터셉터로 처리 중)
- 새로운 인증 방식 추가

---

## 2. Requirements

### Functional Requirements

**FR-1**: 앱 초기화 시 인증 상태 확인

- 앱이 로드될 때 서버에 인증 확인 API 호출
- 쿠키가 유효하면 `isAuthenticated: true` 설정
- 쿠키가 무효하거나 없으면 `isAuthenticated: false` 유지

**FR-2**: 초기화 중 로딩 상태 표시

- `isLoading: true` 동안 로딩 UI 표시
- 인증 확인 완료 후 `isLoading: false` 설정
- PrivateRoute에서 `isLoading` 상태 활용

**FR-3**: 인증 확인 API

- `/api/v1/members/me` 엔드포인트 호출
- 성공 시: 사용자 정보 반환 (로그인 상태)
- 실패 시 (401): 비로그인 상태

### Technical Requirements

**TR-1**: Zustand 스토어 수정

- `initialize()` 함수를 비동기로 변경
- `isLoading` 상태 활용하여 초기화 진행 상태 관리

**TR-2**: AuthProvider 수정

- `useEffect`에서 비동기 `initialize()` 호출
- 초기화 완료 대기 처리

**TR-3**: API 추가

- `/api/v1/members/me` API 호출 함수 추가
- React Query로 캐싱 고려

### Non-Functional Requirements

**NFR-1**: 사용자 경험

- 초기화 중 로딩 스피너 표시
- 빠른 응답으로 깜빡임 최소화

**NFR-2**: 에러 처리

- 네트워크 오류 시 비로그인 상태로 처리
- 서버 오류 시 조용히 실패

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── auth/
│       ├── api/
│       │   ├── auth.mutations.ts      # KEEP
│       │   └── auth.queries.ts        # CREATE: /me API 쿼리
│       ├── model/
│       │   └── store.ts               # MODIFY: initialize() 비동기 구현
│       └── ui/
│           └── AuthProvider.tsx       # MODIFY: 비동기 초기화 처리
└── shared/
    └── api/
        └── instance.ts                # KEEP
```

### Design Decisions

**Decision 1**: `/api/v1/members/me` API 사용

- **Rationale**: 사용자 정보를 반환하는 표준 엔드포인트
- **Approach**: 성공 시 로그인 상태, 401 시 비로그인 상태로 판단
- **Trade-offs**: 매 초기화마다 서버 호출 필요하나, 보안 강화
- **Impact**: MEDIUM

**Decision 2**: `isLoading` 상태 활용

- **Rationale**: 이미 `PrivateRoute`에서 `isLoading` 체크 로직 존재
- **Approach**: 초기화 시작 시 `true`, 완료 시 `false`
- **Benefit**: 기존 UI 로직 재활용 가능
- **Impact**: LOW

### Component Design

**인증 초기화 플로우 (변경 후)**:

```
App loads
    ↓
AuthProvider mounts
    ↓
initialize() called → isLoading: true
    ↓
GET /api/v1/members/me (cookies auto-sent)
    ↓
┌─────────────────────────────────────┐
│ 200 OK                              │ 401 Unauthorized
│    ↓                                │    ↓
│ isAuthenticated: true               │ isAuthenticated: false
└─────────────────────────────────────┘
    ↓
isLoading: false
    ↓
PrivateRoute renders children or redirects
```

### Data Models

```typescript
// 사용자 정보 응답 (예상)
interface MemberResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
    profileImageUrl?: string;
  };
}
```

### API Design

**사용자 정보 조회**: `GET /api/v1/members/me`

```json
// Request: body 없음 (access_token은 쿠키로 전송)

// Response (200 OK)
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "성공",
  "result": {
    "memberId": 1,
    "email": "user@example.com",
    "nickname": "홍길동",
    "profileImageUrl": "https://..."
  }
}

// Response (401 Unauthorized)
{
  "isSuccess": false,
  "code": "AUTH401",
  "message": "인증이 필요합니다"
}
```

---

## 4. Implementation Plan

### Phase 1: API 함수 추가

**Tasks**:

1. `auth.queries.ts` 파일 생성
2. `fetchCurrentMember()` 함수 구현

**Files to Create**:

- `src/features/auth/api/auth.queries.ts` (CREATE)

**Estimated Effort**: Small

### Phase 2: 스토어 수정

**Tasks**:

1. `initialize()` 함수를 비동기로 변경
2. 서버 API 호출 및 인증 상태 설정
3. `isLoading` 상태 관리

**Files to Modify**:

- `src/features/auth/model/store.ts` (MODIFY)

**Dependencies**: Phase 1 완료

**Estimated Effort**: Medium

### Phase 3: AuthProvider 수정

**Tasks**:

1. 비동기 `initialize()` 호출 처리
2. 초기화 완료 대기

**Files to Modify**:

- `src/features/auth/ui/AuthProvider.tsx` (MODIFY)

**Dependencies**: Phase 2 완료

**Estimated Effort**: Small

### Phase 4: 테스트 및 검증

**Tasks**:

1. 페이지 새로고침 시 인증 상태 유지 확인
2. 로그아웃 후 새로고침 시 비로그인 상태 확인
3. 빌드 및 린트 검증

**Estimated Effort**: Medium

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 케이스:
  - 로그인 → 새로고침 → 로그인 상태 유지
  - 로그아웃 → 새로고침 → 로그인 페이지 이동
  - 쿠키 삭제 → 새로고침 → 로그인 페이지 이동

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] 페이지 새로고침 시 인증 상태 유지
- [ ] 로그아웃 후 새로고침 시 비로그인 상태
- [ ] 초기화 중 로딩 UI 표시
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 엔드포인트 불확실

- **Risk**: `/api/v1/members/me` 엔드포인트가 존재하지 않을 수 있음
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**: 백엔드 API 스펙 확인 필요
- **Status**: 확인 필요

**R-2**: 초기화 지연

- **Risk**: API 응답이 느리면 사용자 경험 저하
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 적절한 로딩 UI 제공

### Dependencies

**D-1**: 백엔드 API

- **Dependency**: `/api/v1/members/me` 엔드포인트
- **Required For**: 인증 상태 확인
- **Status**: 확인 필요

---

## 7. Rollout & Monitoring

### Deployment Strategy

**단일 배포**:

- 모든 변경사항을 하나의 PR로 배포
- 기존 로직과 호환 유지

**Rollback Plan**:

- 문제 발생 시 `initialize()`를 빈 함수로 복구
- git revert로 롤백

### Success Metrics

**SM-1**: 세션 유지율

- **Metric**: 새로고침 후 로그인 상태 유지 여부
- **Target**: 100% (유효한 쿠키가 있는 경우)

---

## 8. Timeline & Milestones

### Milestones

**M1**: API 함수 및 스토어 수정

- Phase 1, 2 완료
- 빌드 성공 확인

**M2**: AuthProvider 수정 및 최종 검증

- Phase 3, 4 완료
- 모든 테스트 통과

---

## 9. References

### Related Issues

- Issue #107: [백엔드 API 변경 대응 및 클라이언트 로그인 세션 유지 기능 추가](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/107)
- PR #91: 쿠키 기반 인증 전환
- PR #102: 쿠키 기반 인증 빌드 오류 수정

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [docs/plans/090-auth-cookie-based.md](./090-auth-cookie-based.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-05
**Implemented By**: Claude Opus 4.5

### Changes Made

**신규 파일**:

- `src/features/auth/api/auth.queries.ts` - React Query `useProfile()` 훅 구현
  - `/api/v1/members/me` 엔드포인트 호출
  - `retry: false` (401 시 재시도 안함)
  - `staleTime: 5분` 캐싱

**수정 파일**:

- `src/features/auth/model/store.ts` - 순수 상태 관리로 리팩토링

  - `initialize()` 제거 → React Query로 이관
  - `setLoading()` 액션 추가
  - `login()`, `logout()` 시 `isLoading: false` 설정

- `src/features/auth/ui/AuthProvider.tsx` - React Query 기반 세션 확인

  - `useProfile()` 훅으로 인증 상태 확인
  - 쿼리 결과에 따라 Zustand 스토어 업데이트
  - 기존 인터셉터 로직 유지

- `src/shared/api/generated/index.ts` - 타입 정의 추가
  - `DateTime` 타입 추가 (Orval 생성 시 누락된 타입)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Changed**: 계획에서는 `initialize()`를 async로 변경하여 직접 API 호출 예정이었으나, 사용자 요청에 따라 React Query 패턴으로 변경

- **이유**: 관심사 분리 (Zustand는 순수 상태 관리, React Query는 서버 상태 관리)
- **장점**: 캐싱, 자동 재요청, 로딩/에러 상태 자동 관리

### Architecture Decision

```
Before (계획):
AuthProvider → store.initialize() → API 직접 호출

After (구현):
AuthProvider → useProfile() (React Query) → store 상태 업데이트
```

### Acceptance Criteria

- [x] 페이지 새로고침 시 인증 상태 유지
- [x] 로그아웃 후 새로고침 시 비로그인 상태
- [x] 초기화 중 로딩 UI 표시
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Follow-up Tasks

- [ ] 사용자 프로필 정보 활용 (닉네임, 프로필 이미지 등)
- [ ] staleTime 조정 (필요 시)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-05
