---
name: issue-start
description: Analyze a task description, create a GitHub issue, create a branch following conventions, and automatically checkout the branch locally.
argument-hint: "<task description>"
disable-model-invocation: true
---

# Issue Start Command

## Usage

```
/issue-start <task description>
```

## Workflow

### Step 1: Task Analysis

Analyze the user's task description and extract:

- Type (feat/fix/chore/docs/refactor/test)
- Title and description
- Branch slug
- Scope

### Step 2: Research and Codebase Exploration

Before creating the GitHub issue, perform research to enrich the issue with proper context:

**A. Directory and File Search**:

1. Use Glob tool to find relevant files based on task type:

   - For UI/component tasks: Search for related components (`**/*.tsx`, `**/*.ts` in `src/components`, `src/app`)
   - For API/backend tasks: Search for API routes, server actions (`**/api/**/*.ts`, `**/actions/**/*.ts`)
   - For styling tasks: Search for CSS/styling files (`**/*.css`, `**/globals.css`)
   - For configuration tasks: Search for config files (`*.config.*`, `.env*`, `package.json`)

2. Use Grep tool to search for keywords related to the task:
   - Search for function names, component names, or feature names mentioned in the task
   - Search for existing patterns or similar implementations

**B. Web Research** (if needed):

1. Search for relevant documentation or best practices if:

   - The task involves unfamiliar libraries or frameworks
   - The task requires implementation of complex patterns
   - The task mentions specific technologies or APIs

2. Use WebSearch or WebFetch to:
   - Find official documentation for libraries being used
   - Search for React/Next.js best practices related to the task

**C. Context Analysis**:

1. Combine findings from directory search, file search, and web research
2. Identify:
   - Existing files that will need modification
   - Similar implementations that can be referenced
   - Potential dependencies or affected areas
3. Use this enriched context to enhance the issue description

### Step 3: Create GitHub Issue

1. Read the issue template from `.github/ISSUE_TEMPLATE/issue_template.md`
2. Parse the template:
   - Extract YAML frontmatter (if present) - this contains default labels
   - Extract markdown body sections
3. Fill the template with analyzed information (only fill relevant sections):

   - **Title**: Use `[Type] {title}` format
     - Map type to `[Type]` prefix:
       - `feat` -> `[Feature]`
       - `fix` -> `[Bug]`
       - `chore` -> `[Chore]`
       - `refactor` -> `[Refactor]`
       - `docs` -> `[Docs]`
       - `test` -> `[Test]`
   - **재현 방법 (버그일 때)**: **Only include this section if type is `fix`**
   - **Important**: Do not force-fill sections. Omit empty sections.

4. Use GitHub MCP `issue_write` with method `create`:
   - owner: Extract from current git remote
   - repo: Extract from current git remote
   - title: Generated title with `[Type]` prefix
   - body: Filled template
   - assignees: Include the current user (use GitHub MCP `get_me` to fetch the login)

### Step 4: Create Branch Linked to Issue and Checkout

1. **Extract issue number** from the created issue
2. Generate branch name: `{type}/{issue_number}-{branchSlug}`
3. Get current default branch (usually `main` or `master`)
4. Create branch using GitHub MCP `create_branch`
5. **Fetch the branch from remote**: `git fetch origin {branch_name}`
6. **Checkout the branch locally**: `git checkout {branch_name}`

### Step 5: Report Results

Display to user:

- Issue number and URL
- Branch name created
- Confirmation of local checkout
- **Stop here**: Do not start implementation work unless the user explicitly requests it

## Example

**Input:**

```
/issue-start pricing page table
```

**Output:**

```
Issue: #123 https://github.com/.../issues/123
Branch: feat/123-add-pricing-table
Checkout: done
```

## Error Handling

- If issue creation fails, show error and stop
- If branch creation fails, show error but keep issue
- If local checkout fails, show warning but continue (user can manually checkout)

## Notes

- Always use the current repository's remote to determine owner/repo
- Branch naming follows: `{type}/{issue_number}-{kebab-case-slug}`
