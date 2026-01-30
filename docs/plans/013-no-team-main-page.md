# Task Plan: 메인 화면 Empty State UI 구현

**Issue**: #13
**Type**: Feature
**Created**: 2026-01-25
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 메인 화면(`MainPage`)은 "Dashboard" 텍스트만 표시하는 기본 상태입니다. 사용자가 메인 화면에 접근했을 때 회고를 시작하도록 유도하는 UI가 필요합니다.

- 현재 상황: 기본 Dashboard 텍스트만 표시
- 문제점: 사용자에게 명확한 가이드 부재
- 해결 필요성: 회고 시작으로 유도하는 Empty State UI 필요

### Objectives

1. Empty State UI 컴포넌트 구현 (정적 UI)
2. 회고 시작 CTA 버튼 UI 제공
3. FSD 아키텍처를 준수하는 컴포넌트 구조 설계

> **Phase 2** (서버 API 추가 후): 조건부 렌더링, 버튼 동작 연결

### Scope

**In Scope**:

- NoTeamEmptyState UI 컴포넌트 구현 (정적 UI만)
- MainPage에 Empty State 컴포넌트 배치
- 버튼 UI 스타일링 (클릭 핸들러는 placeholder)

**Out of Scope** (서버 API 추가 후 별도 이슈로 진행):

- 실제 팀 생성/참여 API 연동
- 팀 상태 관리 스토어 구현
- 팀 유무에 따른 조건부 렌더링 로직
- 버튼 클릭 시 네비게이션/모달 동작
- 초대 링크 입력 플로우

### User Context

> "일단 UI만 만들거야. 비즈니스 로직과 관련된 내용은 서버의 API가 추가된 후, 구현할 예정이야."

**핵심 요구사항**:

1. UI 컴포넌트만 먼저 구현
2. 비즈니스 로직(API 연동, 상태 관리)은 제외
3. 버튼 클릭 핸들러는 placeholder로 구현

---

## 2. Requirements

### Functional Requirements

**FR-1**: Empty State UI 컴포넌트

- 안내 메시지: "성장을 위한 회고를 시작해봐요" (20px, semibold, leading-none)
- CTA 버튼: "회고 시작하기" (Primary Blue)
- 버튼 클릭 핸들러는 console.log placeholder

**FR-2**: 버튼 스타일링

- Primary 버튼: `#3182F6`, rounded 8px, padding 12px 28px

> **Note**: 실제 버튼 동작(네비게이션, API 호출)은 서버 API 추가 후 구현

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- Empty State 컴포넌트: `src/features/team/ui/NoTeamEmptyState.tsx`
- Public API: `src/features/team/index.ts`

**TR-2**: 기존 디자인 시스템 활용

- 색상: Primary Blue `#3182F6`, Gray `#F3F4F5`
- 버튼 스타일: `TeamStep` 컴포넌트 참조
- 레이아웃: 중앙 정렬 Flexbox

### Non-Functional Requirements

**NFR-1**: 접근성

- 버튼에 적절한 aria-label 추가
- 키보드 네비게이션 지원

**NFR-2**: 반응형

- 모바일/데스크톱 레이아웃 대응

---

## 3. Architecture & Design

### Directory Structure

```
src/
├── features/
│   └── team/                        # NEW: 팀 관련 feature
│       ├── ui/
│       │   └── NoTeamEmptyState.tsx # NEW: Empty State 컴포넌트
│       └── index.ts                 # NEW: Public API
├── pages/
│   └── main/
│       └── ui/
│           └── MainPage.tsx         # MODIFY: 조건부 렌더링 추가
└── shared/
    └── assets/
        └── svg/
            └── ic_team_empty_lg.svg # NEW (Optional): Empty state 아이콘
```

### Design Decisions

**Decision 1**: Empty State 컴포넌트를 features/team에 배치

- **Rationale**: 팀 관련 기능이므로 features 레이어에 배치
- **Approach**: `src/features/team/ui/NoTeamEmptyState.tsx` 생성
- **Trade-offs**: widgets에 두면 재사용성 높지만, 비즈니스 로직(팀 생성/참여)이 포함되므로 features가 적합
- **Alternatives Considered**: widgets/empty-state 공통 컴포넌트 → 팀 특화 로직이라 기각
- **Impact**: MEDIUM

**Decision 2**: Mock 팀 상태로 개발

- **Rationale**: 실제 API 연동 전 UI 먼저 구현
- **Implementation**: `hasTeam` prop으로 조건부 렌더링
- **Benefit**: API 의존성 없이 UI 개발 가능

### Component Design

**NoTeamEmptyState**:

```typescript
// UI only - 비즈니스 로직 없음
function NoTeamEmptyState() {
  const handleStartRetrospective = () => {
    console.log("TODO: 회고 시작 플로우로 이동");
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-[35px]">
        <p className="text-[20px] font-semibold leading-none">
          성장을 위한 회고를 시작해봐요
        </p>
        <button
          type="button"
          onClick={handleStartRetrospective}
          className="rounded-[8px] bg-[#3182F6] px-[28px] py-[12px] text-white"
        >
          회고 시작하기
        </button>
      </div>
    </div>
  );
}
```

