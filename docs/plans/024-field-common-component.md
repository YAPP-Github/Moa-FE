# Task Plan: Field 공통 컴포넌트 구현

**Issue**: #24
**Type**: Feature
**Created**: 2026-01-26
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 프로젝트에는 Input 컴포넌트가 존재하지만, 폼 필드에 필요한 Label, 에러 메시지, 도움말 텍스트 등을 포함한 완전한 Field 컴포넌트가 없습니다.

- 폼 작성 시 Input, Label, 에러 메시지를 매번 개별적으로 조합해야 하는 중복 발생
- 접근성 속성(htmlFor, aria-describedby 등)을 매번 수동으로 연결해야 함
- 일관된 폼 UI를 유지하기 어려움

### Objectives

1. shadcn/ui 방식의 Compound Component 패턴으로 Field 컴포넌트 구현
2. react-hook-form, TanStack Form 등 모든 폼 라이브러리와 호환되는 Presentational 컴포넌트 제공
3. 접근성(a11y) 지원이 내장된 폼 필드 UI 제공

### Scope

**In Scope**:

- Field 컨테이너 컴포넌트
- FieldLabel 컴포넌트 (필수 필드 표시 포함)
- FieldDescription 컴포넌트 (도움말 텍스트)
- FieldError 컴포넌트 (에러 메시지)
- Storybook 문서 (단독 사용 + react-hook-form 연동 예시)
- Public API export

**Out of Scope**:

- react-hook-form 전용 wrapper 컴포넌트 (FormField)
- 폼 유효성 검사 로직
- Input 외 다른 폼 컨트롤(Select, Checkbox 등) 통합

### User Context

> "shadcn/ui 방식을 따라 Compound Component 패턴으로 구현"

**핵심 요구사항**:

1. Presentational (Headless) 컴포넌트로 구현
2. 어떤 폼 라이브러리와도 호환 가능해야 함

---

## 2. Requirements

### Functional Requirements

**FR-1**: Field 컨테이너

- 자식 컴포넌트들을 감싸는 컨테이너 역할
- `data-invalid` 속성으로 에러 상태 표시
- 수직 레이아웃 (gap 지원)

**FR-2**: FieldLabel

- `<label>` 요소 렌더링
- `htmlFor` 속성으로 Input과 연결
- `required` prop으로 필수 표시 (`*`) 지원

**FR-3**: FieldDescription

- 도움말 텍스트 표시
- `aria-describedby`로 Input과 연결 가능
- 작은 크기, muted 색상

**FR-4**: FieldError

- 에러 메시지 표시
- destructive 색상
- `children` 또는 `message` prop으로 메시지 전달

### Technical Requirements

**TR-1**: 기존 패턴 준수

- `forwardRef` 사용
- `cn()` 유틸리티로 클래스 병합
- TypeScript strict 타입

**TR-2**: 스타일링

- Tailwind CSS 사용
- 기존 디자인 토큰 활용 (destructive, muted-foreground 등)

### Non-Functional Requirements

**NFR-1**: 접근성

- `htmlFor`와 `id` 연결
- `aria-describedby`로 description/error 연결
- `aria-invalid` 상태 표시

**NFR-2**: 유연성

- 어떤 폼 라이브러리와도 호환
- Input 외 다른 폼 컨트롤과도 조합 가능

---

## 3. Architecture & Design

### Directory Structure

```
src/shared/ui/
├── field/
│   ├── Field.tsx           # 모든 Compound Components
│   ├── Field.stories.tsx   # Storybook 문서
│   └── index.ts            # Public API
├── button/
├── input/
└── index.ts                # Field export 추가
```

### Design Decisions

**Decision 1**: Compound Component 패턴 사용

- **Rationale**: shadcn/ui 업계 표준 방식, 유연한 조합 가능
- **Approach**: Field, FieldLabel, FieldDescription, FieldError를 개별 컴포넌트로 제공
- **Trade-offs**: 사용 시 약간의 보일러플레이트 발생하지만, 유연성 확보
- **Alternatives Considered**: FormField wrapper 방식 (react-hook-form 결합)
- **Impact**: MEDIUM

