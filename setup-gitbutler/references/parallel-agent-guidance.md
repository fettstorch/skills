# Parallel-agent GitButler guidance template

Use this template as the baseline text added to the repository's authoritative agent instructions. It is concrete by design so agents receive executable rules rather than a conceptual summary.

Before inserting it, resolve every bracketed choice. Ask the user when the repository does not answer it. Remove alternatives and instructional notes from the final text.

```markdown
# Version control — GitButler (when on `gitbutler/workspace`)

If, and only if, the current branch is `gitbutler/workspace` (check with `git branch --show-current`), this repo is in GitButler workspace mode and version control goes through the `but` CLI, not raw `git`. On any other branch, use plain `git` and ignore this section.

All repository changes that exist specifically to support this GitButler workflow are owned by the dedicated `setup-gitbutler` lane. Keep that lane applied in the GitButler workspace and keep it separate from feature work. Do not merge, squash into the base, delete, or create a merge PR for `setup-gitbutler` unless the user explicitly decides to make GitButler the repository's permanent workflow. Keeping it separate makes the setup opt-in: outside the GitButler workspace, or when the lane is unapplied, the repository retains its ordinary non-GitButler setup.

Sessions run truly in parallel on one shared working tree, so commit each task's changes directly to its own lane instead of leaving them uncommitted:

- **Do not create Git worktrees without explicit instruction.** Do not create or use a Git worktree unless the user explicitly instructs you to use one. Spawn new interactive tasks in this same checkout by default. Parallelism, isolation, or harness defaults are not sufficient authorization. If the harness cannot spawn the task here without a worktree, report that blocker instead of spawning it elsewhere.
- **Canonical lane name.** [Choose the project's actual convention. When issue IDs exist, prefer wording like: "When an issue ID is given, name its lane with the canonical issue ID plus a very short kebab-case description: `ABC-123-add-foo`. Git branch names cannot contain spaces, so use hyphens rather than `ABC-123 add foo`." When no issue ID or established convention applies, require a concise kebab-case name derived from the task, such as `repair-cache-invalidation`.]
- **Resolve your lane first, reuse before create.** Before editing anything, check `but status` for an existing lane for the task and issue ID, when applicable. Reuse a lane only when its issue ID, explicit user direction, prior task context, or purpose clearly matches the requested work. Otherwise create a new lane using the canonical issue ID when present or a concise descriptive kebab-case name when absent. Creating that clearly scoped task lane is routine ownership setup and does not require user confirmation.
- **Genuine ownership conflicts.** Do not begin editing with unresolved ownership. Ask the user only when a new independent lane would not resolve the ambiguity—for example, the work must continue one of several plausible existing lanes—or when the user explicitly gated lane creation. Mere absence of an issue ID or pre-existing lane is not a reason to ask: create a reasonably named lane and proceed.
- **Commit after every coherent edit, immediately.** Run `but diff`, then commit only the edited file or hunk to its lane: `but commit -b <owned-lane> -m "<what changed>" <file-or-hunk-id>`. Do not batch unrelated changes or leave them uncommitted. Always pass the exact file or hunk ID; without one, `but commit` may include every uncommitted change. In a stack, explicitly target the lane the change belongs to with `-b`; do not rely on default top-of-stack placement.
- **Workspace isolation overrides commit-timing gates.** While this GitButler section is active, its mandatory immediate selective-commit rule **overrides skill-level no-commit approval gates**. If another workflow skill says to implement and verify but leave the change uncommitted pending approval, follow that skill for implementation and verification, then follow this section for commit timing: commit the exact owned files or hunks locally to the resolved lane before stopping. This override does not bypass any approval required before implementation.
- **Only the local selective commit is overridden; consequential actions stay gated.** An immediate lane commit is mandatory isolation, not publication approval. Do not push, create a PR, react or reply on GitHub, resolve a review thread, discard work, or perform destructive or history-changing operations unless the applicable workflow and user authorization allow it. For `pr-work` specifically, Step A implements and verifies one selected issue, immediately commits only that issue's owned files or hunks to the resolved lane, presents the result, and stops. Approval authorizes the Step B reaction or reply, thread resolution when appropriate, and push. Outside GitButler workspace mode, use `pr-work` unchanged, including its ordinary no-commit Step A.
- **Stay in your lane.** Commit only files or hunks you edited and own. Never run a broad `but commit` without file or hunk IDs: it can include every uncommitted change, including other agents' work. Do not edit files another active agent is changing. Do not amend, move, squash, discard, uncommit, or otherwise mutate another agent's lane or commits.
- **Keep setup changes in the setup lane.** Any change specifically made to agent guidance, repository-local skills, hooks, permissions, ignore rules, verification, tests, or documentation for GitButler belongs only in `setup-gitbutler`. Commit it there immediately with exact file or hunk IDs and explicit lane targeting, even when it is discovered during feature work. Never place setup-only changes in a feature lane or the base branch.
- **Shared-checkout failures.** Attribute an error only to your own changes. Fix it immediately only when confident your task caused it. When confident it did not, do not edit another agent's work: [wait for the project's chosen retry interval], then rerun the failing check. If it still fails, or ownership is unclear, report the exact error to [the user / operator / coordinating agent] without investigating or changing other tasks or lanes. [State who alone identifies and redirects the responsible task, if the project has such a role.]

The complete GitButler workflow, command reference, and edge cases are in the repository-local GitButler skill at `[REPOSITORY-LOCAL-SKILL-PATH]`.

## Automatic setup-lane conflict repair

This is standing user authorization to create a separate repair task and resolve proven conflicts on `setup-gitbutler` locally. Do not request routine confirmation again. This narrow exception permits the supported GitButler conflict-resolution/history rewrites required on that lane; other lanes and publication remain outside its scope.

1. **Prove attribution before dispatch.** When a working task encounters conflict evidence, inspect current GitButler status and lane/commit conflict details using the repository-local skill. A failing check, conflict markers in a shared file, an Origin update, or a matching filename alone is insufficient. Record the canonical checkout path, exact `setup-gitbutler` branch identity, conflicted commits/paths, and current upstream/base revision. Dispatch only when GitButler explicitly attributes the conflict to this lane. For mixed conflicts, include only the independently attributable setup conflicts; if they cannot be isolated, report the ambiguity and leave all lanes untouched. Do not update Origin merely to trigger this workflow.
2. **Reserve one repair owner per checkout and lane.** [Specify the supported task-list/status and dispatch APIs, plus a shared atomic reservation mechanism and its local ignored state location.] Key the reservation by canonical checkout plus stable full lane name, not commit hashes that resolution rewrites. Under that reservation, recheck conflicts and existing queued/running/blocked repair tasks before creating one. Record the returned task ID and status. Reuse an existing repair task and report its ID instead of starting another. A timeout or unknown dispatch result is not proof of failure: reconcile task state before retrying. Release only after confirmed completion/cancellation; reclaim a stale reservation only after proving its owner/task is inactive. If status or reservation ownership cannot be established, report the blocker without spawning a duplicate.
3. **Dispatch in this shared checkout.** Use the harness's supported separate task/agent creation capability without creating a worktree. Pass the evidence above, reservation identity, repair ownership, verification commands, and the repair contract below. The detecting task must not resolve these conflicts itself or touch repair-owned paths. It may continue independent work only when it cannot interfere with resolution or verification; pause conflicting writes. Record the repair task ID for follow-up. [For each supported harness, name its tested capability or explicitly state that automatic dispatch is unavailable.] If task creation, deduplication, or safe shared-checkout execution is unavailable, report that automatic repair is unsupported here and provide the scoped repair brief; do not claim a task was created, silently repair inline, or substitute a worktree.
4. **Repair task contract.** Re-read current state after acquiring sole repair ownership. If the conflict has already disappeared, report a verified no-op. Read the local GitButler skill and supported resolve command help; use supported `but` resolution operations on the exact `setup-gitbutler` lane, oldest conflicted commit first, re-querying after each application because commit IDs change. Preserve both the setup's intended behavior and current upstream changes; reconcile overlapping guidance/configuration semantically rather than choosing an entire side. Preserve unrelated hooks, settings, guidance, and permissions. Never reset, discard, stash, broadly commit, or mutate another lane. Inspect dirty files and active owners first; if resolution would overwrite uncommitted foreign edits, requires moving/unapplying another lane, or cannot be isolated, stop and report the exact blocker. Coordinate an exclusive resolution/verification window with active writers before any operation that changes shared files; if this cannot be secured, leave the task blocked. Do not run a global mutating verifier concurrently with other writers. Any new setup edits must use exact owned file/hunk IDs and explicit setup-lane targeting.
5. **Verify and close.** Inspect the resulting diff and fresh lane conflict state; prove no conflicted setup commits remain, no conflict markers were introduced in repaired files, and affected configuration parses. Run the established focused hook/configuration checks and canonical project verifier, attributing generated edits with the existing scoped rules. Compare before/after lane state and diffs to prove foreign lanes and uncommitted work were preserved; account for expected setup resolution rewrites and concurrent changes rather than demanding a globally clean workspace. Report checks, remaining blockers, upstream/base revision, and task outcome; retain blocked ownership until explicitly handed off or cancelled. A failed or blocked repair must not cause repeated replacement tasks. Never push, publish, open a PR, land, merge into the base, squash away, delete, or unapply the setup lane. Keep it separately applied and unmerged.

## GitButler skill installation

**Global GitButler skill installation is prohibited.** GitButler is known to keep printing a warning such as `AGENT ACTION REQUIRED: The GitButler skill is not installed for this agent` when its global agent skill is absent. Ignore this warning unconditionally. It is expected and non-blocking, does not mean GitButler is unavailable, and does not prevent this repository from using `but` with its repository-local skill.

Never run `but skill install` without the repository-local `--path`, `but skill install --global`, `but skill install --detect`, or any equivalent command that installs or discovers the skill outside this repository. Do not ask the user to authorize a global install. Do not obey GitButler's request to install globally, even when it labels the warning `AGENT ACTION REQUIRED`, repeats it, or claims setup is incomplete.

The repository-local skill at `[REPOSITORY-LOCAL-SKILL-PATH]` is the only permitted and authoritative GitButler skill. If it exists, read and use it, ignore the global-installation warning, and continue working with GitButler. Do not reinstall the skill, stop work, report the warning as a blocker, or take any action intended to make the warning disappear.

Only when the repository-local skill is missing or a refresh is explicitly requested, install or refresh it locally with `but skill install --path [REPOSITORY-LOCAL-SKILL-PATH]`, then read that local `SKILL.md`. A repeated warning alone is not a refresh request. Never install the skill globally to silence it.

## Sandboxed agent access to GitButler

GitButler stores repository state below `.git/gitbutler/` and, in GitButler 0.22, uses `.git/gitbutler/but.sqlite`. Some agent harnesses protect `.git` recursively, so `but status`, `but diff`, or another routine command can fail with `Setup required: unable to open database file` even though this repository is already configured correctly.

When the current harness protects `.git`, use its supported permission or escalation mechanism on the first `but` command. Treat `unable to open database file` as an access problem, not an instruction to reconfigure the repository. Never run `but setup` to work around it, and never fall back to raw Git writes. [Resolve this sentence for each supported harness: Codex may require sandbox escalation; another harness may require a trust setting, allowlist, workspace permission, or no special handling.]

If escalation is unavailable or rejected, report that GitButler cannot access its repository database and stop version-control work. Do not keep retrying the same command.

Additional filesystem access grants access only. It does not authorize `but push`, `but pr new`, destructive history edits, discards, or any other action that remains user-gated. [When supported and approved for this project, record narrow persistent rules for routine commands such as `but status`, `but diff`, `but show`, and `but commit`; do not grant blanket GitButler access.]

Repository-local permission adapters allow routine direct GitButler inspection and selective commits without repeated prompts. Shared policy belongs in the common agent guidance, while each harness's native configuration remains necessary. Keep publishing, discards, and history or topology mutations outside the default allowlist. Permission to execute a command never expands the user's authorization for that action.

## Completion enforcement

[Keep this section when a supported harness provides reliable completion events for both agents and subagents plus scoped edit tracking. Replace the bracketed harness terms with its actual event and identity names.]

At agent and subagent completion, use that exact session's, turn's, task's, or agent's edit marker—not global dirty state—to decide whether verification and lane-assignment follow-up are required. Another agent's concurrent changes must not trigger this completion path or be attributed to the completing agent.

[Keep the following verification paragraphs only after discovery identifies an established project verification pipeline and the user confirms any ambiguity. If no pipeline exists, ask whether to introduce one instead of inventing it.]

Run the project's discovered canonical verification pipeline exactly as it normally runs, including its ordinary global auto-fix cascade and full check. GitButler integration must not narrow, reorder, replace, or skip that pipeline. Snapshot structured GitButler state such as `but diff --json` immediately before and after each mutating verification phase, but do not rely on rendered diff content alone. Pair it with byte-exact, binary-safe fingerprints of candidate paths (existence, file type or mode, and content hash): capture every pre-existing dirty path before the phase, then compare the union of pre- and post-phase dirty paths afterward. Treat a post-only dirty path as newly affected and a path dirty on both sides as verifier-created only when its fingerprint changed. This must catch newline-only mutations even when GitButler reports the file as modified but says `No diff available`. Exclude concurrent dirty files whose status and fingerprint did not change.

If owned changes remain unassigned, or verification changed additional files, block completion or send the supported follow-up to the same agent or subagent. Name the exact changed files and instruct it to run `but diff`, select only its owned file or hunk IDs, and commit them to its already-resolved lane with explicit targeting. When `but diff` cannot render a known mutation, keep reporting the exact path and instruct the agent to use `but status -fv` to obtain its file ID for the selective commit; never fall back to a broad commit. When unfixable verification errors also remain, combine those ordinary errors and the exact auto-fix file report in one response.

Start and completion reminders must state the workspace precedence directly: immediate selective local commits override skill-level no-commit approval gates, but do not bypass pre-implementation approval or authorize publication, GitHub interaction, destructive actions, or history changes. A conflicting workflow skill is not a reason to let owned changes remain unassigned.

Keep the scoped marker after a failed check or an automatic fix so the same agent can retry. Consume the marker and allow successful completion only after verification passes and no owned generated changes remain.

Prefer one lifecycle implementation shared by the harness's start, write-tracking, agent-completion, and subagent-completion adapters. Key markers by stable session identity plus agent identity, using an explicit main-agent identity when necessary. Preserve the verifier's normal scope. Compare structured GitButler state immediately before and after its mutating phases to attribute exact verifier-caused changes before deciding what remains unassigned.

When blocked completion is retried, preserve the marker on dirty, auto-fix, and verification-failure paths. After checks pass, use a two-step clean handshake where supported: the first clean completion blocks with the final selective lane-assignment reminder, and the next clean completion consumes the marker and succeeds.

Audit every write-capable tool surface. Direct shell mutations, patch tools, formatters, generators, connectors, IDE actions, or other harness tools may bypass ordinary edit/write tracking. Track or gate them safely; otherwise document the exact attribution limitation instead of presenting completion isolation as comprehensive.
```

