---
name: pr-work
description: Addresses unresolved GitHub PR review threads, PR review summaries, and PR (issue) comments for lotum/wordblitz-client or wordblitz-backend. Finds PR from link or via gh, verifies factual reviewer claims against official docs or repo evidence before presenting them as accepted/actionable, then implements fixes in two phases (draft then commit/reply/push only after explicit user approval). Use when given a PR link, when asked to work on a PR or review feedback, or when determining the current branch's PR.
---

# PR Review Feedback Workflow

When given a PR link e.g. https://github.com/lotum/wordblitz-client/pull/<insert_number> (or https://github.com/lotum/wordblitz-backend/pull/<insert_number>) that is then the PR you are supposed to work at.
When not given a PR link you should determine yourself what the relevant PR is.
If the current git branch is gitbutler/workspace you should mention that you need a PR link to work with.
Otherwise you should most likely use gh to determine the current branch's PR.

## Intake rule: classify claims before you present them

Before you present review feedback to the user as "actionable", classify each item:

- **Direct code/request feedback**: rename this, add tests, simplify this block, explain this code
- **Repo-internal factual claim**: something you can verify from this repository alone
- **External/tooling factual claim**: statements about GitHub, CI, Docker, GitHub Actions, browsers, SDKs, libraries, OS behavior, third-party actions, scanners, Dependabot, etc.

For any **repo-internal factual claim** or **external/tooling factual claim**, do a verification pass **during intake**, before you present the list back to the user, unless the user explicitly says they only want raw collection with no research.

When you report such items, do **not** phrase them as established truth unless verified. Label each as one of:

- `verified`
- `contradicted`
- `unverified`

If verification is still incomplete, explicitly say so instead of silently relaying the reviewer's claim as if it were correct.

## Finding Unresolved Review Threads

To efficiently fetch UNRESOLVED review threads, use the GitHub GraphQL API with the `reviewThreads` query which includes the `isResolved` field.

**Command template:**

```bash
gh api graphql -f query='
query {
  repository(owner: "lotum", name: "wordblitz-backend") {
    pullRequest(number: PR_NUMBER) {
      id
      reviewThreads(first: 100) {
        nodes {
          id
          isResolved
          comments(first: 50) {
            nodes {
              id
              body
              path
              line
              author { login }
              createdAt
            }
          }
        }
      }
    }
  }
}' --jq '.data.repository.pullRequest | {prId: .id, threads: (.reviewThreads.nodes[] | select(.isResolved == false) | {threadId: .id, path: .comments.nodes[0].path, line: .comments.nodes[0].line, comments: [.comments.nodes[] | {id: .id, author: .author.login, body: .body, createdAt: .createdAt}]})}'
```

Note: The query now includes the PR `id` field, which is needed to add comments to review threads.

Note: The query now includes `id` fields for both threads and comments, which are needed to add reactions.

Note: The query fetches **all comments** in each thread (up to 50) including replies, so you can see the full conversation including any discussions about how to fix the issue.

Replace `PR_NUMBER` with the actual PR number and adjust `name` for the specific repository if needed.
This returns only threads where `isResolved: false` with the complete conversation history.

Note: This requires `required_permissions: ["all"]` due to TLS certificate handling.

## Finding PR (issue) comments

PR-level comments (the general discussion, not tied to a code line) are separate from review threads. Fetch them with the same GraphQL `pullRequest` and the `comments` field:

**Command template:**

```bash
gh api graphql -f query='
query {
  repository(owner: "lotum", name: "REPO_NAME") {
    pullRequest(number: PR_NUMBER) {
      id
      comments(first: 100) {
        nodes {
          id
          body
          author { login }
          createdAt
        }
      }
    }
  }
}' --jq '.data.repository.pullRequest | {prId: .id, comments: [.comments.nodes[] | {commentId: .id, author: .author.login, body: .body, createdAt: .createdAt}]}'
```

