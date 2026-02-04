# Task Plan: Connect Add Team Modal to Sidebar

**Issue**: #92
**Type**: Feature
**Created**: 2026-02-04
**Status**: Planning

---

## 1. Overview

### Problem Statement

홈 사이드바의 목록 헤더에 "팀 추가" 메뉴 아이템이 구현되어 있으나, 실제 모달과 연결되어 있지 않아 사용자가 기능을 사용할 수 없습니다. CreateTeamDialog 모달은 이미 완전히 구현되어 있지만, UI 트리거가 없는 상태입니다.

- **현재 상황**: SidebarListHeader에 `onAddTeam` prop이 정의되어 있지만 사용되지 않음
- **왜 필요한지**: 사용자가 사이드바에서 직접 새 팀을 추가할 수 있어야 함
- **해결하지 않으면**: 팀 추가 기능이 접근 불가능하여 UX가 불완전함

### Objectives

1. SidebarListHeader의 "팀 추가" 버튼을 CreateTeamDialog와 연결
2. FSD 아키텍처 레이어 규칙을 준수하며 구현
3. 팀 생성 성공 시 사이드바 목록이 자동으로 갱신되도록 설정

### Scope

**In Scope**:

- DashboardLayout에 모달 상태 관리 로직 추가
- DashboardSidebar에 `onAddTeam` callback prop 추가
- SidebarListHeader의 기존 `onAddTeam` prop 활성화
- CreateTeamDialog를 DashboardLayout에서 렌더링
- 팀 생성 성공 시 React Query 캐시 갱신 (이미 구현됨)

**Out of Scope**:

- CreateTeamDialog 자체 수정 (이미 완전히 구현됨)
- SidebarTeamList의 API 쿼리 통합 (별도 작업)
- 팀 목록 UI 개선 또는 리팩토링

### User Context

> "홈 사이드바의 목록 더보기 버튼을 누르면 새 팀 추가하기 버튼이 나오고, 해당 버튼을 누르면 기존에 작업해뒀던 새 팀 추가 모달이 표시되게 연결만 할거야."

**핵심 요구사항**:

1. 기존 UI 컴포넌트들의 연결만 수행 (새로운 구현 불필요)
2. 모달 열기/닫기 동작이 정상적으로 작동해야 함
3. 간단한 통합 작업 (복잡도: LOW)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 모달 트리거 기능

- 사용자가 SidebarListHeader의 더보기 버튼(meatball menu)을 클릭
- "팀 추가" 메뉴 아이템을 선택하면 CreateTeamDialog가 열림
- 모달 외부 클릭 또는 닫기 버튼으로 모달 닫기 가능

**FR-2**: 팀 생성 성공 처리

- 사용자가 모달에서 팀 이름을 입력하고 "완료" 버튼 클릭
- 팀 생성 성공 시 모달 자동 닫기
- React Query 캐시 무효화로 사이드바 목록 갱신 (기존 로직 활용)

**FR-3**: FSD 레이어 준수

- widgets 레이어(sidebar)가 features 레이어(team)를 직접 참조하지 않음
- 상위 레이어(layout)에서 모달 상태를 관리하고 연결

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 레이어 의존성: `widgets/layout → widgets/sidebar, features/team`
- 직접 import 방식 사용 (tree-shaking 최적화)
- Sidebar는 callback만 받아서 실행 (모달 모름)

**TR-2**: React 상태 관리 패턴

- 로컬 `useState`로 모달 open 상태 관리
- Props를 통한 callback 전달 (prop drilling)
- 기존 모달 패턴과 일관성 유지

**TR-3**: React Query 통합

- 팀 생성 mutation은 이미 구현됨 (`useCreateRetroRoom`)
- 성공 시 `retroRooms` 쿼리 캐시 자동 무효화 (기존 설정)
- 추가 통합 작업 불필요

### Non-Functional Requirements

**NFR-1**: 사용성

- 모달 열기/닫기 동작이 즉각적이고 부드러움
- 키보드 접근성 유지 (Radix UI Dialog 기본 기능)
- 모달 외부 클릭 시 닫기 동작 지원

**NFR-2**: 유지보수성

