---
name: setup-gitbutler
description: Adapt an existing repository for parallel agent work in a shared GitButler workspace, centered on every agent knowing its lane and immediately assigning only its owned changes to that lane. Audits and configures guidance, a local GitButler skill, verification, hooks, ignore rules, and supported harnesses. Invoke manually when a user wants this kind of GitButler setup.
disable-model-invocation: true
---

# Set Up GitButler

Build a repository-specific GitButler setup optimized for multiple agents working concurrently in one shared working tree. Its defining invariant is:

> Before editing, each agent knows which lane it owns. After each coherent edit, it immediately assigns or commits only the file or hunk changes it owns to that lane.

The setup must make that behavior difficult to forget and difficult to perform incorrectly. It should prevent ambiguous unassigned work from accumulating, prevent one agent from sweeping up another agent's changes, and keep each task's work attributable to its owning lane.

The setup itself has a second defining invariant:

> Every change made specifically to adapt the repository to GitButler belongs in the dedicated `setup-gitbutler` lane. Keep that lane separate and unmerged unless the user explicitly chooses to make GitButler the repository's permanent workflow.

This lane is the opt-in boundary. While it is applied in the GitButler workspace, the repository contains the GitButler-specific agent guidance, local skill, hooks, permission adapters, ignore rules, and verification integration. Outside that workspace—or with the lane unapplied—the ordinary non-GitButler repository setup remains unchanged. Never leak a setup-only change onto another task lane or the base branch.

The skill-installation boundary is absolute:

> Installing the GitButler agent skill globally is prohibited. GitButler's missing-global-skill warning is known, expected, and must be ignored. Never take any action to satisfy or silence that warning.

This prohibition applies even when GitButler labels the warning `AGENT ACTION REQUIRED`, repeats it on every command, recommends an install command, or claims setup is incomplete. Do not ask for permission to install globally, do not attempt auto-detection, and do not treat the warning as a blocker. Only the repository-local skill is permitted.

Express the invariant using the project's actual collaboration model without copying another project's issue tracker, lane naming, hooks, verification commands, or agent topology.

Treat the skill as harness-neutral. Establish one shared behavioral contract first, then add the smallest necessary adapters for each agent harness the repository supports. Never make a generic instruction depend on one vendor's hook names, payloads, permission model, configuration directory, or lifecycle events. When a capability exists only in some harnesses, label it conditional and provide a clear fallback for the others.

Do not treat GitButler setup as installing one standard bundle. Separate GitButler requirements from project policy and harness-specific conveniences.

## Establish the setup lane first

Before changing any repository file:

1. Inspect GitButler status and resolve the exact lane named `setup-gitbutler`.
2. Reuse it if it exists. Otherwise create `setup-gitbutler` as the dedicated setup lane.
3. Ensure it is applied in the GitButler workspace and explicitly target it for every setup commit.
4. Do not begin setup edits while ownership of that lane is ambiguous or while the lane cannot accept commits.

After every coherent setup edit, immediately run `but diff` and commit only the owned file or hunk IDs to `setup-gitbutler`, explicitly targeting the lane. This includes all changes to agent guidance, repository-local skills, hook scripts and configuration, sandbox or permission rules, ignore rules, verification scripts, tests, and setup documentation. Never use a broad commit that could capture unrelated work.

Do not distribute setup changes across feature lanes even if a setup adjustment was discovered while working on a feature. Move or recommit the setup-only change to `setup-gitbutler` without disturbing other agents' work.

Do not merge, squash into the base, create a merge PR for, auto-merge, or otherwise land `setup-gitbutler` by default. Do not delete it after setup. It is intentionally long-lived and separately applicable. Only merge it when the user explicitly says they want to make the GitButler setup permanent for ordinary checkouts as well. Pushing the lane or opening any PR remains separately user-gated.

## Start with an audit

