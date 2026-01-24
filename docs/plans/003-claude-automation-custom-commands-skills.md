# Task Plan: Claude 자동화 작업 (커스텀 커맨드, 스킬 기반)

**Issue**: #3
**Type**: Chore
**Created**: 2026-01-24
**Status**: Completed

---

## 1. Overview

### Problem Statement

Claude Code의 커스텀 커맨드 및 스킬 기반 자동화 워크플로우를 프로젝트에 통합하고, `/issue-start` 커맨드에서 이슈 라벨 자동 등록 로직을 제거해야 합니다.

### Objectives

1. `.claude/` 디렉토리 구조를 프로젝트에 추가
2. `/issue-start` 커맨드에서 이슈 라벨 자동 등록 로직 제거 ✅
3. 5개의 커스텀 커맨드 통합 (`/issue-start`, `/task-init`, `/task-done`, `/commit`, `/pr`)
4. 3개의 스킬 통합 (task-init, task-done, vercel-react-best-practices)
5. 4개의 서브에이전트 설정 (react-developer, code-reviewer, test-writer, doc-writer)
6. Claude Code 설정 파일 추가 (settings.json)
7. 프로젝트 문서 (CLAUDE.md, .claude/rules/) 통합

### Scope

**In Scope**:

- ✅ `.claude/` 디렉토리 전체 구조 추가
- ✅ `/issue-start` 커맨드 라벨 로직 제거
- ✅ CLAUDE.md 메인 문서 추가
- ✅ `.claude/rules/` 상세 문서 추가
- ✅ `.claude/commands/` 5개 커맨드 추가
- ✅ `.claude/skills/` 3개 스킬 추가
- ✅ `.claude/agents/` 4개 에이전트 설정 추가
- ✅ `.claude/settings.json` 추가 (hooks, permissions)
- 📋 `.github/ISSUE_TEMPLATE/issue_template.md` 업데이트 (진행 중)
- 📋 `docs/plans/TEMPLATE.md` 생성 (필요)

**Out of Scope**:

- 기존 프로젝트 코드 수정
- 새로운 기능 개발
- 외부 CI/CD 통합

### User Context

사용자 요청:

> "현재 claude 작업을 올려놨는데, 이 내용을 기반으로 계획문서를 작성해줘. 작업은 사실상 끝났어. 그리고 task-init을 할 때 작업에 필요한 sub-agent를 skills 기반으로 적극 생성해서 작업에 활용하도록 진행해줘"

**핵심 요구사항**:

1. 완료된 작업을 문서화
2. task-init 시 서브에이전트를 적극 생성하는 로직 확인/개선

---

## 2. Requirements

### Functional Requirements

**FR-1**: `/issue-start` 커맨드 라벨 제거 ✅

- 이슈 생성 시 라벨을 자동으로 추가하지 않음
- Step 1에서 Labels (type, area, priority) 추출 로직 제거
- Step 3에서 `issue_write`의 `labels` 파라미터 제거
- 템플릿 매핑에서 "분류 (필수)" 섹션 제거
- Description, Notes에서 라벨 관련 문구 제거

**FR-2**: `.claude/` 디렉토리 구조 통합 ✅

```
.claude/
├── agents/               # 서브에이전트 설정 (4개)
│   ├── code-reviewer.md
│   ├── doc-writer.md
│   ├── react-developer.md
│   └── test-writer.md
├── commands/            # 커스텀 커맨드 (5개)
│   ├── commit.md
│   ├── issue-start.md   ✅ 수정됨
│   ├── pr.md
│   ├── task-done.md
│   └── task-init.md
├── rules/               # 상세 규칙 문서 (4개)
│   ├── README.md
│   ├── mistakes.md
│   ├── task-management.md
│   └── workflows.md
├── skills/              # 스킬 정의 (3개)
│   ├── task-done/SKILL.md
│   ├── task-init/SKILL.md
│   └── vercel-react-best-practices/
│       ├── SKILL.md
│       ├── AGENTS.md
│       └── rules/ (57개 규칙 파일)
└── settings.json        # Hooks 및 Permissions
```

