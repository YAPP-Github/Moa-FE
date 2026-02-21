# Task Plan: 팀 페이지 메인 컨텐트 뷰 (3-column 회고 카드 레이아웃)

**Issue**: #142
**Type**: Feature
**Created**: 2026-02-20
**Status**: Planning

---

## 1. Overview

### Problem Statement

팀 대시보드 페이지(`DashboardContent.tsx`)에 회고 목록을 표시하는 메인 컨텐트 영역이 미구현 상태이다.
현재 `hasRetrospectives`가 `true`일 때 `return null`을 반환하여 아무것도 표시하지 않음.

### Objectives

1. 3-column 레이아웃으로 회고 상태별(진행중, 임시저장, 종료) 분류 표시
2. 각 회고를 284px × 141px 카드 형태로 표시 (제목, 방식, 날짜, D-day)
3. 진행중 카드는 오늘과 가까운 순으로 정렬

### Scope

**In Scope**:

- 3-column 레이아웃 (진행중, 임시저장, 종료) 구현
- 회고 카드 컴포넌트 리디자인 (284px × 141px, D-day 포함)
- D-day 계산 유틸리티 함수
- 상태별 필터링 및 정렬 로직

**Out of Scope**:

- 카드 클릭 시 상세 페이지 네비게이션 (별도 이슈)
- API 스키마 변경 (백엔드 협의 필요)

### User Context

> - 3 column 으로 구성 (진행중 {num}, 임시저장 {num}, 종료 {num})
> - gap은 54px
> - 각 아이템은 카드형태로 구성 (284px * 141px)
> - 오늘과 "진행중" 영역의 카드는 오늘과 가까운 순으로 정렬
> - 카드의 내용은 회고 제목, 회고 방식 날짜, 오늘로부터 남은 날짜 (오늘일경우 오늘, 내일일경우 D-1, ...)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 3-column 레이아웃

- 진행중 / 임시저장 / 종료 3개 컬럼으로 회고 목록 표시
- 각 컬럼 헤더에 상태명과 해당 개수 표시 (예: "진행중 3")
- 컬럼 간 gap: 54px

**FR-2**: 회고 카드

- 크기: 284px × 141px
- 내용: 회고 제목, 회고 방식(KPT/4L/5F/PMI/자유), 날짜, D-day
- D-day 규칙:
  - 오늘 = "오늘"
  - 내일 = "D-1"
  - N일 뒤 = "D-N"
  - 지난 날짜의 경우 표시하지 않거나 적절한 처리

**FR-3**: 정렬

- 진행중 컬럼: 오늘과 가까운 순 (날짜 오름차순)
- 임시저장/종료: 기본 순서 유지 (API 응답 순)

### Technical Requirements

**TR-1**: 상태 기반 필터링

- 현재 `RetrospectListItem`에 `status` 필드가 없음
- **방안 A**: 백엔드에 `status` 필드 추가 요청 → 스키마 업데이트
- **방안 B**: 임시로 날짜 기반 추론 (date > today → 진행중, 없으면 임시저장 등)
- **채택**: 방안 B (Mock 데이터로 UI 우선 구현 → API 준비 시 연결)

**TR-2**: FSD 아키텍처 준수

- 카드 컴포넌트: `features/retrospective/ui/`
- D-day 유틸리티: `features/retrospective/lib/`
- 타입 정의: `features/retrospective/model/`

### Non-Functional Requirements

**NFR-1**: 빈 상태 처리

