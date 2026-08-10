---
description: Convert a plan, spec, product request, or thread context into reviewed vertical-slice Linear issues with broad, abstract requirements instead of predefined implementation details. Use when asked to break down work, create Linear issues from a plan, split a spec into tickets, or plan Linear team/project/label/milestone metadata.
name: create-issues-v2
---
# Create Issues

Turn implementation work into Linear issues that are tracer-bullet vertical slices: each issue should deliver observable behavior across the necessary layers, not a horizontal layer such as "database only" or "frontend only".

## Requirements, Not Implementations

Issues describe **what** should be observably true when the work is done and **why** — never **how** to build it. Implementation details (module structure, DTOs, domain types, file paths, code patterns, schemas) change during development, and predefined details drift out of sync across issues.

- State requirements as broad, abstract, behavior-focused outcomes plus constraints and exclusions.
- Do not prescribe modules, types, contracts, migrations, function signatures, or affected files in issue descriptions.
- The implementation shape is designed at development time: the assignee must explicitly invoke the `$sketch` skill before coding. Task prompts must say to read and follow the installed skill file (for example, `/Users/julian/.cursor/skills/sketch/SKILL.md`), rather than merely asking for a “sketch”. The skill’s module graph, DTOs, domain types, and test plan are the required deliverable; the assignee then waits for user approval. Issues may point assignees to that skill, but must not pre-produce its output.
- For Word Blitz client task prompts, make manual verification the default. Automated tests belong only to introduced or altered general-purpose utility logic; do not require component, integration, or end-to-end tests merely because the `sketch` template includes a Test Plan section. If no such utility logic exists, ask the assignee to state that no automated test files are planned and provide a concise manual verification checklist instead.
- When two issues need a shared interface, name the boundary abstractly ("exposes the created foo's identifier to clients") and designate the blocking issue as the source of truth. Never spell out the concrete contract in multiple issues.

## Process

1. Gather the durable context issue assignees will need: goal, motivation, constraints, existing plan, dependencies, exclusions, and verification expectations. Capture the problem and desired behavior — not how the current codebase would implement it.
2. Identify shared groundwork before drafting slices. Extract a groundwork issue only when it unlocks multiple slices or establishes a shared boundary, and describe it by the capability it provides, not by its technical design.
3. Draft issues before creating anything in Linear. Suggest a target team when inferable; otherwise ask. If Linear context is available, inspect matching teams, labels, projects, and milestones before the draft.
4. Ask whether the issues should belong to a Linear project. Suggest an existing project when one fits, or a new project name when the work is coherent but no project fits. If project-scoped and there are more than a few issues, suggest existing or new milestones.
5. Present a concise review plan and ask for feedback on scope, granularity, dependencies, delivery order/waves, groundwork coverage, final-description depth, `Async` grading, team, project, milestones, labels, and priorities.
6. Before creating issues, expand approved drafts into standalone Linear descriptions. Assignees should not need the original spec, plan, or thread to understand the problem, constraints, desired behavior, blockers, and verification.
7. Create Linear issues only after explicit user approval. Create blockers first, then dependents, so blocked-by relations can reference existing issue IDs.
8. Return created issue IDs and a compact dependency/project summary.

## Issue Rules

Each issue needs a short title, self-contained requirements-focused description, acceptance criteria, priority, optional `Async` label, optional Area/Game labels, optional project/milestone, and optional blocked-by relation.

### Titles

Use a concise, outcome-oriented title that distinguishes the issue from its siblings. Let the assigned team, project, milestone, and labels carry shared context such as game, product area, repository, or initiative. Do not repeat that context as a boilerplate prefix on every title (for example, avoid `WB Race Event:` when the issue already belongs to the Race Event project and has the `Word Blitz` label). Add a qualifier only when it is needed to disambiguate the issue on its own.

