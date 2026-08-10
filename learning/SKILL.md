---
name: learning
description: Turns useful user criticism of an agent's coding, architecture, naming, or workflow decisions into durable, appropriately scoped learnings. Use when the user criticizes a decision, explains a better approach, states how a codebase normally handles something, or provides a convention that could prevent future mistakes.
---

# Learning

Address the current problem first. Then offer to preserve any durable lesson without derailing the conversation.

## Workflow

### 1. Respond to the criticism

- Do not become defensive, over-apologize, flatter the user, or reflexively agree.
- Identify the concrete technical concern.
- Verify claims against the codebase or authoritative evidence when practical.
- If the criticism is correct, state what was wrong and address it.
- If it is partly wrong or risky, explain the evidence and resolve the disagreement.
- Do not use the learning discussion as a substitute for fixing the current issue.

### 2. Extract a candidate learning

Treat information as potentially durable when it provides:

- a better implementation or architectural approach;
- an established project convention, naming rule, or integration pattern;
- a recurring user preference;
- a guardrail that would prevent the same class of mistake.

Criticism without a proposed solution can still yield a narrow guardrail when the failure and prevention are clear.

Infer the principle behind the criticized implementation:

1. Separate the concrete symptom from the architectural, coding, or product constraint it violated.
2. Inspect the surrounding code and the user's wording for evidence of the intended abstraction level.
3. Formulate the broadest reusable rule directly supported by that evidence.
4. Check that the rule prevents the criticized design without banning unrelated valid designs.
5. Ask a brief clarifying question when different interpretations would produce materially different learnings.

Do not mechanically encode implementation details as the learning. For example:

- Criticized implementation: a manager stores a mode-to-strategy map.
- User feedback: “I don't want stateful managers.”
- Wrong learning: “Do not add mode-to-strategy map fields to managers.”
- Useful learning: “Managers must remain stateless.”

Do not preserve:

- insults, frustration, or judgments about the agent;
- one-off instructions with no likely reuse;
- guesses presented as facts;
- temporary workarounds;
- secrets or sensitive data.

Phrase the learning as a neutral, actionable instruction. Preserve the user's intent without preserving emotional wording.

### 3. Determine scope and available infrastructure

Before suggesting a destination:

1. Determine who owns the learning: the individual user, the project/team, or a specific agent/harness.
2. Check which agent or harness is active and which persistence features it actually supports.
3. Inspect existing project guidance before proposing new infrastructure, including relevant `AGENTS.md`, agent-specific instruction files, rules, memory, skills, and `.agents/` content.
4. Prefer the project's established convention. Do not create a parallel system unnecessarily.

Classify ownership before choosing storage:

| Ownership | Signals | Storage rule |
|-----------|---------|--------------|
| Personal preference | “I prefer…”, personal communication or workflow style, no evidence it is a team rule | Use native user memory or user-level agent configuration. Do not write it to a checked-in project file. |
| Project/team convention | “We always…”, “In this codebase…”, documented or repeated repository pattern | Use project guidance that is intended to be shared and checked in. |
| Project-local personal preference | Applies only when this user works in this project, but is not a team convention | Use supported local-only or untracked personal storage. Never silently alter ignore rules. |
| Agent/harness behavior | Applies only to one tool or agent implementation | Use that harness's personal configuration or memory unless the team explicitly shares it. |

- Do not convert a strongly worded personal preference into a team convention.
- Do not put personal preferences in `.agents/`, `AGENTS.md`, project rules, or other tracked files merely because the conversation happened inside a repository.
- If ownership is ambiguous, inspect the evidence and ask whether the learning is personal or team-wide before persisting it.

Never claim to have a native memory feature or to have stored a memory unless the current harness exposes that capability.

### 4. Choose the smallest useful persistence form

Use this order of preference:

| Form | Use when |
|------|----------|
| Native memory | A personal learning matches the scope of the harness's dedicated memory feature. Offer to use it. |
| Always-loaded instruction | The learning is short, stable, broadly applicable, and should influence nearly every relevant task. Use always-loaded guidance with matching personal or project ownership. |
| Learning entry | It is a concise project fact, team convention, or guardrail that should be easy to discover. |
| Reference | It is detailed, narrow, situational, or best loaded manually only when relevant. |
| Skill | It defines a repeatable conditional workflow with triggers, decisions, or validation steps. |

For personal learnings, prefer native memory or existing user-level agent configuration. Do not create project files as a fallback.

When no suitable project infrastructure exists for a project/team learning, offer these defaults:

```text
.agents/
├── learnings/
│   ├── LEARNINGS.md
│   └── references/
│       └── <topic>.md
└── skills/
    └── <skill-name>/
        └── SKILL.md
```

- Use `.agents/learnings/LEARNINGS.md` for concise learnings and as an index to references.
- Use `.agents/learnings/references/<topic>.md` for manually loaded detail.
- Use `.agents/skills/<skill-name>/SKILL.md` for conditional workflows.
- If the harness does not automatically discover these paths, propose the minimal link or instruction in its supported project guidance, such as `AGENTS.md`.

### 5. Ask before persisting

Make an educated recommendation, then ask for approval. Include:

- the exact learning in one or two sentences;
- the proposed ownership and scope;
- the proposed destination;
- whether the destination is checked in or personal-only;
- one short reason for choosing that form.

When there is one learning, propose it directly:

> Potential project learning: “Use the existing repository abstraction for persistence; do not introduce feature-local database clients.” I recommend adding this to `.agents/learnings/LEARNINGS.md` because it is a broad project guardrail, not a multi-step workflow. Should I persist it?

When there are multiple learnings:

- Present a numbered list with one independently selectable learning per item.
- Keep numbering stable throughout the conversation.
- Include scope and destination for each item.
- Explicitly invite a compact selection such as: “Keep 1 and 4; drop the rest.”
- Do not bundle unrelated learnings into one item.

Example:

> I found four potential learnings:
>
> 1. **Managers must remain stateless.** Project-wide → `.agents/learnings/LEARNINGS.md`
> 2. **Use the generated API client for backend calls.** Project-wide → `.agents/learnings/LEARNINGS.md`
> 3. **Follow the migration verification sequence.** Conditional workflow → `.agents/skills/database-migrations/SKILL.md`
> 4. **Prefer concise progress updates.** Personal preference → native user memory
>
> Items 1–3 would be checked in; item 4 would remain personal. Tell me which to keep, for example: “Keep 1 and 4; drop the rest.”

Keep the offer brief. If the user declines or ignores it, continue without pressure.

### 6. Persist an approved learning

- Re-check the destination for duplicates and conflicting guidance.
- When learnings were enumerated, persist only the explicitly selected items.
- Confirm that personal learnings are not written to checked-in project files.
- Verify project-specific claims where practical; ask if evidence conflicts with the correction.
- Make the smallest focused edit.
- Keep entries neutral, concrete, and reusable.
- Include rationale or an example only when needed to apply the instruction correctly.
- For a new skill, follow the active agent's skill format and ensure its discovery path is configured.
- Report the written location and do not claim future recall beyond the mechanism actually used.

## Decision Examples

- “We always use generated API clients here.” → concise project learning.
- “For migrations, perform these five checks in this order.” → project skill.
- “This legacy endpoint has unusual retry semantics.” → reference, indexed from `LEARNINGS.md`.
- “I prefer concise answers in every project.” → native user memory, when supported.
- “I prefer concise answers only in this repository.” → supported project-local personal storage, not a checked-in rule.
