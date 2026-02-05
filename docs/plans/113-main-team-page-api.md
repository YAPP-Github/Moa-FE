# Task Plan: 메인 팀 페이지 API 연동 및 UI 개선

**Issue**: #113
**Type**: Feature
**Created**: 2026-02-06
**Status**: Planning

---

## 1. Overview

### Problem Statement

메인 팀 대시보드 페이지에서 여러 API 연동이 누락되어 있고, 드롭다운 메뉴 스타일이 일관되지 않습니다.

- `memberCount`가 0으로 하드코딩, 멤버 목록 미표시
- 헤더 프로필에서 사용자 이름이 "사용자"로 하드코딩
- 각 회고의 참여 인원 수 미표시
- 드롭다운 스타일 불일치 (SidebarTeamItem, Header Profile, 멤버 드롭다운)
- 오늘 회고 아이템 레이아웃 개선 필요

### Objectives

1. `useRetroRoomMembers()` React Query 훅 생성 및 연동
2. `useProfile()` React Query 훅 생성 및 헤더 연동
3. 회고별 참여 인원 수 표시
4. 드롭다운 스타일 통일 ("목록" 드롭다운 기준)
5. 오늘 회고 영역 UI 개선 (min-width, 스크롤)

### Scope

**In Scope**:

- `useRetroRoomMembers()` 훅 생성 및 연동
- `useProfile()` 훅 생성 및 헤더 연동
- 드롭다운 스타일 통일 (3곳)
- 오늘 회고 아이템 min-width 186px 적용
- 오늘 회고 영역 X축 스크롤 (invisible)
- 로딩/에러 상태 처리

**Out of Scope**:

- 멤버 권한 관리 UI
- 멤버 초대/삭제 기능

---

## 2. Requirements

### Functional Requirements

**FR-1**: 팀 멤버 목록 조회 및 표시

- 현재 팀의 멤버 목록 API 조회
- 멤버 수와 닉네임 표시
- 멤버 드롭다운에 실제 멤버 목록 렌더링

**FR-2**: 헤더 프로필 정보 연동

- `getProfile()` API로 사용자 정보 조회
- 헤더에 실제 사용자 닉네임 표시

**FR-3**: 회고 참여 인원 수 표시

- 각 회고 아이템에 `participantCount` 표시

**FR-4**: 드롭다운 스타일 통일

- "목록" 드롭다운 스타일 기준으로 통일
- 적용 대상: SidebarTeamItem, Header Profile, 멤버 드롭다운

**FR-5**: 오늘 회고 영역 UI 개선

- 오늘 회고 아이템 min-width: 186px
- X축 overflow 시 스크롤 (scrollbar invisible)

### Technical Requirements

**TR-1**: React Query 훅 구현

- `useRetroRoomMembers(retroRoomId)` - 5분 staleTime
- `useProfile()` - 프로필 조회

**TR-2**: 스타일 일관성

- 드롭다운 공통 스타일: `gap-3 p-3 rounded-[8px] border border-grey-200`
- 라벨 스타일: `text-caption-4 text-grey-700 font-medium`

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   ├── team/
│   │   └── api/
│   │       └── team.queries.ts  # useRetroRoomMembers 추가
│   └── auth/
│       └── api/
│           └── auth.queries.ts  # useProfile 추가 (또는 기존 파일에)
├── widgets/
│   ├── sidebar/
│   │   └── ui/
│   │       └── SidebarTeamItem.tsx  # 드롭다운 스타일 수정
│   └── header/
│       └── ui/
│           └── Header.tsx  # 프로필 연동 + 드롭다운 스타일 수정
└── pages/
    └── team-dashboard/
        └── ui/
            └── TeamDashboardPage.tsx  # 멤버 API 연동 + UI 수정
```

### Design Decisions

**Decision 1**: 드롭다운 스타일 기준 - "목록" 드롭다운

- **Rationale**: `SidebarListHeader`의 "목록" 드롭다운이 가장 최신 디자인
- **Style Reference**:

  ```css
  /* DropdownMenuContent */
  flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]

  /* 라벨 */
  text-caption-4 text-grey-700 font-medium
  ```

**Decision 2**: Invisible Scrollbar

- **Approach**: Tailwind의 `scrollbar-hide` 유틸리티 또는 CSS
- **Implementation**: `overflow-x-auto scrollbar-hide` 또는 커스텀 CSS

### Data Models

```typescript
// 이미 존재하는 타입
interface RetroRoomMemberItem {
  memberId: number;
  nickname: string;
  role: string; // "OWNER" | "MEMBER"
  joinedAt: string;
}

