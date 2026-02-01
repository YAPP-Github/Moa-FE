# Task Plan: 회고 추가하기 기능 구현

**Issue**: #72
**Type**: Feature
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

팀 대시보드 페이지(`TeamDashboardPage.tsx:53-56`)에 "회고 추가하기" 버튼이 UI로만 존재하며, 실제 기능이 연결되지 않은 상태입니다. 사용자가 새로운 회고를 생성할 수 없어 핵심 기능이 누락되어 있습니다.

- 현재 버튼 클릭 시 아무 동작도 하지 않음
- 백엔드 API (`createRetrospect` - API-011)는 이미 준비됨
- 회고 생성은 서비스의 핵심 기능으로, 미구현 시 사용자 경험 저하

### Objectives

1. "회고 추가하기" 버튼 클릭 시 Dialog 기반 회고 생성 플로우 표시
2. 회고 생성에 필요한 모든 정보 입력 UI 제공
3. `createRetrospect` API 연동 및 생성 완료 시 목록 자동 갱신

### Scope

**In Scope**:

- Dialog 컴포넌트 기반 회고 생성 폼 구현
- 프로젝트 이름, 회고 방식, 날짜/시간, 참고자료 URL 입력
- Zod 스키마 기반 유효성 검증
- React Query Mutation Hook 구현
- 성공/에러 처리 및 사용자 피드백

**Out of Scope**:

- 회고 수정/삭제 기능
- 회고 상세 페이지
- 회고 참여 기능

### User Context

> "회고 추가하기" 버튼을 누르면 Dialog로 회고 생성 플로우 진행

**핵심 요구사항**:

1. Dialog 모달 기반 UI (페이지 이동 없음)
2. 기존 CreateTeamDialog 패턴 재사용

---

## 2. Requirements

### Functional Requirements

**FR-1**: 회고 생성 Dialog 표시

- "회고 추가하기" 버튼 클릭 시 모달 Dialog 오픈
- ESC 키 또는 오버레이 클릭으로 닫기 가능
- 폼 작성 중 실수로 닫히지 않도록 disableOutsideClick 고려

**FR-2**: 회고 정보 입력 폼

- 프로젝트 이름: Input (1-20자, 필수)
- 회고 방식: RadioCard 선택 (KPT, 4L, 5F, PMI, FREE 중 택1, 필수)
- 회고 날짜: Calendar 선택 (YYYY-MM-DD, 필수)
- 회고 시간: Input (HH:mm, 필수)
- 참고자료 URL: 동적 추가 가능 (선택, 최대 10개)

**FR-3**: 유효성 검증

- 모든 필수 필드 입력 여부 확인
- 프로젝트 이름 길이 제한 (1-20자)
- URL 형식 검증 (유효한 URL인지)
- 시간 형식 검증 (HH:mm)

**FR-4**: API 연동 및 목록 갱신

- 폼 제출 시 `createRetrospect` API 호출
- 생성 성공 시 Dialog 닫기 + 회고 목록 자동 갱신
- 로딩 상태 표시 (버튼 비활성화 + 스피너)

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- 위치: `src/features/retrospective/`
- UI: `ui/CreateRetrospectDialog.tsx`, `ui/CreateRetrospectForm.tsx`
- API: `api/retrospective.mutations.ts`
- Model: `model/schema.ts`

**TR-2**: 기존 패턴 재사용

- Dialog: `CreateTeamDialog` 패턴 따르기
- Form: `MultiStepForm` 또는 단일 스텝 폼
- Mutation: `useCreateRetroRoom` 패턴 따르기

**TR-3**: 타입 안전성

- Generated API 타입 사용 (`CreateRetrospectRequest`, `RetrospectMethod`)
- Zod 스키마로 런타임 검증
- TypeScript strict mode 준수

### Non-Functional Requirements

**NFR-1**: 사용성

- 직관적인 폼 레이아웃
- 명확한 에러 메시지 (한글)
- 로딩 상태 피드백

**NFR-2**: 접근성

- 키보드 네비게이션 지원 (Dialog, RadioCard, Calendar 모두 지원됨)
- ARIA 레이블 적절히 사용
- 포커스 관리 (Dialog 오픈 시 첫 입력 필드로 포커스)

---

## 3. Architecture & Design

### Directory Structure

