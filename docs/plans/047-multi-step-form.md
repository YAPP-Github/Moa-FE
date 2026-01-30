# Task Plan: Multi-step Form 추상화 및 react-hook-form 통합

**Issue**: #47
**Type**: Feature
**Created**: 2026-01-31
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 Signin 플로우에서 multi-step form이 `useState` + `useSearchParams` 기반으로 수동 관리되고 있습니다.

- 상태 분산: 각 필드별 개별 `useState` 사용 (nickname, teamName 등)
- 검증 부재: zod 등 스키마 검증 라이브러리 없음, `trim()` 수준의 수동 검증만 존재
- 재사용성 낮음: 다른 multi-step 시나리오 (온보딩, 설정, 회고 작성)에서 재사용 어려움

### Objectives

1. react-hook-form + zod 기반의 타입 안전하고 재사용 가능한 multi-step form 시스템 구축
2. Step별 부분 검증 (`trigger(['field1', 'field2'])`) 지원
3. 복합 Step 지원 (Calendar, RadioCard 등 여러 controlled component 조합)
4. 기존 UI 컴포넌트(Field, Input, RadioCard, Calendar)와 seamless 통합

### Scope

**In Scope**:

- `react-hook-form`, `@hookform/resolvers`, `zod` 의존성 추가
- `MultiStepForm` 컴포넌트 및 `useMultiStep` hook 구현
- Step Context 기반 상태 관리
- 기존 UI 컴포넌트와 Controller 통합 예시
- Storybook 예시 및 단위 테스트

**Out of Scope**:

- 기존 Signin 플로우 마이그레이션 (별도 이슈로 분리)
- URL 기반 step 동기화 (선택적 확장 기능)
- 서버 사이드 검증

### User Context

> "calendar, radio-card 등의 컴포넌트를 합친 복합 step도 잘 적용될까?"

**핵심 요구사항**:

1. 복합 Step 지원 - 여러 controlled component를 하나의 Step에서 사용 가능
2. Step별 부분 검증 - 현재 Step의 필드들만 검증 후 다음 Step 이동
3. 재사용 가능한 추상화 - 다양한 multi-step 시나리오에 적용 가능

---

## 2. Requirements

### Functional Requirements

**FR-1**: MultiStepForm 컴포넌트

- FormProvider를 통한 폼 상태 통합 관리
- Step 컴포넌트들을 children으로 받아 순차적 렌더링
- `onSubmit` 핸들러로 최종 데이터 전달

**FR-2**: Step 컴포넌트

- 각 Step에서 담당할 필드 목록 지정 (`fields` prop)
- Step별 부분 검증 지원 (`trigger(fields)`)
- 이전/다음 Step 네비게이션

**FR-3**: useMultiStep hook

- 현재 Step 인덱스 관리
- `goToNextStep`, `goToPrevStep`, `goToStep(index)` 함수 제공
- `isFirstStep`, `isLastStep`, `currentStep` 상태 제공

**FR-4**: 복합 Step 지원

- Controller를 통한 controlled component 통합 (RadioCard, Calendar 등)
- 여러 필드를 하나의 Step에서 검증

### Technical Requirements

**TR-1**: 의존성

- `react-hook-form@7.x` - 폼 상태 관리
- `@hookform/resolvers@3.x` - zod resolver
- `zod@3.x` - 스키마 검증

**TR-2**: FSD 구조 준수

- 위치: `src/shared/ui/multi-step-form/`
- 직접 import 패턴 사용 (barrel export 제거)

**TR-3**: TypeScript 타입 안전성

- Generic 타입으로 폼 데이터 타입 추론
- Zod 스키마에서 타입 자동 추론 (`z.infer<typeof schema>`)

### Non-Functional Requirements

**NFR-1**: 성능

- 불필요한 리렌더링 최소화 (FormProvider 활용)
- Step 전환 시 부드러운 UX

**NFR-2**: 접근성

