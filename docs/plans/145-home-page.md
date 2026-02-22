# Task Plan: 홈 페이지 개발 (MSW 모킹 + 홈 페이지 UI)

**Issue**: #145
**Type**: Feature
**Created**: 2026-02-22
**Status**: Planning

---

## 1. Overview

### Problem Statement

- 서버 API에 문제가 있어 프론트엔드 개발이 블로킹되는 상황
- 서비스 홈 페이지(랜딩 페이지)가 아직 구현되지 않음
- 개발 시 dev server와 MSW mocking을 자유롭게 전환할 수 있는 환경이 필요

### Objectives

1. MSW(Mock Service Worker) 브라우저 모킹 환경 구축
2. auth를 제외한 기존 API 전체 mock handler 작성
3. 환경변수 기반 dev server ↔ MSW 자유 전환 메커니즘 구현
4. 홈 페이지 UI 개발 (디자인 이미지 수령 후 진행)

### Scope

**In Scope**:

- MSW 설치 및 브라우저 워커 설정
- `VITE_ENABLE_MSW` 환경변수로 모킹 ON/OFF 전환
- Team API mock handlers (7개 엔드포인트)
- Retrospective API mock handlers (13개 엔드포인트)
- 현실적인 mock fixture 데이터
- 홈 페이지 UI (디자인 수령 후)

**Out of Scope**:

- Auth API 모킹 (`/api/v1/auth/*`, `/api/v1/members/*`)
- Node.js 서버 모킹 (Vitest용 — 별도 이슈)
- E2E 테스트

### User Context

> "모킹 범위는 로그인 및 auth를 제외한 기존 API 전체"
> "어쩔때는 dev server, 어쩔때는 msw mocking을 자유롭게 스위칭할 수 있도록 하고 싶어"

**핵심 요구사항**:

1. Auth API는 실제 서버 사용 (모킹 제외)
2. Team + Retrospective API는 MSW로 모킹
3. 환경변수 하나로 모킹 ON/OFF 자유 전환

---

## 2. Requirements

### Functional Requirements

**FR-1**: MSW 브라우저 워커 설정

- MSW `setupWorker` + Service Worker 등록
- 개발 환경에서만 동작 (production 번들에 포함되지 않음)

**FR-2**: 환경변수 기반 모킹 전환

- `VITE_ENABLE_MSW=true` → MSW 모킹 활성화
- `VITE_ENABLE_MSW=false` 또는 미설정 → 실제 dev server 사용
- `.env.mock` 파일로 모킹 설정 관리
- 전환 시 서버 재시작만 하면 됨

**FR-3**: Team API Mock Handlers

- `GET /api/v1/retro-rooms` — 팀 목록
- `POST /api/v1/retro-rooms` — 팀 생성
- `DELETE /api/v1/retro-rooms/:retroRoomId` — 팀 삭제/나가기
- `PATCH /api/v1/retro-rooms/:retroRoomId/name` — 팀 이름 수정
- `POST /api/v1/retro-rooms/join` — 팀 참여
- `GET /api/v1/retro-rooms/:retroRoomId/invite-code` — 초대 코드
- `GET /api/v1/retro-rooms/:retroRoomId/members` — 팀 멤버 목록

**FR-4**: Retrospective API Mock Handlers

- `GET /api/v1/retro-rooms/:retroRoomId/retrospects` — 회고 목록
- `POST /api/v1/retrospects` — 회고 생성
- `GET /api/v1/retrospects/:retrospectId` — 회고 상세
- `DELETE /api/v1/retrospects/:retrospectId` — 회고 삭제
- `GET /api/v1/retrospects/:retrospectId/export` — 회고 내보내기
- `POST /api/v1/retrospects/:retrospectId/participants` — 참여
- `POST /api/v1/retrospects/:retrospectId/submit` — 제출
- `PUT /api/v1/retrospects/:retrospectId/drafts` — 임시저장
- `GET /api/v1/retrospects/:retrospectId/responses` — 응답 목록
- `POST /api/v1/responses/:responseId/comments` — 코멘트 작성
- `GET /api/v1/responses/:responseId/comments` — 코멘트 목록
- `POST /api/v1/responses/:responseId/likes` — 좋아요 토글
- `POST /api/v1/retrospects/:retrospectId/analysis` — AI 분석
- `POST /api/v1/retrospects/:retrospectId/questions/:questionId/assistant` — AI 어시스턴트
- `GET /api/v1/retrospects/:retrospectId/references` — 참고 자료

**FR-5**: 홈 페이지 UI (디자인 수령 후 상세화)

- 서비스 소개 랜딩 페이지
- CTA → 로그인/회원가입 플로우

### Technical Requirements

**TR-1**: MSW 2.x (최신 버전)

- `msw` 패키지 설치 (devDependencies)
- `setupWorker` (브라우저 모드)
- `http` + `HttpResponse` API 사용

**TR-2**: FSD 아키텍처 준수

- Mock 관련 코드: `src/shared/api/mocks/`
- 도메인별 handler 분리: `handlers/team.ts`, `handlers/retrospective.ts`
- Fixture 데이터: `fixtures/team.ts`, `fixtures/retrospective.ts`

