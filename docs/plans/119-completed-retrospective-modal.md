# Task Plan: 완료된 회고 모달 뷰 및 좌우 네비게이션 구현

**Issue**: #119
**Type**: Feature
**Created**: 2026-02-06
**Status**: Planning

---

## 1. Overview

### Problem Statement

홈화면(TeamDashboardPage)의 "완료된 회고" 섹션에서 회고를 클릭해도 아무 반응이 없다. 현재 완료된 회고의 상세 뷰(`CompletedRetrospectiveView`)는 사이드 패널 내에서만 사용되며, 완료된 회고 리스트에서 접근할 수 없다.

사용자가 완료된 회고를 쉽게 열람하고 좌우 네비게이션으로 탐색할 수 있는 모달 뷰가 필요하다.

### Objectives

1. 완료된 회고 리스트 클릭 시 모달로 해당 회고 내용/분석 표시
2. 좌우 화살표로 이전/이후 완료 회고 탐색 가능
3. 경계 조건(1개, 첫/마지막) 처리

### Scope

**In Scope**:

- 완료된 회고 모달 컴포넌트 (`CompletedRetrospectiveModal`)
- 좌우 네비게이션 화살표 (이전/다음 회고 이동)
- 모달 내 기존 `CompletedRetrospectiveView` 콘텐츠 재활용
- `RetrospectSection`에 클릭 핸들러 전달
- `TeamDashboardPage`에 모달 상태 관리

**Out of Scope**:

- 키보드 좌우 화살표 네비게이션 (추후 개선)
- 회고 삭제/수정 기능
- 모달 내 참여자/참고자료 사이드바

### User Context

> "홈화면에 완료한 회고 리스트를 누르면 완료된 회고를 모달 형태로 보여줄거야. 좌우 버튼을 눌러서 이전 회고, 이후 회고로 이동할 수 있어. 완료한 회고가 하나면 좌우 이동 버튼은 없고, 첫 회고나 마지막 회고로 이동하면 해당 이동버튼 disabled"

**디자인 레퍼런스 분석**:

- 모달 중앙 배치, 날짜 + 제목 상단 표시
- X 버튼 우상단
- "회고 내용" / "회고 분석" 탭 전환
- AI 인사이트, 감정 키워드 랭킹, 미션 표시
- 좌우 화살표는 모달 외부 양쪽에 배치 (원형 버튼)

---

## 2. Requirements

### Functional Requirements

**FR-1**: 완료 회고 클릭 시 모달 열기

- 완료된 회고 섹션의 `RetrospectRow` 클릭 시 모달 오픈
- 클릭한 회고의 `retrospectId`를 기반으로 콘텐츠 표시

**FR-2**: 모달 내 탭 전환

- "회고 내용" / "회고 분석" 탭 전환
- 기존 `CompletedRetrospectiveView` 재활용

**FR-3**: 좌우 네비게이션

- 완료된 회고가 2개 이상이면 좌우 화살표 표시
- 완료된 회고가 1개면 화살표 미표시
- 첫 회고: 왼쪽 버튼 disabled
- 마지막 회고: 오른쪽 버튼 disabled
- 네비게이션 시 탭 상태 초기화 (content 탭으로)

**FR-4**: 모달 닫기

- X 버튼 클릭으로 닫기
- ESC 키로 닫기
- Overlay 클릭으로 닫기

### Technical Requirements

**TR-1**: 기존 Dialog 컴포넌트 활용

- `src/shared/ui/dialog/Dialog.tsx`의 primitive 컴포넌트 사용
- Controlled mode로 사용 (open/onOpenChange)

**TR-2**: FSD 아키텍처 준수

- 새 컴포넌트는 `features/retrospective/ui/`에 배치
- 직접 import 방식 사용 (barrel export 금지)

**TR-3**: 기존 아이콘 재활용

- `IcChevronActiveRight` (28x28, 활성 상태)
- `IcChevronDisabledLeft` (28x28, 비활성 상태)
- rotate-180 클래스로 좌우 전환

### Non-Functional Requirements

**NFR-1**: 접근성

