# Task Plan: Sidebar 추가 기능 구현

**Issue**: #70
**Type**: Feature
**Created**: 2026-02-01
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 Sidebar 기본 구조(DashboardSidebar, SidebarTeamList, SidebarTeamItem)는 구현되어 있으나, 팀 관리 기능이 부족합니다.

- SidebarListHeader의 미트볼 아이콘이 동작하지 않음
- 팀 나가기 기능이 없음
- 팀 생성/참여 후 자동 갱신은 이미 구현됨 (invalidateQueries)

### Objectives

1. SidebarListHeader에 드롭다운 메뉴 추가 (팀 생성, 팀 참여)
2. 팀 나가기 mutation 추가 및 Sidebar 연동
3. (선택) 모바일 반응형 Sidebar 토글

### Scope

**In Scope**:

- Radix UI Dropdown Menu 설치 및 적용
- SidebarListHeader 드롭다운 메뉴 구현
- 팀 나가기 mutation 추가 (useLeaveRetroRoom)
- 팀 생성/참여 모달 또는 네비게이션 연동

**Out of Scope**:

- 팀 삭제 기능 (관리자 권한 필요, 별도 이슈)
- 모바일 반응형 (선택사항, 시간 여유 시 추가)

---

## 2. Requirements

### Functional Requirements

**FR-1**: SidebarListHeader 드롭다운 메뉴

- 미트볼 아이콘 클릭 시 드롭다운 메뉴 표시
- 메뉴 항목: "새 팀 생성", "팀 참여하기"
- 클릭 시 해당 기능 수행 (모달 또는 라우팅)

**FR-2**: 팀 나가기 기능

- SidebarTeamItem에 팀 나가기 옵션 추가 (hover 시 표시 또는 컨텍스트 메뉴)
- 확인 모달 후 팀 나가기 API 호출
- 성공 시 목록에서 자동 제거

### Technical Requirements

**TR-1**: Radix UI Dropdown Menu

- `@radix-ui/react-dropdown-menu` 패키지 설치
- 접근성(a11y) 지원
- 키보드 네비게이션 지원

**TR-2**: React Query Invalidation

- 팀 나가기 성공 시 `queryClient.invalidateQueries({ queryKey: ['retroRooms'] })`
- 기존 create/join mutation과 동일한 패턴

### Non-Functional Requirements

**NFR-1**: 접근성

- 드롭다운 메뉴 키보드 탐색 지원
- ARIA 레이블 적용

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── widgets/
│   └── sidebar/
│       └── ui/
│           ├── DashboardSidebar.tsx      # (기존)
│           ├── SidebarListHeader.tsx     # (수정) 드롭다운 추가
│           ├── SidebarTeamList.tsx       # (기존)
│           └── SidebarTeamItem.tsx       # (수정) 팀 나가기 추가
├── features/
│   └── team/
│       └── api/
│           └── team.mutations.ts         # (수정) useLeaveRetroRoom 추가
└── shared/
    └── ui/
        └── dropdown-menu/
            └── DropdownMenu.tsx          # (신규) Radix 래퍼 컴포넌트
