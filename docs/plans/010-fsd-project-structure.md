# Task Plan: FSD 기반 프로젝트 구조 리팩토링 및 문서화

**Issue**: #10
**Type**: Refactor
**Created**: 2026-01-24
**Status**: Planning

---

## 1. Overview

### Problem Statement

현재 프로젝트는 Feature-Sliced Design(FSD) 폴더 구조가 부분적으로만 적용되어 있습니다. 기존 `src/components/`, `src/pages/` 구조와 새로운 FSD 레이어(`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`)가 혼재되어 있어 코드 위치가 불명확하고, 레이어 간 의존성 규칙을 강제할 수 없습니다.

- **현재 상황**: Signin 관련 컴포넌트가 `src/components/signin/`에 있으며 FSD 구조 밖에 위치
- **문제점**: Claude Code가 작업 시 FSD 아키텍처를 무시하고 기존 구조에 코드를 추가하는 경우 발생
- **영향**: 장기적으로 코드 응집도 저하, 의존성 관리 어려움, 유지보수 비용 증가

### Objectives

1. 모든 코드를 FSD 레이어로 재배치하여 명확한 아키텍처 구조 확립
2. CLAUDE.md에 FSD 규칙 통합 및 자동화된 서브에이전트 생성 시스템 구축
3. Asset 네이밍 컨벤션 확립 및 자동 정리 시스템 구축
4. 기존 signin 코드를 FSD 구조로 마이그레이션

### Scope

**In Scope**:

- 기존 코드를 FSD 레이어로 재배치 (signin 관련 코드 우선)
- 각 슬라이스에 Public API (`index.ts`) 추가
- CLAUDE.md에 FSD 아키텍처 가이드 추가
- Asset 네이밍 컨벤션 문서화 및 기존 assets 정리
- task-init/task-done skill에 서브에이전트 생성/회수 로직 추가
- 서브에이전트 저장소 구조 확립 (`.claude/agents/`)

**Out of Scope**:

- 다른 페이지/기능의 FSD 마이그레이션 (향후 점진적 진행)
- API 레이어 재구축 (별도 작업)
- Zustand 상태 관리 적용 (별도 작업)

### User Context

> "현재 cursor에는 fsd관련 아키텍쳐 기술이 돼 있는데, claude에는 없어. 그래서 claude에서 작업하거나 계획할 때 아키텍쳐를 무시하고 작업하는 경우가 많아."

**핵심 요구사항**:

1. **서브에이전트 동적 생성**: task-init 시 `.claude/agents/` 폴더에 적절한 에이전트 생성
2. **서브에이전트 회수**: task-done 시 사용된 에이전트 정리
3. **FSD 기반 작업**: 계획 수립 및 실행 시 FSD 아키텍처 준수
4. **기존 코드 마이그레이션**: signin 코드를 FSD 구조로 리팩토링
5. **Asset 중앙 관리**: `shared/assets/` 폴더에서 중앙집중형 관리
6. **Asset 네이밍 자동화**:
   - SVG: `ic_{shape_or_role}_{size}` 형태 (예: `ic_check_24`, `ic_google_md`)
   - Images: 표준 컨벤션 적용 및 자동 정리

---

## 2. Requirements

### Functional Requirements

**FR-1**: FSD 레이어 구조 적용

- 기존 `src/components/signin/` 코드를 적절한 FSD 레이어로 이동
- Signin 관련 컴포넌트는 `features/auth/` 또는 `pages/signin/`로 배치
- `src/App.tsx`를 `src/app/App.tsx`로 이동
- 각 슬라이스에 `index.ts` (Public API) 추가

**FR-2**: CLAUDE.md FSD 통합

- FSD 레이어 및 의존성 규칙 문서화
- 코드 배치 가이드라인 추가
- Asset 네이밍 컨벤션 추가
- Bottom-up 도입 전략 명시

**FR-3**: 서브에이전트 시스템 구축

- `.claude/agents/` 폴더 생성
- task-init 시 작업 타입별 에이전트 자동 생성
- 생성된 에이전트에 FSD 규칙 주입
- task-done 시 에이전트 정리

**FR-4**: Asset 네이밍 자동화

- SVG 네이밍: `ic_{shape_or_role}_{size}` 컨벤션 적용
- Image 네이밍: `img_{context}_{descriptor}` 컨벤션 적용
- 사용자가 잘못된 이름으로 추가한 asset 자동 수정
- index.ts export 자동 업데이트

### Technical Requirements

**TR-1**: 호환성 유지

- 모든 import 경로 업데이트 (`@/` alias 사용)
- 빌드 에러 없이 마이그레이션 완료
- 기존 기능 동작 유지

