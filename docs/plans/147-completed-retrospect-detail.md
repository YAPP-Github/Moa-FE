# [#147] 완료된 회고 세부 사항 페이지

## Overview

팀 대시보드의 "종료" 컬럼에 있는 회고 카드를 클릭하면 해당 회고의 세부 사항을 볼 수 있는 전체 페이지를 구현한다. 3개 탭(질문, 팀원, 회고 분석)으로 구성되며, 기존 API 함수와 쿼리 훅을 최대한 활용한다.

---

## Implementation Summary

**Completion Date**: 2026-02-23
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Files Modified (13)

- `src/app/App.tsx` — `/teams/:teamId/retrospects/:retrospectId` 라우트 추가
- `src/features/retrospective/api/retrospective.api.ts` — `getAnalysisResult` GET 함수 추가
- `src/features/retrospective/api/retrospective.mutations.ts` — `useAnalyzeRetrospective`에 analysis 캐시 무효화 추가
- `src/features/retrospective/api/retrospective.queries.ts` — `useAnalysisResult`, `useQuestionResponses` 훅 추가, `useRetrospectDetail`/`useResponses`를 `useSuspenseQuery`로 전환
- `src/features/retrospective/lib/date.ts` — `formatRelativeTime` 상대 시간 포맷 함수 추가
- `src/features/retrospective/model/constants.ts` — `RETROSPECTIVE_TAB_LABELS`, `QUESTION_CATEGORIES` 상수 추가
- `src/features/retrospective/model/types.ts` — `RetrospectiveTabType` 변경, `ResponseListItem`에 `createdAt`/`isLiked` 필드 추가
- `src/features/retrospective/ui/RetrospectCard.tsx` — CompletedCard에 `useNavigate` + 클릭 네비게이션 추가
- `src/features/retrospective/ui/RetrospectColumn.tsx` — `teamId` prop 전달
- `src/pages/team-dashboard/ui/DashboardContent.tsx` — `teamId` prop 전달
- `src/shared/api/mocks/fixtures/retrospective.ts` — 분석 결과 mock 데이터 업데이트, 응답 데이터에 `createdAt` 추가
- `src/shared/api/mocks/handlers/retrospective.ts` — `GET /analysis` 핸들러 추가 (회고별 분기)
- `src/shared/ui/button/Button.tsx` — `leading-none` 제거 (세로 중앙 정렬 수정), `sm` size variant 정리

#### Files Created (18)

- `src/pages/retrospective-detail/ui/RetrospectiveDetailPage.tsx` — 페이지 셸 (헤더, 탭, Suspense/ErrorBoundary)
- `src/features/retrospective/ui/detail/DetailHeader.tsx` — 제목 + 3탭 네비게이션
- `src/features/retrospective/ui/detail/QuestionTabContent.tsx` — 질문별 응답 목록
- `src/features/retrospective/ui/detail/ResponseCard.tsx` — 응답 카드 (hideAuthor prop으로 질문/팀원 탭 재사용)
- `src/features/retrospective/ui/detail/LikeButton.tsx` — 좋아요 토글 (컴포넌트 레벨 optimistic update)
- `src/features/retrospective/ui/detail/CommentButton.tsx` — 댓글 토글 버튼
- `src/features/retrospective/ui/detail/CommentSection.tsx` — 댓글 목록 + 입력
- `src/features/retrospective/ui/detail/CommentInput.tsx` — 댓글 입력 폼
- `src/features/retrospective/ui/detail/MemberTabContent.tsx` — 팀원별 응답 컨테이너
- `src/features/retrospective/ui/detail/MemberSubTabs.tsx` — 팀원 선택 세로 탭
- `src/features/retrospective/ui/detail/MemberResponseColumns.tsx` — 질문별 354px 컬럼 가로 스크롤
- `src/features/retrospective/ui/detail/AnalysisTabContent.tsx` — 분석 탭 (empty/result 분기)
- `src/features/retrospective/ui/detail/AnalysisEmptyState.tsx` — 분석 전 빈 상태 (gradient 버튼)
- `src/features/retrospective/ui/detail/AnalysisResult.tsx` — 분석 결과 (인사이트, 키워드, 미션)
- `src/shared/assets/icons/ic_front.svg` — 브레드크럼 화살표 아이콘
- `src/shared/assets/icons/ic_heart_active.svg` — 활성 좋아요 아이콘
- `src/shared/ui/icons/IcFront.tsx` — SVGR 생성
- `src/shared/ui/icons/IcHeartActive.tsx` — SVGR 생성

#### Key Implementation Details

- **Suspense 전략**: `useSuspenseQuery`/`useSuspenseQueries` + `<Suspense fallback={null}>` 일관 적용. `useComments`만 toggle 기반이라 `useQuery` 유지
- **ResponseCard 재사용**: `hideAuthor` prop으로 질문 탭(저자 표시 + border)과 팀원 탭(저자 숨김 + border 없음) 공유
- **LikeButton 낙관적 업데이트**: 컴포넌트 레벨 로컬 상태로 처리, 에러 시 롤백
- **회고 분석 탭 레이아웃**: empty state는 `flex-1` 세로 중앙 정렬, result는 content-fit + 페이지 스크롤
- **디자인 스펙 준수**: gradient text, tabular-nums (좋아요 shift 방지), 커스텀 스크롤바 스타일링

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (Biome, 207 files)

### Deviations from Plan

**Added**:
- `formatRelativeTime` 유틸 함수 (상대 시간 표시)
- CompletedCard hover shadow 제거 (디자인 피드백)
- `IcFront`, `IcHeartActive` SVG 아이콘 추가

**Changed**:
- `useRetrospectDetail`, `useResponses`를 `useSuspenseQuery`로 전환 (원래 `useQuery`)
- `Button` sm variant 정리 (CommentInput 세로 정렬 이슈 수정)
- 분석 결과 UI를 디자인 목업 기반으로 전면 재구성 (키워드 2-column, 미션 3-column 카드)

**Skipped**:
- Zod 런타임 검증 스키마 (분석 응답) — 추후 추가 가능
- 개인 회고 키워드 별도 API 연동 — 현재 팀 키워드와 동일 데이터 표시 (TODO 주석)

### Follow-up Tasks

- [ ] 개인 회고 키워드 API 추가 시 `AnalysisResult` 우측 컬럼 분리
- [ ] "N개의 응답과 연관" 클릭 시 관련 응답 펼침 기능
- [ ] 분석 결과 PDF 내보내기 연동
