# [#138] 회고 추가 Dialog 리디자인 및 기획 수정본 반영

## Overview

회고 추가 Dialog의 디자인 및 기획 수정본을 반영합니다.
`CreateRetrospectDialog` 폼 흐름에서 시간 선택 기능을 제거하고, Calendar·IconButton·Accordion 공통 컴포넌트를 리디자인합니다.

---

## Implementation Summary

**Completion Date**: 2026-02-19
**Implemented By**: Claude Sonnet 4.6

### Changes Made

#### Files Modified

- [src/features/retrospective/model/schema.ts](src/features/retrospective/model/schema.ts) — 폼 스키마에서 `retrospectTime` 필드 제거
- [src/features/retrospective/ui/CreateRetrospectForm.tsx](src/features/retrospective/ui/CreateRetrospectForm.tsx) — `retrospectTime` 관련 코드 제거, API 호출 시 `retrospectTime: '00:00'` 고정값 전달
- [src/features/retrospective/ui/steps/CompleteStep.tsx](src/features/retrospective/ui/steps/CompleteStep.tsx) — `retrospectTime` prop 제거, 날짜만 표시
- [src/features/retrospective/ui/steps/DateTimeStep.tsx](src/features/retrospective/ui/steps/DateTimeStep.tsx) — TimeSelector 제거, `handleNext` → `goToNextStep` 직접 사용
- [src/features/retrospective/ui/steps/MethodSelector.tsx](src/features/retrospective/ui/steps/MethodSelector.tsx) — 회고 방식 선택 시 Accordion 자동 오픈 연동
- [src/features/retrospective/ui/steps/MethodStep.tsx](src/features/retrospective/ui/steps/MethodStep.tsx) — `handleNext` → `goToNextStep` 직접 사용
- [src/features/retrospective/ui/steps/ProjectNameStep.tsx](src/features/retrospective/ui/steps/ProjectNameStep.tsx) — `handleNext` → `goToNextStep` 직접 사용
- [src/shared/ui/accordion/Accordion.tsx](src/shared/ui/accordion/Accordion.tsx) — controlled 모드(`value`, `onValueChange`) 지원 추가
- [src/shared/ui/calendar/Calendar.tsx](src/shared/ui/calendar/Calendar.tsx) — 리디자인: 헤더 좌우 패딩, Cell 28×28px, row gap 10px, 오늘 날짜 blue-500 하이라이트, 텍스트 스타일 정비
- [src/shared/ui/icon-button/IconButton.tsx](src/shared/ui/icon-button/IconButton.tsx) — square radius 6px 통일, tertiary disabled bg `#F3F4F5`

#### New Assets

- `src/shared/assets/images/img_retrospect_complete.png` — 회고 생성 완료 일러스트

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Key Implementation Details

- **TimeSelector 제거**: 백엔드 `CreateRetrospectRequest.retrospectTime` 이 여전히 required라 `'00:00'` 고정값 전달. 백엔드 스펙 변경 시 제거 필요
- **handleNext 간소화**: `goToNextStep`만 호출하던 핸들러를 제거하고 직접 바인딩
- **Accordion controlled 모드**: MethodSelector에서 라디오 선택 시 해당 아코디언을 programmatically 열기 위해 `value`/`onValueChange` 추가
- **Calendar 리디자인**: 헤더를 `grid grid-cols-7`로 달력 너비 내에 고정, 셀 28×28px, row gap 10px, 오늘 날짜 `text-blue-500`

### Deviations from Plan

**Added**:
- `Accordion.tsx` controlled 모드 추가 (MethodSelector 요구사항)
- `IconButton.tsx` radius·disabled 스타일 통일
- Calendar 상세 디자인 조정 (헤더 패딩, 텍스트 스타일, 오늘 날짜 하이라이트)

### Follow-up Tasks

- [ ] 백엔드 `retrospectTime` optional 처리 후 고정값 제거
- [ ] `img_retrospect_complete.png` CompleteStep에 실제 적용
