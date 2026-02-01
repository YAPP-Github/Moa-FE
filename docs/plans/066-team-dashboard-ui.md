# Task Plan: 팀 대시보드 (Teamspace) UI 구현

**Issue**: #66
**Type**: Feature
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 `TeamDashboardPage`는 placeholder 상태로, "팀 대시보드" 텍스트와 팀 ID만 표시합니다.

- 로그인 후 팀이 있는 사용자가 접근하는 주요 페이지임
- 실제 회고 목록과 팀 정보를 표시하는 UI가 필요함
- 사이드바에 팀 목록 네비게이션이 구현되어 있지 않음

### Objectives

1. 디자인 목업에 맞는 팀 대시보드 UI 구현
2. 사이드바에 팀 목록 표시 및 팀 전환 기능 구현
3. 회고 목록을 "대기 중"과 "완료됨"으로 구분하여 표시
4. Empty state UI 구현

### Scope

**In Scope**:

- TeamDashboardPage 메인 UI 구현
- DashboardSidebar에 팀 목록 표시
- 회고 목록 컴포넌트 구현 (대기 중 / 완료됨 섹션)
- Empty state 컴포넌트 구현
- "+ 회고 추가하기" 버튼 (회고 생성 다이얼로그 연결)

**Out of Scope**:

- 회고 생성 다이얼로그 구현 (별도 이슈)
- 회고 상세 페이지 구현
- 팀 설정/삭제 기능

### User Context

> 디자인 목업 제공됨

**핵심 요구사항**:

1. 사이드바: "목록" 헤더 + 팀 목록 (선택된 팀 강조)
2. 메인 영역: 팀 이름 + "회고 추가하기" 버튼 + 회고 섹션 2개

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 대시보드 메인 UI

- 팀 이름을 큰 제목으로 표시
- "+ 회고 추가하기" 버튼 (primary 스타일)
- 회고 목록을 두 섹션으로 구분 표시

**FR-2**: 회고 목록 섹션

- "회고 대기 중 N" 섹션 (왼쪽)
- "완료된 회고 N" 섹션 (오른쪽)
- 각 섹션에 회고 카드 또는 리스트 표시
- 회고가 없을 경우 empty state 표시

**FR-3**: 사이드바 팀 목록

- "목록" 헤더와 더보기 메뉴 (...)
- 팀 목록 표시 (선택된 팀은 파란색 배경)
- 팀 클릭 시 해당 팀 대시보드로 이동

### Technical Requirements

**TR-1**: API 연동

- `useRetroRooms()`: 팀 목록 조회
- `listRetrospects(retroRoomId)`: 회고 목록 조회
- React Query로 데이터 페칭 및 캐싱

**TR-2**: FSD 아키텍처 준수

- `pages/team-dashboard/`: 페이지 조립
- `features/retrospective/`: 회고 관련 기능 (새로 생성)
- `widgets/sidebar/`: 사이드바 업데이트
- 직접 import 방식 사용 (barrel export 금지)

### Non-Functional Requirements

**NFR-1**: 접근성

- 키보드 네비게이션 지원
- ARIA 레이블 적절히 추가

**NFR-2**: 반응형 고려

- 기본 데스크톱 레이아웃 우선
- 모바일 대응은 추후 고려

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── pages/
│   └── team-dashboard/
│       └── ui/
│           └── TeamDashboardPage.tsx    (MODIFY)
├── features/
│   ├── team/
│   │   └── api/
│   │       └── team.queries.ts          (기존 - useRetroRooms)
│   └── retrospective/                   (CREATE - 새 feature)
│       ├── ui/
│       │   ├── RetrospectSection.tsx    (CREATE)
│       │   ├── RetrospectCard.tsx       (CREATE)
│       │   └── RetrospectEmptyState.tsx (CREATE)
│       └── api/
│           └── retrospective.queries.ts (CREATE)
└── widgets/
    └── sidebar/
        └── ui/
            ├── DashboardSidebar.tsx     (MODIFY)
            ├── SidebarTeamList.tsx      (CREATE)
            └── SidebarTeamItem.tsx      (CREATE)
