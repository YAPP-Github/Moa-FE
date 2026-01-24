# PR Command

## Description

Automatically create a Pull Request from the current branch, filling the PR template with issue context and changes.

## Usage

```
/pr [--draft]
```

## Options

- `--draft`: Create PR as draft

## Prerequisites

- Must be on a branch created with `/issue-start` (format: `{type}/{issue_number}-{slug}`)
- Must have commits on the branch (at least one commit ahead of base branch)
- Branch must be pushed to remote

## Workflow

### Step 1: Extract Issue and Branch Context

1. Get current branch name
2. Parse branch name to extract:
   - Type: `feat`, `fix`, `chore`, etc.
   - Issue number: From branch pattern `{type}/{issue_number}-{slug}`
3. Get base branch (default: `main` or `master`)
4. Fetch issue details using GitHub MCP `issue_read`:
   - owner: From git remote
   - repo: From git remote
   - issue_number: Extracted from branch
   - method: `get`

### Step 2: Analyze Changes

1. Get commits on branch: `git log {base_branch}..HEAD --oneline`
2. Get changed files: `git diff {base_branch}..HEAD --name-status`
3. Analyze changes to understand:
   - What files/components changed
   - Type of changes (features, fixes, refactors, etc.)

### Step 3: Generate PR Content

Use the `pr-writer` skill with:

- Issue number, title, description
- Changed files
- Branch name
- Commit messages

Fill the PR template from `.github/PULL_REQUEST_TEMPLATE.md`:

- 요약: Brief summary referencing issue
- 변경 사항: List of key changes
- 체크리스트: Pre-filled standard items

### Step 4: Generate PR Title

- **PR title must be in Korean**
- Format: `[#123] {Type}: {Korean title}`
- Use branch type to map `{Type}`:
  - `feat` → `Feature`
  - `fix` → `Bug`
  - `chore` → `Chore`
  - `refactor` → `Refactor`
  - `docs` → `Docs`
  - `test` → `Test`
- Use the issue title without the `[Type]` prefix for `{Korean title}`

### Step 5: Check if Branch is Pushed

1. Check if branch exists on remote: `git ls-remote --heads origin {branch_name}`
2. If not pushed, push branch: `git push -u origin {branch_name}`
3. If push fails, show error and stop

### Step 6: Create Pull Request

Use GitHub MCP `create_pull_request`:

- owner: From git remote
- repo: From git remote
- title: Generated PR title
- head: Current branch name
- base: Base branch (main/master)
- body: Filled PR template
- draft: true if `--draft` flag used

### Step 7: Report Results

Display:

- PR number and URL
- PR title
- Issue reference
- Draft status (if applicable)

## Example

**Input:**

```
/pr
```

**Current branch:** `feat/123-add-pricing-table`
**Base branch:** `main`

**Output:**

```
✅ Pull Request 생성 완료: #45
   https://github.com/Dawn-kim-official/business_plan_k/pull/45

제목: [#123] Feature: 가격 페이지 요금제 비교 테이블 추가
이슈 참조: Closes #123
```

## Error Handling

- If not on a valid branch format, show error
- If branch not pushed, attempt to push (may require user confirmation)
- If no commits on branch, show error
- If PR creation fails, show error details

## Notes

- PR title is written in Korean and references the issue
- Always references the related issue
- Template is automatically filled based on changes
- Can create as draft for review before requesting review
