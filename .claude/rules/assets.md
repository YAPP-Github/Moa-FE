# Assets 관리 규칙

> 프로젝트의 모든 정적 리소스(이미지, SVG) 관리 규칙
> 중앙집중형 관리 + SVGR React 컴포넌트 변환 + 직접 import 방식

---

## 폴더 구조

```
src/shared/
├── assets/                    # 원본 정적 리소스
│   ├── icons/                 # UI 아이콘 SVG 원본
│   │   ├── ic_check.svg
│   │   ├── ic_delete.svg
│   │   └── ic_close.svg
│   ├── logos/                 # 브랜드 로고 SVG 원본
│   │   ├── ic_google.svg
│   │   ├── ic_kakao.svg
│   │   └── ic_note.svg
│   └── images/                # 이미지 파일
│       ├── img_logo.jpeg
│       └── img_signin_banner.jpg
└── ui/                        # SVGR 자동 생성 React 컴포넌트
    ├── icons/                 # icons/ SVG → React 컴포넌트
    │   ├── IcCheck.tsx
    │   ├── IcDelete.tsx
    │   └── IcClose.tsx
    └── logos/                 # logos/ SVG → React 컴포넌트
        ├── IcGoogle.tsx
        ├── IcKakao.tsx
        └── IcNote.tsx
```

**핵심 구조**:

- `src/shared/assets/icons/` — UI 아이콘 SVG 원본 파일
- `src/shared/assets/logos/` — 브랜드 로고 SVG 원본 파일
- `src/shared/assets/images/` — 이미지 파일 (jpeg, jpg, png, webp 등)
- `src/shared/ui/icons/` — SVGR 자동 생성된 아이콘 React 컴포넌트
- `src/shared/ui/logos/` — SVGR 자동 생성된 로고 React 컴포넌트

---

## SVG 워크플로우 (SVGR)

### 파이프라인

```
SVG 원본 파일 → SVGR CLI → React 컴포넌트 (자동 생성)

src/shared/assets/icons/ic_check.svg  →  src/shared/ui/icons/IcCheck.tsx
src/shared/assets/logos/ic_google.svg →  src/shared/ui/logos/IcGoogle.tsx
```

### SVGR 실행

```bash
pnpm run generate:icons   # assets/icons/ → ui/icons/
pnpm run generate:logos   # assets/logos/ → ui/logos/
```

### SVGR 설정

- `svgr.icons.config.js` — 아이콘용 설정
- `svgr.logos.config.js` — 로고용 설정 (`shape-rendering: geometricPrecision` 추가)
- 공통: TypeScript, PascalCase 파일명, default export, `aria-hidden: true`

### 생성 규칙

| SVG 원본 파일명          | 생성되는 컴포넌트 파일 | export 이름          |
| ------------------------ | ---------------------- | -------------------- |
| `ic_check.svg`           | `IcCheck.tsx`          | `SvgIcCheck`         |
| `ic_user_profile_sm.svg` | `IcUserProfileSm.tsx`  | `SvgIcUserProfileSm` |
| `ic_google.svg`          | `IcGoogle.tsx`         | `SvgIcGoogle`        |

---

## 네이밍 컨벤션

### SVG 파일: `ic_{descriptor}.svg`

**Format**: `ic_{descriptor}.svg`

- `ic`: Icon prefix (고정)
- `{descriptor}`: 아이콘의 모양 또는 역할 (snake_case)
- 크기는 파일명에 포함하지 않음 (React 컴포넌트 props로 제어)

**Examples**:

```
✅ Good
ic_check.svg
ic_delete.svg
ic_chevron_down.svg
ic_user_profile.svg
ic_user_profile_sm.svg     # 크기 변형이 별도 SVG일 때만 suffix 사용
ic_check_circle_active.svg
ic_link_inactive.svg

❌ Bad
check.svg                  # ic_ prefix 없음
DeleteIcon.svg             # PascalCase
ic-check.svg               # 하이픈 사용
```

