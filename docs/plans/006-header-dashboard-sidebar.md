# Task Plan: Header, Dashboard Sidebar 컴포넌트 생성

**Issue**: #6
**Type**: Feature
**Created**: 2026-01-24
**Status**: Planning

---

## 1. Overview

### Problem Statement

대시보드 레이아웃을 구성하기 위해 Header와 Sidebar 컴포넌트가 필요합니다. 현재 프로젝트에는 기본 레이아웃 컴포넌트가 없으며, 사용자 네비게이션을 위한 기본 UI 요소가 필요합니다.

### Objectives

1. Header 컴포넌트 구현 (height 54px, 좌측 로고, 우측 프로필 아바타)
2. Dashboard Sidebar 컴포넌트 구현 (width 240px, 좌측 고정)
3. DashboardLayout 위젯 구현 (Header + Sidebar + Content 조합)
4. 라우터 구성 (로그인 페이지 vs 대시보드 페이지)
5. FSD 아키텍처를 따르는 구조

### Scope

**In Scope**:

- Header 컴포넌트 생성 (widgets/header)
- Dashboard Sidebar 컴포넌트 생성 (widgets/sidebar)
- DashboardLayout 위젯 생성 (widgets/layout)
- MainPage 페이지 생성 (pages/main)
- 라우터 설정 (App.tsx) - "/" 경로에 MainPage 배치
- 기본 스타일링 (Tailwind CSS)
- FSD 아키텍처 준수

**Out of Scope**:

- 로그인 페이지
- 네비게이션 링크 동작 구현
- 반응형 디자인 (모바일)
- 다크 모드 지원

### User Context

> "Header - height 54px, border 1px solid bottom #F3F4F5, 좌측 로고, 우측 프로필 아바타 (padding은 적절하게)
> Sidebar - width는 240px로 일단 왼쪽에만 위치하게 만들어줘
> background는 모두 #FFFFFF로 해줘."

**핵심 요구사항**:

1. Header: 54px 높이, 하단 border #F3F4F5, 배경 #FFFFFF
2. Sidebar: 240px 너비, 좌측 고정, 배경 #FFFFFF

---

## 2. Requirements

### Functional Requirements

**FR-1**: Header 컴포넌트

- 좌측에 로고 배치 (플레이스홀더)
- 우측에 프로필 아바타 배치 (플레이스홀더)
- 고정 높이 54px

**FR-2**: Sidebar 컴포넌트

- 고정 너비 240px
- 화면 좌측에 고정 배치
- 세로 전체 높이 사용

**FR-3**: DashboardLayout 위젯

- Header + Sidebar + Content 영역 조합
- children으로 페이지 콘텐츠 렌더링

**FR-4**: 라우터 구성

- `/`: 메인 대시보드 페이지 (DashboardLayout 적용)

**FR-5**: 페이지 컴포넌트

- MainPage: 대시보드 메인 페이지

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- widgets 레이어에 컴포넌트 배치
- 각 위젯별 디렉토리 분리 (header/, sidebar/)
- Public API는 index.ts를 통해 노출

**TR-2**: Tailwind CSS 스타일링

- 인라인 스타일 대신 Tailwind 클래스 사용
- 커스텀 색상값은 임의 값 문법 사용 (`bg-[#FFFFFF]`)

**TR-3**: TypeScript

- 컴포넌트 Props 타입 정의
- 함수 컴포넌트 형태

### Non-Functional Requirements

**NFR-1**: 코드 품질

- TypeScript 에러 없음
- Biome 린트 통과
- 빌드 성공

---

## 3. Architecture & Design

### FSD Architecture Overview

```
src/
├── app/              # 앱 설정, providers, 라우팅
├── pages/            # 페이지 컴포넌트 (라우트별)
├── widgets/          # 복합 UI 블록 ← Header, Sidebar 위치
├── features/         # 기능 단위 (사용자 액션)
├── entities/         # 비즈니스 엔티티
└── shared/           # 재사용 유틸리티, UI 기본 컴포넌트
```

### Directory Structure