Read [references/discovery-and-interview.md](references/discovery-and-interview.md) in full and follow it before proposing implementation. Discover behavior from entry points and call chains, not from assumed filenames. A verifier might be a package script, task-runner target, CI command, hook, executable, build-tool task, or harness configuration; it need not be named `verify` or be a shell script.

Before editing, inspect:

- the current branch/workspace mode, GitButler status, applied lanes/stacks, and existing `but` configuration;
- repository guidance such as `AGENTS.md`, `CLAUDE.md`, or equivalent files;
- repository-local skills and how each supported harness discovers them;
- hook configuration for every harness the repository claims to support;
- whether each harness reliably exposes agent and subagent completion events plus session-, turn-, task-, or agent-scoped edit identity;
- sandbox or permission rules that govern access to `.git` and GitButler's repository database;
- verification, formatting, linting, testing, commit, push, and PR workflows;
- ignore rules that may hide configuration intended to be committed;
- how parallel agents share the working tree and how file or hunk ownership can be determined;
- existing issue identifiers, branch conventions, approval gates, and publishing rules.

Classify every proposed file change as either GitButler setup or unrelated project work. Put setup changes only in `setup-gitbutler`; leave unrelated work untouched and outside this skill's scope.

Produce a short evidence table before asking questions: discovered mechanism, concrete entry point, observed behavior, GitButler interaction, and unresolved decision. Trace each candidate far enough to distinguish a real runtime path from dead configuration or a similarly named helper.

Use the narrowest GitButler inspection command that answers the question. Global GitButler skill installation is prohibited. GitButler is known to keep printing `AGENT ACTION REQUIRED` warnings about a missing global agent skill even when the repository-local skill exists; ignore this warning unconditionally. It is non-blocking and does not prevent `but` from working.

The GitButler skill must be installed repository-locally only. If the project already contains its local skill, read and use it and ignore the warning. If it is missing or the user explicitly requests a refresh, install it with GitButler's supported `--path <repository-local-skill-path>` option, then read that local `SKILL.md`. Never run `but skill install` without `--path`, `but skill install --global`, `but skill install --detect`, or any equivalent command that writes outside the repository-local skill path. Do not ask the user to authorize any such command. A repeated warning is not a reason to retry, install globally, stop work, or report GitButler as unavailable.

Do not run `but setup` merely to bypass a database or environment error; use safe read-only inspection where possible and report what remains unverified.

### Sandboxed harness access

GitButler stores repository state below `.git/gitbutler/` and, in GitButler 0.22, uses `.git/gitbutler/but.sqlite`. Some agent harnesses sandbox or protect `.git` recursively, causing `but status`, `but diff`, or other routine commands to fail misleadingly with `Setup required: unable to open database file`. Treat that error as a likely permission or sandbox failure, not proof that GitButler setup is missing.

Use the harness's supported permission or escalation mechanism on the first `but` command when `.git` is protected. If additional access is rejected or unavailable, report the blocker and stop GitButler work. Do not run `but setup`, repeatedly retry without the needed access, or fall back to raw Git writes. In Codex this means requesting sandbox escalation; other harnesses may use trust settings, allowlists, workspace permissions, or no sandbox at all.

Read [references/permission-adapters.md](references/permission-adapters.md) in full. When Codex or Claude is supported, install the repository-local native permission adapter described there so routine GitButler work does not repeatedly prompt or fail. Do not merely suggest it and leave the workflow interrupted.

Keep the shared permission intent under `.agents`, but use each harness's required native configuration path. There is no portable `.agents` execution-permission format that replaces Codex project rules or Claude project settings. Native adapter files are still GitButler setup changes and must be committed only to `setup-gitbutler`.

Allow only the routine commands needed for lane-safe work by default: status/diff inspection, showing details, listing lanes, creating the explicitly resolved owned task lane, and selective commits to that lane. Do not use filesystem permission to bypass user authorization: pushing, PR creation, discards, resolution/history mutations, or other separately gated actions remain gated exactly as before. Broaden the allowlist only when the user explicitly chooses the additional command categories.

