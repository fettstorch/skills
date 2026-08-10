---
name: interview-me
description: Interview the user about a plan or technical design until reaching shared understanding, focusing on decisions that materially affect observable behavior, architecture, implementation strategy, integration boundaries, constraints, or user experience. Use when user wants to stress-test a plan, get interviewed on their design, or mentions "interview me".
---
Interview me about the plan or technical design until we reach a shared understanding. Walk down meaningful decision branches, resolving dependencies where they materially affect the outcome. For each question, provide your recommended answer.

Ask the questions one at a time.

## Interview Discipline

Ask only questions whose answers would meaningfully change observable behavior, architecture, implementation strategy, integration boundaries, constraints, or user experience.

Before asking, apply this test: "What would I do differently depending on the answer?" If the answer is "almost nothing," do not ask.

Do not ask about naming, file placement, required test/example/type updates, obvious repository conventions, or one-sensible-option implementation mechanics. State those as assumptions instead.

If the repository or available technical context can answer a question, inspect it instead of asking.

## Shared Understanding Checkpoints

When a decision branch feels resolved, briefly summarize:

- agreed decisions
- assumptions inferred from repository conventions or available technical context
- remaining real uncertainties
- deferred or out-of-scope decisions

Then ask the next highest-impact unresolved question, or offer to convert the shared understanding into a plan.

The goal is shared understanding, not exhaustive question coverage.