**TR-2**: 점진적 마이그레이션 지원

- 기존 구조와 FSD 구조 공존 가능
- 신규 코드는 FSD 우선 배치
- 기존 코드는 점진적 이관

**TR-3**: 서브에이전트 구조

- Agent 정의 파일 형식: Markdown (`.md`)
- Agent 메타데이터: 작업 타입, FSD 레이어, 적용 규칙
- Agent 재사용 가능성 고려

### Non-Functional Requirements

**NFR-1**: 개발자 경험 향상

- 명확한 코드 위치 (레이어 기반)
- 자동화된 에이전트 생성으로 수동 작업 감소
- 일관된 네이밍 컨벤션

**NFR-2**: 유지보수성

- 문서화된 아키텍처 규칙
- 버전 관리된 서브에이전트 (Git)
- 점진적 개선 가능한 구조

---

## 3. Architecture & Design

### FSD Layer Structure

```
src/
├── app/                          # App Layer
│   ├── App.tsx                  # Root component (routing)
│   └── providers/               # Global providers
│       ├── QueryProvider.tsx
│       └── queryClient.ts
│
├── pages/                        # Pages Layer
│   └── signin/                  # Signin page slice
│       ├── ui/
│       │   └── SigninPage.tsx   # Page component
│       └── index.ts             # Public API
│
├── widgets/                      # Widgets Layer
│   └── (empty for now)
│
├── features/                     # Features Layer
│   └── auth/                    # Authentication feature slice
│       ├── ui/                  # UI components
│       │   ├── LoginStep.tsx
│       │   ├── NicknameStep.tsx
│       │   ├── TeamStep.tsx
│       │   ├── TeamNameStep.tsx
│       │   └── InviteLinkStep.tsx
│       ├── model/               # State, types
│       │   └── types.ts
│       └── index.ts             # Public API
│
├── entities/                     # Entities Layer
│   └── (future: user, team entities)
│
└── shared/                       # Shared Layer
    ├── assets/                  # Centralized assets
    │   ├── images/
    │   │   ├── img_logo.jpeg
    │   │   ├── img_signin_banner.jpg
    │   │   └── index.ts
    │   ├── svg/
    │   │   ├── ic_check_lg.svg
    │   │   ├── ic_delete_md.svg
    │   │   ├── ic_google_lg.svg
    │   │   ├── ic_info_md.svg
    │   │   ├── ic_kakao_lg.svg
    │   │   ├── ic_star_md.svg
    │   │   └── index.ts
    │   └── index.ts
    └── ui/                      # Common UI components (future)
```

### Design Decisions

**Decision 1**: Signin 컴포넌트를 `features/auth/`에 배치

- **Rationale**: Signin 플로우는 여러 단계를 포함한 "기능"으로, 재사용 가능하며 도메인 로직을 포함함
- **Approach**: `features/auth/ui/` 아래 각 Step 컴포넌트 배치
- **Trade-offs**:
  - 장점: 인증 관련 모든 로직이 한 곳에 모임, 다른 페이지에서도 재사용 가능
  - 단점: 현재는 signin 페이지에서만 사용되므로 over-engineering처럼 보일 수 있음
- **Alternatives Considered**:
  - `pages/signin/ui/`에 배치: 현재는 한 페이지에서만 사용되므로 간단하지만, 향후 회원가입, 로그아웃 등 추가 시 재구성 필요
  - `widgets/signin-flow/`에 배치: 복잡한 UI 블록으로 볼 수 있지만, 비즈니스 로직이 포함되어 features가 적합
- **Impact**: MEDIUM - 향후 확장성 고려한 결정

**Decision 2**: Asset 네이밍 컨벤션

- **Rationale**:
  - SVG는 주로 아이콘이므로 `ic_` prefix로 역할과 크기 명확화
  - Images는 컨텍스트 기반 네이밍으로 용도 파악 용이
  - 일관된 네이밍으로 팀 협업 효율 향상
- **Implementation**:
  - SVG: `ic_{shape_or_role}_{size}` (예: `ic_check_24`, `ic_google_lg`)
  - Images: `img_{context}_{descriptor}` (예: `img_logo_primary`, `img_signin_banner`)
  - Size 표기: `sm` (16px), `md` (24px), `lg` (32px), `xl` (48px), or 숫자 (예: `24`)
- **Benefit**: 파일명만으로 asset의 용도와 크기 파악 가능

**Decision 3**: 서브에이전트 동적 생성 시스템

