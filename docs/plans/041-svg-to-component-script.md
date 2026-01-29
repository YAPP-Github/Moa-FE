# Task Plan: SVG 아이콘을 React 컴포넌트로 변환하는 스크립트 구현

**Issue**: #41
**Type**: Feature
**Created**: 2026-01-30
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 SVG 아이콘을 `<img>` 태그로 사용하고 있어 fill, stroke 등 스타일 커스터마이징이 불가능합니다.

- 현재 상황: `<img src={icDeleteMd} alt="" />` 형태로 SVG를 정적 이미지처럼 사용
- 문제점: `currentColor` 활용 불가, props를 통한 동적 스타일링 불가
- 영향: 다크모드, 호버 상태 등에서 아이콘 색상 변경이 어려움

### Objectives

1. SVGR CLI를 사용하여 SVG 파일을 React 컴포넌트로 변환
2. `npm run generate:icons` 명령어로 언제든 재변환 가능하게 구성
3. 기존 사용처 1개 이상 마이그레이션 예시 제공

### Scope

**In Scope**:

- SVGR CLI 설치 및 설정 (`svgr.config.js`)
- SVG → React 컴포넌트 변환 npm script 추가
- 8개 SVG 파일 모두 컴포넌트로 변환
- TypeScript 타입 지원 (`SVGProps<SVGSVGElement>`)
- 기존 사용처 1개 마이그레이션 예시

**Out of Scope**:

- 모든 기존 사용처 마이그레이션 (별도 이슈로 진행)
- SVG 스프라이트 시스템 구축
- 아이콘 라이브러리 (Lucide, Heroicons 등) 도입

### User Context

> "지금 svg 아이콘을 img태그에 넣어서 사용하고 있는데 스타일을 커스텀할 수 없어. 그래서 svg 아이콘을 컴포넌트로 변환해서 그걸 사용하려 해."

**핵심 요구사항**:

1. SVG 아이콘의 색상, 크기 등을 동적으로 제어 가능해야 함
2. SVGR 라이브러리 사용 고려

---

## 2. Requirements

### Functional Requirements

**FR-1**: SVG → React 컴포넌트 변환

- `src/shared/assets/svg/*.svg` 파일들을 `src/shared/ui/icons/` React 컴포넌트로 변환
- 네이밍: `ic_check_lg.svg` → `IcCheckLg.tsx`
- 생성된 컴포넌트는 표준 SVG props 지원

**FR-2**: npm script 제공

- `npm run generate:icons` 명령어로 변환 실행
- 기존 컴포넌트 덮어쓰기 (재생성 가능)

**FR-3**: 동적 스타일링 지원

- `currentColor` 활용으로 부모 색상 상속
- `className`, `style` props로 커스터마이징 가능
- `width`, `height` props로 크기 조절 가능

### Technical Requirements

**TR-1**: SVGR CLI 사용

- 패키지: `@svgr/cli` (devDependency)
- 설정 파일: `svgr.config.js`
- TypeScript 지원 활성화

**TR-2**: SVGO 최적화

- viewBox 유지 (removeViewBox: false)
- 불필요한 속성 제거
- 하드코딩된 색상 → currentColor 변환

**TR-3**: FSD 아키텍처 준수

- 생성 위치: `src/shared/ui/icons/`
- 직접 import 방식 유지 (barrel export 미사용)

### Non-Functional Requirements

**NFR-1**: 유지보수성

- 새 SVG 추가 시 동일 명령어로 변환 가능
- 설정 파일로 옵션 커스터마이징 가능

**NFR-2**: 타입 안전성

- 모든 생성 컴포넌트에 TypeScript 타입 적용
- `SVGProps<SVGSVGElement>` 인터페이스 사용

---

## 3. Architecture & Design

### Directory Structure

```
project/
├── src/
│   └── shared/
│       ├── assets/
│       │   └── svg/                    # 원본 SVG 파일 (유지)
│       │       ├── ic_caret_down_24.svg
│       │       ├── ic_check_lg.svg
│       │       ├── ic_delete_md.svg
│       │       ├── ic_google_lg.svg
│       │       ├── ic_info_md.svg
│       │       ├── ic_kakao_lg.svg
│       │       ├── ic_meatball_24.svg
│       │       └── ic_star_md.svg
│       └── ui/
│           └── icons/                  # 생성될 아이콘 컴포넌트
│               ├── IcCaretDown24.tsx
│               ├── IcCheckLg.tsx
│               ├── IcDeleteMd.tsx
│               ├── IcGoogleLg.tsx
│               ├── IcInfoMd.tsx
│               ├── IcKakaoLg.tsx
│               ├── IcMeatball24.tsx
│               └── IcStarMd.tsx
├── svgr.config.js                      # SVGR 설정
├── svgo.config.js                      # SVGO 설정
└── package.json                        # npm script 추가
```