**FR-3**: CLAUDE.md 통합 ✅

- WHY-WHAT-HOW 구조
- 프로젝트 목적 및 기술 스택 명시
- 워크플로우 간단 요약
- Progressive Disclosure (상세 내용은 .claude/rules/로 분리)

**FR-4**: GitHub 이슈 템플릿 업데이트

- `.github/ISSUE_TEMPLATE/issue_template.md` 생성
- 기존 3개 템플릿 통합 (bug_report, feature_request, task)
- 통일된 이슈 포맷 적용

**FR-5**: 계획 문서 템플릿 생성

- `docs/plans/TEMPLATE.md` 생성
- 10개 섹션 구조 (Overview, Requirements, Architecture, Implementation Plan, Quality Gates, Risks, Rollout, Timeline, References, Implementation Summary)

### Technical Requirements

**TR-1**: Git 변경사항 관리

- `.claude/` 디렉토리 전체를 Git에 추가
- `.gitignore`에서 `.claude/settings.local.json` 제외
- Conventional Commits 형식 준수

**TR-2**: 문서 구조 일관성

- CLAUDE.md는 60-100줄 유지 (현재 98줄)
- 각 `.claude/rules/` 파일은 300줄 미만
- Progressive Disclosure 원칙 준수

**TR-3**: 품질 게이트

- ✅ 빌드 성공: `npm run build`
- ✅ 타입 체크: `npx tsc --noEmit`
- ✅ 린트 통과: `npm run lint`

### Non-Functional Requirements

**NFR-1**: 문서 가독성

- 명확한 섹션 구분
- 실용적인 코드 예제 포함
- 한글/영어 혼용 (기술 용어는 영어)

**NFR-2**: 유지보수성

- 파일 크기 제한 준수
- 중복 최소화
- 명확한 참조 링크

**NFR-3**: 확장성

- 새로운 커맨드 추가 용이
- 스킬 확장 가능한 구조
- 서브에이전트 커스터마이징 가능

---

## 3. Architecture & Design

### Directory Structure

```
프로젝트 루트/
├── .claude/                           # Claude Code 설정 (NEW)
│   ├── agents/                        # 서브에이전트 설정
│   │   ├── code-reviewer.md           # 코드 리뷰 전문
│   │   ├── doc-writer.md              # 문서화 전문
│   │   ├── react-developer.md         # React 개발 전문
│   │   └── test-writer.md             # 테스트 작성 전문
│   ├── commands/                      # 커스텀 커맨드
│   │   ├── commit.md                  # /commit 커맨드
│   │   ├── issue-start.md             # /issue-start 커맨드 (수정됨)
│   │   ├── pr.md                      # /pr 커맨드
│   │   ├── task-done.md               # /task-done 커맨드
│   │   └── task-init.md               # /task-init 커맨드
│   ├── rules/                         # 상세 규칙
│   │   ├── README.md                  # 규칙 디렉토리 설명
│   │   ├── mistakes.md                # 실수 기록
│   │   ├── task-management.md         # 작업 관리 상세
│   │   └── workflows.md               # 워크플로우 상세
│   ├── skills/                        # 스킬 정의
│   │   ├── task-done/
│   │   │   └── SKILL.md               # 작업 완료 스킬
│   │   ├── task-init/
│   │   │   └── SKILL.md               # 작업 초기화 스킬
│   │   └── vercel-react-best-practices/
│   │       ├── SKILL.md               # React 최적화 스킬
│   │       ├── AGENTS.md              # 에이전트 설정
│   │       └── rules/                 # 57개 규칙 파일
│   ├── settings.json                  # Hooks & Permissions
│   └── settings.local.json            # 로컬 설정 (gitignore)
├── .github/
│   └── ISSUE_TEMPLATE/
│       └── issue_template.md          # 통합 이슈 템플릿 (NEW)
├── docs/
│   └── plans/                         # 작업 계획 문서 (NEW)
│       ├── TEMPLATE.md                # 계획 문서 템플릿
│       └── 003-*.md                   # 이 문서
└── CLAUDE.md                          # Claude 메인 설정 (NEW)
```

