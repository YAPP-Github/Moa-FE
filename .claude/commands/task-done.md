# Task Done Command

## Description

Finalize task completion workflow by validating quality gates, generating implementation summary, appending to plan document, cleaning up sub-agents, and providing next steps guidance.

## Usage

```
/task-done
```

## Prerequisites

- Must be on a branch created with `/issue-start` (format: `{type}/{issue_number}-{slug}`)
- Must have used `/task-init` to create a plan document
- Must have made code changes (at least one file modified)

## Workflow

### Step 1: Find Plan Document

1. **Extract Issue Number**:
   - Get current branch name: `git branch --show-current`
   - Parse branch format: `{type}/{issue_number}-{slug}`
   - Example: `feat/25-add-feature` → Issue #25

2. **Locate Plan File**:
   - Search in `docs/plans/` directory
   - Pattern: `{issue_number}-*.md` (e.g., `025-add-dark-mode-toggle.md`)
   - If not found, show error and suggest running `/task-init` first

### Step 2: Quality Gate Validation

Run all quality checks before allowing task completion:

**Required Checks** (all must pass):

1. **Build Validation**:

   ```bash
   npm run build
   ```

   - Must complete without errors
   - If fails: Show build errors, stop task completion

2. **Type Check**:

   ```bash
   npx tsc --noEmit
   ```

   - Must pass with no type errors
   - If fails: Show type errors, stop task completion

3. **Lint Check**:

   ```bash
   npm run lint
   ```

   - Must pass with no lint errors
   - If fails: Show lint errors, stop task completion

4. **File Changes**:

   ```bash
   git diff --name-only dev...HEAD
   ```

   - Must have at least one file changed
   - If no changes: Show warning, stop task completion

5. **Plan Document**:
   - Plan file must exist in `docs/plans/`
   - If not found: Show error, suggest running `/task-init`

**Quality Gate Results**:

- ✅ All checks pass → Continue to Step 3
- ❌ Any check fails → Stop, show specific errors, guide user to fix issues

### Step 3: Generate Implementation Summary

Automatically collect and analyze implementation details:

**A. Changed Files**:

```bash
git diff --name-only dev...HEAD
```

- List all files that were created, modified, or deleted
- Group by directory/area for better readability
- Note file-level changes (added, modified, deleted)

**B. Commit History**:

```bash
git log dev..HEAD --oneline
```

- List all commits made on the branch
- Include commit hashes and messages
- Show chronological order of work

**C. Diff Analysis**:

- Analyze what changed in each file
- Identify major changes (new features, refactors, fixes)
- Note affected components, functions, or modules
- Track additions/deletions line count

**D. Performance Impact** (if applicable):

- Check bundle size changes
- Note any performance-related changes
- Identify potential optimization opportunities

**E. Test Coverage** (if tests exist):

- List new test files created
- Note test coverage changes
- Identify untested areas

### Step 4: Create Implementation Summary

Generate comprehensive summary following this structure:

```markdown
---

## Implementation Summary

**Completion Date**: {YYYY-MM-DD}
**Implemented By**: Claude Sonnet 4.5

### Changes Made

**Created Files**:

- [{file}]({path}) - {description}

**Modified Files**:

- [{file}:{start}-{end}]({path}#L{start}-L{end}) - {description}

**Deleted Files**:

- {file} - {reason}

### Quality Validation

- [x] Build: Success
- [x] Type Check: Passed
- [x] Lint: Passed
- [x] Tests: {status}

### Deviations from Plan

**Added**:

- {description} - {reason for addition}

**Changed**:

- {description} - {reason for change from plan}

**Skipped**:

- {description} - {reason for skipping} - {follow-up issue number if created}

### Performance Impact

- Bundle size: +{X}KB / -{X}KB / No change
- Runtime impact: {description or "No significant impact"}
- Optimization notes: {any optimization applied}

### Testing

**Test Files**:

- {test file} - {coverage description}

**Manual Testing**:

- {steps performed}
- {results observed}

### Commits

\`\`\`
{hash} - {commit message}
{hash} - {commit message}
\`\`\`

### Follow-up Tasks

- [ ] #{issue_number} - {description}
- [ ] {description} (if no issue created yet)

### Notes

{Any additional notes, learnings, or important information}
```

### Step 5: Append Summary to Plan Document

1. **Read Current Plan**:
   - Load plan document from `docs/plans/{issue_number}-*.md`
   - Verify document structure