### Design Decisions

**Decision 1**: SVGR CLI 사용 (Option A)

- **Rationale**: 검증된 라이브러리, TypeScript 지원, 커뮤니티 활발, 유지보수 용이
- **Approach**: `@svgr/cli`를 devDependency로 설치, `svgr.config.js`로 설정
- **Trade-offs**:
  - 장점: 안정성, 다양한 옵션, 플러그인 시스템
  - 단점: 외부 의존성 추가 (~2MB)
- **Alternatives Considered**:
  - 커스텀 Node.js 스크립트 (유지보수 부담)
  - SVGR + 래퍼 스크립트 (과도한 복잡성)
- **Impact**: LOW (devDependency만 추가)

**Decision 2**: 하드코딩 색상 → currentColor 변환

- **Rationale**: 부모 요소의 `color` CSS 속성을 상속받아 동적 스타일링 가능
- **Implementation**: SVGR `replaceAttrValues` 옵션으로 특정 색상을 `currentColor`로 변환
- **Benefit**: 다크모드, 호버 상태 등에서 자동으로 색상 변경

**Decision 3**: 직접 import 방식 유지 (index.ts 미생성)

- **Rationale**: FSD 규칙 및 tree-shaking 최적화
- **Implementation**: SVGR `--no-index` 옵션으로 index 파일 생성 방지
- **Benefit**: 사용하지 않는 아이콘이 번들에 포함되지 않음

### Component Design

**생성될 컴포넌트 예시**:

```typescript
// src/shared/ui/icons/IcDeleteMd.tsx
import type { SVGProps } from "react";

const IcDeleteMd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 18 18"
    {...props}
  >
    <circle cx={9} cy={9} r={7.875} fill="currentColor" />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.125}
      d="m6.188 6.188 5.625 5.625M6.188 11.813l5.625-5.625"
    />
  </svg>
);

export default IcDeleteMd;
```

**사용 예시**:

```tsx
import IcDeleteMd from '@/shared/ui/icons/IcDeleteMd';

// 기본 사용
<IcDeleteMd />

// 크기 조절
<IcDeleteMd width={24} height={24} />

// 색상 변경 (currentColor 활용)
<IcDeleteMd className="text-red-500" />

// 스타일 직접 지정
<IcDeleteMd style={{ color: '#FF0000' }} />
```

---

## 4. Implementation Plan

### Phase 1: Setup & Configuration

**Tasks**:

1. `@svgr/cli` devDependency 설치
2. `svgr.config.js` 설정 파일 생성
3. `svgo.config.js` 설정 파일 생성
4. `package.json`에 `generate:icons` 스크립트 추가

**Files to Create/Modify**:

- `svgr.config.js` (CREATE)
- `svgo.config.js` (CREATE)
- `package.json` (MODIFY - scripts, devDependencies)

### Phase 2: Icon Generation

**Tasks**:

1. `npm run generate:icons` 실행하여 컴포넌트 생성
2. 생성된 컴포넌트 검증 (TypeScript 타입, 구조)
3. 빌드 테스트

**Files to Create**:

- `src/shared/ui/icons/IcCaretDown24.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcCheckLg.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcDeleteMd.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcGoogleLg.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcInfoMd.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcKakaoLg.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcMeatball24.tsx` (AUTO-GENERATE)
- `src/shared/ui/icons/IcStarMd.tsx` (AUTO-GENERATE)

### Phase 3: Migration Example

**Tasks**:

1. `src/shared/ui/input/Input.tsx`에서 기존 `<img>` 사용을 컴포넌트로 변경
2. 동작 검증

**Files to Modify**:

- `src/shared/ui/input/Input.tsx` (MODIFY)

### Vercel React Best Practices

**CRITICAL**:

- `bundle-barrel-imports`: index.ts 미생성으로 tree-shaking 최적화 유지