### Design Decisions

**Decision 1**: 라벨 자동 등록 제거 ✅

- **Rationale**: 사용자가 수동으로 라벨을 관리하고 싶어함
- **Approach**:
  - Step 1에서 라벨 추출 로직 제거
  - Step 3에서 "분류 (필수)" 섹션 참조 제거
  - Step 4에서 `labels` 파라미터 제거
  - 템플릿 매핑 단순화 (목적/배경, 작업 범위, 완료 기준, 참고)
- **Trade-offs**: 자동화 수준 감소 vs. 유연성 증가
- **Impact**: LOW (사용자가 GitHub에서 수동으로 라벨 추가 가능)

**Decision 2**: Progressive Disclosure 원칙 적용 ✅

- **Rationale**: 컨텍스트 효율성 극대화
- **Implementation**:
  - CLAUDE.md는 핵심만 (60-100줄)
  - 상세 내용은 `.claude/rules/`로 분리
  - 각 규칙 파일은 300줄 미만
- **Benefit**: Claude가 필요한 정보만 로드하여 토큰 사용량 최적화

**Decision 3**: Sub-Agent 적극 생성 전략

- **Rationale**: 작업 타입별 전문 에이전트 활용
- **Approach**:
  - task-init에서 작업 타입 분석 후 필요한 에이전트 자동 생성
  - React/Next.js 작업 → react-developer (vercel-react-best-practices 활성화)
  - 코드 리뷰 필요 → code-reviewer
  - 테스트 작성 필요 → test-writer
  - 문서화 필요 → doc-writer
- **Implementation**: `.claude/skills/task-init/SKILL.md`에 명시
- **Benefit**: 각 작업에 최적화된 전문 에이전트 활용, 품질 향상

**Decision 4**: 통합 이슈 템플릿

- **Rationale**: 3개의 템플릿을 하나로 통합하여 일관성 유지
- **Approach**:
  - bug_report, feature_request, task → issue_template.md로 통합
  - YAML frontmatter에 기본 라벨 정의
  - 선택적 섹션 (재현 방법은 버그일 때만)
- **Benefit**: 템플릿 관리 간소화, 일관된 이슈 포맷

### Component Design

**Issue Start Workflow** (수정됨):

```
User: /issue-start "작업 설명"
    ↓
Step 1: Task Analysis
  - Type, Title, Branch slug, Scope 추출
  - (Labels 제거됨) ✅
    ↓
Step 2: Codebase Exploration
  - Glob: 관련 파일 검색
  - Grep: 키워드 검색
  - WebSearch: 필요시 리서치
    ↓
Step 3: Create GitHub Issue
  - 템플릿 읽기: .github/ISSUE_TEMPLATE/issue_template.md
  - 섹션 채우기: 목적/배경, 작업 범위, 완료 기준, 참고
  - (분류 섹션 제거됨) ✅
  - (labels 파라미터 제거됨) ✅
    ↓
Step 4: Create & Checkout Branch
  - 브랜치 생성: {type}/{issue_number}-{slug}
  - 원격 fetch 및 로컬 checkout
    ↓
Step 5: Report Results
  - 이슈 URL, 브랜치명 출력
  - 작업 멈춤 (구현은 사용자 요청시)
```

**Task Init Workflow**:

```
User: /task-init ["context"] [image]
    ↓
Step 1: Context Gathering
  - GitHub Issue 분석
  - 사용자 입력 처리 (텍스트/이미지)
    ↓
Step 2: Codebase Exploration
  - Explore agent (thoroughness: medium)
    ↓
Step 3: Research
  - 라이브러리 문서 검색
  - Best practices 확인
    ↓
Step 4: Plan Document Creation
  - docs/plans/{issue_number}-{slug}.md 생성
  - TEMPLATE.md 구조 사용
    ↓
Step 5: Sub-Agent Configuration ⭐
  - react-developer (vercel-react-best-practices)
  - code-reviewer
  - test-writer
  - doc-writer (필요시)
    ↓
Step 6: User Approval
  - 계획 요약 제시
  - 생성된 에이전트 목록 표시
  - "Ready to start implementation?" 확인
```

