# Task Plan: 홈 페이지 회고 카드 더보기(⋯) 메뉴 - 링크 복사 & 삭제하기

**Issue**: #153
**Type**: Feature
**Created**: 2026-02-24
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 회고 카드의 `CardMenu`에 "내보내기"와 "삭제하기" 메뉴가 있지만, 기획 논의 결과 "내보내기"를 제거하고 "링크 복사"를 추가해야 합니다. 또한 삭제 시 확인 다이얼로그 없이 바로 삭제되는 문제가 있습니다.

### Objectives

1. CardMenu를 "링크 복사" + "삭제하기"로 변경
2. 링크 복사 시 해당 회고 접근 URL을 클립보드에 복사 + 토스트 알림
3. 삭제하기 시 확인 다이얼로그를 표시한 후 삭제 실행

### Scope

**In Scope**:
- CardMenu에서 "내보내기" 제거, "링크 복사" 추가
- 링크 복사 기능 (클립보드 복사 + 토스트)
- 삭제 확인 다이얼로그 추가
- 삭제 성공/실패 토스트

**Out of Scope**:
- 내보내기 기능
- 회고 삭제 API 변경 (이미 존재)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 링크 복사
- 메뉴에서 "링크 복사" 클릭 시 해당 회고 접근 URL을 클립보드에 복사
- 진행중/임시저장: `/teams/{teamId}/retrospects/{retrospectId}/write`
- 종료: `/teams/{teamId}/retrospects/{retrospectId}`
- 성공 토스트: "링크가 복사되었습니다."
- 실패 토스트: "링크 복사에 실패했습니다."

**FR-2**: 삭제하기
- 메뉴에서 "삭제하기" 클릭 시 확인 다이얼로그 표시
- 다이얼로그에서 확인 시 삭제 API 호출
- 삭제 성공 시 토스트 + 카드 목록 갱신
- 삭제 실패 시 에러 토스트 (글로벌 핸들러)

### Technical Requirements

**TR-1**: 기존 `useDeleteRetrospect` mutation 재사용
**TR-2**: 기존 Dialog 컴포넌트 활용 (LeaveTeamModal 패턴 참조)
**TR-3**: `useExportRetrospect` import 제거

---

## 3. Architecture & Design

### Design Decisions

**Decision 1**: 삭제 확인 다이얼로그를 CardMenu 내부에서 state로 관리

- **Rationale**: 각 카드가 독립적으로 다이얼로그를 관리해야 함
- **Approach**: `CardMenu` 컴포넌트에 `deleteDialogOpen` state 추가, DropdownMenuItem 클릭 시 열기
- **Trade-offs**: 컴포넌트가 약간 커지지만, 외부 state 불필요

**Decision 2**: 링크 복사 URL 생성 시 카드 상태에 따라 분기

- **Rationale**: 진행중/임시저장은 `/write` 경로, 종료는 상세 페이지 경로
- **Approach**: `CardMenu`에 `status`와 `teamId` prop 추가

### Component Design

```typescript
interface CardMenuProps {
  title: string;
  retrospectId: number;
  teamId: number;
  status: string; // RetrospectListStatus
}

function CardMenu({ title, retrospectId, teamId, status }: CardMenuProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 링크 복사: status에 따라 URL 분기
  const handleCopyLink = async () => { ... };

  // 삭제: 다이얼로그 열기
  // 삭제 확인: mutation 호출
  const handleDeleteConfirm = () => { ... };

  return (
    <>
      <DropdownMenuRoot>...</DropdownMenuRoot>
      <DeleteRetrospectDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={title}
      />
    </>
  );
}
```

### Flow

```
⋯ 버튼 클릭 → DropdownMenu 열림
  ├─ "링크 복사" 클릭 → 클립보드 복사 → 토스트
  └─ "삭제하기" 클릭 → 다이얼로그 열림
       ├─ 취소 → 다이얼로그 닫힘
       └─ 확인 → DELETE API → 성공 토스트 + 목록 갱신
```

---

## 4. Implementation Plan

### Phase 1: CardMenu 수정

