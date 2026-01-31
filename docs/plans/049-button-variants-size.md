# Task Plan: Button 컴포넌트 variants 및 size 시스템 개선

**Issue**: #49
**Type**: Enhancement
**Created**: 2026-01-31
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 Button 컴포넌트가 디자인 시스템 요구사항을 충족하지 못하고 있습니다:

- **현재 variants**: `primary`, `ghost`만 지원
- **현재 sizes**: `sm`, `md`, `lg`, `icon` (실제 필요한 높이와 불일치)
- **색상 시스템**: variant에 색상이 하드코딩되어 있어 확장성 부족

실제 프로젝트에서 Dialog, features/auth 등에서 Button 대신 커스텀 버튼을 사용하거나 className 오버라이드로 secondary 스타일을 구현하고 있음.

### Objectives

1. 새로운 size 시스템 적용 (xs, sm, md, lg, xl)
2. 디자인 시스템에 맞는 variants 제공 (primary, secondary, tertiary, ghost)
3. IconButton, ToggleButton 컴포넌트 분리
4. 기존 사용처 마이그레이션 전략 수립

### Scope

**In Scope**:

- Button 컴포넌트 variant/size 시스템 재설계
- IconButton 컴포넌트 신규 생성 (정사각형/원형)
- ToggleButton 컴포넌트 신규 생성
- Storybook 스토리 업데이트
- 타입 정의 업데이트

**Out of Scope**:

- 기존 features 코드의 Button 마이그레이션 (별도 이슈로 분리)
- CSS 변수 기반 테마 시스템 전면 개편

### User Context

> "size (height): 24, 28, 32, 36, 48
> variants: primary, secondary, tertiary, ghost (color 통합)"

**핵심 요구사항**:

1. 높이 기준 5가지 사이즈 (xs, sm, md, lg, xl)
2. 4가지 variants (primary, secondary, tertiary, ghost) - color 통합
3. IconButton 별도 컴포넌트 (정사각형/원형)
4. ToggleButton 별도 컴포넌트

---

## 2. Requirements

### Functional Requirements

**FR-1**: Size 시스템

- 높이 기준 5가지 사이즈 지원
- `xs` (24px), `sm` (28px), `md` (32px), `lg` (36px), `xl` (48px)
- 각 사이즈에 맞는 padding, font-size, border-radius 자동 적용

**FR-2**: Variant 시스템 (color 통합)

- `primary`: bg #3182F6, hover #0062BC, text #FFFFFF
- `secondary`: bg #E6F2FF, hover #C1D9FD, text #3182F6
- `tertiary`: bg #F3F4F5, hover #DEE0E4, text #333D4B
- `ghost`: bg transparent, hover #F9FAFB, text #6B7583
- 아이콘 색상은 텍스트와 동일 (currentColor)

**FR-4**: IconButton 컴포넌트

- 별도 컴포넌트로 분리 (`src/shared/ui/icon-button/`)
- `shape`: "square" (정사각형) | "circle" (원형)
- 동일한 size, variant, color 시스템 적용
- 기존 `size="icon"` 대체

**FR-5**: ToggleButton 컴포넌트

- 별도 컴포넌트로 분리 (`src/shared/ui/toggle-button/`)
- `pressed`: boolean 상태
- `onPressedChange`: 상태 변경 콜백
- 동일한 size, variant, color 시스템 적용
- `aria-pressed` 접근성 지원

### Technical Requirements

**TR-1**: CVA 활용

- variant별 스타일 정의 (compound variants 불필요)
- 타입 안전성 보장 (VariantProps)

**TR-2**: 하위 호환성

- 기존 `variant="primary"` → `variant="primary"` (유지)
- 기존 `variant="ghost"` → `variant="ghost"` (유지)
- 기존 `size="icon"` → IconButton 컴포넌트로 마이그레이션

**TR-3**: Tailwind 클래스 활용

- 하드코딩된 hex 값 사용 (디자인 시스템 정확도)
- 일관된 hover, focus, disabled 상태

### Non-Functional Requirements

**NFR-1**: 접근성

- focus-visible 링 유지
- disabled 상태 시각적 표시
- 키보드 네비게이션 지원

**NFR-2**: 성능

