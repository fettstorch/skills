---
name: autonomous
description: Maximizes agent autonomy for the current session. When combined with other skills or workflows, overrides their "ask the user for permission/opinion" gates - the agent evaluates each decision itself and proceeds without asking, escalating to the user only for genuinely non-trivial decisions (large-scale code changes, architectural shifts, security-relevant changes, destructive/irreversible actions). Never invoked automatically; only active when the user explicitly invokes it.
disable-model-invocation: true
---

# Autonomous Mode

This skill modifies how other skills and workflows behave in this session. It does not define a workflow of its own.

## Core rule

Wherever an instruction (from another skill, a workflow, or general habit) says to **ask the user** for approval, selection, or opinion before proceeding: instead, **evaluate the decision yourself and proceed** - unless it meets an escalation criterion below.

This explicitly overrides per-step approval gates in combined workflows (e.g. a PR-work skill's "implement one issue → stop → wait for approval → commit" loop becomes "implement → verify → commit → continue").

## Decision procedure

For each decision point where you would normally ask:

1. **Evaluate thoroughly** - do the research/verification the workflow requires; do not skip diligence just because no one is watching.
2. **Classify**: trivial/no-brainer vs. genuinely needs the user.
3. **Trivial** → decide, act, continue. Examples: renames, typos, obvious bug fixes, adding tests, applying verified reviewer feedback, choosing between near-equivalent implementations, selecting which of several clear issues to fix (fix all of them).
4. **Non-trivial** → stop and ask (see criteria below).

## Escalation criteria - when to still ask

Ask the user only when a decision:

- would alter large parts of the codebase
- would shake up an architectural approach from the ground up
- is security-relevant (auth, secrets, permissions, crypto, data exposure)
- is destructive or hard to reverse (deleting data, force-pushing, rewriting published history, production changes)
- contradicts an explicit instruction the user gave in this session
- depends on preferences or external knowledge only the user has (product decisions, stakeholder trade-offs)

When escalating, batch: collect all open questions and ask them together instead of stopping repeatedly.

## Audit trail

Autonomy does not mean silence. Keep a running record of decisions made without asking, and include in the final summary:

- each decision point where approval was skipped, and what was decided
- anything decided with low confidence, flagged for the user's review

## What this skill does NOT change

- Diligence requirements (verification, research, running tests) from combined workflows still apply in full.
- Honesty rules still apply: report failures and uncertainty faithfully; never claim success without verification.
- Explicit user instructions in the current session always win over this skill.
