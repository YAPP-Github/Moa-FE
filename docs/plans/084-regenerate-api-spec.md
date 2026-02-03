# Task Plan: API Spec 재생성

**Issue**: #84
**Type**: Chore
**Created**: 2026-02-03
**Status**: Planning

---

## 1. Overview

### Problem Statement

백엔드 API 스펙이 업데이트되어 프론트엔드의 TypeScript 타입 정의와 API 클라이언트 코드가 최신 상태와 동기화되지 않았습니다.

- 현재 상황: `src/shared/api/generated/index.ts` 파일이 이전 버전의 OpenAPI 스펙을 기반으로 생성됨
- 문제점: 새로운 API 엔드포인트나 변경된 타입이 프론트엔드에 반영되지 않음
- 영향: 타입 불일치로 인한 런타임 에러 가능성, 새 API 기능 사용 불가

### Objectives

1. Orval을 사용하여 최신 OpenAPI 스펙에서 TypeScript 타입 및 API 클라이언트 코드 재생성
2. 생성된 코드가 빌드 및 타입 체크를 통과하도록 검증
3. 기존 코드와의 호환성 확인

### Scope

**In Scope**:

- `pnpm generate:api` 명령어 실행
- 생성된 `src/shared/api/generated/index.ts` 파일 검증
- 빌드, 타입 체크, 린트 통과 확인
- 타입 변경으로 인한 기존 코드 수정 (필요시)

**Out of Scope**:

- 백엔드 API 스펙 변경
- 새로운 API 엔드포인트 활용 구현
- UI 변경

---

## 2. Requirements

### Functional Requirements

**FR-1**: API 타입 재생성

- `pnpm generate:api` 실행하여 최신 OpenAPI 스펙 반영
- `src/shared/api/generated/index.ts` 파일 업데이트

**FR-2**: 수동 타입 추가 유지

- `SocialType` 타입과 `BaseResponse` 인터페이스가 생성 후에도 유지되어야 함
- sed 스크립트로 자동 추가됨

### Technical Requirements

**TR-1**: Orval 설정

- `orval.config.ts` 설정 기반으로 생성
- OpenAPI 스펙 URL: `${VITE_API_BASE_URL}/api-docs/openapi.json`
- Axios 클라이언트 + custom mutator 사용

**TR-2**: 품질 검증

- `pnpm build` 성공
- `npx tsc --noEmit` 타입 에러 없음
- `pnpm lint` 통과

### Non-Functional Requirements

**NFR-1**: 하위 호환성

- 기존 16개 파일에서 사용하는 타입과 함수가 호환되어야 함
- 타입 변경 시 해당 파일 수정 필요

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/api/
├── instance.ts              # Axios 인스턴스 (변경 없음)
└── generated/
    └── index.ts             # REGENERATE - Orval 생성 파일
```

### Design Decisions

**Decision 1**: 기존 생성 스크립트 사용

- **Rationale**: `pnpm generate:api` 스크립트가 이미 수동 타입 추가 + lint/format을 포함
- **Implementation**: 기존 npm 스크립트 실행
- **Benefit**: 일관된 생성 프로세스, 수동 작업 최소화

### Data Models

**의존하는 주요 타입들** (16개 파일에서 사용):

```typescript
// API 요청/응답 타입
SignupRequest, JoinRetroRoomRequest, RetroRoomCreateRequest;
CreateRetrospectRequest, DraftSaveRequest, SubmitRetrospectRequest;

// 데이터 모델 타입
RetroRoomListItem, RetrospectListItem, RetrospectDetailResponse;
RetrospectMethod, ResponseCategory, StorageRangeFilter;