Replace `PR_NUMBER` and `REPO_NAME` (e.g. `wordblitz-client` or `wordblitz-backend`). Filter or present only comments that look like questions or actionable feedback. Skip non-actionable bot/automation comments like Linear linkbacks, preview URLs, deployment notifications, status updates, or informational acknowledgements if they don't need a reply. Keep each comment's `commentId` for adding reactions; use `prId` (or the PR's node id) when adding a new reply comment to the PR.

## Finding PR review summaries

Submitted PR reviews can contain top-level review summary comments that are separate from both review threads and PR comments. Always fetch them too, but list only non-empty bodies that look actionable.

**Command template:**

```bash
gh pr view PR_NUMBER --repo lotum/REPO_NAME --json reviews
```

From the returned JSON, keep only reviews where:
- `body` is non-empty after trimming whitespace
- the body is actionable review feedback or a question
- informational bot summaries without requests can be ignored

When listing them, include:
- `state`
- the relevant body summary

## Workflow

> :no_entry: **CRITICAL - READ THIS FIRST** :no_entry:
>
> **NEVER commit, push, add reactions, or reply to GitHub threads without EXPLICIT user approval.**
>
> Work through selected issues **one at a time**:
> - Implement the fix for ONE issue → show changes → **STOP and wait for approval**
> - Only AFTER approval: commit + GitHub reply (+ resolve thread when applicable) + **push**, then **immediately move to the next selected issue**
>
> **User approval** (e.g. "looks good", "yes", "do it", "approve") authorizes commit, GitHub reply, and **push** for that issue — you do not need a separate push instruction.
>
> **If you skip waiting for approval, you are violating the user's trust and autonomy.**

When the PR is found/given, list **only sources that contain actionable feedback** as concise, continuously-numbered markdown tables: (1) all UNRESOLVED review threads, (2) actionable PR review summaries, and (3) PR (issue) comments that look like questions or actionable feedback. Numbering is **continuous across the listed sections** so the user can refer back unambiguously (e.g. "fix 1, 3, 5"). Do **not** render a table, placeholder row, or "—" row for a source with no actionable rows. Instead, add one short sentence after the tables naming which sources were checked and had no actionable items.

Each row MUST include a verification status column with one of `verified` / `contradicted` / `unverified` (or a hyphenated nuance such as `verified-but-debatable`). For any status other than a clean `verified`, follow the table with a short bullet directly below it (`- #N — <reason>`) explaining why — keep the table itself compact.

Do **not** include raw GitHub node IDs, thread IDs, root comment IDs, review IDs, or comment IDs in user-facing tables. Keep those IDs in your working notes so you can react/reply later, but the user should select issues by the continuous `#` column. For review-thread rows, prefer a `path:line` topic anchor over the bare path.

**Example layout:**

**Unresolved review threads:**

| # | File:line | Topic | Status |
|---|---|---|---|
| 1 | `baz.ts:42` | rename `foo` → `bar` | `verified` |
| 2 | `foo.ts:22-44` | clarify what these lines do | `verified` |

**PR review summaries:**

| # | State | Topic | Status |
|---|---|---|---|
| 3 | COMMENTED | pinned SHA looks like a tag object, not a commit SHA | `unverified` |

- #3 — needs `git`/GitHub verification before treating as actionable

**PR comments:**

| # | Topic | Status |
|---|---|---|
| 4 | does the Dockerfile chown affect the host? | `verified` |
| 5 | claims Dependabot alerts aren't generated for SHA-pinned actions | `verified` |

- #5 — supported by [GitHub docs](https://docs.github.com/...)

### Advising conceptual fixes for non-trivial issues

After the tables (and their status bullets), add a short **Suggested approach** section that proposes a conceptual fix **only for the non-trivial issues**. The goal is to give the user enough to decide *what* to fix and *how* before any code is written.

- **Skip the trivial ones.** Issues like renames, typos, formatting, obvious one-liners, or self-explanatory requests need no advice — do not add noise for them.
- **Cover the non-trivial ones**: anything involving design trade-offs, multiple viable approaches, cross-cutting changes, behavioral/architectural impact, or where the reviewer's claim was `contradicted` / `unverified` / `verified-but-debatable`.
- Keep each suggestion **concise and conceptual** — describe the approach, key files/areas touched, and trade-offs or open questions. Do **not** write the full implementation here; this is pre-implementation advice, not Step A.
- If an item is `contradicted` or debatable, state the correct behavior (with the doc link/evidence) and recommend whether to fix, push back, or decline.
- If a non-trivial issue has more than one reasonable approach, list the options briefly and name your recommendation.

**Example layout:**

**Suggested approach (non-trivial issues):**

- **#2** — clarify lines 22–44: extract into a named helper (`computeFoo`) so intent is obvious; no behavior change. Touches `foo.ts` only.
- **#3** — pinned SHA: research says the ref *is* a valid commit SHA (`contradicted`). Recommend replying with the evidence and declining rather than changing the pin.

This advice still respects the approval gate — it informs the user's selection but does **not** authorize implementation.

**Important**: When collecting review threads, retain internally:

- The thread ID (`threadId`) - identifies the entire conversation thread
- The root comment ID (first comment in the `comments` array) - this is what you'll react to and reply to
- The PR ID - needed for adding comments
- Each thread represents ONE issue that will get ONE commit

**Important**: When collecting PR comments, retain the comment ID internally for reactions. In the user-facing list, include only useful context such as author and body summary so the user can choose which to address. PR comments have no "resolve" state; treat them as actionable when they ask a question or request a change.

**Important**: When collecting PR review summaries, retain the review ID internally. In the user-facing list, include only useful context such as author, state, and body summary so the user can choose which to address. Review summaries are easy to miss because they are separate from both review threads and PR comments. Do not skip them.

**Important**: Review the **full conversation** in each thread, including any replies from the PR author that might explain how to fix the issue or discuss potential solutions. The query fetches all comments in each thread for this purpose.

**Important**: Each review thread represents ONE issue/request. Even if a thread has multiple comments, it's still ONE issue that needs ONE commit.

> :no_entry: **CRITICAL - replies must be individual comments, NEVER a review** :no_entry:
>
> Answering review comments must **never** start, add to, or submit a **pending review**. Every reply is posted as a **single standalone comment** that is published immediately.
>
> - **DO** use `addPullRequestReviewThreadReply` (GraphQL) — it posts one reply into the existing thread instantly, with no review to submit.
> - **DO NOT** use `gh pr review` (`--comment` / `--approve` / `--request-changes`) — it creates/submits a whole review.
> - **DO NOT** use `addPullRequestReviewComment` or any "start a review" / "add review comment" flow — those batch comments into a pending review that then requires a separate submit step.
> - If you ever find yourself needing to "submit" a review to make replies appear, **stop** — you used the wrong API. Replies should already be live the moment they are posted.

**Important**: When reacting and replying to threads:

- The **root comment** is always the FIRST comment in the `comments` array (index 0) - this is the comment that started the thread
- Always react (:+1:) to the root comment to acknowledge the issue
- Always reply to the **thread** (using `pullRequestReviewThreadId`) via `addPullRequestReviewThreadReply`, NOT to a specific comment and NOT via a review. This ensures your reply appears immediately in the existing thread conversation as an individual comment, not as an unsubmitted review comment.
- Even if later comments in the thread provide more context or clarification, react to the root comment and reply to the thread
- After a fix reply (e.g. `Fixed:` / `Behoben:`), **resolve the thread** when the commit fully addresses the feedback; skip resolve for partial, explanatory, or follow-up replies
- **Bot reviewers vs humans on declines:** when the root comment author is an automated review bot (e.g. `chatgpt-codex-connector`, `copilot-pull-request-reviewer`, or any `login` ending in `[bot]`), a justified disagreement / won't-fix reply **may also resolve** the thread — a bot cannot sign off, so leaving it open serves no one. For **human** reviewers, leave declines **unresolved** so they can confirm or push back.

This way I will be able to tell you what issues I want you to fix/work on.

### Verifying reviewer claims and questions concerning tools, platforms, third-party

When a review thread, PR review summary, or PR comment makes **factual claims** about a **specific technology**—e.g. GitHub Actions / CI, Docker, a third-party GitHub Action, a library or SDK, browser or OS behavior, or platform APIs—**do not treat the comment as automatically correct** (including Copilot, other bots, or humans). Treat assertions as hypotheses until supported by evidence.

This verification must happen in two places:

1. **During intake/listing**, before you present the item as actionable or correct
2. **Before implementation or reply**, in case deeper verification is still needed

**Before implementing or arguing the fix**, and usually already during intake, verify the claim using one or more of:

- **Web search** aimed at **official documentation** or authoritative sources (vendor docs, project README, release notes)
- **Official docs** read directly (e.g. [GitHub Actions contexts](https://docs.github.com/en/actions/learn-github-actions/contexts), framework guides)
- **This repository** (workflows, configs, Dockerfiles, lockfiles) to see what is actually in use

Only after that, implement the change (if any), run the relevant checks, and summarize. If research contradicts the review, say so and propose the correct behavior with citations or doc links.

Do not hide behind "I am only listing feedback right now" to skip this step. If the reviewer is making a factual claim about third-party or platform behavior, you should normally verify it before your first substantive response about that item.

### Per-issue fix loop

Once the user selects the issues to address (e.g. "fix 1, 3, 5" or "all"), process them **one at a time** in the selected order. If more selected issues remain after an approved issue is committed, replied to, and pushed, continue directly to Step A for the next selected issue without waiting for another user nudge. The only stop point between selected issues is Step A approval before committing that specific issue.

Checkout the relevant branch once before the loop starts.

#### Step A – Implement & verify (no commits yet)

> :no_entry: **STOP after this step and wait for explicit user approval before committing** :no_entry:

1. Review the full conversation or comment for this issue. For review summaries, inspect the full review body and any referenced files.
2. If the item was listed as `unverified`, resolve that verification now before touching code.
3. **Research technical questions before implementing.** Do not guess. Use web search (official docs), codebase inspection, or runtime checks as needed. For threads about **tools, platforms, or third-party behavior**, always verify against official docs first.
4. Implement the change and run the relevant verification (type-check, targeted tests, linting, etc.).
5. Show the user what changed and **wait for explicit approval** (e.g. "looks good", "yes", "do it").
   - If the user requests changes, make them and wait for approval again.

#### Step B – Commit, reply, resolve & push (ONLY after explicit approval for this issue)

1. Create a commit with a concise message starting with `REVIEW: ...` covering **only** this issue.
2. Depending on the issue type:

   **Review thread** — add a :+1: reaction to the root comment (first comment in the thread):
   ```bash
   gh api graphql -f query='
   mutation {
     addReaction(input: {
       subjectId: "ROOT_COMMENT_ID",
       content: THUMBS_UP
     }) {
       reaction { content }
     }
   }'
   ```
   Then reply to the thread using `addPullRequestReviewThreadReply` — this posts an **individual comment** immediately. Do **NOT** use `addPullRequestReviewComment`, `gh pr review`, or any flow that opens a pending review that must be submitted:
   ```bash
   gh api graphql -f query='
   mutation {
     addPullRequestReviewThreadReply(input: {
       pullRequestReviewThreadId: "THREAD_ID",
       body: ":robot: Fixed: [concise description of what was changed]"
     }) {
       comment { id body }
     }
   }'
   ```
   - Use the `threadId` (NOT a comment ID) for `pullRequestReviewThreadId`
   - The reply is live as soon as this mutation succeeds — there is **no review to submit** afterwards
   - Always start the reply with `:robot: `. Match the language of the original comment (German → German, etc.)
   - Keep the body very concise (e.g. `:robot: Behoben: Statische Properties zu const exports konvertiert`)
   - **Before sending the reply**, decide whether it **resolves** the thread. If the reply states the issue was fixed (e.g. `Fixed:`, `Behoben:`, or equivalent in the comment's language) and the commit actually addresses the feedback, **resolve the thread** after replying:
   ```bash
   gh api graphql -f query='
   mutation {
     resolveReviewThread(input: { threadId: "THREAD_ID" }) {
       thread { isResolved }
     }
   }'
   ```
   - Do **not** resolve when the reply is explanatory only, asks a follow-up question, defers work, or does not fully address the feedback — **except** when the root comment author is an automated review bot (e.g. `chatgpt-codex-connector`, `copilot-pull-request-reviewer`, or any `login` ending in `[bot]`). For bot reviewers, a justified disagreement / won't-fix reply (e.g. `:robot: Won't fix: <reason>`) **may also resolve** the thread, since no human is waiting to confirm. For human reviewers, leave such declines unresolved.

   **PR (issue) comment** — add a :+1: reaction:
   ```bash
   gh api graphql -f query='mutation { addReaction(input: { subjectId: "COMMENT_ID", content: THUMBS_UP }) { reaction { content } } }'
   ```
   Then add a new PR-level reply via REST:
   ```bash
   gh api repos/OWNER/REPO/issues/PR_NUMBER/comments -f body=':robot: [concise reply in same language as original]'
   ```
   - PR comments have no resolve state; a `Fixed:` reply is sufficient when the issue is addressed

3. **Push** the branch (`git push`) — approval for this issue includes push permission.
4. After commit + reply (+ resolve when applicable) + push are done, **move on to Step A for the next selected issue immediately** if any selected issues remain. Do not ask the user which issue to work on next unless the original selection is exhausted or ambiguous.

### Phase 3 – Finalization

1. After all threads are replayed and committed:
   - run "nr test:vr:update" IF visual changes are to be expected (visual regression snapshots)
   - commit with "chore: update snapshots" (IF snapshots were updated)
2. If snapshot or other finalization commits were created after the per-issue loop, push them too once approved (or include them in the last approved push if still in the same session)
3. Analyze resolved comments for potential coding guidelines additions (.cursor/rules/coding-guidelines.mdc):
   5.1 Review all resolved comments and their fixes to identify patterns, best practices, or learnings that could benefit future development
   5.2 For each potential guideline, consider:
   - Is it a recurring pattern or a one-off situation?
   - Would it help prevent similar issues in the future?
   - Can it be generalized beyond the specific context?
   - Does it fit into one of the existing guideline categories or does it deserve a new category?
     5.3 Present a summary of suggested guidelines to be added to `.cursor/rules/coding-guidelines.mdc`:
   - List each suggested guideline with a brief explanation of why it's valuable
   - Indicate which category it belongs to
   - Format suggestions generically (not PR-specific)
   - Wait for explicit approval before adding them to the guidelines file

## Monitoring (optional, offer it)

After the selected fixes are pushed (or when there is nothing left to fix right now), **offer to monitor the PR**. Monitoring means periodically checking in and reacting on the user's behalf until the PR is in a clean, settled state. Only start it when the user opts in.

**When monitoring, react to:**

- **Failing CI** → investigate the failing check(s), fix the cause, and go through the normal per-issue flow (Step A implement & verify → wait for approval → Step B commit + push). Do not auto-commit CI fixes without approval; the approval gate still applies.
- **New/unresolved review comments** (threads, PR comments, review summaries) → re-run the intake/verification pass, present the new items as a continuously-numbered table (same rules as above), and let the user select what to fix.

**Monitoring is done (stop the loop) when ALL of:**

- CI is **green** (all required checks passing), AND
- there are **no unresolved** code review threads / actionable comments, AND
- there is **no indication a reviewer is currently reviewing** (see **Automated-review completion** below). If activity is in flight, keep monitoring rather than declaring done.

#### Automated-review completion

Do **not** infer a pending review solely from a reviewed-commit / HEAD mismatch (i.e. the reviewer's last reviewed commit differing from HEAD is **not** by itself a reason to keep monitoring).

Use **positive evidence** that a review is in flight:

- **Codex:** a :eyes: (👀) reaction on the PR description means a review is in progress.
- A pending / in-progress reviewer **check**.
- An explicitly **queued / requested** review.

**Codex monitoring ends** when the :eyes: reaction disappears **and** Codex has posted its review, comments, or a :+1: (👍) reaction.

If **no positive pending signal** exists, and all feedback is handled, unresolved threads are empty, and CI is green, **stop monitoring** — even when the reviewer's latest reviewed commit differs from HEAD.

**How to run the loop:** use the `loop` skill's mechanism. Prefer an **event-gated** wake where possible (wake when CI checks complete or a git/GitHub event fires) with a long time-based fallback heartbeat so idle ticks aren't pure overhead. Suggested cadence: check roughly every few minutes while CI is running, and lean longer (e.g. 15–30m) while merely waiting on reviewers.

- Fetch CI status with `gh pr checks PR_NUMBER --repo lotum/REPO_NAME` (shows each check's state). Re-run the unresolved-thread / PR-comment / review-summary queries from above to detect new feedback.
- On each tick, give a **short** update of what changed (new failures, new comments, or "still green, still waiting on reviewer X"). Don't repeat unchanged state verbosely.
- When the done-condition is met, **stop the loop** (kill the tracked PID) and tell the user the PR is settled and why.
- If the user asks to stop early, stop the loop immediately.
