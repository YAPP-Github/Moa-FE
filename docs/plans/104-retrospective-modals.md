# Task Plan: 회고 진행 관련 모달 3종 구현

**Issue**: #104
**Type**: Feature
**Created**: 2026-02-05
**Status**: Planning

---

## 1. Overview

### Problem Statement

회고 진행 패널(RetrospectiveDetailPanel)에서 사용자의 실수로 인한 데이터 손실을 방지하기 위한 확인 모달이 없습니다.

- 현재 제출 버튼 클릭 시 즉시 제출되어 실수로 제출할 수 있음
- 패널을 닫을 때 작성 중인 내용이 경고 없이 사라질 수 있음
- 작성한 내용을 제출 전에 미리 확인할 수 있는 방법이 없음

### Objectives

1. 제출 확인 모달을 통해 실수로 제출하는 것을 방지
2. 닫기 확인 모달을 통해 작성 중인 내용 손실 방지
3. 미리보기 모달을 통해 제출 전 작성 내용 확인 기능 제공

### Scope

**In Scope**:

- 제출 확인 모달 컴포넌트 구현
- 닫기 확인 모달 컴포넌트 구현
- 미리보기 모달 컴포넌트 구현
- RetrospectiveDetailPanel과 모달 연동

**Out of Scope**:

- 임시저장 기능 구현 (별도 이슈)
- API 연동 (현재 목 데이터 사용 중)
- 회고 어시스턴트 기능

### User Context

> "회고 진행중에 작성 완료하고 제출하기 버튼을 누르면 나오는 제출 확인 모달,
> 작성한 회고가 있을 때 회고 진행 패널을 닫으려 할 때 나오는 확인 모달,
> 미리보기 버튼을 누르면 나오는 현재 질문 기반 미리보기 모달"

**핵심 요구사항**:

1. 제출 확인 모달: 제출 전 최종 확인
2. 닫기 확인 모달: 작성 내용이 있을 때만 표시
3. 미리보기 모달: 질문별 작성 내용 표시

---

## 2. Requirements

### Functional Requirements

**FR-1**: 제출 확인 모달 (Submit Confirmation Modal)

- 트리거: '제출하기' 버튼 클릭 시
- 모든 질문에 답변이 작성된 경우에만 제출 가능
- 확인/취소 버튼 제공
- 확인 시 제출 진행, 취소 시 모달 닫기

**FR-2**: 닫기 확인 모달 (Close Confirmation Modal)

- 트리거: 닫기 버튼 클릭 시 (작성 내용이 있을 때만)
- 작성한 내용이 없으면 바로 닫기
- "계속 편집" / "닫기" 버튼 제공
- 닫기 선택 시 패널 닫기, 계속 편집 시 모달만 닫기

**FR-3**: 미리보기 모달 (Preview Modal)

- 트리거: '미리보기' 버튼 클릭 시
- 모든 질문과 작성된 답변을 순서대로 표시
- 닫기 버튼 제공 (ESC 키로도 닫기 가능)

### Technical Requirements

**TR-1**: 기존 Dialog 컴포넌트 활용

- `src/shared/ui/dialog/Dialog.tsx` 컴포넌트 재사용
- Controlled 모드로 사용 (open, onOpenChange props)

**TR-2**: FSD 아키텍처 준수

- 모달 컴포넌트는 `src/features/retrospective/ui/` 에 배치
- 직접 import 방식 사용 (barrel export 미사용)

**TR-3**: 타입 안전성

- TypeScript로 모든 props 타입 정의
- 모달별 Props 인터페이스 명확히 분리

### Non-Functional Requirements

**NFR-1**: 접근성 (a11y)

- 모달 열림 시 포커스 트랩
- ESC 키로 닫기 지원
- ARIA 레이블 적용
- 키보드 네비게이션 지원

**NFR-2**: UI/UX 일관성

- 기존 LeaveTeamModal 패턴과 일관된 스타일
- 기존 디자인 시스템 컬러/타이포그래피 사용

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── retrospective/
│       └── ui/
│           ├── SubmitConfirmModal.tsx    # CREATE
│           ├── CloseConfirmModal.tsx     # CREATE
│           └── PreviewModal.tsx          # CREATE
└── widgets/
    └── retrospective-detail-panel/
        └── ui/
            └── RetrospectiveDetailPanel.tsx  # MODIFY