// API 함수
getApi().listRetroRooms();
getApi().createRetroRoom();
getApi().listRetrospects();
// ... 등 30+ API 함수
```

---

## 4. Implementation Plan

### Phase 1: API 스펙 재생성

**Tasks**:

1. 환경 변수 확인 (`VITE_API_BASE_URL` 설정됨)
2. `pnpm generate:api` 실행
3. 생성된 파일 변경 내용 확인

**Files to Modify**:

- `src/shared/api/generated/index.ts` (REGENERATE)

**Estimated Effort**: Small

### Phase 2: 호환성 검증 및 수정

**Tasks**:

1. `pnpm build` 실행하여 빌드 에러 확인
2. `npx tsc --noEmit` 실행하여 타입 에러 확인
3. `pnpm lint` 실행하여 린트 에러 확인
4. 에러 발생 시 의존 파일 수정

**Potential Files to Modify** (타입 변경 시):

- `src/features/auth/api/auth.mutations.ts`
- `src/features/team/api/team.queries.ts`
- `src/features/team/api/team.mutations.ts`
- `src/features/retrospective/api/retrospective.queries.ts`
- `src/features/retrospective/api/retrospective.mutations.ts`
- `src/features/retrospective/model/constants.ts`
- `src/features/retrospective/model/schema.ts`
- `src/features/retrospective/ui/*.tsx`
- `src/widgets/header/ui/Header.tsx`
- `src/widgets/sidebar/ui/SidebarTeamItem.tsx`

**Dependencies**: Phase 1 완료 필요

### Phase 3: 최종 검증

**Tasks**:

1. 전체 빌드 성공 확인
2. 타입 체크 통과 확인
3. 린트 통과 확인

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
pnpm generate:api  # API 스펙 재생성
pnpm build         # 빌드 성공 필수
npx tsc --noEmit   # 타입 오류 없음
pnpm lint          # 린트 통과
```

### Acceptance Criteria

- [x] `pnpm generate:api` 실행 완료
- [ ] `pnpm build` 성공
- [ ] `npx tsc --noEmit` 타입 에러 없음
- [ ] `pnpm lint` 통과

### Validation Checklist

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 생성된 파일에 `SocialType`, `BaseResponse` 수동 타입 포함

---

## 6. Risks & Dependencies

### Risks

**R-1**: 타입 변경으로 인한 기존 코드 영향

- **Risk**: 백엔드 API 스펙 변경 시 기존 타입과 호환되지 않을 수 있음
- **Impact**: MEDIUM
- **Probability**: MEDIUM
- **Mitigation**: 빌드/타입 체크로 조기 발견, 필요시 기존 코드 수정

**R-2**: 환경 변수 접근 실패

- **Risk**: `VITE_API_BASE_URL`이 설정되지 않거나 백엔드 서버 접근 불가
- **Impact**: HIGH
- **Probability**: LOW
- **Mitigation**: `.env` 파일 확인, 백엔드 서버 상태 확인

### Dependencies

**D-1**: 백엔드 OpenAPI 스펙

- **Dependency**: `${VITE_API_BASE_URL}/api-docs/openapi.json`
- **Required For**: API 코드 생성
- **Status**: AVAILABLE

**D-2**: Orval 패키지

- **Dependency**: `orval@8.2.0`
- **Required For**: TypeScript 코드 생성
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 로컬에서 API 재생성 및 검증
2. PR 생성 후 CI 통과 확인
3. 코드 리뷰 후 머지

### Success Metrics

**SM-1**: 빌드 성공

- **Metric**: 빌드 에러 0개
- **Target**: 100% 성공
- **Measurement**: `pnpm build` 결과

---

## 8. Timeline & Milestones

### Milestones

**M1**: API 스펙 재생성 완료

- `pnpm generate:api` 성공
- **Status**: NOT_STARTED

**M2**: 품질 검증 통과

- 빌드, 타입 체크, 린트 모두 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #84: [API Spec 재생성](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/84)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [orval.config.ts](../../orval.config.ts)

### External Resources

- [Orval Documentation](https://orval.dev/)
- [OpenAPI Specification](https://swagger.io/specification/)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

**Completion Date**: -
**Implemented By**: -

---

**Plan Status**: Planning
**Last Updated**: 2026-02-03
**Next Action**: `pnpm generate:api` 실행