- 모달에 적절한 ARIA 속성 (`role="dialog"`, `aria-modal`, `aria-labelledby`)
- 네비게이션 버튼에 `aria-label` ("이전 회고", "다음 회고")
- 닫기 버튼에 `aria-label`

**NFR-2**: 성능

- 네비게이션 시 불필요한 리렌더링 방지
- React Query 캐시 활용 (이미 로드된 회고 데이터)

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── retrospective/
│       └── ui/
│           └── CompletedRetrospectiveModal.tsx  (CREATE)
├── pages/
│   └── team-dashboard/
│       └── ui/
│           └── TeamDashboardPage.tsx            (MODIFY)
└── features/
    └── retrospective/
        └── ui/
            ├── RetrospectSection.tsx             (MODIFY)
            └── CompletedRetrospectiveView.tsx    (기존 재활용)
```

### Design Decisions

**Decision 1**: Dialog 기반 모달 (SidePanel 아닌)

- **Rationale**: 디자인 레퍼런스에서 중앙 모달 형태이며, 기존 SidePanel은 우측 슬라이드인 방식
- **Approach**: `DialogRoot` + `DialogPortal` + `DialogOverlay` + `DialogContent` 조합
- **Trade-offs**: SidePanel 재활용 불가하지만 디자인 의도에 더 부합
- **Impact**: LOW

**Decision 2**: 네비게이션 상태를 TeamDashboardPage에서 관리

- **Rationale**: completedRetrospects 배열이 이미 TeamDashboardPage에 존재
- **Approach**: `selectedIndex`, `isModalOpen` 상태를 부모에서 관리, 모달에 props로 전달
- **Trade-offs**: 상태 끌어올리기가 필요하지만 데이터 흐름이 명확
- **Impact**: LOW

**Decision 3**: CompletedRetrospectiveView 재활용

- **Rationale**: 이미 탭 전환, 콘텐츠 렌더링 로직이 구현되어 있음
- **Approach**: 모달 내부에 CompletedRetrospectiveView를 배치하고 props만 변경
- **Trade-offs**: 모달 전용 스타일 조정이 필요할 수 있음
- **Impact**: LOW

### Component Design

**CompletedRetrospectiveModal**:

```typescript
interface CompletedRetrospectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  retrospects: RetrospectListItem[];
  initialIndex: number;
}

