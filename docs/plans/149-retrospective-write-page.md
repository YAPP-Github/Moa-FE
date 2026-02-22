# Task Plan: 회고 진행 페이지 구현

**Issue**: #149
**Type**: Feature
**Created**: 2026-02-23
**Status**: Planning

---

## 1. Overview

### Problem Statement

메인 페이지(팀 대시보드)에서 "진행중"과 "임시저장" 상태의 회고 카드가 클릭 불가능한 상태이다. 사용자가 회고에 참여하거나 임시저장된 답변을 이어서 작성할 수 있는 전용 페이지가 필요하다.

### Objectives

1. "진행중" / "임시저장" 카드 클릭 시 유저 제출 상태에 따라 적절한 페이지로 분기
2. 디자인 목업에 맞는 회고 작성 풀 페이지 구현
3. 임시저장 / 제출 / AI 어시스턴트 API 연동

### Scope

**In Scope**:
- ActiveCard 클릭 핸들러 추가 및 분기 로직
- 회고 작성 페이지 (풀 페이지) 신규 구현
- 임시저장 (localStorage + 서버), 제출 API 연동
- AI 어시스턴트 연동
- 우측 사이드바 (전체 질문 목록 + 참고자료)
- 하단 바 (미리보기, 임시저장, 제출하기)

**Out of Scope**:
- 미리보기 모달 구현 (TODO로 남김)
- 제출 확인 모달 (TODO로 남김)

### User Context

> "진행중" 카드 클릭 시 유저 제출 상태에 따라 분기:
> - 미제출 → 회고 진행 페이지
> - 제출 완료 → 회고 분석 페이지 (기존 detail page)
>
> "임시저장" 카드는 항상 회고 진행 페이지로 이동

---

## 2. Requirements

### Functional Requirements

**FR-1**: 카드 클릭 분기 로직

| 카드 상태 | 유저 제출 상태 | 이동 페이지 |
|-----------|---------------|------------|
| IN_PROGRESS | NOT_JOINED / DRAFT | `/teams/:teamId/retrospects/:retrospectId/write` |
| IN_PROGRESS | SUBMITTED | `/teams/:teamId/retrospects/:retrospectId` (기존 detail) |
| DRAFT | — | `/teams/:teamId/retrospects/:retrospectId/write` |

- 카드 클릭 → `getRetrospectDetail` API 호출 → `currentUserStatus` 확인 → 분기

**FR-2**: 회고 작성 페이지 레이아웃

- 헤더: 브레드크럼 (moa | 홈 > 회고 제목) + 프로필 드롭다운
- 좌측 메인: 질문 네비게이션 + 텍스트 입력 + AI 어시스턴트
- 우측 사이드바: 전체 질문 목록 + 참고자료
- 하단 바: 미리보기 탭, 회고 정보, 임시저장/제출 버튼

**FR-3**: 질문별 답변 작성

- 이전/다음 버튼으로 질문 간 이동
- 우측 사이드바에서 질문 직접 선택 가능
- 텍스트 입력 1000자 제한, 실시간 글자 수 표시

**FR-4**: 임시저장

- localStorage에 즉시 저장 + 서버 API (`PUT /api/v1/retrospects/:id/drafts`) 호출
- 페이지 진입 시 localStorage에서 draft 복원

**FR-5**: 제출

- 모든 질문에 답변 작성 필수 (빈 답변 시 토스트 경고)
- `POST /api/v1/retrospects/:id/submit` 호출
- 성공 시 팀 대시보드로 이동

**FR-6**: AI 어시스턴트

- "회고 어시스턴트" 버튼 클릭 시 가이드 생성
- 질문별 독립적 가이드 상태 관리
- 다시 생성 기능

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 페이지: `src/pages/retrospective-write/ui/RetrospectiveWritePage.tsx`
- 기존 `src/features/retrospective/` API, mutations, types 재사용
- 기존 `RetrospectiveDetailPanel` 위젯의 로직을 페이지 레벨로 재구성

**TR-2**: 기존 API/Query 인프라 활용

- `useRetrospectDetail`, `useReferences`, `useSaveDraft`, `useSubmitRetrospect`, `useAssistantGuide` 등 기존 hooks 그대로 사용
- `useCreateParticipant` — 페이지 진입 시 참가자 등록

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── app/
│   └── App.tsx                                    # (MODIFY) 라우트 추가
├── pages/
│   └── retrospective-write/                       # (CREATE) 새 페이지 슬라이스
│       └── ui/
│           ├── RetrospectiveWritePage.tsx          # 페이지 컴포넌트 (조립)
│           ├── WritePageHeader.tsx                 # 브레드크럼 헤더
│           ├── WriteContent.tsx                    # 메인 콘텐츠 (질문 + 입력)
│           ├── WriteSidebar.tsx                    # 우측 사이드바 (질문 목록 + 참고자료)
│           └── WriteBottomBar.tsx                  # 하단 바 (미리보기, 임시저장, 제출)
└── features/
    └── retrospective/
        └── ui/
            └── RetrospectCard.tsx                 # (MODIFY) ActiveCard 클릭 추가
