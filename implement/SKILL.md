---
name: implement
description: Delegate one semantic change (for example, the scope of a single coherent commit) to the implementer subagent. Give it exactly as much context as it needs to fulfill its job. If an existing plan or sketch applies, make sure the implementer knows about it. Use only when the user explicitly invokes implement.
disable-model-invocation: true
---

# Implement

Delegate one coherent semantic change to the `implementer` custom agent. The
parent agent retains the broader task's intent, coordination, and final
acceptance.

Spawn the implementer with `fork_turns: "none"` when supported. Give it the
necessary context explicitly instead of inheriting the parent conversation.

For the first subagent spawned by a parent task, choose one show or movie
franchise at random without asking the user. Use that franchise as the naming
theme for every subagent task/thread created by that parent, including later
uses of this skill. Give each subagent a unique character name from the chosen
franchise, normalized to a valid lowercase task identifier such as `aang`,
`squidward`, `frodo`, `goku`, `abed`, `marceline`, or `pikachu`. Never mix
franchises within one parent task; if more names are needed, choose additional
characters from the same franchise. The character name is only the spawned
task/thread name; the custom agent type remains `implementer`.

Before spawning the implementer:

- Define the semantic change and its completion criteria.
- Provide exactly the context needed to perform that change.
- Include any applicable existing plan or sketch, or point to it precisely and
  explain how it constrains the change.
- Include relevant constraints, non-goals, approval boundaries, repository
  conventions, and verification expectations.
- Omit unrelated task history and implementation detail.

Keep this handoff preparation brief. Once the implementer has enough context to
act safely and determine completion, spawn it immediately. Do not keep exploring
the implementation or elaborating criteria that the implementer can resolve
within the delegated contract.

Ask the implementer to implement and verify only the delegated change and to
return a concise handoff with its changes, validation results, assumptions, and
blockers. Tell it to message the parent promptly if it becomes blocked or needs a
decision rather than waiting until its final handoff.

After the implementer has spawned, report that it is running. When its result is
needed to complete the user's request, keep the parent turn active with the
interruptible agent-wait mechanism. User input and subagent mailbox updates can
interrupt the wait: respond to the user or handle the subagent message, then
resume waiting while the delegated work remains in progress. This keeps the
parent responsive while allowing the implementer's message or completion to wake
it for assessment and a user-facing notification. Do not use blocking shell waits
or polling loops.

End the parent turn immediately after spawning only when the user explicitly asks
for background execution or when the implementer's result is not needed for the
parent's next step. In that case, state clearly that completion will remain queued
until the user returns; do not imply that a proactive notification will be sent.

When the implementer completes, assess its concise handoff against both the
delegated change and the broader task before accepting it or delegating another
semantic change.

Use only one write-capable implementer at a time unless their scopes are clearly
independent. The existence of a plan or sketch does not itself authorize
implementation; preserve the current approval boundary.