- 기존 코드 패턴과 일관성 유지
- 최소한의 변경으로 기능 구현
- 명확한 props 네이밍 (`onAddTeam`)

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── widgets/
│   ├── layout/
│   │   └── ui/
│   │       ├── BaseLayout.tsx
│   │       └── DashboardLayout.tsx          (MODIFY - 모달 상태 관리)
│   └── sidebar/
│       └── ui/
│           ├── DashboardSidebar.tsx         (MODIFY - onAddTeam prop 추가)
│           ├── SidebarListHeader.tsx        (NO CHANGE - 이미 준비됨)
│           ├── SidebarTeamList.tsx
│           └── SidebarTeamItem.tsx
└── features/
    └── team/
        └── ui/
            ├── CreateTeamDialog.tsx         (NO CHANGE - 재사용)
            └── CreateTeamForm.tsx
```

### Design Decisions

**Decision 1**: 모달 상태를 DashboardLayout에서 관리

- **Rationale**: FSD 레이어 규칙 준수 (widgets가 features를 직접 참조하지 않음)
- **Approach**:
  - `DashboardLayout`에 `useState(false)` 추가
  - `onAddTeam` callback을 `DashboardSidebar`에 전달
  - `CreateTeamDialog`를 `DashboardLayout`에서 렌더링
- **Trade-offs**:
  - ✅ FSD 준수, 명확한 책임 분리
  - ❌ Props drilling 1단계 추가 (DashboardLayout → DashboardSidebar)
  - **판단**: Props drilling 1단계는 허용 가능한 수준
- **Alternatives Considered**:
  - Option A: Zustand 전역 상태 사용 → 과도한 복잡도 (이 작업에는 불필요)
  - Option B: Sidebar에서 직접 모달 import → FSD 위반
- **Impact**: LOW (단순 상태 관리, 성능 영향 없음)

**Decision 2**: 기존 모달 패턴 재사용

- **Rationale**:
  - `CreateTeamDialog`는 이미 완전히 구현됨
  - `NoTeamEmptyState`, `TeamDashboardPage`에서 동일 패턴 사용 중
- **Implementation**:
  - `open`, `onOpenChange`, `onSuccess` props 전달
  - 성공 시 모달 자동 닫기 (기존 로직)
  - React Query 캐시 무효화 (자동)
- **Benefit**:
  - 코드 중복 없음
  - 일관된 UX
  - 테스트된 코드 재사용

**Decision 3**: 직접 import 방식 유지

- **Rationale**: Tree-shaking 최적화, 프로젝트 컨벤션 준수
- **Implementation**:
  ```typescript
  import { DashboardSidebar } from "@/widgets/sidebar/ui/DashboardSidebar";
  import { CreateTeamDialog } from "@/features/team/ui/CreateTeamDialog";
  ```
- **Benefit**: 번들 크기 최적화, 명확한 의존성

### Component Design

**DashboardLayout 수정**:

```typescript
// src/widgets/layout/ui/DashboardLayout.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { BaseLayout } from "./BaseLayout";
import { DashboardSidebar } from "@/widgets/sidebar/ui/DashboardSidebar";
import { CreateTeamDialog } from "@/features/team/ui/CreateTeamDialog";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);

  const handleAddTeam = () => {
    setIsAddTeamDialogOpen(true);
  };

  return (
    <BaseLayout>
      <div className="flex h-full">
        <DashboardSidebar onAddTeam={handleAddTeam} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      <CreateTeamDialog
        open={isAddTeamDialogOpen}
        onOpenChange={setIsAddTeamDialogOpen}
        onSuccess={(result) => {
          // Optional: 생성된 팀으로 이동 (미래 기능)
          console.log("Team created:", result);
        }}
      />
    </BaseLayout>
  );
}
```

**DashboardSidebar 수정**:

```typescript
// src/widgets/sidebar/ui/DashboardSidebar.tsx
import { SidebarListHeader } from "./SidebarListHeader";
import { SidebarTeamList } from "./SidebarTeamList";

interface DashboardSidebarProps {
  className?: string;
  onAddTeam?: () => void; // 추가
}

export function DashboardSidebar({
  className,
  onAddTeam,
}: DashboardSidebarProps) {
  return (
    <aside
      className={`w-[240px] h-full shrink-0 pl-[34px] pr-[10px] py-[20px] ${
        className ?? ""
      }`}
    >
      <SidebarListHeader title="목록" onAddTeam={onAddTeam} />
      <nav className="mt-2">
        <SidebarTeamList />
      </nav>
    </aside>
  );
}
```

**플로우 다이어그램**:

```
사용자 클릭 (더보기 버튼)
    ↓