- **Rationale**: 작업 타입과 범위에 따라 필요한 에이전트가 다름. 수동 관리보다 자동화가 효율적
- **Approach**:
  - task-init에서 이슈 분석 후 필요한 에이전트 판단
  - `.claude/agents/{agent-name}.md` 파일 생성
  - Agent에 FSD 규칙 및 프로젝트 컨텍스트 주입
  - task-done에서 정리
- **Trade-offs**:
  - 장점: 작업별 최적화된 에이전트, 컨텍스트 관리 효율적
  - 단점: 초기 구축 복잡도 증가
- **Impact**: HIGH - 전체 워크플로우 개선

### Component Design

**Signin Flow Structure**:

```typescript
// pages/signin/ui/SigninPage.tsx
export function SigninPage() {
  const [step, setStep] = useState<SigninStep>('login');

  return (
    <div>
      {step === 'login' && <LoginStep onNext={() => setStep('nickname')} />}
      {step === 'nickname' && <NicknameStep onNext={() => setStep('team')} />}
      {/* ... other steps */}
    </div>
  );
}

// features/auth/ui/LoginStep.tsx
export function LoginStep({ onNext }: { onNext: () => void }) {
  // Login logic
}

// features/auth/index.ts (Public API)
export { LoginStep } from './ui/LoginStep';
export { NicknameStep } from './ui/NicknameStep';
export { TeamStep } from './ui/TeamStep';
export { TeamNameStep } from './ui/TeamNameStep';
export { InviteLinkStep } from './ui/InviteLinkStep';
export type { SigninStep } from './model/types';
```

### Data Models

```typescript
// features/auth/model/types.ts
export type SigninStep =
  | "login"
  | "nickname"
  | "team"
  | "teamName"
  | "inviteLink";

export interface SigninState {
  step: SigninStep;
  nickname?: string;
  teamId?: string;
  teamName?: string;
  inviteLink?: string;
}

// shared/assets/types.ts (future)
export interface AssetMetadata {
  name: string;
  path: string;
  type: "image" | "svg";
  size?: "sm" | "md" | "lg" | "xl";
}
```

### Sub-Agent Structure

```markdown
# Agent: fsd-architect

**Role**: FSD 아키텍처 준수 가이드
**Layers**: app, pages, widgets, features, entities, shared
**Rules**:

- 단방향 의존성: app → pages → widgets → features → entities → shared
- 슬라이스 간 직접 참조 금지
- Public API (`index.ts`) 사용 강제

**Instructions**:

1. 코드 배치 시 FSD 레이어 규칙 준수
2. 잘못된 위치 코드 발견 시 경고
3. import 경로 검증 (Public API 사용 확인)
```

---

## 4. Implementation Plan

### Phase 1: Foundation & Documentation

**Tasks**:

1. `.claude/agents/` 폴더 생성
2. CLAUDE.md에 FSD 섹션 추가
3. `.claude/rules/fsd.md` 상세 문서 생성
4. Asset 네이밍 컨벤션 문서 업데이트 (`.claude/rules/assets.md`)

**Files to Create/Modify**:

- `.claude/agents/` (CREATE directory)
- `CLAUDE.md` (MODIFY - FSD 섹션 추가)
- `.claude/rules/fsd.md` (CREATE - FSD 상세 가이드)
- `.claude/rules/assets.md` (MODIFY - 네이밍 컨벤션 업데이트)

**Estimated Effort**: Small

### Phase 2: Asset Reorganization

**Tasks**:

1. 기존 assets 네이밍 분석
2. SVG 파일명을 `ic_{shape_or_role}_{size}` 형식으로 변경
3. Image 파일명을 `img_{context}_{descriptor}` 형식으로 변경
4. `index.ts` export 업데이트
5. 모든 import 경로 수정

**Files to Modify**:

- `src/shared/assets/svg/big-check.svg` → `src/shared/assets/svg/ic_check_lg.svg`
- `src/shared/assets/svg/delete.svg` → `src/shared/assets/svg/ic_delete_md.svg`
- `src/shared/assets/svg/google.svg` → `src/shared/assets/svg/ic_google_lg.svg`
- `src/shared/assets/svg/info-circle.svg` → `src/shared/assets/svg/ic_info_md.svg`
- `src/shared/assets/svg/kakao.svg` → `src/shared/assets/svg/ic_kakao_lg.svg`
- `src/shared/assets/svg/star.svg` → `src/shared/assets/svg/ic_star_md.svg`
- `src/shared/assets/images/logo.jpeg` → `src/shared/assets/images/img_logo.jpeg`
- `src/shared/assets/images/signin-image.jpg` → `src/shared/assets/images/img_signin_banner.jpg`
- `src/shared/assets/svg/index.ts` (MODIFY)
- `src/shared/assets/images/index.ts` (MODIFY)
- All files importing assets (UPDATE imports)

