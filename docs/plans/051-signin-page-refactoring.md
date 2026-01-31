# Task Plan: 로그인 페이지 리팩토링

**Issue**: #51
**Type**: Refactor
**Created**: 2026-01-31
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 로그인 페이지(`SigninPage`)와 인증 관련 Step 컴포넌트들이 공통 컴포넌트를 활용하지 않고 있습니다.

- `Button`, `Input`, `MultiStepForm` 등 공통 컴포넌트가 존재하지만 미사용
- 각 Step 컴포넌트에서 버튼, 입력 필드 스타일이 중복 구현
- URL searchParams로 수동 step 관리 중 (MultiStepForm의 step context 미활용)

### Objectives

1. 모든 Step 컴포넌트에서 `Button` 공통 컴포넌트 사용
2. 모든 Step 컴포넌트에서 `Input` 공통 컴포넌트 사용
3. `SigninPage`에서 `MultiStepForm` 컴포넌트 활용 (선택적)
4. 하드코딩된 색상 값 제거 및 일관된 스타일 적용

### Scope

**In Scope**:

- `LoginStep` 컴포넌트 리팩토링 (Button 적용)
- `NicknameStep` 컴포넌트 리팩토링 (Button, Input 적용)
- `TeamStep` 컴포넌트 리팩토링 (ToggleButton 적용)
- `TeamNameStep` 컴포넌트 리팩토링 (Button, Input 적용)
- `InviteLinkStep` 컴포넌트 리팩토링 (Button, Input 적용)

**Out of Scope**:

- `MultiStepForm` 도입 (현재 URL 기반 step 관리가 잘 작동하고 있어 유지)
- 소셜 로그인 버튼의 커스텀 스타일 (카카오/구글 브랜드 가이드라인 준수 필요)
- 새로운 기능 추가

---

## 2. Requirements

### Functional Requirements

**FR-1**: Button 공통 컴포넌트 적용

- 모든 "다음", "시작하기" 버튼에 `Button` 컴포넌트 사용
- `variant="primary"`, `size="xl"`, `fullWidth` props 활용

**FR-2**: Input 공통 컴포넌트 적용

- 닉네임, 팀 이름, 초대 링크 입력 필드에 `Input` 컴포넌트 사용
- `clearable`, `onClear` props로 삭제 버튼 기능 구현

**FR-3**: ToggleButton 공통 컴포넌트 적용

- TeamStep의 "새로운 팀 생성" / "초대 받았어요" 버튼에 적용

**FR-4**: Field 컴포넌트 적용

- 라벨이 있는 입력 필드에 `Field`, `FieldLabel` 조합 사용

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 공통 컴포넌트는 `@/shared/ui/` 경로로 import
- 직접 import 방식 사용 (barrel export 미사용)

**TR-2**: 기존 동작 유지

- 모든 step 전환 로직 유지
- 폼 제출 핸들러 동작 유지

### Non-Functional Requirements

**NFR-1**: 코드 중복 제거

- 각 Step에서 반복되는 버튼/입력 스타일 코드 제거
- 공통 컴포넌트로 통일

**NFR-2**: 접근성 유지

- 기존 aria-label 유지
- 키보드 네비게이션 동작 확인

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── pages/
│   └── signin/
│       └── ui/
│           └── SigninPage.tsx       # (변경 없음)
├── features/
│   └── auth/
│       ├── model/
│       │   └── types.ts             # (변경 없음)
│       └── ui/
│           ├── LoginStep.tsx        # MODIFY - Button 적용 (소셜 로그인은 유지)
│           ├── NicknameStep.tsx     # MODIFY - Button, Input, Field 적용
│           ├── TeamStep.tsx         # MODIFY - ToggleButton 적용
│           ├── TeamNameStep.tsx     # MODIFY - Button, Input, Field 적용
│           └── InviteLinkStep.tsx   # MODIFY - Button, Input, Field 적용
└── shared/
    └── ui/
        ├── button/Button.tsx        # 사용
        ├── input/Input.tsx          # 사용
        ├── field/Field.tsx          # 사용
        └── toggle-button/ToggleButton.tsx  # 사용