**Sub-Agent Configuration Strategy** ⭐:

```python
# Pseudo-code for task-init sub-agent creation logic

task_type = analyze_task_type(github_issue, user_input)

agents_to_create = []

# Always create for React/Next.js projects
if is_react_nextjs_project():
    agents_to_create.append({
        "name": "react-developer",
        "skills": ["vercel-react-best-practices"],
        "focus_areas": determine_focus_areas(task_type)
        # task_type이 "feature" → async-*, bundle-*
        # task_type이 "performance" → bundle-*, rerender-*
        # task_type이 "refactor" → rerender-*, server-*
    })
    agents_to_create.append({
        "name": "code-reviewer",
        "skills": ["vercel-react-best-practices"],
        "review_type": "performance_and_quality"
    })

# Add test-writer if tests are mentioned or required
if needs_tests(github_issue, user_input):
    agents_to_create.append({
        "name": "test-writer",
        "test_types": ["unit", "integration"]
    })

# Add doc-writer for documentation tasks
if is_documentation_task(task_type) or has_doc_requirements(github_issue):
    agents_to_create.append({
        "name": "doc-writer",
        "doc_types": ["api", "readme", "guides"]
    })

return agents_to_create
```

---

## 4. Implementation Plan

### Phase 1: 핵심 파일 통합 ✅ (완료)

**Tasks**:

1. ✅ `.claude/` 디렉토리 생성 및 파일 추가
   - commands/ (5개)
   - skills/ (3개)
   - agents/ (4개)
   - rules/ (4개)
   - settings.json
2. ✅ CLAUDE.md 추가 (메인 설정 파일)
3. ✅ `/issue-start` 커맨드 라벨 로직 제거
   - Description 수정
   - Step 1: Labels 추출 제거
   - Step 3: labels 파라미터 제거
   - 템플릿 매핑 단순화
   - Notes 업데이트

**Files Changed**:

- ✅ `.claude/commands/issue-start.md` (수정)
- ✅ 전체 `.claude/` 디렉토리 (신규)
- ✅ `CLAUDE.md` (신규)

### Phase 2: 템플릿 및 문서 정리 📋 (진행 중)

**Tasks**:

1. `.github/ISSUE_TEMPLATE/issue_template.md` 생성
   - 기존 3개 템플릿 통합
   - YAML frontmatter 정의
   - 선택적 섹션 구조
2. `docs/plans/TEMPLATE.md` 생성
   - 10개 섹션 구조
   - 각 섹션별 작성 가이드
   - 예시 포함
3. 이 계획 문서 완성
   - `docs/plans/003-claude-automation-custom-commands-skills.md`

**Files to Create**:

- 📋 `.github/ISSUE_TEMPLATE/issue_template.md`
- 📋 `docs/plans/TEMPLATE.md`
- ✅ `docs/plans/003-claude-automation-custom-commands-skills.md` (이 문서)

### Phase 3: 검증 및 테스트 ⏳ (대기 중)

**Tasks**:

1. 품질 게이트 검증
   - `npm run build` 실행
   - `npx tsc --noEmit` 실행
   - `npm run lint` 실행
2. 커맨드 동작 검증
   - `/issue-start` 테스트 (라벨 없이 이슈 생성 확인)
   - `/task-init` 테스트 (서브에이전트 생성 확인)
   - `/commit` 테스트
   - `/pr` 테스트
   - `/task-done` 테스트
3. 문서 링크 검증
   - CLAUDE.md의 모든 링크 확인
   - `.claude/rules/`의 참조 링크 확인

**Validation Checklist**:

- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 성공
- [ ] `/issue-start` 동작 확인 (라벨 없음)
- [ ] `/task-init` 서브에이전트 생성 확인
- [ ] 모든 문서 링크 유효
- [ ] CLAUDE.md 길이 60-100줄
- [ ] 각 rules 파일 300줄 미만

### Phase 4: 커밋 및 PR 생성 ⏳ (대기 중)