- 각 컬럼에 회고가 0개일 때 empty state 표시

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── pages/
│   └── team-dashboard/
│       └── ui/
│           └── DashboardContent.tsx          # MODIFY: 3-column 레이아웃 적용
├── features/
│   └── retrospective/
│       ├── ui/
│       │   ├── RetrospectCard.tsx            # MODIFY: 카드 리디자인 (284x141, D-day)
│       │   └── RetrospectColumn.tsx          # CREATE: 상태별 컬럼 컴포넌트
│       ├── lib/
│       │   └── date.ts                       # CREATE: D-day 계산 유틸
│       └── model/
│           └── schema.ts                     # MODIFY: status 필드 추가 (API 대응 시)
```

### Design Decisions

**Decision 1**: 컬럼 컴포넌트 분리

- **Rationale**: 각 컬럼이 헤더(제목+개수)와 카드 리스트, empty state를 갖는 독립 단위
- **Approach**: `RetrospectColumn` 컴포넌트로 분리하여 재사용
- **Impact**: LOW — 기존 코드에 영향 없음

**Decision 2**: D-day 유틸리티 위치

- **Rationale**: 날짜 계산은 retrospective 도메인 전용 로직
- **Approach**: `features/retrospective/lib/date.ts`에 배치
- **Benefit**: FSD 규칙 준수, 도메인 응집도

### Component Design

**RetrospectColumn**:

```typescript
interface RetrospectColumnProps {
  title: string;            // "진행중" | "임시저장" | "종료"
  items: RetrospectListItem[];
}
```

**RetrospectCard (리디자인)**:

```typescript
interface RetrospectCardProps {
  retrospect: RetrospectListItem;
}
// 284px × 141px 고정 크기
// 내용: 제목, 방식 뱃지, 날짜, D-day 뱃지
```

**D-day 유틸리티**:

```typescript
// features/retrospective/lib/date.ts
function getDDayLabel(dateString: string): string
// "오늘" | "D-1" | "D-N" | null (지난 날짜)
```

### Data Flow

```
DashboardContent
  → useRetrospects(teamId)
  → 상태별 필터링 (진행중/임시저장/종료)
  → 진행중: 날짜 오름차순 정렬
  → 3개 RetrospectColumn 렌더링
      → 각 Column 내 RetrospectCard 렌더링
