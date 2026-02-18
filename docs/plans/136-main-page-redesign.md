# #136 메인 페이지 리디자인 - 팀 대시보드 API 연동 및 FSD 아키텍처 점검

## Overview

팀 대시보드 페이지의 API 연동(초대 코드 조회, 팀 이름 수정 스키마 수정)과
FSD 아키텍처 컨벤션 위반 사항을 점검 및 수정하는 리팩토링 작업.

## Requirements

- **FR-1**: 초대 링크 다이얼로그에 GET 초대 코드 API 연동
- **FR-2**: 팀 이름 수정 후 200 OK 시 Zod 스키마 불일치 수정
- **FR-3**: 회고 추가하기 / 팀 나가기 다이얼로그 연동
- **TR-1**: FSD 아키텍처 cross-slice 위반 수정
- **TR-2**: Widget 비즈니스 로직을 features 레이어로 추출

---

## Implementation Summary

**Completion Date**: 2026-02-19
**Implemented By**: Claude Opus 4.6

### Changes Made

#### API 연동

- `features/team/model/schema.ts` - `inviteCodeResponseSchema`, `updateRetroRoomNameResultSchema` 추가
- `features/team/api/team.api.ts` - `getInviteCode()` API 함수 추가
- `features/team/api/team.queries.ts` - `useInviteCode` 쿼리 훅 추가
- `features/team/ui/InviteMemberDialog.tsx` - `useInviteCode` 연동 (다이얼로그 open 시만 fetch)

#### Zod 스키마 수정

- `features/team/model/schema.ts` - `updateRetroRoomNameResponseSchema`를 `z.null()` → 실제 응답 객체 스키마로 수정

#### 다이얼로그 연동

- `pages/team-dashboard/ui/DashboardHeader.tsx` - 신규 (회고 추가하기 + 팀 나가기 다이얼로그 조립)
- `features/retrospective/ui/CreateRetrospectDialog.tsx` - `teamName` prop 추가
- `features/retrospective/ui/CreateRetrospectForm.tsx` - `teamName` prop으로 변경, `useRetroRooms` 제거

#### FSD 아키텍처 수정

**Cross-slice 참조 제거:**
- `features/auth/ui/forms/OnboardingForm.tsx` - `features/team` import 제거 → `onCreateTeam`/`onJoinTeam` 콜백 props
- `pages/onboarding/ui/OnboardingPage.tsx` - team mutations를 페이지에서 제공
- `features/retrospective/ui/CreateRetrospectForm.tsx` - `features/team` import 제거 → `teamName` prop

**Widget 비즈니스 로직 추출:**
- `features/auth/ui/ProfileDropdown.tsx` - 신규 (profile query + logout/withdraw mutation)
- `widgets/header/ui/MainHeader.tsx` - 비즈니스 로직 제거 → ProfileDropdown 조합만

**컴포넌트 위치 이동 (pages → features/team):**
- `TeamName.tsx` - mutation 사용 → features/team/ui/
- `TeamMemberList.tsx` - query 사용 → features/team/ui/
- `TeamMemberDropdown.tsx` - feature 조합 → features/team/ui/

#### 빌드 에러 수정

- `app/App.tsx` - 미사용 `PlainLayout` import 제거
- `features/retrospective/ui/RetrospectSection.tsx` - 삭제된 `RetrospectEmptyState` 참조를 인라인 대체
- `shared/api/generated/index.ts` - 누락된 `DateTime`, `CurrentUserStatus` 타입 추가

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:
- 빌드 에러 수정 (기존 브랜치에서 발생한 에러)
- generated 파일에 누락 타입 추가

**Skipped**:
- `generated` 직접 import 제거 (14개 파일) - 사용자 요청으로 별도 작업
- `RetrospectiveDetailPanel` widget 리팩토링 - 790줄+ 대규모 작업으로 별도 이슈 권장

### Follow-up Tasks

- [ ] `@/shared/api/generated` 직접 import를 도메인 `model/schema.ts`로 이관 (14개 파일)
- [ ] `RetrospectiveDetailPanel` widget을 features 레이어로 리팩토링
- [ ] 팀 나가기(leave) 전용 API 연동 (현재 deleteRetroRoom 사용 중)
- [ ] 백엔드 OpenAPI 스펙에서 `DateTime`, `CurrentUserStatus` 타입 정의 수정