```

### Design Decisions

**Decision 1**: 풀 페이지 vs 사이드 패널

- **Approach**: 디자인 목업이 풀 페이지 레이아웃 → 새 페이지 라우트 생성
- **Rationale**: 기존 `RetrospectiveDetailPanel`은 사이드 패널이지만 목업은 풀 페이지. 별도 페이지로 구현
- **Trade-offs**: 패널 로직 일부 중복 vs 디자인 정확도
- **Impact**: MEDIUM

**Decision 2**: 카드 클릭 시 API 호출 타이밍

- **Approach**: 카드 클릭 → 즉시 라우트 이동 → 페이지에서 detail fetch → SUBMITTED면 redirect
- **Rationale**: 카드에서 미리 API 호출하면 UX가 느려짐. 페이지 진입 후 Suspense로 처리
- **Alternative**: DRAFT 카드는 무조건 write 페이지이므로 분기 불필요. IN_PROGRESS만 페이지 내에서 분기
- **Impact**: LOW

### Component Design

**페이지 플로우**:

```
RetrospectiveWritePage
├── Suspense + ApiErrorBoundary
└── WritePageContent (data fetching)
    ├── currentUserStatus === 'SUBMITTED'
    │   → Navigate to /teams/:teamId/retrospects/:retrospectId (redirect)
    ├── currentUserStatus === 'NOT_JOINED'
    │   → createParticipant() 호출 → 작성 UI
    └── currentUserStatus === 'DRAFT'
        → localStorage draft 로드 → 작성 UI
```

**작성 UI 레이아웃**:

```
┌─────────────────────────────────────────────────┐
│ WritePageHeader (breadcrumb + profile)           │
├──────────────────────────┬──────────────────────┤
│                          │ WriteSidebar         │
│ WriteContent             │  ├ 전체 질문          │
│  ├ 질문 N (이전/다음)     │  │  ├ 질문 1 (active) │
│  ├ 질문 텍스트            │  │  ├ 질문 2          │
│  ├ Textarea (0/1000)     │  │  └ 질문 3          │
│  └ AI 어시스턴트          │  └ 참고자료           │
│                          │    └ URL links        │
├──────────────────────────┴──────────────────────┤
│ WriteBottomBar                                   │
│ [미리보기] 회고제목 · 팀이름    [임시저장] [제출하기]│
└─────────────────────────────────────────────────┘
```

### Data Flow

```
RetrospectiveWritePage (route params: teamId, retrospectId)
  ↓ useRetrospectDetail(retrospectId)  → questions, currentUserStatus, members
  ↓ useReferences(retrospectId)         → reference URLs
  ↓ useCreateParticipant(retrospectId)  → 참가자 등록 (once)
  ↓
  ↓ [State]
  ↓ currentQuestionIndex: number
  ↓ answers: string[]  (localStorage 연동)
  ↓ assistantGuidesMap: Record<number, GuideItem[]>
  ↓
  ↓ [Actions]
  ↓ handleSaveDraft → useSaveDraft + localStorage
  ↓ handleSubmit → useSubmitRetrospect → navigate to dashboard
  ↓ handleAssistant → useAssistantGuide → update guidesMap