```

---

## 4. Implementation Plan

### Phase 1: D-day 유틸리티 & 타입

**Tasks**:

1. `features/retrospective/lib/date.ts` 생성 — `getDDayLabel()` 함수
2. `features/retrospective/model/schema.ts` — `retrospectStatus` 필드 추가 (API 대응)

**Files**:

- `src/features/retrospective/lib/date.ts` (CREATE)
- `src/features/retrospective/model/schema.ts` (MODIFY)

### Phase 2: 컴포넌트 구현

**Tasks**:

1. `RetrospectCard.tsx` 리디자인 — 284×141, D-day 뱃지, 방식/날짜 표시
2. `RetrospectColumn.tsx` 생성 — 컬럼 헤더 + 카드 리스트 + empty state

**Files**:

- `src/features/retrospective/ui/RetrospectCard.tsx` (MODIFY)
- `src/features/retrospective/ui/RetrospectColumn.tsx` (CREATE)

### Phase 3: 대시보드 통합

**Tasks**:

1. `DashboardContent.tsx` — 3-column 레이아웃, 상태별 필터링/정렬 로직

**Files**:

- `src/pages/team-dashboard/ui/DashboardContent.tsx` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (barrel export 금지)

**MEDIUM**:

- `rerender-memo`: 카드 컴포넌트 불필요 리렌더링 방지

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 3-column 레이아웃 (진행중, 임시저장, 종료) 구현
- [ ] 각 컬럼 헤더에 상태명 + 개수 표시
- [ ] 카드 284px × 141px에 제목, 방식, 날짜, D-day 표시
- [ ] D-day: 오늘 → "오늘", 내일 → "D-1", N일 뒤 → "D-N"
- [ ] 진행중 카드 오늘 기준 가까운 순 정렬
- [ ] 빈 컬럼 empty state 표시
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: API에 `retrospectStatus` 필드 미포함

- **Risk**: 현재 `RetrospectListItem`에 status 필드가 없어 3-column 분류 불가
- **Impact**: HIGH
- **Mitigation**: 백엔드에 status 필드 추가 요청. 임시로 mock 데이터 또는 날짜 기반 추론으로 구현

### Dependencies

**D-1**: 백엔드 API 수정

- **Dependency**: `GET /api/v1/retro-rooms/:id/retrospects` 응답에 `retrospectStatus` 필드 추가
- **Required For**: 상태별 필터링
- **Status**: BLOCKED (협의 필요)

---

## 7. References

### Related Issues

- Issue #142: [Feature] 팀 페이지 메인 컨텐트 뷰 (3-column 회고 카드 레이아웃)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-21
**Implemented By**: Claude Opus 4.6

### Changes Made

이 브랜치에서는 두 가지 주요 작업이 이루어짐:
1. **회고 생성 폼 질문 편집 기능** — 모든 회고 방식에서 질문 편집 가능
2. **참고 자료 확인 스텝 추가** — yes/no 분기 후 URL 입력 서브뷰

#### Files Modified (회고 생성 폼 관련)

- `src/features/retrospective/model/constants.ts` — `RETROSPECT_METHOD_DETAILS` 타입을 `Record<string, string[]>`로 변경, `MAX_QUESTIONS`/`MAX_REFERENCE_URLS` 상수 추가
- `src/features/retrospective/model/schema.ts` — `freeQuestions` → `questions` 리네이밍, 300자 제한, `ERROR_MESSAGES.EMPTY_URL` 추가, 상수 기반 max 제한
- `src/features/retrospective/ui/CreateRetrospectForm.tsx` — `isFreeMethod` 상태 제거, `questions` 필드 통합, 조건부 렌더링 제거
- `src/features/retrospective/ui/steps/MethodSelector.tsx` — 아코디언 리디자인 (카드 클릭 토글, 선택 시 항상 열림, "질문 편집" 버튼, formContext에서 질문 읽기)
- `src/features/retrospective/ui/steps/MethodStep.tsx` — QuestionsEditStep 서브뷰 관리, questionsCache ref로 방식 전환 시 질문 보존
- `src/features/retrospective/ui/steps/ReferenceStep.tsx` — yes/no 확인 스텝으로 전면 재작성 (RadioCard 선택기)
- `src/features/retrospective/ui/steps/FreeQuestionsStep.tsx` — 삭제됨

#### Files Created

- `src/features/retrospective/ui/steps/QuestionsEditStep.tsx` — 모든 방식에서 사용하는 질문 편집 서브뷰
- `src/features/retrospective/ui/steps/ReferenceUrlStep.tsx` — URL 입력 서브뷰 (에러 표시, 최대 10개 제한)

#### Other Modified Files (3-column 레이아웃 등)

- `src/features/retrospective/api/retrospective.api.ts` — API 함수 추가
- `src/features/retrospective/api/retrospective.mutations.ts` — mutation hooks 수정
- `src/features/retrospective/api/retrospective.queries.ts` — query hooks 수정
- `src/features/retrospective/model/types.ts` — 타입 정의 추가
- `src/features/retrospective/ui/RetrospectCard.tsx` — 카드 리디자인
- `src/features/retrospective/ui/RetrospectColumn.tsx` — 상태별 컬럼 컴포넌트 (신규)
- `src/features/retrospective/lib/date.ts` — D-day 계산 유틸 (신규)
- `src/pages/team-dashboard/ui/DashboardContent.tsx` — 3-column 레이아웃 적용
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` — 패널 수정
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveCompletedPanel.tsx` — 패널 수정

#### Files Deleted

- `AnalysisEmptyState.tsx`, `CloseConfirmModal.tsx`, `CompletedRetrospectiveModal.tsx`, `CompletedRetrospectiveView.tsx`, `PreviewModal.tsx`, `RetrospectRow.tsx`, `RetrospectSection.tsx`, `RetrospectiveAnalysisResult.tsx`, `RetrospectiveContentTab.tsx`, `SubmitConfirmModal.tsx`, `FreeQuestionsStep.tsx`

#### Key Implementation Details

- **서브뷰 패턴**: QuestionsEditStep과 ReferenceUrlStep을 MultiStepForm.Step이 아닌 부모 스텝 내 서브뷰로 렌더링 (step count에 영향 없음)
- **질문 캐싱**: `useRef<Record<string, string[]>>`로 방식 전환 시 편집된 질문 보존
- **에러 UI**: ReferenceUrlStep에서 `errorIndexes` Set으로 개별 Input에 error border 표시
- **상수 통합**: `MAX_QUESTIONS`(5), `MAX_REFERENCE_URLS`(10)을 constants.ts에 중앙 관리
- **FREE 방식 통합**: 별도 처리 없이 다른 방식과 동일한 UI/로직 적용

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:
- 참고 자료 확인 스텝 (yes/no 분기) — 원래 계획에 없었으나 사용자 요청으로 추가
- URL 입력 에러 표시 (개별 Input에 error border) — UX 개선
- `ERROR_MESSAGES.EMPTY_URL` 상수 — 코드 리뷰 후 매직 스트링 제거

**Changed**:
- QuestionsEditStep은 별도 MultiStepForm.Step이 아닌 MethodStep 내 서브뷰로 구현
- ReferenceStep을 URL 입력에서 yes/no 확인 스텝으로 변경, URL 입력은 ReferenceUrlStep으로 분리

### Notes

- `type="button"`을 폼 내 모든 IconButton에 명시하여 의도치 않은 form submission 방지
- 숨겨진 submit 버튼 패턴은 MultiStepForm 구조의 제약으로 인해 유지

---

**Plan Status**: Completed
**Last Updated**: 2026-02-21
