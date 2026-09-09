# GitButler permission adapters

Use one shared policy with native adapters for each supported harness. `.agents` is suitable for shared instructions and policy documentation, but it is not a cross-harness execution-permission configuration surface.

## Shared policy

Record the intended command boundary in the repository's shared agent guidance or another small file under `.agents` already used by every harness:

- allow routine read operations without repeated prompts;
- allow creation of the explicitly resolved owned task lane because lane resolution before editing is part of the workflow;
- allow selective `but commit` because immediate lane assignment is mandatory;
- require direct `but` invocation so native prefix rules can classify it;
- keep push, PR creation, discard, undo, amend, squash, move, uncommit, resolve, apply/unapply, and other history or topology mutations outside the default allowlist;
- state that permission to execute a command does not change user authorization requirements.

Do not create a redundant policy file when the repository's shared guidance already states this clearly.

## Codex

Codex project-local execution rules live in `.codex/rules/*.rules` and load only when the project `.codex` configuration layer is trusted. They cannot be relocated to `.agents`.

Create or merge a dedicated file such as `.codex/rules/setup-gitbutler.rules`:

```python
prefix_rule(
    pattern = ["but", ["status", "diff", "show", "commit"]],
    decision = "allow",
    justification = "Allow routine repository-local GitButler lane inspection and selective assignment",
    match = [
        "but status",
        "but status -fv",
        "but diff",
        "but diff zz",
        "but show abc",
        "but commit -b task-lane -m message file-id",
    ],
    not_match = [
        "but push task-lane",
        "but pr new task-lane",
        "but discard file-id",
        "but move abc -b task-lane",
    ],
)

prefix_rule(
    pattern = ["but", "branch", "list"],
    decision = "allow",
    justification = "Allow listing GitButler lanes before an agent begins editing",
    match = ["but branch list"],
    not_match = ["but branch new task-lane", "but branch delete task-lane"],
)

prefix_rule(
    pattern = ["but", "branch", "new"],
    decision = "allow",
    justification = "Allow creating the agent's explicitly resolved owned task lane before editing",
    match = ["but branch new task-lane"],
    not_match = ["but branch delete task-lane", "but move task-lane --unstack"],
)
```

Adapt the command set to the installed GitButler version and confirmed workflow. Preserve the safe boundary: do not add a blanket `pattern = ["but"]` rule by default.

Validate with `codex execpolicy check --pretty --rules .codex/rules/setup-gitbutler.rules -- <command>` for every `match` and `not_match` class. Restart Codex after changing rules. Report project-trust or managed-policy restrictions if the project layer does not load.

## Claude Code

Claude Code project permissions live in `.claude/settings.json`; they cannot be relocated to `.agents`. Merge these entries into the existing `permissions.allow` array without removing unrelated settings:

```json
{
  "permissions": {
    "allow": [
      "Bash(but status:*)",
      "Bash(but diff:*)",
      "Bash(but show:*)",
      "Bash(but branch list:*)",
      "Bash(but branch new:*)",
      "Bash(but commit:*)"
    ]
  }
}
```

Do not add `Bash(but:*)` by default. Keep publishing and destructive/history commands outside the allowlist. Preserve any existing `permissions.deny` rules; deny rules may take precedence and should be reported rather than silently removed.

Validate JSON syntax, inspect the merged allow/deny boundary, and—when Claude is available—confirm the loaded rules through its permissions UI or an equivalent non-mutating check. Do not claim live loading from JSON parsing alone.

## Other harnesses

Discover their repository-local permission mechanism. Implement a native adapter only from current documentation or verified repository precedent. If no repository-local allowlist exists, keep the shared `.agents` policy, use the harness's supported approval flow, and document the limitation rather than inventing configuration.
