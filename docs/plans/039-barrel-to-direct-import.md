# Task Plan: Barrel Export → Direct Import 마이그레이션

**Issue**: #39
**Type**: Refactor
**Created**: 2026-01-29
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 프로젝트에서 22개의 `index.ts` 파일이 ~80개 항목을 re-export하는 Barrel Export 패턴을 사용 중입니다.

- 특히 `shared/assets/index.ts`의 namespace export (`* as`)가 tree-shaking에 불리
- 번들러가 barrel file 전체를 분석해야 하므로 빌드 성능 저하
- 사용하지 않는 export도 번들에 포함될 수 있음

### Objectives

1. Barrel export에서 직접 import 방식으로 전환하여 tree-shaking 최적화
2. 번들 크기 감소 및 빌드 성능 개선
3. 명확한 import 경로로 코드 가독성 향상
4. 문서 업데이트로 새로운 import 컨벤션 정착

### Scope

**In Scope**:

- 6개 Phase에 걸쳐 모든 barrel export 제거
- 18개 파일의 import 경로 수정
- 22개 index.ts 파일 삭제
- assets.md, fsd.md 문서 업데이트

**Out of Scope**:

- 새로운 컴포넌트 추가
- 기능 변경
- 테스트 코드 추가 (리팩토링 범위)

---

## 2. Requirements

### Functional Requirements

**FR-1**: Import 경로 변경

- 모든 barrel import를 직접 import로 변경
- 빌드 및 런타임 동작은 변경 없음

**FR-2**: 미사용 파일 정리

- 더 이상 사용되지 않는 index.ts 파일 삭제

### Technical Requirements

**TR-1**: Tree-shaking 최적화

- namespace export (`* as`) 제거
- 직접 import로 번들러가 정확히 필요한 모듈만 포함하도록 함

**TR-2**: 빌드 검증

- 각 Phase 완료 후 `npm run build`, `npx tsc --noEmit`, `npm run lint` 통과 필수

### Non-Functional Requirements

**NFR-1**: 코드 일관성

- 모든 import 경로가 직접 import 방식을 사용
- 문서와 실제 코드의 일관성 유지

---

## 3. Architecture & Design

### Directory Structure

현재 삭제 대상 index.ts 파일들:

```
src/
├── shared/
│   ├── assets/
│   │   ├── index.ts        ← 삭제 (Phase 1)
│   │   ├── images/
│   │   │   └── index.ts    ← 삭제 (Phase 1)
│   │   └── svg/
│   │       └── index.ts    ← 삭제 (Phase 1)
│   ├── lib/
│   │   └── index.ts        ← 삭제 (Phase 2)
│   └── ui/
│       ├── index.ts        ← 삭제 (Phase 6)
│       ├── accordion/index.ts  ← 삭제 (Phase 6)
│       ├── button/index.ts     ← 삭제 (Phase 6)
│       ├── calendar/index.ts   ← 삭제 (Phase 6)
│       ├── checkbox/index.ts   ← 삭제 (Phase 6)
│       ├── field/index.ts      ← 삭제 (Phase 6)
│       ├── input/index.ts      ← 삭제 (Phase 6)
│       ├── radio-card/index.ts ← 삭제 (Phase 6)
│       └── swiper/index.ts     ← 삭제 (Phase 6)
├── features/
│   ├── auth/
│   │   └── index.ts        ← 삭제 (Phase 3)
│   └── team/
│       └── index.ts        ← 삭제 (Phase 3)
├── widgets/
│   ├── index.ts            ← 삭제 (Phase 4)
│   ├── header/index.ts     ← 삭제 (Phase 4)
│   ├── layout/index.ts     ← 삭제 (Phase 4)
│   └── sidebar/index.ts    ← 삭제 (Phase 4)
└── pages/
    ├── index.ts            ← 삭제 (Phase 5)
    ├── main/index.ts       ← 삭제 (Phase 5)
    └── signin/index.ts     ← 삭제 (Phase 5)
```

### Design Decisions

**Decision 1**: 직접 import 방식 채택

- **Rationale**: Tree-shaking 최적화, 명확한 의존성 추적
- **Approach**: 각 파일에서 필요한 모듈을 직접 import
- **Trade-offs**:
  - 장점: 번들 크기 감소, 빌드 성능 개선
  - 단점: import 경로가 길어짐
