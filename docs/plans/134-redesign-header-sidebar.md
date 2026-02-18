# [Refactor] 메인 페이지 Header, Sidebar 컴포넌트 리디자인 및 기능 수정

## Overview

메인 페이지의 Header와 Sidebar 컴포넌트를 리디자인하고, 불필요한 기능을 제거하며 API 레이어를 프로젝트 컨벤션에 맞게 리팩토링합니다.

**Issue**: #134
**Branch**: `refactor/134-redesign-header-sidebar`

---

## Implementation Summary

**Completion Date**: 2026-02-18
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Sidebar 리디자인

- [SidebarListHeader.tsx](src/widgets/sidebar/ui/SidebarListHeader.tsx) - DropdownMenu 제거, h-38 div로 단순화. 좌측 "목록" 텍스트, 우측 Plus IconButton. CreateTeamDialog 상태 소유권 이전
- [DashboardSidebar.tsx](src/widgets/sidebar/ui/DashboardSidebar.tsx) - Props 제거 (prop-less), `border-r border-grey-100` 추가
- [SidebarTeamItem.tsx](src/widgets/sidebar/ui/SidebarTeamItem.tsx) - Dropdown/edit/leave 기능 모두 제거. 단순 Link 클릭으로 선택만 가능
- [SidebarTeamList.tsx](src/widgets/sidebar/ui/SidebarTeamList.tsx) - useSuspenseQuery 적용으로 isLoading 체크 제거
- [DashboardLayout.tsx](src/widgets/layout/ui/DashboardLayout.tsx) - Dialog 상태 관리 제거, 단순 레이아웃 조립만

#### 팀 기능 제거/수정

- [JoinTeamDialog.tsx](src/features/team/ui/JoinTeamDialog.tsx) - **삭제** ("기존 팀 입장하기" 기능 전체 제거)
- [FormActions.tsx](src/features/team/ui/FormActions.tsx) - **삭제** (사용처 없음)
- [NoTeamEmptyState.tsx](src/features/team/ui/NoTeamEmptyState.tsx) - `onSuccess` prop 제거, generated import 제거

#### 팀 생성 다이얼로그 개선

- [CreateTeamDialog.tsx](src/features/team/ui/CreateTeamDialog.tsx) - w-400px, h-232px 고정 사이즈, disableOutsideClick
- [CreateTeamForm.tsx](src/features/team/ui/CreateTeamForm.tsx) - try/catch 제거 (글로벌 에러 핸들링 활용), submit 시 blur 처리
- [TeamNameStep.tsx](src/features/team/ui/TeamNameStep.tsx) - Error 상태 UI 추가 (FieldLabel, Input error prop), clearable Input, 에러 메시지 영역 min-h로 레이아웃 시프트 방지

#### Team API 컨벤션 리팩토링

- [team.api.ts](src/features/team/api/team.api.ts) - **신규 생성**. customInstance + Zod 런타임 검증 (generated 직접 import 제거)
- [team.queries.ts](src/features/team/api/team.queries.ts) - teamQueryKeys 도입, useSuspenseQuery 적용, 도메인 API import로 변경
- [team.mutations.ts](src/features/team/api/team.mutations.ts) - 도메인 API import, teamQueryKeys 사용
- [schema.ts](src/features/team/model/schema.ts) - Zod 응답 스키마 추가 (baseResponseSchema 활용), .trim() + 공백 허용 regex
- [types.ts](src/features/team/model/types.ts) - **신규 생성**. Request 타입 정의

#### 공통 컴포넌트 개선

- [Field.tsx](src/shared/ui/field/Field.tsx) - FieldLabel에 `error` prop 추가 (에러 시 red-300, 비에러 시 focus-within blue)
- [IcPlus.tsx](src/shared/ui/icons/IcPlus.tsx) - stroke를 `currentColor`로 변경 (CSS 색상 오버라이드 가능)
- [IconButton.tsx](src/shared/ui/icon-button/IconButton.tsx) - 수정

#### 전역 설정

- [queryClient.ts](src/app/providers/queryClient.ts) - 글로벌 `retry: false` 추가 (queries + mutations)
- [auth.queries.ts](src/features/auth/api/auth.queries.ts) - 개별 retry: false 제거 (글로벌 설정으로 통합)
- [auth/schema.ts](src/features/auth/model/schema.ts) - teamName regex에 .trim() + 공백 허용

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed (tsc --noEmit)
- [x] Lint: Passed (biome check)

### Deviations from Plan

**Note**: task-init이 완료되지 않아 공식 계획 문서가 생성되지 않았습니다. 사용자와 실시간 대화를 통해 요구사항을 수집하고 구현했습니다.

**Skipped**:
- Header 리디자인 (MainHeader.tsx 미작업)
- ErrorBoundary / Suspense boundary 추가 (useSuspenseQuery용)
- 서버 에러 → setError 처리 (설계 단계에서 중단)

### Performance Impact

- 번들 사이즈: -256 lines (코드 삭감)
- SidebarTeamItem에서 DropdownMenu, 이름 수정 관련 코드 대폭 제거
- JoinTeamDialog 전체 삭제

### Follow-up Tasks

- [ ] MainHeader.tsx 리디자인
- [ ] Suspense boundary 추가 (useSuspenseQuery를 위한 부모 Suspense)
- [ ] ErrorBoundary 추가 (SidebarTeamList 에러 처리)
- [ ] CreateTeamForm 서버 에러 → setError 방식 구현