- CVA로 런타임 클래스 계산 최소화
- 불필요한 리렌더링 방지

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── button/
│   ├── Button.tsx              # MODIFY - 메인 버튼
│   └── Button.stories.tsx      # MODIFY - Storybook 스토리
├── icon-button/
│   ├── IconButton.tsx          # CREATE - 아이콘 버튼 (정사각형/원형)
│   └── IconButton.stories.tsx  # CREATE - Storybook 스토리
└── toggle-button/
    ├── ToggleButton.tsx        # CREATE - 토글 버튼
    └── ToggleButton.stories.tsx # CREATE - Storybook 스토리
```

### Design Decisions

**Decision 1**: variant에 color 통합 (단순화)

- **Rationale**: color를 분리하면 조합이 복잡해지고, 실제 사용 시 대부분 고정된 스타일 사용
- **Approach**: variant를 `primary | secondary | tertiary | ghost`로 정의하고 각각에 색상 포함
- **Trade-offs**:
  - 장점: 단순한 API, compound variants 불필요, 직관적 사용
  - 단점: 색상 조합 유연성 감소 (실제로 필요 없음)
- **Impact**: LOW (단순화)

**Decision 2**: Size를 5단계 영문 네이밍으로 변경

- **Rationale**: Tailwind 스타일의 일관된 네이밍으로 직관적인 사용
- **Approach**: size prop을 `xs | sm | md | lg | xl`로 변경 (24, 28, 32, 36, 48px 매핑)
- **Trade-offs**:
  - 장점: 익숙한 네이밍, 코드 가독성
  - 단점: 기존 sm/md/lg 매핑 변경 필요 (높이 값 변경)
- **Impact**: HIGH (breaking change)

**Decision 3**: IconButton/ToggleButton 컴포넌트 분리

- **Rationale**: 역할별 컴포넌트 분리로 API 명확화, MUI/Chakra 등 주요 디자인 시스템 패턴 따름
- **Approach**:
  - `IconButton`: 아이콘 전용 버튼, shape prop으로 정사각형/원형 지원
  - `ToggleButton`: pressed 상태 관리, aria-pressed 접근성 지원
- **Trade-offs**:
  - 장점: 명확한 API, 타입 안전성, 역할 분리
  - 단점: 파일 수 증가, 기존 size="icon" 사용처 마이그레이션 필요
- **Impact**: MEDIUM

### Component Design

**Button Props**:

```typescript
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl"; // 24, 28, 32, 36, 48px
  fullWidth?: boolean;
}
```

**IconButton Props**:

```typescript
interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  shape?: "square" | "circle"; // 정사각형 or 원형
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  children: React.ReactNode; // 아이콘
}
```

**ToggleButton Props**:

```typescript
interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toggleButtonVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
```

**CVA 구조** (단순화 - compound variants 불필요):

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#3182F6] text-[#FFFFFF] hover:bg-[#0062BC]",
        secondary: "bg-[#E6F2FF] text-[#3182F6] hover:bg-[#C1D9FD]",
        tertiary: "bg-[#F3F4F5] text-[#333D4B] hover:bg-[#DEE0E4]",
        ghost: "bg-transparent text-[#6B7583] hover:bg-[#F9FAFB]",
      },
      size: {
        xs: "h-6 px-2 text-xs rounded", // 24px
        sm: "h-7 px-2.5 text-xs rounded", // 28px
        md: "h-8 px-3 text-sm rounded-md", // 32px
        lg: "h-9 px-4 text-sm rounded-md", // 36px
        xl: "h-12 px-6 text-base rounded-lg", // 48px
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);
```

---

## 4. Implementation Plan

### Phase 1: Button 컴포넌트 리팩토링

**Tasks**:

1. buttonVariants CVA 재구성 (variant, color, size 분리)
2. compound variants 정의 (variant+color 조합)
3. ButtonProps 타입 업데이트
4. Button.stories.tsx 업데이트

**Files to Create/Modify**:

- `src/shared/ui/button/Button.tsx` (MODIFY)
- `src/shared/ui/button/Button.stories.tsx` (MODIFY)

### Phase 2: IconButton 컴포넌트 생성

**Tasks**:

1. IconButton 컴포넌트 생성 (shape: square/circle)
2. iconButtonVariants CVA 정의
3. IconButton.stories.tsx 생성

**Files to Create/Modify**:

- `src/shared/ui/icon-button/IconButton.tsx` (CREATE)
- `src/shared/ui/icon-button/IconButton.stories.tsx` (CREATE)