**Dependencies**: Phase 1 완료 필요

**Estimated Effort**: Medium

### Phase 3: Signin Code Migration

**Tasks**:

1. `features/auth/` 슬라이스 생성
2. Signin step 컴포넌트 이동 (`src/components/signin/` → `features/auth/ui/`)
3. `features/auth/model/types.ts` 생성 (SigninStep, SigninState)
4. `features/auth/index.ts` Public API 생성
5. `pages/signin/` 슬라이스 생성
6. `SigninPage.tsx` 이동 및 import 경로 수정 (`src/pages/` → `pages/signin/ui/`)
7. `pages/signin/index.ts` Public API 생성
8. `src/App.tsx` → `src/app/App.tsx` 이동
9. `src/main.tsx`에서 App import 경로 수정
10. 기존 `src/components/signin/` 폴더 삭제
11. 기존 `src/pages/SigninPage.tsx` 삭제

**Files to Create**:

- `src/features/auth/ui/LoginStep.tsx` (MOVE)
- `src/features/auth/ui/NicknameStep.tsx` (MOVE)
- `src/features/auth/ui/TeamStep.tsx` (MOVE)
- `src/features/auth/ui/TeamNameStep.tsx` (MOVE)
- `src/features/auth/ui/InviteLinkStep.tsx` (MOVE)
- `src/features/auth/model/types.ts` (CREATE)
- `src/features/auth/index.ts` (CREATE)
- `src/pages/signin/ui/SigninPage.tsx` (MOVE)
- `src/pages/signin/index.ts` (CREATE)
- `src/app/App.tsx` (MOVE)

**Files to Delete**:

- `src/components/signin/LoginStep.tsx`
- `src/components/signin/NicknameStep.tsx`
- `src/components/signin/TeamStep.tsx`
- `src/components/signin/TeamNameStep.tsx`
- `src/components/signin/InviteLinkStep.tsx`
- `src/pages/SigninPage.tsx`
- `src/App.tsx`
- `src/components/signin/` (directory)

**Files to Modify**:

- `src/main.tsx` (UPDATE import path for App)
- `src/app/App.tsx` (UPDATE import path for SigninPage)

**Dependencies**: Phase 2 완료 필요

**Estimated Effort**: Medium

### Phase 4: Sub-Agent System Integration

**Tasks**:

1. `fsd-architect` 에이전트 생성 (`.claude/agents/fsd-architect.md`)
2. `asset-manager` 에이전트 생성 (`.claude/agents/asset-manager.md`)
3. task-init skill 업데이트 (에이전트 동적 생성 로직 추가)
4. task-done skill 업데이트 (에이전트 회수 로직 추가)
5. CLAUDE.md에 서브에이전트 시스템 설명 추가

**Files to Create/Modify**:

- `.claude/agents/fsd-architect.md` (CREATE)
- `.claude/agents/asset-manager.md` (CREATE)
- `.claude/skills/task-init/SKILL.md` (MODIFY - 에이전트 생성 로직)
- `.claude/skills/task-done/SKILL.md` (MODIFY - 에이전트 회수 로직)
- `CLAUDE.md` (MODIFY - 서브에이전트 섹션 추가)

**Dependencies**: Phase 1-3 완료 필요

**Estimated Effort**: Large

### Phase 5: Testing & Validation

**Tasks**:

1. 모든 import 경로 검증
2. 빌드 성공 확인 (`npm run build`)
3. 타입 체크 통과 확인 (`npx tsc --noEmit`)
4. 린트 통과 확인 (`npm run lint`)
5. 개발 서버 실행 및 Signin 페이지 동작 확인
6. Asset 로딩 확인 (이미지, SVG 정상 표시)

**Validation Commands**:

```bash
npm run build
npx tsc --noEmit
npm run lint
npm run dev
```

**Dependencies**: Phase 1-4 완료 필요

**Estimated Effort**: Small

### Vercel React Best Practices

이 작업은 주로 구조 개편이므로 런타임 최적화보다는 번들 최적화에 집중합니다.

**CRITICAL**:

- `bundle-barrel-imports`: Public API (`index.ts`) 사용 시 tree-shaking 보장
  - ✅ `import { LoginStep } from '@/features/auth'` (OK)
  - ❌ `import { LoginStep } from '@/features/auth/ui/LoginStep'` (직접 import 금지)

**HIGH**:

- `server-component`: 페이지 컴포넌트는 Server Component로 유지 (현재는 React Router이므로 해당 없음, 향후 Next.js 전환 시 고려)

**MEDIUM**:

- `rerender-memo`: Step 컴포넌트들은 필요 시 `React.memo` 적용
  - 각 Step이 독립적이므로 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 검증

