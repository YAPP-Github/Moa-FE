# Task Plan: 팀 생성, 회고 생성 API 연동 및 메인 페이지 목 데이터 대체

**Issue**: #93
**Type**: Feature
**Created**: 2026-02-04
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 팀 목록과 회고 목록 기능이 목(mock) 데이터를 사용하고 있어 실제 서비스로 동작하지 않습니다.

- MainPage, SidebarTeamList에서 하드코딩된 팀 데이터 사용
- TeamDashboardPage에서 더미 회고 데이터 사용 (총 9개 항목)
- API 쿼리 훅은 준비되어 있지만 결과가 무시되거나 주석 처리됨

### Objectives

1. 팀 목록을 실제 API 데이터로 대체 (`useRetroRooms`)
2. 회고 목록을 실제 API 데이터로 대체 (`useRetrospects`)
3. 하드코딩된 목 데이터 제거

### Scope

**In Scope**:

- MainPage 팀 목록 API 연동
- SidebarTeamList 팀 목록 API 연동
- TeamDashboardPage 회고 목록 API 연동
- RetrospectRow 참여자 데이터 연동

**Out of Scope**:

- 팀 생성 API (이미 연동됨 ✅)
- 회고 생성 API (이미 연동됨 ✅)
- 에러 처리 UI (별도 이슈)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 목록 실제 데이터 표시

- MainPage에서 사용자의 팀 목록 표시
- SidebarTeamList에서 팀 목록 표시
- 빈 상태 처리 (팀이 없을 때)

**FR-2**: 회고 목록 실제 데이터 표시

- TeamDashboardPage에서 회고 목록 표시
- 상태별 필터링 (오늘, 진행 예정, 완료)
- 실제 참여자 데이터 표시

### Technical Requirements

**TR-1**: 기존 Query Hook 활용

- `useRetroRooms()` - 팀 목록 조회
- `useRetrospects(retroRoomId)` - 회고 목록 조회
- React Query 캐싱 활용

**TR-2**: FSD 아키텍처 준수

- 직접 import 방식 사용
- 레이어 의존성 규칙 준수

---

## 3. Architecture & Design

### Current Status (탐색 결과)

| 기능      | 상태      | API 준비 | 목 데이터 |
| --------- | --------- | -------- | --------- |
| 팀 생성   | ✅ 연동됨 | Yes      | No        |
| 팀 목록   | ⚠️ 부분   | Yes      | Yes       |
| 회고 생성 | ✅ 연동됨 | Yes      | No        |
| 회고 목록 | ❌ 미연동 | Yes      | Yes       |

### Files to Modify

```
src/
├── pages/
│   ├── main/ui/
│   │   └── MainPage.tsx              # 목 데이터 제거 (MODIFY)
│   └── team-dashboard/ui/
│       └── TeamDashboardPage.tsx     # 더미 데이터 제거, API 연동 (MODIFY)
├── widgets/
│   └── sidebar/ui/
│       └── SidebarTeamList.tsx       # useRetroRooms 연결 (MODIFY)
└── features/
    └── retrospective/ui/
        └── RetrospectRow.tsx         # 참여자 데이터 연동 (MODIFY)
```

### Design Decisions

**Decision 1**: 기존 Query Hook 재사용

- **Rationale**: `useRetroRooms`, `useRetrospects` 이미 구현됨
- **Approach**: 목 데이터 제거 후 hook 결과 직접 사용
- **Impact**: LOW (기존 코드 활용)

**Decision 2**: 상태 필터링 로직

- **Rationale**: API 응답의 status 필드로 필터링
- **Approach**: 프론트엔드에서 today/pending/completed 분류
- **Benefit**: 단일 API 호출로 모든 데이터 조회

### Data Flow

```
useRetroRooms()
    ↓
MainPage / SidebarTeamList
    ↓ (팀 선택)
useRetrospects(retroRoomId)
    ↓
TeamDashboardPage
    ↓ (상태 필터링)
RetrospectRow (오늘/예정/완료)
```

---

## 4. Implementation Plan

### Phase 1: 팀 목록 API 연동

**Tasks**:

1. MainPage.tsx - 목 데이터 제거, useRetroRooms 결과 사용
2. SidebarTeamList.tsx - useState 목 데이터 제거, useRetroRooms 연결

**Files to Modify**:

- `src/pages/main/ui/MainPage.tsx` (MODIFY) - Lines 10-12
- `src/widgets/sidebar/ui/SidebarTeamList.tsx` (MODIFY) - Lines 12-15

### Phase 2: 회고 목록 API 연동

**Tasks**:

1. TeamDashboardPage.tsx - 더미 데이터 제거 (Lines 32-127)
2. useRetrospects 주석 해제 및 연결
3. 상태별 필터링 로직 구현

**Files to Modify**:

- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

### Phase 3: 참여자 데이터 연동

**Tasks**:

1. RetrospectRow.tsx - 하드코딩된 참여자 제거
2. API 응답의 member 데이터 사용

**Files to Modify**:

- `src/features/retrospective/ui/RetrospectRow.tsx` (MODIFY) - Lines 20-29

### Phase 4: 검증

**Tasks**:

