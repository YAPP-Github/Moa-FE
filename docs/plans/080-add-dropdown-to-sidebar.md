# Task Plan: Sidebar에 DropdownMenu 공통 컴포넌트 추가

**Issue**: #80
**Type**: Feature
**Created**: 2026-02-03
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 Sidebar의 `SidebarListHeader`에는 미트볼 아이콘(IcMeatball)이 표시되지만 클릭 시 아무 동작이 없습니다. 팀 추가, 편집, 삭제 등의 액션을 수행할 수 있는 DropdownMenu 기능이 필요합니다.

- 현재 상황: SidebarListHeader에 IconButton + IcMeatball이 있지만 기능 없음
- 필요성: 사용자가 팀 관련 액션을 쉽게 접근할 수 있어야 함
- 영향: 기능 미구현 시 사용자 경험 저하, 팀 관리 기능 접근 어려움

### Objectives

1. SidebarListHeader의 미트볼 아이콘에 DropdownMenu 연결
2. 기존 DropdownMenu primitive 컴포넌트 재사용
3. 접근성(a11y) 및 키보드 네비게이션 지원 유지

### Scope

**In Scope**:

- SidebarListHeader에 DropdownMenu 적용 (팀 추가 액션)
- 기존 DropdownMenu primitive 컴포넌트 활용
- Storybook에서 정의된 스타일 클래스 재사용

**Out of Scope**:

- SidebarTeamItem 개별 아이템에 DropdownMenu 추가 (별도 이슈로 분리)
- 팀 삭제 API 연동 (UI만 구현)
- CreateTeamDialog 연동 (기존 다이얼로그 활용)

### User Context

> "sidebar에 DropdownMenu 공통 컴포넌트 추가"

**핵심 요구사항**:

1. 기존 DropdownMenu primitive 컴포넌트 활용
2. Sidebar의 미트볼 아이콘에서 드롭다운 메뉴 표시

---

## 2. Requirements

### Functional Requirements

**FR-1**: SidebarListHeader DropdownMenu

- 미트볼 아이콘 클릭 시 드롭다운 메뉴 표시
- 메뉴 아이템: "팀 추가"
- 메뉴 아이템 클릭 시 해당 액션 실행

**FR-2**: DropdownMenu 동작

- 외부 클릭 시 메뉴 닫힘
- ESC 키로 메뉴 닫힘
- 키보드 네비게이션 지원 (ArrowUp/Down, Enter, Space)

### Technical Requirements

**TR-1**: 컴포넌트 재사용

- `src/shared/ui/dropdown-menu/DropdownMenu.tsx` primitive 컴포넌트 사용
- Storybook에서 정의된 공통 스타일 클래스 활용

**TR-2**: FSD 아키텍처 준수

- widgets 레이어에서 shared 레이어 컴포넌트 import
- 직접 import 방식 사용 (barrel export 미사용)

### Non-Functional Requirements

**NFR-1**: 접근성

- ARIA 속성 자동 관리 (DropdownMenu primitive에서 제공)
- 키보드 네비게이션 완벽 지원
- 포커스 관리

**NFR-2**: 코드 품질

- TypeScript 타입 안정성
- 기존 코드 패턴 준수

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── widgets/
│   └── sidebar/
│       └── ui/
│           ├── SidebarListHeader.tsx    # MODIFY - DropdownMenu 추가
│           ├── DashboardSidebar.tsx     # 변경 없음
│           ├── SidebarTeamList.tsx      # 변경 없음
│           └── SidebarTeamItem.tsx      # 변경 없음
└── shared/
    └── ui/
        └── dropdown-menu/
            └── DropdownMenu.tsx          # 기존 컴포넌트 활용
```

### Design Decisions

**Decision 1**: DropdownMenu primitive 재사용

- **Rationale**: 이미 완성도 높은 primitive 컴포넌트가 존재하며, 접근성과 키보드 네비게이션이 완벽 구현됨
- **Approach**: `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuPortal`, `DropdownMenuContent`, `DropdownMenuItem` 조합
- **Trade-offs**: Headless 컴포넌트라 스타일 클래스 직접 지정 필요 vs 완전한 커스터마이징 가능
- **Impact**: LOW (기존 컴포넌트 활용)

**Decision 2**: Storybook 스타일 클래스 재사용

- **Rationale**: `WithMeatballIcon` 스토리에서 이미 동일한 사용 사례 스타일이 정의됨
- **Implementation**: `contentClassName`, `itemClassName` 등 동일 클래스 사용
- **Benefit**: 일관된 UI, 검증된 스타일

### Component Design

**SidebarListHeader 변경 후**:

```typescript
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu/DropdownMenu";

// 스타일 클래스 (Storybook과 동일)
const contentClassName =
  "min-w-[160px] rounded-lg border border-[#E5E8EB] bg-white p-1 shadow-lg";
const itemClassName =
  "px-3 py-2 text-sm text-[#191F28] rounded-md cursor-pointer transition-colors hover:bg-[#F9FAFB] data-[highlighted]:bg-[#F9FAFB]";