```

---

## 4. Implementation Plan

### Phase 1: 라우트 및 카드 클릭 연결

**Tasks**:

1. `App.tsx`에 `/teams/:teamId/retrospects/:retrospectId/write` 라우트 추가
2. `RetrospectCard.tsx`의 `ActiveCard`를 클릭 가능한 버튼으로 변경
   - IN_PROGRESS 카드: `/write` 경로로 이동
   - DRAFT 카드: `/write` 경로로 이동

**Files**:

- `src/app/App.tsx` (MODIFY)
- `src/features/retrospective/ui/RetrospectCard.tsx` (MODIFY)

### Phase 2: 페이지 골격 구현

**Tasks**:

1. `RetrospectiveWritePage.tsx` — Suspense + ErrorBoundary + 분기 로직
2. `WritePageHeader.tsx` — 브레드크럼 헤더 (기존 DetailPageHeader 참조)
3. `WriteContent.tsx` — 질문 네비게이션 + 텍스트 입력 + AI 어시스턴트
4. `WriteSidebar.tsx` — 전체 질문 목록 + 참고자료
5. `WriteBottomBar.tsx` — 하단 고정 바

**Files**:

- `src/pages/retrospective-write/ui/RetrospectiveWritePage.tsx` (CREATE)
- `src/pages/retrospective-write/ui/WritePageHeader.tsx` (CREATE)
- `src/pages/retrospective-write/ui/WriteContent.tsx` (CREATE)
- `src/pages/retrospective-write/ui/WriteSidebar.tsx` (CREATE)
- `src/pages/retrospective-write/ui/WriteBottomBar.tsx` (CREATE)

### Phase 3: 기능 연동

**Tasks**:

1. 임시저장 (localStorage + 서버 API)
2. 제출 (전체 답변 검증 + API)
3. AI 어시스턴트 (질문별 가이드 생성/재생성)
4. SUBMITTED 상태 redirect 처리
5. NOT_JOINED 상태 참가자 등록 처리

**Dependencies**: Phase 2 완료 필요

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (barrel export 금지)

**MEDIUM**:

- `rerender-functional-setstate`: `setAnswers(prev => ...)` 패턴 사용
- `rerender-memo`: 사이드바, 하단 바 등 독립 컴포넌트 분리로 리렌더링 최소화

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] "진행중" 카드 클릭 → 미제출 시 회고 작성 페이지, 제출 완료 시 기존 detail 페이지
- [ ] "임시저장" 카드 클릭 → 회고 작성 페이지로 이동
- [ ] 질문별 답변 작성 (텍스트 입력, 1000자 제한, 이전/다음 네비게이션)
- [ ] 우측 사이드바 (전체 질문 목록 + 참고자료)
- [ ] AI 어시스턴트 버튼 연동
- [ ] 임시저장 (localStorage + 서버) 동작
- [ ] 제출 동작 (빈 답변 검증 + API)
- [ ] 하단 바 (미리보기, 임시저장, 제출하기)
- [ ] Build / TypeScript / Lint 통과

### Validation Checklist

**기능 동작**:
- [ ] IN_PROGRESS + NOT_JOINED → write 페이지 + 참가자 등록
- [ ] IN_PROGRESS + DRAFT → write 페이지 + draft 복원
- [ ] IN_PROGRESS + SUBMITTED → detail 페이지로 redirect
- [ ] DRAFT → write 페이지 + draft 복원
- [ ] 질문 이전/다음 네비게이션
- [ ] 사이드바 질문 클릭으로 이동
- [ ] 임시저장 → 토스트 표시
- [ ] 제출 → 빈 답변 시 경고, 성공 시 이동

**코드 품질**:
- [ ] FSD 레이어 규칙 준수
- [ ] 직접 import 사용 (barrel export 없음)
- [ ] TypeScript 에러 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: RetrospectiveDetailPanel과 로직 중복

- **Risk**: 기존 패널과 새 페이지에 유사한 로직 존재
- **Impact**: LOW
- **Mitigation**: 기존 API hooks를 그대로 재사용하고, localStorage 헬퍼도 패널에서 export하여 공유

### Dependencies

**D-1**: 기존 API hooks

- **Dependency**: `useRetrospectDetail`, `useSaveDraft`, `useSubmitRetrospect` 등
- **Status**: AVAILABLE — 이미 구현되어 있음

**D-2**: 기존 아이콘 컴포넌트

- **Dependency**: `IcChevronActiveRight`, `IcSparklePink`, `IcRefresh` 등
- **Status**: AVAILABLE

---

## 7. References

### Related Issues

- Issue #149: [Feature] "진행중", "임시저장" 회고 카드 클릭 시 회고 진행 페이지 구현
- Issue #147: [Feature] "종료" 회고 카드 클릭 시 세부 사항 페이지 구현 (참조 구현)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-23
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Files Modified

- [src/features/retrospective/ui/RetrospectCard.tsx](src/features/retrospective/ui/RetrospectCard.tsx#L23-L60) — CardMenu 드롭다운 API 연동
  - "링크복사" 메뉴 항목 삭제
  - "내보내기" → `useExportRetrospect()` mutation 연결
  - "삭제하기" → `useDeleteRetrospect()` mutation 연결 (확인 모달 없이 즉시 호출)
  - `CardMenu` props에 `retrospectId` 추가
  - `ActiveCard`, `CompletedCard` → `retrospectId` prop 전달

#### Key Implementation Details

- 기존 `useDeleteRetrospect()`, `useExportRetrospect()` mutation hooks 재사용
- `useDeleteRetrospect`는 `onSuccess`에서 `['retrospects']` 쿼리 캐시 자동 무효화 (기존 구현)
- 글로벌 에러 핸들러(`MutationCache.onError`)가 에러 토스트 자동 처리

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Changed**:

- 삭제 확인 모달 제거 — 사용자 요청에 따라 "삭제하기" 클릭 시 즉시 API 호출

---

**Plan Status**: Completed
**Last Updated**: 2026-02-23