- 테스트 타입: Build & Type Check
- 커버리지 목표: 100% (모든 파일이 정상 빌드되어야 함)
- 테스트 케이스:
  - `npm run build` 성공
  - `npx tsc --noEmit` 에러 없음
  - `npm run lint` 경고 없음

**TS-2**: Import 경로 검증

- 테스트 타입: Static Analysis
- 검증 항목:
  - 모든 import 경로가 `@/` alias 사용
  - FSD Public API를 통한 import (직접 경로 금지)
  - Asset import가 `@/shared/assets` 사용

**TS-3**: 기능 동작 검증

- 테스트 타입: Manual Testing
- 테스트 시나리오:
  - Signin 페이지 접근 (`/signin`)
  - 각 Step 전환 동작
  - 이미지 및 SVG 아이콘 정상 표시
  - 브라우저 콘솔 에러 없음

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
npm run dev         # 개발 서버 실행
```

### Acceptance Criteria

- [ ] 모든 signin 코드가 FSD 레이어에 배치됨
- [ ] `features/auth/` 슬라이스에 Public API (`index.ts`) 존재
- [ ] `pages/signin/` 슬라이스에 Public API (`index.ts`) 존재
- [ ] CLAUDE.md에 FSD 섹션 추가됨
- [ ] `.claude/rules/fsd.md` 문서 작성됨
- [ ] Asset 네이밍 컨벤션 적용됨 (SVG: `ic_*`, Images: `img_*`)
- [ ] `.claude/agents/` 폴더 및 에이전트 파일 생성됨
- [ ] task-init/task-done에 서브에이전트 로직 추가됨
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과
- [ ] Signin 페이지 정상 동작

### Validation Checklist

**기능 동작**:

- [ ] `/signin` 페이지 접근 가능
- [ ] LoginStep에서 Kakao, Google 아이콘 표시
- [ ] Step 전환 동작 (login → nickname → team → ...)
- [ ] 모든 이미지/SVG 정상 로딩

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] import 경로 일관성 (모두 `@/` alias 사용)

**FSD 규칙**:

- [ ] 단방향 의존성 준수 (app → pages → features → shared)
- [ ] 슬라이스 간 직접 참조 없음 (Public API 사용)
- [ ] 각 슬라이스에 `index.ts` 존재

**Asset 관리**:

- [ ] SVG 파일명: `ic_{shape_or_role}_{size}` 형식
- [ ] Image 파일명: `img_{context}_{descriptor}` 형식
- [ ] `index.ts` export가 camelCase (파일명 kebab-case)

---

## 6. Risks & Dependencies

### Risks

**R-1**: Import 경로 누락으로 인한 빌드 실패

- **Risk**: 많은 파일을 이동하면서 일부 import 경로를 놓칠 수 있음
- **Impact**: HIGH
- **Probability**: MEDIUM
- **Mitigation**:
  - 단계별로 빌드 검증 (`npm run build`)
  - TypeScript가 자동으로 에러 표시
  - Phase 3에서 한 번에 하나씩 파일 이동
- **Status**: Phase 3에서 주의 필요

**R-2**: Asset 네이밍 변경으로 인한 이미지 깨짐

- **Risk**: 파일명 변경 후 일부 import를 업데이트하지 못하면 이미지가 표시되지 않음
- **Impact**: MEDIUM
- **Probability**: LOW
- **Mitigation**:
  - 모든 asset import를 먼저 찾기 (`grep -r "from '@/shared/assets'"`)
  - 파일명 변경 후 즉시 index.ts 업데이트
  - 개발 서버 실행하여 시각적 확인
- **Status**: Phase 2에서 체계적 진행

**R-3**: 서브에이전트 생성 로직 복잡도

- **Risk**: 동적 에이전트 생성 로직이 복잡하여 초기 구현 시간 증가
- **Impact**: LOW (워크플로우 개선이지 기능 변경 아님)
- **Probability**: HIGH
- **Mitigation**:
  - Phase 4를 마지막에 배치하여 시간 확보
  - 간단한 에이전트부터 시작 (fsd-architect, asset-manager)
  - 점진적 개선 (초기 버전은 단순하게)
- **Status**: 시간 확보 중

### Dependencies

**D-1**: FSD 문서 (docs/guides/FSD.md)

- **Dependency**: FSD 아키텍처 가이드 문서
- **Required For**: Phase 1 (CLAUDE.md 작성 시 참조)
- **Status**: AVAILABLE ✅
- **Owner**: 기존 문서 활용

**D-2**: 기존 코드 안정성

- **Dependency**: Signin 관련 코드가 현재 정상 동작해야 함
- **Required For**: Phase 3 (마이그레이션 전 기준점)
- **Status**: IN_PROGRESS (git status에 많은 변경사항)
- **Owner**: 현재 브랜치 기준으로 작업

**D-3**: Build 도구 (Vite, TypeScript)

- **Dependency**: Vite 빌드 시스템 및 TypeScript 컴파일러
- **Required For**: All phases (검증용)
- **Status**: AVAILABLE ✅
- **Owner**: 프로젝트 설정

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Phase-based Rollout**:

1. **Phase 1-2**: 문서 및 Asset 정리 (기능 영향 없음)
   - CLAUDE.md, FSD 문서 추가
   - Asset 네이밍 변경
   - 빌드 검증

2. **Phase 3**: 코드 마이그레이션 (기능 영향 있음)
   - Signin 코드 FSD 이동
   - Import 경로 업데이트
   - 기능 동작 검증

3. **Phase 4**: 서브에이전트 시스템 (워크플로우 개선)
   - Agent 생성
   - Skill 업데이트
   - 다음 작업부터 자동 적용

**Rollback Plan**:

- 각 Phase 완료 후 커밋 생성
- 문제 발생 시 이전 Phase 커밋으로 롤백
- Phase 3 실패 시: `git reset --hard` 후 경로 수정 재시도

**Feature Flags**: N/A (구조 개편이므로 Feature Flag 불필요)

### Success Metrics

**SM-1**: 코드 구조 개선

- **Metric**: FSD 레이어에 배치된 파일 비율
- **Target**: Signin 관련 코드 100% 마이그레이션
- **Measurement**: 파일 개수 (이동 전 7개 → 이동 후 0개)

**SM-2**: 빌드 안정성

- **Metric**: 빌드 성공 여부
- **Target**: 100% (에러 없음)
- **Measurement**: `npm run build && npx tsc --noEmit && npm run lint`

**SM-3**: 개발자 경험

- **Metric**: Claude Code가 FSD 규칙을 따르는지
- **Target**: 향후 작업에서 검증
- **Measurement**: 다음 이슈 작업 시 코드 배치 위치 확인

### Monitoring

**M-1**: 빌드 시간

- Phase 3 이후 빌드 시간 증가 여부 확인
- 예상: 파일 이동만 하므로 영향 없음

**M-2**: 개발 서버 HMR

- Vite HMR 정상 동작 확인
- 파일 경로 변경 후 핫 리로드 테스트

---

## 8. Timeline & Milestones

### Milestones

**M1**: 문서화 완료

- Phase 1 완료 (CLAUDE.md, FSD 문서)
- **목표**: 2026-01-24
- **Status**: NOT_STARTED

**M2**: Asset 네이밍 적용

- Phase 2 완료 (Asset 재정리)
- **목표**: 2026-01-24
- **Status**: NOT_STARTED

**M3**: 코드 마이그레이션 완료

- Phase 3 완료 (Signin 코드 FSD 이동)
- **목표**: 2026-01-24
- **Status**: NOT_STARTED

**M4**: 서브에이전트 시스템 구축

- Phase 4 완료 (Agent 생성 및 Skill 업데이트)
- **목표**: 2026-01-24
- **Status**: NOT_STARTED

**M5**: 최종 검증

- Phase 5 완료 (빌드, 기능 검증)
- **목표**: 2026-01-24
- **Status**: NOT_STARTED

### Estimated Timeline

- **Phase 1**: 1-2 hours (문서 작성)
- **Phase 2**: 1-2 hours (Asset 네이밍 변경)
- **Phase 3**: 2-3 hours (코드 이동 및 import 수정)
- **Phase 4**: 3-4 hours (서브에이전트 시스템)
- **Phase 5**: 0.5-1 hour (검증)
- **Total**: 7.5-12 hours

---

## 9. References

### Related Issues

- Issue #10: [FSD 기반 프로젝트 구조 리팩토링 및 문서화](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/10)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [docs/guides/FSD.md](../guides/FSD.md) - FSD 아키텍처 가이드
- [docs/guides/PROCESS.md](../guides/PROCESS.md) - 개발 프로세스
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md)
- [.claude/rules/task-management.md](../../.claude/rules/task-management.md)
- [.claude/rules/assets.md](../../.claude/rules/assets.md)

**커맨드**:

- [/issue-start](../../.claude/commands/issue-start.md)
- [/task-init](../../.claude/commands/task-init.md)
- [/task-done](../../.claude/commands/task-done.md)
- [/commit](../../.claude/commands/commit.md)
- [/pr](../../.claude/commands/pr.md)

**스킬**:

- [task-init](../../.claude/skills/task-init/SKILL.md)
- [task-done](../../.claude/skills/task-done/SKILL.md)
- [vercel-react-best-practices](../../.claude/skills/vercel-react-best-practices/SKILL.md)

**에이전트** (이 작업 후 생성됨):

- [fsd-architect](../../.claude/agents/fsd-architect.md)
- [asset-manager](../../.claude/agents/asset-manager.md)

### External Resources

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [카카오페이 기술블로그 FSD 적용기](https://tech.kakaopay.com/post/fsd/)
- [Asset Naming Convention Best Practices](https://purplegriffon.com/blog/asset-naming-convention-best-practices)
- [Image File Management: Naming Conventions](https://caseytempleton.com/blog/image-file-naming-conventions-folder-structure/)
- [Front-end Naming & Structure](https://medium.com/@mfflik/front-end-naming-structure-fconventions-27a3218444e6)

### Key Learnings

- FSD는 점진적 도입이 가능하며, 신규 코드부터 적용하는 Bottom-up 방식이 효과적
- Asset 네이밍 컨벤션은 팀 차원의 합의가 중요하며, 자동화 도구가 있으면 유지보수 용이
- 서브에이전트 시스템은 복잡하지만 장기적으로 일관성 있는 코드 품질 확보에 도움

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.
> 작업 중에는 비워두고, 완료 후 자동 생성됩니다.

**Completion Date**: (작업 완료 후)
**Implemented By**: Claude Sonnet 4.5

---

**Plan Status**: Planning
**Last Updated**: 2026-01-24
**Next Action**: User approval for implementation

---

## Implementation Summary

**Completion Date**: 2026-01-24
**Implemented By**: Claude Sonnet 4.5

### Changes Made

#### Phase 1: Foundation & Documentation ✅

- Created [.claude/rules/fsd.md](.claude/rules/fsd.md) - Comprehensive FSD architecture guide (600+ lines)
- Updated [CLAUDE.md](../../CLAUDE.md#L64-73) - Added FSD section with sub-agent system documentation
- Created [.claude/agents/fsd-architect.md](../../.claude/agents/fsd-architect.md) - FSD enforcement agent (300+ lines)
- Created [.claude/agents/asset-manager.md](../../.claude/agents/asset-manager.md) - Asset naming automation agent (350+ lines)
- Updated [.claude/rules/assets.md](../../.claude/rules/assets.md) - New snake_case naming convention with prefixes

#### Phase 2: Asset Reorganization ✅

**SVG Files Renamed** (6 files):

- `big-check.svg` → `ic_check_lg.svg`
- `delete.svg` → `ic_delete_md.svg`
- `google.svg` → `ic_google_lg.svg`
- `info-circle.svg` → `ic_info_md.svg`
- `kakao.svg` → `ic_kakao_lg.svg`
- `star.svg` → `ic_star_md.svg`

**Image Files Renamed** (2 files):

- `logo.jpeg` → `img_logo.jpeg`
- `signin-image.jpg` → `img_signin_banner.jpg`

**Export Updates**:

- [src/shared/assets/svg/index.ts](../../src/shared/assets/svg/index.ts) - Updated to camelCase exports
- [src/shared/assets/images/index.ts](../../src/shared/assets/images/index.ts) - Updated to camelCase exports

**Code References Updated** (5 files):

- [src/components/signin/LoginStep.tsx](../../src/features/auth/ui/LoginStep.tsx#L47,50,53) - Updated logo and social icons
- [src/components/signin/NicknameStep.tsx](../../src/features/auth/ui/NicknameStep.tsx#L45) - Updated delete icon
- [src/components/signin/TeamNameStep.tsx](../../src/features/auth/ui/TeamNameStep.tsx#L47) - Updated delete icon
- [src/components/signin/InviteLinkStep.tsx](../../src/features/auth/ui/InviteLinkStep.tsx#L47) - Updated delete icon
- [src/pages/SigninPage.tsx](../../src/pages/signin/ui/SigninPage.tsx#L86) - Updated signin banner

#### Phase 3: Signin Code Migration ✅

**Created FSD Structure**:

- [src/features/auth/ui/](../../src/features/auth/ui/) - 5 signin step components
  - [LoginStep.tsx](../../src/features/auth/ui/LoginStep.tsx)
  - [NicknameStep.tsx](../../src/features/auth/ui/NicknameStep.tsx)
  - [TeamStep.tsx](../../src/features/auth/ui/TeamStep.tsx)
  - [TeamNameStep.tsx](../../src/features/auth/ui/TeamNameStep.tsx)
  - [InviteLinkStep.tsx](../../src/features/auth/ui/InviteLinkStep.tsx)
- [src/features/auth/model/types.ts](../../src/features/auth/model/types.ts) - SigninStep and TeamOption types
- [src/features/auth/index.ts](../../src/features/auth/index.ts) - Public API
- [src/pages/signin/ui/SigninPage.tsx](../../src/pages/signin/ui/SigninPage.tsx) - Main signin page
- [src/pages/signin/index.ts](../../src/pages/signin/index.ts) - Public API
- [src/app/App.tsx](../../src/app/App.tsx) - Moved to app layer

**Deleted Old Structure**:

- Removed `src/components/signin/` directory (5 files)
- Removed `src/pages/SigninPage.tsx`
- Removed `src/App.tsx` (moved to app layer)

**Import Path Updates**:

- [src/main.tsx](../../src/main.tsx#L4) - Updated App import to `./app/App`
- [src/app/App.tsx](../../src/app/App.tsx#L2) - Updated to use `@/pages/signin`
- [src/pages/signin/ui/SigninPage.tsx](../../src/pages/signin/ui/SigninPage.tsx#L3-10) - Updated to use `@/features/auth`

#### Phase 4: Sub-Agent System Integration ✅

- Updated [.claude/skills/task-init/SKILL.md](../../.claude/skills/task-init/SKILL.md#L101-158) - Added dynamic agent creation process
- Updated [.claude/skills/task-done/SKILL.md](../../.claude/skills/task-done/SKILL.md#L132-172) - Added agent cleanup process
- Updated [CLAUDE.md](../../CLAUDE.md#L49-57) - Added sub-agent system documentation

#### Phase 5: Testing & Validation ✅

All quality gates passed successfully.

### Quality Validation

- [x] **Build**: Success (`npm run build`)
- [x] **Type Check**: Passed (`npx tsc --noEmit`)
- [x] **Lint**: Passed (`npm run lint`)
- [x] **Tests**: N/A (no test files exist yet)
- [x] **FSD Structure**: Verified with file tree analysis
- [x] **Assets**: All assets correctly bundled in dist/

### Deviations from Plan

**No Major Deviations**: The implementation followed the plan closely.

**Minor Adjustments**:

- Asset naming convention uses underscores instead of hyphens (e.g., `ic_check_lg` not `ic-check-lg`) for better consistency with typical conventions
- Size descriptors use abbreviations (`sm`, `md`, `lg`) instead of pixel values for flexibility

### Performance Impact

**Bundle Impact**:

- No significant bundle size change (structure refactoring only)
- Assets properly optimized (see dist output):
  - `img_logo.jpeg`: 12.69 KB
  - `img_signin_banner.jpg`: 55.14 KB
  - `ic_google_lg.svg`: 82.30 KB (gzipped: 55.46 KB)

**FSD Benefits**:

- Improved code organization and maintainability
- Clear dependency boundaries
- Better tree-shaking potential with Public APIs

### Sub-Agents Used

**Task-Specific Agents Created**:

- **fsd-architect** (8.9 KB): Enforced FSD layer rules, validated dependency directions
- **asset-manager** (10.3 KB): Automated asset naming convention enforcement and validation

**Actions Performed**:

- Renamed 8 asset files to new conventions
- Migrated 8 signin-related files to FSD structure
- Created 5 new index.ts Public API files
- Updated 12+ import references across the codebase

### Follow-up Tasks

- [ ] Migrate remaining pages/components to FSD structure (ArchivePage, RetrospectivePage, etc.)
- [ ] Add unit tests for signin flow
- [ ] Implement Zustand state management for auth feature
- [ ] Consider adding API layer refactoring

### Acceptance Criteria Status

All planned acceptance criteria met:

- [x] All signin code moved to FSD layers
- [x] Public APIs (`index.ts`) created for `features/auth/` and `pages/signin/`
- [x] CLAUDE.md updated with FSD section
- [x] `.claude/rules/fsd.md` documentation created
- [x] Asset naming conventions applied (SVG: `ic_*`, Images: `img_*`)
- [x] `.claude/agents/` folder with agent files created
- [x] task-init/task-done updated with sub-agent logic
- [x] Build success
- [x] Type check success
- [x] Lint passed
- [x] Signin page functional

### Notes

- FSD architecture successfully integrated into Claude Code workflow
- Sub-agent system provides automated architecture enforcement
- Asset naming conventions significantly improve organization
- All changes are non-breaking and maintain existing functionality
- Project ready for continued FSD-based development

**Documentation Added**: 5 new/updated files (1,500+ lines total)
**Code Migrated**: 8 files reorganized into FSD structure
**Assets Reorganized**: 8 files renamed with new conventions
