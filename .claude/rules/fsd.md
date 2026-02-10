# FSD (Feature-Sliced Design) 아키텍처

> 프로젝트의 모든 코드는 Feature-Sliced Design 구조를 따릅니다.
> 참고: [카카오페이 기술블로그 FSD 적용기](https://tech.kakaopay.com/post/fsd/)

---

## 개요

**목적**: 기능 단위 응집도 ↑, 레이어 단방향 의존성, 코드 위치 명확화

**핵심 원칙**:

1. 단방향 의존성: `app → pages → widgets → features → entities → shared`
2. 슬라이스 간 직접 참조 금지
3. 직접 import 사용 (tree-shaking 최적화를 위해 barrel export 미사용)

---

## 레이어 구조

```
src/
├── app/                    # Layer 1: App (앱 초기화, Provider, 라우팅)
├── pages/                  # Layer 2: Pages (라우트 단위 페이지 조립)
├── widgets/                # Layer 3: Widgets (독립 UI 블록, 여러 feature 조합)
├── features/               # Layer 4: Features (사용자 목표 상호작용 단위)
├── entities/               # Layer 5: Entities (비즈니스 도메인 모델)
└── shared/                 # Layer 6: Shared (공통 UI, 유틸, 라이브러리)
```

### Layer 1: app

**역할**: 앱 초기화, 전역 Provider, 라우팅 설정

**위치**: `src/app/`

**예시**:

- `app/App.tsx` - 라우팅 설정
- `app/providers/QueryProvider.tsx` - React Query Provider
- `app/providers/queryClient.ts` - QueryClient 설정

**규칙**:

- 비즈니스 로직 금지
- 전역 설정만 포함
- 모든 하위 레이어 조립 가능

### Layer 2: pages

**역할**: 라우트 단위 페이지 조립

**위치**: `src/pages/{page-name}/`

**슬라이스 구조**:

```
pages/
└── signin/
    └── ui/
        └── SigninPage.tsx
```

**예시**:

- `pages/signin/ui/SigninPage.tsx` - Signin 페이지
- `pages/retrospective/list/ui/RetrospectiveListPage.tsx` - 회고 목록 페이지

**규칙**:

- widgets, features, entities, shared 조합 가능
- 비즈니스 로직 최소화 (조립만)
- 페이지 전용 로직은 해당 슬라이스에 배치
- 직접 import 사용 (barrel export 미사용)

### Layer 3: widgets

**역할**: 페이지에 배치되는 독립 UI 블록 (여러 feature 조합 가능)

**위치**: `src/widgets/{widget-name}/`

**예시**:

- `widgets/header/` - 전역 헤더
- `widgets/sidebar/` - 사이드바
- `widgets/retrospective-dashboard/` - 회고 대시보드 위젯

**규칙**:

- features, entities, shared 조합 가능
- 복잡한 UI 블록
- 재사용 가능한 독립적 UI 단위

### Layer 4: features

**역할**: 사용자 목표에 대응하는 상호작용 단위 (폼, 플로우)

**위치**: `src/features/{feature-name}/`

**슬라이스 구조**:

```
features/
└── auth/
    ├── ui/
    │   ├── LoginStep.tsx
    │   └── NicknameStep.tsx
    ├── api/
    │   └── auth.queries.ts
    └── model/
        └── types.ts
```

**예시**:

- `features/auth/` - 인증 관련 기능
- `features/retrospective/` - 회고 작성/수정 기능
- `features/payment/` - 결제 기능

**규칙**:

- entities, shared만 참조 가능
- 비즈니스 로직 포함 가능
- 같은 레이어 다른 feature 참조 금지
- 직접 import 사용 (barrel export 미사용)

### Layer 5: entities

**역할**: 비즈니스 도메인 모델, 쿼리, 상태

**위치**: `src/entities/{domain}/`

**슬라이스 구조**:

```
entities/
└── user/
    ├── model/
    │   └── types.ts
    └── api/
        └── user.queries.ts
```

**예시**:

- `entities/user/` - 사용자 도메인
- `entities/team/` - 팀 도메인
- `entities/retrospective/` - 회고 도메인

**규칙**:

- shared만 참조 가능
- 데이터 모델, API 쿼리, 도메인 로직
- 다수 feature/page에서 재사용
- 직접 import 사용 (barrel export 미사용)

### Layer 6: shared

**역할**: 공통 UI, 유틸, 라이브러리, 설정

**위치**: `src/shared/`

**구조**:

```
shared/
├── assets/              # 중앙집중형 assets (직접 import)
│   ├── images/
│   └── svg/
├── ui/                  # 공통 UI 컴포넌트 (직접 import)
│   ├── button/
│   │   └── Button.tsx
│   └── input/
│       └── Input.tsx
├── lib/                 # 유틸리티 함수 (직접 import)
│   └── cn.ts
├── api/                 # 공통 API 설정
│   └── client.ts
└── config/              # 설정 파일
    └── env.ts
```

**규칙**:

- 다른 레이어 참조 불가
- 비즈니스 로직 금지
- 범용적이고 재사용 가능한 코드만
- **직접 import 사용** (tree-shaking 최적화를 위해 barrel export 미사용)

---

## 슬라이스 & 세그먼트

### 슬라이스 (Slice)

**정의**: 레이어 내 도메인/기능 단위

**네이밍**: kebab-case (예: `auth`, `retrospective`, `user-settings`)

**규칙**:

- 같은 레이어 내 슬라이스 간 직접 참조 금지
- 직접 import 방식 사용 (tree-shaking 최적화)

### 세그먼트 (Segment)

**정의**: 슬라이스 내 역할별 폴더

**표준 세그먼트**:

- `ui/`: UI 컴포넌트
- `api/`: API 호출, 쿼리
- `model/`: 타입, 상태, 비즈니스 로직
- `lib/`: 유틸리티 함수
- `config/`: 설정 파일

**지양할 세그먼트**:

- `components/` (기술명 대신 `ui/` 사용)
- `hooks/` (기술명 대신 `model/` 또는 `lib/` 사용)
- `utils/` (기술명 대신 `lib/` 사용)

---

## Import 규칙 (직접 Import 방식)

> **Tree-shaking 최적화**를 위해 barrel export (index.ts) 대신 직접 import를 사용합니다.

### 경로 규칙

- **같은 슬라이스 내부**: 상대경로 사용 (`./`, `../`)
- **다른 슬라이스/레이어 참조**: 절대경로 사용 (`@/`)

### Import 예시

**✅ Good — 같은 슬라이스 내부 (상대경로)**:

```typescript
// features/auth/api/auth.queries.ts → 같은 슬라이스의 api 세그먼트
import { getProfile } from "./auth.api";

// features/auth/api/auth.api.ts → 같은 슬라이스의 model 세그먼트
import { profileResponseSchema } from "../model/schema";
import type { SocialLoginRequest } from "../model/types";

// features/auth/ui/routes/PrivateRoute.tsx → 같은 슬라이스의 api 세그먼트
import { useAuth } from "../../api/auth.queries";
```

**✅ Good — 다른 슬라이스/레이어 참조 (절대경로)**:

```typescript
// pages/callback/ui/CallbackPage.tsx → features/auth 참조
import { useSocialLoginMutation } from "@/features/auth/api/auth.mutations";
import { getRedirectUri } from "@/features/auth/lib/oauth";

// features/auth/api/auth.api.ts → shared 레이어 참조
import { customInstance } from "@/shared/api/instance";

// app/App.tsx → pages, features 참조
import { MainPage } from "@/pages/main/ui/MainPage";
import { PrivateRoute } from "@/features/auth/ui/routes/PrivateRoute";
```

**❌ Bad (barrel export)**:

```typescript
// barrel export 금지 (tree-shaking 비효율)
import { LoginStep, NicknameStep } from "@/features/auth";
import { images, svg } from "@/shared/assets";
import { cn } from "@/shared/lib";
```

**❌ Bad (같은 슬라이스에 절대경로)**:

```typescript
// features/auth/api/auth.queries.ts
import { getProfile } from "@/features/auth/api/auth.api"; // ❌ 같은 슬라이스인데 절대경로
```

**❌ Bad (레이어 위반)**:

```typescript
// 상위 레이어 참조 금지
// features/auth/ui/LoginStep.tsx
import { SigninPage } from "@/pages/signin/ui/SigninPage"; // ❌ features가 pages 참조

// 같은 레이어 슬라이스 간 참조 금지
// features/auth/ui/LoginStep.tsx
import { RetrospectiveForm } from "@/features/retrospective/ui/RetrospectiveForm"; // ❌
```

---

## 코드 배치 가이드

### 신규 코드 배치 결정 플로우

```
1. 전역 설정/Provider?
   → YES → app/

2. URL 라우트 페이지?
   → YES → pages/{page}/

3. 여러 feature 조합 복잡한 UI?
   → YES → widgets/{widget}/

4. 비즈니스 로직 포함 기능?
   → YES → features/{feature}/

5. 데이터 도메인 모델?
   → YES → entities/{domain}/

6. 공통 코드?
   → YES → shared/
```

### API 배치 기준

**특정 페이지 전용**:

- 위치: `pages/{page}/api/`
- 예시: `pages/signin/api/signin.queries.ts`

**기능 단위 재사용** (동일 slice-group):

- 위치: `features/{feature}/api/`
- 예시: `features/auth/api/auth.queries.ts`

**도메인 데이터 재사용** (다수 페이지/도메인):

- 위치: `entities/{domain}/api/`
- 예시: `entities/user/api/user.queries.ts`

**전역 공통/유틸**:

- 위치: `shared/api/`
- 예시: `shared/api/client.ts`

**판단 기준**: "이 API를 어디까지 재사용할 것인가?" → 재사용 범위가 넓어질수록 낮은 레이어로 이동

---

## Bottom-up 도입 전략

### 점진적 마이그레이션

1. **신규 코드는 pages에 먼저 배치**
2. **동일 그룹 내 다른 슬라이스가 재사용하면** → `features/{group}`로 승격
3. **여러 그룹/도메인에서 재사용되면** → `entities/{domain}`로 승격
4. **전역/비즈니스 무관 공통은** → `shared/`로 이동

### 기존 코드 이관

**비FSD 구조 → FSD 구조**:

- `src/components/` → `features/` 또는 `shared/ui/`
- `src/pages/` → `pages/` (슬라이스 구조로 재구성)
- `src/api/` → `entities/{domain}/api/` 또는 `shared/api/`
- `src/utils/` → `shared/lib/`

**이관 체크리스트**:

- [ ] 코드가 어느 레이어에 속하는지 판단
- [ ] 슬라이스 이름 결정 (도메인/기능 단위)
- [ ] 세그먼트별로 파일 분류 (ui, api, model, lib, config)
- [ ] 모든 import 경로를 직접 import로 변경
- [ ] 빌드 검증 (`pnpm run build`)

---

## Slice Grouping

### 그룹화 전략

동일 도메인 데이터를 다루는 여러 페이지는 한 그룹 아래 슬라이스로 묶을 수 있음:

```
pages/
└── retrospective/           # Group
    ├── list/               # Slice
    │   └── ui/
    │       └── RetrospectiveListPage.tsx
    ├── detail/             # Slice
    │   └── ui/
    │       └── RetrospectiveDetailPage.tsx
    └── create/             # Slice
        └── ui/
            └── RetrospectiveCreatePage.tsx
```

**규칙**:

- 그룹 내에서도 레이어 단방향 의존성 유지
- 슬라이스 간 직접 참조 금지

---

## 자동화 & 서브에이전트

### fsd-architect 에이전트

**역할**: FSD 아키텍처 규칙 준수 가이드

**활성화**: task-init 시 자동 생성

**기능**:

- 코드 배치 시 레이어 결정 지원
- FSD 위반 감지 및 경고
- Import 경로 검증
- 리팩토링 제안

**위치**: [.claude/agents/fsd-architect.md](../agents/fsd-architect.md)

### asset-manager 에이전트

**역할**: Asset 네이밍 컨벤션 자동 적용

**활성화**: task-init 시 자동 생성 (asset 관련 작업)

**기능**:

- SVG/Image 네이밍 컨벤션 자동 적용
- 잘못된 asset 이름 감지 및 수정 제안
- index.ts export 자동 업데이트

**위치**: [.claude/agents/asset-manager.md](../agents/asset-manager.md)

---

## 예시

### Example 1: Signin Feature

```
src/
├── app/
│   └── App.tsx                       # 라우팅 설정
├── pages/
│   └── signin/
│       └── ui/
│           └── SigninPage.tsx        # 페이지 조립
├── features/
│   └── auth/
│       ├── ui/
│       │   ├── LoginStep.tsx
│       │   ├── NicknameStep.tsx
│       │   ├── TeamStep.tsx
│       │   ├── TeamNameStep.tsx
│       │   └── InviteLinkStep.tsx
│       └── model/
│           └── types.ts
└── shared/
    └── assets/
        ├── images/
        │   └── img_signin_banner.jpg
        └── svg/
            ├── ic_google_lg.svg
            └── ic_kakao_lg.svg
```

**Import Flow (직접 Import)**:

```typescript
// app/App.tsx
import { SigninPage } from "@/pages/signin/ui/SigninPage";

// pages/signin/ui/SigninPage.tsx
import { LoginStep } from "@/features/auth/ui/LoginStep";
import { NicknameStep } from "@/features/auth/ui/NicknameStep";
import type { SigninStep } from "@/features/auth/model/types";

// features/auth/ui/LoginStep.tsx
import icGoogleLg from "@/shared/assets/svg/ic_google_lg.svg";
import icKakaoLg from "@/shared/assets/svg/ic_kakao_lg.svg";
```

### Example 2: Retrospective Feature

```
src/
├── pages/
│   └── retrospective/
│       ├── list/
│       │   └── ui/
│       │       └── RetrospectiveListPage.tsx
│       └── detail/
│           └── ui/
│               └── RetrospectiveDetailPage.tsx
├── features/
│   └── retrospective/
│       ├── ui/
│       │   ├── RetrospectiveForm.tsx
│       │   └── RetrospectiveCard.tsx
│       └── api/
│           └── retrospective.queries.ts
└── entities/
    └── retrospective/
        ├── model/
        │   └── types.ts
        └── api/
            └── retrospective.api.ts
```

---

## 참조

### 프로젝트 문서

- [CLAUDE.md](../CLAUDE.md) - 프로젝트 핵심 규칙
- [.claude/rules/assets.md](assets.md) - Asset 네이밍 컨벤션

### 외부 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [카카오페이 기술블로그 FSD 적용기](https://tech.kakaopay.com/post/fsd/)

---

**마지막 업데이트**: 2026-01-29