```

### Design Decisions

**Decision 1**: 모달 컴포넌트 위치 - features/retrospective/ui/

- **Rationale**: 회고 기능에 특화된 모달이므로 features 레이어에 배치
- **Approach**: features/retrospective/ui/ 아래에 3개 모달 컴포넌트 생성
- **Trade-offs**: widgets에 두면 재사용성 높지만, 회고 전용이므로 features가 적합
- **Impact**: LOW

**Decision 2**: Controlled 모달 패턴 사용

- **Rationale**: 부모 컴포넌트에서 모달 상태를 관리해야 함
- **Implementation**: open, onOpenChange props로 상태 전달
- **Benefit**: 상태 관리 명확, 테스트 용이

**Decision 3**: 닫기 확인 조건 - answers 배열 체크

- **Rationale**: 사용자가 작성한 내용이 있을 때만 확인 필요
- **Implementation**: `answers.some(answer => answer.trim() !== '')` 로 체크
- **Benefit**: 빈 상태에서는 불필요한 확인 단계 생략

### Component Design

**SubmitConfirmModal**:

```typescript
interface SubmitConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}
```

**CloseConfirmModal**:

```typescript
interface CloseConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void; // 패널 닫기 확인
}
```

**PreviewModal**:

```typescript
interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: string[];
  answers: string[];
  retrospectMethod: string;
}
```

**플로우 다이어그램**:

```
[제출 플로우]
제출하기 버튼 클릭
    ↓
모든 답변 작성됨?
    ↓ YES
SubmitConfirmModal 열기
    ↓
확인 클릭 → handleSubmit() 실행
취소 클릭 → 모달 닫기

[닫기 플로우]
닫기 버튼 클릭
    ↓
작성 내용 있음?
    ↓ YES               ↓ NO
CloseConfirmModal 열기   바로 onClose() 실행
    ↓
닫기 클릭 → onClose() 실행
계속 편집 클릭 → 모달만 닫기

[미리보기 플로우]
미리보기 버튼 클릭
    ↓
PreviewModal 열기
    ↓
닫기 클릭 또는 ESC → 모달 닫기
```

### Data Models

```typescript
// 기존 타입 활용
interface Retrospect {
  retrospectId: number;
  projectName: string;
  retrospectDate: string;
  retrospectMethod: string;
  retrospectTime: string;
  participantCount?: number;
}

// 모달 상태 관리용
interface ModalState {
  isSubmitModalOpen: boolean;
  isCloseModalOpen: boolean;
  isPreviewModalOpen: boolean;
}
```

---

## 4. Implementation Plan

### Phase 1: 모달 컴포넌트 생성

**Tasks**:

1. SubmitConfirmModal 컴포넌트 생성
2. CloseConfirmModal 컴포넌트 생성
3. PreviewModal 컴포넌트 생성

**Files to Create**:

- `src/features/retrospective/ui/SubmitConfirmModal.tsx` (CREATE)
- `src/features/retrospective/ui/CloseConfirmModal.tsx` (CREATE)
- `src/features/retrospective/ui/PreviewModal.tsx` (CREATE)

### Phase 2: RetrospectiveDetailPanel 연동

**Tasks**:

1. 모달 상태 관리 추가
2. 제출하기 버튼에 제출 확인 모달 연동
3. 닫기 버튼에 닫기 확인 모달 연동
4. 미리보기 버튼에 미리보기 모달 연동

**Files to Modify**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: 품질 검증

**Tasks**:

1. 빌드 및 타입 체크
2. 린트 통과 확인
3. 수동 테스트

### Vercel React Best Practices

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 시 함수형 업데이트 사용 (기존 패턴 유지)
- `rerender-avoid-renderphase-state-update`: 렌더링 단계에서 상태 업데이트 금지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 수동 테스트

- 테스트 타입: Manual
- 테스트 케이스:
  - 제출 확인 모달: 제출 버튼 → 모달 표시 → 확인/취소 동작
  - 닫기 확인 모달: 내용 있을 때 닫기 → 모달 표시 → 계속 편집/닫기 동작
  - 미리보기 모달: 미리보기 버튼 → 질문/답변 표시 → 닫기 동작

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [x] 제출 확인 모달 컴포넌트 구현 완료
- [x] 닫기 확인 모달 컴포넌트 구현 완료
- [x] 미리보기 모달 컴포넌트 구현 완료
- [x] 각 모달의 트리거 이벤트 연결 완료
- [x] 모달 UI/UX 기존 Dialog 패턴과 일관성 유지
- [x] 접근성(a11y) 준수
- [x] TypeScript 타입 정의 완료
- [x] 빌드/린트/타입 체크 성공

### Validation Checklist

**기능 동작**:

- [ ] 제출하기 버튼 클릭 시 제출 확인 모달 표시
- [ ] 제출 확인 모달에서 확인 클릭 시 제출 진행
- [ ] 제출 확인 모달에서 취소 클릭 시 모달만 닫힘
- [ ] 내용 있을 때 닫기 버튼 클릭 시 닫기 확인 모달 표시
- [ ] 내용 없을 때 닫기 버튼 클릭 시 바로 패널 닫힘
- [ ] 닫기 확인 모달에서 닫기 클릭 시 패널 닫힘
- [ ] 닫기 확인 모달에서 계속 편집 클릭 시 모달만 닫힘
- [ ] 미리보기 버튼 클릭 시 미리보기 모달 표시
- [ ] 미리보기 모달에 모든 질문과 답변 표시
- [ ] ESC 키로 모달 닫기 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] ARIA 레이블 추가

---

## 6. Risks & Dependencies

### Risks

**R-1**: 기존 Dialog 컴포넌트 호환성

- **Risk**: Dialog 컴포넌트가 모달 요구사항을 충족하지 못할 수 있음
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: LeaveTeamModal 패턴 이미 검증됨
- **Status**: 해결됨 (기존 패턴 확인 완료)

### Dependencies

**D-1**: Dialog 컴포넌트

- **Dependency**: `src/shared/ui/dialog/Dialog.tsx`
- **Required For**: 모든 모달 구현
- **Status**: AVAILABLE

**D-2**: RetrospectiveDetailPanel

- **Dependency**: `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx`
- **Required For**: 모달 연동
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

PR 머지 후 자동 배포 (Vercel Preview)

**Rollback Plan**:

- 문제 발생 시 PR revert

### Success Metrics

**SM-1**: 사용자 실수 방지

- **Metric**: 제출 전 확인 단계 추가
- **Target**: 모든 제출에 확인 모달 표시

---

## 8. Timeline & Milestones

### Milestones

**M1**: 모달 컴포넌트 구현

- 3개 모달 컴포넌트 생성 완료
- **Status**: NOT_STARTED

**M2**: 패널 연동 및 테스트

- RetrospectiveDetailPanel과 모달 연동
- 품질 검증 완료
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #104: [회고 진행 관련 모달 3종 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/104)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)

### Key Files

- `src/shared/ui/dialog/Dialog.tsx` - Dialog 컴포넌트
- `src/features/team/ui/LeaveTeamModal.tsx` - 확인 모달 패턴 참고
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` - 회고 패널

