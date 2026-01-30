# Task Plan: cn tailwind util 함수 추가

**Issue**: #18
**Type**: Chore
**Created**: 2026-01-25
**Status**: Planning

---

## 1. Overview

### Problem Statement

프로젝트에서 Tailwind CSS 클래스를 조합할 때 조건부 클래스와 중복 클래스 병합을 효율적으로 처리해야 합니다.

- `clsx`와 `tailwind-merge` 패키지가 이미 설치되어 있지만, 이를 통합하는 `cn` 유틸리티 함수가 없습니다.
- 향후 모든 컴포넌트에서 스타일링에 활용될 핵심 유틸리티입니다.

### Objectives

1. `clsx`와 `tailwind-merge`를 결합한 `cn` 유틸리티 함수 생성
2. FSD 아키텍처에 따라 `src/shared/lib/` 경로에 배치
3. Public API(`index.ts`)를 통한 export 설정

### Scope

**In Scope**:

- `src/shared/lib/cn.ts` 파일 생성
- `src/shared/lib/index.ts` Public API 설정
- 빌드 및 타입 체크 통과 검증

**Out of Scope**:

- 기존 컴포넌트의 className 로직 리팩토링 (별도 이슈)
- 테스트 코드 작성 (단순 유틸리티이므로)

---

## 2. Requirements

### Functional Requirements

**FR-1**: cn 함수 구현

- `clsx`를 사용하여 조건부 클래스 처리
- `tailwind-merge`를 사용하여 Tailwind 클래스 충돌 해결
- 가변 인자를 받아 문자열 반환

### Technical Requirements

**TR-1**: FSD 아키텍처 준수

- `src/shared/lib/` 경로에 배치
- Public API를 통해서만 외부 노출

**TR-2**: TypeScript 타입 안전성

- `clsx`의 `ClassValue` 타입 활용
- 명확한 반환 타입 정의

### Non-Functional Requirements

**NFR-1**: 성능

- 최소한의 런타임 오버헤드
- 번들 사이즈 영향 최소화 (이미 설치된 패키지 활용)

---

## 3. Architecture & Design

### Directory Structure

```
src/
└── shared/
    ├── assets/          # 기존 assets
    │   └── index.ts
    └── lib/             # 새로 생성
        ├── cn.ts        # cn 유틸리티 함수
        └── index.ts     # Public API
```

### Design Decisions

**Decision 1**: clsx + tailwind-merge 조합

- **Rationale**: shadcn/ui에서 사용하는 표준 패턴
- **Approach**: `twMerge(clsx(inputs))` 형태로 조합
- **Trade-offs**: 두 라이브러리 의존성 → 이미 설치되어 있으므로 영향 없음
- **Impact**: LOW

**Decision 2**: FSD shared/lib 배치

- **Rationale**: FSD 아키텍처 규칙 준수, 공통 유틸리티로서 적합
- **Implementation**: `src/shared/lib/cn.ts`에 구현, `index.ts`로 export
- **Benefit**: 일관된 import 경로 (`@/shared/lib`)

### Component Design

```typescript
// src/shared/lib/cn.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**사용 예시**:

```typescript
import { cn } from "@/shared/lib";

// 조건부 클래스
cn("base-class", isActive && "active-class");

// Tailwind 클래스 충돌 해결
cn("p-4", "p-2"); // → 'p-2' (나중 것이 우선)

// 복잡한 조합
cn(
  "flex items-center",
  variant === "primary" && "bg-blue-500",
  variant === "secondary" && "bg-gray-500",
  className
);
```

---

## 4. Implementation Plan

### Phase 1: 폴더 및 파일 생성

**Tasks**:

1. `src/shared/lib/` 폴더 생성
2. `src/shared/lib/cn.ts` 파일 생성
3. `src/shared/lib/index.ts` Public API 생성

**Files to Create**:

- `src/shared/lib/cn.ts` (CREATE)
- `src/shared/lib/index.ts` (CREATE)

**Estimated Effort**: Small

### Phase 2: 검증

**Tasks**:

1. 빌드 테스트
2. 타입 체크
3. 린트 검증

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

- [x] `src/shared/lib/cn.ts` 파일 생성
- [x] `src/shared/lib/index.ts` Public API 설정
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] FSD 아키텍처 규칙 준수

---

## 6. Risks & Dependencies

### Risks

**R-1**: 없음

- 단순한 유틸리티 함수로 리스크 없음

### Dependencies

**D-1**: clsx 패키지

- **Status**: AVAILABLE (v2.1.1 설치됨)

**D-2**: tailwind-merge 패키지

- **Status**: AVAILABLE (v3.4.0 설치됨)

---

## 7. Rollout & Monitoring

### Deployment Strategy

- PR 머지 후 즉시 사용 가능
- 기존 컴포넌트 마이그레이션은 별도 이슈로 진행

### Success Metrics

**SM-1**: 빌드 성공

- **Metric**: CI/CD 파이프라인 통과
- **Target**: 100% 성공

---

## 8. Timeline & Milestones

### Milestones

**M1**: cn 유틸리티 구현 완료

- 파일 생성 및 함수 구현
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #18: [cn tailwind util 함수 추가](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/18)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [FSD 아키텍처 가이드](../../.claude/rules/fsd.md)

### External Resources

- [clsx 문서](https://github.com/lukeed/clsx)
- [tailwind-merge 문서](https://github.com/dcastil/tailwind-merge)
- [shadcn/ui cn 함수 패턴](https://ui.shadcn.com/docs/installation)

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.

---

**Plan Status**: Planning
**Last Updated**: 2026-01-25
**Next Action**: 구현 시작
