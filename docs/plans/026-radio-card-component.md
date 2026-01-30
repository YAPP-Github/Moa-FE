# Task Plan: RadioCard 공통 컴포넌트 구현

**Issue**: #26
**Type**: Feature
**Created**: 2026-01-26
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 프로젝트에 Radio 선택이 가능한 Card 형태의 공통 컴포넌트가 없어서, 여러 옵션 중 하나를 선택하는 UI 패턴(플랜 선택, 타입 선택 등)을 구현할 때 매번 새로 작성해야 한다.

- 현재 shared/ui에 Button, Input, Field 컴포넌트만 존재
- 카드 형태의 단일 선택 UI가 필요한 페이지에서 일관된 패턴 부재
- 접근성(키보드 네비게이션, 스크린리더)이 보장되는 선택 컴포넌트 필요

### Objectives

1. Radix UI RadioGroup 기반의 접근성 있는 RadioCard 컴포넌트 구현
2. 기존 컴포넌트(Button, Field)와 일관된 패턴(CVA, forwardRef, Compound Component) 준수
3. Storybook 문서화 및 다양한 사용 사례 데모 제공

### Scope

**In Scope**:

- `@radix-ui/react-radio-group` 패키지 설치
- `RadioCardGroup`, `RadioCardItem` 컴포넌트 구현
- CVA를 사용한 variant 스타일링 (size, selected 상태)
- Storybook 스토리 작성
- TypeScript 타입 export

**Out of Scope**:

- 다중 선택 (Checkbox 스타일) - 별도 컴포넌트로 구현
- 아이콘/이미지를 포함한 복잡한 카드 레이아웃 - children으로 커스텀

### User Context

> GitHub Issue #26에서 요청된 RadioCard 공통 컴포넌트

**핵심 요구사항**:

1. Radix UI RadioGroup 기반 구현
2. 기존 컴포넌트 패턴(CVA, forwardRef, Compound Component) 준수
3. WAI-ARIA Radio Group 접근성 패턴 준수

---

## 2. Requirements

### Functional Requirements

**FR-1**: RadioCardGroup - 라디오 그룹 컨테이너

- 자식 RadioCardItem들을 감싸는 컨테이너 역할
- `value`, `defaultValue`, `onValueChange` props로 상태 관리
- `orientation` prop으로 가로/세로 배치 지원

**FR-2**: RadioCardItem - 개별 라디오 카드

- 선택/비선택 상태의 시각적 구분 (border, background)
- 클릭 시 선택 상태 변경
- `disabled` 상태 지원
- `children`으로 카드 내용 커스터마이징

**FR-3**: 키보드 네비게이션

- 화살표 키로 포커스 이동
- Space/Enter로 선택
- Tab으로 그룹 진입/이탈

### Technical Requirements

**TR-1**: Radix UI 의존성

- `@radix-ui/react-radio-group` 패키지 사용
- Radix Primitives의 접근성 기능 활용

**TR-2**: 스타일링 패턴

- `class-variance-authority`로 variant 관리
- `tailwind-merge`를 통한 cn 유틸리티 사용
- 기존 디자인 토큰(색상, radius) 활용

**TR-3**: 타입 안전성

- 모든 props에 TypeScript 타입 정의
- Radix UI 타입 확장

### Non-Functional Requirements

**NFR-1**: 접근성 (a11y)

- WAI-ARIA Radio Group 패턴 준수
- 키보드 네비게이션 완전 지원
- 스크린리더 호환

**NFR-2**: 재사용성

