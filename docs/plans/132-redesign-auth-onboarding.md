# [Refactor] 로그인, 회원가입 및 온보딩 페이지 리디자인 반영 및 리팩토링

> Issue: #132
> Branch: `refactor/132-redesign-auth-onboarding`

## Overview

로그인/회원가입/온보딩 페이지의 피그마 리디자인을 반영하고, 관련 컴포넌트를 리팩토링합니다.

---

## Implementation Summary

**Completion Date**: 2026-02-18
**Implemented By**: Claude Opus 4.6

### Changes Made

#### Auth & Routing

- [src/features/auth/ui/routes/RouteGuard.tsx](src/features/auth/ui/routes/RouteGuard.tsx) - GlobalLoading 제거, `isFetched` 기반 blank page로 단순화
- [src/pages/callback/ui/CallbackPage.tsx](src/pages/callback/ui/CallbackPage.tsx) - `return null` (blank) + Strict Mode 대응 ref guard 추가
- [src/app/App.tsx](src/app/App.tsx) - AuthLayout 제거, 라우트 구조 정리

#### Onboarding Page Redesign

- [src/pages/onboarding/ui/OnboardingPage.tsx](src/pages/onboarding/ui/OnboardingPage.tsx) - bg-grey-50, 720x792 white container, 헤더 포함 viewport 정중앙 배치
- [src/pages/signin/ui/SigninPage.tsx](src/pages/signin/ui/SigninPage.tsx) - 2컬럼 레이아웃 (좌: skeleton, 우: SigninForm)
- [src/widgets/header/ui/MainHeader.tsx](src/widgets/header/ui/MainHeader.tsx) - Header.tsx에서 rename
- [src/widgets/header/ui/OnboardingHeader.tsx](src/widgets/header/ui/OnboardingHeader.tsx) - 새 온보딩 전용 헤더 (IcMoa 로고, 투명 배경)
- [src/widgets/layout/ui/BaseLayout.tsx](src/widgets/layout/ui/BaseLayout.tsx) - MainHeader import 경로 반영

#### Onboarding Steps

- [src/features/auth/ui/steps/NicknameStep.tsx](src/features/auth/ui/steps/NicknameStep.tsx) - 고정 높이(528px) + mt-auto 버튼, clearable 동작 수정, 닉네임 카운터 색상
- [src/features/auth/ui/steps/TeamStep.tsx](src/features/auth/ui/steps/TeamStep.tsx) - TEAM_OPTIONS 상수 + map 패턴, check circle 아이콘, dissolve 애니메이션 (300ms ease-out)
- [src/features/auth/ui/steps/TeamActionStep.tsx](src/features/auth/ui/steps/TeamActionStep.tsx) - 고정 높이(528px) + mt-auto 버튼, 팀이름 카운터, inviteLink clearable + URL validation
- [src/features/auth/ui/forms/OnboardingForm.tsx](src/features/auth/ui/forms/OnboardingForm.tsx) - 팀 생성/참여 실패 시에도 navigate('/') 보장

#### Shared UI

- [src/shared/ui/input/Input.tsx](src/shared/ui/input/Input.tsx) - h-[46px], 한글 IME maxLength 수정, placeholder 색상, focus ring 제거
- [src/shared/ui/field/Field.tsx](src/shared/ui/field/Field.tsx) - group-focus-within 라벨 색상 변경 (#3182F6)
- [src/shared/ui/radio-card/RadioCard.tsx](src/shared/ui/radio-card/RadioCard.tsx) - focus ring 제거
- [src/shared/ui/button/Button.tsx](src/shared/ui/button/Button.tsx) - 스타일 업데이트
- [src/features/auth/model/schema.ts](src/features/auth/model/schema.ts) - inviteLink URL validation 추가

#### Deleted

- `src/widgets/header/ui/Header.tsx` - MainHeader.tsx로 대체
- `src/widgets/layout/ui/AuthLayout.tsx` - 미사용으로 제거

#### New Assets

- `src/shared/assets/logos/ic_moa.svg` - Moa 로고 SVG 원본
- `src/shared/ui/logos/IcMoa.tsx` - SVGR 생성 React 컴포넌트

### Key Implementation Details

- **RouteGuard 단순화**: TanStack Query의 `isFetched`로 초기 인증 체크, GlobalLoading 제거
- **Strict Mode 대응**: CallbackPage에서 `useRef` guard로 OAuth 중복 호출 방지
- **일관된 버튼 위치**: 모든 스텝에 `h-[528px]` + `mt-auto` 적용하여 동일한 하단 위치 보장
- **tailwind-merge 충돌 해결**: 커스텀 text 유틸리티(`text-sub-title-1`)와 색상 클래스 충돌 시 template literal 사용
- **한글 IME maxLength**: `handleChange`에서 프로그래밍적으로 slice하여 해결
- **Dissolve 애니메이션**: RadioCard 아이콘에 opacity 크로스페이드, border/text에 transition-colors (300ms ease-out)
- **에러 복원력**: signup 성공 후 팀 생성/참여 실패 시에도 메인으로 이동

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed (Biome, 183 files, no issues)

### Deviations from Plan

계획 문서 없이 진행 (리디자인 반영 + 리팩토링 병행 작업)

### Performance Impact

- Bundle size: 623.14 KB (기존 대비 변화 미미)
- AuthLayout 제거로 불필요한 레이아웃 렌더링 제거
