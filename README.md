# skills

Portable [Agent Skills](https://agentskills.io) — reusable workflow and behavior packs for AI coding agents (Claude Code, Codex, Copilot, Cursor, Gemini CLI, and other hosts that follow the open Agent Skills spec).

Each skill is a self-contained directory with a `SKILL.md` (spec frontmatter + instructions). Manual-only skills additionally carry `agents/openai.yaml` so Codex treats them as opt-in too.

## Install

Requires GitHub CLI ≥ v2.90.0 (`gh skill` is a public preview).

```bash
# Install one skill (interactive host + scope prompts)
gh skill install fettstorch/skills tdd

# Install everything
gh skill install fettstorch/skills --all

# Pin to a tag or commit for reproducibility
gh skill install fettstorch/skills tdd --pin v1.0.0
```

Use `--agent` and `--scope` to control placement, or `--from-local ./skills` to install from a clone.

## Skills

**Trigger** — `auto`: the agent may invoke it on its own when the description matches; `manual`: only runs when you explicitly ask for it (`disable-model-invocation` + Codex `allow_implicit_invocation: false`).

| Skill | Trigger | What it does |
|-------|---------|--------------|
| `autonomous` | manual | Maximizes agent autonomy — overrides "ask for permission" gates, escalating only for genuinely non-trivial decisions. |
| `commit` | auto | Groups all uncommitted changes into semantic groups and writes one focused commit per group. |
| `create-issues` | auto | Turns a plan or spec into reviewed vertical-slice Linear issues with abstract requirements. |
| `for-each` | manual | Applies one command, skill, or strategy to every item in a list without pausing between items. |
| `handoff` | auto | Compacts the conversation into a handoff doc so a fresh session can continue the work. |
| `interview-me` | auto | Interviews you about a plan/design, one high-impact question at a time, until shared understanding. |
| `just-asking` | manual | Signals a question (not a change request) so the agent defends its solution instead of blindly pivoting. |
| `learning` | manual | Turns useful user criticism into durable, appropriately scoped learnings. |
| `links` | auto | Verifies that any URL is real before emitting it as a source. |
| `operator` † | manual | Spawns and routes interactive tasks/chats, supplying context and instructions. |
| `prio-learning` | manual | Teaching-first mode — breaks work into learning steps, explains each, waits for approval. |
| `pr-linear-title` | auto | Prefixes PR titles with the Linear issue identifier so Linear auto-links the PR. |
| `pr-work` | auto | Works unresolved GitHub PR review threads/comments; verifies reviewer claims before acting. |
| `simple` | manual | Maximally concise, high-density answers — bullets, tables, diagrams over prose. |
| `sketch` | manual | Sketches the implementation "shell" (module graph, DTOs, domain types, test names) before coding. |
| `tdd` | manual | Enforces the stub → red → green TDD loop with real test runs at each checkpoint. |

† **`operator` is compatibility-gated.** It requires a harness that can spawn and address independent *interactive* tasks/chats (currently the Codex app). On hosts that expose only non-interactive subagents — Claude Code, Cursor, and similar — it self-reports as unsupported and stops instead of emulating with subagents.

## Authoring notes

- Skill `name` must match its directory and follow the spec: lowercase `[a-z0-9-]`, ≤64 chars, no leading/trailing/double hyphen.
- `description` (≤1024 chars) must state **what** the skill does and **when** to use it — this is what agents match against.
- Keep `SKILL.md` bodies focused; move long reference material into `references/` and load on demand.
- Validate with the reference tool: `skills-ref validate ./<skill>`.