### Phase 3: ToggleButton 컴포넌트 생성

**Tasks**:

1. ToggleButton 컴포넌트 생성 (pressed 상태 관리)
2. toggleButtonVariants CVA 정의
3. ToggleButton.stories.tsx 생성
4. aria-pressed 접근성 지원

**Files to Create/Modify**:

- `src/shared/ui/toggle-button/ToggleButton.tsx` (CREATE)
- `src/shared/ui/toggle-button/ToggleButton.stories.tsx` (CREATE)

### Phase 4: 기존 사용처 마이그레이션

**Tasks**:

1. Input 컴포넌트 Button → IconButton 마이그레이션
2. Dialog stories Button 사용처 확인
3. MultiStepForm stories Button 사용처 확인

**Dependencies**: Phase 1, 2 완료 필요

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 유지 (이미 적용됨)

**MEDIUM**:

- `rerender-memo`: Button이 자주 리렌더되는 경우 React.memo 고려

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 모든 variant + color 조합 스토리 확인
- 모든 size 스토리 확인
- iconOnly 스토리 확인
- disabled/fullWidth 상태 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] Button: 새로운 size 시스템 적용 (xs, sm, md, lg, xl)
- [ ] Button: variants 개선 (primary, secondary, tertiary, ghost)
- [ ] IconButton: 컴포넌트 생성 (shape: square/circle)
- [ ] ToggleButton: 컴포넌트 생성 (pressed 상태)
- [ ] Storybook 스토리 업데이트/생성
- [ ] 타입 정의 업데이트
- [ ] 기존 사용처 마이그레이션

### Validation Checklist

**Button 기능 동작**:

- [ ] 모든 variant 정상 렌더링 (primary, secondary, tertiary, ghost)
- [ ] 모든 size 정상 렌더링
- [ ] hover/focus/disabled 상태 정상

**IconButton 기능 동작**:

- [ ] shape="square" 정사각형 렌더링
- [ ] shape="circle" 원형 렌더링
- [ ] 모든 size에서 정상 동작

**ToggleButton 기능 동작**:

- [ ] pressed 상태 토글 동작
- [ ] aria-pressed 속성 적용
- [ ] 시각적 피드백 정상

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] CVA 타입 추론 정상

**접근성**:

- [ ] focus-visible 링 동작
- [ ] disabled 상태 명확

---

## 6. Risks & Dependencies

### Risks

**R-1**: Breaking Change

- **Risk**: 기존 size/variant 사용처에서 에러 발생
- **Impact**: HIGH
- **Probability**: HIGH (확정)
- **Mitigation**:
  - 기존 사용처 목록 파악 (Input, Dialog stories, MultiStepForm stories)
  - 마이그레이션 가이드 작성
  - 필요 시 deprecation 경고 추가

**R-2**: 컴포넌트 파일 증가

- **Risk**: IconButton, ToggleButton 추가로 파일 수 증가
- **Impact**: LOW
- **Probability**: HIGH (확정)
- **Mitigation**: FSD 구조에 맞게 체계적으로 배치

### Dependencies

**D-1**: CVA 라이브러리

- **Dependency**: class-variance-authority
- **Required For**: compound variants
- **Status**: AVAILABLE (이미 사용 중)

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. Button 컴포넌트 업데이트
2. Storybook 확인
3. 기존 사용처 (Input, Dialog, MultiStepForm) 수동 확인
4. PR 리뷰 후 머지

### Success Metrics

- 모든 variant + color 조합이 Storybook에서 정상 렌더링
- 기존 사용처에서 오류 없음

---

## 8. Timeline & Milestones

### Milestones

**M1**: Button 리팩토링

- Button.tsx variant/size/color 시스템 재구성
- **Status**: NOT_STARTED

**M2**: IconButton 생성

- IconButton 컴포넌트 (square/circle)
- **Status**: NOT_STARTED

**M3**: ToggleButton 생성

- ToggleButton 컴포넌트 (pressed 상태)
- **Status**: NOT_STARTED

**M4**: 마이그레이션

- 기존 사용처 업데이트
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #49: [Enhancement] Button 컴포넌트 variants 및 size 시스템 개선

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)

**External Resources**:

- [CVA Documentation](https://cva.style/docs)
- [CVA Compound Variants](https://cva.style/docs/getting-started/variants#compound-variants)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-01-31
**Next Action**: 사용자 승인 후 구현 시작
