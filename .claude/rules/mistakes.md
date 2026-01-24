# 실수 기록 및 규칙

> Claude가 실수할 때마다 이 파일에 규칙을 추가합니다.
> 같은 실수를 반복하지 않기 위한 학습 문서입니다.

---

## 규칙 추가 형식

```markdown
### YYYY-MM-DD: [카테고리] 규칙 제목

- **실수**: 무엇을 잘못했는지
- **원인**: 왜 그런 실수가 발생했는지
- **규칙**: 앞으로 지켜야 할 규칙
- **참조**: 관련 문서 또는 이슈 번호
```

---

## 실수 기록

### 2026-01-22: [Settings] Claude Code 설정 형식

- **실수**: settings.json에서 잘못된 hooks/permissions 형식 사용
- **원인**: 새로운 Claude Code 설정 형식을 숙지하지 못함
- **규칙**:
  - Hooks: `PostToolUse`, `Stop` 등 PascalCase 사용
  - Permissions: `Bash(command:*)` 형식, prefix matching은 `:*` 사용
  - 공식 문서 참조: https://docs.anthropic.com/claude-code/hooks
- **참조**: `.claude/settings.json`

---

### 2026-01-22: [Task Management] 작업 관리 시스템 추가

- **추가**: `/task-init`, `/task-done` 커스텀 skill 생성
- **목적**: 구조화된 작업 계획 및 문서화 워크플로우 구축
- **혜택**:
  - 체계적인 작업 계획 수립 (GitHub 이슈 분석, 코드베이스 탐색, 레퍼런스 조사)
  - Vercel React best practices를 적용하는 서브에이전트 자동 설정
  - 작업 완료 후 자동 문서화 및 품질 검증
  - 계획 대비 실제 구현 내용 추적
  - `docs/plans/` 디렉토리에 히스토리 관리
- **참조**:
  - `.claude/skills/task-init/`
  - `.claude/skills/task-done/`
  - `docs/plans/TEMPLATE.md`

---

### 2026-01-22: [Documentation] CLAUDE.md 구조 개선

- **개선**: CLAUDE.md를 WHY-WHAT-HOW 구조로 재구성
- **원인**: 기존 문서가 너무 길고 구조가 불명확함
- **규칙**:
  - CLAUDE.md는 300줄 미만 유지 (60줄이 이상적)
  - WHY (프로젝트 목적), WHAT (기술 스택), HOW (작업 방법) 구조
  - Progressive Disclosure: 자세한 내용은 `.claude/rules/`로 분리
  - Instruction 개수 제한 (150-200개 이하)
  - 코드 스타일 가이드는 린터로 처리 (CLAUDE.md에 포함하지 않음)
- **참조**:
  - [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)
  - [Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
  - `.claude/rules/` 디렉토리

---

## 향후 개선 사항

### 추가할 규칙

- [ ] 성능 최적화 실수 패턴
- [ ] 타입스크립트 일반적인 오류
- [ ] Next.js App Router 실수 사례
- [ ] Stripe 통합 주의사항

### 문서 구조 개선

- [ ] 카테고리별 분류 (Settings, Documentation, Code Quality, etc.)
- [ ] 검색 가능한 태그 시스템
- [ ] 자주 발생하는 실수 TOP 10

---

**마지막 업데이트**: 2026-01-22
