# Task Plan: 공통 컴포넌트 개발 (Input, Button)

**Issue**: #20
**Type**: Feature
**Created**: 2026-01-25
**Status**: Completed

---

## 1. Overview

### Problem Statement

프로젝트 전반에서 재사용 가능한 공통 UI 컴포넌트가 필요합니다.

- 현재 `src/shared/ui/` 폴더가 비어있으며, Button/Input 컴포넌트가 없습니다
- 기존 코드에서 인라인 스타일로 버튼과 입력 필드를 직접 구현하고 있어 일관성이 부족합니다
- FSD 아키텍처의 shared 레이어에 배치하여 전역적으로 재사용할 수 있는 컴포넌트가 필요합니다

### Objectives

1. `class-variance-authority` (CVA)를 활용한 타입 안전한 Button 컴포넌트 구현
2. 다양한 상태를 지원하는 Input 컴포넌트 구현
3. FSD 아키텍처에 맞는 Public API 설계
4. Storybook을 통한 컴포넌트 문서화

### Scope

**In Scope**:

- Button 컴포넌트 (variants, sizes, states)
- Input 컴포넌트 (states, clearable)
- CVA를 활용한 variant 시스템
- TypeScript 타입 정의
- Storybook stories 작성

**Out of Scope**:

- 복잡한 폼 컴포넌트 (Select, Checkbox, Radio 등)
- 폼 유효성 검사 라이브러리 통합
- 다크 모드 지원
- Label/Field 컴포넌트 (별도 구현 예정)

---

## 2. Requirements

### Functional Requirements

**FR-1**: Button 컴포넌트

- variant 지원: `primary`, `ghost`
- size 지원: `sm` (32px), `md` (36px), `lg` (48px), `icon` (36x36px)
- 상태 지원: `disabled`
- 풀 너비 옵션: `fullWidth`
- 라운드 버튼: `className="rounded-full"` 지원

**FR-2**: Input 컴포넌트

- 기본 텍스트 입력 지원
- 상태 지원: `disabled`, `error` (boolean)
- placeholder 지원
- 클리어 버튼 옵션 (`clearable`, `onClear`)

### Technical Requirements

**TR-1**: CVA 패턴 적용

- `class-variance-authority` 라이브러리 활용
- `cn()` 유틸리티와 조합하여 className 병합
- TypeScript 타입 추론 지원 (`VariantProps`)

**TR-2**: FSD 아키텍처 준수

- `src/shared/ui/` 디렉토리에 배치
- Public API (`index.ts`)를 통한 export
- 다른 레이어 참조 금지 (shared는 최하위 레이어)

**TR-3**: 디자인 시스템

- Primary 색상: `#3182F6`, hover: `#1B64DA`
- Ghost 텍스트 색상: `#6B7583`
- Focus ring: 3px, `#3182F6/30` opacity
- Input border: `#EBEBEB`, focus: `#3182F6`

### Non-Functional Requirements

**NFR-1**: 접근성

- 적절한 ARIA 속성 지원
- 키보드 네비게이션 지원
- focus-visible 스타일

**NFR-2**: 타입 안전성

- 모든 props에 대한 TypeScript 타입 정의
- forwardRef 지원으로 ref 전달 가능

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── button/
│   ├── Button.tsx           # Button 컴포넌트
│   ├── Button.stories.tsx   # Storybook stories
│   └── index.ts             # Public API
├── input/
│   ├── Input.tsx            # Input 컴포넌트
│   ├── Input.stories.tsx    # Storybook stories
│   └── index.ts             # Public API
└── index.ts                 # 통합 Public API
```

### Component Design

**Button 컴포넌트**:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center text-[14px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[#3182F6]/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#3182F6] text-[#FFFFFF] hover:bg-[#1B64DA]",
        ghost: "text-[#6B7583] hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "h-8 px-3 rounded-md",
        md: "h-9 px-4 rounded-md",
        lg: "h-12 px-6 rounded-lg",
        icon: "h-9 w-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  fullWidth?: boolean;
}
```

**Input 컴포넌트**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}
```

---

## 4. Quality Gates

### Acceptance Criteria

- [x] Button 컴포넌트 구현 (variants, sizes, states)
- [x] Input 컴포넌트 구현 (states, clearable)
- [x] CVA를 활용한 variant 관리
- [x] TypeScript 타입 정의
- [x] Storybook stories 작성
- [x] `npm run build` 성공
- [x] `npx tsc --noEmit` 통과

---

## 10. Implementation Summary

**Completion Date**: 2026-01-25
**Implemented By**: Claude Opus 4.5

### Changes Made

**Button 컴포넌트** (`src/shared/ui/button/Button.tsx`):

- CVA를 활용한 variant 시스템 구현
- variant: `primary`, `ghost`
- size: `sm` (32px), `md` (36px), `lg` (48px), `icon` (36x36px)
- Primary: `bg-[#3182F6]`, hover `bg-[#1B64DA]`, text `#FFFFFF`
- Ghost: text `#6B7583`
- Focus ring: 3px, `#3182F6/30` opacity
- Disabled: `opacity-50`
- `cursor-pointer` 기본 적용
- `fullWidth` prop 지원
- `className="rounded-full"` 로 라운드 버튼 지원

**Input 컴포넌트** (`src/shared/ui/input/Input.tsx`):

- `error` prop (boolean): destructive 색상 border/focus ring
- `clearable` + `onClear`: Button 컴포넌트 활용한 클리어 버튼
- Focus ring: 3px, `#3182F6/30` (error 시 `destructive/30`)
- Border: `#EBEBEB`, focus 시 `#3182F6`
- Label은 별도 Field 컴포넌트로 분리 예정

**Storybook Stories**:

- `Button.stories.tsx`: Primary, Ghost, Small, Medium, Large, Disabled, FullWidth, Icon, RoundedButtons
- `Input.stories.tsx`: Default, WithError, Disabled, Clearable

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed

### Files Created

- `src/shared/ui/button/Button.tsx`
- `src/shared/ui/button/Button.stories.tsx`
- `src/shared/ui/button/index.ts`
- `src/shared/ui/input/Input.tsx`
- `src/shared/ui/input/Input.stories.tsx`
- `src/shared/ui/input/index.ts`
- `src/shared/ui/index.ts`

---

**Plan Status**: Completed
**Last Updated**: 2026-01-25