- 키보드 네비게이션 지원
- ARIA 속성 적절히 적용
- 에러 메시지 스크린리더 호환

**NFR-3**: 개발 경험

- 직관적인 API
- 충분한 TypeScript 자동완성
- Storybook으로 사용 예시 제공

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/
├── ui/
│   └── multi-step-form/
│       ├── MultiStepForm.tsx       # Main component (FormProvider + StepProvider)
│       ├── MultiStepFormStep.tsx   # Step wrapper component
│       ├── StepContext.tsx         # Step state context
│       ├── useMultiStep.ts         # Hook for step navigation
│       ├── types.ts                # Type definitions
│       ├── MultiStepForm.stories.tsx
│       └── MultiStepForm.test.tsx
└── lib/
    └── form/
        └── createStepSchema.ts     # Step별 스키마 유틸 (선택적)
```

### Design Decisions

**Decision 1**: FormProvider + Step Context 분리 패턴

- **Rationale**: react-hook-form의 FormProvider는 폼 상태만 관리, Step 상태는 별도 Context로 분리하여 관심사 분리
- **Approach**: `MultiStepForm`이 두 Provider를 감싸고, 내부 컴포넌트에서 각각 `useFormContext`, `useStepContext` 사용
- **Trade-offs**: Context 2개 사용으로 약간의 복잡도 증가 vs 명확한 책임 분리
- **Alternatives Considered**:
  - Zustand store 사용 → 외부 의존성 증가, RHF와 중복
  - 단일 Context → 관심사 혼재
- **Impact**: MEDIUM

**Decision 2**: Compound Component 패턴

- **Rationale**: 유연한 구성과 직관적인 API 제공
- **Implementation**:
  ```tsx
  <MultiStepForm schema={schema} onSubmit={handleSubmit}>
    <MultiStepForm.Step fields={["nickname"]}>
      <NicknameFields />
    </MultiStepForm.Step>
    <MultiStepForm.Step fields={["plan", "startDate"]}>
      <PlanSelectionFields />
    </MultiStepForm.Step>
  </MultiStepForm>
  ```
- **Benefit**: 사용처에서 Step 구성을 자유롭게 정의 가능

**Decision 3**: Step별 부분 검증

- **Rationale**: 전체 폼 검증 대신 현재 Step 필드만 검증하여 UX 향상
- **Implementation**: `trigger(['field1', 'field2'])` 활용
- **Benefit**: 불필요한 에러 메시지 방지, 단계별 진행 보장

### Component Design

**MultiStepForm**:

```typescript
interface MultiStepFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
}

function MultiStepForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
}: MultiStepFormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onBlur", // Step 이동 시 검증
  });

  const steps = Children.toArray(children);

  return (
    <FormProvider {...methods}>
      <StepProvider totalSteps={steps.length}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
      </StepProvider>
    </FormProvider>
  );
}
```

**MultiStepForm.Step**:

```typescript
interface StepProps {
  fields: string[]; // 이 Step에서 검증할 필드들
  children: ReactNode;
}

function Step({ fields, children }: StepProps) {
  const { currentStep, stepIndex } = useStepContext();
  const { trigger } = useFormContext();

  // 현재 Step이 아니면 렌더링하지 않음
  if (currentStep !== stepIndex) return null;

  return <div data-step={stepIndex}>{children}</div>;
}

MultiStepForm.Step = Step;
```

**useMultiStep hook**:

```typescript
interface UseMultiStepReturn {
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNextStep: () => Promise<boolean>; // 검증 후 이동
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
}
```

**플로우 다이어그램**:

```
User fills Step 1
       ↓
Click "Next"
       ↓
trigger(['nickname']) → validation
       ↓
Pass? → goToNextStep() → render Step 2
       ↓
Fail? → show errors, stay on Step 1
       ↓
... repeat ...
       ↓
Last Step → Click "Submit"
       ↓
handleSubmit(onSubmit) → full validation
       ↓