Preserve unrelated work and existing repository conventions. Creating or reusing the required `setup-gitbutler` lane and selectively committing setup-owned changes to it are part of this workflow. Setting up the workflow does not authorize changing any other lane topology, committing unrelated work, pushing, opening a PR, or merging the setup lane.

## Resolve project policy with the user

Infer decisions only when the repository gives clear, current evidence. Otherwise ask concise questions, preferably one decision at a time. Resolve only choices that materially affect the setup, such as:

- which harnesses must work and whether any cannot support a desired capability;
- which harnesses sandbox `.git` and which narrow GitButler commands may receive persistent approval;
- how work ownership is assigned when agents share one checkout;
- how a task maps to a lane when an issue ID is present, and any project-specific naming evidence for descriptive lanes when it is absent;
- what counts as a coherent edit boundary for immediate lane assignment;
- which actions beyond immediate assignment to the already-owned lane require approval;
- which checks must pass, when they should run, and whether they modify files;
- whether reminders or enforcement hooks are desired at all;
- where the authoritative GitButler instructions should live and how other harnesses load them.

For verification specifically, show the user what was discovered and ask them to confirm the canonical pipeline, its normal trigger points, whether it intentionally mutates files, and whether any apparently relevant command should be excluded. If no established verifier is found, ask whether the setup should add one; do not invent a new verification pipeline automatically.

Do not invent an issue tracker, stop hook, or verification command. Immediate assignment of owned changes to the owned lane is not an optional policy in this skill; determine how to realize it safely in this repository.

Lane creation is the normal resolution when no existing lane clearly owns the task. First inspect the applied and existing lanes and compare their purpose with the requested work. Reuse a lane when an issue ID, explicit user direction, prior task context, or strong semantic match makes ownership clear. When no lane clearly fits, create a new lane without asking the user merely to choose or approve it. Use the repository's established naming convention when one exists; otherwise choose a concise kebab-case name that describes the task. A supplied canonical issue ID remains the strongest naming guide and should be preserved in the lane name. Ask only when there is a genuine ownership conflict that naming a new independent lane would not resolve—for example, the task must continue one of several plausible existing lanes or the user has explicitly gated lane creation.

## Design the setup

Present a compact proposal before making material behavioral changes. Identify:

1. the GitButler workspace activation condition;
2. the source of truth for GitButler command guidance;
3. how every agent resolves and records its owned lane before editing;
4. how each coherent owned change is immediately assigned to that lane without collecting other agents' work;
5. confirmation that every proposed setup file will be committed only to `setup-gitbutler` and the lane will remain unmerged;
6. verification and approval boundaries;
7. reminders or enforcement per harness that support the invariant;
8. how completion handling covers both main agents and subagents, including verification-generated changes, wherever the harness exposes the required events and identity;
9. files to create or alter and how the setup will be tested.

For Codex and Claude, the proposal must name the native permission files that will be created or merged, the exact allowed command prefixes, and the GitButler commands intentionally left prompting or blocked.

Pause for the user's decision when the proposal contains unresolved policy or a meaningful behavior change. When all choices were explicitly requested or are already established by repository evidence, proceed without a ceremonial approval round.

The proposal must cite discovered project entry points rather than a generic filename. Describe integration in behavioral terms—for example, “wrap the canonical pre-commit auto-fix phase”—and name the concrete file or command only after discovery confirms it.

## Implement the smallest coherent setup

Typical pieces are listed below; include only those the project needs.

### Repository guidance

Read [references/parallel-agent-guidance.md](references/parallel-agent-guidance.md) in full. Add its concrete GitButler section to the repository's authoritative agent guidance (`AGENTS.md`, `CLAUDE.md`, or the equivalent used by the supported harnesses). Preserve the template's structure, imperative wording, and operational detail. Resolve its marked project choices from repository evidence or with the user; do not replace the template with a shorter conceptual summary.

