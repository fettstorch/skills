# Shared-checkout guidance example

Adapt only the necessary paragraphs into the project's authoritative instructions. Preserve existing commit timing, approval gates, lane conventions, and guidance discovery. Replace the local skill placeholder with the discovered path. Pair this guidance with lightweight lane-assignment reminder hooks; those hooks must not invoke project verification.

```markdown
## GitButler workspace

When the current branch is `gitbutler/workspace`, use the `but` CLI for version-control mutations and read the repository-local skill at `[REPOSITORY-LOCAL-SKILL-PATH]`. Outside workspace mode, follow the project's ordinary workflow.

Before editing, inspect current lanes and resolve which lane owns the task. Reuse a clearly matching lane; create a descriptive lane only when allowed by the existing workflow. If ownership is genuinely ambiguous, resolve it before making overlapping changes. Use the established shared checkout for parallel work; do not create or use a Git worktree without explicit user instruction.

Inspect `but diff` and select only your owned file or hunk IDs, explicitly targeting the resolved lane when committing. Preserve the project's existing commit timing and approval gates, including any no-commit gate in a workflow skill. Never broadly commit another agent's changes or mutate another task's lane.

Keep GitButler-specific setup changes in the dedicated `setup-gitbutler` lane when that lane is used. Keep it separate and unmerged unless the user explicitly requests permanent integration. Report setup-lane conflicts and follow the project's existing repair process. This guidance does not authorize automatic repair tasks or history rewrites.

Run the project's existing checks as appropriate for your changes. Preserve existing hooks and verification behavior. Do not infer ownership from global dirty state, change another agent's work to clear a check, or require the shared workspace to be globally clean. Report failures you cannot safely attribute.

Preserve approval boundaries for commits, conflict resolution, destructive operations, and external actions. Do not push, publish, create a PR, or merge without explicit authorization. GitButler access permissions do not grant action authorization.

Reuse the repository-local GitButler skill; install only if missing or explicitly requested to refresh, using `but skill install --path [REPOSITORY-LOCAL-SKILL-PATH]`. Global installation is prohibited. Ignore the known missing-global-skill warning.

If GitButler reports `Setup required: unable to open database file`, use the harness's narrow permission mechanism for protected GitButler state. Do not run `but setup` as a workaround or fall back to raw Git writes. Report unavailable access accurately.
```

Do not copy a setup-lane paragraph into projects that intentionally use another established setup arrangement. Substitute an existing reliable workspace detector if necessary. Share the guidance through existing harness entry points; use lightweight reminder hooks without adding verification hooks, ownership state, or repair automation.
