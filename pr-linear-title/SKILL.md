---
name: pr-linear-title
description: "When creating or opening a pull request, if the work relates to a Linear issue (identifier like SP-123, ABC-456), the PR title MUST start with that issue identifier so Linear auto-links and auto-assigns the PR to the issue. Use whenever you create a PR — via `gh pr create`, `but pr new`, the GitHub/GitLab web UI, or any other method. Not specific to any repository or version-control tool."
---

# Linear-linked pull request titles

## When this applies

Whenever you create or open a pull request **and** the work relates to a Linear issue. Applies no matter how the PR is created (`gh pr create`, `but pr new`, a forge web UI, an MCP tool, etc.).

## The rule

The PR title MUST begin with the Linear issue identifier, followed by a space and a concise summary:

```
SP-123 <summary>
```

- The identifier goes at the **very start** of the title. Linear keys off the leading identifier to link the PR and move/assign the associated issue automatically.
- **Uppercase the project key** — `SP-123`, never `sp-123`.
- Keep whatever title convention the repo already uses **after** the identifier (e.g. Conventional Commits: `SP-123 feat(auth): add SSO login`).

Examples:

- ✅ `SP-123 Add rate limiting to the usage API`
- ✅ `SP-123 fix(cron): stop duplicate reward emails`
- ❌ `Add rate limiting (SP-123)` — identifier not at the start; Linear may fail to link it
- ❌ `sp-123 add rate limiting` — lowercase project key
- ❌ `Add rate limiting` — no identifier; the PR will not link to the issue

## Finding the issue identifier

Determine it, in order of preference, from: the user's request, the current branch/lane name, recent commit messages on the branch, or the task context. If the work clearly maps to an issue but you cannot determine the ID, ask the user. If the work has **no** associated Linear issue, create the PR normally with a descriptive title — no identifier is required.

## Multiple issues

Put the **primary** issue's identifier at the start of the title. Reference any others in the PR description using Linear's magic words so they link/close correctly, e.g. `Fixes SP-124`, `Part of SP-125`.

## Notes

- This rule governs the **title** only; it does not change how you create the PR. Apply it whatever tool you use — `gh pr create -t "SP-123 ..."`, `but pr new <branch> -t "SP-123 ..."`, or the web UI.
- Linear can also link via a branch name that contains the identifier, but the title prefix is the reliable, required signal here regardless of branch name.
