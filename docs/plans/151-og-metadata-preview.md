# Task Plan: 참고자료 OG 메타데이터 링크 프리뷰 구현

**Issue**: #151
**Type**: Feature
**Created**: 2026-02-24
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 작성 페이지와 회고 진행 패널의 "참고 자료" 섹션에서 URL만 텍스트로 표시되고 있어 사용자가 링크의 내용을 미리 파악할 수 없다.

- `WriteSidebar`의 `ReferenceCard`는 회색 placeholder(`bg-grey-100`)만 표시
- `RetrospectiveDetailPanel`은 URL 텍스트 링크만 표시
- 백엔드 OG 파싱 API(`GET /api/v1/og?url={URL}`)는 준비 완료

### Objectives

1. OG 메타데이터 API 연동하여 URL별 제목/설명/썸네일 조회
2. `WriteSidebar`의 `ReferenceCard`에 OG 이미지와 제목 표시
3. `RetrospectiveDetailPanel`의 참고자료 섹션에도 프리뷰 카드 적용
4. OG 데이터 없는 경우 graceful fallback

### Scope

**In Scope**:
- OG API 함수 및 useQuery hook 구현
- `ReferenceCard` 컴포넌트에 OG 데이터 표시
- `RetrospectiveDetailPanel` 참고자료 섹션 프리뷰 적용
- 로딩/에러/fallback 상태 처리

**Out of Scope**:
- OG 데이터 캐시 전략 변경 (React Query 기본 캐시 사용)
- 참고자료 CRUD 기능 변경

---

## 2. Requirements

### Functional Requirements

**FR-1**: OG 메타데이터 조회
- `GET /api/v1/og?url={encodeURIComponent(url)}`로 각 URL의 OG 데이터 조회
- 응답: `{ url, title, description, image }` (title/description/image는 nullable)

**FR-2**: 프리뷰 카드 표시 (WriteSidebar)
- OG 이미지가 있으면 썸네일 영역(h-[130px])에 표시
- OG 제목이 있으면 urlName 대신 OG 제목 표시
- OG 데이터가 모두 null이면 기존 fallback (URL 텍스트만)

**FR-3**: 프리뷰 링크 표시 (RetrospectiveDetailPanel)
- 현재 텍스트 링크 형태를 프리뷰 카드로 변경하거나, OG 제목이 있으면 표시

### Technical Requirements

**TR-1**: FSD 아키텍처 준수
- OG API는 여러 feature에서 사용 가능하므로 `shared/api/` 레벨에 배치
- 타입/스키마는 `shared/api/` 또는 OG 전용 모듈

**TR-2**: React Query 패턴
- 각 URL별 개별 useQuery (URL을 queryKey에 포함)
- `staleTime` 길게 설정 (OG 데이터는 자주 변하지 않음, 30분)
- 이미지 로드 실패 시 fallback 처리

### Non-Functional Requirements

**NFR-1**: 성능
- 여러 참고자료가 있을 때 API 요청이 병렬로 실행되어야 함 (개별 useQuery)
- 이미지 로딩 중 레이아웃 시프트 방지 (고정 높이 유지)

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── shared/
│   └── api/
│       └── og.ts                    # OG API 함수 + 쿼리 hook + 타입 (NEW)
├── pages/
│   └── retrospective-write/
│       └── ui/
│           └── WriteSidebar.tsx      # ReferenceCard에 OG 데이터 적용 (MODIFY)
└── widgets/
    └── retrospective-detail-panel/
        └── ui/
            └── RetrospectiveDetailPanel.tsx  # 참고자료 섹션에 프리뷰 적용 (MODIFY)
```

### Design Decisions

**Decision 1**: OG API를 `shared/api/og.ts`에 배치

- **Rationale**: OG 메타데이터 조회는 회고에 국한되지 않는 범용 기능
- **Trade-offs**: `features/retrospective/api/`에 두면 응집도 높지만 재사용성 낮음
- **Impact**: LOW (파일 1개 추가)

**Decision 2**: URL별 개별 useQuery

- **Rationale**: 각 URL을 독립적으로 fetch하면 병렬 처리 + 개별 캐싱 가능
- **Approach**: `useOgMetadata(url)` hook이 URL을 queryKey에 포함
- **Benefit**: 같은 URL이 다른 회고에서도 캐시 히트

### Data Models

```typescript
// shared/api/og.ts

interface OgMetadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}
```

### API Design

**Endpoint**: `GET /api/v1/og?url={encodedURL}`

**Response** (성공):
```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "성공입니다.",
  "result": {
    "url": "https://github.com/example",
    "title": "example/project",
    "description": "An example project",
    "image": "https://opengraph.githubassets.com/example.png"
  }
}
```

---

## 4. Implementation Plan

### Phase 1: OG API 모듈 구현

**Tasks**:
1. `shared/api/og.ts` 생성 — Zod 스키마, API 함수, useQuery hook

**Files to Create**:
- `src/shared/api/og.ts` (CREATE)

**Details**:
```typescript
// Zod 스키마
const ogMetadataSchema = z.object({
  url: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  image: z.string().nullable(),
});