**TR-3**: 기존 Zod 스키마와 호환

- Mock 응답 데이터는 기존 Zod 스키마 검증을 통과해야 함
- `baseResponseSchema` 래퍼 형식 준수: `{ isSuccess, code, message, result }`

**TR-4**: Vite 환경변수 연동

- `VITE_ENABLE_MSW` 환경변수로 제어
- Dynamic import로 MSW 코드를 production 번들에서 제외

### Non-Functional Requirements

**NFR-1**: Production 번들 무영향

- MSW 관련 코드가 production 빌드에 포함되지 않아야 함
- Dynamic import + 환경변수 조건으로 tree-shaking 보장

**NFR-2**: 개발 경험

- MSW 활성화 시 콘솔에 명확한 로그 표시
- Mock 응답 데이터는 현실적이고 한국어로 작성

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/api/mocks/
├── browser.ts                  # setupWorker 설정
├── handlers/
│   ├── index.ts                # 모든 handler 통합 export
│   ├── team.ts                 # Team API handlers
│   └── retrospective.ts       # Retrospective API handlers
├── fixtures/
│   ├── team.ts                 # Team mock 데이터
│   └── retrospective.ts       # Retrospective mock 데이터
└── utils.ts                    # Mock 유틸 (baseResponse 헬퍼 등)
```

### Design Decisions

**Decision 1**: 환경변수 기반 전환 (`VITE_ENABLE_MSW`)

- **Rationale**: `.env` 파일 수정 + 서버 재시작으로 간단하게 전환
- **Approach**: `src/main.tsx`에서 dynamic import로 MSW를 조건부 로딩
- **Trade-offs**: 서버 재시작 필요하지만, 런타임 오버헤드 없음
- **Impact**: LOW — 기존 코드 변경 최소화

**Decision 2**: Mock 데이터를 fixtures로 분리

- **Rationale**: handler 로직과 데이터를 분리하여 가독성/유지보수성 향상
- **Approach**: `fixtures/` 폴더에 도메인별 mock 데이터 정의
- **Benefit**: 새 시나리오 추가 시 fixture만 수정

**Decision 3**: Auth API 패스스루

- **Rationale**: 사용자 요구사항 — 실제 인증 플로우 사용
- **Approach**: Auth 관련 엔드포인트는 handler를 정의하지 않아 실제 서버로 통과
- **Benefit**: 인증 플로우 무결성 유지

### Component Design

**MSW 초기화 플로우**:

```
main.tsx
  ↓
enableMocking() 호출
  ↓
VITE_ENABLE_MSW === 'true'?
  ├─ YES → dynamic import('./shared/api/mocks/browser')
  │         ↓
  │       worker.start({ onUnhandledRequest: 'bypass' })
  │         ↓
  │       [MSW 활성화 — auth 요청은 bypass]
  │         ↓
  │       React 앱 렌더링
  │
  └─ NO  → 바로 React 앱 렌더링
           [실제 dev server 사용]
```

**핵심 코드 — `src/main.tsx`**:

```typescript
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== 'true') {
    return;
  }

  const { worker } = await import('./shared/api/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass', // handler 없는 요청은 실제 서버로
  });
}

enableMocking().then(() => {
  createRoot(root).render(/* ... */);
});
```

**핵심 코드 — Mock Handler 패턴**:

```typescript
// shared/api/mocks/utils.ts
export function successResponse<T>(result: T, code = 'SUCCESS') {
  return HttpResponse.json({
    isSuccess: true,
    code,
    message: '성공',
    result,
  });
}

