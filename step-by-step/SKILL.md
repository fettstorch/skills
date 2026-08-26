---
name: step-by-step
description: Process a user-provided list one item at a time, pausing after each item for review. Use only when the user explicitly invokes step-by-step.
disable-model-invocation: true
---

# Step by Step

For each item `i` in the user's task list:

1. When useful before starting, briefly show the list with item `i` marked `In progress`.
2. Execute only item `i`.
3. Report the result and include a small progress table mapping every task to its current state, then stop and await the user's review, revision, input, or feedback:

   | Task | State |
   |---|---|
   | First task | Done |
   | Current task | Awaiting review |
   | Next task | Pending |

   Keep task labels short. Use `In progress` while working, `Awaiting review` after presenting the result, `Done` only after the user accepts the item, and `Pending` for later items. Add another state only when it communicates a materially different condition, such as `Blocked`.
4. Keep revisions focused on item `i` and stop for review again.
5. Advance to item `i + 1` only when the user accepts item `i` or explicitly asks to continue.

Never execute or prepare later items in the same turn.
