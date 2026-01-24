# Task Plan: [Task Title]

**Issue**: #{issue_number}
**Type**: [Feature | Bug | Enhancement | Refactor | Chore | Docs]
**Created**: YYYY-MM-DD
**Status**: [Planning | In Progress | Completed]

---

## 1. Overview

### Problem Statement

[2-3 문장으로 해결하려는 문제를 명확히 설명합니다]

- 현재 상황과 문제점
- 왜 이 작업이 필요한지
- 해결하지 않으면 발생할 영향

### Objectives

[구체적이고 측정 가능한 목표를 나열합니다]

1. [목표 1]
2. [목표 2]
3. [목표 3]

### Scope

**In Scope**:

- [포함되는 작업 1]
- [포함되는 작업 2]
- [포함되는 작업 3]

**Out of Scope**:

- [제외되는 작업 1]
- [제외되는 작업 2]

### User Context

[사용자 요청사항 또는 추가 컨텍스트가 있다면 기록]

> "사용자 요청 인용"

**핵심 요구사항**:

1. [요구사항 1]
2. [요구사항 2]

---

## 2. Requirements

### Functional Requirements

**FR-1**: [기능 요구사항 제목]

- [구체적인 기능 설명]
- [입력과 출력]
- [예상 동작]

**FR-2**: [기능 요구사항 제목]

- [구체적인 기능 설명]

### Technical Requirements

**TR-1**: [기술 요구사항 제목]

- [기술 스택 또는 라이브러리]
- [성능 요구사항]
- [호환성 요구사항]

**TR-2**: [기술 요구사항 제목]

- [구체적인 기술 제약사항]

### Non-Functional Requirements

**NFR-1**: [비기능 요구사항 제목]

- [사용성, 접근성, 보안 등]
- [유지보수성, 확장성]

**NFR-2**: [비기능 요구사항 제목]

- [구체적인 품질 속성]

---

## 3. Architecture & Design

### Directory Structure

```
project/
├── src/
│   ├── app/
│   │   └── [변경/추가될 페이지 또는 라우트]
│   ├── components/
│   │   └── [변경/추가될 컴포넌트]
│   └── lib/
│       └── [유틸리티, 타입, 설정]
└── docs/
    └── plans/
        └── {issue_number}-{description}.md  # 이 문서
```

### Design Decisions

**Decision 1**: [설계 결정 제목]

- **Rationale**: 왜 이 결정을 내렸는지
- **Approach**: 어떻게 구현할 것인지
- **Trade-offs**: 장단점 분석
- **Alternatives Considered**: 고려했던 다른 방법
- **Impact**: 시스템에 미치는 영향 (HIGH/MEDIUM/LOW)

**Decision 2**: [설계 결정 제목]

- **Rationale**: [이유]
- **Implementation**: [구현 방법]
- **Benefit**: [이점]

### Component Design

[주요 컴포넌트 또는 모듈의 구조와 상호작용을 설명]

**컴포넌트 A**:

```typescript
// 주요 인터페이스 또는 타입
interface ComponentAProps {
  // ...
}

// 핵심 로직 의사코드
function ComponentA(props: ComponentAProps) {
  // ...
}
```

**플로우 다이어그램** (선택사항):

```
User Action
    ↓
Component A
    ↓
API Call / State Update
    ↓
Component B (Re-render)
    ↓
UI Update
```

### Data Models

[필요한 데이터 구조, 타입, 인터페이스 정의]

```typescript
// Example
interface User {
  id: string;
  name: string;
  email: string;
}

type TaskStatus = "pending" | "in_progress" | "completed";
```

### API Design

[API 엔드포인트 설계, 요청/응답 형식]

**Endpoint**: `POST /api/tasks`

**Request**:

```json
{
  "title": "Task title",
  "description": "Task description"
}
```

**Response**:

```json
{
  "id": "task-123",
  "status": "created"
}
```

---

## 4. Implementation Plan

### Phase 1: Setup & Foundation

**Tasks**:

1. [기반 설정 작업 1]
2. [기반 설정 작업 2]

**Files to Create/Modify**:

- `src/components/NewComponent.tsx` (CREATE)
- `src/lib/utils.ts` (MODIFY)

**Estimated Effort**: [Small/Medium/Large]

### Phase 2: Core Implementation

**Tasks**:

1. [핵심 기능 구현 1]
2. [핵심 기능 구현 2]

**Files to Create/Modify**:

- `src/app/page.tsx` (MODIFY)

**Dependencies**: Phase 1 완료 필요

### Phase 3: Polish & Optimization

**Tasks**:

1. [최적화 작업 1]
2. [테스트 추가]
3. [문서화]

**Files to Create/Modify**:

- `README.md` (UPDATE)

### Vercel React Best Practices

[이 작업에 적용할 Vercel React Best Practices 규칙]

**CRITICAL**:

- `async-parallel`: 병렬 데이터 페칭
- `bundle-barrel-imports`: 배럴 임포트 최적화

**HIGH**:

- `server-cache-react`: React 캐시 API 사용

**MEDIUM**:

- `rerender-memo`: 불필요한 리렌더링 방지

---

## 5. Quality Gates

### Testing Strategy

**TS-1**: [테스트 전략 1]

- 테스트 타입: [Unit/Integration/E2E]
- 커버리지 목표: [예: 80% 이상]
- 테스트 케이스:
  - [케이스 1]
  - [케이스 2]

**TS-2**: [테스트 전략 2]

```typescript
// 예시 테스트 코드
describe("ComponentA", () => {
  it("should render correctly", () => {
    // ...
  });
});
```

**TS-3**: 빌드 및 타입 체크

```bash
npm run build        # 빌드 성공 필수
npx tsc --noEmit    # 타입 오류 없음
npm run lint        # 린트 통과
```

### Acceptance Criteria

[GitHub 이슈의 완료 기준을 체크리스트로 변환]

- [ ] [기준 1]
- [ ] [기준 2]
- [ ] [기준 3]
- [ ] Build 성공
- [ ] Type check 성공
- [ ] Lint 통과

### Validation Checklist

**기능 동작**:

- [ ] [검증 항목 1]
- [ ] [검증 항목 2]

**코드 품질**:

- [ ] TypeScript 에러 없음
- [ ] 린트 경고 없음
- [ ] 불필요한 console.log 제거
- [ ] 주석 추가 (복잡한 로직)

**성능**:

- [ ] 번들 크기 증가 확인 (허용 범위 내)
- [ ] 불필요한 리렌더링 없음
- [ ] 이미지 최적화 (next/image 사용)

**접근성**:

- [ ] 키보드 네비게이션 동작
- [ ] ARIA 레이블 추가
- [ ] 색상 대비 충분

---

## 6. Risks & Dependencies

### Risks

**R-1**: [리스크 제목]

- **Risk**: [리스크 설명]
- **Impact**: [HIGH/MEDIUM/LOW]
- **Probability**: [HIGH/MEDIUM/LOW]
- **Mitigation**: [완화 전략]
- **Status**: [리스크 현황]

**R-2**: [리스크 제목]

- **Risk**: [리스크 설명]
- **Mitigation**: [완화 전략]

### Dependencies

**D-1**: [의존성 제목]

- **Dependency**: [의존하는 시스템, 라이브러리, 또는 작업]
- **Required For**: [어떤 작업에 필요한지]
- **Status**: [AVAILABLE/BLOCKED/IN_PROGRESS]
- **Owner**: [담당자]

**D-2**: [의존성 제목]

- **Dependency**: [의존성 설명]
- **Status**: [상태]

---

## 7. Rollout & Monitoring

### Deployment Strategy

[배포 전략 설명]

**Phase-based Rollout**:

1. Phase 1: [단계 1 설명]
2. Phase 2: [단계 2 설명]
3. Phase 3: [단계 3 설명]

**Rollback Plan**:

- [롤백 조건]
- [롤백 절차]
- [데이터 복구 방법]

**Feature Flags** (선택사항):

- `feature_new_ui`: 새로운 UI 표시 여부

### Success Metrics

**SM-1**: [성공 지표 1]

- **Metric**: [측정 항목]
- **Target**: [목표 값]
- **Measurement**: [측정 방법]

**SM-2**: [성공 지표 2]

- **Metric**: [측정 항목]
- **Target**: [목표 값]

### Monitoring

**M-1**: [모니터링 항목 1]

- [무엇을 모니터링할지]
- [어떻게 측정할지]

**M-2**: [모니터링 항목 2]

- [모니터링 방법]

---

## 8. Timeline & Milestones

### Milestones

**M1**: [마일스톤 제목]

- [마일스톤 설명]
- [완료 기준]
- **목표**: YYYY-MM-DD
- **Status**: [NOT_STARTED/IN_PROGRESS/COMPLETED]

**M2**: [마일스톤 제목]

- [마일스톤 설명]
- **목표**: YYYY-MM-DD
- **Status**: [상태]

### Estimated Timeline

- **Setup**: 1-2 hours
- **Core Implementation**: 4-6 hours
- **Testing & Polish**: 2-3 hours
- **Total**: 7-11 hours

---

## 9. References

### Related Issues

- Issue #{issue_number}: [이슈 제목](https://github.com/org/repo/issues/{issue_number})
- Related Issue #{related}: [관련 이슈]

### Documentation

**프로젝트 문서**:

- [CLAUDE.md](../../CLAUDE.md)
- [.claude/rules/workflows.md](../../.claude/rules/workflows.md)
- [.claude/rules/task-management.md](../../.claude/rules/task-management.md)

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

**에이전트**:

- [react-developer](../../.claude/agents/react-developer.md)
- [code-reviewer](../../.claude/agents/code-reviewer.md)
- [test-writer](../../.claude/agents/test-writer.md)
- [doc-writer](../../.claude/agents/doc-writer.md)

### External Resources

[외부 참조 자료]

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Vercel React Best Practices](https://vercel.com/blog/react-performance-best-practices)
- [라이브러리 이름 Documentation](https://example.com)

### Key Learnings

[작업 중 배운 중요한 내용]

- [학습 1]
- [학습 2]

---

## 10. Implementation Summary

> **Note**: 이 섹션은 작업 완료 후 `/task-done` 커맨드가 자동으로 채웁니다.
> 작업 중에는 비워두고, 완료 후 자동 생성됩니다.

**Completion Date**: YYYY-MM-DD
**Implemented By**: Claude Sonnet 4.5

### Changes Made

[변경된 파일 목록과 주요 변경 사항]

**Added Files**:

- `[file-path.ts](path/to/file.ts)` - [변경 내용]

**Modified Files**:

- `[file-path.ts](path/to/file.ts#L42-51)` - [변경 내용]

**Deleted Files**:

- `[file-path.ts]` - [삭제 이유]

### Quality Validation

- [ ] Build: `npm run build`
- [ ] Type Check: `npx tsc --noEmit`
- [ ] Lint: `npm run lint`
- [ ] Manual Testing: [테스트 항목]

### Deviations from Plan

**Added**:

- [계획에 없었지만 추가된 작업]

**Changed**:

- [계획과 다르게 접근한 부분]

**Skipped**:

- [미뤄진 작업 (follow-up 이슈 생성)]

### Performance Impact

- Bundle size: [증가/감소량]
- Runtime: [성능 영향]
- Build time: [빌드 시간 영향]

### Commits

```
abc1234 - feat: Add new feature
def5678 - test: Add tests for new feature
ghi9012 - docs: Update README
```

### Follow-up Tasks

- [ ] #{issue_number} - [후속 작업 설명]
- [ ] #{issue_number} - [후속 작업 설명]

---

**Plan Status**: [Planning | In Progress | Completed]
**Last Updated**: YYYY-MM-DD
**Next Action**: [다음 단계]
