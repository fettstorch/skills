# Shared-checkout guidance example

Adapt only the necessary paragraphs into the project's authoritative instructions. Preserve existing commit timing, approval gates, lane conventions, and guidance discovery. Replace the local skill placeholder with the discovered path. Pair this guidance with lightweight lane-assignment reminder hooks; those hooks must not invoke project verification.

```markdown
## GitButler workspace

When the current branch is `gitbutler/workspace`, use the `but` CLI for version-control mutations and read the repository-local skill at `[REPOSITORY-LOCAL-SKILL-PATH]`. Outside workspace mode, follow the project's ordinary workflow.

Before editing, run `but status` and resolve the branch for the task.

- If the user names a branch for the changes, use that exact branch. Check whether it already exists, including among unapplied branches. Create it with the requested name if it is missing and the workflow permits it. If the named branch cannot be used under project rules, surface the conflict before choosing another.
- If the user leaves the choice open, inspect existing branches before creating one. Use branch purpose, recent commits, and diffs as needed to judge fit. Prefer an active branch for a small fix or adjustment that advances its work and fits its review scope. A shared domain is a useful clue; check whether the change belongs in that branch's review. A self-contained feature with its own review scope usually deserves its own branch. If no eligible branch fits, create a descriptive branch under the existing workflow.

If ownership is genuinely ambiguous, resolve it before making overlapping changes. Use the established shared checkout for parallel work; do not create or use a Git worktree without explicit user instruction.

As soon as a coherent set of changes is ready and required checks have passed, inspect `but diff` and select only your owned file or hunk IDs. Commit them with `but commit -b <resolved-branch> -m "<message>" <owned-ids>` so parallel agents can tell which work belongs to each branch. A normal edit task includes this local commit. Preserve any explicit commit timing or approval gate, including any no-commit gate in a workflow skill. Never broadly commit another agent's changes or mutate another task's lane.

Keep GitButler-specific setup changes in the dedicated `setup-gitbutler` lane; reuse it, and use that exact name rather than applying a general branch prefix. Keep it separate and unmerged unless the user explicitly requests permanent integration. Report setup-lane conflicts and follow the project's existing repair process. This guidance does not authorize automatic repair tasks or history rewrites.

Before finishing, inspect `but diff` again. Commit any remaining completed changes you own to the resolved branch. If a task or project gate prevents the commit, report the exact gate and the paths left uncommitted. Never demand global cleanliness from the shared checkout.

Run the project's existing checks as appropriate for your changes. Preserve existing hooks and verification behavior. Do not infer ownership from global dirty state, change another agent's work to clear a check, or require the shared workspace to be globally clean. Report failures you cannot safely attribute.

Keep shared GitButler reminder code once at the repository root with thin native harness registrations. Do not duplicate registrations in child projects that already inherit them. Judge duplication by event, responsibility, and effective scope: different events or a separate project verifier are not duplicate reminders. Preserve harness-specific contracts and child-specific configuration. Reminders stay stateless and separate from verification. Have them tell the agent to inspect and selectively commit its own completed work. The hook itself only emits guidance. Own only the GitButler setup hunks in shared configuration files so unapplying setup leaves existing project verification and agent configuration operational.

Preserve approval boundaries for commits, conflict resolution, destructive operations, and external actions. Do not push, publish, create a PR, or merge without explicit authorization. GitButler access permissions do not grant action authorization.

Reuse the repository-local GitButler skill; install only if missing or explicitly requested to refresh, using `but skill install --path [REPOSITORY-LOCAL-SKILL-PATH]`. Global installation is prohibited. Ignore the known missing-global-skill warning.

If GitButler reports `Setup required: unable to open database file`, use the harness's narrow permission mechanism for protected GitButler state. Do not run `but setup` as a workaround or fall back to raw Git writes. Report unavailable access accurately.
```

Do not copy a setup-lane paragraph into projects that intentionally use another established setup arrangement. Substitute an existing reliable workspace detector if necessary. Share the guidance through existing harness entry points; use lightweight reminder hooks without adding verification hooks, ownership state, or repair automation.
