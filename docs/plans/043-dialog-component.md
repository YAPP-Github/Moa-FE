# Task Plan: Dialog 공통 컴포넌트 구현

**Issue**: #43
**Type**: Feature
**Created**: 2026-01-31
**Status**: Planning

---

## 1. Overview

### Problem Statement

프로젝트에서 모달, 확인 다이얼로그, 알림 등에 재사용 가능한 공통 Dialog 컴포넌트가 필요합니다.

- 현재 공통 UI 컴포넌트(Button, Input, Accordion 등)는 있지만 Dialog는 없음
- Dialog는 여러 곳에서 반복적으로 필요한 UI 패턴
- 일관된 사용자 경험과 접근성 보장 필요

### Objectives

1. Radix UI Dialog 기반 공통 Dialog 컴포넌트 구현
2. 기존 Accordion 패턴(Primitive/headless)을 따라 일관성 유지
3. Storybook 문서화로 팀 내 사용법 공유

### Scope

**In Scope**:

- Dialog 컴포넌트 구현 (Root, Trigger, Content, Header, Footer 등)
- Storybook 문서 작성
- 접근성(WAI-ARIA) 준수

**Out of Scope**:

- AlertDialog (별도 이슈로 분리)
- 애니메이션/트랜지션 (추후 개선)
- 드래그/리사이즈 기능

### User Context

> "className 오버라이드로 하자"
> 피그마에 252px, 400px, 434px, 708px 다이얼로그 width 존재

**핵심 요구사항**:

1. Width는 size variant 없이 className 오버라이드 방식 (shadcn 스타일)
2. 기본 max-width 설정 후 사용처에서 커스텀 가능

---

## 2. Requirements

### Functional Requirements

**FR-1**: Dialog 열기/닫기

- Trigger 클릭 시 Dialog 열림
- Overlay 클릭, Close 버튼, ESC 키로 닫힘
- 외부에서 open/onOpenChange로 제어 가능 (Controlled)

**FR-2**: 포커스 관리

- Dialog 열릴 때 Content로 포커스 이동
- Dialog 닫힐 때 Trigger로 포커스 복귀
- Tab 키로 Dialog 내부 요소 간 이동 (포커스 트랩)

**FR-3**: 스크롤 잠금

- Dialog 열릴 때 body 스크롤 비활성화
- Dialog 닫힐 때 스크롤 복원

### Technical Requirements

**TR-1**: 기술 스택

- @radix-ui/react-dialog 사용 (새로 설치 필요)
- Tailwind CSS로 스타일링
- forwardRef로 ref 전달

**TR-2**: 컴포넌트 구조

- Compound Component 패턴 (Accordion과 동일)
- className 오버라이드로 width 커스텀
- 기본 max-width: `sm:max-w-lg` (512px)

### Non-Functional Requirements

**NFR-1**: 접근성

- role="dialog", aria-modal="true"
- aria-labelledby, aria-describedby 연결
- 키보드 네비게이션 지원

**NFR-2**: 성능

- Portal로 렌더링하여 z-index 이슈 방지
- 닫힌 상태에서 Content 언마운트

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/dialog/
├── Dialog.tsx              # 메인 컴포넌트
└── Dialog.stories.tsx      # Storybook 문서
```

### Design Decisions

**Decision 1**: Radix UI Dialog 사용

- **Rationale**: 접근성, 포커스 관리, 스크롤 잠금 등 복잡한 기능이 이미 구현됨
- **Approach**: @radix-ui/react-dialog 설치 후 래핑
- **Trade-offs**: 번들 크기 증가 vs 직접 구현 대비 안정성/접근성 보장
- **Alternatives Considered**: 직접 구현 (Accordion처럼) - 복잡도가 높아 Radix 선택
- **Impact**: LOW (약 5KB gzipped 추가)

**Decision 2**: className 오버라이드 방식 (shadcn 스타일)

- **Rationale**: 사용자 요청, 피그마 width 값이 다양함 (252px, 400px, 434px, 708px)
- **Implementation**: 기본 `sm:max-w-lg` 제공, 사용처에서 className으로 오버라이드
- **Benefit**: 유연성 극대화, 디자인 변경에 쉽게 대응

### Component Design

**서브 컴포넌트**:

```typescript
// Radix 래핑 컴포넌트
DialogRoot; // = Dialog.Root (상태 관리)
DialogTrigger; // = Dialog.Trigger (열기 버튼)
DialogPortal; // = Dialog.Portal (Portal 렌더링)
DialogOverlay; // = Dialog.Overlay (배경)
DialogContent; // = Dialog.Content (메인 콘텐츠)
DialogClose; // = Dialog.Close (닫기 버튼)