1. 빌드 및 린트 검증
2. 기능 테스트

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] 팀 목록이 실제 API 데이터로 표시됨
- [ ] 회고 목록이 실제 API 데이터로 표시됨
- [ ] 메인 페이지 목 데이터 완전 제거
- [ ] 빌드 및 린트 통과

### Validation Checklist

**기능 동작**:

- [ ] MainPage 팀 목록 표시
- [ ] SidebarTeamList 팀 목록 표시
- [ ] TeamDashboard 회고 목록 표시
- [ ] 상태별 필터링 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 하드코딩된 목 데이터 없음
- [ ] 주석 처리된 코드 정리

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 응답 형식 불일치

- **Risk**: API 응답이 기대와 다를 수 있음
- **Impact**: MEDIUM
- **Mitigation**: generated API 타입 확인, 필요시 변환 로직 추가

**R-2**: 빈 상태 처리

- **Risk**: 팀/회고가 없을 때 UI 처리 미흡
- **Impact**: LOW
- **Mitigation**: 빈 상태 UI 확인 및 추가

### Dependencies

**D-1**: 기존 Query Hooks

- **Dependency**: `useRetroRooms`, `useRetrospects`
- **Status**: AVAILABLE

**D-2**: Generated API Types

- **Dependency**: `src/shared/api/generated/index.ts`
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. Phase 1: 팀 목록 연동
2. Phase 2: 회고 목록 연동
3. Phase 3: 참여자 데이터 연동
4. Phase 4: 최종 검증

### Success Metrics

**SM-1**: 목 데이터 제거율

- **Metric**: 하드코딩된 목 데이터 라인 수
- **Target**: 0 라인

---

## 8. Timeline & Milestones

### Milestones

**M1**: 팀 목록 API 연동

- MainPage, SidebarTeamList 연동
- **Status**: NOT_STARTED

**M2**: 회고 목록 API 연동

- TeamDashboardPage 연동
- **Status**: NOT_STARTED

**M3**: 참여자 데이터 연동

- RetrospectRow 연동
- **Status**: NOT_STARTED

**M4**: 최종 검증

- 빌드, 타입체크, 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #93: [팀 생성, 회고 생성 API 연동 및 메인 페이지 목 데이터 대체](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/93)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### Key Files

**API Layer**:

- `src/features/team/api/team.queries.ts` - useRetroRooms
- `src/features/retrospective/api/retrospective.queries.ts` - useRetrospects

**Generated API**:

- `src/shared/api/generated/index.ts` - 타입 정의 및 API 함수

---

## 10. Implementation Summary

**Completion Date**: 2026-02-04
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Modified

- [src/app/App.tsx](../../src/app/App.tsx) - ToastContainer 추가 (전역 Toast 렌더링)
- [src/pages/onboarding/ui/OnboardingPage.tsx](../../src/pages/onboarding/ui/OnboardingPage.tsx) - API 에러 처리 Toast 추가
- [src/pages/team-dashboard/ui/TeamDashboardPage.tsx](../../src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 잘못된 팀 URL 접근 시 리다이렉트 처리
- [src/widgets/header/ui/Header.tsx](../../src/widgets/header/ui/Header.tsx) - Avatar + DropdownMenu 조합으로 리팩토링
- [src/widgets/header/ui/ProfileMenu.tsx](../../src/widgets/header/ui/ProfileMenu.tsx) - 삭제 (Header에 통합)
- [src/widgets/sidebar/ui/SidebarTeamList.tsx](../../src/widgets/sidebar/ui/SidebarTeamList.tsx) - 팀 이름 편집, 팀 나가기 API 연동
- [src/widgets/sidebar/ui/SidebarTeamItem.tsx](../../src/widgets/sidebar/ui/SidebarTeamItem.tsx) - 높이 40px로 변경
- [src/features/team/api/team.queries.ts](../../src/features/team/api/team.queries.ts) - useUpdateRetroRoomName, useDeleteRetroRoom mutation 추가

#### Key Implementation Details

- OnboardingPage에서 signup, createRetroRoom, joinRetroRoom API 에러 시 Toast 표시
- TeamDashboardPage에서 존재하지 않는 팀 접근 시 다른 팀으로 리다이렉트 또는 메인 페이지로 이동
- Sidebar에서 "팀 이름 편집하기", "팀 나가기" 기능 API 연동
- 팀 나가기 후 남은 팀이 있으면 해당 팀으로, 없으면 메인 페이지로 이동
- Header를 Avatar + IconButton + DropdownMenu 컴포넌트 조합으로 리팩토링

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- ToastContainer 전역 설정 (App.tsx)
- 잘못된 팀 URL 리다이렉트 처리
- Header 컴포넌트 리팩토링 (계획에 없었음)
- Sidebar 팀 아이템 높이 조정

**Changed**:

- instance.ts의 isSuccess 체크 로직 제거 (사용자 요청으로 revert)

**Skipped**:

- 없음

### Notes

- Toast variant는 'warning' 사용 (에러 상황)
- 팀 삭제 후 navigation은 현재 팀일 경우에만 수행

---

**Plan Status**: Completed
**Last Updated**: 2026-02-04
