# Task Plan: Accordion 공통 컴포넌트 구현

**Issue**: #32
**Type**: Feature
**Created**: 2026-01-27
**Status**: Planning

---

## 1. Overview

### Problem Statement

프로젝트에서 접기/펼치기 기능이 필요한 UI를 위한 Accordion 컴포넌트가 필요합니다.

- RadioCard와 마찬가지로 스타일이 없는 primitive 컴포넌트로 제공
- 사용처에서 `data-state` 속성을 활용하여 유연하게 스타일 정의 가능
- Compound component 패턴으로 구성요소를 조합하여 사용

### Objectives

1. AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent 컴포넌트 구현
2. single/multiple 타입 지원
3. collapsible 옵션 지원 (single 타입에서 모두 닫기 가능)
4. 제어/비제어 모드 지원 (defaultValue/value/onValueChange)
5. disabled 상태 지원
6. `data-state`, `data-disabled` 속성 지원
7. Storybook 스토리 작성

### Scope

**In Scope**:

- Accordion primitive 컴포넌트 구현
- Context API를 통한 상태 관리
- forwardRef 지원
- Storybook 스토리 작성
- TypeScript 타입 export

**Out of Scope**:

- 애니메이션 (사용처에서 CSS로 구현)
- 기본 스타일 (primitive이므로 스타일 없음)
- 키보드 네비게이션 (Arrow 키 등) - 기본 button 동작만 지원

### User Context

> "accrodian 컴포넌트 (radio-card와 마찬가지로 primitive만 제공)"

**핵심 요구사항**:

1. RadioCard와 동일한 패턴의 headless/primitive 컴포넌트
2. `data-state` 속성을 통한 상태 기반 스타일링

---

## 2. Requirements

### Functional Requirements

**FR-1**: AccordionRoot 컴포넌트

- `type="single"`: 하나의 항목만 열 수 있음
- `type="multiple"`: 여러 항목을 동시에 열 수 있음
- `collapsible`: single 타입에서 모든 항목 닫기 가능 여부
- `defaultValue`: 초기 열린 항목 (비제어 모드)
- `value`: 현재 열린 항목 (제어 모드)
- `onValueChange`: 값 변경 콜백
- `disabled`: 전체 비활성화

**FR-2**: AccordionItem 컴포넌트

- `value`: 항목 식별자 (필수)
- `disabled`: 개별 항목 비활성화
- `data-state="open" | "closed"` 속성 제공

**FR-3**: AccordionTrigger 컴포넌트

- 클릭 시 해당 항목 열기/닫기
- `data-state="open" | "closed"` 속성 제공
- `data-disabled` 속성 제공
- button 요소로 렌더링

**FR-4**: AccordionContent 컴포넌트

- 열린 상태에서만 렌더링
- `data-state="open" | "closed"` 속성 제공

### Technical Requirements

**TR-1**: React 패턴

- Context API를 통한 상태 관리 (RadioCard 패턴 참조)
- forwardRef 지원
- Compound component 패턴

**TR-2**: TypeScript

- 모든 컴포넌트 props 타입 정의
- 타입 export

**TR-3**: 접근성

- Trigger는 button 요소 사용
- ARIA 속성은 최소한으로 (aria-expanded, aria-controls)

### Non-Functional Requirements

**NFR-1**: 코드 품질

- RadioCard와 일관된 코드 스타일
- 명확한 JSDoc 주석
- 사용 예제 포함

**NFR-2**: 테스트 가능성

