# Task Plan: Tailwind에 Figma Design Tokens 적용

**Issue**: #58
**Type**: Chore
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

디자인 시스템 일관성을 위해 Figma에 정의된 text-styles(타이포그래피)와 color-styles(색상 팔레트)를 Tailwind CSS에 적용해야 합니다.

- 현재 `src/index.css`에 shadcn/ui 기본 색상이 설정되어 있으나, Figma 디자인 토큰과 일치하지 않음
- 개발자가 임의의 색상값(`text-[#3182F6]`)을 사용하고 있어 일관성 부족
- Figma 디자인과 코드 간 색상/타이포그래피 불일치로 유지보수 어려움

### Objectives

1. Figma color-styles를 Tailwind CSS 변수로 변환하여 `bg-blue-500`, `text-grey-900` 형태로 사용 가능하게 함
2. Figma text-styles를 Tailwind typography 유틸리티로 변환하여 `text-title-1`, `text-caption-2` 형태로 사용 가능하게 함
3. 기존 shadcn/ui 컴포넌트와 호환성 유지

### Scope

**In Scope**:

- `src/index.css`에 Figma 색상 토큰 추가
- `src/index.css`에 Figma 타이포그래피 토큰 추가
- Tailwind v4 `@theme` 디렉티브 활용

**Out of Scope**:

- 기존 컴포넌트의 하드코딩된 색상값 마이그레이션 (별도 이슈)
- Dark mode 색상 정의 (현재 Figma에 없음)

### User Context

Figma에서 추출한 디자인 토큰:

**Color Styles**: Blue(5), Grey(12), Red(2), Green(1), Pink(4), White(1)
**Text Styles**: Title(6), Sub-title(7), Caption(6), Long(2)

---

## 2. Requirements

### Functional Requirements

**FR-1**: Color Utilities 사용 가능

- `bg-blue-500`, `text-grey-900`, `border-grey-200` 등 Tailwind 유틸리티로 Figma 색상 사용
- 모든 Tailwind 색상 관련 유틸리티와 호환 (bg, text, border, ring, etc.)

**FR-2**: Typography Utilities 사용 가능

- `text-title-1`, `text-sub-title-1`, `text-caption-2` 등으로 타이포그래피 스타일 적용
- font-size, font-weight, line-height가 한 번에 적용됨

### Technical Requirements

**TR-1**: Tailwind CSS v4 호환

- `@theme` 디렉티브 사용
- CSS 변수 기반 설정

**TR-2**: 기존 스타일과 충돌 없음

- shadcn/ui의 semantic colors (primary, secondary, etc.) 유지
- 기존 컴포넌트 동작에 영향 없음

### Non-Functional Requirements

**NFR-1**: 개발자 경험

- 자동완성 지원 (VSCode Tailwind CSS IntelliSense)
- 명확한 네이밍으로 디자인 토큰 쉽게 찾기

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: `@theme` 디렉티브에서 직접 색상 정의

- **Rationale**: Tailwind v4의 권장 방식, CSS 변수 자동 생성
- **Approach**: `--color-{name}: {value}` 형식으로 정의
- **Benefit**: `bg-blue-500`, `text-blue-500` 등 자동으로 유틸리티 생성

**Decision 2**: 타이포그래피는 `--text-{name}` + 관련 속성으로 정의

- **Rationale**: Tailwind v4에서 `--text-{name}--line-height`, `--text-{name}--font-weight` 지원
- **Approach**: 각 text style에 size, line-height, font-weight 함께 정의
- **Benefit**: `text-title-1` 한 클래스로 모든 타이포그래피 속성 적용

**Decision 3**: 기존 shadcn/ui 색상 유지

- **Rationale**: 이미 사용 중인 컴포넌트 호환성
- **Approach**: Figma 토큰은 추가로 정의, 기존 것은 그대로 유지

### Tailwind Theme Structure