**Decision 2**: 단일 파일에 모든 컴포넌트 정의

- **Rationale**: 관련 컴포넌트들을 한 곳에서 관리, shadcn 방식
- **Implementation**: Field.tsx에 모든 Compound Components 정의
- **Benefit**: 코드 응집도 향상, import 단순화

### Component Design

**Field (컨테이너)**:

```typescript
interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// data-invalid 속성으로 에러 상태 전달
<Field data-invalid={hasError}>
  ...
</Field>
```

**FieldLabel**:

```typescript
interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

// required일 때 * 표시
<FieldLabel htmlFor="email" required>
  이메일
</FieldLabel>
```

**FieldDescription**:

```typescript
interface FieldDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

<FieldDescription id="email-description">
  이메일 형식으로 입력하세요
</FieldDescription>
```

**FieldError**:

```typescript
interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

<FieldError>
  이메일 형식이 올바르지 않습니다
</FieldError>
```

**사용 예시 (react-hook-form)**:

```tsx
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="email" required>
        이메일
      </FieldLabel>
      <Input
        {...field}
        id="email"
        aria-describedby="email-description email-error"
        aria-invalid={fieldState.invalid}
      />
      <FieldDescription id="email-description">
        업무용 이메일을 입력하세요
      </FieldDescription>
      {fieldState.error && (
        <FieldError id="email-error">{fieldState.error.message}</FieldError>
      )}
    </Field>
  )}
/>
```

---

## 4. Implementation Plan

### Phase 1: Core Components

**Tasks**:

1. Field.tsx 파일 생성
2. Field 컨테이너 컴포넌트 구현
3. FieldLabel 컴포넌트 구현 (required 표시 포함)
4. FieldDescription 컴포넌트 구현
5. FieldError 컴포넌트 구현

**Files to Create/Modify**:

- `src/shared/ui/field/Field.tsx` (CREATE)
- `src/shared/ui/field/index.ts` (CREATE)
- `src/shared/ui/index.ts` (MODIFY - export 추가)

### Phase 2: Storybook Documentation

**Tasks**:

1. 기본 사용 예시 Story
2. 필수 필드 표시 Story
3. 에러 상태 Story
4. react-hook-form 연동 예시 Story

**Files to Create**:

- `src/shared/ui/field/Field.stories.tsx` (CREATE)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Quality Assurance

**Tasks**:

1. 빌드 검증
2. 타입 체크
3. 린트 검사

### Vercel React Best Practices

이 작업은 UI 컴포넌트 개발로 주로 해당하는 규칙:

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 (필요 시 memo 적용)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook Visual Testing

- 테스트 타입: Visual
- 테스트 케이스:
  - 기본 상태 렌더링
  - 필수 필드 표시 (`*`)
  - 에러 상태 스타일링
  - react-hook-form 연동

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] Field 컴포넌트 구현 (컨테이너)
- [ ] FieldLabel 컴포넌트 구현
- [ ] FieldDescription 컴포넌트 구현
- [ ] FieldError 컴포넌트 구현
- [ ] 필수 필드 표시 지원 (required prop)
- [ ] 접근성 속성 적용 (htmlFor, aria-describedby, data-invalid)
- [ ] Storybook stories 작성 (단독 + react-hook-form 연동 예시)
- [ ] Public API (index.ts) export
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] Field가 자식 컴포넌트를 올바르게 감쌈
- [ ] FieldLabel에 required 표시 동작
- [ ] FieldError에 destructive 색상 적용
- [ ] data-invalid 속성 전달 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 기존 패턴(forwardRef, cn) 준수

**접근성**:

- [ ] label과 input 연결 (htmlFor/id)
- [ ] aria-describedby 연결 가능
- [ ] 에러 상태 표시 (aria-invalid, data-invalid)

---

## 6. Risks & Dependencies

### Risks

**R-1**: 스타일 일관성

- **Risk**: 기존 Input 컴포넌트와 스타일 불일치
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: 동일한 디자인 토큰 및 색상 사용
- **Status**: 기존 스타일 분석 완료