```

### Design Decisions

**Decision 1**: 회고 상태 구분 방식

- **Rationale**: 디자인에서 "회고 대기 중"과 "완료된 회고"로 구분
- **Issue**: 현재 `RetrospectListItem`에 status 필드가 없음
- **Approach**:
  - 방법 1: 백엔드에 status 필드 추가 요청
  - 방법 2: 프론트에서 회고 상세를 각각 조회하여 status 확인 (비효율적)
  - 방법 3: 일단 전체 목록으로 표시하고, 추후 status 필드 추가 시 구분
- **Decision**: 방법 3 선택 - 우선 UI 구조만 구현하고, 백엔드 협의 후 상태 구분 추가
- **Impact**: MEDIUM

**Decision 2**: 사이드바 팀 목록 구현

- **Rationale**: 기존 `DashboardSidebar`에 팀 목록 기능 추가 필요
- **Approach**: `SidebarTeamList` 컴포넌트로 분리하여 구현
- **Benefit**: 관심사 분리, 재사용성

### Component Design

**TeamDashboardPage**:

```typescript
// 페이지 조립 - 데이터 페칭 및 레이아웃
function TeamDashboardPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: roomData } = useRetroRooms();
  const { data: retrospects } = useRetrospects(Number(teamId));

  const currentRoom = roomData?.result?.find(
    (r) => r.retroRoomId === Number(teamId)
  );

  return (
    <div className="p-6">
      <TeamHeader name={currentRoom?.retroRoomName} />
      <div className="grid grid-cols-2 gap-6">
        <RetrospectSection
          title="회고 대기 중"
          count={pendingCount}
          items={pendingItems}
        />
        <RetrospectSection
          title="완료된 회고"
          count={completedCount}
          items={completedItems}
        />
      </div>
    </div>
  );
}
```

**SidebarTeamList**:

```typescript
// 사이드바 팀 목록
function SidebarTeamList() {
  const { teamId } = useParams<{ teamId: string }>();
  const { data } = useRetroRooms();

  return (
    <ul>
      {data?.result?.map((team) => (
        <SidebarTeamItem
          key={team.retroRoomId}
          team={team}
          isActive={team.retroRoomId === Number(teamId)}
        />
      ))}
    </ul>
  );
}
```

### Data Models

```typescript
// 기존 API 타입 활용
interface RetroRoomListItem {
  orderIndex: number;
  retroRoomId: number;
  retroRoomName: string;
}

interface RetrospectListItem {
  projectName: string;
  retrospectDate: string;
  retrospectId: number;
  retrospectMethod: string;
  retrospectTime: string;
}