```css
@theme {
  /* Figma Color Tokens */
  --color-blue-100: #f3f8ff;
  --color-blue-200: #e6f2ff;
  --color-blue-300: #c1d9fd;
  --color-blue-500: #3182f6;
  --color-blue-600: #0062bc;

  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  /* ... */

  /* Figma Typography Tokens */
  --text-title-1: 1.5rem; /* 24px */
  --text-title-1--line-height: 1.5; /* 150% */
  --text-title-1--font-weight: 700; /* bold */
  /* ... */
}
```

---

## 4. Implementation Plan

### Phase 1: Color Tokens 추가

**Tasks**:

1. `@theme` 블록에 Figma 색상 변수 추가
2. 기존 shadcn/ui 색상과 병합

**Files to Modify**:

- `src/index.css` (MODIFY)

### Phase 2: Typography Tokens 추가

**Tasks**:

1. `@theme` 블록에 text styles 정의
2. font-size, line-height, font-weight 함께 설정

**Files to Modify**:

- `src/index.css` (MODIFY)

### Phase 3: 검증

**Tasks**:

1. 빌드 테스트
2. 타입 체크
3. 린트 통과 확인

### Figma Design Tokens 상세

**Color Tokens**:

```
Blue:
  - blue-100: #f3f8ff
  - blue-200: #e6f2ff
  - blue-300: #c1d9fd
  - blue-500: #3182f6
  - blue-600: #0062bc

Grey:
  - grey-0: #ffffff
  - grey-50: #f9fafb
  - grey-100: #f3f4f5
  - grey-200: #e9ebf1
  - grey-300: #dee0e4
  - grey-400: #bebfc6
  - grey-500: #a0a9b7
  - grey-600: #8b95a1
  - grey-700: #6b7583
  - grey-800: #4e5968
  - grey-900: #333d4b
  - grey-1000: #191f28

Red:
  - red-200: #ffedef
  - red-300: #f14251

Green:
  - green-500: #16c07e

Pink:
  - pink-100: #fefbff
  - pink-200: #fcf4ff
  - pink-300: #fae9ff
  - pink-400: #d949e6

White:
  - white-700: rgba(255, 255, 255, 0.7)
```

**Typography Tokens**:

```
Title (Bold / 700):
  - title-1: 24px, 150%
  - title-2: 20px, 150%
  - title-3: 18px, 150%
  - title-4: 16px, 150%
  - title-5: 14px, 150%
  - title-6: 13px, 140%

Sub-title (SemiBold / 600):
  - sub-title-0: 18px, 150%
  - sub-title-1: 16px, 150%
  - sub-title-2: 15px, 150%
  - sub-title-3: 14px, 150%
  - sub-title-4: 13px, 140%
  - sub-title-5: 12px, 130%
  - sub-title-6: 12px, 130%

Caption (Medium / 500):
  - caption-1: 16px, 150%
  - caption-2: 14px, 150%
  - caption-3: 13px, 140%
  - caption-4: 13px, 140%
  - caption-5: 12px, 130%
  - caption-6: 11px, 120%

Long (Medium / 500):
  - long-1: 15px, 150%
  - long-2: 14px, 150%
```

---

## 5. Quality Gates

### Acceptance Criteria

- [x] Figma color-styles가 Tailwind 색상으로 사용 가능
- [x] Figma text-styles가 Tailwind 유틸리티로 사용 가능
- [x] 기존 shadcn/ui 컴포넌트 스타일과 호환
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] `bg-blue-500` 클래스 적용 시 `#3182f6` 색상 표시
- [ ] `text-title-1` 클래스 적용 시 24px, bold, 150% line-height 적용
- [ ] 기존 `bg-primary`, `text-foreground` 등 정상 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: 기존 컴포넌트와 색상 충돌

- **Risk**: Tailwind 기본 색상과 Figma 토큰 이름 충돌 가능
- **Impact**: LOW
- **Mitigation**: Tailwind 기본 색상은 사용하지 않고 Figma 토큰만 사용

### Dependencies