```

### Design Decisions

**Decision 1**: Radix UI Dropdown Menu 사용

- **Rationale**: 접근성(a11y) 완벽 지원, 키보드 네비게이션 내장
- **Approach**: Radix primitive를 래핑한 공용 컴포넌트 생성
- **Trade-offs**: 번들 크기 증가 (~10KB gzipped) vs 접근성 보장
- **Alternatives Considered**: 직접 구현 (접근성 구현 복잡), Headless UI (React 19 호환성 미확인)

**Decision 2**: 팀 나가기 UI

- **Rationale**: 실수로 나가기 방지
- **Approach**: SidebarTeamItem hover 시 나가기 버튼 표시 + 확인 Dialog
- **Benefit**: 명확한 UX, 실수 방지

### Component Design

**SidebarListHeader with Dropdown**:

```typescript
function SidebarListHeader({ title }: SidebarListHeaderProps) {
  return (
    <div className="...">
      <span>{title}</span>
      <DropdownMenu>
        <DropdownMenu.Trigger>
          <IcMeatball />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={handleCreateTeam}>
            새 팀 생성
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={handleJoinTeam}>
            팀 참여하기
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}
```

**SidebarTeamItem with Leave**:

```typescript
function SidebarTeamItem({ team, isActive }: SidebarTeamItemProps) {
  const [showLeaveButton, setShowLeaveButton] = useState(false);
  const leaveTeamMutation = useLeaveRetroRoom();

  const handleLeave = () => {
    if (confirm("팀에서 나가시겠습니까?")) {
      leaveTeamMutation.mutate({ retroRoomId: team.retroRoomId });
    }
  };

  return (
    <li
      onMouseEnter={() => setShowLeaveButton(true)}
      onMouseLeave={() => setShowLeaveButton(false)}
    >
      <Link to={`/teams/${team.retroRoomId}`}>...</Link>
      {showLeaveButton && <button onClick={handleLeave}>나가기</button>}
    </li>
  );
}
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. `@radix-ui/react-dropdown-menu` 패키지 설치
2. `shared/ui/dropdown-menu/DropdownMenu.tsx` 래퍼 컴포넌트 생성

**Files to Create/Modify**:

- `package.json` (MODIFY) - 의존성 추가
- `src/shared/ui/dropdown-menu/DropdownMenu.tsx` (CREATE)

### Phase 2: Core Implementation

**Tasks**:

1. SidebarListHeader에 드롭다운 메뉴 적용
2. useLeaveRetroRoom mutation 추가
3. SidebarTeamItem에 팀 나가기 기능 추가

**Files to Create/Modify**:

- `src/widgets/sidebar/ui/SidebarListHeader.tsx` (MODIFY)
- `src/features/team/api/team.mutations.ts` (MODIFY)
- `src/widgets/sidebar/ui/SidebarTeamItem.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Polish & Optimization

**Tasks**:

1. 스타일 정리 (Tailwind 클래스)
2. 접근성 검증 (키보드 네비게이션)
3. 빌드 검증

**Files to Create/Modify**:

- 스타일 조정 필요 시 해당 컴포넌트

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] 팀 생성/삭제 시 queryClient.invalidateQueries 연동 (이미 구현됨)
- [ ] SidebarListHeader 드롭다운 메뉴 구현
- [ ] 팀 나가기 기능 구현
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 미트볼 아이콘 클릭 시 드롭다운 메뉴 표시
- [ ] "새 팀 생성" 클릭 시 동작
- [ ] "팀 참여하기" 클릭 시 동작
- [ ] 팀 나가기 버튼 hover 시 표시
- [ ] 팀 나가기 성공 시 목록에서 제거

**접근성**:

- [ ] 키보드로 드롭다운 탐색 가능 (Tab, Enter, Escape)
- [ ] 스크린 리더 지원

---

## 6. Risks & Dependencies

### Risks

**R-1**: API 미구현

- **Risk**: 팀 나가기 API가 백엔드에 없을 수 있음
- **Impact**: MEDIUM
- **Mitigation**: API 스펙 확인, 없으면 임시 주석 처리 후 follow-up 이슈

### Dependencies

**D-1**: @radix-ui/react-dropdown-menu

- **Dependency**: npm 패키지 설치 필요
- **Required For**: 드롭다운 메뉴 구현
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

- PR 머지 후 자동 배포 (Vercel)
- 별도 feature flag 불필요

### Success Metrics

**SM-1**: 드롭다운 메뉴 동작

- **Metric**: 정상 동작 여부
- **Target**: 100% 동작
- **Measurement**: 수동 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: 드롭다운 컴포넌트 생성

- Radix UI 설치 및 래퍼 컴포넌트 생성
- **Status**: NOT_STARTED

**M2**: SidebarListHeader 드롭다운 적용

- 드롭다운 메뉴 UI 완성
- **Status**: NOT_STARTED

**M3**: 팀 나가기 기능

- mutation 추가 및 UI 연동
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #70: [Sidebar 추가 기능 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/70)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [Radix UI Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-02-01
**Next Action**: Phase 1 시작 - Radix UI 설치