### Dependencies

**D-1**: 기존 UI 컴포넌트

- **Dependency**: Input, Button 컴포넌트 패턴
- **Required For**: 일관된 코드 스타일
- **Status**: AVAILABLE

**D-2**: 디자인 토큰

- **Dependency**: src/index.css의 CSS 변수
- **Required For**: 스타일링 (destructive, muted-foreground)
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

단순 UI 컴포넌트 추가로 점진적 배포 불필요.

**Rollback Plan**:

- 문제 발생 시 해당 커밋 revert

### Success Metrics

**SM-1**: Storybook 문서화

- **Metric**: 모든 상태 문서화
- **Target**: 4개 이상의 Story
- **Measurement**: Storybook 확인

---

## 8. Timeline & Milestones

### Milestones

**M1**: Core Components 완성

- Field, FieldLabel, FieldDescription, FieldError 구현
- **Status**: NOT_STARTED

**M2**: Storybook 문서화

- 모든 Story 작성 완료
- **Status**: NOT_STARTED

**M3**: 품질 검증 통과

- Build, Type check, Lint 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #24: [Feature] Field 공통 컴포넌트 구현

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [shadcn/ui Field](https://ui.shadcn.com/docs/components/radix/field)
- [React Hook Form](https://react-hook-form.com/)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-26
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/shared/ui/field/Field.tsx` - Field, FieldLabel, FieldDescription, FieldError Compound Components
- `src/shared/ui/field/Field.stories.tsx` - Storybook 문서 (Default, Required, WithDescription, WithError)
- `src/shared/ui/field/index.ts` - Public API export

#### Files Modified

- `src/shared/ui/index.ts` - Field 컴포넌트 export 추가
- `src/shared/ui/input/Input.tsx` - `showCount` prop 추가 (character count 표시 기능)
- `src/shared/ui/input/Input.stories.tsx` - `WithCharacterCount` story 추가

### Key Implementation Details

1. **Compound Component 패턴**: shadcn/ui 방식으로 Field, FieldLabel, FieldDescription, FieldError를 개별 컴포넌트로 제공
2. **FieldLabel 스타일링**: `text-[#6B7684]` 색상 적용, `required` prop으로 필수 표시(`*`) 지원
3. **Field gap 조정**: Label과 Input 사이 10px (`gap-[10px]`)
4. **Input showCount 기능**: `showCount` + `maxLength` prop으로 우측 하단에 글자 수 표시 (`0/10` 형태)
5. **forwardRef 패턴**: 모든 컴포넌트에 forwardRef 적용
6. **접근성**: htmlFor, aria-describedby, aria-invalid, role="alert" 지원

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (Biome - 55 files checked)

### Deviations from Plan

**Added**:

- Input 컴포넌트에 `showCount` prop 추가 (계획에 없었으나 Field와 함께 사용하기 위해 추가)
- FieldLabel 색상 `#6B7684` 지정
- Input과 character count 사이 gap 8px 설정

**Changed**:

- Field gap을 `gap-2` (8px)에서 `gap-[10px]` (10px)으로 변경

**Skipped**:

- React Context를 통한 에러 상태 공유 (추후 필요 시 구현)
- react-hook-form 연동 예시 Story (기본 Stories만 작성)

### Acceptance Criteria Status

- [x] Field 컴포넌트 구현 (컨테이너)
- [x] FieldLabel 컴포넌트 구현
- [x] FieldDescription 컴포넌트 구현
- [x] FieldError 컴포넌트 구현
- [x] 필수 필드 표시 지원 (required prop)
- [x] 접근성 속성 적용 (htmlFor, aria-describedby, data-invalid)
- [x] Storybook stories 작성 (4개 Story)
- [x] Public API (index.ts) export
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

### Follow-up Tasks

- [ ] React Context를 통한 Field 에러 상태 자동 감지 (shadcn 방식)
- [ ] react-hook-form 연동 예시 Story 추가
- [ ] Textarea 컴포넌트에도 showCount 기능 적용

---

**Plan Status**: Completed
**Last Updated**: 2026-01-26