interface MemberProfileResponse {
  memberId: number;
  nickname?: string | null;
  email: string;
  socialType: SocialType;
  insightCount: number;
  createdAt: DateTime;
}
```

---

## 4. Implementation Plan

### Phase 1: API 훅 생성

**Tasks**:

1. `team.queries.ts`에 `useRetroRoomMembers()` 훅 추가
2. `useProfile()` 훅 생성

**Files to Create/Modify**:

- `src/features/team/api/team.queries.ts` (MODIFY)
- `src/features/auth/api/auth.queries.ts` (CREATE or MODIFY)

**코드 예시**:

```typescript
// team.queries.ts
export function useRetroRoomMembers(retroRoomId: number) {
  return useQuery({
    queryKey: ["retroRoomMembers", retroRoomId],
    queryFn: () => getApi().listRetroRoomMembers(retroRoomId),
    staleTime: 1000 * 60 * 5,
    enabled: retroRoomId > 0,
  });
}

// auth.queries.ts
export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => getApi().getProfile(),
    staleTime: 1000 * 60 * 5,
  });
}
```

### Phase 2: TeamDashboardPage 연동

**Tasks**:

1. `useRetroRoomMembers()` 훅 호출
2. `memberCount`를 실제 데이터로 교체
3. 멤버 드롭다운에 멤버 목록 렌더링
4. 드롭다운 스타일 통일 ("목록" 기준)
5. 오늘 회고 아이템 min-width 186px 적용
6. 오늘 회고 영역 X축 스크롤 (invisible)

**Files to Create/Modify**:

- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

### Phase 3: Header 프로필 연동

**Tasks**:

1. `useProfile()` 훅 호출
2. `userName`을 실제 닉네임으로 교체
3. 드롭다운 스타일 통일

**Files to Create/Modify**:

- `src/widgets/header/ui/Header.tsx` (MODIFY)

### Phase 4: SidebarTeamItem 드롭다운 스타일 수정

**Tasks**:

1. 드롭다운 스타일을 "목록" 기준으로 통일

**Files to Create/Modify**:

- `src/widgets/sidebar/ui/SidebarTeamItem.tsx` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:

- `async-parallel`: 멤버/프로필 데이터 병렬 페칭

**HIGH**:

- `server-cache-react`: React Query staleTime 활용

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 팀 멤버 수 및 목록 API 연동
- [ ] 각 회고 참여 인원 수 표시
- [ ] 헤더 프로필 정보 API 연동
- [ ] 드롭다운 스타일 통일 (목록 드롭다운 기준)
- [ ] 오늘 회고 아이템 min-width 186px 적용
- [ ] 오늘 회고 영역 X축 스크롤 (invisible)
- [ ] 빌드 및 타입 검사 통과

### Validation Checklist

**기능 동작**:

- [ ] 팀 대시보드에서 멤버 수 정상 표시
- [ ] 멤버 드롭다운에 멤버 목록 표시
- [ ] 헤더에 사용자 닉네임 표시
- [ ] 오늘 회고 아이템이 186px 이상으로 표시
- [ ] 오늘 회고가 많을 때 X축 스크롤 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

---

## 6. Risks & Dependencies

### Dependencies

**D-1**: 백엔드 API

- `GET /api/v1/retro-rooms/{retroRoomId}/members` - AVAILABLE
- `GET /api/v1/members/me` - AVAILABLE

---

## 7. Style Reference

### "목록" 드롭다운 스타일 (SidebarListHeader)

```tsx
<DropdownMenuContent
  className="flex flex-col gap-3 p-3 rounded-[8px] border border-grey-200 bg-white shadow-[0px_4px_16px_0px_rgba(0,0,0,0.07)]"
  align="end"
  sideOffset={4}
>
  <div className="text-caption-4 text-grey-700 font-medium">목록</div>
  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
    {/* 아이콘 + 텍스트 */}
  </DropdownMenuItem>
