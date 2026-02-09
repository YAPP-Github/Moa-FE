---
name: task-done
description: Finalize task completion workflow - appends implementation summary to plan document, validates quality gates, and cleans up sub-agents created during task execution
disable-model-invocation: true
---

# Task Done

Comprehensive task completion workflow for documenting work and cleanup.

## When to Apply

Use `/task-done` when:

- Implementation is complete and ready for review
- All tests are passing
- Code quality checks are satisfied
- Ready to create a pull request
- Need to document what was actually done vs. planned

## What This Skill Does

1. **Locates Plan Document**: Finds the corresponding plan in `docs/plans/` for the current issue
2. **Generates Implementation Summary**: Creates a detailed summary of actual work completed
3. **Appends to Plan**: Adds summary section to plan document without modifying original plan
4. **Validates Quality Gates**: Checks build, tests, lint, and type checking
5. **Cleans Up Sub-Agents**: Removes any sub-agents that were created during task execution
6. **Prepares for PR**: Ensures everything is ready for pull request creation

## Workflow Steps

### 1. Find Plan Document

- Extract issue number from current branch name
- Locate plan file: `docs/plans/{issue_number}-*.md`
- Read existing plan content

### 2. Generate Implementation Summary

Automatically gathers:

- **Files Changed**: Uses `git diff --name-only` against base branch
- **Commits Made**: Lists all commits in current branch
- **Quality Metrics**:
  - Build status (`pnpm run build`)
  - Type check (`pnpm tsc --noEmit`)
  - Lint status (`pnpm run lint`)
  - Test results (if tests exist)
- **Performance Impact**: Notes if bundle size or performance changed
- **Deviations**: Documents any differences from original plan

### 3. Append Summary Section

Adds to plan document after `---` separator:

```markdown
---

## Implementation Summary

**Completion Date**: YYYY-MM-DD
**Implemented By**: Claude Sonnet 4.5

### Changes Made

#### Files Modified

- [path/to/file1.ts](path/to/file1.ts#L42-51) - Added dark mode state management
- [path/to/file2.tsx](path/to/file2.tsx#L12) - Updated theme toggle component
- [path/to/file3.css](path/to/file3.css) - Added dark mode styles

#### Key Implementation Details

- Used Zustand for theme state (as planned)
- Applied `rerender-memo` rule for ThemeToggle component
- Applied `bundle-dynamic-imports` for theme switcher

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed
- [x] Tests: 12/12 passing
- [x] Best Practices: Applied async-parallel, bundle-barrel-imports

### Deviations from Plan

**Added**:

- localStorage persistence for theme preference (not in original plan)

**Changed**:

- Used CSS variables instead of Tailwind dark: variant (better performance)

**Skipped**:

- Theme transition animation (can add in follow-up)

### Performance Impact

- Bundle size: +2.3KB (theme toggle component)
- No impact on initial page load (dynamic import)

### Follow-up Tasks

- [ ] Add theme transition animation (#26)
- [ ] Support system preference detection (#27)

### Notes

- All Vercel React best practices applied successfully
- No breaking changes introduced
- Ready for code review
```

### 4. Quality Gate Validation

Runs validation checks:

```bash
pnpm run build        # Must succeed
pnpm tsc --noEmit    # Must pass
pnpm run lint        # Must pass
```

If any fail, notifies user and does NOT mark task as done.

### 5. Sub-Agent Cleanup

**Dynamic Agent Cleanup Process:**

A. **Identify Task-Specific Agents:**

- Check `.claude/agents/` for agents created during task-init
- Match agents by issue number tag or timestamp
- Common agents to check:
  - `fsd-architect.md` (FSD tasks)
  - `asset-manager.md` (asset management tasks)
  - `react-developer.md` (React development tasks)
  - `code-reviewer.md` (code review tasks)
  - `test-writer.md` (testing tasks)
  - `doc-writer.md` (documentation tasks)

B. **Document Agent Contributions:**

```markdown
Sub-agents used in this task:

- fsd-architect: Enforced FSD layer rules, validated 12 import paths
- asset-manager: Renamed 8 assets, updated 2 index files
- react-developer: Created 3 components, applied 5 best practice rules
```

C. **Remove Agent Files:**

- Delete agent markdown files from `.claude/agents/`
- Only remove agents created specifically for this task
- Keep permanent agents (if any exist)
- Confirm deletion with file list

D. **Cleanup Verification:**

```bash
# List remaining agents
ls .claude/agents/

# Confirm task-specific agents are removed
```

### 6. Next Steps Guidance

Prompts user with:

```
Task completed and documented!

Next steps:
- Review implementation summary in docs/plans/{issue_number}-*.md
- Run `/commit` to create a commit
- Run `/pr` to create a pull request

Would you like me to proceed with creating a PR?
```

## Example Usage

```
User: /task-done

Claude:
1. Located plan: docs/plans/025-add-dark-mode-toggle.md

2. Generating implementation summary...
   - Files changed: 8 files modified
   - Commits: 5 commits in this branch
   - Running quality checks...
     ✓ Build: Success
     ✓ TypeScript: No errors
     ✓ Lint: Passed
     ✓ Tests: 12/12 passing

3. Appending summary to plan document...
   - Documented 8 file changes
   - Listed 3 deviations from original plan
   - Noted +2.3KB bundle impact
   - Added 2 follow-up tasks

4. Cleaning up sub-agents...
   - Removed: react-developer (completed 5 tasks)
   - Removed: code-reviewer (reviewed 8 files)
   - Removed: test-writer (created 4 test files)

Task completed and documented!

Next steps:
- Review: docs/plans/025-add-dark-mode-toggle.md
- Run `/commit` to create commit
- Run `/pr` to create pull request

Would you like me to proceed with creating a PR?
```

## Summary Section Structure

### Required Fields

- **Completion Date**: Timestamp of completion
- **Implemented By**: Agent or developer name
- **Files Modified**: All changed files with line references
- **Key Implementation Details**: Major decisions and patterns used
- **Quality Validation**: Build, test, lint results
- **Deviations from Plan**: What changed and why

### Optional Fields

- **Performance Impact**: Bundle size, runtime metrics
- **Follow-up Tasks**: Items for future work
- **Notes**: Additional context or learnings
- **Screenshots**: For UI changes
- **API Changes**: For backend modifications

## Integration with Other Skills

- Reads plan created by `/task-init`
- Prepares metadata for `/commit` command
- Sets up context for `/pr` command
- Documents work for team knowledge base

## Validation Rules

### Must Pass Before Completion

1. ✅ Build succeeds (`pnpm run build`)
2. ✅ No TypeScript errors (`pnpm tsc --noEmit`)
3. ✅ Lint passes (`pnpm run lint`)
4. ✅ Plan document exists and is readable
5. ✅ At least one file was modified

### Optional Validations

- Tests passing (if tests exist)
- No console warnings
- Bundle size within limits
- Performance benchmarks met

## Notes

- Original plan content is NEVER modified - summary is appended after `---`
- If quality gates fail, provides actionable error messages
- Summary uses markdown links for easy navigation
- Preserves full git history in summary
- Can be run multiple times (updates existing summary)
- Always asks for confirmation before PR creation