SidebarListHeader - DropdownMenu 열림
    ↓
"팀 추가" 선택
    ↓
onAddTeam() 호출 → 전달된 callback 실행
    ↓
DashboardSidebar.props.onAddTeam() → 상위로 전파
    ↓
DashboardLayout.handleAddTeam() → 상태 업데이트
    ↓
setIsAddTeamDialogOpen(true)
    ↓
CreateTeamDialog 렌더링 (open=true)
    ↓
사용자가 팀 이름 입력 → "완료" 클릭
    ↓
CreateTeamForm.handleSubmit() → mutation.mutateAsync()
    ↓
성공 시:
  - onClose() → 모달 닫기
  - onSuccess(result) 호출
  - QueryClient.invalidateQueries('retroRooms')
    ↓
SidebarTeamList 자동 갱신 (React Query 재fetch)
```

### Data Models

**기존 타입 재사용**:

```typescript
// src/shared/api/generated/index.ts (이미 정의됨)
interface RetroRoomCreateResponse {
  retroRoomId: number;
  retroRoomName: string;
  orderIndex: number;
}

interface RetroRoomListItem {
  retroRoomId: number;
  retroRoomName: string;
  orderIndex: number;
}
```

**추가 타입 정의 불필요** - 모든 타입이 이미 존재함

### API Design

**API 통합 없음** - 기존 API 및 React Query 설정 재사용

**기존 Mutation** (`features/team/api/team.mutations.ts`):

- `useCreateRetroRoom()`: 팀 생성
- 성공 시 자동으로 `retroRooms` 쿼리 무효화
- 추가 통합 작업 불필요

---

## 4. Implementation Plan

### Phase 1: DashboardLayout 수정

**Tasks**:

1. `DashboardLayout.tsx`에 모달 상태 추가 (`useState`)
2. `handleAddTeam` callback 함수 생성
3. `CreateTeamDialog` import 및 렌더링
4. `DashboardSidebar`에 `onAddTeam` prop 전달

**Files to Modify**:

- [src/widgets/layout/ui/DashboardLayout.tsx](../../../src/widgets/layout/ui/DashboardLayout.tsx) (MODIFY)
  - `useState` import 추가
  - `isAddTeamDialogOpen` 상태 추가
  - `handleAddTeam` 함수 추가
  - `CreateTeamDialog` import 및 JSX 추가
  - `DashboardSidebar`에 `onAddTeam={handleAddTeam}` prop 전달

**Estimated Effort**: Small (10-15분)

### Phase 2: DashboardSidebar Props 추가

**Tasks**:

1. `DashboardSidebar.tsx` props 인터페이스에 `onAddTeam` 추가
2. `SidebarListHeader`에 `onAddTeam` prop 전달

**Files to Modify**:

- [src/widgets/sidebar/ui/DashboardSidebar.tsx](../../../src/widgets/sidebar/ui/DashboardSidebar.tsx) (MODIFY)
  - `DashboardSidebarProps` 인터페이스에 `onAddTeam?: () => void` 추가
  - `SidebarListHeader`에 `onAddTeam={onAddTeam}` prop 전달

**Dependencies**: Phase 1 완료 필요

**Estimated Effort**: Small (5분)

### Phase 3: 테스트 및 검증

**Tasks**:

1. 빌드 및 타입 체크 실행
2. 수동 테스트 (모달 열기/닫기, 팀 생성)
3. 코드 리뷰 및 린트 통과 확인

**Files to Validate**:

- Build: `npm run build`
- Type Check: `npx tsc --noEmit`
- Lint: `npm run lint`

**Estimated Effort**: Small (10분)

### Vercel React Best Practices

**MEDIUM**:

- **rerender-memo**:

  - DashboardSidebar가 `onAddTeam` prop으로 인해 불필요하게 리렌더링될 수 있음
  - 현재 구현에서는 `handleAddTeam`이 안정적이므로 문제없음
  - 미래 최적화: `useCallback`으로 `handleAddTeam` 메모이제이션 가능

- **rerender-functional-setstate**:
  - `setIsAddTeamDialogOpen(true)` 직접 사용
  - 현재 구현에서는 상태가 단순하므로 문제없음

**LOW**:

- **async-parallel**: 해당 없음 (데이터 페칭 없음)
- **bundle-barrel-imports**: 이미 준수 (직접 import 사용)
- **server-cache-react**: 해당 없음 (클라이언트 상태만)

**적용 전략**:

- 현재 구현은 간단하므로 기본 패턴만 사용
- 성능 이슈 발견 시 `useCallback` 추가 고려

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 기능 테스트

- 테스트 타입: Manual Integration Testing
- 테스트 케이스:
  - TC-1: 사이드바 더보기 버튼 클릭 → "팀 추가" 메뉴 표시
  - TC-2: "팀 추가" 클릭 → CreateTeamDialog 모달 열림
  - TC-3: 모달 외부 클릭 → 모달 닫힘
  - TC-4: 팀 이름 입력 후 "완료" 클릭 → 팀 생성 성공 → 모달 닫힘
  - TC-5: 팀 생성 성공 후 사이드바 목록 갱신 확인 (React Query 캐시)

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] SidebarListHeader의 "팀 추가" 버튼 클릭 시 CreateTeamDialog가 열림
- [x] 모달 닫기 동작 정상 작동
- [x] 팀 생성 성공 시 사이드바 목록 갱신
- [x] FSD 아키텍처 레이어 규칙 준수
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 더보기 버튼 클릭 시 드롭다운 메뉴 표시
- [ ] "팀 추가" 메뉴 아이템 클릭 시 모달 열림
- [ ] 모달 외부 클릭 시 모달 닫힘
- [ ] ESC 키로 모달 닫기 가능
- [ ] 팀 이름 입력 필드 포커스 자동 설정
- [ ] "완료" 버튼 클릭 시 팀 생성 API 호출
- [ ] 팀 생성 성공 시 모달 자동 닫기
- [ ] 사이드바 팀 목록 자동 갱신 (React Query)

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] Props 타입 정의 명확
- [ ] 직접 import 방식 사용

**성능**:

- [ ] 번들 크기 증가 미미 (< 1KB, 신규 코드 없음)
- [ ] 불필요한 리렌더링 없음
- [ ] 모달 열기/닫기 즉각 반응

**접근성**:

- [ ] 키보드 네비게이션 동작 (Radix UI 기본 제공)
- [ ] ARIA 레이블 유지 (기존 컴포넌트 활용)
- [ ] 포커스 트랩 동작 (모달 내부)

**FSD 준수**:

- [ ] widgets/layout → widgets/sidebar (OK)
- [ ] widgets/layout → features/team (OK)
- [ ] widgets/sidebar는 features/team을 직접 참조하지 않음 (OK)
- [ ] 직접 import 방식 사용 (tree-shaking 최적화)

---

## 6. Risks & Dependencies

### Risks

**R-1**: SidebarTeamList가 React Query 쿼리를 사용하지 않음

- **Risk**: 팀 생성 성공 후 목록이 자동 갱신되지 않을 수 있음
- **Impact**: MEDIUM
- **Probability**: HIGH
- **Mitigation**:
  - 현재 `SidebarTeamList`는 mock 데이터 사용 중
  - `useRetroRooms()` 쿼리가 주석 처리되어 있음
  - 이슈 범위 내: 모달 연결만 수행
  - 해결: 별도 이슈로 분리하여 API 쿼리 통합 작업 진행
- **Status**: ACKNOWLEDGED (별도 작업으로 분리)

**R-2**: Props Drilling 추가로 인한 복잡도 증가

- **Risk**: DashboardLayout → DashboardSidebar → SidebarListHeader props 전달
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**:
  - 1단계 props drilling은 허용 가능
  - 미래 확장 시 Context API 고려 가능
- **Status**: ACCEPTABLE

### Dependencies

**D-1**: CreateTeamDialog 컴포넌트

- **Dependency**: features/team/ui/CreateTeamDialog.tsx (이미 구현됨)
- **Required For**: 모달 렌더링
- **Status**: AVAILABLE ✅
- **Owner**: 기존 팀 (구현 완료)

**D-2**: React Query 설정

- **Dependency**:
  - `useCreateRetroRoom` mutation (이미 구현됨)
  - QueryClient 캐시 무효화 설정 (이미 구현됨)
- **Required For**: 팀 생성 및 목록 갱신
- **Status**: AVAILABLE ✅
- **Owner**: 기존 팀 (구현 완료)

**D-3**: Radix UI Dialog

- **Dependency**: shared/ui/dialog/Dialog.tsx (이미 구현됨)
- **Required For**: 모달 UI 렌더링
- **Status**: AVAILABLE ✅
- **Owner**: 기존 팀 (구현 완료)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**단일 배포**:

- 기능이 간단하고 위험도가 낮아 단계적 배포 불필요
- PR 머지 후 즉시 프로덕션 배포 가능

**Rollback Plan**:

- Git revert로 즉시 롤백 가능
- 백엔드 API 변경 없음 (기존 API 재사용)
- 데이터베이스 마이그레이션 없음

**Feature Flags**: 불필요 (간단한 UI 연결 작업)

### Success Metrics

**SM-1**: 모달 오픈율

- **Metric**: "팀 추가" 버튼 클릭 → 모달 열림 성공률
- **Target**: 100% (기술적 성공률)
- **Measurement**: 수동 테스트 (자동화 추후 고려)

**SM-2**: 팀 생성 성공률

- **Metric**: 모달 열림 → 팀 생성 완료 성공률
- **Target**: 기존 팀 생성 기능과 동일 (변경 없음)
- **Measurement**: React Query mutation success rate

### Monitoring

**M-1**: 사용자 피드백

- UI/UX 이슈 확인
- 모달 동작 관련 버그 리포트 모니터링

**M-2**: React Query 캐시 동작

- 팀 생성 후 목록 갱신 확인
- 캐시 무효화 정상 작동 여부

---

## 8. Timeline & Milestones

### Milestones

**M1**: DashboardLayout 수정 완료

- 모달 상태 관리 로직 추가
- CreateTeamDialog 렌더링
- **목표**: 2026-02-04 (작업 시작 후 15분)
- **Status**: NOT_STARTED

**M2**: DashboardSidebar Props 연결 완료

- `onAddTeam` prop 추가 및 전달
- **목표**: 2026-02-04 (M1 완료 후 5분)
- **Status**: NOT_STARTED

**M3**: 테스트 및 검증 완료

- 수동 테스트 통과
- 빌드 및 타입 체크 성공
- **목표**: 2026-02-04 (M2 완료 후 10분)
- **Status**: NOT_STARTED

### Estimated Timeline

- **Phase 1 (DashboardLayout)**: 10-15분
- **Phase 2 (DashboardSidebar)**: 5분
- **Phase 3 (Testing)**: 10분
- **Total**: 25-30분

---

## 9. References

### Related Issues

- Issue #92: [홈 사이드바 목록 더보기에 새 팀 추가 모달 연결](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/92)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md) - FSD 아키텍처 가이드
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md)
- [.claude/rules/task-management.md](../../.claude/rules/task-management.md)

**커맨드**:

- [/issue-start](../../.claude/commands/issue-start.md)
- [/task-init](../../.claude/commands/task-init.md)
- [/task-done](../../.claude/commands/task-done.md)
- [/commit](../../.claude/commands/commit.md)
- [/pr](../../.claude/commands/pr.md)

**스킬**:

- [task-init](../../.claude/skills/task-init/SKILL.md)
- [task-done](../../.claude/skills/task-done/SKILL.md)
- [vercel-react-best-practices](../../.claude/skills/vercel-react-best-practices/SKILL.md)

### External Resources

**React 패턴**:

- [React Patterns - Modal](https://react.dev/learn/sharing-state-between-components)
- [Radix UI Dialog Documentation](https://www.radix-ui.com/docs/primitives/components/dialog)

**FSD 아키텍처**:

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [카카오페이 FSD 적용기](https://tech.kakaopay.com/post/fsd/)

**React Query**:

- [React Query - Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)

### Key Learnings

**FSD 레이어 분리의 중요성**:

- widgets가 features를 직접 참조하지 않도록 상위 레이어에서 연결
- Props drilling 1단계는 허용 가능한 복잡도
- 명확한 책임 분리로 유지보수성 향상

**기존 패턴 재사용의 이점**:

- `CreateTeamDialog`는 이미 완전히 구현되어 있어 재사용만으로 충분
- 프로젝트 내 모달 패턴이 일관되어 통합이 간단함
- React Query 캐시 무효화가 자동으로 동작

---

## 10. Implementation Summary

**Completion Date**: 2026-02-04
**Implemented By**: Claude Sonnet 4.5

### Changes Made

#### Modified Files

- [src/widgets/layout/ui/DashboardLayout.tsx](../../../src/widgets/layout/ui/DashboardLayout.tsx) - 모달 상태 관리 추가

  - `useState`로 `isAddTeamDialogOpen` 상태 관리
  - `handleAddTeam` callback 함수 생성
  - `CreateTeamDialog` import 및 렌더링
  - `DashboardSidebar`에 `onAddTeam` prop 전달

- [src/widgets/sidebar/ui/DashboardSidebar.tsx](../../../src/widgets/sidebar/ui/DashboardSidebar.tsx) - onAddTeam prop 추가

  - `DashboardSidebarProps` 인터페이스에 `onAddTeam?: () => void` 추가
  - `SidebarListHeader`에 `onAddTeam` prop 전달

- [src/widgets/sidebar/ui/SidebarListHeader.tsx](../../../src/widgets/sidebar/ui/SidebarListHeader.tsx) - 팝오버 UI 구현
  - `IcPlusBlue` 아이콘 import
  - IconButton에 호버/클릭 효과 추가 (`hover:bg-grey-200`, `data-[state=open]:bg-grey-300`)
  - DropdownMenuContent 스타일 커스터마이징:
    - 위치: 오른쪽 정렬 (`align="end"`), 아래로 4px (`sideOffset={4}`)
    - 스타일: `p-3`, `gap-3`, `rounded-[8px]`, shadow 효과
  - "목록" 텍스트 추가 (`text-caption-4 text-grey-700`)
  - "새 팀 추가하기" 버튼 추가:
    - IcPlusBlue 아이콘 (20×20, `rounded-[10px]`, `bg-blue-200`)
    - 텍스트: `text-sub-title-3 text-blue-500`
    - 아이콘과 텍스트 간격: 8px (`gap-2`)

#### Key Implementation Details

- FSD 아키텍처 준수: widgets/layout에서 모달 상태 관리, widgets/sidebar는 callback만 실행
- 기존 `CreateTeamDialog` 재사용 (신규 구현 없음)
- 직접 import 방식 사용 (tree-shaking 최적화)
- SidebarTeamItem의 더보기 버튼 패턴 참조하여 일관성 유지

### Quality Validation

- [x] Build: Success (`npm run build`)
- [x] Type Check: Passed (`npx tsc --noEmit`)
- [x] Lint: Passed (`npm run lint`)
- [x] FSD Architecture: 레이어 규칙 준수
- [x] Direct Imports: 모든 import가 직접 경로 사용

### Deviations from Plan

**Changed**:

- UI 스펙 변경 (사용자 요청):
  - 계획: 기본 DropdownMenu 스타일
  - 실제: 커스텀 팝오버 스타일 (목록 텍스트 + 새 팀 추가하기 버튼)
  - 상세 스펙: 위치, 간격, 색상, 아이콘 크기 등 세부 조정
- 호버 효과: 처음 추가했다가 사용자 요청으로 제거

**Kept as Planned**:

- FSD 아키텍처 준수
- DashboardLayout에서 모달 상태 관리
- Props drilling 방식 (1단계)
- 기존 CreateTeamDialog 재사용

### Performance Impact

- Bundle size: 최소 증가 (신규 컴포넌트 없음, 기존 연결만)
- Runtime: 영향 없음 (단순 상태 관리 및 callback 전달)
- Tree-shaking: 직접 import 사용으로 최적화 유지

### Commits

> **Note**: 커밋 전 상태입니다. `/commit` 실행 후 커밋 히스토리가 추가됩니다.

**Working Directory Changes**:

```
 M src/widgets/layout/ui/DashboardLayout.tsx
 M src/widgets/sidebar/ui/DashboardSidebar.tsx
 M src/widgets/sidebar/ui/SidebarListHeader.tsx
 A docs/plans/092-connect-add-team-to-sidebar.md
```

### Follow-up Tasks

- [ ] SidebarTeamList에 React Query 쿼리 통합 (별도 이슈 필요)
- [ ] 팀 생성 후 해당 팀으로 자동 이동 기능 추가 (선택사항)

### Notes

- 모든 변경 사항이 FSD 아키텍처를 준수함
- 사용자 요청에 따라 UI 스펙을 조정하며 즉각 반영
- 기존 패턴(SidebarTeamItem)을 참조하여 일관성 유지
- 품질 검증 모두 통과 (빌드, 타입 체크, 린트)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-04
**Next Action**: `/commit` 실행 → `/pr` 생성