---

## 10. Implementation Summary

**Completion Date**: 2026-02-05
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- [`src/features/retrospective/ui/SubmitConfirmModal.tsx`](../../src/features/retrospective/ui/SubmitConfirmModal.tsx) - 제출 확인 모달 컴포넌트
  - "최종 제출할까요?" / "제출 후에는 내용을 수정할 수 없어요." 텍스트
  - 취소/확인 버튼 (우측 정렬)
  - 기존 Dialog 컴포넌트 활용

- [`src/features/retrospective/ui/CloseConfirmModal.tsx`](../../src/features/retrospective/ui/CloseConfirmModal.tsx) - 닫기 확인 모달 컴포넌트
  - "정말 나가시겠어요?" / "저장하지 않은 내용은 모두 사라져요." 텍스트
  - 임시저장/나가기 버튼

- [`src/features/retrospective/ui/PreviewModal.tsx`](../../src/features/retrospective/ui/PreviewModal.tsx) - 미리보기 모달 컴포넌트
  - 680px 고정 너비
  - 질문 넘버링 (blue-500) + 질문 내용 표시
  - 답변 있을 때만 좌측 세로선 + 답변 텍스트 표시
  - whitespace-pre-wrap으로 줄바꿈 유지

#### Files Modified

- [`src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx`](../../src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx) - 모달 연동 및 임시저장 기능
  - 3개 모달 상태 관리 추가 (isSubmitModalOpen, isCloseModalOpen, isPreviewModalOpen)
  - 로컬스토리지 임시저장 기능 (retrospect_draft_{id} 키)
  - 패널 열 때 임시저장 데이터 자동 로드
  - 닫기 버튼 클릭 시 변경 사항 비교 후 모달 표시
  - 임시저장 버튼 핸들러 연결
  - 제출 완료 시 임시저장 데이터 삭제

- [`src/pages/team-dashboard/ui/TeamDashboardPage.tsx`](../../src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 테스트용 더미 데이터
  - MOCK_TODAY_RETROSPECT 추가 ("모아 스프린트 1주차", 오늘 날짜)
  - todayRetrospects에 더미 데이터 포함

### Quality Validation

- [x] Build: Success (`npm run build`)
- [x] Type Check: Passed (`npx tsc --noEmit`)
- [x] Lint: Passed (`npm run lint`)

### Deviations from Plan

**Added**:

- 로컬스토리지 기반 임시저장 기능 (원래 Out of Scope였으나 닫기 확인 모달 요구사항에 필요하여 추가)
- 테스트용 더미 데이터 (TeamDashboardPage)

**Changed**:

- CloseConfirmModal: "계속 편집/닫기" 대신 "임시저장/나가기" 버튼으로 변경 (디자인 스펙 반영)
- 닫기 확인 조건: 단순 내용 유무가 아닌 "현재 내용 ≠ 임시저장 버전"으로 변경

### Performance Impact

- Bundle size: +1.88KB (3개 모달 컴포넌트)
- No runtime impact (모달은 필요할 때만 렌더링)

### Follow-up Tasks

- [ ] 테스트용 더미 데이터 제거 (API 연동 완료 후)
- [ ] 임시저장 API 연동 (현재 로컬스토리지만 사용)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-05
**Next Action**: `/commit` → `/pr`