**D-1**: Tailwind CSS v4

- **Dependency**: `@theme` 디렉티브 지원
- **Status**: AVAILABLE (이미 설치됨)

---

## 7. References

### Related Issues

- Issue #58: [Chore] Tailwind에 Figma text-styles, color-styles 적용

### External Resources

- [Tailwind CSS v4 Theme Configuration](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 Colors](https://tailwindcss.com/docs/colors)
- [Tailwind CSS v4 Font Size](https://tailwindcss.com/docs/font-size)

---

## 8. Implementation Summary

**Completion Date**: 2026-02-01
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Modified

- [`src/index.css`](../../src/index.css) - Figma 디자인 토큰 추가 (Colors 26개, Typography 21개)
- [`src/shared/ui/calendar/Calendar.tsx`](../../src/shared/ui/calendar/Calendar.tsx) - semantic color → Figma 토큰 마이그레이션
- [`src/shared/ui/calendar/Calendar.stories.tsx`](../../src/shared/ui/calendar/Calendar.stories.tsx) - semantic color → Figma 토큰 마이그레이션
- [`src/shared/ui/field/Field.tsx`](../../src/shared/ui/field/Field.tsx) - semantic color → Figma 토큰 마이그레이션
- [`src/shared/ui/input/Input.tsx`](../../src/shared/ui/input/Input.tsx) - semantic color → Figma 토큰 마이그레이션
- [`src/shared/ui/multi-step-form/MultiStepForm.stories.tsx`](../../src/shared/ui/multi-step-form/MultiStepForm.stories.tsx) - semantic color → Figma 토큰 마이그레이션

#### Key Implementation Details

- Tailwind v4 `@theme inline` 디렉티브 사용
- Color tokens: `--color-{name}` 형식으로 26개 정의 (Blue, Grey, Red, Green, Pink, White)
- Typography tokens: `--text-{name}`, `--text-{name}--line-height`, `--text-{name}--font-weight` 조합으로 21개 정의
- 기존 UI 컴포넌트의 semantic color를 Figma 토큰으로 마이그레이션

### Quality Validation

- [x] Build: Success (27.94 kB CSS)
- [x] Type Check: Passed
- [x] Lint: Passed (기존 이슈 외 새로운 문제 없음)

### Deviations from Plan

**Changed**:

- 원래 계획: shadcn/ui semantic colors 유지
- 실제 구현: semantic colors 제거하고 Figma 토큰으로 완전 교체 (사용자 요청)
- 기존 컴포넌트도 Figma 토큰으로 마이그레이션 완료

**Added**:

- UI 컴포넌트 마이그레이션 (원래 계획에 없었음, Out of Scope였으나 사용자 요청으로 추가)

### Migration Map

| 기존 Semantic Color     | →   | Figma 토큰       |
| ----------------------- | --- | ---------------- |
| `text-muted-foreground` | →   | `text-grey-600`  |
| `text-destructive`      | →   | `text-red-300`   |
| `bg-muted`              | →   | `bg-grey-100`    |
| `bg-accent`             | →   | `bg-blue-100`    |
| `border-destructive`    | →   | `border-red-300` |

### Performance Impact

- CSS Bundle: 28.83KB → 27.94KB (-0.89KB, 불필요한 색상 제거)
- 런타임 영향 없음

### Commits

```
732c9d3 chore(styles): Figma 디자인 토큰을 Tailwind에 적용
b7aa1bb refactor(ui): semantic color를 Figma 토큰으로 마이그레이션
08b4859 docs: #58 작업 계획 문서 추가
```

### Notes

- Tailwind CSS IntelliSense에서 자동완성 지원됨
- `text-title-1` 한 클래스로 font-size, line-height, font-weight 모두 적용됨
- 모든 색상 유틸리티 (bg, text, border, ring, fill, stroke 등)에서 사용 가능

---

**Plan Status**: Completed
**Last Updated**: 2026-02-01
**Next Action**: PR 생성