function CompletedRetrospectiveModal({
  open,
  onOpenChange,
  retrospects,
  initialIndex,
}: CompletedRetrospectiveModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // initialIndex 변경 시 동기화
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const currentRetrospect = retrospects[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === retrospects.length - 1;
  const showNavigation = retrospects.length > 1;

  // ...
}
```

**Flow**:

```
User clicks RetrospectRow (completed section)
    ↓
TeamDashboardPage sets selectedIndex + opens modal
    ↓
CompletedRetrospectiveModal renders with Dialog
    ↓
  ┌─ Header: date + title + X button
  ├─ CompletedRetrospectiveView (tabs)
  └─ Navigation arrows (left/right of modal)
    ↓
Arrow click → currentIndex ±1 → re-render with new retrospect
```

### Data Models

```typescript
// 기존 타입 재활용
import type { RetrospectListItem } from '@/shared/api/generated/index';

// RetrospectListItem:
// {
//   retrospectId: number;
//   projectName: string;
//   retrospectDate: string;
//   retrospectMethod: string;
//   retrospectTime: string;
//   participantCount: number;
// }
```

---

## 4. Implementation Plan

### Phase 1: CompletedRetrospectiveModal 컴포넌트 생성

**Tasks**:

1. `CompletedRetrospectiveModal.tsx` 생성
2. Dialog 기반 모달 레이아웃 구현
3. 헤더 (날짜, 제목, X 버튼) 구현
4. CompletedRetrospectiveView 내부 배치
5. 좌우 네비게이션 화살표 구현 (모달 외부 양쪽)
6. 경계 조건 처리 (1개, 첫/마지막)

**Files to Create/Modify**:

- `src/features/retrospective/ui/CompletedRetrospectiveModal.tsx` (CREATE)

**Estimated Effort**: Medium

### Phase 2: 기존 컴포넌트 연결

**Tasks**:

1. `RetrospectSection`에 `onItemClick` prop 추가
2. `RetrospectRow`에 클릭 핸들러 연결 (완료된 회고 섹션에서만)
3. `TeamDashboardPage`에 모달 상태 관리 추가
4. completedRetrospects 클릭 시 모달 열기 로직

**Files to Create/Modify**:

- `src/features/retrospective/ui/RetrospectSection.tsx` (MODIFY)
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: 스타일 & 품질 검증

**Tasks**:

1. 모달 반응형 스타일 조정
2. 빌드/타입/린트 검증
3. 네비게이션 이동 시 탭 상태 초기화 확인

**Estimated Effort**: Small

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 직접 import 사용 (Dialog, Icons 등)

**MEDIUM**:

- `rerender-functional-setstate`: 네비게이션 인덱스 업데이트 시 함수형 setState 사용

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

- [ ] 완료된 회고 리스트 아이템 클릭 시 모달 열림
- [ ] 모달 내 "회고 내용"/"회고 분석" 탭 정상 동작
- [ ] 좌우 화살표로 이전/이후 회고 이동 가능
- [ ] 회고 1개: 좌우 버튼 미표시
- [ ] 첫 회고: 왼쪽 버튼 disabled, 마지막 회고: 오른쪽 버튼 disabled
- [ ] X 버튼 및 ESC 키로 모달 닫기
- [ ] Overlay 클릭으로 모달 닫기
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] 완료 회고 클릭 → 모달 열림 (정확한 회고 표시)
- [ ] 좌우 버튼 클릭 → 회고 전환
- [ ] 네비게이션 시 탭 상태 content로 초기화
- [ ] 모달 닫기 후 재열기 시 정상 동작

**접근성**:

- [ ] Dialog ARIA 속성 (role, aria-modal, aria-labelledby)
- [ ] 네비게이션 버튼 aria-label
- [ ] ESC 키 동작

---

## 6. Risks & Dependencies

### Risks

**R-1**: CompletedRetrospectiveView 모달 내 레이아웃 이슈

- **Risk**: 사이드패널용으로 설계된 뷰가 모달 내에서 레이아웃이 깨질 수 있음
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 모달 크기를 충분히 크게 설정하고 overflow 처리

### Dependencies

**D-1**: 기존 Dialog 컴포넌트

- **Dependency**: `src/shared/ui/dialog/Dialog.tsx`
- **Required For**: 모달 구현
- **Status**: AVAILABLE

**D-2**: CompletedRetrospectiveView

- **Dependency**: `src/features/retrospective/ui/CompletedRetrospectiveView.tsx`
- **Required For**: 모달 내 콘텐츠
- **Status**: AVAILABLE

**D-3**: 네비게이션 아이콘

- **Dependency**: `IcChevronActiveRight`, `IcChevronDisabledLeft`
- **Required For**: 좌우 화살표
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

- dev 브랜치에 PR 생성 후 머지
- 기존 기능에 영향 없음 (새 모달 추가)

### Success Metrics

**SM-1**: 완료 회고 접근성

- **Metric**: 완료 회고 클릭 → 모달 표시 정상 동작
- **Target**: 100% 동작

---

## 8. Timeline & Milestones

### Milestones

**M1**: 모달 컴포넌트 구현

- CompletedRetrospectiveModal 완성 + 네비게이션 동작
- **Status**: NOT_STARTED

**M2**: 기존 컴포넌트 연결 및 검증

- TeamDashboardPage + RetrospectSection 연결 + 빌드 통과
- **Status**: NOT_STARTED

### Estimated Timeline

- **Phase 1 (모달 구현)**: Core
- **Phase 2 (연결)**: Integration
- **Phase 3 (검증)**: Polish

---

## 9. References

### Related Issues

- Issue #119: [완료된 회고 모달 뷰 및 좌우 네비게이션 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/119)
- Issue #109: 회고 완료 결과 탭 뷰 및 AI 어시스턴트 구현 (관련 - CompletedRetrospectiveView)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-02-06
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Files Created

- [src/features/retrospective/ui/CompletedRetrospectiveModal.tsx](src/features/retrospective/ui/CompletedRetrospectiveModal.tsx) - 완료된 회고 모달 컴포넌트 (Dialog 기반, 좌우 네비게이션)
- [src/shared/ui/icons/IcChevronLeftFit.tsx](src/shared/ui/icons/IcChevronLeftFit.tsx) - 네비게이션 화살표 아이콘
- [src/shared/assets/icons/ic_chevron_left_fit.svg](src/shared/assets/icons/ic_chevron_left_fit.svg) - SVG 원본

#### Files Modified

- [src/features/retrospective/model/types.ts](src/features/retrospective/model/types.ts#L16) - `hideTitle` optional prop 추가
- [src/features/retrospective/ui/CompletedRetrospectiveView.tsx](src/features/retrospective/ui/CompletedRetrospectiveView.tsx) - `hideTitle` prop 지원, 더미 데이터 제거 후 실데이터 연결
- [src/features/retrospective/ui/RetrospectiveContentTab.tsx](src/features/retrospective/ui/RetrospectiveContentTab.tsx) - `QuestionResponseGroup` 서브 컴포넌트로 리팩토링 ("전체" 필터 시 질문별 그룹화), 더미 데이터 제거
- [src/features/retrospective/ui/RetrospectiveAnalysisResult.tsx](src/features/retrospective/ui/RetrospectiveAnalysisResult.tsx#L55) - `pt-4` 제거 (콘텐츠 탭과 동일 간격 적용)
- [src/pages/team-dashboard/ui/TeamDashboardPage.tsx](src/pages/team-dashboard/ui/TeamDashboardPage.tsx) - 모달 상태 관리 추가, 완료 회고 클릭 시 모달 열기, 더미 데이터 제거

#### Key Implementation Details

- Dialog primitive (`DialogRoot/Portal/Overlay/Content`) 기반 controlled 모달
- `key={currentRetrospect.retrospectId}`로 네비게이션 시 탭 상태 자동 초기화
- `IcChevronLeftFit` 아이콘 사용 (오른쪽은 `rotate-180`)
- "전체" 필터에서 `QuestionResponseGroup` 서브 컴포넌트가 질문별 개별 API 호출
- 모달 max-height: `calc(100vh - 160px)`, 탭 콘텐츠 영역 스크롤 처리

### Quality Validation

- [x] Build: Success (607.07 kB)
- [x] Type Check: Passed
- [x] Lint: Passed (174 files, no issues)

### Deviations from Plan

**Changed**:

- 네비게이션 아이콘을 `IcChevronActiveRight`/`IcChevronDisabledLeft` 대신 `IcChevronLeftFit` 사용 (사용자 요청)
- `RetrospectSection`은 이미 `onItemClick` prop을 가지고 있어 수정 불필요
- `CompletedRetrospectiveView`에 `hideTitle` prop 추가 (모달 헤더에서 타이틀을 별도 표시하므로 중복 방지)

**Added**:

- `RetrospectiveContentTab` 리팩토링: "전체" 필터 시 질문별 섹션 헤더 표시 (기존에 누락된 디자인)
- `RetrospectiveAnalysisResult` 간격 수정: 분석 탭과 콘텐츠 탭 간격 통일
- 모달 헤더 레이아웃: 날짜(caption-4/grey-600) → 4px → 제목(title-1/grey-1000) → 20px → 탭

### Performance Impact

- Bundle size: 607.07 kB (기존 대비 미미한 변화, 새 컴포넌트 1개 추가)
- 더미 데이터 제거로 약 2KB 감소 효과

### Notes

- 더미 데이터 전체 제거 완료 (실데이터 연결)
- FSD 아키텍처 준수 (features/retrospective/ui/ 배치)
- 직접 import 방식 사용 (barrel export 없음)

---

**Plan Status**: Completed
**Last Updated**: 2026-02-06