```
src/features/retrospective/
├── api/
│   ├── retrospective.queries.ts   # 기존 (조회)
│   └── retrospective.mutations.ts # 신규 (생성)
├── model/
│   └── schema.ts                  # 신규 (Zod 스키마)
├── ui/
│   ├── RetrospectCard.tsx         # 기존
│   ├── RetrospectSection.tsx      # 기존
│   ├── RetrospectEmptyState.tsx   # 기존
│   ├── CreateRetrospectDialog.tsx # 신규
│   └── CreateRetrospectForm.tsx   # 신규

src/pages/team-dashboard/ui/
└── TeamDashboardPage.tsx          # 수정 (Dialog 연동)
```

### Design Decisions

**Decision 1**: 단일 스텝 폼 vs MultiStepForm

- **Rationale**: 입력 필드가 5개로 적고, 모두 한 화면에 표시 가능
- **Approach**: 단일 스텝 폼으로 구현 (MultiStepForm 불필요)
- **Trade-offs**: 단순하고 빠른 입력 vs 단계별 안내 부족
- **Impact**: LOW (추후 필요시 MultiStepForm으로 전환 가능)

**Decision 2**: 시간 입력 방식

- **Rationale**: TimePicker 컴포넌트가 없음
- **Approach**: Input + pattern 검증으로 HH:mm 형식 입력
- **Trade-offs**: 직접 입력 필요 vs 드롭다운 선택의 편의성
- **Benefit**: 추가 컴포넌트 개발 없이 빠른 구현

**Decision 3**: 참고자료 URL 동적 추가

- **Rationale**: 최대 10개까지 추가 가능해야 함
- **Approach**: useFieldArray 또는 useState 배열로 관리
- **Implementation**: "URL 추가" 버튼으로 필드 동적 추가/삭제

### Component Design

**CreateRetrospectDialog**:

```typescript
interface CreateRetrospectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retroRoomId: number;
  onSuccess?: () => void;
}
```

**CreateRetrospectForm**:

```typescript
interface CreateRetrospectFormProps {
  retroRoomId: number;
  onSuccess?: () => void;
  onClose: () => void;
}
```

**플로우 다이어그램**:

```
[회고 추가하기] 버튼 클릭
    ↓
Dialog 오픈 (CreateRetrospectDialog)
    ↓
폼 입력 (CreateRetrospectForm)
    ↓
제출 → useCreateRetrospect mutation
    ↓
성공 → Dialog 닫기 + invalidateQueries(['retrospects', retroRoomId])
    ↓
TeamDashboardPage 목록 자동 갱신
```

### Data Models

```typescript
// Zod 스키마
const createRetrospectSchema = z.object({
  projectName: z
    .string()
    .min(1, "프로젝트 이름을 입력해주세요.")
    .max(20, "프로젝트 이름은 20자 이내로 입력해주세요."),
  retrospectMethod: z.enum(["KPT", "FOUR_L", "FIVE_F", "PMI", "FREE"], {
    required_error: "회고 방식을 선택해주세요.",
  }),
  retrospectDate: z.date({
    required_error: "회고 날짜를 선택해주세요.",
  }),
  retrospectTime: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "올바른 시간 형식(HH:mm)을 입력해주세요."
    ),
  referenceUrls: z
    .array(z.string().url("올바른 URL 형식을 입력해주세요."))
    .max(10)
    .optional(),
});

type CreateRetrospectFormData = z.infer<typeof createRetrospectSchema>;
```

### API Design

**Endpoint**: `POST /api/v1/retrospects` (기존 Generated API 사용)

**Request** (`CreateRetrospectRequest`):

```json
{
  "projectName": "스프린트 1 회고",
  "retroRoomId": 123,
  "retrospectDate": "2026-02-01",
  "retrospectTime": "14:00",
  "retrospectMethod": "KPT",
  "referenceUrls": ["https://github.com/org/repo"]
}
```

**Response** (`CreateRetrospectResponse`):