- 다양한 크기(sm, md, lg) 지원
- className prop으로 스타일 확장 가능
- children으로 유연한 콘텐츠 구성

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── radio-card/
│   ├── RadioCard.tsx          # 메인 컴포넌트
│   ├── RadioCard.stories.tsx  # Storybook 스토리
│   └── index.ts               # Public API
├── button/
├── field/
├── input/
└── index.ts                   # 메인 export (RadioCard 추가)
```

### Design Decisions

**Decision 1**: Radix UI RadioGroup 사용

- **Rationale**: 접근성(WAI-ARIA), 키보드 네비게이션이 내장됨
- **Approach**: `@radix-ui/react-radio-group` 패키지 래핑
- **Trade-offs**:
  - 장점: 접근성 자동 처리, 검증된 구현
  - 단점: 번들 크기 증가 (~3KB gzipped)
- **Alternatives Considered**: 직접 구현 → 접근성 보장 어려움
- **Impact**: MEDIUM

**Decision 2**: Compound Component 패턴

- **Rationale**: Field.tsx와 동일한 패턴으로 일관성 유지
- **Implementation**: `RadioCardGroup` + `RadioCardItem` 조합
- **Benefit**: 유연한 조합, 명확한 구조

**Decision 3**: data-state 기반 스타일링

- **Rationale**: Radix UI가 제공하는 `data-state="checked"` 활용
- **Implementation**: `data-[state=checked]:` Tailwind 선택자 사용
- **Benefit**: JavaScript 없이 CSS로 상태 스타일링

### Component Design

**RadioCardGroup**:

```typescript
interface RadioCardGroupProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroup.Root> {
  className?: string;
  children: React.ReactNode;
}

// Radix RadioGroup.Root를 감싸서 레이아웃 스타일 추가
```

**RadioCardItem**:

```typescript
interface RadioCardItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroup.Item> {
  className?: string;
  children: React.ReactNode;
}

// CVA로 size variant 관리
// data-state로 선택 상태 스타일링
```

**플로우 다이어그램**:

```
User Click/Keyboard
    ↓
RadioCardItem (Radix RadioGroup.Item)
    ↓
Radix 내부 상태 업데이트
    ↓
onValueChange 콜백 호출
    ↓
data-state 속성 변경 (checked/unchecked)
    ↓
CSS 스타일 자동 적용
```

### Data Models

```typescript
// RadioCardGroup Props
interface RadioCardGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
}

// RadioCardItem Props
interface RadioCardItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Size Variants
type RadioCardSize = "sm" | "md" | "lg";
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. `@radix-ui/react-radio-group` 패키지 설치
2. `src/shared/ui/radio-card/` 디렉토리 생성
3. 기본 컴포넌트 구조 작성

**Files to Create/Modify**:

- `package.json` (MODIFY) - 의존성 추가
- `src/shared/ui/radio-card/RadioCard.tsx` (CREATE)
- `src/shared/ui/radio-card/index.ts` (CREATE)

**Estimated Effort**: Small

### Phase 2: Core Implementation

**Tasks**:

1. RadioCardGroup 컴포넌트 구현 (Radix Root 래핑)
2. RadioCardItem 컴포넌트 구현 (CVA variants)
3. 선택/비선택 상태 스타일링
4. disabled 상태 처리

**Files to Create/Modify**:

- `src/shared/ui/radio-card/RadioCard.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Integration & Documentation

**Tasks**:

1. `src/shared/ui/index.ts`에 export 추가
2. Storybook 스토리 작성
3. 빌드 및 타입 체크 검증

**Files to Create/Modify**:

- `src/shared/ui/index.ts` (MODIFY)
- `src/shared/ui/radio-card/RadioCard.stories.tsx` (CREATE)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: index.ts를 통한 명확한 export

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 (forwardRef 사용)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 테스트 타입: Visual
- 테스트 케이스:
  - 기본 렌더링
  - 선택 상태 변경
  - disabled 상태
  - 다양한 size variants
  - 키보드 네비게이션

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] RadioCardGroup, RadioCardItem 컴포넌트 구현
- [x] CVA를 사용한 variant 스타일 정의
- [x] Storybook 스토리 작성
- [x] TypeScript 타입 export
- [x] 접근성 테스트 통과 (키보드 네비게이션)
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 클릭으로 선택 가능
- [ ] 화살표 키로 포커스 이동
- [ ] Space/Enter로 선택
- [ ] disabled 시 선택 불가

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] forwardRef 패턴 사용
- [ ] displayName 설정

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] role="radiogroup", role="radio" 자동 적용
- [ ] aria-checked 상태 반영

---

## 6. Risks & Dependencies

### Risks

**R-1**: Radix UI 버전 호환성

- **Risk**: React 19와 Radix UI 호환 이슈 가능
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 최신 Radix UI 버전 사용, 문서 확인

### Dependencies

**D-1**: @radix-ui/react-radio-group

- **Dependency**: npm 패키지 설치 필요
- **Required For**: 컴포넌트 구현 전체
- **Status**: AVAILABLE
- **Owner**: Claude

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 컴포넌트 구현 및 Storybook 검증
2. PR 생성 및 코드 리뷰
3. main 브랜치 머지

### Success Metrics

**SM-1**: 컴포넌트 사용성

- **Metric**: Storybook에서 모든 variants 정상 동작
- **Target**: 100% 성공
- **Measurement**: 수동 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: 컴포넌트 기본 구현

- RadioCardGroup, RadioCardItem 동작
- **Status**: NOT_STARTED

**M2**: 스타일링 및 Storybook

- CVA variants, Storybook 스토리
- **Status**: NOT_STARTED

**M3**: 품질 검증 및 PR

- 빌드, 타입체크, 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #26: [RadioCard 공통 컴포넌트 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/26)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처](.claude/rules/fsd.md)

### External Resources

- [Radix UI RadioGroup](https://www.radix-ui.com/primitives/docs/components/radio-group)
- [WAI-ARIA Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- 기존 컴포넌트: `src/shared/ui/button/Button.tsx`, `src/shared/ui/field/Field.tsx`

---

## 10. Implementation Summary

**Completion Date**: 2026-01-27
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [src/shared/ui/radio-card/RadioCard.tsx](../../src/shared/ui/radio-card/RadioCard.tsx) - Primitive RadioCard 컴포넌트 (RadioCardGroup, RadioCardItem)
- [src/shared/ui/radio-card/RadioCard.stories.tsx](../../src/shared/ui/radio-card/RadioCard.stories.tsx) - Storybook 스토리 (Default, Horizontal, Disabled, GroupDisabled)
- [src/shared/ui/radio-card/index.ts](../../src/shared/ui/radio-card/index.ts) - Public API export

#### Files Modified

- [src/shared/ui/index.ts](../../src/shared/ui/index.ts) - RadioCard export 추가

#### Key Implementation Details

- **Primitive 컴포넌트로 구현**: 외부 의존성 없이 순수 React로 구현 (Radix UI 미사용)
- **Native radio input 활용**: `<input type="radio">`를 `sr-only`로 숨기고 label로 래핑
- **Context API**: RadioCardGroup에서 RadioCardItem으로 상태 전달
- **data-state 속성**: `data-state="checked" | "unchecked"`로 선택 상태 스타일링 지원
- **Focus ring**: `focus-within:ring-[3px] focus-within:ring-[#3182F6]/30` (다른 컴포넌트와 일관성)
- **forwardRef 패턴**: 모든 컴포넌트에 ref 전달 지원
- **displayName 설정**: 디버깅 용이성 확보

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Changed**:

- Radix UI 대신 직접 구현: 사용자 요청으로 외부 의존성 없이 native radio input 기반 구현
- CVA/size variants 제거: Primitive 컴포넌트로 분류하여 스타일은 사용처에서 정의하도록 변경
- 색상/폰트 스타일 제거: 사용처에서 `className`으로 자유롭게 정의하도록 변경

**Kept**:

- Compound Component 패턴 (RadioCardGroup + RadioCardItem)
- `data-state` 기반 스타일링 지원
- Focus ring 스타일
- Disabled 상태 처리
- 키보드 접근성 (native radio input 활용)

### Performance Impact

- 외부 의존성 없음 (Radix UI 미사용)
- 번들 크기 영향 최소화

### Usage Example

```tsx
<RadioCardGroup
  value={value}
  onValueChange={setValue}
  className="flex flex-col gap-3"
>
  <RadioCardItem
    value="option1"
    className="rounded-lg p-4 data-[state=checked]:bg-[#E9F2FE] data-[state=checked]:text-[#3182F6] data-[state=unchecked]:bg-[#F3F4F5]"
  >
    옵션 1
  </RadioCardItem>
</RadioCardGroup>
```

### Notes

- react-hook-form과 Controller를 통해 연동 가능
- 레이아웃(grid, list, horizontal)은 className으로 자유롭게 설정 가능

---

**Plan Status**: Completed
**Last Updated**: 2026-01-27
**Next Action**: PR 생성