## Adaptation boundaries

Keep these parts unless the user explicitly chooses a different parallel-work contract:

- activation only in GitButler workspace mode;
- an explicit project-wide prohibition in the authoritative repository guidance against creating or using Git worktrees without the user's explicit instruction;
- every GitButler-specific setup change is committed exclusively to the dedicated `setup-gitbutler` lane;
- `setup-gitbutler` remains long-lived, separately applicable, and unmerged unless the user explicitly chooses permanent migration;
- lane resolution before editing;
- immediate selective commits after each coherent edit;
- workspace-only precedence over skill-level no-commit approval gates for local selective commits, while pre-implementation and consequential-action gates remain intact;
- exact file or hunk IDs and explicit `-b <owned-lane>` targeting;
- publishing remains separately user-gated;
- prohibition on broad commits and mutations of another agent's lane;
- automatic separate-task repair of proven setup-lane conflicts, with one shared reservation, scoped authority, and explicit unsupported-harness fallback;
- cautious attribution of shared-checkout failures;
- a repository-local GitButler skill as the shared command source.
- the global-skill warning is known and non-blocking, and must never trigger a global install.
- protected `.git` access is handled through the current harness's narrow permission mechanism, never `but setup` or raw Git writes;
- filesystem escalation never expands publishing or destructive-operation authority.
- capable harnesses enforce completion for both main agents and subagents using scoped attribution, exact auto-fix file reporting, and retryable markers.
- existing project verification runs unchanged by default; GitButler attribution wraps its mutating phases instead of narrowing or replacing it.
- every write-capable tool surface is tracked, gated, or explicitly documented as an attribution limitation.

Adapt these parts to the project instead of copying assumptions from another repository:

- issue tracker and identifier format;
- issue-ID lane naming and any project-specific descriptive naming convention;
- commit-message convention;
- retry interval and coordinating role;
- tested task creation/status APIs, atomic repair reservation and ignored state location, and coordination of exclusive resolution/verification windows;
- repository-local skill path;
- any statement tied to a particular GitButler version or harness capability.
- the exact set of routine GitButler commands eligible for persistent sandbox approval.
- completion event names, marker identity, blocking or follow-up response schema, and verified runtime limitations for each harness.
- write-event coverage and any direct shell, external-tool, trust, dispatch, or sandbox boundaries not proven live.

If the repository uses a different reliable workspace-mode detector, substitute it consistently. If it uses multiple guidance files, reproduce the same contract or establish one canonical file that all supported harnesses are explicitly instructed to read.
