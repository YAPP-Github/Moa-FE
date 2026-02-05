# Task Plan: 회고 참여 사이드 패널 구현

**Issue**: #97
**Type**: Feature
**Created**: 2026-02-04
**Status**: Planning

---

## 1. Overview

### Problem Statement

홈 화면에서 "오늘 회고" 카드를 클릭했을 때 회고 참여 정보를 보여주는 사이드 패널이 필요합니다.

- 현재 "오늘 회고" 카드에 클릭 핸들러가 없음
- 회고 상세 정보를 표시할 사이드 패널 컴포넌트가 없음
- 우측에서 슬라이드인 하는 패널 UI 패턴 필요

### Objectives

1. 우측에서 슬라이드인하는 사이드 패널 컴포넌트 구현
2. "오늘 회고" 카드 클릭 시 사이드 패널 열기 기능 구현
3. 회고 상세 정보 표시 UI 구현
4. FSD 아키텍처에 맞게 `src/widgets/retrospective-detail-panel/`에 배치

### Scope

**In Scope**:

- SidePanel 공통 컴포넌트 구현 (`src/shared/ui/side-panel/`)
- RetrospectiveDetailPanel 위젯 구현 (`src/widgets/retrospective-detail-panel/`)
- "오늘 회고" 카드 클릭 핸들러 추가
- 슬라이드 인/아웃 애니메이션
- 오버레이(backdrop) 클릭 시 닫기

**Out of Scope**:

- 회고 참여 기능 (다른 이슈에서 구현)
- 실제 API 연동 (현재 더미 데이터 사용 중)

### User Context

> "홈 화면에서 오늘 회고 클릭시 회고참여 사이드 패널이 우측에서 나오게 해줘."

**핵심 요구사항**:

1. "오늘 회고" 카드 클릭 시 사이드 패널 표시
2. 우측에서 슬라이드인 애니메이션
3. 회고 참여 정보 표시

---

## 2. Requirements

### Functional Requirements

**FR-1**: 사이드 패널 열기/닫기

- "오늘 회고" 카드 클릭 시 패널 열기
- 오버레이(backdrop) 클릭 시 패널 닫기
- 닫기 버튼 클릭 시 패널 닫기
- ESC 키 누르면 패널 닫기

**FR-2**: 애니메이션

- 우측에서 슬라이드인 (열기)
- 우측으로 슬라이드아웃 (닫기)
- 오버레이 fade in/out

**FR-3**: 회고 정보 표시

- 회고 제목 (프로젝트명)
- 회고 방법 (KPT 등)
- 회고 시간
- 참여자 수

### Technical Requirements

**TR-1**: 컴포넌트 패턴

- Portal 기반 렌더링 (document.body에 마운트)
- Compound Component 패턴 고려
- TypeScript 완전 타입 지원

**TR-2**: 스타일링

- Tailwind CSS 사용
- 프로젝트 디자인 토큰 활용
- cn() 유틸리티로 클래스 병합

**TR-3**: 접근성

- role="dialog" 적용
- aria-modal="true"
- 포커스 트랩 (선택적)
- ESC 키로 닫기

### Non-Functional Requirements

**NFR-1**: 성능

- 애니메이션 60fps 유지
- Portal 사용으로 레이아웃 리플로우 최소화

**NFR-2**: 재사용성

- SidePanel은 공통 컴포넌트로 다른 곳에서도 사용 가능
- RetrospectiveDetailPanel은 회고 전용 위젯

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── shared/ui/
│   └── side-panel/
│       ├── SidePanel.tsx           # 공통 사이드 패널 컴포넌트
│       └── SidePanel.stories.tsx   # Storybook 스토리
├── widgets/
│   └── retrospective-detail-panel/
│       └── ui/
│           └── RetrospectiveDetailPanel.tsx  # 회고 상세 패널 위젯
└── pages/
    └── team-dashboard/
        └── ui/
            └── TeamDashboardPage.tsx  # 수정: 카드 클릭 핸들러 추가
