# Task Plan: DropdownMenu 공통 컴포넌트 구현

**Issue**: #78
**Type**: Feature
**Created**: 2026-02-02
**Status**: In Progress

---

## 1. Overview

### Problem Statement

Sidebar의 미트볼 아이콘 클릭 시 메뉴를 표시하기 위한 DropdownMenu 공통 컴포넌트가 필요합니다.

- 현재 `SidebarListHeader`에서 미트볼 아이콘(`IcMeatball`)이 사용되고 있지만, 클릭 시 동작하는 드롭다운 메뉴가 없음
- 프로젝트 전반에서 재사용 가능한 primitive 컴포넌트 필요
- 기존 Dialog, Accordion 컴포넌트와 동일한 패턴으로 구현 필요

### Objectives

1. Radix UI 스타일의 Compound Components 패턴 기반 DropdownMenu 구현
2. 키보드 접근성 완전 지원 (ESC 닫기, 방향키 탐색, Enter/Space 선택)
3. 프로젝트 디자인 시스템 및 기존 컴포넌트 패턴과 일관성 유지
4. Storybook 문서화 완료

### Scope

**In Scope**:

- DropdownMenu primitive 컴포넌트 (Root, Trigger, Portal, Content, Item, Separator)
- 키보드 네비게이션 (ArrowUp/Down, Enter, Space, Escape)
- Outside click으로 닫기
- Storybook stories 작성
- SidebarListHeader에서 사용 가능한 상태로 구현

**Out of Scope**:

- Submenu (중첩 메뉴) - 필요 시 후속 이슈로 처리
- CheckboxItem, RadioItem - 필요 시 후속 이슈로 처리
- 위치 자동 조정 (collision detection) - 기본 위치만 지원

---

## 2. Requirements

### Functional Requirements

**FR-1**: 트리거 클릭 시 메뉴 열림/닫힘

- 트리거 요소 클릭 시 드롭다운 메뉴 토글
- 열린 상태에서 트리거 재클릭 시 닫힘

**FR-2**: 메뉴 아이템 선택

- 메뉴 아이템 클릭 시 onSelect 콜백 실행
- 아이템 선택 후 메뉴 자동 닫힘 (closeOnSelect 옵션)
- disabled 아이템은 선택 불가

**FR-3**: 메뉴 닫기

- ESC 키로 닫기
- 메뉴 외부 클릭 시 닫기
- 아이템 선택 시 닫기

### Technical Requirements

**TR-1**: Compound Components 패턴

- Context API를 활용한 상태 공유
- Dialog, Accordion과 동일한 패턴 적용
- forwardRef 지원

**TR-2**: 접근성 (A11y)

- `role="menu"`, `role="menuitem"` 적용
- `aria-expanded`, `aria-haspopup` 속성
- 키보드 네비게이션: ArrowUp, ArrowDown, Enter, Space, Escape

**TR-3**: 스타일링

- Primitive (unstyled) 컴포넌트로 구현
- `data-state="open"|"closed"` 속성으로 상태 스타일링 지원
- `data-highlighted` 속성으로 포커스된 아이템 스타일링 지원
- Tailwind CSS className 전달 지원

### Non-Functional Requirements

**NFR-1**: 코드 품질

- TypeScript 타입 안전성
- 기존 Dialog, Accordion 컴포넌트와 일관된 코드 스타일
- ESLint, Biome 린트 통과

**NFR-2**: 문서화

- Storybook stories로 사용 예시 문서화
- JSDoc 주석으로 컴포넌트 설명

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/dropdown-menu/
├── DropdownMenu.tsx           # 메인 컴포넌트 파일
└── DropdownMenu.stories.tsx   # Storybook stories
```

### Design Decisions

**Decision 1**: Custom Primitive 구현 (Radix UI 미사용)

- **Rationale**: 프로젝트에서 Radix UI를 의존성으로 사용하지 않음. Dialog, Accordion 등 기존 컴포넌트도 자체 구현
- **Approach**: React Context + forwardRef + cloneElement 패턴으로 구현
- **Trade-offs**: 구현 복잡도 증가 vs 의존성 최소화 및 번들 크기 절감
- **Impact**: MEDIUM

**Decision 2**: Portal 기반 렌더링

- **Rationale**: z-index 충돌 방지, overflow 이슈 회피
- **Implementation**: createPortal로 document.body에 렌더링
- **Benefit**: 어떤 컨테이너 내에서도 정상 동작

**Decision 3**: 키보드 포커스 관리

- **Rationale**: 접근성 요구사항 충족
- **Implementation**: useRef로 아이템 목록 관리, 방향키로 포커스 이동
- **Benefit**: 스크린 리더 및 키보드 사용자 지원

### Component Design

**Context 구조**:

```typescript
interface DropdownMenuContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
}

