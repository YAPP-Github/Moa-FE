# Task Plan: Storybook 8 도입

**Issue**: #16
**Type**: Chore
**Created**: 2026-01-25
**Status**: Completed

---

## 1. Overview

### Problem Statement

- 현재 프로젝트에 컴포넌트 개발 및 문서화를 위한 도구가 없음
- UI 컴포넌트를 독립적으로 개발하고 테스트할 환경이 필요
- 팀원 간 컴포넌트 공유 및 디자인 시스템 구축의 기반이 필요

### Objectives

1. Storybook 8 최신 버전 설치 및 설정
2. React 19 + Vite 7 + TypeScript 5.9 환경과 호환되는 설정 구성
3. Tailwind CSS 4 스타일이 Storybook에서 정상 동작하도록 설정

### Scope

**In Scope**:

- Storybook 8 설치 (`@storybook/react-vite`)
- `.storybook/main.ts`, `.storybook/preview.ts` 설정
- Tailwind CSS 통합 (글로벌 스타일 적용)
- TypeScript 설정 및 path alias 지원

**Out of Scope**:

- 다크모드 테마 전환 기능 (사용자 요청에 따라 제외)
- `@storybook/addon-themes` 설치
- 샘플 스토리 파일 (사용자 요청에 따라 제외)

### User Context

> "다크모드는 고려 대상이 아니야."
> "예시 버튼 & 스토리 파일은 다 제거해줘"
> "cn도 제거해"

**핵심 요구사항**:

1. 기본 Storybook 설정에 집중
2. 다크모드 관련 addon 제외
3. 샘플 코드 없이 설정만 제공

---

## 2. Requirements

### Functional Requirements

**FR-1**: Storybook 개발 서버 실행

- `pnpm storybook` 명령어로 개발 서버 실행 가능
- 기본 포트 6006에서 접근 가능

**FR-2**: 스토리 파일 인식

- `**/*.stories.@(js|jsx|mjs|ts|tsx)` 패턴의 파일 자동 인식
- `**/*.mdx` 문서 파일 지원

**FR-3**: Tailwind CSS 스타일 적용

- 글로벌 CSS (`src/index.css`) 스타일이 모든 스토리에 적용

### Technical Requirements

**TR-1**: Storybook 8 + React Vite

- `@storybook/react-vite` 프레임워크 사용
- Vite 7 빌더와 호환

**TR-2**: TypeScript 지원

- `.storybook/main.ts`, `.storybook/preview.ts` TypeScript로 작성
- path alias `@/*` 지원

**TR-3**: React 19 호환성

- React 19 + React DOM 19와 호환

### Non-Functional Requirements

**NFR-1**: 빌드 성능

- Storybook 빌드 시 기존 프로젝트 빌드에 영향 없음
- devDependencies로만 설치

**NFR-2**: 유지보수성

- 표준 Storybook 설정 패턴 따름
- 최소한의 커스텀 설정

---

## 3. Architecture & Design

### Directory Structure

```
project/
├── .storybook/
│   ├── main.ts           # Storybook 메인 설정
│   └── preview.ts        # 글로벌 데코레이터, 스타일
├── src/
│   └── index.css         # Tailwind CSS (기존)
└── package.json          # Storybook 스크립트 추가
```

### Design Decisions

**Decision 1**: `@storybook/react-vite` 프레임워크 선택

- **Rationale**: 프로젝트가 Vite 기반이므로 네이티브 Vite 빌더 사용
- **Approach**: `@storybook/react-vite` 단일 패키지로 프레임워크 + 빌더 통합
- **Trade-offs**: Webpack 대비 빠른 HMR, 그러나 일부 addon 호환성 이슈 가능
- **Alternatives Considered**: `@storybook/react-webpack5` (프로젝트와 빌드 도구 불일치)
- **Impact**: HIGH

**Decision 2**: Essential Addons만 설치

- **Rationale**: 불필요한 의존성 최소화
- **Implementation**: `@storybook/addon-essentials`만 설치 (actions, controls, docs 등 포함)
- **Benefit**: 번들 크기 최적화, 관리 용이

**Decision 3**: Storybook 8 선택 (9/10 대신)

- **Rationale**: Storybook 10은 addon-essentials와 버전 호환성 이슈 발생
- **Implementation**: 모든 Storybook 패키지를 8.6.x로 통일
- **Benefit**: 안정적인 동작, peer dependency 경고 최소화

### Component Design

