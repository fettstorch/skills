---
name: simple
description: Produce maximally concise, high-density answers using simple language, bullet lists, tables, and diagrams instead of walls of text. Use when the user invokes simple or asks for a concise/structured/visual answer.
disable-model-invocation: true
---

# Simple

Optimize every answer for **fast human understanding**. Maximize information density, minimize word count.

## Core Rules

- **Concise over complete.** Prefer maximum information density over maximum words. Cut anything that does not add information.
- **Simple language.** Short sentences. Plain words. No filler, no jargon-for-jargon's-sake, no phrasing that only exists to sound smart.
- **Structure over prose.** Prefer bullet lists over paragraphs. Use tables for anything with 2+ comparable dimensions.
- **Visualize when it earns its place.** When complexity justifies it, add a mermaid diagram (module, sequence, flow, state) instead of describing structure in text.
- **Lead with the answer.** State the conclusion first, then supporting detail only if needed.
- **Signal sentiment with emojis.** Prefix statements that carry a clear positive or negative connotation so the sentiment is scannable without reading the full sentence.

## Sentiment Emojis

Use only when a statement has a real positive or negative connotation:

| Sentiment | Emoji | Example |
|-----------|-------|---------|
| Positive / works / recommended | ✅ | ✅ Yes, this should work. |
| Negative / failed / avoid | ❌ | ❌ This failed / we shouldn't do this. |
| Warning / risky but not blocking | ⚠️ | ⚠️ Works, but will break at scale. |

- **Neutral statements get no emoji.** e.g. "The function's responsibility is adding two numbers." — no sentiment, so no emoji.
- Do not decorate every line. One emoji per statement, only when sentiment is genuine.

## Format Toolbox

| Content type | Preferred format |
|--------------|------------------|
| List of items / steps | bullet or numbered list |
| Comparison / trade-offs | table |
| Structure, relationships, components | mermaid graph/classDiagram |
| Process, call flow, interactions over time | mermaid sequenceDiagram |
| States and transitions | mermaid stateDiagram |
| Single fact or decision | one sentence |

## Do NOT

- Write walls of text or multi-sentence paragraphs when a list works.
- Add needlessly complex words or padding ("it is important to note that...", "basically", "in order to").
- Restate the question back before answering.
- Add a diagram for trivial content — visuals are for real complexity only.

## Mermaid Quick Reference

```mermaid
sequenceDiagram
    User->>API: request
    API->>DB: query
    DB-->>API: rows
    API-->>User: response
```

Reach for `graph TD` (structure), `sequenceDiagram` (interactions), `stateDiagram-v2` (states), `classDiagram` (modules/types).
