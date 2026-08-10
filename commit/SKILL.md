---
name: commit
description: Analyzes all uncommitted changes (staged and unstaged), groups them into semantic change groups, and creates one focused git commit per group with a thorough commit message. Use when the user types /commit or asks to commit changes intelligently, group commits, or split changes into logical commits.
---

# Smart Commit

## Core principle: commit order = reviewer journey

Each commit should build on the last so a reviewer can read the PR commit-by-commit and always have the necessary context. Prefer the following **layer order** — each layer optionally paired with its tests/infrastructure:

1. **Schema / migrations** — data shape first; everything else depends on it
2. **Models / domain types** — entities and value objects derived from the schema
3. **Business logic / services** — rules and operations over those models
4. **Components / composables / UI** — presentation layer last; depends on all prior layers

Tests and infra that belong to a layer travel *with* that layer's commit, not in a separate "tests" commit. Only create a standalone test commit when the tests span multiple layers or are purely infrastructural (e.g. new test helpers, fixtures, mocks).

This order is a **default heuristic**, not a rigid rule. Use judgment: a pure refactor, a rename, or a hotfix may not fit this hierarchy — apply whichever ordering makes the reviewer's experience most coherent.

## Workflow

### 1. Gather the full picture

Run these in parallel:
```bash
git status
git diff          # unstaged changes
git diff --cached # staged changes
```

Also check for untracked files (`git status --short`). Read any untracked files that look relevant before grouping.

### 2. Group changes semantically — ordered for the reviewer

Analyze the diff and form **semantic groups** ordered by the layer hierarchy above. Each group should:
- Represent one coherent layer or concern
- Include the tests/infra that validate *that specific layer*
- Be understandable in isolation given what came before it in the sequence
- Avoid bundling unrelated things just to reduce commit count

Present the groups to the user **before committing**, with the proposed order explicit:
```
Proposed commit groups (in reviewer order):
1. [scope] Short description — files: foo.kt, bar.kt
2. [scope] Short description — files: baz.ts
```

Ask: "Commit in this order? Or adjust grouping/order first?"

Wait for explicit approval (e.g. "yes", "do it", "looks good") before proceeding.

Once approved, **commit all groups immediately without asking again**.

### 3. Commit each group (after approval)

For each group, in order:
1. Stage only the files for that group: `git add <files>`
   - For partial file staging use `git add -p` via a script if needed
2. Commit with a thorough message (see format below)
3. Confirm with `git status` after the last commit

### EXCEPTION TO THE RULE

If you recognize that only one semantic commit group exists we do NOT use explicit user approval and can just make that one commit.

### Ordering edge cases

- **Cross-layer tests** (e.g. integration tests touching schema + logic + UI): add as a final commit after all feature commits
- **Pure refactors / renames**: commit these before the feature work they enable, or after as a cleanup — whichever is clearer
- **Unrelated changes mixed in**: split them out and note to the user that they appear unrelated to the main feature flow

### Commit message format

```
<type>(<scope>): <short imperative summary, ≤72 chars>

<body — explain WHY, not WHAT. Include:
- motivation / problem being solved
- what approach was chosen and why
- any non-obvious side effects or constraints
- relevant ticket/PR refs if known
- relevant online resources if we used any in order to generate the changes>
```

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`

**Body rules:**
- Wrap at 72 characters
- Use present tense ("add", "fix", not "added", "fixed")
- Skip the body only if the subject line is truly self-explanatory

### Rules

- Never commit without user approval of the **grouping and order** — but once approved, commit all groups without further confirmation
- Never use `--no-verify`
- Never amend commits that have been pushed
- If a file has changes belonging to two groups, note it and ask the user how to split (partial staging)
- Untracked files: include them in a group only if they are clearly part of it; otherwise ask
- Always ask yourself: *"Can a reviewer understand this commit without reading the ones that come after it?"* If not, reorder or split
