---
name: setup-gitbutler
description: Make an existing project compatible with a shared GitButler workspace by adapting its guidance, local skill access, and existing workflows. Invoke manually for repository GitButler setup.
disable-model-invocation: true
---

# Set Up GitButler

Make the existing project GitButler compatible. Preserve its workflows, supported harnesses, and approval boundaries. Include lightweight lane-assignment reminder hooks; keep project verification policy unchanged.

Create lightweight hooks that remind agents to inspect remaining uncommitted changes and assign only their own files or hunks to their resolved lane. Reuse suitable existing reminder hooks or add the smallest supported hook when none exists. These hooks must not build, typecheck, lint, test, invoke a verifier, or gate completion on verification results.

Do not create ownership registries or claim/pause/resume CLIs, command guards, verification pipelines, repair daemons, reservations, or automatic repair tasks. New verification hooks are outside this skill's scope. Adapt existing verification hooks only when necessary for GitButler compatibility.
## Discover only what affects compatibility

Read [references/discovery-and-interview.md](references/discovery-and-interview.md). Inspect project instructions, current version-control state, local skills, supported harness configuration, existing checks, and approval rules. Inspect supported reminder events and existing hook registrations. An absent reminder hook may be added for lane assignment; an absent verification hook or canonical completion verifier must remain absent.

Support the harnesses already established by repository evidence without asking whether to keep supporting them. Do not ask rhetorical confirmation questions about preserving workflows or running appropriate existing checks. Ask only when a material ambiguity cannot be resolved from the project or the user's request; continue independent work meanwhile.

Use the project's existing version-control workflow for this task. Read its local GitButler skill when present and inspect `but` state before lane changes. When the project uses a dedicated `setup-gitbutler` lane, reuse it and keep setup changes separate and unmerged. If establishing that lane is part of the requested setup, create it using supported GitButler commands. Do not reorganize unrelated lanes or assume this skill authorizes commits contrary to an existing approval gate.

## Adapt the necessary surfaces

- **Guidance:** Add or update a concise workspace-only GitButler section in the authoritative instructions. Use [references/parallel-agent-guidance.md](references/parallel-agent-guidance.md) as an adaptable example, not a mandatory bundle. State how agents resolve lanes and select only their own changes. Keep existing commit timing, worktree rules, and approval gates; do not override another workflow skill's no-commit gate. Shared parallel tasks should use the established shared checkout; do not create worktrees without explicit user instruction.
- **Local command skill:** Reuse the repository-local GitButler skill. If missing or explicitly requested to refresh, use `but skill install --path <repository-local-skill-path>` and read the result. Global installation is prohibited. Ignore the known missing-global-skill warning; it is not a reason to install globally, retry installation, or stop otherwise working commands. Never use bare `but skill install`, `--global`, or `--detect`.
- **Access:** Resolve actual GitButler access failures through the harness's supported narrow permission mechanism. Read [references/permission-adapters.md](references/permission-adapters.md) only when access needs adaptation. Do not install native permission files merely because Codex or Claude is supported. Preserve existing denies and authorization boundaries.
- **Lane-assignment reminder hooks:** Create or reuse the smallest supported lifecycle hook that reminds the agent to inspect `but diff`, identify its remaining owned changes, and selectively assign them to its resolved lane under existing approval rules. Cover main agents and subagents where the harness supports suitable events. Activate only in GitButler workspace mode. Prefer a stateless reminder; global dirty state must never be treated as proof that this agent owns the changes. The hook must not automatically commit, run project checks, or introduce ownership infrastructure. Document unsupported events clearly without inventing substitutes.
- **Existing verification hooks and checks:** Adapt only existing mechanisms that actually conflict with GitButler. Preserve their triggers, scope, ordering, and failure behavior. Do not create build/typecheck/verification hooks, add verifier wrappers, or attach verification to the new reminder hooks. See the migration examples in the discovery reference.
- **Ignore rules:** Adjust only patterns that hide necessary setup configuration or state already used by the project. Do not create new state just to justify an ignore entry.

Keep shared behavior accessible to every supported harness using existing guidance/discovery conventions. Preserve harness-specific metadata and configuration. When an existing mechanism cannot be migrated on a harness, explain the concrete limitation rather than silently dropping support or inventing a replacement.

Do not run `but setup` to bypass `Setup required: unable to open database file`. This can indicate protected `.git/gitbutler/` access. Use the supported permission/escalation mechanism; if unavailable or rejected, report the blocker and stop version-control mutations. Never fall back to raw Git writes.

## Preserve project policy

Compatibility guidance, local skill discovery, and necessary database access are distinct from new policy. Setup does not grant standing authority for repair dispatch, conflict resolution, history rewrites, committing, or publication. Preserve the project's existing authorization for each action. Report conflicts with their lane/path evidence and follow the established repair workflow; do not install repair machinery.

Where local commits are already authorized, inspect `but diff`, select exact owned file or hunk IDs, and explicitly target the resolved lane. Never sweep up unrelated work. Keep a separately maintained setup lane unmerged unless the user explicitly requests permanent integration. Do not push, publish, open a PR, or merge without explicit authorization.

## Validate proportionately

Run appropriate existing checks for the changed surfaces: syntax checks and focused behavior tests for new reminder hooks or adapted existing hooks (workspace activation, reminder delivery, no automatic commits or verification commands), syntax checks for changed configuration, and repository skill checks where available. Preserve the project's established verification commands; do not invent a canonical verifier or force checks into agent completion. Guidance-only setup does not require building a lifecycle simulation suite or running unrelated application tests.

Inspect the final diff for scope, ownership, preserved approval boundaries, and cross-harness compatibility. Preserve both `disable-model-invocation: true` and Codex `policy.allow_implicit_invocation: false` for this manually invoked skill. A harness validator rejecting another harness's required metadata is a validator limitation, not permission to remove compatibility.

Report what changed, which lane reminders were added or reused, which existing mechanisms needed migration (or that none did), checks actually run, and remaining access/runtime limitations. Distinguish file parsing from proven live harness behavior. Do not claim commits, lane state, or working integrations without evidence.