- Storybook에서 다양한 시나리오 테스트 가능

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── accordion/
│   ├── Accordion.tsx           # 메인 컴포넌트
│   ├── Accordion.stories.tsx   # Storybook 스토리
│   └── index.ts                # Public API
└── index.ts                    # export 추가
```

### Design Decisions

**Decision 1**: Radix UI Accordion API 참조

- **Rationale**: 검증된 API 설계, 익숙한 패턴
- **Approach**: Radix API를 단순화하여 구현 (Header 제외)
- **Trade-offs**: 전체 Radix 기능 대비 단순화 (forceMount 등 제외)
- **Impact**: MEDIUM

**Decision 2**: Content 렌더링 방식

- **Rationale**: 성능과 단순성 균형
- **Implementation**: 닫힌 상태에서는 Content를 렌더링하지 않음 (hidden이 아닌 unmount)
- **Benefit**: 불필요한 DOM 노드 제거, 단순한 구현

**Decision 3**: Single/Multiple 타입 분리

- **Rationale**: 타입 안전성과 API 명확성
- **Implementation**: type prop에 따라 value 타입이 `string | undefined` 또는 `string[]`로 변경
- **Benefit**: TypeScript에서 정확한 타입 추론

### Component Design

**AccordionRoot**:

```typescript
interface AccordionSingleProps {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  collapsible?: boolean;
}

interface AccordionMultipleProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionRootProps = (AccordionSingleProps | AccordionMultipleProps) & {
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};
```

**Context 구조**:

```typescript
interface AccordionContextValue {
  type: "single" | "multiple";
  value: string[];
  onItemToggle: (itemValue: string) => void;
  disabled: boolean;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  isDisabled: boolean;
  triggerId: string;
  contentId: string;
}
```

**플로우**:

```
User Click on Trigger
    ↓
AccordionTrigger.onClick
    ↓
AccordionContext.onItemToggle(itemValue)
    ↓
AccordionRoot state update
    ↓
AccordionItem re-render (data-state 변경)
    ↓
AccordionContent mount/unmount
```

### Data Models

```typescript
// Props Types
interface AccordionRootProps { ... }
interface AccordionItemProps { ... }
interface AccordionTriggerProps { ... }
interface AccordionContentProps { ... }