```json
{
  "retrospectId": 456,
  "retroRoomId": 123,
  "projectName": "스프린트 1 회고"
}
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. Mutation Hook 작성 (`useCreateRetrospect`)
2. Zod 스키마 정의 (`createRetrospectSchema`)

**Files to Create/Modify**:

- `src/features/retrospective/api/retrospective.mutations.ts` (CREATE)
- `src/features/retrospective/model/schema.ts` (CREATE)

**Estimated Effort**: Small

### Phase 2: Core Implementation

**Tasks**:

1. CreateRetrospectForm 컴포넌트 구현
   - 프로젝트 이름 Input
   - 회고 방식 RadioCardGroup
   - 날짜 선택 Calendar
   - 시간 입력 Input
   - 참고자료 URL 동적 추가
2. CreateRetrospectDialog 컴포넌트 구현
3. TeamDashboardPage에 Dialog 연동

**Files to Create/Modify**:

- `src/features/retrospective/ui/CreateRetrospectForm.tsx` (CREATE)
- `src/features/retrospective/ui/CreateRetrospectDialog.tsx` (CREATE)
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

**Estimated Effort**: Medium

### Phase 3: Polish & Optimization

**Tasks**:

1. 에러 처리 및 사용자 피드백 개선
2. 접근성 검토 (포커스, 키보드 네비게이션)
3. 빌드 및 린트 검증

**Files to Create/Modify**:

- 기존 파일 수정

**Estimated Effort**: Small

### Vercel React Best Practices

**HIGH**:

- Form 컴포넌트에서 불필요한 리렌더링 방지
- Controller 사용 시 최적화

**MEDIUM**:

- `rerender-memo`: RadioCard 선택 시 전체 폼 리렌더링 방지
- `rerender-functional-setstate`: URL 배열 상태 업데이트 시 함수형 setState 사용

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 컴포넌트 동작 검증

- 테스트 타입: Manual
- 테스트 케이스:
  - Dialog 오픈/닫기
  - 폼 입력 및 유효성 검증
  - API 호출 및 목록 갱신

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] "회고 추가하기" 버튼 클릭 시 Dialog 표시
- [ ] 모든 필수 필드 입력 및 유효성 검증
- [ ] `createRetrospect` API 연동
- [ ] 생성 성공 시 목록 자동 갱신
- [ ] 에러 처리 및 사용자 피드백
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 버튼 클릭 시 Dialog 오픈
- [ ] ESC 키로 Dialog 닫기
- [ ] 필수 필드 미입력 시 에러 메시지 표시
- [ ] 유효한 데이터로 제출 시 API 호출
- [ ] 성공 시 Dialog 닫기 + 목록 갱신
- [ ] 실패 시 에러 메시지 표시

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 준수

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] ARIA 레이블 적절히 사용

---

## 6. Risks & Dependencies

### Risks

**R-1**: Calendar와 폼 통합

- **Risk**: Calendar 컴포넌트가 react-hook-form과 직접 연동 안됨
- **Impact**: LOW
- **Probability**: MEDIUM
- **Mitigation**: Controller 래퍼로 연동
- **Status**: 예상됨

**R-2**: 시간 입력 UX

- **Risk**: 직접 입력 방식이 사용자에게 불편할 수 있음
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: placeholder로 형식 안내 ("14:00")

### Dependencies

**D-1**: Generated API

- **Dependency**: `src/shared/api/generated/index.ts`
- **Required For**: Mutation Hook
- **Status**: AVAILABLE

**D-2**: 기존 UI 컴포넌트

- **Dependency**: Dialog, Input, Field, Calendar, RadioCard, Button
- **Required For**: 폼 UI 구성
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

일반 PR 머지 후 자동 배포 (Vercel)

**Rollback Plan**:

- Git revert로 이전 상태 복구

### Success Metrics

**SM-1**: 기능 완성도

- **Metric**: 모든 Acceptance Criteria 충족
- **Target**: 100%

---

## 8. Timeline & Milestones

### Milestones

**M1**: 기반 설정

- Mutation Hook, Zod 스키마 완료
- **Status**: NOT_STARTED

**M2**: 핵심 UI 구현

- Form, Dialog 컴포넌트 완료
- **Status**: NOT_STARTED

**M3**: 통합 및 검증

- TeamDashboardPage 연동, 품질 게이트 통과
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #72: [회고 추가하기 기능 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/72)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [date-fns](https://date-fns.org/)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-02
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created (11 files)

**API & Model:**

- `src/features/retrospective/api/retrospective.mutations.ts` - useCreateRetrospect mutation hook
- `src/features/retrospective/model/schema.ts` - Zod 스키마 정의 (CreateRetrospectFormData)
- `src/features/retrospective/model/constants.ts` - 회고 방식 라벨/설명 상수

**UI Components:**

- `src/features/retrospective/ui/CreateRetrospectDialog.tsx` - Dialog wrapper
- `src/features/retrospective/ui/CreateRetrospectForm.tsx` - MultiStepForm 기반 회고 생성 폼
- `src/features/retrospective/ui/RetrospectRow.tsx` - 회고 목록 Row 컴포넌트
- `src/features/retrospective/ui/steps/ProjectNameStep.tsx` - Step 1: 프로젝트명 입력
- `src/features/retrospective/ui/steps/DateTimeStep.tsx` - Step 2: 날짜/시간 선택
- `src/features/retrospective/ui/steps/MethodStep.tsx` - Step 3: 회고 방식 선택
- `src/features/retrospective/ui/steps/ReferenceStep.tsx` - Step 4: 참고자료 URL
- `src/features/retrospective/ui/steps/CompleteStep.tsx` - 완료 화면
- `src/features/retrospective/ui/steps/MethodSelector.tsx` - Accordion + RadioCard 조합
- `src/features/retrospective/ui/steps/FormHeader.tsx` - 폼 헤더 (닫기 버튼)
- `src/features/retrospective/ui/steps/StepIndicator.tsx` - 스텝 진행률 표시
- `src/features/retrospective/ui/steps/TimeSelector.tsx` - 30분 단위 시간 선택

#### Files Modified (5 files)

- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` - CreateRetrospectDialog 연동
- `src/features/retrospective/ui/RetrospectSection.tsx` - RetrospectRow 사용
- `src/shared/ui/accordion/Accordion.tsx` - AccordionTrigger asChild prop 추가
- `src/shared/ui/radio-card/RadioCard.tsx` - tabIndex, focus 스타일 개선
- `src/shared/ui/calendar/Calendar.tsx` - react-hook-form Controller 호환성 개선

