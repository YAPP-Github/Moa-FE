# CLAUDE.md

> Claude Code가 이 프로젝트에서 작업할 때 따라야 할 핵심 규칙입니다.
> 자세한 내용은 `.claude/rules/`를 참조하세요.

---

## WHY: 프로젝트 목적

**business_plan_k**: AI 기반 사업계획서 작성 플랫폼으로, 창업자가 전문적인 사업계획서를 AI 도움으로 빠르게 작성할 수 있습니다. 5가지 유형 지원 (초기, 예비, 성장, 재도전, 청년) + Stripe 결제 연동.

---

## WHAT: 기술 스택

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript 5.9
- **Styling**: Tailwind CSS 4 + Radix UI + Shadcn
- **Backend**: Supabase + Stripe + Google Gemini
- **State**: Zustand

---

## HOW: 작업 방법

### 1. 품질 검증

모든 코드 변경 후 반드시:

```bash
npm run build      # 빌드 성공 필수
npm run lint       # 린트 오류 수정 필수
npx tsc --noEmit   # 타입 오류 수정 필수
```

### 2. 워크플로우

```bash
/issue-start <description>  # 이슈 생성 + 브랜치 생성
/task-init ["설명"] [이미지] # 작업 계획 수립 (+ 추가 컨텍스트)
# ... 구현 ...
/task-done                  # 작업 완료 문서화
/commit                     # 커밋
/pr                         # PR 생성
```

**task-init 옵션**: 텍스트 설명, 이미지(디자인 목업/스크린샷), 또는 둘 다 추가 가능

**서브에이전트 시스템**:

- task-init 시 작업 타입에 따라 `.claude/agents/`에 동적 생성
  - FSD 작업: `fsd-architect` (레이어 규칙 검증)
  - 에셋 작업: `asset-manager` (네이밍 자동 수정)
  - React 개발: `react-developer` (best practices 자동 적용)
  - 코드 리뷰: `code-reviewer`, 테스트: `test-writer`, 문서: `doc-writer`
- task-done 시 생성된 에이전트 자동 정리
- 이슈 번호로 태깅되어 추적 가능

자세한 워크플로우는 [.claude/rules/workflows.md](.claude/rules/workflows.md) 참조

### 3. React Best Practices

**자동 적용**: 모든 React/Next.js 코드는 Vercel React Best Practices를 따름

- Skills: `.claude/skills/vercel-react-best-practices/`
- 규칙: 45개 규칙 (8개 카테고리)
- 우선순위: async-_, bundle-_ (CRITICAL) → server-_ (HIGH) → rerender-_ (MEDIUM)

**서브에이전트**:

- `react-developer`: 코드 작성 시 자동 적용
- `code-reviewer`: 리뷰 시 규칙 검증

### 4. FSD 아키텍처

**Feature-Sliced Design**: 모든 코드는 FSD 레이어 구조를 따름

- **레이어**: `app → pages → widgets → features → entities → shared` (단방향 의존성)
- **원칙**: 슬라이스 간 직접 참조 금지, Public API (`index.ts`) 사용 강제
- **코드 배치**: 신규 코드는 FSD 우선, 기존 코드는 점진적 이관
- **자동화**: task-init 시 `fsd-architect`, `asset-manager` 에이전트 활성화

자세한 내용은 [.claude/rules/fsd.md](.claude/rules/fsd.md) 및 [docs/guides/FSD.md](docs/guides/FSD.md) 참조

### 5. 컨벤션

- **브랜치**: `{type}/{issue_number}-{slug}` (예: `feat/25-add-feature`)
- **커밋**: `type(scope): subject` + `Closes #123`
- **라벨**: `type:*`, `area:*`, `priority:*` (3개 필수)
- **계획 문서**: `docs/plans/{issue_number}-{description}.md`
- **Assets**: `src/shared/assets/` (중앙집중형)
  - SVG: `ic_{descriptor}_{size}.svg` → `icDescriptorSize`
  - Images: `img_{context}_{descriptor}.ext` → `imgContextDescriptor`
  - 자세한 내용: [.claude/rules/assets.md](.claude/rules/assets.md)

---

## 참조 문서

### 작업 관리

- [작업 플래닝 상세 가이드](.claude/rules/task-management.md)
- [계획 문서 템플릿](docs/plans/TEMPLATE.md)

### 코드 컨벤션

- [FSD 아키텍처 가이드](.claude/rules/fsd.md) - Feature-Sliced Design 레이어, 의존성, 코드 배치
- [Assets 관리 규칙](.claude/rules/assets.md) - 이미지/SVG 네이밍 컨벤션, 자동 정리

### 실수 & 해결

- [실수 기록 및 규칙](.claude/rules/mistakes.md)

### Custom Commands

**Claude Code 커맨드** (`.claude/commands/`):

- `/issue-start`: 이슈 생성 + 브랜치 생성 (웹서핑/코드베이스 탐색 포함)
- `/task-init`: 작업 계획 수립 (텍스트/이미지 입력 지원)
- `/task-done`: 작업 완료 문서화 (품질 게이트 검증)
- `/commit`: Conventional Commits 커밋 생성
- `/pr`: Pull Request 생성

**참고**: `.cursor/commands/`에도 동일한 커맨드 파일이 있어 Cursor IDE와 호환됩니다.

### Skills

- `vercel-react-best-practices`: React 성능 최적화 (`.claude/skills/vercel-react-best-practices/`)

**마지막 업데이트**: 2026-01-24