For a coordinated multi-issue implementation set, add an execution index in the form `NN · W# — Title` when a rough delivery order is useful. Number issues by their optimal implementation sequence and assign the same wave to issues that can proceed in parallel. Put shared groundwork in earlier waves and dependent integration or completion flows in later waves. Treat the index as useful execution metadata, not as permission to restore repeated project, game, or repository prefixes. Omit it for standalone issues or sets with no meaningful order.

Final Linear descriptions must stand alone. Review drafts can stay compact while scope is being approved, but created issues should include the relevant background, current and desired behavior, constraints, exclusions, dependencies, and verification guidance — all at the requirements level. Links are references, not substitutes for required context.

Prefer independent, parallelizable vertical slices that run from data/API/service behavior through the user-visible client or consumer when needed. Split by layer only when that layer is independently valuable, testable, and unlocks later slices.

Before finalizing, audit each slice's assumptions. Add blockers only when work cannot start meaningfully before another issue lands; otherwise mention the relationship as context. If a blocker establishes a shared boundary, describe that boundary abstractly in dependent issues and identify the blocker as source of truth for its eventual shape.

Treat blocked-by relations and wave ordering as an initial logical hypothesis, not a rigid contract. They capture the sequence that makes sense at planning time, but concrete code-level dependencies only fully emerge during development — especially when parallel agents work simultaneously. Assignees may need to re-order or re-stack as the implementation shape shifts, so keep the planned ordering coarse enough to survive that churn and never encode it as an immutable prerequisite chain.

### Delivery Waves

Group issues into waves that reflect a bottom-up build order:

- **Wave 1 — shared foundation.** Front-load the issues that create shared assets, string keys, components, and boundaries that many later slices depend on. Extract these only when they genuinely unlock multiple slices (per the groundwork rule above).
- **Later waves — feature slices, bottom-up.** Build the actual feature outcomes on top of the foundation, ordering from the most-depended-on behavior upward and running independent slices in parallel within the same wave.

This layering matters most for automated or multi-agent flows, where a first wave can establish shared groundwork before a second wave fans out feature work in parallel. Waves stay advisory: they express the intended sequence, not a hard gate, and development may reveal that some later work can start earlier or must re-stack.

Use `Async` when the issue is safe to delegate without close human oversight: behavior and acceptance criteria are clear, work follows known local patterns, verification is deterministic, and it does not require product judgment, visual taste calls, secrets, credentials, production access, ambiguous migrations, or high-risk external decisions.

Set priorities to reflect execution order and importance, optionally within each milestone: blockers and high-impact first slices are higher priority; follow-up polish and isolated hardening are lower unless risk justifies otherwise.

## Review Format

```markdown
Proposed issues:
Team: suggested team or needs confirmation
Project: none / existing / new suggestion
Milestones: none / existing or new suggestions

1. NN · W# — Title
   Async: yes/no
   Priority: P0/P1/P2/P3 or team scale
   Labels: Area..., Game... if existing labels fit
   Project/Milestone: if applicable
   Blocked by: none or title(s)
   Context: goal, current behavior, motivation, and constraints
   Scope: one-sentence vertical slice of observable behavior
   Notes: dependencies, exclusions, and abstractly named shared boundaries
   Acceptance: observable completion criteria and verification path

Dependency order:
- Blocking issue -> blocked issue

Please confirm team, project/milestones, scope, granularity, delivery order/waves, final-description depth, labels, priorities, and Async grading.
```

## Linear Creation

Use the connected Linear integration after approval. If unavailable, discover or load it first, or ask the user to enable it.

Create issues in dependency order. Apply the confirmed team, project, milestone, priority, `Async` label, and fitting Area/Game labels. Use existing labels/projects/milestones when selected; create new projects/milestones only when explicitly approved and supported by the integration. Add blocked-by relations with created issue IDs; if the tools cannot create relations, include blocker IDs in the dependent issue description and report the limitation.

If user feedback materially changes scope, dependencies, Linear metadata, or `Async` grading, revise the draft and ask for confirmation again before creating issues.