// shared/api/mocks/handlers/team.ts
export const teamHandlers = [
  http.get('/api/v1/retro-rooms', () => {
    return successResponse(fixtures.retroRooms);
  }),
  // ...
];
```

### Mock Fixture 데이터 설계

**Team Fixtures**:

- 3개 팀: "Frontend Team", "Backend Team", "Design Team"
- 각 팀에 2~4명의 멤버
- 초대 코드 포함

**Retrospective Fixtures**:

- 각 팀에 3~5개의 회고
- 상태별 분포: IN_PROGRESS 2, DRAFT 1, COMPLETED 2
- KPT, 4L, PMI 등 다양한 회고 방법
- 응답, 코멘트, 좋아요 데이터 포함

---

## 4. Implementation Plan

### Phase 1: MSW 설치 및 기반 설정

**Tasks**:

1. `msw` 패키지 설치 (`pnpm add -D msw`)
2. MSW Service Worker 초기화 (`npx msw init public/`)
3. `.env.mock` 파일 생성 (`VITE_ENABLE_MSW=true`)
4. `.env` 타입 선언에 `VITE_ENABLE_MSW` 추가
5. `src/shared/api/mocks/browser.ts` — worker 설정
6. `src/shared/api/mocks/utils.ts` — 응답 헬퍼
7. `src/main.tsx` — 조건부 MSW 초기화

**Files to Create/Modify**:

- `.env.mock` (CREATE)
- `src/shared/api/mocks/browser.ts` (CREATE)
- `src/shared/api/mocks/utils.ts` (CREATE)
- `src/shared/api/mocks/handlers/index.ts` (CREATE)
- `src/main.tsx` (MODIFY)
- `src/vite-env.d.ts` (MODIFY — `VITE_ENABLE_MSW` 타입 추가)

### Phase 2: Mock Handlers + Fixtures

**Tasks**:

1. Team fixture 데이터 작성
2. Team API handlers 구현 (7개 엔드포인트)
3. Retrospective fixture 데이터 작성
4. Retrospective API handlers 구현 (15개 엔드포인트)
5. 전체 handler 통합 및 검증

**Files to Create**:

- `src/shared/api/mocks/fixtures/team.ts` (CREATE)
- `src/shared/api/mocks/fixtures/retrospective.ts` (CREATE)
- `src/shared/api/mocks/handlers/team.ts` (CREATE)
- `src/shared/api/mocks/handlers/retrospective.ts` (CREATE)

### Phase 3: 홈 페이지 UI (디자인 수령 후)

**Tasks**: 디자인 이미지 수령 후 상세화 예정

**예상 작업**:

- `src/pages/home/ui/HomePage.tsx` (CREATE)
- 라우팅 수정: `src/app/App.tsx` (MODIFY)
- 필요 시 위젯/컴포넌트 추가

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: Mock handler에서도 직접 import 사용

**MEDIUM**:

- `rerender-memo`: 홈 페이지 컴포넌트에서 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] `VITE_ENABLE_MSW=true`로 앱 실행 시 MSW 모킹 동작
- [ ] `VITE_ENABLE_MSW` 미설정 시 실제 dev server 사용
- [ ] Auth API는 MSW 활성화 시에도 실제 서버로 통과
- [ ] Team API 7개 엔드포인트 모킹 정상 동작
- [ ] Retrospective API 15개 엔드포인트 모킹 정상 동작
- [ ] Mock 응답이 기존 Zod 스키마 검증 통과
- [ ] Production 빌드에 MSW 코드 미포함
- [ ] Build 성공 (`pnpm run build`)
- [ ] Type check 성공 (`pnpm tsc --noEmit`)
- [ ] Lint 통과 (`pnpm run lint`)

### Validation Checklist

**기능 동작**:

- [ ] MSW=true로 팀 대시보드 접근 시 mock 데이터 표시
- [ ] MSW=true로 회고 목록 조회 시 mock 데이터 표시
- [ ] MSW=false로 전환 후 실제 서버 데이터 사용 확인
- [ ] 로그인/인증 플로우 정상 동작 (모킹 상태 무관)

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 레이어 규칙 준수

---

## 6. Risks & Dependencies

### Risks

**R-1**: Service Worker 충돌

- **Risk**: 기존 Service Worker가 있을 경우 충돌 가능
- **Impact**: LOW
- **Mitigation**: 현재 프로젝트에 SW 미사용, MSW만 등록

**R-2**: Mock 데이터와 실제 API 스키마 불일치

- **Risk**: 서버 API 변경 시 mock 데이터가 outdated 될 수 있음
- **Impact**: MEDIUM
- **Mitigation**: Zod 스키마 검증으로 불일치 즉시 감지

### Dependencies

**D-1**: MSW 2.x

- **Dependency**: `msw` npm 패키지
- **Status**: AVAILABLE

**D-2**: 홈 페이지 디자인 이미지

- **Dependency**: 사용자로부터 디자인 이미지 수령
- **Required For**: Phase 3 (홈 페이지 UI)
- **Status**: BLOCKED — 사용자 제공 대기 중

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. Phase 1+2 (MSW): 개발 환경 전용 — production 배포 무관
2. Phase 3 (홈 페이지): PR 머지 후 Vercel preview 배포로 확인

---

## 8. Timeline & Milestones

### Milestones

**M1**: MSW 기반 설정 완료

- MSW 설치, worker 설정, main.tsx 연동
- 환경변수 전환 메커니즘 검증

**M2**: Mock Handlers 전체 구현

- Team + Retrospective 22개 엔드포인트 모킹 완료
- MSW=true로 전체 앱 정상 동작 확인

**M3**: 홈 페이지 UI 완료 (디자인 수령 후)

- 랜딩 페이지 구현
- 라우팅 연동

---

## 9. References

### Related Issues

- Issue #145: [홈 페이지 개발](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/145)

### Documentation

- [MSW 공식 문서 - Browser Integration](https://mswjs.io/docs/integrations/browser)
- [MSW 공식 문서 - Conditionally Enable Mocking](https://mswjs.io/docs/integrations/browser#conditionally-enable-mocking)

### Key Files

- `src/shared/api/instance.ts` — Axios customInstance
- `src/shared/api/schema.ts` — baseResponseSchema
- `src/features/team/api/team.api.ts` — Team API (7 endpoints)
- `src/features/retrospective/api/retrospective.api.ts` — Retrospective API (15 endpoints)
- `src/features/team/model/schema.ts` — Team Zod 스키마
- `src/features/retrospective/model/schema.ts` — Retrospective Zod 스키마

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-22
**Next Action**: Phase 1 — MSW 설치 및 기반 설정