// Context Types
interface AccordionContextValue { ... }
interface AccordionItemContextValue { ... }
```

---

## 4. Implementation Plan

### Phase 1: Core Implementation

**Tasks**:

1. AccordionRoot 컴포넌트 구현
   - Context Provider 설정
   - single/multiple 타입 로직
   - 제어/비제어 모드
2. AccordionItem 컴포넌트 구현
   - Item Context Provider
   - data-state 속성
3. AccordionTrigger 컴포넌트 구현
   - button 렌더링
   - onClick 핸들러
   - ARIA 속성
4. AccordionContent 컴포넌트 구현
   - 조건부 렌더링
   - data-state 속성

**Files to Create/Modify**:

- `src/shared/ui/accordion/Accordion.tsx` (CREATE)
- `src/shared/ui/accordion/index.ts` (CREATE)
- `src/shared/ui/index.ts` (MODIFY)

### Phase 2: Storybook & Documentation

**Tasks**:

1. Default 스토리 작성
2. Multiple 타입 스토리
3. Collapsible 스토리
4. Disabled 스토리
5. Controlled 스토리

**Files to Create**:

- `src/shared/ui/accordion/Accordion.stories.tsx` (CREATE)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 시 함수형 setState 사용

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 테스트 타입: Visual/Interactive
- 테스트 케이스:
  - Default: single 타입 기본 동작
  - Multiple: 여러 항목 동시 열기
  - Collapsible: 모든 항목 닫기
  - Disabled: 비활성화 상태
  - Controlled: 제어 모드

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent 컴포넌트 구현
- [x] single/multiple 타입 지원
- [x] collapsible 옵션 지원 (single 타입에서 모두 닫기 가능)
- [x] defaultValue/value/onValueChange 제어/비제어 모드 지원
- [x] disabled 상태 지원
- [x] `data-state`, `data-disabled` 속성 지원
- [x] Storybook 스토리 작성
- [x] TypeScript 타입 export
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] single 타입: 하나만 열림
- [ ] multiple 타입: 여러 개 열림
- [ ] collapsible: 모두 닫기 가능
- [ ] disabled: 클릭 불가

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] RadioCard와 일관된 패턴

**접근성**:

- [ ] 키보드 (Space/Enter) 동작
- [ ] aria-expanded 속성

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 설계 복잡도

- **Risk**: single/multiple 타입 분기로 인한 복잡도
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: TypeScript 유니온 타입으로 명확한 타입 분리

### Dependencies

**D-1**: RadioCard 패턴 참조

- **Dependency**: 기존 RadioCard 컴포넌트 구조
- **Required For**: 일관된 패턴 적용
- **Status**: AVAILABLE

**D-2**: cn 유틸리티

- **Dependency**: `@/shared/lib/cn`
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. PR 생성 및 코드 리뷰
2. main 브랜치 머지
3. Storybook 배포 확인

### Success Metrics

**SM-1**: 컴포넌트 완성도

- **Metric**: 모든 Acceptance Criteria 충족
- **Target**: 100%

---

## 8. Timeline & Milestones

### Milestones

**M1**: Core Implementation

- AccordionRoot, Item, Trigger, Content 구현
- **Status**: NOT_STARTED

**M2**: Storybook Stories

- 모든 시나리오 스토리 작성
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #32: [Feature] Accordion 공통 컴포넌트 구현
- Issue #26: RadioCard 공통 컴포넌트 구현 (참조)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처](../../.claude/rules/fsd.md)

**외부 참조**:

- [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) - API 참조
- 기존 RadioCard 구현: `src/shared/ui/radio-card/RadioCard.tsx`

---

## 10. Implementation Summary

**Completion Date**: 2026-01-28
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [src/shared/ui/accordion/Accordion.tsx](../../src/shared/ui/accordion/Accordion.tsx) - Accordion primitive 컴포넌트 (AccordionRoot, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent)
- [src/shared/ui/accordion/Accordion.stories.tsx](../../src/shared/ui/accordion/Accordion.stories.tsx) - Storybook 스토리 (Default, WithCustomContent)
- [src/shared/ui/accordion/index.ts](../../src/shared/ui/accordion/index.ts) - Public API exports

#### Files Modified

- [src/shared/ui/index.ts](../../src/shared/ui/index.ts) - Accordion 컴포넌트 export 추가

#### Key Implementation Details

- Compound component 패턴 (AccordionRoot → AccordionItem → AccordionHeader/Trigger/Content)
- Context API로 상태 관리 (AccordionContext, AccordionItemContext)
- forwardRef 지원으로 ref 전달 가능
- `data-state="open" | "closed"` 속성으로 상태 기반 스타일링 지원
- `rerender-functional-setstate` 규칙 적용: `setValue((prev) => ...)`

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Simplified API** (사용자 요청으로 단순화):

| 원래 계획                     | 최종 구현        | 이유                   |
| ----------------------------- | ---------------- | ---------------------- |
| `type="single" \| "multiple"` | single만 지원    | multiple 타입 불필요   |
| `collapsible` prop            | 항상 collapsible | 모든 항목 닫기 가능    |
| `value` / `onValueChange`     | 제거             | controlled 모드 불필요 |
| `disabled` prop               | 제거             | disabled 상태 불필요   |
| `data-disabled` 속성          | 제거             | disabled 제거로 불필요 |

**Added** (계획에 없던 추가):

- `AccordionHeader` 컴포넌트: Trigger와 분리하여 아이콘만 클릭 가능하도록 함

**Final API**:

```typescript
interface AccordionRootProps {
  defaultValue?: string; // 초기 열린 항목
  children: React.ReactNode;
}

interface AccordionItemProps {
  value: string; // 항목 식별자
  children: React.ReactNode;
}
```

### Performance Impact

- Bundle size: ~7KB (컴포넌트 코드)
- No runtime overhead (조건부 렌더링으로 닫힌 Content는 DOM에서 제거)

### Notes

- RadioCard와 동일한 primitive/headless 패턴 적용
- 최소한의 ARIA 속성 (aria-expanded, aria-controls, role="region")
- 사용자 피드백으로 API를 대폭 단순화하여 유지보수성 향상

---

**Plan Status**: Completed
**Last Updated**: 2026-01-28
**Next Action**: `/commit` → `/pr`