```
src/
├── app/
│   └── providers/               # 기존 유지
├── pages/
│   ├── main/
│   │   ├── ui/
│   │   │   └── MainPage.tsx     (CREATE)
│   │   └── index.ts             (CREATE)
│   └── index.ts                 (CREATE)
├── widgets/
│   ├── header/
│   │   ├── ui/
│   │   │   └── Header.tsx       (CREATE)
│   │   └── index.ts             (CREATE)
│   ├── sidebar/
│   │   ├── ui/
│   │   │   └── DashboardSidebar.tsx  (CREATE)
│   │   └── index.ts             (CREATE)
│   ├── layout/
│   │   ├── ui/
│   │   │   └── DashboardLayout.tsx   (CREATE)
│   │   └── index.ts             (CREATE)
│   └── index.ts                 (CREATE)
├── App.tsx                      (MODIFY - 라우터 설정)
```

### Design Decisions

**Decision 1**: widgets 레이어 선택

- **Rationale**: Header와 Sidebar는 앱 전체에서 사용되는 복합 레이아웃 컴포넌트
- **Alternative**: shared/ui/ (단순 UI 컴포넌트일 경우)
- **Impact**: LOW

**Decision 2**: 위젯별 디렉토리 분리

- **Rationale**: FSD의 slice 개념을 따라 header/, sidebar/ 분리
- **Benefit**: 각 위젯의 독립적 확장 가능 (model, lib 등 추가 가능)

**Decision 3**: Tailwind 임의 값 사용