// API 함수
function fetchOgMetadata(url: string) {
  return customInstance({ url: '/api/v1/og', method: 'GET', params: { url } });
}

// Query hook
function useOgMetadata(url: string) {
  return useQuery({
    queryKey: ['og', url],
    queryFn: () => fetchOgMetadata(url),
    staleTime: 1000 * 60 * 30, // 30분
    enabled: !!url,
  });
}
```

### Phase 2: WriteSidebar ReferenceCard 업데이트

**Tasks**:
1. `ReferenceCard`에서 `useOgMetadata` hook 호출
2. OG 이미지 표시 (있으면 이미지, 없으면 회색 placeholder)
3. OG 제목 표시 (있으면 OG title, 없으면 urlName 또는 url)

**Files to Modify**:
- `src/pages/retrospective-write/ui/WriteSidebar.tsx` (MODIFY)

### Phase 3: RetrospectiveDetailPanel 참고자료 업데이트

**Tasks**:
1. 참고자료 섹션에서 OG 데이터 표시
2. 현재 텍스트 링크를 프리뷰 카드로 변경 (WriteSidebar의 ReferenceCard 재사용 or 별도 컴포넌트)

**Files to Modify**:
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:
- `bundle-barrel-imports`: 직접 import 사용 (barrel export 금지)

**MEDIUM**:
- `rerender-memo`: OG 데이터 로딩이 다른 컴포넌트 리렌더링을 유발하지 않도록 독립 hook 사용

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 참고자료 URL에 OG 이미지가 있으면 썸네일 표시
- [ ] OG 제목이 있으면 카드에 표시
- [ ] OG 데이터가 모두 null이면 URL 텍스트만 표시 (회색 placeholder)
- [ ] 이미지 로드 실패 시 fallback 처리
- [ ] WriteSidebar와 RetrospectiveDetailPanel 모두 적용
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: OG API 응답 지연
- **Impact**: MEDIUM
- **Mitigation**: 긴 staleTime(30분) + 로딩 중 placeholder 표시

**R-2**: 외부 이미지 CORS/로드 실패
- **Impact**: LOW
- **Mitigation**: `<img>` onError 핸들러로 fallback

### Dependencies

**D-1**: 백엔드 OG API
- **Dependency**: `GET /api/v1/og?url={URL}` 엔드포인트
- **Status**: AVAILABLE

---

## 7. Timeline & Milestones

### Estimated Timeline

- **Phase 1 (API 모듈)**: 15분
- **Phase 2 (WriteSidebar)**: 20분
- **Phase 3 (DetailPanel)**: 15분
- **검증**: 10분
- **Total**: ~1시간

---

## 8. References

### Related Issues

- Issue #151: [참고자료 OG 메타데이터 링크 프리뷰 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/151)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-24
**Implemented By**: Claude Opus 4.6

### Changes Made

**Added Files**:
- `src/shared/api/og.ts` — OG 메타데이터 API 모듈 (Zod 스키마 + `fetchOgMetadata` 함수 + `useOgMetadata` hook)

**Modified Files**:
- `src/pages/retrospective-write/ui/WriteSidebar.tsx` — `ReferenceCard`에 `useOgMetadata` hook 연동, OG 이미지 썸네일 표시 + onError fallback
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` — `ReferenceLink` 서브 컴포넌트 추가, OG 제목을 텍스트 링크에 반영

### Key Implementation Details

- URL별 개별 `useQuery` → 병렬 fetch + 30분 캐시 (`staleTime: 1800000`)
- WriteSidebar: OG 이미지 있으면 `<img>` 표시, 없거나 로드 실패 시 `useState`로 회색 placeholder fallback
- DetailPanel: 사이드바 영역이 좁으므로 카드형 대신 텍스트 링크에 OG 제목 반영
- Zod `baseResponseSchema`를 활용한 런타임 응답 검증

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (Biome, 217 files, 0 issues)

### Deviations from Plan

**Changed**:
- `RetrospectiveDetailPanel`에서 카드형 대신 텍스트 링크 유지 + OG 제목 표시 (사이드바 영역 너비 제약)

### Performance Impact

- Bundle size: 미미한 증가 (og.ts ~1KB)
- 런타임: 참고자료 URL 수만큼 API 요청 발생, 30분 캐시로 재요청 최소화

---

**Plan Status**: Completed
**Last Updated**: 2026-02-24
