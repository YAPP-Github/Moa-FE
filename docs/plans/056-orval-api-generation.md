# Task Plan: Orval을 통한 API 클라이언트 자동 생성 설정

**Issue**: #56
**Type**: Chore
**Created**: 2026-01-31
**Status**: Planning

---

## 1. Overview

### Problem Statement

- 현재 백엔드 API(28개 엔드포인트)가 OpenAPI 3.0.3 스펙으로 문서화되어 있지만, 프론트엔드에서 수동으로 API 타입과 함수를 작성해야 함
- 수동 작성 시 백엔드 변경에 따른 동기화가 어렵고, 타입 안전성 확보가 어려움
- Orval을 사용하여 OpenAPI 스펙에서 TypeScript 타입과 API 함수를 자동 생성하여 개발 효율성과 타입 안전성 확보

### Objectives

1. Orval 패키지 설치 및 설정 파일 생성
2. OpenAPI 스펙에서 API 함수 + TypeScript 타입 자동 생성
3. `npm run generate:api` 스크립트로 쉽게 재생성 가능하도록 설정

### Scope

**In Scope**:

- Orval 및 Axios 패키지 설치
- `orval.config.ts` 설정 파일 생성
- Custom Axios instance 설정
- `src/shared/api/generated/` 디렉토리에 API 클라이언트 생성
- package.json 스크립트 추가

**Out of Scope**:

- React Query 훅 자동 생성 (추후 필요 시 별도 이슈)
- MSW 목 생성 (추후 필요 시 별도 이슈)
- API 에러 핸들링 공통화 (별도 이슈)

### User Context

> "Orval을 통해 api 자동 생성, HTTP 클라이언트: Axios, API 함수 + 타입만, 경로: src/shared/api/generated"

**핵심 요구사항**:

1. Axios 기반 API 클라이언트 생성
2. React Query 훅 없이 순수 API 함수 + 타입만 생성
3. FSD 구조의 `src/shared/api/generated/`에 배치

---

## 2. Requirements

### Functional Requirements

**FR-1**: API 클라이언트 자동 생성

- OpenAPI 스펙 URL에서 TypeScript API 함수 자동 생성
- 28개 엔드포인트에 대한 타입 안전한 함수 생성
- 6개 컨트롤러별로 그룹화: Health, Auth, Member, RetroRoom, Retrospect, Response

**FR-2**: 재생성 스크립트

- `pnpm run generate:api` 명령어로 언제든지 재생성 가능
- 백엔드 API 변경 시 쉽게 동기화

### Technical Requirements

**TR-1**: Orval 설정

- Orval v7 사용 (최신 버전)
- `defineConfig` 사용하여 타입 안전한 설정
- OpenAPI 스펙 URL: `https://api.moaofficial.kr/api-docs/openapi.json`

**TR-2**: Axios Custom Instance

- Base URL 설정 가능한 커스텀 Axios 인스턴스
- 인터셉터 추가 가능한 구조 (토큰 갱신, 에러 핸들링 등)

**TR-3**: FSD 아키텍처 준수

- 생성 경로: `src/shared/api/generated/`
- Custom instance: `src/shared/api/instance.ts`

### Non-Functional Requirements

**NFR-1**: 개발자 경험

- 타입 자동 완성 지원
- API 변경 시 TypeScript 컴파일 에러로 즉시 감지

**NFR-2**: 유지보수성

- 설정 파일 단일화 (orval.config.ts)
- 생성된 코드 직접 수정 금지 (재생성 시 덮어씀)

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── shared/
│   └── api/
│       ├── instance.ts              # Custom Axios instance (CREATE)
│       └── generated/               # Orval 생성 파일들 (AUTO-GENERATED)
│           ├── index.ts             # 모든 API export
│           ├── health/
│           │   └── health.ts
│           ├── auth/
│           │   └── auth.ts
│           ├── member/
│           │   └── member.ts
│           ├── retro-room/
│           │   └── retro-room.ts
│           ├── retrospect/
│           │   └── retrospect.ts
│           └── response/
│               └── response.ts
├── orval.config.ts                  # Orval 설정 (CREATE)
└── package.json                     # 스크립트 추가 (MODIFY)
```

### Design Decisions

**Decision 1**: 태그별 파일 분리 (mode: 'tags-split')

- **Rationale**: 6개 컨트롤러(Health, Auth, Member, RetroRoom, Retrospect, Response)를 각각 별도 파일로 분리하여 관리 용이
- **Approach**: Orval의 `mode: 'tags-split'` 옵션 사용
- **Trade-offs**: 파일 수 증가 vs 모듈화된 구조
- **Alternatives Considered**: 단일 파일 생성 (mode: 'single') - 파일이 너무 커짐
- **Impact**: MEDIUM

**Decision 2**: Custom Axios Instance 사용

- **Rationale**: 토큰 갱신, 에러 핸들링 등 공통 로직 추가 가능
- **Implementation**: `src/shared/api/instance.ts`에 커스텀 인스턴스 정의
- **Benefit**: 모든 API 호출에 일관된 설정 적용

**Decision 3**: React Query 훅 미생성

- **Rationale**: 사용자 요청에 따라 순수 API 함수만 생성
- **Implementation**: `client: 'axios'` 설정 (swr, react-query 등 클라이언트 훅 미사용)
- **Benefit**: 가벼운 번들 크기, 유연한 사용

### Component Design

**Custom Axios Instance**:

```typescript
// src/shared/api/instance.ts
import Axios, { type AxiosRequestConfig } from "axios";