2. **Append Implementation Summary**:
   - Add generated summary to Section 10 (Implementation Summary)
   - Preserve all other sections
   - Ensure proper markdown formatting

3. **Save Updated Plan**:
   - Write updated content back to plan file
   - Verify file was saved successfully

### Step 6: Clean Up Sub-Agents

1. **Identify Created Agents**:
   - List agents created during `/task-init`:
     - react-developer
     - code-reviewer
     - test-writer
     - doc-writer

2. **Display Agent Summary**:

   ```
   🤖 Sub-agents used in this task:
   - react-developer: Implemented 3 components with Vercel best practices
   - code-reviewer: Reviewed 12 files, found 2 issues (fixed)
   - test-writer: Created 4 test files with 95% coverage
   ```

3. **Remove Agent References**:
   - Clean up agent tags
   - Remove temporary agent configurations

### Step 7: Provide Next Steps

Display completion message with guidance:

```
✅ Task completed and documented!

📋 Summary:
- {X} files changed
- {Y} commits made
- Quality gates: All passed
- Documentation: Updated

📄 Plan document updated:
   docs/plans/{issue_number}-{description}.md

🔄 Next steps:
1. Review the implementation summary above
2. Run `/commit` to create structured commit(s)
3. Run `/pr` to create pull request

Would you like me to proceed with creating a commit?
```

## Example

**Current Branch**: `feat/25-add-dark-mode-toggle`

**Input:**

```
/task-done
```

**Output:**

```
🔍 Validating quality gates...
   ✅ Build: Success
   ✅ Type Check: Passed (0 errors)
   ✅ Lint: Passed (0 warnings)
   ✅ File Changes: 8 files modified

📊 Analyzing implementation...
   - 8 files changed
   - 5 commits made
   - +245 / -89 lines

📝 Generating implementation summary...
   ✅ Summary created

📄 Updating plan document...
   ✅ docs/plans/025-add-dark-mode-toggle.md updated

🤖 Cleaning up sub-agents...
   - react-developer: 3 components implemented
   - code-reviewer: 8 files reviewed
   - test-writer: 4 tests created

✅ Task completed and documented!

📋 Summary:
- 8 files changed
- 5 commits made
- Quality gates: All passed
- Documentation: Updated

🔄 Next steps:
1. Review the implementation summary in docs/plans/025-add-dark-mode-toggle.md
2. Run `/commit` to create structured commit(s)
3. Run `/pr` to create pull request

Would you like me to proceed with creating a commit?
```

## Error Handling

### Quality Gate Failures

**Build Failure**:

```
❌ Build failed

Error: Type error in src/components/ThemeToggle.tsx
  Line 42: Property 'theme' does not exist on type 'Props'

Fix the build error and run /task-done again.
```

**Type Check Failure**:

```
❌ Type check failed

Found 3 type errors:
1. src/lib/theme.ts:15 - Type 'string' is not assignable to type 'Theme'
2. src/components/Header.tsx:23 - Property 'toggle' is missing
3. src/hooks/useTheme.ts:8 - Cannot find name 'ThemeContext'

Fix the type errors and run /task-done again.
```

**Lint Failure**:

```
❌ Lint check failed

Found 2 lint errors:
1. src/components/ThemeToggle.tsx:10 - 'React' is defined but never used
2. src/lib/theme.ts:25 - Unexpected console statement

Fix the lint errors and run /task-done again.
```

### Other Errors

**Plan Document Not Found**:

```
❌ Plan document not found

No plan document found for issue #25 in docs/plans/

Did you run /task-init to create a plan before starting implementation?
Run /task-init first to create a plan document.
```

**No File Changes**:

```
⚠️ No file changes detected

No files were modified on this branch.

Make some code changes before running /task-done.
```

**Not on Valid Branch**:

```
❌ Invalid branch format

Current branch: main

/task-done requires a branch created with /issue-start
Format: {type}/{issue_number}-{slug}

Run /issue-start first to create a proper branch.
```

## Notes

- Always validates all quality gates before allowing completion
- Implementation summary is auto-generated from git history
- Plan documents serve as project knowledge base
- Sub-agents are automatically cleaned up
- Must pass all quality checks to complete task

## Integration

- Depends on `/task-init` for plan document creation
- Works with `/commit` for next step (committing changes)
- Works with `/pr` for creating pull requests
- Plan document includes full implementation history
