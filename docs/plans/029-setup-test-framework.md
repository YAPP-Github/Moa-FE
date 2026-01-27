# Task Plan: 테스트 프레임워크 셋업

**Issue**: #29
**Type**: Test
**Created**: 2026-01-27
**Status**: Planning

---

## 1. Overview

### Problem Statement

프로젝트에 테스트 프레임워크가 구성되어 있지 않습니다.

- 코드 품질 검증을 위한 자동화된 테스트 환경이 없음
- 회귀 테스트 불가로 리팩토링 시 사이드 이펙트 확인 어려움
- CI/CD 파이프라인에서 테스트 검증 단계 부재

### Objectives

1. Vitest 기반 테스트 프레임워크 설정 (Vite와 네이티브 통합)
2. React Testing Library 연동으로 컴포넌트 테스트 지원
3. TypeScript 완전 지원
4. `pnpm test` 명령으로 테스트 실행 가능

### Scope

**In Scope**:

- Vitest 설치 및 설정
- React Testing Library 설치 및 설정
- jsdom 환경 설정
- package.json 스크립트 추가
- TypeScript 설정 연동

**Out of Scope**:

- E2E 테스트 (Playwright/Cypress)
- 코드 커버리지 리포트 설정 (추후 작업)
- CI/CD 파이프라인 수정

---

## 2. Requirements

### Functional Requirements

**FR-1**: 테스트 실행

- `pnpm test` 명령으로 모든 테스트 실행
- `pnpm test:watch` 명령으로 watch 모드 실행
- `src/**/*.test.ts`, `src/**/*.test.tsx` 파일 자동 인식

**FR-2**: 컴포넌트 테스트

- React 컴포넌트 렌더링 및 인터랙션 테스트
- DOM 쿼리 (getByRole, getByText 등) 지원
- userEvent를 통한 사용자 상호작용 시뮬레이션

### Technical Requirements

**TR-1**: Vitest 설정

- Vite 설정과 통합 (vite.config.ts 확장)
- jsdom 환경 사용
- TypeScript 지원
- 경로 별칭 (`@/`) 지원

**TR-2**: Testing Library 설정

- @testing-library/react 연동
- @testing-library/jest-dom matchers 확장
- @testing-library/user-event 지원

### Non-Functional Requirements

**NFR-1**: 개발자 경험

- 빠른 테스트 실행 (HMR 지원)
- 명확한 에러 메시지
- IDE 통합 (VSCode Vitest Extension)

**NFR-2**: 유지보수성

- 기존 빌드/린트와 충돌 없음
- 향후 확장 가능한 구조

---

## 3. Architecture & Design

### Directory Structure

```
project/
├── src/
│   └── shared/
│       └── config/
│           └── test/
│               └── setup.ts           # 테스트 setup 파일 (CREATE)
├── vite.config.ts                     # Vite + Vitest 통합 설정 (MODIFY)
├── package.json                       # 스크립트 및 의존성 추가 (MODIFY)
└── tsconfig.json                      # 테스트 타입 참조 (MODIFY - 필요시)
```

### Design Decisions

**Decision 1**: Vitest 선택 (Jest 대신)

- **Rationale**: Vite 기반 프로젝트이므로 네이티브 통합 가능
- **Approach**: vite.config.ts 확장 방식 또는 별도 vitest.config.ts 사용
- **Trade-offs**:
  - 장점: Vite와 설정 공유, 빠른 실행, ESM 네이티브 지원
  - 단점: Jest 대비 생태계가 작음 (하지만 Jest 호환 API 제공)
- **Impact**: HIGH

**Decision 2**: vite.config.ts에 테스트 설정 통합

- **Rationale**: 설정 파일 하나로 관리, 중복 제거
- **Implementation**: vite.config.ts에 `test` 속성 추가 + vitest/config 타입 참조
- **Benefit**: 설정 파일 단순화, alias 등 공통 설정 공유

**Decision 3**: jsdom 환경 사용 (happy-dom 대신)

- **Rationale**: 더 넓은 호환성과 안정성
- **Trade-offs**: happy-dom이 더 빠르지만 jsdom이 더 정확함

### Component Design

**테스트 Setup 파일** (`src/shared/config/test/setup.ts`):

```typescript
import "@testing-library/jest-dom/vitest";
```

**Vite + Vitest 통합 설정** (`vite.config.ts`):

```typescript
/// <reference types="vitest/config" />
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/shared/config/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
```

---

## 4. Implementation Plan

### Phase 1: 의존성 설치

**Tasks**:

1. Vitest 및 관련 패키지 설치
2. React Testing Library 패키지 설치

**Commands**:

```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Packages**:

- `vitest`: 테스트 러너
- `jsdom`: DOM 시뮬레이션 환경
- `@testing-library/react`: React 컴포넌트 테스트 유틸리티
- `@testing-library/jest-dom`: DOM 매처 확장
- `@testing-library/user-event`: 사용자 이벤트 시뮬레이션

### Phase 2: 설정 파일 생성

**Tasks**:

1. vite.config.ts에 테스트 설정 추가
2. src/test/setup.ts 생성
3. package.json 스크립트 추가

**Files to Create**:

- `src/test/setup.ts` (CREATE)

**Files to Modify**:

- `vite.config.ts` (MODIFY) - 테스트 설정 추가
- `package.json` (MODIFY) - 스크립트 추가

### Phase 3: 검증 및 정리

**Tasks**:

1. `pnpm test` 실행 확인
2. `pnpm build` 충돌 없음 확인
3. TypeScript 타입 체크 통과 확인

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 테스트 프레임워크 동작 검증

- 테스트 타입: Unit
- 검증 방법: `pnpm test` 명령 실행 확인

**TS-2**: 빌드 검증

```bash
pnpm build        # 빌드 성공 필수
pnpm tsc --noEmit # 타입 오류 없음
pnpm lint         # 린트 통과
```

### Acceptance Criteria

- [x] 테스트 프레임워크 설치 및 설정 완료
- [ ] `pnpm test` 스크립트 동작 확인
- [ ] 기존 빌드/린트 명령어와 충돌 없음

### Validation Checklist

**기능 동작**:

- [ ] `pnpm test` 실행 시 테스트 통과
- [ ] `pnpm test:watch` 실행 시 watch 모드 동작
- [ ] 경로 별칭 (`@/`) 테스트 파일에서 동작

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음

**호환성**:

- [ ] `pnpm build` 정상 동작
- [ ] `pnpm dev` 정상 동작
- [ ] Storybook 정상 동작

---

## 6. Risks & Dependencies

### Risks

**R-1**: Vitest와 기존 설정 충돌

- **Risk**: vite.config.ts 확장 시 플러그인 충돌 가능
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: mergeConfig 사용하여 안전하게 병합
- **Status**: 모니터링

**R-2**: TypeScript 타입 에러

- **Risk**: vitest 타입과 기존 타입 충돌
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: tsconfig 분리 또는 types 설정 조정

### Dependencies

**D-1**: Node.js 22+

- **Dependency**: package.json에 명시된 Node.js 버전
- **Required For**: Vitest 실행
- **Status**: AVAILABLE

**D-2**: Vite 7.x

- **Dependency**: 현재 설치된 Vite 버전
- **Required For**: Vitest 통합
- **Status**: AVAILABLE

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Phase-based Rollout**:

1. Phase 1: 로컬 환경에서 테스트 프레임워크 동작 확인
2. Phase 2: PR 머지 후 팀원 공유
3. Phase 3: 추후 CI/CD 통합 (별도 이슈)

### Success Metrics

**SM-1**: 테스트 실행 성공률

- **Metric**: 샘플 테스트 통과율
- **Target**: 100%
- **Measurement**: `pnpm test` 결과

---

## 8. Timeline & Milestones

### Milestones

**M1**: 설정 완료

- Vitest 설치 및 설정 완료
- package.json 스크립트 추가
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #29: [Test] 테스트 프레임워크 셋업

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)

### External Resources

- [Vitest 공식 문서](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Jest-DOM](https://github.com/testing-library/jest-dom)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-27
**Implemented By**: Claude Opus 4.5

### Changes Made

**Files Created**:

- `src/shared/config/test/setup.ts` - jest-dom matchers 설정
- `src/shared/ui/button/Button.test.tsx` - 샘플 테스트 파일

**Files Modified**:

- `package.json` - 테스트 스크립트 및 의존성 추가
- `vite.config.ts` - Vitest 테스트 설정 통합
- `.npmrc` - engine-strict=false 설정 (Node 23 호환)

### Installed Packages

- `vitest` ^4.0.18
- `jsdom` ^27.4.0
- `@testing-library/react` ^16.3.2
- `@testing-library/jest-dom` ^6.9.1
- `@testing-library/user-event` ^14.6.1
- `@vitest/ui` ^4.0.18

### Available Scripts

```bash
pnpm test        # 테스트 실행
pnpm test:watch  # watch 모드
pnpm test:ui     # Vitest UI (브라우저)
```

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed
- [x] Tests: 1/1 passing

### Deviations from Plan

**Added**:

- `@vitest/ui` 패키지 추가 (브라우저 기반 테스트 UI)
- 테스트 setup 파일 위치를 `src/shared/config/test/`로 변경 (FSD 구조)

**Changed**:

- 별도 `vitest.config.ts` 대신 `vite.config.ts`에 통합

---

**Plan Status**: Completed
**Last Updated**: 2026-01-27