// 추후 백엔드 협의 시 추가 필요
// status?: 'DRAFT' | 'SUBMITTED' | 'ANALYZED';
```

---

## 4. Implementation Plan

### Phase 1: API 및 기반 설정

**Tasks**:

1. `features/retrospective/api/retrospective.queries.ts` 생성 - useRetrospects 훅
2. API 연동 테스트

**Files to Create/Modify**:

- `src/features/retrospective/api/retrospective.queries.ts` (CREATE)

### Phase 2: 사이드바 팀 목록 구현

**Tasks**:

1. `SidebarTeamItem` 컴포넌트 구현
2. `SidebarTeamList` 컴포넌트 구현
3. `DashboardSidebar`에 팀 목록 통합
4. 더보기 메뉴 (...) 버튼 추가

**Files to Create/Modify**:

- `src/widgets/sidebar/ui/SidebarTeamItem.tsx` (CREATE)
- `src/widgets/sidebar/ui/SidebarTeamList.tsx` (CREATE)
- `src/widgets/sidebar/ui/DashboardSidebar.tsx` (MODIFY)
- `src/widgets/sidebar/ui/SidebarListHeader.tsx` (MODIFY - 더보기 메뉴 추가)

**Dependencies**: Phase 1 완료 필요

### Phase 3: 회고 목록 컴포넌트 구현

**Tasks**:

1. `RetrospectEmptyState` 컴포넌트 구현
2. `RetrospectCard` 컴포넌트 구현
3. `RetrospectSection` 컴포넌트 구현 (제목 + 카운트 + 리스트/empty state)

**Files to Create/Modify**:

- `src/features/retrospective/ui/RetrospectEmptyState.tsx` (CREATE)
- `src/features/retrospective/ui/RetrospectCard.tsx` (CREATE)
- `src/features/retrospective/ui/RetrospectSection.tsx` (CREATE)

**Dependencies**: Phase 1 완료 필요

### Phase 4: 팀 대시보드 페이지 조립

**Tasks**:

1. `TeamDashboardPage` 리팩토링 - 새 컴포넌트들 조립
2. 팀 헤더 영역 구현 (팀 이름 + 회고 추가 버튼)
3. 로딩/에러 상태 처리

**Files to Create/Modify**:

- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

**Dependencies**: Phase 2, 3 완료 필요

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용, barrel export 금지

**HIGH**:

- `server-cache-react`: React Query 캐싱 활용

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 (팀 목록, 회고 목록)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 컴포넌트 렌더링 테스트

- 각 컴포넌트가 올바르게 렌더링되는지 확인
- Empty state가 데이터 없을 때 표시되는지 확인

**TS-2**: API 연동 테스트

- useRetrospects 훅이 올바르게 데이터 페칭하는지
- 로딩/에러 상태 처리

**TS-3**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] 팀 대시보드 페이지 UI 구현 (디자인 목업 일치)
- [ ] 사이드바에 팀 목록 표시
- [ ] 선택된 팀 강조 표시 (파란색 배경)
- [ ] 팀 클릭 시 해당 팀 대시보드로 이동
- [ ] 회고 목록 두 섹션으로 구분 표시
- [ ] Empty state 표시 (회고가 없을 때)
- [ ] "+ 회고 추가하기" 버튼 표시
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] `/teams/{teamId}` 경로에서 팀 대시보드 표시
- [ ] 사이드바 팀 목록에서 팀 전환 가능
- [ ] 회고 목록 API 연동 확인

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 준수 (레이어 의존성)
- [ ] 직접 import 방식 사용

**성능**:

- [ ] 불필요한 리렌더링 없음
- [ ] React Query 캐싱 적용

---

## 6. Risks & Dependencies

### Risks

**R-1**: 회고 상태 구분 API 미지원

- **Risk**: `RetrospectListItem`에 status 필드가 없어 "대기 중"/"완료됨" 구분 불가
- **Impact**: MEDIUM
- **Probability**: HIGH (현재 API 스펙 확인됨)
- **Mitigation**:
  - 우선 UI 구조만 구현
  - 백엔드에 status 필드 추가 요청
  - 또는 전체 목록으로 표시하고 추후 구분 추가
- **Status**: 확인됨 - 백엔드 협의 필요

### Dependencies

**D-1**: 기존 API 및 훅

- **Dependency**: `useRetroRooms`, `listRetrospects` API
- **Required For**: 팀 목록, 회고 목록 표시
- **Status**: AVAILABLE

**D-2**: 기존 UI 컴포넌트

- **Dependency**: Button, Dialog 등 shared/ui 컴포넌트
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 개발 완료 후 PR 생성
2. 코드 리뷰 및 머지
3. Vercel Preview 배포에서 테스트
4. main 머지 후 프로덕션 배포

### Success Metrics

**SM-1**: 기능 완성도

- **Metric**: 디자인 목업과의 일치도
- **Target**: 90% 이상 일치

**SM-2**: 성능

- **Metric**: 페이지 로딩 시간
- **Target**: 3초 이내

---

## 8. Timeline & Milestones

### Milestones

**M1**: API 및 기반 설정

- useRetrospects 훅 구현
- **Status**: NOT_STARTED

**M2**: 사이드바 팀 목록

- 팀 목록 표시 및 네비게이션
- **Status**: NOT_STARTED

**M3**: 회고 목록 컴포넌트

- 섹션, 카드, empty state 구현
- **Status**: NOT_STARTED

**M4**: 페이지 조립 및 완성

- 전체 통합 및 테스트
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #66: [팀 대시보드 (Teamspace) UI 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/66)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com/)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-01
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [`src/features/retrospective/api/retrospective.queries.ts`](../../src/features/retrospective/api/retrospective.queries.ts) - useRetrospects 훅 (React Query)
- [`src/features/retrospective/ui/RetrospectSection.tsx`](../../src/features/retrospective/ui/RetrospectSection.tsx) - 회고 섹션 컴포넌트 (제목 + 카운트 + 리스트/empty state)
- [`src/features/retrospective/ui/RetrospectCard.tsx`](../../src/features/retrospective/ui/RetrospectCard.tsx) - 회고 카드 컴포넌트
- [`src/features/retrospective/ui/RetrospectEmptyState.tsx`](../../src/features/retrospective/ui/RetrospectEmptyState.tsx) - Empty state 컴포넌트
- [`src/widgets/sidebar/ui/SidebarTeamList.tsx`](../../src/widgets/sidebar/ui/SidebarTeamList.tsx) - 팀 목록 컴포넌트
- [`src/widgets/sidebar/ui/SidebarTeamItem.tsx`](../../src/widgets/sidebar/ui/SidebarTeamItem.tsx) - 팀 아이템 컴포넌트 (선택 상태 강조)
- [`src/shared/ui/icons/IcNote.tsx`](../../src/shared/ui/icons/IcNote.tsx) - 노트 아이콘 (empty state용)

#### Files Modified

- [`src/pages/team-dashboard/ui/TeamDashboardPage.tsx`](../../src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 전체 리팩토링 (팀 이름, 회고 추가 버튼, 두 섹션 레이아웃)
- [`src/widgets/sidebar/ui/DashboardSidebar.tsx`](../../src/widgets/sidebar/ui/DashboardSidebar.tsx) - 팀 목록 통합

#### Key Implementation Details

- FSD 아키텍처 준수: `features/retrospective/` 신규 생성
- 직접 import 방식 사용 (barrel export 금지)
- React Query로 데이터 페칭 및 캐싱 (staleTime: 5분)
- Tailwind CSS 커스텀 토큰 사용 (`text-title-1`, `text-grey-900` 등)

### Quality Validation

- [x] Build: Success (452.87 kB)
- [x] Type Check: Passed
- [x] Lint: Passed (101 files checked)

### Deviations from Plan

**Added**:

- `IcNote.tsx` 아이콘 컴포넌트 추가 (empty state에 필요)

**Changed**:

- `SidebarListHeader.tsx` 수정 불필요 (이미 더보기 메뉴 존재)
- 타이포그래피: `text-heading-1` → `text-title-1` (프로젝트 Tailwind 토큰 사용)

**Skipped**:

- 회고 상태 구분 (API에 status 필드 없음 - 백엔드 협의 필요)
- 회고 추가하기 버튼 클릭 시 다이얼로그 연결 (별도 이슈)

### Performance Impact

- Bundle size: +0.4KB (신규 컴포넌트)
- No runtime impact (React Query 캐싱 적용)

### Follow-up Tasks

- [ ] 백엔드에 `RetrospectListItem.status` 필드 추가 요청
- [ ] 회고 생성 다이얼로그 구현 (별도 이슈)
- [ ] 회고 카드 클릭 시 상세 페이지 이동

### Notes

- 현재 회고 상태 구분 불가 - 전체를 "회고 대기 중"에 표시하고 "완료된 회고"는 빈 상태
- TODO 주석으로 추후 status 필드 추가 시 쉽게 구분할 수 있도록 코드 구조화

---

**Plan Status**: Completed
**Last Updated**: 2026-02-01
**Next Action**: `/commit` → `/pr`
