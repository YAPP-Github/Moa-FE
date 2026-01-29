# Task Plan: Checkbox 공통 컴포넌트 구현

**Issue**: #34
**Type**: Feature
**Created**: 2026-01-29
**Status**: Planning

---

## 1. Overview

### Problem Statement

프로젝트에서 체크박스 입력이 필요한 UI가 있으나 현재 재사용 가능한 Checkbox 공통 컴포넌트가 없습니다.

- 기존 Button, Input, RadioCard 등의 공통 컴포넌트와 일관된 패턴으로 Checkbox 컴포넌트가 필요
- react-hook-form과 호환되는 controlled/uncontrolled 지원 필요
- 접근성(a11y)을 고려한 구현 필요

### Objectives

1. 재사용 가능한 Checkbox 컴포넌트 구현
2. 기존 공통 컴포넌트(Button, Input)와 일관된 API 제공
3. Storybook 문서화를 통한 사용 예시 제공

### Scope

**In Scope**:

- `src/shared/ui/checkbox/Checkbox.tsx` 컴포넌트 구현
- `src/shared/ui/checkbox/Checkbox.stories.tsx` Storybook 스토리 작성
- `src/shared/ui/index.ts` export 추가

**Out of Scope**:

- CheckboxGroup (다중 체크박스 그룹) 컴포넌트
- 체크박스 애니메이션

---

## 2. Requirements

### Functional Requirements

**FR-1**: 기본 체크박스 기능

- checked/unchecked 상태 토글
- 레이블 텍스트 표시 지원
- 클릭 시 onChange 콜백 호출

**FR-2**: 상태 관리

- controlled 모드: checked + onChange props
- uncontrolled 모드: defaultChecked prop
- react-hook-form 호환 (forwardRef 지원)

**FR-3**: 비활성화 상태

- disabled prop으로 비활성화
- 비활성화 시 시각적 피드백 (opacity 감소)

### Technical Requirements

**TR-1**: 기술 스택

- React 19 + TypeScript
- class-variance-authority (cva) 사용
- forwardRef로 ref 전달 지원
- Tailwind CSS 4 스타일링

**TR-2**: 컴포넌트 패턴

- 기존 Button, Input 컴포넌트와 동일한 패턴 적용
- displayName 설정
- Props 타입 export

### Non-Functional Requirements

**NFR-1**: 접근성

- native `<input type="checkbox">` 사용
- label 연결 (htmlFor/id)
- focus-visible 스타일 적용
- keyboard 조작 지원 (Space로 토글)

**NFR-2**: 스타일 일관성