Pass? → onSubmit(data)
```

### Data Models

```typescript
// types.ts
import type { FieldValues, DefaultValues } from "react-hook-form";
import type { ZodSchema } from "zod";

export interface MultiStepFormProps<T extends FieldValues> {
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: ReactNode;
  className?: string;
}

export interface StepProps {
  fields: (string | `${string}.${string}`)[];
  children: ReactNode;
  className?: string;
}

export interface StepContextValue {
  currentStep: number;
  totalSteps: number;
  goToNextStep: (fields?: string[]) => Promise<boolean>;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  registerStep: (index: number) => void;
}

// Example usage schema
const signinSchema = z.object({
  nickname: z.string().min(2, "2자 이상 입력하세요"),
  plan: z.enum(["free", "pro", "enterprise"], {
    required_error: "요금제를 선택하세요",
  }),
  startDate: z.date({
    required_error: "시작일을 선택하세요",
  }),
  teamName: z.string().min(1, "팀 이름을 입력하세요"),
});

type SigninFormData = z.infer<typeof signinSchema>;
```

---

## 4. Implementation Plan

### Phase 1: Setup & Dependencies

**Tasks**:

1. 의존성 설치 (`pnpm add react-hook-form @hookform/resolvers zod`)
2. 기본 타입 정의 (`types.ts`)
3. StepContext 구현 (`StepContext.tsx`)

**Files to Create**:

- `src/shared/ui/multi-step-form/types.ts` (CREATE)
- `src/shared/ui/multi-step-form/StepContext.tsx` (CREATE)

### Phase 2: Core Components

**Tasks**:

1. `useMultiStep` hook 구현
2. `MultiStepForm` 메인 컴포넌트 구현
3. `MultiStepForm.Step` 컴포넌트 구현

**Files to Create**:

- `src/shared/ui/multi-step-form/useMultiStep.ts` (CREATE)
- `src/shared/ui/multi-step-form/MultiStepForm.tsx` (CREATE)
- `src/shared/ui/multi-step-form/MultiStepFormStep.tsx` (CREATE)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Integration & Examples

**Tasks**:

1. 기존 UI 컴포넌트와 Controller 통합 예시 작성
2. 복합 Step (RadioCard + Calendar) 예시 작성
3. Storybook 스토리 작성

**Files to Create**:

- `src/shared/ui/multi-step-form/MultiStepForm.stories.tsx` (CREATE)

### Phase 4: Testing & Polish

**Tasks**:

1. 단위 테스트 작성
2. 접근성 검증
3. 타입 안전성 최종 검증

**Files to Create**:

- `src/shared/ui/multi-step-form/MultiStepForm.test.tsx` (CREATE)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 패턴 사용 (barrel export 제거)

**HIGH**:

- `rerender-memo`: FormProvider로 불필요한 리렌더링 최소화
- `rerender-functional-setstate`: Step 상태 업데이트 시 함수형 setState 사용

**MEDIUM**:

- `rerender-context-split`: Form Context와 Step Context 분리

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Step Navigation 테스트

- 테스트 타입: Unit
- 테스트 케이스:
  - 초기 Step이 0인지 확인
  - `goToNextStep` 호출 시 Step 증가
  - `goToPrevStep` 호출 시 Step 감소
  - 첫 Step에서 `goToPrevStep` 무시
  - 마지막 Step에서 `goToNextStep` 무시

**TS-2**: Step별 검증 테스트

- 테스트 타입: Unit
- 테스트 케이스:
  - 유효한 필드로 다음 Step 이동 성공
  - 유효하지 않은 필드로 이동 실패
  - 에러 메시지 올바르게 표시

**TS-3**: 복합 Step 테스트

- 테스트 타입: Integration
- 테스트 케이스:
  - RadioCard + Calendar 조합 렌더링
  - 두 필드 모두 검증 후 이동

**TS-4**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] `react-hook-form`, `@hookform/resolvers`, `zod` 의존성 추가
- [ ] `MultiStepForm` 컴포넌트 구현 (`src/shared/ui/multi-step-form/`)
- [ ] Step Context 및 `useMultiStep` hook 구현
- [ ] 기존 UI 컴포넌트(RadioCard, Calendar)와 Controller 통합 예시
- [ ] Storybook 예시 작성
- [ ] 단위 테스트 작성
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] Step 이동 (Next/Prev) 정상 동작
- [ ] Step별 부분 검증 동작
- [ ] 복합 Step (RadioCard + Calendar) 동작
- [ ] 최종 Submit 시 전체 데이터 전달

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] JSDoc 주석 추가

**성능**:

- [ ] 번들 크기 증가 확인 (react-hook-form ~12KB, zod ~14KB)
- [ ] Step 전환 시 불필요한 리렌더링 없음

**접근성**:

- [ ] 키보드로 Step 이동 가능
- [ ] 에러 메시지 aria-live 적용
- [ ] 포커스 관리 (Step 전환 시)

---

## 6. Risks & Dependencies

### Risks

**R-1**: 번들 크기 증가

- **Risk**: react-hook-form + zod 추가로 번들 크기 ~26KB 증가
- **Impact**: MEDIUM
- **Probability**: HIGH (확정)
- **Mitigation**:
  - Tree-shaking 확인
  - 필요 시 동적 임포트로 code-splitting
- **Status**: 수용 가능 (form 라이브러리로서 합리적 크기)

**R-2**: 기존 Signin 플로우 마이그레이션 복잡도

- **Risk**: 기존 URL 기반 Step 관리와 새 시스템 통합 시 복잡도
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 이번 이슈에서는 마이그레이션 제외, 별도 이슈로 분리
- **Status**: Scope 외 (Out of Scope)

### Dependencies

**D-1**: react-hook-form 라이브러리

- **Dependency**: `react-hook-form@7.x`
- **Required For**: 전체 구현
- **Status**: AVAILABLE (npm)
- **Note**: React 19 호환성 확인 필요

**D-2**: 기존 UI 컴포넌트

- **Dependency**: RadioCard, Calendar, Field, Input
- **Required For**: 통합 예시
- **Status**: AVAILABLE (이미 controlled component 패턴)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Phase-based Rollout**:

1. Phase 1: 의존성 추가 및 기본 컴포넌트 구현
2. Phase 2: Storybook 예시로 검증
3. Phase 3: 실제 페이지에 적용 (별도 이슈)

**Rollback Plan**:

- 의존성만 추가하고 기존 코드 변경 없음
- 문제 시 컴포넌트 사용 중단으로 롤백 가능

### Success Metrics

**SM-1**: 개발 생산성

- **Metric**: Multi-step form 구현 시간
- **Target**: 새 multi-step form 구현 시간 50% 단축
- **Measurement**: 기존 Signin 대비 새 폼 구현 시간 비교

**SM-2**: 코드 품질

- **Metric**: 검증 관련 버그 수
- **Target**: 폼 검증 관련 버그 0건
- **Measurement**: 이슈 트래킹

---

## 8. Timeline & Milestones

### Milestones

**M1**: Dependencies & Types 완료

- 의존성 설치 및 기본 타입 정의
- **Status**: NOT_STARTED

**M2**: Core Components 완료

- MultiStepForm, Step, useMultiStep 구현
- **Status**: NOT_STARTED

**M3**: Examples & Tests 완료

- Storybook 예시 및 테스트 작성
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #47: [Feature] Multi-step Form 추상화 및 react-hook-form 통합

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [react-hook-form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [react-hook-form FormProvider](https://react-hook-form.com/docs/formprovider)
- [react-hook-form trigger](https://react-hook-form.com/docs/useform/trigger)

### Key Learnings

- RadioCard 컴포넌트는 이미 JSDoc에 react-hook-form Controller 예시 포함
- Calendar, RadioCard 모두 controlled component 패턴 (`value`/`onChange` 또는 유사)으로 RHF Controller와 호환

---

## 10. Implementation Summary

**Completion Date**: 2026-01-31
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/shared/ui/multi-step-form/types.ts` - 타입 정의 (MultiStepFormProps, StepProps, StepContextValue)
- `src/shared/ui/multi-step-form/StepContext.tsx` - Step 상태 관리 Context 및 Provider
- `src/shared/ui/multi-step-form/useMultiStep.ts` - Step 네비게이션 hook
- `src/shared/ui/multi-step-form/MultiStepForm.tsx` - 메인 컴포넌트 (Compound Component 패턴)
- `src/shared/ui/multi-step-form/MultiStepForm.stories.tsx` - 3개 Storybook 예시 (Basic, ComplexWithRadioCardAndCalendar, ThreeSteps)
- `src/shared/ui/multi-step-form/MultiStepForm.test.tsx` - 9개 테스트 케이스