interface DropdownMenuContentContextValue {
  onItemSelect: () => void;
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  itemCount: number;
  registerItem: (index: number) => void;
}
```

**컴포넌트 계층**:

```
DropdownMenuRoot (Context Provider, 상태 관리)
├── DropdownMenuTrigger (cloneElement로 트리거 요소 확장)
└── DropdownMenuPortal (createPortal)
    └── DropdownMenuContent (메뉴 컨테이너, 키보드 핸들링)
        ├── DropdownMenuItem (개별 메뉴 아이템)
        └── DropdownMenuSeparator (구분선)
```

**플로우 다이어그램**:

```
Trigger Click
    ↓
onOpenChange(true) → Context 업데이트
    ↓
Portal에서 Content 렌더링
    ↓
첫 번째 아이템에 포커스
    ↓
키보드/마우스 인터랙션
    ↓
Item 선택 또는 ESC/Outside Click
    ↓
onOpenChange(false) → 메뉴 닫힘
```

### Data Models

```typescript
interface DropdownMenuRootProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

interface DropdownMenuTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

interface DropdownMenuPortalProps {
  container?: HTMLElement;
  children: React.ReactNode;
}

interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  sideOffset?: number;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  children: React.ReactNode;
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onSelect?: () => void;
  children: React.ReactNode;
}