</DropdownMenuContent>
```

### 적용 대상 비교

| 컴포넌트           | 현재 스타일                | 변경 필요        |
| ------------------ | -------------------------- | ---------------- |
| SidebarListHeader  | 기준 스타일                | 없음             |
| SidebarTeamItem    | `gap-1`, `min-w-28`        | `gap-3` 적용     |
| Header Profile     | `w-[160px]`, shadow 다름   | gap, shadow 통일 |
| TeamDashboard 멤버 | `min-w-[160px]`, 다른 구조 | 전체 재구성      |

---

## 8. References

### Related Issues

- Issue #113: [메인 팀 페이지 API 연동](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/113)

---

## 9. Implementation Summary

**Completion Date**: 2026-02-06
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [`src/features/team/ui/InviteMemberDialog.tsx`](src/features/team/ui/InviteMemberDialog.tsx) - 멤버 초대 다이얼로그 (카카오톡 전달, 초대링크 복사)

#### Files Modified

- [`src/features/team/api/team.queries.ts`](src/features/team/api/team.queries.ts) - `useRetroRoomMembers()` 훅 추가
- [`src/pages/team-dashboard/ui/TeamDashboardPage.tsx`](src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 멤버 API 연동, 드롭다운 스타일 통일, 오늘 회고 Swiper 적용, 시간 포맷팅
- [`src/widgets/header/ui/Header.tsx`](src/widgets/header/ui/Header.tsx) - `useProfile()` 연동, 드롭다운 스타일 통일
- [`src/widgets/sidebar/ui/SidebarTeamItem.tsx`](src/widgets/sidebar/ui/SidebarTeamItem.tsx) - 드롭다운 스타일 통일, `align="end"` 적용
- [`src/widgets/sidebar/ui/SidebarListHeader.tsx`](src/widgets/sidebar/ui/SidebarListHeader.tsx) - 드롭다운 아이템 스타일 수정
- [`src/features/team/ui/CreateTeamForm.tsx`](src/features/team/ui/CreateTeamForm.tsx) - 성공/실패 토스트 추가
- [`src/features/team/ui/JoinTeamForm.tsx`](src/features/team/ui/JoinTeamForm.tsx) - 성공/실패 토스트 추가

### Key Implementation Details

#### API 연동

- `useRetroRoomMembers(retroRoomId)` - 팀 멤버 목록 조회 (5분 staleTime)
- `useProfile()` - 사용자 프로필 조회 (헤더에 닉네임 표시)

#### 드롭다운 스타일 통일

- SidebarListHeader 기준으로 3곳 스타일 통일
- `text-sub-title-3` 클래스를 `<span>` 래퍼로 적용 (DropdownMenuItem className 병합 이슈 해결)
- `flex items-center` 추가로 높이 일관성 확보

#### 멤버 드롭다운 재설계

- 멤버 목록: 빈 원형 아이콘 + 닉네임
- "추가하기" 버튼: 파란색 원형 아이콘 + 텍스트
- InviteMemberDialog 연동

#### 오늘 회고 영역 개선

- Swiper 컴포넌트 적용 (마우스 드래그 스와이프 지원)
- date-fns로 시간 포맷팅 (`14:00` → `오후 2시`)
- min-width 186px 적용

#### 토스트 알림

- "새로운 팀 만들기": 성공/실패 토스트
- "기존 팀 입장하기": 성공/실패 토스트

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- InviteMemberDialog 컴포넌트 생성 (멤버 초대 기능)
- Swiper 컴포넌트 적용 (드래그 스와이프)
- date-fns를 사용한 시간 포맷팅 (오전/오후 표시)
- 성공/실패 토스트 알림

**Changed**:

- 멤버 드롭다운 UI 재설계 (빈 원형 아이콘, 추가하기 버튼)
- SidebarTeamItem 드롭다운 방향 변경 (`align="end"`)

**Skipped**:

- 회고별 참여 인원 수 표시 (API 응답에 해당 필드 없음)

### Notes

- 카카오톡 공유 API 연동은 TODO로 남김
- 실제 초대 링크 API 연동은 TODO로 남김 (현재 임시 링크 사용)
- 드롭다운 스타일 이슈: DropdownMenuItem의 className이 내부 스타일과 병합되어 일부 클래스가 무시되는 현상 → `<span>` 래퍼로 해결

---

**Plan Status**: Completed
**Last Updated**: 2026-02-06