**Storybook 설정 구조**:

```typescript
// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-essentials"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
```

```typescript
// .storybook/preview.ts
import type { Preview } from "@storybook/react";
import "../src/index.css"; // Tailwind CSS 글로벌 스타일

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

---

## 4. Implementation Plan

### Phase 1: 패키지 설치

**Tasks**:

1. Storybook 핵심 패키지 설치
2. package.json 스크립트 추가

**패키지 목록**:

```bash
pnpm add -D storybook@^8 @storybook/react-vite@^8 @storybook/react@^8 @storybook/addon-essentials@^8
```

**Files to Modify**:

- `package.json` (MODIFY) - devDependencies, scripts 추가

### Phase 2: Storybook 설정

**Tasks**:

1. `.storybook/main.ts` 생성
2. `.storybook/preview.ts` 생성

**Files to Create**:

- `.storybook/main.ts` (CREATE)
- `.storybook/preview.ts` (CREATE)

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: Storybook 빌드 검증

- 테스트 타입: Build
- 명령어: `pnpm build-storybook`
- 기준: 에러 없이 빌드 완료

**TS-2**: 개발 서버 실행 검증

- 테스트 타입: Manual
- 명령어: `pnpm storybook`
- 기준: localhost:6006 접속 가능

**TS-3**: 기존 빌드 영향 없음 검증

```bash
pnpm build          # 프로젝트 빌드 성공
npx tsc --noEmit    # 타입 오류 없음
pnpm lint           # 린트 통과
```

### Acceptance Criteria

- [x] `pnpm storybook` 실행 시 정상 동작
- [x] `.storybook/main.ts`, `.storybook/preview.ts` 설정 파일 생성
- [x] Tailwind CSS 스타일 적용 확인
- [x] Build 성공
- [x] Type check 성공
- [x] Lint 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: Vite 7 호환성

- **Risk**: Storybook 8이 Vite 7을 공식 지원하지 않음 (peer dependency 경고)
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: 테스트 결과 정상 동작 확인
- **Status**: Mitigated

### Dependencies

**D-1**: Vite 설정

- **Dependency**: `vite.config.ts`의 path alias 설정
- **Required For**: Storybook에서 `@/*` import 지원
- **Status**: AVAILABLE (자동 상속)

---

## 7. Rollout & Monitoring

### Deployment Strategy

**개발 환경만 해당**:

1. devDependencies로 설치
2. `.storybook/` 디렉토리 생성
3. 팀원 공유 후 사용

**Rollback Plan**:

- `.storybook/` 디렉토리 삭제
- package.json에서 관련 패키지 및 스크립트 제거

### Success Metrics

**SM-1**: Storybook 정상 동작

- **Metric**: 개발 서버 실행 성공률
- **Target**: 100%
- **Measurement**: `pnpm storybook` 실행

---

## 8. Timeline & Milestones

### Milestones

**M1**: 패키지 설치 및 기본 설정

- Storybook 패키지 설치
- main.ts, preview.ts 생성
- **Status**: COMPLETED

---

## 9. References

### Related Issues

- Issue #16: [[Chore] Storybook 8 도입](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/16)

### External Resources

- [Storybook 8 공식 문서](https://storybook.js.org/docs)
- [Storybook React Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-25
**Implemented By**: Claude Opus 4.5

### Changes Made

**Added Files**:

- `.storybook/main.ts` - Storybook 메인 설정
- `.storybook/preview.ts` - 글로벌 스타일 및 데코레이터

**Modified Files**:

- `package.json` - storybook, build-storybook 스크립트 추가, devDependencies 추가
- `.gitignore` - storybook-static 추가

### Quality Validation

- [x] Build: `pnpm build` 성공
- [x] Type Check: `npx tsc --noEmit` 성공
- [x] Lint: `pnpm lint` 성공
- [x] Storybook: `pnpm storybook` 실행 확인 (HTTP 200)

### Deviations from Plan

**Changed**:

- Storybook 9 → Storybook 8 (addon-essentials 호환성 이슈)

**Skipped** (사용자 요청):

- 샘플 Button 컴포넌트 및 스토리 파일
- cn 유틸리티 함수
- 다크모드 테마 전환 기능

### Installed Packages

```json
"@storybook/addon-essentials": "^8",
"@storybook/react": "^8",
"@storybook/react-vite": "^8",
"storybook": "^8"
```

---

**Plan Status**: Completed
**Last Updated**: 2026-01-25
