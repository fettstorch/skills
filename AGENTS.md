# Repository Guidance

## Cross-harness compatibility

Skills in this repository are shared across agent harnesses. No harness should create or update a skill so that it works only with itself.

- Preserve every supported harness's required metadata and behavior. Do not treat one harness's schema or validator as authoritative for the whole repository.
- Validate each skill against repository conventions and all relevant harness formats. If a harness-specific validator rejects metadata required by another harness, keep the cross-harness metadata and record the validator limitation instead of deleting compatibility.
- For a manually invoked skill, include both `disable-model-invocation: true` in `SKILL.md` for non-Codex harnesses and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` for Codex. Neither setting replaces the other.
- When a capability truly cannot work on a harness, declare that limitation explicitly and fail clearly rather than silently producing a harness-specific skill.

## GitButler workspace (repository-local setup)

These rules apply only on `gitbutler/workspace`. Read `.agents/skills/gitbutler/SKILL.md` for command syntax; this section takes precedence over its broader workflow defaults. Outside workspace mode, retain the ordinary Git workflow. Never install a global GitButler skill or enable GitButler implicitly in another repository.

Before editing, inspect `but status` and resolve the task's lane. Use the shared checkout; create worktrees only on explicit user instruction. Inspect `but diff` and select exact owned file or hunk IDs, targeting the resolved lane explicitly. Global dirty state does not establish ownership. Preserve existing commit timing and skill approval gates; setup grants no standing authority to commit, repair conflicts, rewrite history, or publish.

Keep this repo's guidance, local GitButler command skill, and reminder hooks in `setup-gitbutler`, separate and unmerged. Changes to the distributable `setup-gitbutler/` skill are product work and belong in a separate feature lane for eventual review into `main`. Do not push, publish, create PRs, or merge without explicit authorization. Do not reorganize unrelated lanes.

Use `but` for workspace mutations. On protected database access errors, request narrow execution access; never run setup again or fall back to raw Git writes. Preserve existing project checks and run relevant checks for changed surfaces. There are no existing verification hooks to migrate.

### Lane reminders and harness support

`.agents/hooks/lane-reminder.py` supplies stateless reminders through `.codex/hooks.json` and `.claude/settings.json` for UserPromptSubmit, SubagentStart, Stop, and SubagentStop. It only detects workspace mode and emits guidance; it does not inspect ownership, assign files, commit, run checks, or block completion. Prompt/start events deliver model context; stop events provide a visible reminder without forcing another turn. Re-read `but diff` before finishing and assign only owned changes under the existing approval rules.

Codex project hooks require a trusted project configuration and may require hook review in Settings > Hooks. Claude reads `CLAUDE.md`, which points here. Other skill hosts retain portable skill metadata and shared AGENTS guidance where supported; lifecycle hooks are not configured for Copilot, Cursor, Gemini, or other hosts because this repository establishes no native configuration for them. No substitute automation is implied. Configuration parsing and direct script tests do not prove live harness delivery.