- **Rationale**: 커스텀 색상값(#F3F4F5, #FFFFFF)을 사용하기 위해
- **Alternative**: shared/에 디자인 토큰 정의 (향후 개선 가능)

### Component Design

**Header** (`src/widgets/header/ui/Header.tsx`):

```typescript
interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className="h-[54px] bg-[#FFFFFF] border-b border-[#F3F4F5] flex items-center justify-between px-4">
      <div>{/* Logo placeholder */}</div>
      <div>{/* Avatar placeholder */}</div>
    </header>
  );
}
```

**DashboardSidebar** (`src/widgets/sidebar/ui/DashboardSidebar.tsx`):

```typescript
interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  return (
    <aside className="w-[240px] bg-[#FFFFFF] h-full">
      {/* Sidebar content */}
    </aside>
  );
}
```

**DashboardLayout** (`src/widgets/layout/ui/DashboardLayout.tsx`):

```typescript
import type { ReactNode } from "react";
import { Header } from "@/widgets/header";
import { DashboardSidebar } from "@/widgets/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <Header />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
```

**MainPage** (`src/pages/main/ui/MainPage.tsx`):

```typescript
export function MainPage() {
  return (
    <div className="p-6">
      <h1>Dashboard</h1>
    </div>
  );
}
```

**App.tsx (라우터)**:

```typescript
import { Route, Routes } from "react-router";
import { MainPage } from "@/pages/main";
import { DashboardLayout } from "@/widgets/layout";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <MainPage />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}
```

### Public API (배럴 exports)

```typescript
// src/widgets/header/index.ts
export { Header } from "./ui/Header";

// src/widgets/sidebar/index.ts
export { DashboardSidebar } from "./ui/DashboardSidebar";

// src/widgets/layout/index.ts
export { DashboardLayout } from "./ui/DashboardLayout";

// src/widgets/index.ts
export { Header } from "./header";
export { DashboardSidebar } from "./sidebar";
export { DashboardLayout } from "./layout";

// src/pages/main/index.ts
export { MainPage } from "./ui/MainPage";

// src/pages/index.ts
export { MainPage } from "./main";
```

---

## 4. Implementation Plan

### Phase 1: Setup - FSD 디렉토리 구조

**Tasks**:

1. `src/widgets/header/ui/` 디렉토리 생성
2. `src/widgets/sidebar/ui/` 디렉토리 생성
3. `src/widgets/layout/ui/` 디렉토리 생성
4. `src/pages/main/ui/` 디렉토리 생성

**Files to Create**:

- `src/widgets/header/index.ts` (CREATE)
- `src/widgets/sidebar/index.ts` (CREATE)
- `src/widgets/layout/index.ts` (CREATE)
- `src/widgets/index.ts` (CREATE)
- `src/pages/main/index.ts` (CREATE)
- `src/pages/index.ts` (CREATE)

### Phase 2: Widgets Implementation

**Tasks**:

1. Header 컴포넌트 구현
2. DashboardSidebar 컴포넌트 구현
3. DashboardLayout 컴포넌트 구현

**Files to Create**:

- `src/widgets/header/ui/Header.tsx` (CREATE)
- `src/widgets/sidebar/ui/DashboardSidebar.tsx` (CREATE)
- `src/widgets/layout/ui/DashboardLayout.tsx` (CREATE)

### Phase 3: Pages & Router

**Tasks**:

1. MainPage 구현
2. App.tsx 라우터 설정

**Files to Create/Modify**:

- `src/pages/main/ui/MainPage.tsx` (CREATE)
- `src/App.tsx` (MODIFY)

### Vercel React Best Practices

**적용 규칙**:

- 간단한 UI 컴포넌트이므로 특별한 최적화 불필요
- Props 타입 명시로 타입 안정성 확보
- 레이아웃 컴포넌트에서 children 패턴 사용

---

## 5. Quality Gates

### Acceptance Criteria

- [x] Header 컴포넌트 구현 (54px 높이, 하단 border)
- [x] Dashboard Sidebar 컴포넌트 구현 (240px 너비)
- [x] TypeScript 타입 정의 완료
- [x] Tailwind CSS 스타일링 적용
- [x] 빌드 및 린트 통과

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

---

## 6. Risks & Dependencies

### Risks

**R-1**: 로고/아바타 에셋 부재

- **Risk**: 실제 로고와 아바타 이미지가 없음
- **Impact**: LOW
- **Mitigation**: 플레이스홀더 텍스트 또는 아이콘 사용

### Dependencies

**D-1**: Tailwind CSS

- **Dependency**: Tailwind CSS가 이미 설정되어 있음
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 컴포넌트 구현 및 로컬 테스트
2. PR 생성 및 코드 리뷰
3. main 브랜치 병합

---

## 8. Timeline & Milestones

### Milestones

**M1**: 컴포넌트 구현 완료

- Header, DashboardSidebar 구현
- 빌드 및 린트 통과

---

## 9. References

### Related Issues

- Issue #6: [Feature] Header, Dashboard Sidebar 컴포넌트 생성

### Documentation

- [CLAUDE.md](../../CLAUDE.md)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-25
**Implemented By**: Claude Opus 4.5

### Changes Made

**Widgets Layer (src/widgets/)**:

- `header/ui/Header.tsx` - 54px 높이, 하단 border #F3F4F5, 좌측/우측 스켈레톤 placeholder
- `sidebar/ui/DashboardSidebar.tsx` - 240px 너비, padding (left 34px, top/bottom 20px)
- `sidebar/ui/SidebarListHeader.tsx` - 팀 목록 헤더 (196x38px, meatball 아이콘)
- `layout/ui/DashboardLayout.tsx` - Header + Sidebar + Content 조합
- 각 위젯별 `index.ts` barrel exports

**Pages Layer (src/pages/)**:

- `main/ui/MainPage.tsx` - 대시보드 메인 페이지
- barrel exports (`index.ts`)

**Shared Assets (src/shared/assets/svg/)**:

- `ic_meatball_24.svg` - 더보기 아이콘
- `ic_caret_down_24.svg` - 펼치기/접기 아이콘

**Router (src/app/App.tsx)**:

- `/` 경로에 DashboardLayout + MainPage 연결

### Deviations from Plan

**Changed**:

- 원본 이슈: `src/components/layout/` → 실제: `src/widgets/` (FSD 아키텍처 적용)

**Out of Scope** (다른 담당자):

- SidebarAccordion 컴포넌트 (아코디언 기능)

### Quality Validation

- [x] Build: Success (`npm run build`)
- [x] Type Check: Passed (`npx tsc --noEmit`)
- [x] Lint: Passed (`npm run lint`)

---

**Plan Status**: Completed
**Last Updated**: 2026-01-25