**icons vs logos 분류**:

- `assets/icons/` — UI 아이콘 (check, close, chevron, plus 등)
- `assets/logos/` — 브랜드/서비스 로고 (google, kakao, note 등)

### Image 파일: `img_{context}_{descriptor}.{ext}`

**Format**: `img_{context}_{descriptor}.{ext}`

- `img`: Image prefix (고정)
- `{context}`: 이미지 사용 컨텍스트 (snake_case)
- `{descriptor}`: 구체적 설명 (snake_case, 선택사항)

**Examples**:

```
✅ Good
img_logo.jpeg
img_signin_banner.jpg
img_profile_default.png

❌ Bad
logo.jpeg                  # img_ prefix 없음
signin-image.jpg           # 하이픈 사용
```

---

## 사용 방법

### SVG — React 컴포넌트로 import

```tsx
// icons
import IcCheck from '@/shared/ui/icons/IcCheck';
import IcDelete from '@/shared/ui/icons/IcDelete';
import IcClose from '@/shared/ui/icons/IcClose';

// logos
import IcGoogle from '@/shared/ui/logos/IcGoogle';
import IcKakao from '@/shared/ui/logos/IcKakao';

// 사용 — React 컴포넌트, props로 크기/스타일 제어
<IcCheck width={24} height={24} />
<IcDelete className="text-gray-500" />
<IcGoogle width={48} height={48} />
```

### Image — 직접 import

```tsx
import imgLogo from '@/shared/assets/images/img_logo.jpeg';
import imgSigninBanner from '@/shared/assets/images/img_signin_banner.jpg';

<img src={imgLogo} alt="Logo" />
<img src={imgSigninBanner} alt="Signin" />
```

**잘못된 사용** (금지):

```tsx
// ❌ SVG를 img 태그로 사용 (SVGR 컴포넌트 사용 필수)
import checkSvg from "@/shared/assets/icons/ic_check.svg";
<img src={checkSvg} />;

// ❌ barrel export
import { IcCheck, IcDelete } from "@/shared/ui/icons";
```

---

## 새 SVG 추가 프로세스

### 1. SVG 파일 배치

```bash
# UI 아이콘
src/shared/assets/icons/ic_new_icon.svg

# 브랜드 로고
src/shared/assets/logos/ic_new_brand.svg
```

### 2. SVGR로 React 컴포넌트 생성

```bash
pnpm run generate:icons   # 또는 generate:logos
```

### 3. 생성된 컴포넌트 사용

```tsx
import IcNewIcon from "@/shared/ui/icons/IcNewIcon";

<IcNewIcon width={24} height={24} />;
```

---

## 새 Image 추가 프로세스

### 1. 파일 배치 및 네이밍

```bash
src/shared/assets/images/img_new_banner.png
```

### 2. 직접 import 후 사용

```tsx
import imgNewBanner from "@/shared/assets/images/img_new_banner.png";

<img src={imgNewBanner} alt="Banner" />;
```

---

## 체크리스트

새 asset을 추가할 때:

- [ ] SVG는 `src/shared/assets/icons/` 또는 `src/shared/assets/logos/`에 위치하는가?
- [ ] Image는 `src/shared/assets/images/`에 위치하는가?
- [ ] SVG 파일명이 `ic_{descriptor}.svg` (snake_case) 형식인가?
- [ ] Image 파일명이 `img_{context}_{descriptor}.{ext}` (snake_case) 형식인가?
- [ ] SVG 추가 후 `ppnpm run generate:icons` 또는 `generate:logos`를 실행했는가?
- [ ] 생성된 컴포넌트를 `@/shared/ui/icons/` 또는 `@/shared/ui/logos/`에서 import하는가?
- [ ] Build와 lint가 통과하는가?

---

**마지막 업데이트**: 2026-02-09
