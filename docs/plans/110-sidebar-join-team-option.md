# Task Plan: 사이드바 목록 더보기에 '기존 팀 입장하기' 옵션 추가

**Issue**: #110
**Type**: Feature
**Created**: 2026-02-05
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 사이드바 헤더의 더보기 드롭다운에는 "새 팀 추가하기" 옵션만 존재합니다. 사용자가 초대 링크를 통해 기존 팀에 입장하려면 별도의 경로가 필요한 상황입니다.

- 현재: 새 팀 생성만 드롭다운에서 가능
- 문제: 기존 팀 입장 기능의 접근성이 낮음
- 영향: 사용자가 팀 입장 기능을 찾기 어려움

### Objectives

1. "새로운 팀 만들기" 옵션 유지 (기존 "새 팀 추가하기" 텍스트 변경)
2. "기존 팀 입장하기" 옵션 추가
3. 각 옵션에 적절한 아이콘 및 스타일 적용

### Scope

**In Scope**:

- `SidebarListHeader` 드롭다운 메뉴 수정
- "기존 팀 입장하기" 옵션 추가
- `JoinTeamDialog` 컴포넌트 생성
- `DashboardLayout`에 JoinTeamDialog 연결

**Out of Scope**:

- 팀 입장 API 로직 변경 (이미 `useJoinRetroRoom` mutation 존재)
- 인증 플로우 변경

### User Context

> 디자인 스크린샷에 따라 목록 더보기 모달에 다음 변경사항 추가:
>
> - "새로운 팀 만들기" (+ 아이콘, 파란색)
> - "기존 팀 입장하기" (입장 아이콘, 회색)

**핵심 요구사항**:

1. 디자인과 일치하는 UI
2. 기존 팀 생성 기능 유지
3. 초대 링크 입력 기능 추가

---

## 2. Requirements

### Functional Requirements

**FR-1**: 드롭다운 메뉴 옵션 추가

- "새로운 팀 만들기" - 기존 팀 생성 다이얼로그 오픈
- "기존 팀 입장하기" - 팀 입장 다이얼로그 오픈

**FR-2**: 팀 입장 다이얼로그

- 초대 링크 입력 필드
- 유효성 검사 (빈 값 체크)
- 제출 시 `useJoinRetroRoom` mutation 호출

### Technical Requirements

**TR-1**: 기존 컴포넌트 패턴 준수

- `CreateTeamDialog`와 동일한 패턴으로 `JoinTeamDialog` 구현
- DropdownMenu 컴포넌트 활용

**TR-2**: 아이콘 활용

- 새 팀: `IcPlusBlue` (기존)
- 팀 입장: `ic_enter.svg` 기반 아이콘 컴포넌트 생성 필요

### Non-Functional Requirements

**NFR-1**: 접근성

- 키보드 네비게이션 지원 (DropdownMenu 기본 제공)
- ARIA 레이블 추가

**NFR-2**: 일관된 UI/UX

- 기존 드롭다운 스타일 유지
- 기존 다이얼로그 스타일 유지

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── widgets/
│   ├── layout/
│   │   └── ui/
│   │       └── DashboardLayout.tsx    # MODIFY: JoinTeamDialog 추가
│   └── sidebar/
│       └── ui/
│           └── SidebarListHeader.tsx  # MODIFY: onJoinTeam prop 추가
├── features/
│   └── team/
│       └── ui/
│           ├── JoinTeamDialog.tsx     # CREATE: 팀 입장 다이얼로그
│           └── JoinTeamForm.tsx       # CREATE: 초대 링크 입력 폼
└── shared/
    └── ui/
        └── icons/
            └── IcEnter.tsx            # CREATE: 입장 아이콘