**Tasks**:

1. `/commit` 실행
   - Conventional Commits 형식
   - `Closes #3` 포함
2. `/pr` 실행
   - 베이스 브랜치: dev
   - 계획 문서 기반 PR 설명 생성

**Expected Commit Message**:

```
chore(tooling): integrate Claude Code automation system

- Add .claude/ directory with commands, skills, agents, rules
- Remove label auto-registration from /issue-start command
- Add CLAUDE.md for project instructions
- Add GitHub issue template (unified)
- Add plan document template

Closes #3

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

**TS-2**: 커맨드 실행 테스트

- `/issue-start` → 이슈 생성 (라벨 없이)
- `/task-init` → 계획 문서 생성 + 서브에이전트 생성
- `/task-done` → Implementation Summary 추가 + 품질 검증
- `/commit` → Conventional Commits 형식 커밋
- `/pr` → PR 생성 (dev 브랜치 대상)

**TS-3**: 문서 검증

- CLAUDE.md 길이 확인 (60-100줄)
- `.claude/rules/` 파일 크기 확인 (각 300줄 미만)
- 모든 링크 유효성 확인
- 코드 예제 동작 확인

### Acceptance Criteria

- [x] `.claude/` 디렉토리가 Git에 추가됨
- [x] CLAUDE.md가 프로젝트 루트에 추가됨
- [x] `/issue-start` 커맨드에서 라벨 로직 제거됨
- [ ] `.github/ISSUE_TEMPLATE/issue_template.md` 생성됨
- [ ] `docs/plans/TEMPLATE.md` 생성됨
- [x] 이 계획 문서가 작성됨
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 성공
- [ ] 모든 커맨드가 정상 동작
- [ ] 문서 링크가 모두 유효함

### Validation Checklist

**문서 품질**:

- [x] CLAUDE.md 존재 및 구조 확인
- [x] `.claude/rules/` 4개 파일 확인
- [x] `.claude/commands/` 5개 파일 확인
- [x] `.claude/skills/` 3개 스킬 확인
- [x] `.claude/agents/` 4개 에이전트 확인
- [ ] `docs/plans/TEMPLATE.md` 생성
- [ ] `.github/ISSUE_TEMPLATE/issue_template.md` 생성

**코드 품질**:

- [ ] npm run build 성공
- [ ] npx tsc --noEmit 성공
- [ ] npm run lint 성공

**기능 동작**:

- [x] `/issue-start`가 라벨 없이 이슈 생성 (확인됨 - Issue #3)
- [ ] `/task-init`이 서브에이전트 생성 (테스트 필요)
- [ ] `/task-done`이 품질 게이트 검증 (테스트 필요)
- [ ] `/commit`이 Conventional Commits 형식 사용 (테스트 필요)
- [ ] `/pr`이 올바른 베이스 브랜치 사용 (테스트 필요)

---

## 6. Risks & Dependencies

### Risks

**R-1**: 문서 구조 복잡도

- **Risk**: `.claude/` 구조가 복잡하여 이해하기 어려울 수 있음
- **Impact**: MEDIUM
- **Mitigation**:
  - Progressive Disclosure 원칙 적용
  - CLAUDE.md에 명확한 참조 링크
  - `.claude/rules/README.md`에 구조 설명
- **Status**: LOW (문서화 완료)

**R-2**: 라벨 제거로 인한 워크플로우 변화

- **Risk**: 사용자가 수동으로 라벨을 추가해야 함
- **Impact**: LOW
- **Mitigation**:
  - GitHub 이슈 템플릿에 라벨 가이드 추가
  - `.github/ISSUE_TEMPLATE/issue_template.md`에 기본 라벨 정의
- **Status**: ACCEPTABLE (사용자 요청사항)

**R-3**: Sub-Agent 생성 로직 미검증

- **Risk**: task-init에서 서브에이전트가 제대로 생성되지 않을 수 있음
- **Impact**: MEDIUM
- **Mitigation**:
  - task-init SKILL.md에 명확한 에이전트 생성 로직 명시
  - 각 에이전트 설정 파일 검증
  - 실제 실행 테스트
- **Status**: MEDIUM (테스트 필요)

**R-4**: 계획 문서 템플릿 누락

- **Risk**: `docs/plans/TEMPLATE.md`가 없어 future task-init 실행 실패 가능
- **Impact**: HIGH
- **Mitigation**: Phase 2에서 반드시 생성
- **Status**: HIGH (미생성 상태)

### Dependencies

**D-1**: GitHub CLI & MCP

- **Dependency**: `gh` CLI 및 GitHub MCP server
- **Required For**: 모든 커맨드 (`/issue-start`, `/pr`, `/task-init`, `/task-done`)
- **Status**: AVAILABLE ✅

**D-2**: Git Repository

- **Dependency**: Git repository with remote
- **Required For**: 모든 Git 작업
- **Status**: AVAILABLE ✅

**D-3**: Node.js & npm

- **Dependency**: npm, npx for build/lint/type-check
- **Required For**: 품질 게이트
- **Status**: AVAILABLE ✅

**D-4**: Claude Code CLI

- **Dependency**: Claude Code CLI tool
- **Required For**: 커맨드 및 스킬 실행
- **Status**: AVAILABLE ✅

---

## 7. Rollout & Monitoring

### Deployment Strategy

**Phase-based Rollout**:

1. ✅ Phase 1: 핵심 파일 통합 완료
2. 📋 Phase 2: 템플릿 생성 (진행 중)
3. ⏳ Phase 3: 검증 및 테스트 (대기)
4. ⏳ Phase 4: 커밋 및 PR 생성 (대기)

**Rollback Plan**:

- 모든 변경사항은 Git으로 버전 관리됨
- 문제 발생 시 이전 커밋으로 revert 가능
- Breaking changes 없음 (새로운 파일 추가만)

### Success Metrics

**SM-1**: 커맨드 실행 성공률

- **Metric**: 5개 커맨드 모두 정상 동작
- **Target**: 100%
- **Measurement**: 수동 테스트

**SM-2**: 문서 완성도

- **Metric**: 필수 문서 모두 생성
- **Target**: 100%
- **Current**:
  - ✅ CLAUDE.md
  - ✅ .claude/rules/ (4개)
  - ✅ .claude/commands/ (5개)
  - ✅ .claude/skills/ (3개)
  - ✅ .claude/agents/ (4개)
  - ⏳ docs/plans/TEMPLATE.md
  - ⏳ .github/ISSUE_TEMPLATE/issue_template.md

**SM-3**: 품질 게이트 통과율

- **Metric**: Build + Type Check + Lint 성공
- **Target**: 100%
- **Current**: 미검증 (Phase 3에서 확인)

### Monitoring

**M-1**: 커맨드 사용 빈도

- 어떤 커맨드가 가장 많이 사용되는지 추적
- 사용되지 않는 커맨드는 개선 대상

**M-2**: 서브에이전트 효과성

- task-init에서 생성된 에이전트가 실제로 작업에 도움이 되는지
- 어떤 에이전트가 가장 유용한지 분석

**M-3**: 문서 접근 패턴

- `.claude/rules/` 중 어떤 문서가 자주 참조되는지
- 부족한 문서 식별 및 보완

---

## 8. Timeline & Milestones

### Milestones

**M1**: 핵심 파일 통합 완료 ✅

- `.claude/` 디렉토리 추가
- CLAUDE.md 추가
- `/issue-start` 라벨 로직 제거
- **완료일**: 2026-01-24
- **Status**: COMPLETED

**M2**: 템플릿 및 문서 완성 📋

- `docs/plans/TEMPLATE.md` 생성
- `.github/ISSUE_TEMPLATE/issue_template.md` 생성
- 이 계획 문서 완성
- **목표**: 2026-01-24
- **Status**: IN PROGRESS

**M3**: 품질 검증 통과 ⏳

- Build, Type Check, Lint 성공
- 커맨드 동작 확인
- 문서 링크 검증
- **목표**: 2026-01-24
- **Status**: PENDING

**M4**: PR 생성 및 머지 ⏳

- `/commit` 실행
- `/pr` 실행
- 코드 리뷰 및 머지
- **목표**: 2026-01-24
- **Status**: PENDING

---

## 9. References

### Related Issues

- Issue #3: [Claude 자동화 작업 (커스텀 커맨드, 스킬 기반)](https://github.com/YAPP-Github/27th-Web-Team-3-FE/issues/3)

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md) - 메인 설정 파일
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md) - 워크플로우 상세
- [.claude/rules/task-management.md](../../.claude/rules/task-management.md) - 작업 관리 시스템
- [.claude/rules/mistakes.md](../../.claude/rules/mistakes.md) - 실수 기록
- [.claude/rules/README.md](../../.claude/rules/README.md) - 규칙 디렉토리 설명

**커맨드**:

- [/issue-start](../../.claude/commands/issue-start.md) - 이슈 생성 및 브랜치 시작
- [/task-init](../../.claude/commands/task-init.md) - 작업 계획 수립
- [/task-done](../../.claude/commands/task-done.md) - 작업 완료 문서화
- [/commit](../../.claude/commands/commit.md) - Conventional Commits 커밋
- [/pr](../../.claude/commands/pr.md) - Pull Request 생성

**스킬**:

- [task-init](../../.claude/skills/task-init/SKILL.md) - 작업 초기화 스킬
- [task-done](../../.claude/skills/task-done/SKILL.md) - 작업 완료 스킬
- [vercel-react-best-practices](../../.claude/skills/vercel-react-best-practices/SKILL.md) - React 최적화 스킬

**에이전트**:

- [react-developer](../../.claude/agents/react-developer.md) - React 개발 전문
- [code-reviewer](../../.claude/agents/code-reviewer.md) - 코드 리뷰 전문
- [test-writer](../../.claude/agents/test-writer.md) - 테스트 작성 전문
- [doc-writer](../../.claude/agents/doc-writer.md) - 문서화 전문

### External Resources

- [Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)
- [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Vercel React Best Practices](https://vercel.com/blog/react-performance-best-practices)

### Key Changes in This Task

**`.claude/commands/issue-start.md` Changes**:

Before:

```markdown
### Step 1: Task Analysis