export const axiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://api.moaofficial.kr",
});

// Orval mutator function
export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const promise = axiosInstance({ ...config }).then(({ data }) => data);
  return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
```

**사용 플로우**:

```
Component
    ↓
Generated API Function (e.g., postApiV1AuthLogin)
    ↓
customInstance (Axios wrapper)
    ↓
axiosInstance (with baseURL, interceptors)
    ↓
Backend API
```

### Data Models

Orval이 자동 생성하는 타입 예시:

```typescript
// 생성될 타입 예시 (auto-generated)
export interface LoginRequest {
  provider: "GOOGLE" | "KAKAO";
  accessToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
}
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. Orval 및 Axios 패키지 설치
2. TypeScript 타입 패키지 설치 (@types/node 이미 있음)

**Commands**:

```bash
pnpm add axios
pnpm add -D orval
```

**Files to Create/Modify**:

- `package.json` (MODIFY) - dependencies 추가

**Estimated Effort**: Small

### Phase 2: Core Implementation

**Tasks**:

1. Custom Axios instance 생성
2. Orval 설정 파일 생성
3. package.json에 generate:api 스크립트 추가
4. API 클라이언트 생성 실행

**Files to Create/Modify**:

- `src/shared/api/instance.ts` (CREATE)
- `orval.config.ts` (CREATE)
- `package.json` (MODIFY) - scripts 추가

**Dependencies**: Phase 1 완료 필요

### Phase 3: Validation & Polish

**Tasks**:

1. 생성된 코드 확인
2. 빌드 성공 확인
3. .gitignore 확인 (generated 폴더 포함 여부 결정)

**Files to Create/Modify**:

- `.gitignore` (MODIFY, 선택사항)

### Vercel React Best Practices

이 작업은 설정 작업이므로 직접적인 React 규칙 적용 없음.

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 생성 코드 검증

- 테스트 타입: Manual
- 검증 방법: 생성된 파일 구조 및 타입 확인

**TS-2**: 빌드 및 타입 체크

```bash
pnpm run build        # 빌드 성공 필수
npx tsc --noEmit      # 타입 오류 없음
pnpm run lint         # 린트 통과
```

### Acceptance Criteria

- [x] Orval 패키지 설치 (`orval`, `axios`)
- [ ] `orval.config.ts` 설정 파일 생성
- [ ] `pnpm run generate:api` 스크립트 추가
- [ ] API 클라이언트 생성 확인 (타입 + 함수)
- [ ] 빌드 성공 확인

### Validation Checklist

**기능 동작**:

- [ ] `pnpm run generate:api` 명령어 정상 동작
- [ ] 6개 컨트롤러별 파일 생성 확인
- [ ] 타입 import 가능 확인

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: OpenAPI 스펙 URL 접근 불가

- **Risk**: 외부 URL이므로 네트워크 이슈 또는 서버 다운 시 생성 불가
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 로컬에 스펙 파일 백업 또는 CI/CD에서 캐싱

**R-2**: OpenAPI 스펙 불일치

- **Risk**: 백엔드 스펙과 실제 API 동작 불일치 가능성
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 백엔드팀과 스펙 동기화 협의

### Dependencies

**D-1**: OpenAPI 스펙 접근

- **Dependency**: `https://api.moaofficial.kr/api-docs/openapi.json`
- **Required For**: API 클라이언트 생성
- **Status**: AVAILABLE

**D-2**: Node.js 환경

- **Dependency**: Node.js >= 22.12.0
- **Status**: AVAILABLE (package.json에 명시됨)

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. PR 머지 후 생성된 코드 포함하여 배포
2. 향후 백엔드 API 변경 시 `pnpm run generate:api` 실행 후 커밋

### Success Metrics

**SM-1**: API 타입 안전성

- **Metric**: TypeScript 컴파일 에러 발생 시 API 불일치 감지
- **Target**: 100% 타입 커버리지
- **Measurement**: tsc --noEmit 통과

---

## 8. Timeline & Milestones

### Milestones

**M1**: 패키지 설치 및 설정 파일 생성

- Orval, Axios 설치
- orval.config.ts 생성
- **Status**: NOT_STARTED

**M2**: API 클라이언트 생성 완료

- generate:api 스크립트 동작
- 빌드 성공
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #56: [Orval을 통한 API 클라이언트 자동 생성 설정](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/56)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [Orval 공식 문서](https://orval.dev/)
- [Orval Configuration Reference](https://orval.dev/reference/configuration/output)
- [Orval Custom Axios Guide](https://orval.dev/guides/custom-axios)
- [OpenAPI 스펙](https://api.moaofficial.kr/api-docs/openapi.json)
- [Swagger UI](https://api.moaofficial.kr/swagger-ui/index.html)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-01-31
**Next Action**: 사용자 승인 후 구현 시작