If several harness-specific guidance files are authoritative, keep the behavioral contract identical across them. Prefer one shared guidance file with thin harness-specific pointers when the harnesses support that arrangement.

The resulting section must:

- state how to detect GitButler workspace mode and remain inactive outside it;
- direct version-control writes through `but` while still allowing appropriate read-only Git inspection;
- require lane resolution before editing: inspect and reuse a clearly fitting existing lane, otherwise create a concise descriptive lane without routine user confirmation;
- require immediate, selective assignment of each coherent owned file or hunk change to the owning lane;
- require explicit targeting of the owning lane when GitButler could otherwise choose another position;
- prohibit broad commits or assignments that could capture another agent's uncommitted work;
- distinguish mandatory local lane assignment from user-gated publishing or other approval-sensitive actions;
- tell agents how to respond when a failure may belong to another lane or agent;
- point to the authoritative GitButler skill rather than duplicating its complete command manual.
- state that GitButler-specific setup files are owned by the long-lived `setup-gitbutler` lane and that the lane must not be merged without an explicit permanent-migration decision.

Do not leave bracketed choices or examples from the template unresolved. Do not hardcode a particular issue prefix or assume every project uses tickets. Adapt lane discovery and naming to the project's real task model while preserving the ownership and immediate-assignment invariant.

### Repository-local GitButler skill

Install and maintain the GitButler skill repository-locally so this setup affects only projects that deliberately opt into GitButler. Use the GitButler CLI's supported path option; do not hand-recreate its command reference from memory. Record the local copy as authoritative and explicitly prevent agents from silently replacing or supplementing it with a global installation.

Document the known warning behavior literally: GitButler may continue to say its skill is not installed because it is checking for a global installation. State assertively that global installation is prohibited, the warning is expected and must be ignored, and work must continue using the repository-local skill. Never “fix” or silence the warning globally, even if GitButler calls it required, because doing so changes agent behavior in unrelated projects.

Keep cross-harness compatibility. If one harness rejects metadata required by another, preserve both formats and document the validator limitation rather than deleting compatibility metadata.