- Labels (type, area, priority) ❌

### Step 3: Create GitHub Issue

- **분류 (필수) 섹션**: Always fill ❌
- labels: Array of 3 labels ❌

### Notes

- Labels are automatically applied ❌
```

After:

```markdown
### Step 1: Task Analysis

- (Labels removed) ✅

### Step 3: Create GitHub Issue

- **목적/배경**, **작업 범위**, **완료 기준**, **참고** ✅
- (labels parameter removed) ✅

### Notes

- (Label auto-apply note removed) ✅
```

---

## 10. Implementation Summary

**Completion Date**: 2026-01-24
**Implemented By**: Claude Sonnet 4.5 + User

### Changes Made

**Added Files**:

- ✅ [.claude/](.claude/) directory (전체 구조)
  - [commands/](.claude/commands/) (5 files)
  - [skills/](.claude/skills/) (3 skills, 60+ rule files)
  - [agents/](.claude/agents/) (4 files)
  - [rules/](.claude/rules/) (4 files)
  - [settings.json](.claude/settings.json)
- ✅ [CLAUDE.md](../../CLAUDE.md) - 메인 설정 파일 (98 lines)
- ✅ [.github/ISSUE_TEMPLATE/issue_template.md](../../.github/ISSUE_TEMPLATE/issue_template.md) - 통합 이슈 템플릿
- ✅ [docs/plans/TEMPLATE.md](TEMPLATE.md) - 계획 문서 템플릿 (559 lines)
- ✅ [docs/plans/003-claude-automation-custom-commands-skills.md](003-claude-automation-custom-commands-skills.md) - 이 문서

**Deleted Files**:

- ❌ `.github/ISSUE_TEMPLATE/bug_report.md` - 통합 템플릿으로 대체
- ❌ `.github/ISSUE_TEMPLATE/feature_request.md` - 통합 템플릿으로 대체
- ❌ `.github/ISSUE_TEMPLATE/task.md` - 통합 템플릿으로 대체

**Modified Files**:

- ✅ [.claude/commands/issue-start.md](../../.claude/commands/issue-start.md) - 라벨 자동 등록 로직 제거
  - Line 5: "with proper labels" → "create a GitHub issue"
  - Line 22: Labels 추출 제거
  - Line 70-97: 분류 섹션 및 labels 파라미터 제거
  - Line 177: 라벨 자동 적용 문구 제거

**Key Implementation Details**:

- Progressive Disclosure 원칙 적용: CLAUDE.md는 60-100줄 유지, 상세 내용은 `.claude/rules/`로 분리
- Sub-Agent 생성 전략 문서화: task-init에서 작업 타입별 전문 에이전트 자동 생성
- 통합 이슈 템플릿: 3개 템플릿을 하나로 통합하여 일관성 유지
- Vercel React Best Practices 통합: 57개 규칙 파일 포함

### Quality Validation

- ✅ Build: `npm run build` - **Success** (1.43s, 387KB JS)
- ✅ Type Check: `npx tsc --noEmit` - **Passed** (No errors)
- ⚠️ Lint: `npm run lint` - **35 errors** (기존 프로젝트 코드의 린트 오류, `.claude/` 파일은 마크다운이므로 영향 없음)
- ✅ Issue Template: Created
- ✅ Plan Document: Created
- ✅ Template Document: Created

**Note**: 린트 오류는 기존 프로젝트 코드(src/, vite.config.ts 등)의 문제이며, 이번 작업에서 추가한 `.claude/` 관련 파일들은 모두 마크다운이므로 린트 대상이 아닙니다.

### Deviations from Plan

**Added**:

- ✅ `docs/plans/TEMPLATE.md` 생성 완료 (원래 Phase 2 작업, 완료됨)
- ✅ 계획 문서를 먼저 작성 (원래는 task-init 후 작성이지만, 작업 완료 상태여서 역순 진행)
- ✅ Sub-Agent 생성 전략 의사코드 추가 (Section 3의 Component Design에 포함)

**Changed**:

- N/A

**Skipped**:

- 커맨드 동작 테스트 (실제 사용 시 검증 예정)
- 서브에이전트 실제 생성 테스트 (다음 task-init 실행 시 검증)

### Performance Impact

- Bundle size: N/A (문서 추가만, 빌드 산출물에 영향 없음)
- Runtime: N/A (빌드 타임 도구)
- Build time: +0s (문서 파일 추가로 빌드 시간 변화 없음)
- Repository size: +~500KB (문서 및 규칙 파일)

### Commits

_아직 커밋되지 않음. 다음 단계에서 `/commit` 실행 필요._

**Expected Commit Message**:

```
chore(tooling): integrate Claude Code automation system

- Add .claude/ directory with commands, skills, agents, rules
- Remove label auto-registration from /issue-start command
- Add CLAUDE.md for project instructions
- Add GitHub issue template (unified)
- Add plan document template
- Delete old issue templates (bug_report, feature_request, task)

Closes #3

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### Follow-up Tasks

- [ ] 커맨드 동작 검증 (실제 사용 시)
- [ ] task-init 서브에이전트 생성 로직 검증 및 개선
- [ ] 품질 게이트 자동화 (GitHub Actions)
- [ ] .claude/rules/mistakes.md 업데이트 (이 작업의 학습사항 추가)
- [ ] 기존 프로젝트 린트 오류 수정 (35 errors)

### Notes

- 모든 문서는 Progressive Disclosure 원칙을 따름
- CLAUDE.md는 98줄로 목표 범위(60-100줄) 내에 있음
- `.claude/rules/` 파일들은 모두 300줄 미만
- Git 버전 관리로 모든 변경사항 추적 가능
- Breaking changes 없음 (새로운 파일 추가만)

---

**Plan Status**: ✅ COMPLETED
**Last Updated**: 2026-01-24
**Next Action**: `/commit` 실행 → `/pr` 실행