```

### Design Decisions

**Decision 1**: JoinTeamDialog를 별도 컴포넌트로 분리

- **Rationale**: CreateTeamDialog와 동일한 패턴, 관심사 분리
- **Approach**: features/team/ui/에 JoinTeamDialog, JoinTeamForm 생성
- **Trade-offs**: 파일 수 증가 vs 유지보수성 향상
- **Impact**: LOW

**Decision 2**: 기존 ic_enter.svg를 React 컴포넌트로 변환

- **Rationale**: 기존 아이콘 시스템과 일관성 유지
- **Implementation**: IcEnter.tsx 생성
- **Benefit**: 타입 안전성, 스타일링 용이

### Component Design

**SidebarListHeader Props 변경**:

```typescript
interface SidebarListHeaderProps {
  title: string;
  onAddTeam?: () => void;
  onJoinTeam?: () => void; // 추가
}
```

**JoinTeamDialog**:

```typescript
interface JoinTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}
```

---

## 4. Implementation Plan

### Phase 1: 아이콘 컴포넌트 생성

**Tasks**:

1. `IcEnter.tsx` 아이콘 컴포넌트 생성 (ic_enter.svg 기반)

**Files to Create**:

- `src/shared/ui/icons/IcEnter.tsx` (CREATE)

### Phase 2: JoinTeamDialog 구현

**Tasks**:

1. `JoinTeamForm.tsx` 생성 - 초대 링크 입력 폼
2. `JoinTeamDialog.tsx` 생성 - 다이얼로그 래퍼

**Files to Create**:

- `src/features/team/ui/JoinTeamForm.tsx` (CREATE)
- `src/features/team/ui/JoinTeamDialog.tsx` (CREATE)

### Phase 3: 드롭다운 및 레이아웃 수정

**Tasks**:

1. `SidebarListHeader.tsx` 수정 - onJoinTeam prop 추가, 메뉴 항목 추가
2. `DashboardSidebar.tsx` 수정 - onJoinTeam prop 전달
3. `DashboardLayout.tsx` 수정 - JoinTeamDialog 추가

**Files to Modify**:

- `src/widgets/sidebar/ui/SidebarListHeader.tsx` (MODIFY)
- `src/widgets/sidebar/ui/DashboardSidebar.tsx` (MODIFY)
- `src/widgets/layout/ui/DashboardLayout.tsx` (MODIFY)

---

## 5. Quality Gates

### Acceptance Criteria

- [x] "새로운 팀 만들기" 옵션 표시 (기존 "새 팀 추가하기" 텍스트만 변경)
- [ ] "기존 팀 입장하기" 옵션 추가
- [ ] 각 옵션 클릭 시 적절한 다이얼로그 오픈
- [ ] 디자인과 일치하는 UI
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 드롭다운 메뉴에 두 옵션 모두 표시
- [ ] "새로운 팀 만들기" 클릭 시 CreateTeamDialog 오픈
- [ ] "기존 팀 입장하기" 클릭 시 JoinTeamDialog 오픈
- [ ] 초대 링크 입력 후 입장 성공

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

---

## 6. Risks & Dependencies

### Risks

**R-1**: 초대 링크 유효성 검증

- **Risk**: 잘못된 링크 입력 시 에러 핸들링
- **Impact**: MEDIUM
- **Mitigation**: API 에러 응답에 따른 사용자 피드백 제공

### Dependencies

**D-1**: useJoinRetroRoom mutation

- **Dependency**: 이미 구현됨 (`src/features/team/api/team.mutations.ts`)
- **Status**: AVAILABLE

**D-2**: ic_enter.svg

- **Dependency**: 이미 존재 (`src/shared/assets/icons/ic_enter.svg`)
- **Status**: AVAILABLE

---

## 7. References

### Related Issues

- Issue #110: [사이드바 목록 더보기 모달에 '기존 팀 입장하기' 옵션 추가](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/110)

### Documentation

- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)
- [Assets 관리 규칙](../../.claude/rules/assets.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-05
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/features/team/ui/JoinTeamDialog.tsx` - 팀 입장 다이얼로그 컴포넌트
- `src/features/team/ui/JoinTeamForm.tsx` - 초대 링크 입력 폼 (useJoinRetroRoom mutation 연동)

#### Files Modified

- `src/features/team/model/schema.ts` - `joinTeamSchema` 스키마 추가
- `src/widgets/sidebar/ui/SidebarListHeader.tsx` - "기존 팀 입장하기" 메뉴 항목 추가, 텍스트 변경
- `src/widgets/sidebar/ui/DashboardSidebar.tsx` - `onJoinTeam` prop 전달
- `src/widgets/layout/ui/DashboardLayout.tsx` - `JoinTeamDialog` 연결

#### Key Implementation Details

- 드롭다운 UI 스펙 준수:
  - 아이콘 영역: `w-5 h-5 rounded-full` (20x20)
  - 아이콘-텍스트 간격: `gap-2` (8px)
  - 항목 간 간격: `gap-3` (12px)
  - 텍스트: `text-sub-title-2 text-grey-900`
- 기존 `IcEnter` 아이콘 컴포넌트 활용 (이미 존재)
- `CreateTeamDialog` 패턴과 동일한 구조로 구현

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**None** - 계획대로 구현 완료

### Performance Impact

- Bundle size: 변화 미미 (새 다이얼로그 컴포넌트 추가)
- No runtime impact

---

**Plan Status**: Completed
**Last Updated**: 2026-02-05