### Key Implementation Details

1. **MultiStepForm 기반 4단계 폼 구현**

   - 계획에서는 단일 스텝 폼 예정이었으나, 사용자 요청에 따라 MultiStepForm으로 변경
   - 각 스텝별 독립 컴포넌트로 분리

2. **회고 방식 선택 UI (Accordion + RadioCard 조합)**

   - RadioCard 내부에 Accordion 배치
   - 카드 선택과 Accordion 토글이 독립적으로 동작
   - AccordionTrigger에 asChild prop 추가하여 유연한 렌더링

3. **시간 선택 UI**

   - 계획에서는 Input + pattern 검증 예정이었으나, TimeSelector 컴포넌트로 구현
   - 30분 단위 버튼 그리드 형태

4. **참고자료 URL 동적 추가**

   - useFieldArray 사용
   - 기본 1개 row, "추가하기" 버튼으로 동적 추가/삭제

5. **완료 화면**
   - 폼 제출 성공 시 CompleteStep 렌더링
   - "확인" 버튼 클릭 시 Dialog 닫기

### Quality Validation

- [x] Build: Success (508KB)
- [x] Type Check: Passed (no errors)
- [x] Lint: Passed (no errors)
- [x] API 연동: createRetrospect mutation 연결 완료

### Deviations from Plan

**Changed**:

- 단일 스텝 폼 → MultiStepForm (4단계) - 사용자 UX 요청
- Input 기반 시간 입력 → TimeSelector 컴포넌트 (버튼 그리드)

**Added**:

- CompleteStep (완료 화면)
- RetrospectRow (회고 목록 Row 스타일)
- MethodSelector (Accordion + RadioCard 조합 컴포넌트)
- constants.ts (회고 방식 라벨/설명 분리)

**Skipped**:

- 오늘 회고 Swiper (다른 이슈에서 처리)

### Follow-up Tasks

- [ ] 오늘 회고 Swiper 구현 (별도 이슈)
- [ ] 회고 수정/삭제 기능
- [ ] 회고 상세 페이지

### Commits

```
c45c1c2 docs(plans): 회고 추가 기능 구현 계획 문서
2f1053c fix(ui): RadioCard, Swiper 상호작용 개선
7ca64f4 feat(retrospective): 회고 추가 다이얼로그 및 멀티스텝 폼 구현
```

---

**Plan Status**: Completed
**Last Updated**: 2026-02-02