- **Impact**: HIGH

**Decision 2**: Phase별 점진적 마이그레이션

- **Rationale**: 각 단계별 빌드 검증으로 안전한 마이그레이션
- **Implementation**: 6개 Phase로 분리하여 순차적 진행
- **Benefit**: 문제 발생 시 빠른 롤백 가능

### Import Pattern Changes

**Assets (Before)**:

```typescript
import { images, svg } from "@/shared/assets";
// 사용: images.imgLogo, svg.icDeleteMd
```

**Assets (After)**:

```typescript
import imgLogo from "@/shared/assets/images/img_logo.jpeg";
import icDeleteMd from "@/shared/assets/svg/ic_delete_md.svg";
// 사용: imgLogo, icDeleteMd
```

**Lib (Before)**:

```typescript
import { cn } from "@/shared/lib";
```

**Lib (After)**:

```typescript
import { cn } from "@/shared/lib/cn";
```

**Features (Before)**:

```typescript
import { LoginStep, type SigninStep } from "@/features/auth";
```

**Features (After)**:

```typescript
import { LoginStep } from "@/features/auth/ui/LoginStep";
import type { SigninStep } from "@/features/auth/model/types";
```

---

## 4. Implementation Plan

### Phase 1: Assets 마이그레이션 (우선순위: HIGH)

**수정 파일** (6개):

| 파일                                      | 변경 내용                                                       |
| ----------------------------------------- | --------------------------------------------------------------- |
| `src/features/auth/ui/LoginStep.tsx`      | `images.imgLogo`, `svg.icKakaoLg`, `svg.icGoogleLg` 직접 import |
| `src/features/auth/ui/NicknameStep.tsx`   | `svg.icDeleteMd` 직접 import                                    |
| `src/features/auth/ui/TeamNameStep.tsx`   | `svg.icDeleteMd` 직접 import                                    |
| `src/features/auth/ui/InviteLinkStep.tsx` | `svg.icDeleteMd` 직접 import                                    |
| `src/pages/signin/ui/SigninPage.tsx`      | `images.imgSigninBanner` 직접 import                            |
| `src/shared/ui/input/Input.tsx`           | `svg.icDeleteMd` 직접 import                                    |

**삭제 파일** (3개):

- `src/shared/assets/index.ts`
- `src/shared/assets/svg/index.ts`
- `src/shared/assets/images/index.ts`

### Phase 2: Shared Lib 마이그레이션

**수정 파일** (7개):

