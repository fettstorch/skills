---
name: handoff
description: Compact the current conversation into a handoff document saved to the OS temp directory so a fresh agent can pick up the work in a new session. Use when the user types /handoff, asks to hand off, compact, continue in a new chat, summarise this chat for another agent, or prepare for a fresh session. The user may pass a short description of what the next session will focus on.
---

# Handoff

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to the temporary directory of the user's OS (on macOS use `$TMPDIR`, falling back to `/tmp`) — **not** the current workspace.

Use a timestamped filename like `handoff-YYYYMMDD-HHMMSS.md` so multiple handoffs don't collide.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, tokens, or personally identifiable information.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

After writing, print the full absolute path of the handoff file so the user can pass it to the next session.