**MEDIUM**:

- `rerender-memo`: 아이콘 컴포넌트는 stateless하여 추가 최적화 불필요

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: TypeScript 컴파일

- 생성된 모든 컴포넌트가 타입 오류 없이 컴파일되는지 확인
- `npx tsc --noEmit`

**TS-2**: 빌드 검증

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

**TS-3**: 수동 검증

- 마이그레이션된 Input 컴포넌트에서 아이콘이 정상 렌더링되는지 확인
- className으로 색상 변경이 적용되는지 확인

### Acceptance Criteria

- [x] SVG → React 컴포넌트 변환 방식 결정 (SVGR CLI)
- [ ] `npm run generate:icons` 명령어로 변환 실행 가능
- [ ] 모든 SVG 파일(8개)이 React 컴포넌트로 변환됨
- [ ] 변환된 컴포넌트가 TypeScript 타입 지원 (`SVGProps<SVGSVGElement>`)
- [ ] 기존 SVG 사용처 중 1개 이상 마이그레이션 예시
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] `npm run generate:icons` 실행 시 8개 컴포넌트 생성
- [ ] 생성된 컴포넌트에서 `currentColor` 적용 확인
- [ ] Input 컴포넌트에서 아이콘 렌더링 정상

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 생성된 컴포넌트 구조 일관성

---

## 6. Risks & Dependencies

### Risks

**R-1**: 일부 SVG의 색상 변환 이슈

- **Risk**: 복잡한 SVG (예: Google 로고)에서 색상 변환이 의도치 않게 적용될 수 있음
- **Impact**: LOW
- **Probability**: MEDIUM
- **Mitigation**: 멀티컬러 아이콘(Google, Kakao 로고)은 색상 변환에서 제외
- **Status**: 모니터링 필요

**R-2**: 기존 사용처 마이그레이션 누락

- **Risk**: 마이그레이션하지 않은 사용처에서 두 가지 방식이 혼재
- **Impact**: LOW (기능 문제 없음, 일관성 문제)
- **Mitigation**: 별도 이슈로 전체 마이그레이션 진행

### Dependencies

**D-1**: @svgr/cli 패키지

- **Dependency**: npm 패키지 설치 필요
- **Required For**: 컴포넌트 생성
- **Status**: AVAILABLE
- **Version**: 최신 안정 버전 사용

---

## 7. Rollout & Monitoring

### Deployment Strategy

1. 설정 파일 및 스크립트 추가
2. 아이콘 컴포넌트 생성
3. 1개 사용처 마이그레이션 (검증)
4. PR 생성 및 리뷰
5. 머지 후 추가 마이그레이션은 별도 이슈로

### Success Metrics

**SM-1**: 컴포넌트 생성 성공

- **Metric**: 8개 SVG 파일 → 8개 TSX 컴포넌트
- **Target**: 100%

**SM-2**: 빌드 성공

- **Metric**: `npm run build` 성공 여부
- **Target**: Pass

---

## 8. Timeline & Milestones

### Milestones

**M1**: Setup Complete

- SVGR 설치 및 설정 완료
- npm script 추가
- **Status**: NOT_STARTED

**M2**: Icons Generated

- 8개 아이콘 컴포넌트 생성
- 빌드 및 타입 체크 통과
- **Status**: NOT_STARTED

**M3**: Migration Example

- Input 컴포넌트 마이그레이션
- 동작 검증 완료
- **Status**: NOT_STARTED

---

## 9. References

### Related Issues

- Issue #41: [SVG 아이콘을 React 컴포넌트로 변환하는 스크립트 구현](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/41)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/assets.md](../../.claude/rules/assets.md)
- [.claude/rules/fsd.md](../../.claude/rules/fsd.md)

### External Resources