export function SidebarListHeader({ title }: SidebarListHeaderProps) {
  return (
    <div className="...">
      <span>{title}</span>
      <DropdownMenuRoot>
        <DropdownMenuTrigger>
          <IconButton variant="ghost" size="xs" aria-label="팀 메뉴">
            <IcMeatball className="w-6 h-6" />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className={contentClassName} align="end">
            <DropdownMenuItem
              className={itemClassName}
              onSelect={handleAddTeam}
            >
              팀 추가
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    </div>
  );
}
```

**플로우 다이어그램**:

```
User clicks Meatball Icon
    ↓
DropdownMenuTrigger captures click
    ↓
DropdownMenuRoot.onOpenChange(true)
    ↓
DropdownMenuPortal renders to document.body
    ↓
DropdownMenuContent positioned (align="end")
    ↓
User clicks "팀 추가"
    ↓
DropdownMenuItem.onSelect callback
    ↓
Menu closes, action executed
```

---

## 4. Implementation Plan

### Phase 1: Core Implementation

**Tasks**:

1. SidebarListHeader에 DropdownMenu 컴포넌트 import
2. IconButton을 DropdownMenuTrigger로 래핑
3. DropdownMenuContent에 메뉴 아이템 추가
4. onSelect 콜백 연결

**Files to Modify**:

- `src/widgets/sidebar/ui/SidebarListHeader.tsx` (MODIFY)

**Estimated Effort**: Small

### Phase 2: Polish & Testing

**Tasks**:

1. 스타일 검증 (Storybook과 일관성)
2. 키보드 네비게이션 테스트
3. 접근성 테스트 (스크린 리더)
4. 빌드 및 린트 검증

**Quality Checks**:

```bash
npm run build
npx tsc --noEmit
npm run lint
```

### Vercel React Best Practices

이 작업에 특별히 적용할 critical 규칙은 없습니다. 단순한 UI 컴포넌트 조합 작업입니다.

**적용 고려사항**:

- `bundle-barrel-imports`: 직접 import 사용 (이미 준수)
- `rerender-memo`: 불필요한 리렌더링 없음 (이미 최적화된 primitive)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 타입: Manual/Visual
- 테스트 케이스:
  - 미트볼 아이콘 클릭 시 드롭다운 메뉴 표시
  - 메뉴 아이템 클릭 시 콜백 실행
  - 외부 클릭 시 메뉴 닫힘
  - ESC 키로 메뉴 닫힘
  - ArrowDown/ArrowUp으로 아이템 탐색
  - Enter/Space로 아이템 선택

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] SidebarListHeader에 DropdownMenu 트리거 버튼 추가
- [x] DropdownMenu 공통 컴포넌트를 활용한 메뉴 구현
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] 린트 통과 (`npm run lint`)

### Validation Checklist

**기능 동작**:

- [ ] 미트볼 아이콘 클릭 시 드롭다운 메뉴 표시
- [ ] "팀 추가" 메뉴 아이템 표시
- [ ] 외부 클릭/ESC로 메뉴 닫힘

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 준수 (직접 import)

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] ARIA 레이블 유지 ("팀 메뉴")

---

## 6. Risks & Dependencies

### Risks

**R-1**: 스타일 불일치

- **Risk**: Storybook 스타일과 실제 적용 시 차이 발생 가능
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: Storybook에서 검증된 동일 클래스 사용
- **Status**: Mitigated

### Dependencies

**D-1**: DropdownMenu Primitive

- **Dependency**: `src/shared/ui/dropdown-menu/DropdownMenu.tsx`
- **Required For**: 전체 구현
- **Status**: AVAILABLE (이미 구현됨)

**D-2**: IconButton 컴포넌트

- **Dependency**: `src/shared/ui/icon-button/IconButton.tsx`
- **Required For**: DropdownMenuTrigger 내부
- **Status**: AVAILABLE (이미 사용 중)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Single Deployment**:

- PR 머지 후 자동 배포 (Vercel)
- 롤백 필요 시 Git revert

### Success Metrics

**SM-1**: 기능 동작

- **Metric**: DropdownMenu 정상 동작
- **Target**: 100% 기능 동작
- **Measurement**: 수동 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: Core Implementation

- SidebarListHeader에 DropdownMenu 적용
- **Status**: NOT_STARTED

**M2**: Quality Validation

- 빌드, 타입, 린트 검증
- **Status**: NOT_STARTED

### Estimated Timeline

- **Core Implementation**: 30분
- **Testing & Polish**: 15분
- **Total**: 45분

---

## 9. References

### Related Issues

- Issue #80: [Feature] Sidebar에 DropdownMenu 공통 컴포넌트 추가

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

**관련 코드**:

- [DropdownMenu.tsx](../../src/shared/ui/dropdown-menu/DropdownMenu.tsx)
- [DropdownMenu.stories.tsx](../../src/shared/ui/dropdown-menu/DropdownMenu.stories.tsx)
- [SidebarListHeader.tsx](../../src/widgets/sidebar/ui/SidebarListHeader.tsx)

### External Resources

- [Radix UI DropdownMenu Pattern](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-03
**Next Action**: 사용자 승인 후 구현 시작