- 프로젝트 디자인 시스템 컬러 사용 (#3182F6)
- focus ring 스타일 통일 (ring-[3px] ring-[#3182F6]/30)

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── checkbox/
│   ├── Checkbox.tsx           # 메인 컴포넌트 (CREATE)
│   ├── Checkbox.stories.tsx   # Storybook 스토리 (CREATE)
│   └── index.ts               # barrel export (CREATE)
└── index.ts                   # export 추가 (MODIFY)
```

### Design Decisions

**Decision 1**: Native Checkbox 기반 구현

- **Rationale**: 접근성, 키보드 지원, 폼 호환성을 위해 native input 사용
- **Approach**: `<input type="checkbox">`를 visually hidden하고 커스텀 UI 오버레이
- **Trade-offs**: 커스텀 애니메이션 제한 vs 접근성 보장
- **Impact**: LOW (표준 패턴)

**Decision 2**: cva 미사용 (단순 구조)

- **Rationale**: Checkbox는 size/variant 등 복잡한 variants가 불필요
- **Approach**: 단순 className 기반 스타일링, cn 유틸리티만 사용
- **Benefit**: 코드 단순화, 번들 크기 최소화

**Decision 3**: 체크 아이콘 inline SVG

- **Rationale**: 기존 `ic_check_lg.svg`는 45px 원형 배경 포함으로 체크박스용으로 부적합
- **Approach**: 체크마크만 있는 간단한 inline SVG 사용
- **Impact**: LOW

### Component Design

**Checkbox 컴포넌트 구조**:

```typescript
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, disabled, id, ...props }, ref) => {
    const inputId = id ?? useId();

    return (
      <label htmlFor={inputId} className={cn('inline-flex items-center gap-2 cursor-pointer', ...)}>
        <span className="relative inline-flex items-center justify-center w-5 h-5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          {/* 체크박스 박스 */}
          <span className="... peer-checked:bg-[#3182F6] peer-checked:border-[#3182F6] ..." />
          {/* 체크마크 */}
          <CheckIcon className="... peer-checked:opacity-100 ..." />
        </span>
        {label && <span>{label}</span>}
      </label>
    );
  }
);
```

### Data Models

```typescript
interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  /** 체크박스 옆에 표시할 레이블 텍스트 */
  label?: string;
}
```

---

## 4. Implementation Plan

### Phase 1: 컴포넌트 구현

**Tasks**:

1. `src/shared/ui/checkbox/Checkbox.tsx` 생성
2. `src/shared/ui/checkbox/index.ts` 생성

**Files to Create**:

- `src/shared/ui/checkbox/Checkbox.tsx` (CREATE)
- `src/shared/ui/checkbox/index.ts` (CREATE)

### Phase 2: Storybook 작성

**Tasks**:

1. 기본 스토리 작성 (Default, Checked, Disabled)
2. WithLabel 스토리 작성
3. Controlled 예제 스토리

**Files to Create**:

- `src/shared/ui/checkbox/Checkbox.stories.tsx` (CREATE)

### Phase 3: Export 및 검증

**Tasks**:

1. `src/shared/ui/index.ts`에 export 추가
2. 빌드 및 타입 체크

**Files to Modify**:

- `src/shared/ui/index.ts` (MODIFY)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 - Checkbox는 간단한 컴포넌트로 memo 불필요

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 테스트 타입: Visual
- 테스트 케이스:
  - Default (unchecked)
  - Checked
  - Disabled
  - Disabled + Checked
  - With Label
  - Focus state

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] Checkbox 컴포넌트 구현 (`src/shared/ui/checkbox/Checkbox.tsx`)
- [x] Storybook 스토리 작성 (`src/shared/ui/checkbox/Checkbox.stories.tsx`)
- [x] `src/shared/ui/index.ts`에 export 추가
- [ ] 빌드 성공 (`npm run build`)
- [ ] 타입 체크 통과 (`npx tsc --noEmit`)
- [ ] 린트 통과 (`npm run lint`)

### Validation Checklist

**기능 동작**:

- [ ] 체크박스 클릭 시 checked 상태 토글
- [ ] disabled 상태에서 클릭 불가
- [ ] 레이블 클릭 시 체크박스 토글
- [ ] Space 키로 토글 가능

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] forwardRef 정상 동작

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] focus-visible 스타일 적용
- [ ] label-input 연결 (htmlFor)

---

## 6. Risks & Dependencies

### Risks

**R-1**: 기존 SVG 아이콘 부적합

- **Risk**: `ic_check_lg.svg`가 45px 원형 배경을 포함하여 체크박스용으로 부적합
- **Impact**: LOW
- **Mitigation**: inline SVG로 체크마크만 구현
- **Status**: Mitigated

### Dependencies

**D-1**: cn 유틸리티

- **Dependency**: `@/shared/lib`의 cn 함수
- **Required For**: className 병합
- **Status**: AVAILABLE

**D-2**: Tailwind CSS peer 기능

- **Dependency**: Tailwind CSS peer-\* variants
- **Required For**: 체크 상태 스타일링
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

단순 컴포넌트 추가이므로 별도 롤아웃 전략 불필요.

### Success Metrics

**SM-1**: Storybook 문서화

- **Metric**: 모든 상태의 스토리 작성 완료
- **Target**: 6개 이상의 스토리

---

## 8. Timeline & Milestones

### Milestones

**M1**: 컴포넌트 구현 완료

- Checkbox.tsx, index.ts 생성
- **Status**: NOT_STARTED

**M2**: Storybook 작성 완료

- 모든 상태의 스토리 작성
- **Status**: NOT_STARTED

**M3**: 품질 검증 완료

- 빌드, 타입체크, 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #34: [[Feature] Checkbox 공통 컴포넌트 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/34)
- Issue #24: Field 공통 컴포넌트 구현 (참고)
- Issue #26: RadioCard 공통 컴포넌트 구현 (참고)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

**기존 컴포넌트 참고**:

- `src/shared/ui/button/Button.tsx` - cva, forwardRef 패턴
- `src/shared/ui/input/Input.tsx` - forwardRef, disabled 스타일
- `src/shared/ui/radio-card/RadioCard.tsx` - 상태 관리 패턴

---

## 10. Implementation Summary

**Completion Date**: 2026-01-29
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [`src/shared/ui/checkbox/Checkbox.tsx`](../../src/shared/ui/checkbox/Checkbox.tsx) - 메인 Checkbox 컴포넌트
- [`src/shared/ui/checkbox/Checkbox.stories.tsx`](../../src/shared/ui/checkbox/Checkbox.stories.tsx) - Storybook 스토리 (8개)
- [`src/shared/ui/checkbox/index.ts`](../../src/shared/ui/checkbox/index.ts) - barrel export

#### Files Modified

- [`src/shared/ui/index.ts`](../../src/shared/ui/index.ts#L15) - Checkbox export 추가

#### Key Implementation Details

- Native `<input type="checkbox">` 기반으로 접근성 보장
- Tailwind CSS `peer-*` variants를 활용한 상태 스타일링
- `forwardRef`로 react-hook-form 호환성 확보
- inline SVG 체크마크 사용 (기존 아이콘 부적합)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (checkbox 파일)

### Deviations from Plan

**Changed**:

- 체크박스 모양: 사각형(rounded) → 원형(rounded-full) (사용자 요청)
- gap: 8px(gap-2) → 6px(gap-1.5) (사용자 요청)
- 레이블 스타일: text-sm → text-sm font-medium leading-[150%] (사용자 요청)
- 애니메이션: transition-colors, transition-opacity 제거 (사용자 요청)

**Skipped**:

- cva 미사용 (계획대로 단순 구조 유지)

### Storybook Stories (8개)

1. Default
2. WithLabel
3. Checked
4. CheckedWithLabel
5. Disabled
6. DisabledChecked
7. Controlled
8. MultipleCheckboxes

### Performance Impact

- Bundle size: 최소 증가 (단순 컴포넌트)
- No animation = 성능 오버헤드 없음

### Follow-up Tasks

- [ ] CheckboxGroup 컴포넌트 (다중 체크박스 관리)
- [ ] 단위 테스트 추가

---

**Plan Status**: Completed
**Last Updated**: 2026-01-29
**Next Action**: `/commit` → `/pr`