- [SVGR 공식 문서](https://react-svgr.com/)
- [SVGR CLI 문서](https://react-svgr.com/docs/cli/)
- [SVGR GitHub](https://github.com/gregberge/svgr)
- [SVGO 설정](https://github.com/svg/svgo)

---

## 10. Implementation Summary

**Completion Date**: 2026-01-30
**Implemented By**: Claude Opus 4.5

### Changes Made

#### Files Created

**SVGR Configuration**:

- `svgr.icons.config.mjs` - Icons 변환 설정 (currentColor 적용)
- `svgr.logos.config.mjs` - Logos 변환 설정 (브랜드 색상 유지)

**Icons (React Components)**:

- `src/shared/ui/icons/IcCaretDown.tsx` - 드롭다운 아이콘
- `src/shared/ui/icons/IcCheck.tsx` - 체크 아이콘
- `src/shared/ui/icons/IcDelete.tsx` - 삭제 아이콘
- `src/shared/ui/icons/IcInfo.tsx` - 정보 아이콘
- `src/shared/ui/icons/IcMeatball.tsx` - 더보기 메뉴 아이콘
- `src/shared/ui/icons/IcStar.tsx` - 별 아이콘

**Logos (React Components)**:

- `src/shared/ui/logos/IcGoogle.tsx` - Google 로고
- `src/shared/ui/logos/IcKakao.tsx` - Kakao 로고

**Source SVG Files (새 위치)**:

- `src/shared/assets/icons/` - 6개 SVG 파일 (사이즈 키워드 제거됨)
- `src/shared/assets/logos/` - 2개 SVG 파일

**Storybook**:

- `src/shared/ui/icons/Icons.stories.tsx` - 아이콘 스토리북 (AllIcons, Sizes, CustomColors, IndividualIcons)
- `src/shared/ui/logos/Logos.stories.tsx` - 로고 스토리북 (AllLogos, Sizes, IndividualLogos, InButtonContext)

#### Files Modified

- `package.json` - `generate:icons`, `generate:logos`, `generate:svg` 스크립트 추가
- `src/shared/ui/input/Input.tsx` - `<img>` → IcDelete 컴포넌트로 마이그레이션
- `src/features/auth/ui/LoginStep.tsx` - IcGoogle, IcKakao 컴포넌트로 마이그레이션
- `src/features/auth/ui/NicknameStep.tsx` - IcDelete 컴포넌트로 마이그레이션
- `src/features/auth/ui/TeamNameStep.tsx` - IcDelete 컴포넌트로 마이그레이션
- `src/features/auth/ui/InviteLinkStep.tsx` - IcDelete 컴포넌트로 마이그레이션
- `src/widgets/sidebar/ui/SidebarListHeader.tsx` - IcMeatball 컴포넌트로 마이그레이션

#### Files Deleted

- `src/shared/assets/svg/` 폴더 내 8개 SVG 파일 (새 위치로 이동)

### Key Implementation Details

1. **폴더 분리**: icons (currentColor 적용) vs logos (브랜드 색상 유지)
2. **사이즈 키워드 제거**: `ic_delete_md.svg` → `ic_delete.svg`
3. **ESM 설정**: `.mjs` 확장자로 ESM 모듈 형식 사용
4. **접근성**: `aria-hidden="true"` 적용 (장식용 아이콘)
5. **자동화**: `pnpm run generate:svg` 실행 시 lint:fix + format 자동 실행

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed
- [x] Storybook: Icons, Logos 스토리 추가됨

### Deviations from Plan

**Added**:

- 폴더 분리 (icons/logos) - 계획에 없었으나 브랜드 색상 보존을 위해 추가
- Storybook 파일 - 사용자 요청에 따라 추가
- ESM 설정 (.mjs) - 사용자 요청에 따라 CommonJS 대신 ESM 사용

**Changed**:

- 네이밍: 사이즈 키워드 제거 (`IcDeleteMd` → `IcDelete`)
- 색상 변환: SVGO `convertColors` 플러그인 사용 (하드코딩 방지)

**Skipped**:

- 없음

### npm Scripts

```json
"generate:icons": "svgr --config-file svgr.icons.config.mjs src/shared/assets/icons",
"generate:logos": "svgr --config-file svgr.logos.config.mjs src/shared/assets/logos",
"generate:svg": "pnpm run generate:icons && pnpm run generate:logos && pnpm run lint:fix && pnpm run format"
```

### Usage Example

```tsx
// Icons (currentColor 지원)
import IcDelete from "@/shared/ui/icons/IcDelete";
<IcDelete className="h-6 w-6 text-red-500" />;

// Logos (원본 색상 유지)
import IcGoogle from "@/shared/ui/logos/IcGoogle";
<IcGoogle className="h-8 w-8" />;
```

---

**Plan Status**: Completed
**Last Updated**: 2026-01-30