interface DropdownMenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}
```

---

## 4. Implementation Plan

### Phase 1: Core Structure

**Tasks**:

1. Context 및 타입 정의
2. DropdownMenuRoot 구현 (상태 관리)
3. DropdownMenuTrigger 구현 (cloneElement 패턴)
4. DropdownMenuPortal 구현

**Files to Create/Modify**:

- `src/shared/ui/dropdown-menu/DropdownMenu.tsx` (CREATE)

### Phase 2: Content & Items

**Tasks**:

1. DropdownMenuContent 구현 (포지셔닝, 키보드 핸들링)
2. DropdownMenuItem 구현 (선택, disabled 처리)
3. DropdownMenuSeparator 구현
4. Outside click 및 ESC 키 핸들링

**Dependencies**: Phase 1 완료 필요

### Phase 3: Polish & Documentation

**Tasks**:

1. Storybook stories 작성
2. 키보드 네비게이션 테스트 및 개선
3. 접근성 속성 검증
4. 타입 export 정리

**Files to Create/Modify**:

- `src/shared/ui/dropdown-menu/DropdownMenu.stories.tsx` (CREATE)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: Context 분리로 불필요한 리렌더링 방지
- `rerender-functional-setstate`: 상태 업데이트 시 함수형 업데이트 사용

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook Visual Testing

- 기본 동작 확인
- 다양한 상태 (열림/닫힘, disabled 아이템)
- 위치 옵션 (align, side)

**TS-2**: 키보드 접근성 테스트

- ArrowUp/Down으로 아이템 탐색
- Enter/Space로 아이템 선택
- ESC로 메뉴 닫기
- Tab으로 포커스 이동 시 메뉴 닫힘

**TS-3**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] DropdownMenu 공통 컴포넌트 구현
- [ ] Storybook stories 작성
- [ ] SidebarListHeader에서 DropdownMenu 사용 가능한 상태
- [ ] 키보드 접근성 테스트 통과
- [ ] 빌드/린트/타입체크 통과

### Validation Checklist

**기능 동작**:

- [ ] 트리거 클릭 시 메뉴 열림/닫힘
- [ ] 메뉴 아이템 클릭 시 onSelect 실행 및 메뉴 닫힘
- [ ] disabled 아이템 선택 불가
- [ ] ESC 키로 메뉴 닫힘
- [ ] 외부 클릭 시 메뉴 닫힘
- [ ] 방향키로 아이템 탐색

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] JSDoc 주석 추가

**접근성**:

- [ ] role="menu", role="menuitem" 적용
- [ ] aria-expanded, aria-haspopup 속성
- [ ] data-state, data-highlighted 속성
- [ ] 키보드 네비게이션 동작

---

## 6. Risks & Dependencies

### Risks

**R-1**: 키보드 포커스 관리 복잡도

- **Risk**: 아이템 동적 추가/제거 시 포커스 관리 복잡
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 초기 버전에서는 정적 아이템만 지원, 동적 아이템은 후속 이슈로 처리

**R-2**: 포지셔닝 이슈

- **Risk**: 화면 경계에서 메뉴가 잘릴 수 있음
- **Impact**: LOW
- **Probability**: MEDIUM
- **Mitigation**: 기본 위치만 지원, collision detection은 후속 이슈로 처리

### Dependencies

**D-1**: 기존 shared/lib/cn 유틸리티

- **Dependency**: `src/shared/lib/cn.ts`
- **Required For**: className 병합
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. DropdownMenu 컴포넌트 구현 및 Storybook 문서화
2. SidebarListHeader에서 DropdownMenu 적용은 별도 이슈로 분리

### Success Metrics

**SM-1**: 컴포넌트 완성도

- **Metric**: Storybook에서 모든 기능 동작
- **Target**: 100% 동작

**SM-2**: 접근성

- **Metric**: 키보드만으로 모든 기능 사용 가능
- **Target**: 완전 지원

---

## 8. Timeline & Milestones

### Milestones

**M1**: Core Implementation

- DropdownMenu 기본 구조 완성 (Root, Trigger, Portal, Content, Item, Separator)
- **Status**: NOT_STARTED

**M2**: Documentation

- Storybook stories 완성
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #78: [Feature] DropdownMenu 공통 컴포넌트 구현

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [Radix UI DropdownMenu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)
- [WAI-ARIA Menu Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu/)

### Code References

**참고할 기존 컴포넌트**:

- `src/shared/ui/dialog/Dialog.tsx` - Context, Portal, cloneElement 패턴
- `src/shared/ui/accordion/Accordion.tsx` - Compound Components, data-state 속성

---

## 10. Implementation Summary

**Completion Date**: 2026-02-03
**Implemented By**: Claude Opus 4.5

### Changes Made

- [DropdownMenu.tsx](../../src/shared/ui/dropdown-menu/DropdownMenu.tsx) - DropdownMenu 공통 컴포넌트 구현 (Root, Trigger, Portal, Content, Item, Separator)
- [DropdownMenu.stories.tsx](../../src/shared/ui/dropdown-menu/DropdownMenu.stories.tsx) - Storybook stories 8개 작성 (Default, WithMeatballIcon, WithDisabledItem, AlignmentVariants, SideVariants, Controlled, KeyboardNavigation, WithDangerItem)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Key Implementation Details

**Compound Components 패턴**:

- `DropdownMenuRoot`: Context Provider, open/close 상태 관리
- `DropdownMenuTrigger`: cloneElement로 트리거 요소 확장, aria 속성 자동 추가
- `DropdownMenuPortal`: createPortal로 document.body에 렌더링
- `DropdownMenuContent`: 메뉴 컨테이너, 포지셔닝, 키보드 이벤트 핸들링
- `DropdownMenuItem`: 개별 메뉴 아이템, disabled 지원
- `DropdownMenuSeparator`: 구분선 (aria-hidden)

**접근성 지원**:

- `role="menu"`, `role="menuitem"` 적용
- `aria-expanded`, `aria-haspopup` 속성
- 키보드 네비게이션: ArrowUp/Down, Enter, Space, Escape, Home, End, Tab
- `data-state`, `data-highlighted`, `data-disabled` 속성

**포지셔닝 옵션**:

- `align`: start, center, end
- `side`: top, bottom
- `sideOffset`: 트리거와의 간격 (기본값 4px)

### Deviations from Plan

**Changed**: DropdownMenuSeparator 접근성 처리

- 계획: `role="separator"` 사용
- 실제: `aria-hidden="true"` 사용 (Biome 린트 규칙 준수를 위해 순수 시각적 요소로 처리)

### Follow-up Tasks

- [ ] SidebarListHeader에서 DropdownMenu 적용 (별도 이슈로 분리 권장)
- [ ] Collision detection (화면 경계 자동 조정) - 필요 시 후속 이슈
- [ ] Submenu (중첩 메뉴) 지원 - 필요 시 후속 이슈

---

**Plan Status**: Completed
**Last Updated**: 2026-02-03
**Next Action**: PR 생성