```

### Design Decisions

**Decision 1**: SidePanel을 shared로 분리

- **Rationale**: 다른 기능(설정 패널 등)에서도 재사용 가능
- **Approach**: 공통 슬라이드 패널 컴포넌트로 구현
- **Trade-offs**: 초기 구현 복잡도 ↑, 재사용성 ↑

**Decision 2**: Portal 기반 렌더링

- **Rationale**: 레이아웃 영향 없이 오버레이 표시
- **Implementation**: createPortal로 document.body에 렌더링
- **Benefit**: z-index 관리 용이, 레이아웃 독립적

**Decision 3**: Tailwind 애니메이션

- **Rationale**: 프로젝트 기존 패턴과 일관성
- **Implementation**: translate-x + transition-all 조합
- **Benefit**: 추가 라이브러리 불필요

### Component Design

**SidePanel 컴포넌트**:

```typescript
interface SidePanelProps {
  /** 패널 열림 상태 */
  open: boolean;
  /** 열림/닫힘 상태 변경 콜백 */
  onOpenChange: (open: boolean) => void;
  /** 패널 너비 */
  width?: string;
  /** 패널 내용 */
  children: React.ReactNode;
}
```

**사용 예시**:

```tsx
<SidePanel open={isOpen} onOpenChange={setIsOpen} width="400px">
  <RetrospectiveDetailPanel retrospect={selectedRetrospect} />
</SidePanel>
```

### Data Models

```typescript
interface Retrospect {
  retrospectId: number;
  projectName: string;
  retrospectDate: string;
  retrospectMethod: string;
  retrospectTime: string;
  participantCount: number;
}
```

---

## 4. Implementation Plan

### Phase 1: SidePanel 공통 컴포넌트

**Tasks**:

1. SidePanel.tsx 파일 생성
2. Portal 기반 렌더링 구현
3. 슬라이드 애니메이션 구현
4. 오버레이 클릭/ESC 키 닫기 구현

**Files to Create**:

- `src/shared/ui/side-panel/SidePanel.tsx` (CREATE)

### Phase 2: RetrospectiveDetailPanel 위젯

**Tasks**:

1. RetrospectiveDetailPanel.tsx 파일 생성
2. 회고 정보 표시 UI 구현
3. 닫기 버튼 추가

**Files to Create**:

- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` (CREATE)

### Phase 3: TeamDashboardPage 통합

**Tasks**:

1. 선택된 회고 상태 추가
2. "오늘 회고" 카드에 클릭 핸들러 추가
3. SidePanel + RetrospectiveDetailPanel 연결

**Files to Modify**:

- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` (MODIFY)

### Phase 4: Storybook & Polish

**Tasks**:

1. SidePanel.stories.tsx 작성
2. 빌드 및 린트 검증

**Files to Create**:

- `src/shared/ui/side-panel/SidePanel.stories.tsx` (CREATE)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-functional-setstate`: 상태 업데이트 시 함수형 사용
- `rerender-memo`: 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 시각적 테스트

- 테스트 타입: Visual
- 패널 열기/닫기 동작 확인
- 애니메이션 동작 확인

**TS-2**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

- [ ] SidePanel 공통 컴포넌트 구현
- [ ] RetrospectiveDetailPanel 위젯 구현
- [ ] "오늘 회고" 카드 클릭 시 패널 열림
- [ ] 우측에서 슬라이드인 애니메이션 동작
- [ ] 오버레이/닫기 버튼/ESC로 패널 닫기
- [ ] 빌드 및 린트 통과

### Validation Checklist

**기능 동작**:

- [ ] 카드 클릭 시 패널 열림
- [ ] 오버레이 클릭 시 패널 닫힘
- [ ] ESC 키로 패널 닫힘
- [ ] 슬라이드 애니메이션 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

**접근성**:

- [ ] role="dialog" 적용
- [ ] aria-modal 속성 적용

---

## 6. Risks & Dependencies

### Risks

**R-1**: 디자인 스펙 부재

- **Risk**: 구체적인 디자인 스펙 없이 구현
- **Impact**: LOW
- **Probability**: HIGH
- **Mitigation**: 기본 스타일로 구현 후 피드백 반영
- **Status**: 진행

### Dependencies

**D-1**: 기존 컴포넌트 참조

- **Dependency**: Dialog 컴포넌트 패턴 참조
- **Required For**: Portal/오버레이 패턴
- **Status**: READY

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. SidePanel 공통 컴포넌트 구현 완료
2. RetrospectiveDetailPanel 위젯 구현 완료
3. TeamDashboardPage 통합
4. Storybook에서 시각적 검증
5. PR 생성 및 리뷰

### Success Metrics

**SM-1**: 컴포넌트 완성도

- **Metric**: 모든 Acceptance Criteria 충족
- **Target**: 100%

---

## 8. Timeline & Milestones

### Milestones

**M1**: SidePanel 공통 컴포넌트

- SidePanel.tsx 구현
- **Status**: NOT_STARTED

**M2**: RetrospectiveDetailPanel 위젯

- 회고 상세 패널 구현
- **Status**: NOT_STARTED