| 파일                                     | 변경 내용                          |
| ---------------------------------------- | ---------------------------------- |
| `src/shared/ui/button/Button.tsx`        | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/field/Field.tsx`          | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/input/Input.tsx`          | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/checkbox/Checkbox.tsx`    | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/swiper/Swiper.tsx`        | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/calendar/Calendar.tsx`    | `@/shared/lib` → `@/shared/lib/cn` |
| `src/shared/ui/radio-card/RadioCard.tsx` | `@/shared/lib` → `@/shared/lib/cn` |

**삭제 파일** (1개):

- `src/shared/lib/index.ts`

### Phase 3: Features 마이그레이션

**수정 파일** (2개):

| 파일                                 | 변경 내용                |
| ------------------------------------ | ------------------------ |
| `src/pages/signin/ui/SigninPage.tsx` | auth feature 직접 import |
| `src/pages/main/ui/MainPage.tsx`     | team feature 직접 import |

**삭제 파일** (2개):

- `src/features/auth/index.ts`
- `src/features/team/index.ts`

### Phase 4: Widgets 마이그레이션

**수정 파일** (2개):

| 파일                                        | 변경 내용                                                  |
| ------------------------------------------- | ---------------------------------------------------------- |
| `src/app/App.tsx`                           | `@/widgets/layout` → `@/widgets/layout/ui/DashboardLayout` |
| `src/widgets/layout/ui/DashboardLayout.tsx` | header, sidebar 직접 import                                |

**삭제 파일** (4개):

- `src/widgets/index.ts`
- `src/widgets/header/index.ts`
- `src/widgets/layout/index.ts`
- `src/widgets/sidebar/index.ts`

### Phase 5: Pages 마이그레이션

**수정 파일** (1개):

| 파일              | 변경 내용                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| `src/app/App.tsx` | `@/pages/main` → `@/pages/main/ui/MainPage`, `@/pages/signin` → `@/pages/signin/ui/SigninPage` |

**삭제 파일** (3개):

- `src/pages/index.ts`
- `src/pages/main/index.ts`
- `src/pages/signin/index.ts`

### Phase 6: 미사용 Shared UI index.ts 정리

**삭제 파일** (9개):

- `src/shared/ui/index.ts`
- `src/shared/ui/accordion/index.ts`
- `src/shared/ui/button/index.ts`
- `src/shared/ui/calendar/index.ts`
- `src/shared/ui/checkbox/index.ts`
- `src/shared/ui/field/index.ts`
- `src/shared/ui/input/index.ts`
- `src/shared/ui/radio-card/index.ts`
- `src/shared/ui/swiper/index.ts`

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: 이 작업의 핵심 - barrel imports 제거

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 검증

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

**TS-2**: Import 검증

```bash
# barrel import가 남아있지 않은지 확인
grep -r "from '@/shared/assets'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/shared/lib'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/features/auth'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/features/team'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/widgets/layout'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/widgets/header'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/widgets/sidebar'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/pages/main'" src/ --include="*.tsx" --include="*.ts"
grep -r "from '@/pages/signin'" src/ --include="*.tsx" --include="*.ts"
```

### Acceptance Criteria

- [x] Phase 1: Assets 마이그레이션 (6개 파일 수정, 3개 index.ts 삭제)
- [x] Phase 2: Shared Lib 마이그레이션 (7개 파일 수정, 1개 index.ts 삭제)
- [x] Phase 3: Features 마이그레이션 (2개 파일 수정, 2개 index.ts 삭제)
- [x] Phase 4: Widgets 마이그레이션 (2개 파일 수정, 4개 index.ts 삭제)
- [x] Phase 5: Pages 마이그레이션 (1개 파일 수정, 3개 index.ts 삭제)
- [x] Phase 6: 미사용 Shared UI index.ts 정리 (9개 index.ts 삭제)
- [x] 문서 업데이트 (assets.md, fsd.md)
- [x] 빌드/린트/타입체크 통과

---

## 6. Risks & Dependencies

### Risks

**R-1**: Import 경로 실수

- **Risk**: 잘못된 import 경로로 빌드 실패
- **Impact**: LOW
- **Probability**: LOW
- **Mitigation**: 각 Phase 후 빌드 검증

**R-2**: 문서와 코드 불일치

- **Risk**: 문서 업데이트 누락으로 혼란 발생
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**: 작업 완료 후 문서 업데이트 포함

### Dependencies

없음 - 독립적인 리팩토링 작업

---

## 7. Rollout & Monitoring

### Deployment Strategy

- 개발 브랜치에서 작업 후 PR 생성
- CI 통과 확인 후 머지

### Success Metrics

**SM-1**: 빌드 성공

- **Metric**: 모든 빌드 명령어 성공
- **Target**: 100% 통과

**SM-2**: 코드 정리

- **Metric**: 삭제된 index.ts 파일 수
- **Target**: 22개 파일 삭제

---

## 8. Timeline & Milestones

### Milestones

**M1**: Phase 1-3 완료

- Assets, Lib, Features 마이그레이션
- **Status**: NOT_STARTED

**M2**: Phase 4-6 완료

- Widgets, Pages, Shared UI 마이그레이션
- **Status**: NOT_STARTED

**M3**: 문서 업데이트 및 최종 검증

- assets.md, fsd.md 업데이트
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #39: [Barrel Export → Direct Import 마이그레이션](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/39)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/assets.md](../../.claude/rules/assets.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Barrel Files and Why You Should Stop Using Them](https://tkdodo.eu/blog/please-stop-using-barrel-files)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-29
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Modified (19개)

**Phase 1: Assets 마이그레이션**

- `src/features/auth/ui/LoginStep.tsx` - barrel import → 직접 import (imgLogo, icGoogleLg, icKakaoLg)
- `src/features/auth/ui/NicknameStep.tsx` - barrel import → 직접 import (icDeleteMd)
- `src/features/auth/ui/TeamNameStep.tsx` - barrel import → 직접 import (icDeleteMd)
- `src/features/auth/ui/InviteLinkStep.tsx` - barrel import → 직접 import (icDeleteMd)
- `src/pages/signin/ui/SigninPage.tsx` - barrel import → 직접 import (imgSigninBanner)
- `src/shared/ui/input/Input.tsx` - barrel import → 직접 import (icDeleteMd), 상대 import 수정

**Phase 2: Shared Lib 마이그레이션**

- `src/shared/ui/button/Button.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/field/Field.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/input/Input.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/checkbox/Checkbox.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/swiper/Swiper.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/calendar/Calendar.tsx` - `@/shared/lib` → `@/shared/lib/cn`
- `src/shared/ui/radio-card/RadioCard.tsx` - `@/shared/lib` → `@/shared/lib/cn`

**Phase 3: Features 마이그레이션**

- `src/pages/signin/ui/SigninPage.tsx` - auth feature 직접 import
- `src/pages/main/ui/MainPage.tsx` - team feature 직접 import

**Phase 4 & 5: Widgets & Pages 마이그레이션**

- `src/app/App.tsx` - widgets, pages 직접 import
- `src/widgets/layout/ui/DashboardLayout.tsx` - header, sidebar 직접 import

**추가 수정 (계획 외)**

- `src/shared/ui/field/Field.stories.tsx` - 상대 import 수정 (`../input` → `../input/Input`)
- `src/widgets/sidebar/ui/SidebarListHeader.tsx` - barrel import → 직접 import (icMeatball24)

**문서 업데이트**

- `.claude/rules/assets.md` - 직접 import 방식으로 예시 변경
- `.claude/rules/fsd.md` - barrel export → 직접 import 규칙 업데이트

#### Files Deleted (22개)

**Phase 1**: `src/shared/assets/index.ts`, `src/shared/assets/svg/index.ts`, `src/shared/assets/images/index.ts`
**Phase 2**: `src/shared/lib/index.ts`
**Phase 3**: `src/features/auth/index.ts`, `src/features/team/index.ts`
**Phase 4**: `src/widgets/index.ts`, `src/widgets/header/index.ts`, `src/widgets/layout/index.ts`, `src/widgets/sidebar/index.ts`
**Phase 5**: `src/pages/index.ts`, `src/pages/main/index.ts`, `src/pages/signin/index.ts`
**Phase 6**: `src/shared/ui/index.ts`, `src/shared/ui/accordion/index.ts`, `src/shared/ui/button/index.ts`, `src/shared/ui/calendar/index.ts`, `src/shared/ui/checkbox/index.ts`, `src/shared/ui/field/index.ts`, `src/shared/ui/input/index.ts`, `src/shared/ui/radio-card/index.ts`, `src/shared/ui/swiper/index.ts`

### Quality Validation

- [x] Build: Success (✓ 113 modules transformed, built in 690ms)
- [x] Type Check: Passed (`npx tsc --noEmit`)
- [x] Lint: Passed (Checked 50 files in 12ms. No fixes applied.)
- [x] Best Practices: Applied `bundle-barrel-imports` (CRITICAL)

### Deviations from Plan

**Added**:

- `src/shared/ui/field/Field.stories.tsx` - 상대 import 수정 필요 (계획에 없었음)
- `src/widgets/sidebar/ui/SidebarListHeader.tsx` - barrel import 수정 필요 (계획에 없었음)

**Changed**:

- 없음 - 계획대로 진행

**Skipped**:

- 없음 - 모든 계획 완료

### Performance Impact

- 번들 크기: 변화 없음 (264.66 kB gzip: 83.46 kB)
- Tree-shaking 최적화로 향후 번들 크기 감소 기대
- 빌드 시간: 변화 없음 (~600ms)

### Follow-up Tasks

없음 - 완전한 마이그레이션 완료

### Notes

- 6개 Phase 모두 성공적으로 완료
- 22개 index.ts 파일 삭제로 코드베이스 정리
- 문서 업데이트 완료 (assets.md, fsd.md)
- 모든 import 경로가 직접 import 방식으로 통일됨

---

**Plan Status**: Completed
**Last Updated**: 2026-01-29
**Completed**: 2026-01-29
