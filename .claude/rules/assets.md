# Assets 관리 규칙

> 프로젝트의 모든 정적 리소스(이미지, SVG) 관리 규칙
> 중앙집중형 관리 + 직접 import 방식 (Tree-shaking 최적화)

---

## 폴더 구조

```
src/shared/assets/
├── images/
│   ├── img_logo.jpeg
│   └── img_signin_banner.jpg
└── svg/
    ├── ic_check_lg.svg
    ├── ic_delete_md.svg
    └── ic_google_lg.svg
```

**중요**:

- 모든 assets은 반드시 `src/shared/assets/images/` 또는 `src/shared/assets/svg/` 폴더 내에 위치
- FSD 아키텍처의 `shared` 레이어에서 중앙집중형 관리
- **직접 import 방식 사용** (barrel export 제거로 tree-shaking 최적화)

---

## 네이밍 컨벤션

### SVG 파일: `ic_{descriptor}_{size}`

**Format**: `ic_{descriptor}_{size}.svg`

**Components**:

- `ic`: Icon prefix (고정)
- `{descriptor}`: 아이콘의 모양 또는 역할 (snake_case)
- `{size}`: 크기 표기

**Size Values**:

- `sm`: 16px
- `md`: 24px
- `lg`: 32px
- `xl`: 48px
- 숫자: 정확한 픽셀 크기 (예: `16`, `24`, `32`)

**Examples**:

```
✅ Good
ic_check_lg.svg          # Check icon, large (32px)
ic_google_lg.svg         # Google logo icon, large
ic_delete_md.svg         # Delete icon, medium (24px)
ic_info_md.svg           # Info icon, medium
ic_arrow_right_sm.svg    # Arrow right icon, small (16px)
ic_menu_24.svg           # Menu icon, 24px

❌ Bad
check.svg                # Missing prefix and size
big-check.svg            # kebab-case (old convention)
google-icon.svg          # Wrong format
DeleteIcon.svg           # PascalCase
ic_check.svg             # Missing size
```

**Conversion from Old**:

```
big-check.svg       → ic_check_lg.svg
delete.svg          → ic_delete_md.svg
google.svg          → ic_google_lg.svg
info-circle.svg     → ic_info_md.svg
kakao.svg           → ic_kakao_lg.svg
star.svg            → ic_star_md.svg
```

### Image 파일: `img_{context}_{descriptor}`

**Format**: `img_{context}_{descriptor}.{ext}`

**Components**:

- `img`: Image prefix (고정)
- `{context}`: 이미지 사용 컨텍스트 (snake_case)
- `{descriptor}`: 구체적 설명 (snake_case, 선택사항)
- `{ext}`: 확장자 (jpeg, jpg, png, webp, etc.)

**Context Examples**:

- `logo`: 로고 이미지
- `signin`, `signup`: 인증 관련
- `profile`, `avatar`: 사용자 프로필
- `banner`, `hero`: 배너 이미지
- `bg`: 배경 이미지
- `product`, `thumbnail`: 상품/썸네일

**Examples**:

```
✅ Good
img_logo.jpeg                 # Logo image
img_logo_primary.png          # Primary logo variant
img_signin_banner.jpg         # Signin page banner
img_profile_default.png       # Default profile image
img_bg_hero.jpg               # Hero section background
img_product_thumbnail.webp    # Product thumbnail

❌ Bad
logo.jpeg                     # Missing prefix
signin-image.jpg              # kebab-case (old convention)
SigninBanner.jpg              # PascalCase
img-logo.jpeg                 # Hyphen instead of underscore
```

**Conversion from Old**:

```
logo.jpeg          → img_logo.jpeg
signin-image.jpg   → img_signin_banner.jpg
banner.png         → img_banner.png (or img_banner_hero.png)
```

### Import 변수명: camelCase

**Rule**: 파일명(snake_case) → import 변수명(camelCase)

**Conversion**:

```
File Name                  → Import Variable
ic_check_lg.svg           → icCheckLg
ic_google_lg.svg          → icGoogleLg
ic_arrow_right_sm.svg     → icArrowRightSm
img_logo.jpeg             → imgLogo
img_signin_banner.jpg     → imgSigninBanner
```

---

## 사용 방법 (직접 Import)

### Import

```typescript
// SVG 직접 import
import icDeleteMd from "@/shared/assets/svg/ic_delete_md.svg";
import icGoogleLg from "@/shared/assets/svg/ic_google_lg.svg";
import icKakaoLg from "@/shared/assets/svg/ic_kakao_lg.svg";

// 이미지 직접 import
import imgLogo from "@/shared/assets/images/img_logo.jpeg";
import imgSigninBanner from "@/shared/assets/images/img_signin_banner.jpg";
```

### 사용 예시

```tsx
// 이미지 사용
<img src={imgLogo} alt="Logo" />
<img src={imgSigninBanner} alt="Signin" />

// SVG 사용
<img src={icGoogleLg} alt="Google" />
<img src={icDeleteMd} alt="Delete" />
```

**잘못된 사용** (절대 금지):

```typescript
// ❌ barrel export 방식 (tree-shaking 불리)
import { images, svg } from "@/shared/assets";

// ❌ 이전 경로 (FSD 이전)
import { images, svg } from "@/assets";
```

---

## 자동 수정 워크플로우

사용자가 잘못된 이름으로 asset을 추가하면 자동으로 수정합니다.

### Step 1: 새 Asset 감지

```bash
# Git status에서 새로운 assets 찾기
git status | grep 'src/shared/assets/'
```

### Step 2: 네이밍 분석

각 파일명을 분석하여 컨벤션 준수 여부 확인:

**SVG 검사**:

- `ic_` prefix 있는가?
- Size suffix 있는가? (`_sm`, `_md`, `_lg`, `_xl`, `_16`, etc.)
- snake_case인가?

**Image 검사**:

- `img_` prefix 있는가?
- Context가 명확한가?
- snake_case인가?

### Step 3: 수정 제안

컨벤션 위반 시 수정 제안:

```
⚠️ Asset 네이밍 컨벤션 위반

추가된 파일: src/shared/assets/svg/google.svg
문제: 'ic_' prefix 없음, size 없음

제안: src/shared/assets/svg/ic_google_lg.svg
이유: SVG 아이콘은 'ic_{descriptor}_{size}' 형식, 로고이므로 lg

자동 수정하시겠습니까? (Y/n)
```

### Step 4: 자동 수정

승인 후:

1. 파일명 변경
2. 해당 asset을 사용하는 모든 파일 찾기
3. Import 경로 업데이트 (직접 import 방식)
4. 빌드 검증

```bash
# 1. 파일명 변경
git mv src/shared/assets/svg/google.svg src/shared/assets/svg/ic_google_lg.svg

# 2. Import 경로 찾기
grep -r "google" src/ --include="*.tsx" --include="*.ts"

# 3. 경로 수정 (자동)
# import icGoogleLg from '@/shared/assets/svg/ic_google_lg.svg';

# 4. 빌드 검증
npm run build
```

---

## 새 파일 추가 프로세스

### 1. 파일 추가 및 네이밍

파일 타입에 따라 적절한 폴더에 올바른 이름으로 배치:

```bash
# SVG 파일
src/shared/assets/svg/ic_new_icon_md.svg

# 이미지 파일
src/shared/assets/images/img_new_banner.png
```

### 2. 사용

직접 import 후 사용:

```typescript
// SVG import
import icNewIconMd from '@/shared/assets/svg/ic_new_icon_md.svg';

// 이미지 import
import imgNewBanner from '@/shared/assets/images/img_new_banner.png';

// 사용
<img src={imgNewBanner} alt="Banner" />
<img src={icNewIconMd} alt="Icon" />
```

---

## 파일 이동/정리 가이드

### 기존 파일을 정리할 때

**1. 파일 이동 (위치 수정)**:

```bash
# 잘못된 위치 (FSD 이전)
src/assets/some-image.png

# 올바른 위치로 이동
git mv src/assets/some-image.png src/shared/assets/images/img_some_image.png
```

**2. 네이밍 수정 (컨벤션 적용)**:

```bash
# kebab-case → snake_case + prefix
git mv src/shared/assets/svg/big-check.svg src/shared/assets/svg/ic_check_lg.svg
git mv src/shared/assets/images/signin-image.jpg src/shared/assets/images/img_signin_banner.jpg
```

**3. Import 업데이트**:

- 기존 파일에서 해당 asset을 사용하는 모든 곳 찾기
- 직접 import 방식으로 변경

**4. 빌드 검증**:

```bash
npm run build
npx tsc --noEmit
npm run lint
```

---

## SVG 크기 결정 가이드

파일에서 크기를 자동으로 판단하기 어려운 경우:

### Default Sizes

- **로고 아이콘** (Google, Kakao, etc.): `lg` (32px)
- **일반 UI 아이콘** (check, delete, info, etc.): `md` (24px)
- **작은 인디케이터**: `sm` (16px)
- **큰 일러스트레이션**: `xl` (48px)

### viewBox 분석

SVG 파일을 읽어 `viewBox` 또는 `width/height` 속성 확인:

```xml
<!-- ic_check_lg.svg -->
<svg viewBox="0 0 32 32" ...>  <!-- 32x32 = lg -->

<!-- ic_delete_md.svg -->
<svg width="24" height="24" ...>  <!-- 24x24 = md -->
```

### 사용자 확인

크기 판단이 어려운 경우 사용자에게 확인:

```
❓ SVG 크기 확인 필요

파일: star.svg
viewBox를 찾을 수 없습니다.

이 아이콘의 사용 목적이 무엇인가요?
1. 작은 UI 인디케이터 (16px) → sm
2. 일반 UI 아이콘 (24px) → md
3. 큰 아이콘/로고 (32px) → lg
4. 일러스트레이션 (48px) → xl

선택: [2]
→ ic_star_md.svg로 변경
```

---

## 자동화 체크리스트

새 파일을 추가하거나 assets을 정리할 때:

- [ ] 파일이 `src/shared/assets/images/` 또는 `src/shared/assets/svg/`에 위치하는가?
- [ ] SVG 파일명이 `ic_{descriptor}_{size}.svg` 형식인가?
- [ ] Image 파일명이 `img_{context}_{descriptor}.ext` 형식인가?
- [ ] 파일명이 snake_case인가? (하이픈 없음)
- [ ] Import 변수명이 camelCase인가? (예: `imgLogo`, `icDeleteMd`)
- [ ] 직접 import 방식을 사용하는가? (예: `import icDeleteMd from '@/shared/assets/svg/ic_delete_md.svg'`)
- [ ] Build와 lint가 통과하는가?

---

## 통합: FSD & asset-manager

### FSD 레이어

Assets은 `shared` 레이어에서 관리:

- 위치: `src/shared/assets/`
- 역할: 전역 공통 리소스
- 의존성: 다른 레이어 참조 불가

### asset-manager 에이전트

task-init 시 자동 활성화:

- 네이밍 컨벤션 자동 검증
- 잘못된 이름 자동 수정 제안
- Import 경로 자동 업데이트

자세한 내용: [.claude/agents/asset-manager.md](../agents/asset-manager.md)

---

## 예외 사항

없음. 모든 assets은 반드시 이 규칙을 따라야 합니다.

---

**마지막 업데이트**: 2026-01-29