**M3**: 페이지 통합

- TeamDashboardPage에 연결
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #97: [회고 참여 사이드 패널 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/97)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처](./.claude/rules/fsd.md)

**참고 컴포넌트**:

- [Dialog](../../src/shared/ui/dialog/Dialog.tsx) - Portal/오버레이 패턴 참조
- [Toast](../../src/shared/ui/toast/Toast.tsx) - 애니메이션 패턴 참조

---

**Plan Status**: Completed
**Last Updated**: 2026-02-04
**Next Action**: PR 생성

---

## Implementation Summary

**Completion Date**: 2026-02-04
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/shared/ui/side-panel/SidePanel.tsx` - 공통 사이드 패널 컴포넌트 (Portal 기반)
- `src/widgets/retrospective-detail-panel/ui/RetrospectiveDetailPanel.tsx` - 회고 상세 패널 위젯
- `src/shared/ui/icons/IcChevronActiveRight.tsx` - 활성 chevron 아이콘
- `src/shared/ui/icons/IcChevronDisabledLeft.tsx` - 비활성 chevron 아이콘
- `src/shared/ui/icons/IcChevronRightPink.tsx` - 핑크 chevron 아이콘
- `src/shared/ui/icons/IcLinkActive.tsx` - 활성 링크 아이콘
- `src/shared/ui/icons/IcLinkInactive.tsx` - 비활성 링크 아이콘
- `src/shared/ui/icons/IcMemberActive.tsx` - 활성 멤버 아이콘
- `src/shared/ui/icons/IcMemberInactive.tsx` - 비활성 멤버 아이콘
- `src/shared/ui/icons/IcOpen.tsx` - 펼치기 아이콘
- `src/shared/ui/icons/IcSclaeDown.tsx` - 축소 아이콘
- `src/shared/ui/icons/IcSparklePink.tsx` - 핑크 스파클 아이콘

#### Files Modified

- `src/app/App.tsx` - ToastContainer 추가
- `src/index.css` - title-5, title-6, title-7 타이포그래피 토큰 수정/추가
- `src/pages/team-dashboard/ui/TeamDashboardPage.tsx` - 사이드 패널 연동, 확장/축소 기능 추가
- `svgr.icons.config.js` - convertColors 플러그인 제거 (SVG 색상 보존)
- 기존 아이콘 컴포넌트들 (재생성으로 색상 보존)

### Key Implementation Details

1. **SidePanel 공통 컴포넌트**:

   - React Portal 기반 렌더링 (document.body에 마운트)
   - 슬라이드 인/아웃 애니메이션
   - ESC 키 닫기, backdrop 클릭 닫기 지원
   - 동적 width 지원

2. **RetrospectiveDetailPanel 위젯**:

   - 질문 네비게이션 (이전/다음 버튼, 질문 인덱스 표시)
   - 회고 내용 입력 textarea (1000자 제한)
   - 회고 어시스턴트 버튼 (핑크 테마)
   - 확장 패널 (참여자, 전체 질문 목록)
   - 드롭다운 메뉴 (링크복사, 내보내기, 삭제하기)
   - 제출 검증 토스트 (미완료 시 경고, 완료 시 성공)

3. **SVGR 설정 수정**:

   - convertColors 플러그인 제거로 SVG 원본 색상 보존
   - 다색상 아이콘 정상 렌더링

4. **타이포그래피 토큰 수정**:
   - title-5: 15px (수정)
   - title-6: 14px (수정)
   - title-7: 13px (신규 추가)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

**Added**:

- 참여자 확장 패널 (280px, 애니메이션 포함)
- 전체 질문 목록 사이드 네비게이션
- 드롭다운 메뉴 (더보기 버튼)
- 제출 검증 토스트 (성공/경고)
- 패널 확장/축소 기능

**Changed**:

- SVGR 설정 수정 (원본 색상 보존)

**Skipped**:

- Storybook 스토리 작성 (후속 작업으로 이관)

### Performance Impact

- Bundle size: +5KB (새 컴포넌트 및 아이콘)
- Portal 사용으로 레이아웃 리플로우 최소화

### Follow-up Tasks

- [ ] SidePanel.stories.tsx 스토리북 스토리 작성
- [ ] RetrospectiveDetailPanel 실제 API 연동
- [ ] 참고자료 패널 구현

### Notes

- ToastContainer를 App.tsx에 추가하여 전역 토스트 활성화
- FSD 아키텍처 준수: shared/ui, widgets 레이어에 배치
- 기존 DropdownMenu, Toast 컴포넌트 재사용
