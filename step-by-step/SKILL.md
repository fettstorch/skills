---
name: step-by-step
description: Process a user-provided list one item at a time, pausing after each item for review. Use only when the user explicitly invokes step-by-step.
disable-model-invocation: true
---

# Step by Step

For each item `i` in the user's task list:

1. Execute only item `i`.
2. Report the result, then stop and await the user's review, revision, input, or feedback.
3. Keep revisions focused on item `i` and stop for review again.
4. Advance to item `i + 1` only when the user accepts item `i` or explicitly asks to continue.

Never execute or prepare later items in the same turn.