```

### Design Decisions

**Decision 1**: 소셜 로그인 버튼 스타일 유지

- **Rationale**: 카카오/구글 브랜드 가이드라인 준수 필요
- **Approach**: `LoginStep`의 소셜 로그인 버튼은 현재 스타일 유지
- **Trade-offs**: 공통 컴포넌트 미사용으로 일부 중복 존재, 그러나 브랜드 일관성 확보
- **Impact**: LOW

**Decision 2**: MultiStepForm 도입 보류

- **Rationale**: 현재 URL searchParams 기반 step 관리가 잘 작동 중
- **Approach**: 기존 step 관리 로직 유지
- **Trade-offs**: react-hook-form 통합 검증 미활용, 그러나 현재 구조 안정성 확보
- **Impact**: MEDIUM

**Decision 3**: ToggleButton을 TeamStep에 적용

- **Rationale**: TeamStep의 선택 버튼이 ToggleButton의 pressed 상태와 잘 맞음
- **Approach**: `variant="tertiary"`, `size="xl"` 사용
- **Benefit**: 선택 상태 시각화 일관성

### Component Mapping

| 현재 컴포넌트   | 적용할 공통 컴포넌트 | Props                                         |
| --------------- | -------------------- | --------------------------------------------- |
| "다음" 버튼     | `Button`             | `variant="primary"`, `size="xl"`, `fullWidth` |
| "시작하기" 버튼 | `Button`             | `variant="primary"`, `size="xl"`, `fullWidth` |
| 닉네임 입력     | `Input`              | `clearable`, `onClear`                        |
| 팀 이름 입력    | `Input`              | `clearable`, `onClear`                        |
| 초대 링크 입력  | `Input`              | `clearable`, `onClear`                        |
| 팀 옵션 버튼    | `ToggleButton`       | `variant="tertiary"`, `size="xl"`, `pressed`  |

---

## 4. Implementation Plan

### Phase 1: NicknameStep 리팩토링

**Tasks**:

1. `Button` 컴포넌트 import 및 "다음" 버튼 교체
2. `Input` 컴포넌트 import 및 닉네임 입력 필드 교체
3. `Field`, `FieldLabel` 적용

**Files to Modify**:

- `src/features/auth/ui/NicknameStep.tsx` (MODIFY)

### Phase 2: TeamNameStep, InviteLinkStep 리팩토링

**Tasks**:

1. `Button`, `Input`, `Field` 컴포넌트 적용
2. 동일한 패턴으로 두 컴포넌트 리팩토링

**Files to Modify**:

- `src/features/auth/ui/TeamNameStep.tsx` (MODIFY)
- `src/features/auth/ui/InviteLinkStep.tsx` (MODIFY)

### Phase 3: TeamStep 리팩토링

**Tasks**:

1. `ToggleButton` 컴포넌트 import 및 옵션 버튼 교체
2. `Button` 컴포넌트로 "다음" 버튼 교체
3. 선택 상태 관리 로직 조정

**Files to Modify**:

- `src/features/auth/ui/TeamStep.tsx` (MODIFY)

### Phase 4: LoginStep 리팩토링 (선택적)

**Tasks**:

1. 소셜 로그인 버튼은 현재 스타일 유지 (브랜드 가이드라인)
2. 필요 시 구조만 정리

**Files to Modify**:

- `src/features/auth/ui/LoginStep.tsx` (MODIFY - 최소한)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: props 변경 시에만 리렌더링 (controlled component 최적화)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 각 Step 화면에서 입력, 버튼 클릭 동작 확인
- Step 전환 정상 동작 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] `SigninPage`에서 `MultiStepForm` 컴포넌트 활용 → **보류 (현재 구조 유지)**
- [ ] 모든 Step 컴포넌트에서 `Button` 공통 컴포넌트 사용
- [ ] 모든 Step 컴포넌트에서 `Input` 공통 컴포넌트 사용
- [ ] 하드코딩된 색상 값 제거 (디자인 토큰 또는 Tailwind 변수 활용)
- [ ] 빌드 성공 및 기존 기능 정상 동작 확인

### Validation Checklist

**기능 동작**:

- [ ] 닉네임 입력 및 삭제 버튼 동작
- [ ] 팀 옵션 선택 및 상태 변경
- [ ] 팀 이름 입력 및 삭제 버튼 동작
- [ ] 초대 링크 입력 및 삭제 버튼 동작
- [ ] 모든 "다음"/"시작하기" 버튼 동작
- [ ] Step 간 전환 정상 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거

---

## 6. Risks & Dependencies

### Risks

**R-1**: 공통 컴포넌트 스타일 불일치

- **Risk**: 공통 컴포넌트 적용 시 기존 디자인과 미세한 차이 발생 가능
- **Impact**: LOW
- **Probability**: MEDIUM
- **Mitigation**: className prop으로 필요 시 스타일 오버라이드

### Dependencies

**D-1**: 공통 컴포넌트 준비 상태

- **Dependency**: `Button`, `Input`, `ToggleButton`, `Field` 컴포넌트
- **Required For**: 모든 Phase
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

- 단일 PR로 모든 변경사항 배포
- 기능 변경 없이 리팩토링만 진행하므로 점진적 롤아웃 불필요

### Success Metrics

**SM-1**: 코드 중복 제거

- **Metric**: 중복 스타일 코드 라인 수
- **Target**: 각 Step 컴포넌트에서 버튼/입력 스타일 중복 0

---

## 8. Timeline & Milestones

### Milestones

**M1**: NicknameStep 리팩토링 완료

- 첫 번째 Step 컴포넌트 패턴 확립
- **Status**: NOT_STARTED

**M2**: 전체 Step 컴포넌트 리팩토링 완료

- 모든 5개 Step 컴포넌트 리팩토링
- **Status**: NOT_STARTED

**M3**: 품질 검증 완료

- 빌드, 타입 체크, 린트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #51: [로그인 페이지 리팩토링](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/51)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [React Hook Form Documentation](https://react-hook-form.com/)
- [class-variance-authority](https://cva.style/docs)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-31
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [`src/features/auth/model/schema.ts`](../../src/features/auth/model/schema.ts) - Zod 스키마 및 SigninFormData 타입 정의

#### Files Modified

- [`src/pages/signin/ui/SigninPage.tsx`](../../src/pages/signin/ui/SigninPage.tsx) - MultiStepForm 기반 리팩토링, URL 파라미터 제거, 스켈레톤 UI 추가
- [`src/features/auth/ui/LoginStep.tsx`](../../src/features/auth/ui/LoginStep.tsx) - useStepContext 사용으로 전환
- [`src/features/auth/ui/NicknameStep.tsx`](../../src/features/auth/ui/NicknameStep.tsx) - useFormContext, useStepContext, Button, Input, Field 적용
- [`src/features/auth/ui/TeamStep.tsx`](../../src/features/auth/ui/TeamStep.tsx) - RadioCardGroup/RadioCardItem 적용, Controller 사용
- [`src/features/auth/ui/TeamNameStep.tsx`](../../src/features/auth/ui/TeamNameStep.tsx) - useFormContext, Button, Input, Field 적용
- [`src/features/auth/ui/InviteLinkStep.tsx`](../../src/features/auth/ui/InviteLinkStep.tsx) - useFormContext, Button, Input, Field 적용
- [`src/features/auth/model/types.ts`](../../src/features/auth/model/types.ts) - SigninStep 타입 제거, TeamOption만 유지

#### Key Implementation Details

1. **MultiStepForm 도입**: URL searchParams 기반 step 관리에서 내부 state 기반으로 전환

   - 보안 향상: URL 직접 접근으로 step 우회 불가
   - react-hook-form + zod 통합 검증 활성화

2. **공통 컴포넌트 적용**:

   - `Button`: 모든 "다음"/"시작하기" 버튼에 `size="xl"`, `fullWidth` 적용
   - `Input`: 닉네임, 팀 이름, 초대 링크 필드에 `clearable` 기능 적용
   - `Field`, `FieldLabel`: 라벨 있는 입력 필드 구조화
   - `RadioCardGroup`, `RadioCardItem`: TeamStep 옵션 선택 UI (ToggleButton 대신)

3. **Step 네비게이션**:

   - `useStepContext().goToNextStep()`: 순차 이동
   - `useStepContext().goToStep(n)`: 조건부 분기 (TeamStep에서 create→3, join→4)

4. **좌측 이미지 제거**: 기존 이미지 대신 스켈레톤 placeholder 표시

### Quality Validation

- [x] Build: Success (vite build 828ms)
- [x] Type Check: Passed (tsc --noEmit)
- [x] Lint: Passed (Biome check)

### Deviations from Plan

**Changed**:

- **MultiStepForm 도입**: 계획에서는 "보류"였으나, URL 보안 문제로 도입 결정
- **TeamStep UI**: ToggleButton 대신 RadioCardGroup 사용 (사용자 요청)
- **좌측 이미지**: 계획에 없었으나 스켈레톤으로 대체 (사용자 요청)

**Added**:

- `src/features/auth/model/schema.ts`: Zod 스키마 파일 신규 생성
- 스켈레톤 UI (좌측 패널)

**Skipped**:

- 소셜 로그인 후 기존 유저/신규 유저 분기 처리 (별도 작업 필요)

### Follow-up Tasks

- [ ] 소셜 로그인 클릭 시 기존 유저는 메인 페이지로, 신규 유저는 온보딩 페이지로 분기 처리

### Notes

- 모든 Step 컴포넌트가 props 의존성에서 context 의존성으로 전환됨
- react-hook-form의 Controller 사용으로 RadioCard 상태 관리 통합
- FSD 아키텍처 준수: shared → features → pages 단방향 의존성 유지

---

**Plan Status**: Completed
**Last Updated**: 2026-01-31
**Next Action**: /commit 후 /pr 진행