#### Dependencies Added

- `react-hook-form@7.71.1`
- `@hookform/resolvers@5.2.2`
- `zod@4.3.6`

#### Key Implementation Details

- **FormProvider + Step Context 분리 패턴**: react-hook-form의 FormProvider는 폼 상태만 관리, Step 상태는 별도 StepContext로 분리하여 관심사 분리
- **Compound Component 패턴**: `<MultiStepForm.Step fields={['field1']}>`로 유연한 API 제공
- **Step별 부분 검증**: `trigger(fields)` 활용하여 현재 Step 필드만 검증
- **resolver prop 패턴**: zod v4 호환성을 위해 `schema` prop 대신 `resolver` prop 사용 (사용자가 `zodResolver(schema)` 직접 전달)
- **직접 import 패턴**: FSD 및 tree-shaking 최적화를 위해 barrel export 제거

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed
- [x] Tests: 30/30 passing (9 for MultiStepForm + 21 for Calendar)

### Deviations from Plan

**Changed**:

- `schema` prop 대신 `resolver` prop 사용

  - **이유**: zod v4와 @hookform/resolvers의 타입 호환성 문제
  - **해결**: 사용자가 `zodResolver(schema)`를 직접 전달하도록 API 변경

- `MultiStepFormStep.tsx` 별도 파일 대신 `MultiStepForm.tsx` 내부에 Step 컴포넌트 통합

  - **이유**: Step 컴포넌트가 작고 MultiStepForm과 강하게 결합되어 있음

