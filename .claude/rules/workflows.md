# 워크플로우 가이드

> CLAUDE.md의 상세 워크플로우 설명

---

## 전체 워크플로우

### 1. 이슈 시작

```bash
/issue-start "Add dark mode toggle"
```

**동작**:

- GitHub 이슈 생성
- 브랜치 생성 (`{type}/{issue_number}-{slug}`)
- 브랜치 체크아웃

### 2. 작업 계획 수립

```bash
/task-init                           # 이슈만 분석
/task-init "추가 설명"               # 이슈 + 텍스트
/task-init [이미지 첨부]             # 이슈 + 이미지
```

**동작** (자세한 내용: `.claude/skills/task-init/SKILL.md`):

1. **컨텍스트 수집**:
   - GitHub 이슈 분석 (`gh issue view`)
   - 사용자 입력 처리 (텍스트/이미지)
   - 통합 분석 및 충돌 해결
2. 코드베이스 탐색 (Explore agent, thoroughness: medium)
3. 필요 시 웹 검색 (라이브러리, 패턴, best practices)
4. 계획 문서 작성 (`docs/plans/{issue_number}-{slug}.md`)
5. 서브에이전트 설정 (vercel-react-best-practices 자동 적용)
6. 사용자 승인 대기

**입력 옵션**:

- **텍스트**: "Header에 토글 추가, localStorage 저장"
- **이미지**: 디자인 목업, UI 스크린샷, 에러 화면
- **둘 다**: "이 디자인 사용 + 단축키 추가" [이미지]

**생성되는 것**:

- 계획 문서 (9개 섹션, 사용자 컨텍스트 반영)
- 서브에이전트: `react-developer`, `code-reviewer`, `test-writer`, `doc-writer`

### 3. 구현 진행

```bash
# 계획에 따라 코드 작성
# 서브에이전트가 Vercel React Best Practices 자동 적용
```

**자동 적용되는 규칙**:

- `async-parallel`, `bundle-barrel-imports` (CRITICAL)
- `server-cache-react`, `server-serialization` (HIGH)
- `rerender-memo`, `rerender-functional-setstate` (MEDIUM)

### 4. 작업 완료 및 문서화

```bash
/task-done
```

**동작** (자세한 내용: `.claude/skills/task-done/SKILL.md`):

1. 계획 문서 찾기 (`docs/plans/{issue_number}-*.md`)
2. 품질 게이트 검증:
   ```bash
   npm run build        # 필수
   npx tsc --noEmit    # 필수
   npm run lint        # 필수
   ```
3. 변경 사항 수집:
   - 변경된 파일 (`git diff --name-only`)
   - 커밋 히스토리
   - 성능 영향 분석
4. Implementation Summary 생성 및 추가
5. 서브에이전트 정리
6. PR 가이드 제공

**실패 시**:

- 품질 게이트 실패 시 작업 완료 불가
- 구체적인 에러 메시지 제공
- 수정 후 다시 `/task-done` 실행

### 5. 커밋

```bash
/commit
```

**동작**:

- Conventional Commits 형식
- `Closes #{issue_number}` 자동 추가

**형식**:

```
type(scope): subject

Detailed description if needed.

Closes #25
```

### 6. PR 생성

```bash
/pr
```

**동작**:

- PR 제목: 이슈 제목 기반
- PR 본문:
  - Summary (계획 문서 기반)
  - Test plan
  - 변경 파일 목록
- 베이스 브랜치: `dev` (자동)

---

## 팁 & 트릭

### 빠른 피드백 루프

```bash
# 구현 중 자주 실행
npm run build && npx tsc --noEmit && npm run lint
```

### 계획 문서 업데이트

계획 문서는 살아있는 문서입니다:

- 구현 중 새로운 발견 → 계획 문서의 "Deviations" 섹션에 메모
- `/task-done`이 자동으로 요약 생성

### 서브에이전트 활용

- `react-developer`: "이 컴포넌트를 최적화해줘"
- `code-reviewer`: "이 코드 리뷰해줘"
- `test-writer`: "이 함수에 대한 테스트 작성해줘"

### 품질 게이트 실패 시

1. 에러 메시지 확인
2. 문제 수정
3. 검증 재실행
4. 통과 후 `/task-done` 재시도

---

**마지막 업데이트**: 2026-01-22
