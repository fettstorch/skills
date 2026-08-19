---
name: for-each
description: Apply a user-specified command, skill, or strategy to every item in a provided list without pausing between items. Use only when the user explicitly invokes for-each.
disable-model-invocation: true
---

# For Each

Identify the operation to repeat and the ordered list of subtasks it applies to. If either is missing or materially ambiguous, ask for it before starting.

For each subtask, in order:

1. Apply the requested command, skill, or strategy to that subtask as an independent unit of work.
2. Satisfy that operation's own instructions, checks, approval boundaries, and stopping conditions.
3. Record the outcome, then continue directly to the next subtask without waiting for human review.

Do not combine subtasks merely because they share an operation. Carry forward only context or artifacts that later subtasks genuinely depend on.

Stop the loop when the requested operation requires user input or approval, a subtask fails in a way that makes later work unsafe or invalid, or the user has supplied an explicit stopping condition. Otherwise, attempt every listed subtask, even if an earlier independent subtask fails.

After the loop, report the outcome of each subtask and clearly identify any skipped, failed, or blocked items.