Inventory every supported harness and verify how it discovers repository skills and guidance. Keep shared instructions in portable `SKILL.md` and repository guidance. Add vendor-specific metadata or configuration only as an adapter—for example, retain both `disable-model-invocation: true` for harnesses using the portable skill metadata and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` for Codex manual-only behavior. Neither replaces the other.

### Hooks and reminders

Hooks are adapters, not the definition of the workflow. Evaluate them proactively because the setup is meant to sustain the invariant across parallel agents, but tailor them to the events and guarantees each harness actually supports. Invocation of this setup skill authorizes the completion enforcement defined below wherever the required harness capabilities exist. Ask the user before adding materially different enforcement beyond this contract when repository evidence does not already authorize it.

Conditional does not mean optional when the capability exists. If a supported harness provides reliable agent-completion and subagent-completion events plus per-session, per-turn, per-task, or per-agent edit tracking, implement completion enforcement for both main agents and subagents. Do not silently omit it merely because another harness lacks equivalent hooks.

For each supported harness, verify actual event delivery and payload/output contracts before choosing events. Do not assume that hook support in one harness exists in another. Possible uses include:

- session or subagent reminders to resolve the owned lane before editing;
- edit-time reminders to assign the just-created owned file or hunk immediately;
- marking that a session or turn changed files;
- gating broad or incorrectly targeted GitButler mutations;
- gating selected GitButler mutations on required verification;
- running checks at a reliable completion boundary.

For every capable harness, the completion path must:

1. determine whether that exact agent or subagent owns pending edits using its scoped marker or identity, never global dirty state;
2. run the project's existing verification pipeline unchanged by default and record sufficiently precise before/after state around its mutating phases to identify files created or changed by formatting, lint fixes, code generation, or other automatic fixes;
3. when owned work or generated changes remain unassigned, block completion or issue the harness's supported follow-up to that same agent or subagent;
4. name the exact affected files and instruct that agent to inspect them with `but diff`, then selectively commit only its owned file or hunk IDs to its already-resolved lane;
5. preserve the marker after failure or auto-fix so the same agent can retry;
6. report success only after verification passes, no owned generated changes remain, and the successful marker is consumed.

A proven adapter shape is:

- register start reminders for both main agents and subagents;
- track every supported write event and key state by session identity plus agent identity, using an explicit `main` identity when the harness omits an agent ID;
- keep marker state under a repository-private GitButler state location such as `.git/gitbutler/agent-hook-state` when permissions and lifecycle make that safe, or choose an equivalently isolated ignored location;
- record the exact paths written by that agent rather than snapshotting all dirty files;
- preserve the verifier's ordinary global auto-fix cascade, ordering, arguments, and full non-mutating checks;
- snapshot structured GitButler state such as `but diff --json` immediately before and after each existing mutating verification phase, but never use its rendered diff as the sole mutation detector;
- pair those snapshots with a byte-exact, binary-safe pre/post fingerprint for candidate paths, including existence, file type or mode, and content hash. At minimum, fingerprint every path already dirty before verification and every path reported dirty afterward; a post-only dirty path is newly affected, while a path dirty both before and after is verifier-created only when its fingerprint changed. This must detect newline-only edits even when GitButler says `No diff available`;
- report only paths whose status or byte-exact fingerprint actually changed during verification, so a concurrent dirty file that remained unchanged is excluded;
- use the harness's blocking completion response to address the same agent or subagent with exact paths and selective `but diff` / `but commit -b <owned-lane> <file-or-hunk-ids>` instructions. If `but diff` cannot render an identified mutation, retain the path in the report and use `but status -fv` to obtain its exact file ID; never broaden the commit merely because the rendered diff is unavailable;
- combine exact auto-fix file reporting with the verifier's ordinary unfixable formatting, lint, typecheck, test, or other errors in one blocking or follow-up response;
- when the harness retries completion after a block, use an explicit handshake: preserve the marker through dirty and verification-failure paths, block the first clean completion with the final lane-assignment reminder, then consume the marker only on the subsequent clean completion.

Adapt this shape to the harness rather than copying event names or response schemas blindly. Verify whether its main-agent and subagent completion events actually dispatch, whether blocked completion is retried, and which identity fields remain stable.

Do not redesign, narrow, reorder, replace, or skip the existing verification pipeline merely to simplify GitButler attribution. Add snapshots and reporting around the existing mutating phases. Change the verifier itself only when the user explicitly requests a verification redesign.

Do not infer ownership from all repository changes. Another agent's concurrent dirty file must neither trigger this agent's completion gate nor be named as work for this agent to commit. If the harness cannot attribute edits reliably, document that runtime limitation and use the strongest safe reminder available without pretending global state is agent-scoped.

Audit every write-capable tool surface, not only the obvious edit/write tools. Shell commands, formatters, code generators, patch tools, MCP tools, IDE operations, and harness-specific mutation tools may change files without producing the tracked write event. Safely track those surfaces, gate them, or document the attribution gap explicitly. Never claim completion isolation is comprehensive when arbitrary shell or external-tool writes can bypass ownership tracking.

Do not assume a `Stop` event exists, fires reliably, has the same name, or is the right boundary across harnesses. Do not assume Git status exposes virtual-branch changes. If checks auto-format or otherwise edit files, ensure generated changes are re-inspected and assigned to the correct lane before a commit continues. Scope state markers to the narrowest reliable session, turn, or task identity available in that harness so one agent's changes do not trigger another agent's gate.

Any reminder or gate must preserve the same ownership boundary: it may instruct an agent to assign its own change, but must not encourage a broad commit, guess the lane, or mutate work owned by another agent.

Avoid parsing shell commands with evaluation. If a gate targets only certain commands, classify input without executing it and test compound commands, wrappers, quoting, environment assignments, false positives, and retry behavior.

For Bash hooks that assign a multiline variable under `set -e`, avoid command-substitution heredocs whose final read can return non-zero. A robust pattern is `read -r -d '' variable <<'TXT' || true`; always run `bash -n` and the hook's focused behavior tests before installing it.

### Ignore rules and documentation

Ensure intended repository configuration is not swallowed by broad ignore patterns. Narrow an ignore rule only as much as needed. Document non-obvious runtime boundaries and limitations near the owning configuration.

### Permission adapters

Write the shared policy and both supported native adapters according to [references/permission-adapters.md](references/permission-adapters.md). Merge existing configuration structurally; never replace unrelated permissions, hooks, settings, or rules. Keep commands direct and simple enough for the harness rule engine to classify.

## Validate behavior

Run proportionate checks for every changed layer:

- syntax or schema validation for guidance and harness configuration;
- focused tests for hook scripts and command classification;
- safe simulations of success, failure, auto-fix, retry, and no-change paths;
- completion-hook tests for main agents and subagents separately;
- an auto-fix test proving structured before/after GitButler snapshots plus byte-exact fingerprints name every verifier-changed file, exclude an unchanged concurrent dirty file, preserve the scoped marker, and direct the same agent to selectively assign the changed files;
- a newline-only auto-fix test proving a missing-final-newline to final-newline transition is reported and blocks completion even when GitButler reports the path as modified but renders `No diff available`; the response must retain the exact path and direct the agent to `but status -fv` for a selective file ID;
- a verifier-compatibility test proving the normal auto-fix cascade and full check still run in their original order with their original scope;
- a combined-failure test proving auto-fixed paths and ordinary unfixable verification errors appear together in one response;
- a retry test proving success consumes the marker only after verification passes and no owned generated changes remain;
- a concurrent-work test proving another agent's dirty files do not trigger, contaminate, or get reported by the current agent's completion path;
- an integrated subagent-completion simulation proving exact owned paths are reported while concurrent unrelated dirty paths are excluded;
- a two-clean-completion test when the harness uses retry-on-block semantics, proving the first clean completion gives the final lane reminder and the second consumes the marker;
- a write-surface audit covering shell, patch, formatter, generator, connector, IDE, and other mutation paths, with each classified as tracked, gated, or a documented limitation;
- simulations with multiple agents' unassigned changes proving that one agent selects only its owned file or hunk IDs and explicitly targets its lane;
- a missing- or ambiguous-lane path proving the agent stops before editing rather than guessing;
- status and history evidence proving every GitButler setup file is committed exclusively to `setup-gitbutler` and no setup-only change leaked into another lane or the base;
- a lifecycle check proving the lane remains applied as an opt-in layer but unmerged, un-squashed, and undeleted;
- repository skill validation where available;
- a missing-global-skill warning path proving the agent continues with the repository-local skill and does not run a bare, global, or auto-detected install;
- a protected-`.git` path proving `unable to open database file` triggers escalation rather than `but setup` or raw Git fallback;
- permission checks proving routine GitButler access does not silently authorize publishing or destructive operations;
- Codex rule-engine tests for every allowed and intentionally unallowed GitButler command;
- Claude settings syntax checks plus allowlist inspection for the same command boundary;
- a cross-harness review confirming that shared metadata and manual/automatic invocation rules remain intact;
- a per-harness capability matrix distinguishing portable behavior from optional guidance, hook, sandbox, and configuration adapters;
- GitButler status or equivalent read-only inspection to confirm the intended workspace/lane state was not accidentally changed.

Do not claim a hook works merely because its file parses. Distinguish tested script behavior from live harness dispatch, trust, permissions, signing, or UI behavior that was not exercised.

Finish with the files changed, confirmation that every setup change is committed to `setup-gitbutler`, confirmation that the lane remains unmerged, how lane ownership is resolved, how immediate selective assignment is reinforced, verification performed, unverified runtime boundaries, and any user action still required. Do not publish or merge unless explicitly authorized.