**MainPage 수정**:

```typescript
function MainPage() {
  // TODO: 서버 API 추가 후 팀 유무에 따른 조건부 렌더링 구현
  // 현재는 Empty State UI만 표시
  return <NoTeamEmptyState />;
}
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. `src/features/team/` 디렉토리 구조 생성
2. Public API (index.ts) 설정

**Files to Create**:

- `src/features/team/index.ts` (CREATE)

### Phase 2: Core Implementation

**Tasks**:

1. NoTeamEmptyState UI 컴포넌트 구현
2. MainPage에 Empty State 컴포넌트 배치 (조건부 렌더링 없이)
3. 버튼 클릭 핸들러는 console.log placeholder로 구현

**Files to Create/Modify**:

- `src/features/team/ui/NoTeamEmptyState.tsx` (CREATE)
- `src/pages/main/ui/MainPage.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

> **Note**: 서버 API 추가 후 조건부 렌더링 및 실제 동작 연결 예정

### Phase 3: Polish & Optimization

**Tasks**:

1. 스타일링 세부 조정
2. 접근성 개선 (aria-label 추가)
3. 빌드 및 린트 검증

**Files to Modify**:

- `src/features/team/ui/NoTeamEmptyState.tsx` (MODIFY)

### Vercel React Best Practices

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지 (콜백 함수 메모이제이션)

**적용 이유**: 이 작업은 주로 UI 컴포넌트 구현이므로 async/bundle 관련 규칙은 해당 없음

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

- [x] Empty State UI 컴포넌트 구현
- [x] 회고 시작 버튼 UI 표시
- [x] FSD 아키텍처 준수
- [x] 빌드 및 린트 통과

> **후속 작업** (서버 API 추가 후):
>
> - 팀 유무에 따른 조건부 렌더링
> - 버튼 클릭 시 실제 동작 연결

### Validation Checklist

**UI 표시**:

- [ ] Empty State 화면이 올바르게 표시되는가
- [ ] 안내 메시지가 명확한가
- [ ] 버튼 스타일이 디자인 시스템과 일관되는가

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 레이어 의존성 규칙 준수

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] 버튼에 적절한 레이블 있음

---

## 6. Risks & Dependencies

### Risks

**R-1**: 팀 상태 API 미정의

- **Risk**: 실제 팀 유무 확인 API가 아직 없음
- **Impact**: LOW
- **Probability**: HIGH (예상됨)
- **Mitigation**: Mock 데이터로 개발, 추후 API 연동
- **Status**: 인지됨

### Dependencies

**D-1**: 기존 디자인 시스템

- **Dependency**: TeamStep 컴포넌트의 버튼 스타일
- **Required For**: 일관된 UI 구현
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. PR 생성 및 리뷰
2. main 브랜치 병합
3. 자동 배포 (Vercel)

### Success Metrics

**SM-1**: UI 렌더링

- **Metric**: Empty State 화면 정상 표시
- **Target**: 100% 정상 동작
- **Measurement**: 수동 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: 기본 구조 설정

- features/team 디렉토리 구조 생성
- 타입 정의 완료
- **Status**: NOT_STARTED

**M2**: Empty State 컴포넌트 구현

- UI 컴포넌트 구현
- MainPage 연동
- **Status**: NOT_STARTED

**M3**: 품질 검증

- 빌드/린트 통과
- 접근성 검증
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #13: [Feature] 팀이 없을 때의 메인 화면 페이지 구현

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [Feature-Sliced Design](https://feature-sliced.design/)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-25
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

- `src/features/team/ui/NoTeamEmptyState.tsx` - Empty State UI 컴포넌트
- `src/features/team/index.ts` - Public API export

#### Files Modified

- `src/pages/main/ui/MainPage.tsx` - NoTeamEmptyState 컴포넌트 사용

#### Key Implementation Details

- 중앙 정렬 Flexbox 레이아웃 (`items-center justify-center`)
- 텍스트: "성장을 위한 회고를 시작해봐요" (20px, semibold, leading-none)
- 버튼: "회고 시작하기" (Primary Blue #3182F6, rounded-8px, padding 12px/28px)
- 버튼 클릭 핸들러: console.log placeholder
- FSD 아키텍처 준수 (features/team 레이어)

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed

### Deviations from Plan

없음 (계획대로 구현됨)

### Follow-up Tasks

- [ ] 서버 API 추가 후 팀 유무에 따른 조건부 렌더링 구현
- [ ] 버튼 클릭 시 실제 회고 시작 플로우 연결

---

**Plan Status**: Completed
**Last Updated**: 2026-01-25
**Next Action**: 커밋 및 PR 생성
