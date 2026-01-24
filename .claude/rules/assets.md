# Assets 관리 규칙

> 프로젝트의 모든 정적 리소스(이미지, SVG) 관리 규칙

---

## 폴더 구조

```
src/assets/
├── index.ts                    # 메인 export (images, svg 네임스페이스)
├── images/
│   ├── index.ts               # 이미지 파일들의 named export
│   ├── logo.jpeg
│   └── signin-image.jpg
└── svg/
    ├── index.ts               # SVG 파일들의 named export
    ├── big-check.svg
    ├── delete.svg
    └── google.svg
```

**중요**: 모든 assets은 반드시 `images/` 또는 `svg/` 폴더 내에 위치해야 합니다.

---

## 네이밍 컨벤션

### 파일명 (kebab-case)

```
✅ Good
- signin-image.jpg
- delete-icon.svg
- info-circle.svg
- big-check.svg

❌ Bad
- signinImage.jpg
- DeleteIcon.svg
- Info-circle.svg (대문자 시작)
- big_check.svg (underscore 사용)
```

### Export명 (camelCase)

```typescript
// 파일명: signin-image.jpg
export { default as signinImage } from "./signin-image.jpg";

// 파일명: info-circle.svg
export { default as infoCircle } from "./info-circle.svg";

// 파일명: delete.svg
export { default as deleteIcon } from "./delete.svg";
```

**변환 규칙**:

- 하이픈 제거 후 다음 글자 대문자 (kebab-case → camelCase)
- 명확성을 위해 필요 시 접미사 추가 (예: `delete.svg` → `deleteIcon`)

---

## Index Export 방식

### 1. 개별 폴더 index.ts

**src/assets/images/index.ts**:

```typescript
export { default as logo } from "./logo.jpeg";
export { default as signinImage } from "./signin-image.jpg";
export { default as bannerImage } from "./banner-image.png";
```

**src/assets/svg/index.ts**:

```typescript
export { default as bigCheck } from "./big-check.svg";
export { default as deleteIcon } from "./delete.svg";
export { default as google } from "./google.svg";
export { default as infoCircle } from "./info-circle.svg";
export { default as kakao } from "./kakao.svg";
export { default as star } from "./star.svg";
```

### 2. 메인 index.ts

**src/assets/index.ts**:

```typescript
export * as images from "./images";
export * as svg from "./svg";
```

---

## 사용 방법

### Import

```typescript
import { images, svg } from "@/assets";
```

### 사용 예시

```tsx
// 이미지 사용
<img src={images.logo} alt="Logo" />
<img src={images.signinImage} alt="Signin" />

// SVG 사용
<img src={svg.deleteIcon} alt="Delete" />
<img src={svg.kakao} alt="Kakao" />
<img src={svg.google} alt="Google" />
```

**잘못된 사용** (절대 금지):

```typescript
// ❌ 개별 파일 직접 import
import logo from "@/assets/images/logo.jpeg";
import deleteIcon from "@/assets/svg/delete.svg";

// ❌ 이전 방식
import logo from "@/assets/logo.jpeg";
```

---

## 새 파일 추가 프로세스

### 1. 파일 추가

파일 타입에 따라 적절한 폴더에 배치:

```bash
# 이미지 파일
src/assets/images/new-banner.png

# SVG 파일
src/assets/svg/new-icon.svg
```

### 2. Export 추가

해당 폴더의 `index.ts`에 export 추가:

**이미지 추가 시** (`src/assets/images/index.ts`):

```typescript
export { default as logo } from "./logo.jpeg";
export { default as signinImage } from "./signin-image.jpg";
export { default as newBanner } from "./new-banner.png"; // 추가
```

**SVG 추가 시** (`src/assets/svg/index.ts`):

```typescript
export { default as bigCheck } from "./big-check.svg";
export { default as deleteIcon } from "./delete.svg";
export { default as newIcon } from "./new-icon.svg"; // 추가
```

### 3. 사용

```typescript
import { images, svg } from '@/assets';

<img src={images.newBanner} />
<img src={svg.newIcon} />
```

---

## 파일 이동/정리 시 주의사항

### 기존 파일을 정리할 때

1. **파일 이동**:

   ```bash
   # 잘못된 위치에 있는 파일
   src/assets/some-image.png

   # 올바른 위치로 이동
   mv src/assets/some-image.png src/assets/images/some-image.png
   ```

2. **네이밍 수정** (필요 시):

   ```bash
   # CamelCase나 snake_case를 kebab-case로 변경
   mv src/assets/images/SomeImage.png src/assets/images/some-image.png
   mv src/assets/svg/delete_icon.svg src/assets/svg/delete-icon.svg
   ```

3. **Index 업데이트**:
   - 해당 폴더의 `index.ts`에 export 추가
   - 알파벳 순서로 정렬 유지

4. **Import 업데이트**:
   - 기존 파일에서 해당 asset을 사용하는 모든 곳 찾기
   - `import { images, svg } from '@/assets'` 방식으로 변경

---

## 자동화 체크리스트

새 파일을 추가하거나 assets을 정리할 때 다음을 자동으로 수행:

- [ ] 파일이 `images/` 또는 `svg/` 폴더에 위치하는가?
- [ ] 파일명이 kebab-case인가?
- [ ] 해당 폴더의 `index.ts`에 export가 추가되었는가?
- [ ] Export명이 camelCase인가?
- [ ] Export가 알파벳 순서로 정렬되어 있는가?
- [ ] 기존 파일에서 import 방식이 `{ images, svg } from '@/assets'`인가?
- [ ] Build와 lint가 통과하는가?

---

## 예외 사항

없음. 모든 assets은 반드시 이 규칙을 따라야 합니다.

---

**마지막 업데이트**: 2026-01-24