**Tasks**:
1. `CardMenu` props에 `teamId`, `status` 추가
2. "내보내기" 제거, "링크 복사" 추가
3. `useExportRetrospect` import 제거
4. 링크 복사 핸들러 구현 (status 기반 URL 분기)
5. `ActiveCard`, `CompletedCard`에서 `CardMenu`에 새 props 전달

**Files to Modify**:
- `src/features/retrospective/ui/RetrospectCard.tsx` (MODIFY)

### Phase 2: 삭제 확인 다이얼로그

**Tasks**:
1. `DeleteRetrospectDialog` 컴포넌트 생성 (같은 파일 내부 or 별도 파일)
2. LeaveTeamModal 패턴 참고하되, 체크박스 없이 간단한 확인/취소 형태
3. CardMenu에서 삭제 클릭 → 다이얼로그 open
4. 다이얼로그 확인 → `useDeleteRetrospect` mutation 호출 + 토스트

**Files to Create/Modify**:
- `src/features/retrospective/ui/DeleteRetrospectDialog.tsx` (CREATE)
- `src/features/retrospective/ui/RetrospectCard.tsx` (MODIFY)

### Phase 3: Quality Validation

```bash
pnpm run build
pnpm tsc --noEmit
pnpm run lint
```

---

## 5. Quality Gates

### Acceptance Criteria

- [ ] 모든 상태의 회고 카드에 더보기(⋯) 버튼이 표시된다
- [ ] 더보기 버튼 클릭 시 "링크 복사", "삭제하기" 메뉴가 표시된다
- [ ] 링크 복사 클릭 시 해당 회고 접근 URL이 클립보드에 복사된다
- [ ] 링크 복사 성공 시 토스트 알림이 표시된다
- [ ] 삭제하기 클릭 시 확인 다이얼로그가 표시된다
- [ ] 삭제 확인 후 회고가 삭제되고 목록이 업데이트된다
- [ ] 내보내기 메뉴가 제거되었다
- [ ] Build, Type check, Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: 클립보드 API 미지원 브라우저
- **Impact**: LOW
- **Mitigation**: try/catch로 실패 토스트 표시 (기존 패턴 동일)

### Dependencies

**D-1**: 기존 `useDeleteRetrospect` mutation — AVAILABLE
**D-2**: 기존 Dialog 컴포넌트 — AVAILABLE
**D-3**: 기존 Toast 시스템 — AVAILABLE

---

## 9. References

### Related Issues
- Issue #153: [홈 페이지 회고 카드 더보기(⋯) 메뉴 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/153)

### 참조 파일
- `src/features/retrospective/ui/RetrospectCard.tsx` — 현재 CardMenu 구현
- `src/features/team/ui/LeaveTeamModal.tsx` — 삭제 확인 다이얼로그 패턴
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` — 링크 복사/삭제 핸들러 참조

---

## 10. Implementation Summary

**Completion Date**: 2026-02-24
**Implemented By**: Claude Opus 4.6

### Changes Made

**Created Files**:
- `src/features/retrospective/ui/DeleteRetrospectDialog.tsx` — 삭제 확인 다이얼로그 (LeaveTeamModal 패턴 기반, 체크박스 없이 간단한 확인/취소)

**Modified Files**:
- `src/features/retrospective/ui/RetrospectCard.tsx` — CardMenu 리팩토링: 내보내기 → 링크 복사, 삭제 확인 다이얼로그 연동, props 확장 (teamId, status)

### Key Implementation Details

- `window.location.origin` 사용으로 로컬/프로덕션 환경 자동 대응
- 카드 상태별 URL 분기: COMPLETED → 상세 페이지, 그 외 → `/write` 페이지
- `useDeleteRetrospect` mutation 재사용, `isPending` 상태로 로딩 처리
- `useExportRetrospect` import 제거

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (218 files, no fixes)

### Deviations from Plan

없음 — 계획대로 구현 완료

### Performance Impact

- Bundle size: 변화 없음 (기존 Dialog/Toast 컴포넌트 재사용)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-24
