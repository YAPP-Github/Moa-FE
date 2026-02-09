---
name: task-init
description: Initialize task planning workflow - analyzes GitHub issues, scans codebase, creates detailed plan documents in docs/plans, and sets up sub-agents for implementation with Vercel React best practices
argument-hint: '["description"] [image]'
disable-model-invocation: true
---

# Task Init

Comprehensive task initialization workflow for efficient development planning and execution.

## When to Apply

Use `/task-init` when:

- Starting work on a new GitHub issue
- Planning a new feature or enhancement
- Beginning a bug fix that requires investigation
- Implementing a refactoring task
- Any task that needs structured planning before execution

## Usage

```bash
/task-init                           # Analyze GitHub issue only
/task-init "additional context"      # Issue + text description
/task-init [attach image]            # Issue + image (design mockup, screenshot, etc.)
/task-init "context" [image]         # Issue + text + image
```

**Input Options**:

- **No arguments**: Analyzes only the GitHub issue
- **Text argument**: Additional context, requirements, or clarifications
- **Image attachment**: Design mockups, UI screenshots, diagrams, error screenshots, etc.
- **Both**: Combines text description with visual references

## What This Skill Does

1. **Analyzes GitHub Issue**: Retrieves and analyzes the current issue from GitHub to understand requirements
2. **Processes User Input**: Incorporates additional context (text and/or images) provided by the user
3. **Scans Codebase**: Explores directory structure and related files to understand context
4. **Performs Research**: Conducts web searches if needed for libraries, patterns, or best practices
5. **Creates Plan Document**: Generates a detailed plan in `docs/plans/{issue_number}-{slug}.md` using the template
6. **Sets Up Sub-Agents**: Creates specialized agents (react-developer, code-reviewer, test-writer, doc-writer) configured to use Vercel React best practices
7. **Awaits Approval**: Asks user for confirmation before starting implementation

## Workflow Steps

### 1. Context Gathering

**A. GitHub Issue Analysis**:

- Fetch current branch name to extract issue number
- Use `gh issue view` to retrieve issue details
- Parse requirements, acceptance criteria, and labels

**B. User Input Processing** (if provided):

- **Text Input**:
  - Parse additional requirements or context
  - Identify clarifications or constraints
  - Extract specific implementation preferences
- **Image Input**:
  - Analyze design mockups for UI requirements
  - Review screenshots for bug reproduction
  - Examine diagrams for architecture understanding
  - Interpret error messages or logs

**C. Combined Analysis**:

- Merge GitHub issue with user-provided context
- Resolve conflicts or ambiguities
- Prioritize explicit user instructions over issue description
- Flag any inconsistencies for user clarification

### 2. Codebase Exploration

- Use Task tool with Explore agent (thoroughness: medium) to:
  - Map directory structure
  - Identify related files and components
  - Understand existing patterns and architecture
  - Find similar implementations for reference

### 3. Research Phase

- Search for relevant documentation if using unfamiliar libraries
- Check for React/Next.js best practices related to the task
- Review Vercel React best practices rules applicable to the task

### 4. Plan Document Creation

- Use the TEMPLATE.md structure from `docs/plans/`
- Fill in all sections with specific, actionable details
- Include file paths, component names, and implementation strategies
- Reference applicable Vercel React best practices rules
- Save as `docs/plans/{issue_number}-{description}.md`

### 5. Sub-Agent Configuration

**Dynamic Agent Creation Process:**

Sub-agents are created dynamically in `.claude/agents/` based on task requirements:

**A. Determine Task Type:**

- **FSD Refactoring/Architecture**: Create `fsd-architect` agent
- **Asset Management**: Create `asset-manager` agent
- **React/Next.js Development**: Create `react-developer` agent
- **Code Review**: Create `code-reviewer` agent
- **Testing**: Create `test-writer` agent
- **Documentation**: Create `doc-writer` agent (when needed)

**B. Agent Configuration:**

For FSD-based tasks:

```markdown
# .claude/agents/fsd-architect.md

- Enforces FSD layer rules
- Validates single-direction dependencies
- Guides code placement decisions
- Reviews import paths for compliance
```

For asset management tasks:

```markdown
# .claude/agents/asset-manager.md

- Enforces naming conventions (ic*\*, img*\*)
- Auto-corrects misnamed assets
- Validates folder structure
- Updates index.ts exports
```

For React/Next.js development:

```markdown
# .claude/agents/react-developer.md

- vercel-react-best-practices skill enabled
- Specific focus areas based on task type:
  - async-\* rules for data fetching tasks
  - bundle-\* rules for performance tasks
  - rerender-\* rules for component refactoring
  - server-\* rules for API/server components
```

**C. Agent Lifecycle:**

- Created during task-init in `.claude/agents/`
- Tagged with issue number for tracking
- Cleaned up during task-done
- Referenced in plan document for transparency

### 6. User Approval

- Present plan summary with key decisions
- Show which sub-agents will be created
- Ask: "Plan created. Ready to start implementation?"

## Example Usage

### Example 1: Issue Only

```
User: /task-init

Claude:
1. Analyzing GitHub issue #25...
   - Type: Feature
   - Title: Add dark mode toggle
   - Labels: enhancement, ui, priority:high

2. Exploring codebase...
   - Found theme system in src/lib/theme.ts
   - Located settings page at src/app/settings/page.tsx
   - Identified 12 components that need theme support

3. Researching...
   - Checked Next.js 16 theming patterns
   - Reviewed Radix UI theme switching examples

4. Creating plan document...
   - Saved: docs/plans/025-add-dark-mode-toggle.md

5. Sub-agent configuration:
   - react-developer: Component implementation (with vercel-react-best-practices)
   - code-reviewer: Code quality review
   - test-writer: Component tests

Plan created. Ready to start implementation?
```

### Example 2: Issue + Text Context

```
User: /task-init "Toggle should be in the header, use system preference as default, store preference in localStorage"

Claude:
1. Analyzing context...
   - GitHub issue #25: Add dark mode toggle
   - User requirements:
     * Location: Header component
     * Default: System preference
     * Storage: localStorage

2. Exploring codebase...
   - Found Header at src/components/home/Header.tsx
   - Located theme detection in src/lib/theme.ts

3. Creating plan with user preferences...
   - Saved: docs/plans/025-add-dark-mode-toggle.md
   - Incorporated: header placement, system default, localStorage

Plan created with your specifications. Ready to start implementation?
```

### Example 3: Issue + Image (Design Mockup)

```
User: /task-init [attaches design-mockup.png]

Claude:
1. Analyzing context...
   - GitHub issue #25: Add dark mode toggle
   - Design mockup analyzed:
     * Toggle position: Top-right header
     * Icon style: Moon/Sun icons
     * Animation: Smooth fade transition
     * Colors: Matches design system

2. Exploring codebase...
   - Found design tokens in src/app/globals.css
   - Located icon library: Radix UI Icons

3. Creating plan based on design...
   - Saved: docs/plans/025-add-dark-mode-toggle.md
   - Design specs incorporated into requirements

Plan created matching your design. Ready to start implementation?
```

### Example 4: Issue + Text + Image

```
User: /task-init "Use the toggle from this mockup, but add keyboard shortcut (Cmd+Shift+D)" [attaches mockup.png]

Claude:
1. Analyzing combined context...
   - GitHub issue #25: Add dark mode toggle
   - Design mockup: Toggle UI specifications
   - Additional requirement: Keyboard shortcut (Cmd+Shift+D)

2. Exploring codebase...
   - Found keyboard handler in src/lib/shortcuts.ts
   - Located Header component structure

3. Creating comprehensive plan...
   - Saved: docs/plans/025-add-dark-mode-toggle.md
   - Included: UI from mockup + keyboard shortcut
   - Added: Keyboard shortcut to docs and UI hint

Plan created with mockup design and keyboard shortcut. Ready to start implementation?
```

## Plan Document Structure

The plan follows this template structure:

- **Overview**: Issue context, objectives, scope
- **Requirements**: Functional and technical requirements
- **Architecture**: Implementation approach and design decisions
- **Task Breakdown**: Specific tasks with file paths and effort estimates
- **Quality Gates**: Testing, validation, and acceptance criteria
- **Risks & Dependencies**: Potential blockers and mitigation strategies
- **Best Practices**: Applicable Vercel React rules to follow

## Integration with Other Skills

- Works seamlessly with `/commit` for structured commits
- Pairs with `/pr` for creating pull requests
- Plan document is referenced by `/task-done` for summary generation
- Sub-agents created here are cleaned up by `/task-done`

## Notes

- Always creates plan in `docs/plans/` directory
- Plan file naming: `{issue_number}-{kebab-case-description}.md`
- Sub-agents are tagged with issue number for easy cleanup
- Plans are versioned in git for historical reference
- Uses medium thoroughness for Explore agent by default (quick for simple tasks, very thorough for complex ones)