// 레이아웃 헬퍼 (순수 div)
DialogHeader; // 헤더 영역
DialogFooter; // 푸터 영역
DialogTitle; // 제목 (aria-labelledby)
DialogDescription; // 설명 (aria-describedby)
```

**사용 예시**:

```tsx
<DialogRoot>
  <DialogTrigger>열기</DialogTrigger>
  <DialogPortal>
    <DialogOverlay className="fixed inset-0 bg-black/50" />
    <DialogContent className="sm:max-w-[400px]">
      <DialogHeader>
        <DialogTitle>제목</DialogTitle>
        <DialogDescription>설명</DialogDescription>
      </DialogHeader>
      <div>내용</div>
      <DialogFooter>
        <DialogClose>닫기</DialogClose>
      </DialogFooter>
    </DialogContent>
  </DialogPortal>
</DialogRoot>
```

### Data Models

```typescript
// Radix Dialog props 재사용
interface DialogRootProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Root> {}
interface DialogTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Trigger> {}
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {}
// ... 등

// 레이아웃 헬퍼 props
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogTitleProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Title> {}
interface DialogDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Description> {}
```

---

## 4. Implementation Plan

### Phase 1: Setup

**Tasks**:

1. @radix-ui/react-dialog 설치
2. `src/shared/ui/dialog/` 폴더 생성

**Commands**:

```bash
pnpm add @radix-ui/react-dialog
```

**Estimated Effort**: Small

### Phase 2: Core Implementation

**Tasks**:

1. Dialog.tsx 작성
   - Radix Dialog 컴포넌트 래핑
   - DialogContent 기본 스타일 적용 (centered, overlay)
   - DialogHeader/Footer/Title/Description 레이아웃 헬퍼

**Files to Create**:

- `src/shared/ui/dialog/Dialog.tsx` (CREATE)

**Dependencies**: Phase 1 완료

### Phase 3: Documentation

**Tasks**:

1. Storybook 작성
   - Default 스토리
   - With Form 스토리
   - Custom Width 스토리 (252px, 400px, 434px, 708px)
   - Controlled 스토리

**Files to Create**:

- `src/shared/ui/dialog/Dialog.stories.tsx` (CREATE)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (index.ts 없음)

**MEDIUM**:

- `rerender-memo`: Dialog 내부 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 다양한 width로 렌더링 확인
- 열기/닫기 동작 확인
- 오버레이 클릭 닫기 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] Dialog 컴포넌트 구현 (`src/shared/ui/dialog/Dialog.tsx`)
- [ ] Storybook 작성 (`src/shared/ui/dialog/Dialog.stories.tsx`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 검사 통과 (`npx tsc --noEmit`)
- [ ] 린트 통과 (`npm run lint`)

### Validation Checklist

**기능 동작**:

- [ ] Trigger 클릭 시 Dialog 열림
- [ ] Overlay 클릭 시 닫힘
- [ ] ESC 키로 닫힘
- [ ] Close 버튼으로 닫힘

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

**접근성**:

- [ ] 키보드 네비게이션 동작 (Tab, Shift+Tab)
- [ ] ESC로 닫기
- [ ] aria-labelledby, aria-describedby 연결

---

## 6. Risks & Dependencies

### Risks

**R-1**: Radix UI 버전 호환성

- **Risk**: React 19와의 호환성 이슈 가능성
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 최신 버전 설치 후 테스트

### Dependencies

**D-1**: @radix-ui/react-dialog

- **Dependency**: npm 패키지 설치 필요
- **Required For**: 모든 Dialog 기능
- **Status**: NOT INSTALLED
- **Action**: Phase 1에서 설치

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 컴포넌트 구현 및 Storybook 문서화
2. PR 리뷰 및 머지
3. 팀 내 사용 가이드 공유

### Success Metrics

**SM-1**: 컴포넌트 완성도

- **Metric**: 모든 서브 컴포넌트 구현
- **Target**: 10개 컴포넌트

**SM-2**: Storybook 문서화

- **Metric**: 스토리 개수
- **Target**: 4개 이상 (Default, Form, CustomWidth, Controlled)

---

## 8. Timeline & Milestones

### Milestones

**M1**: 패키지 설치 및 기본 구조

- Radix UI Dialog 설치
- 폴더 구조 생성

**M2**: 컴포넌트 구현

- 모든 서브 컴포넌트 구현
- 기본 스타일 적용

**M3**: 문서화 완료

- Storybook 작성
- 사용 예시 포함

---

## 9. References

### Related Issues

- Issue #43: [Dialog 공통 컴포넌트 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/43)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처](./.claude/rules/fsd.md)

### External Resources

- [Radix UI Dialog](https://www.radix-ui.com/docs/primitives/components/dialog)
- [shadcn/ui Dialog](https://ui.shadcn.com/docs/components/dialog)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-01-31
**Next Action**: 사용자 승인 후 구현 시작