- zod v3.x 대신 zod v4.3.6 사용
  - **이유**: 최신 버전 사용
  - **영향**: `required_error` 대신 `message` 파라미터 사용

**Skipped**:

- `src/shared/lib/form/createStepSchema.ts` - 선택적 유틸로 분류되어 있었으며, 현재 필요하지 않음

### Performance Impact

- Bundle size: +~26KB (react-hook-form ~12KB + zod ~14KB)
- Tree-shaking 지원으로 실제 사용 시 더 작아질 수 있음

### Acceptance Criteria Completion

- [x] `react-hook-form`, `@hookform/resolvers`, `zod` 의존성 추가
- [x] `MultiStepForm` 컴포넌트 구현 (`src/shared/ui/multi-step-form/`)
- [x] Step Context 및 `useMultiStep` hook 구현
- [x] 기존 UI 컴포넌트(RadioCard, Calendar)와 Controller 통합 예시
- [x] Storybook 예시 작성 (3개: Basic, ComplexWithRadioCardAndCalendar, ThreeSteps)
- [x] 단위 테스트 작성 (9개 테스트)
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Notes

- SPA 프로젝트이므로 'use client' 지시문 제거
- zod v4 API 변경 사항 반영 (`required_error` → `message`)
- 복합 Step (RadioCard + Calendar) 예시로 controlled component 통합 검증 완료

---

**Plan Status**: Completed
**Last Updated**: 2026-01-31
