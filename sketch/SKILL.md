---
name: sketch
description: Sketch the "shell" of an implementation together with the user before detailed planning or coding. Produces a mermaid module graph, an optional sequence diagram of the feature's flow, Request/Response DTOs, domain types with fields only, a listing of test files with descriptive test names, and a proposed commit sequence. Use when the user invokes sketch.
disable-model-invocation: true
---

# Shell Sketch

Before writing a detailed plan or any implementation code, sketch the **shell** of the change and iterate on it with the user. The sketch is the deliverable of this phase — do NOT proceed to implementation until the user approves it.

## The Sketch (6 parts)

### 1. Module Graph (mermaid)

A `graph TD` of the planned modules (new and touched) and how they connect.

- Sort top-down by layer following the MVC model: entry points / controllers / views at the top, services / domain logic in the middle, models / data access / external systems at the bottom.
- Mark new modules vs. existing ones (e.g. `new` suffix in the label or distinct node style).
- Keep it to the modules relevant for this change — no full-codebase maps.

### 2. Sequence Diagram (when useful)

A mermaid `sequenceDiagram` showing the journey of the feature's main flow through the modules from part 1 — who calls whom, in what order, and what crosses each boundary.

- Include it when the flow spans several modules or has non-obvious ordering, async steps, or branching; skip it for flat call-throughs where the module graph already tells the story.
- Participants must match the module names in the graph.
- Label arrows with the DTO/type or event being passed, not implementation detail.
- One diagram per meaningful flow; if there are several (e.g. happy path and a critical failure path), prefer `alt` blocks over separate diagrams.

### 3. Request/Response DTOs

If the feature exposes an interface (API endpoint, public function, message, event), define its boundary as DTOs:

```typescript
// Request (new) — src/api/foo/create-foo.dto.ts
interface CreateFooRequest { ... }

// Response (altered) — src/api/foo/foo.dto.ts
interface FooResponse {
  id: FooId
  name: string
  status: FooStatus        // added
  tags: string[]           // changed: was a comma-separated string
}
```

- Concrete field names and types, not placeholders.
- Mark every DTO as `(new)` or `(altered)`, and append the file path where the DTO lives (or will live), e.g. `// Response (altered) — src/api/foo/foo.dto.ts`. On altered DTOs, annotate each added/changed/removed field (`// added`, `// changed: <what>`, `// removed` on a commented-out line); unmarked fields are unchanged.
- Skip this section entirely if the change has no meaningful interface boundary (e.g. pure refactor, internal fix) — say so in one line.

### 4. Domain Types

The internal types/classes that will be created or altered — **fields only, no methods, no implementations**. The goal is to see what data each type holds and where it lives.

```typescript
// Foo (altered) — src/domain/foo.ts
class Foo {
  id: FooId
  name: string
  status: FooStatus        // added; derived from lastPingAt, not persisted
  lastPingAt: Date | null  // added
  createdAt: Date
}

// FooStatus (new) — src/domain/foo-status.ts
type FooStatus = "active" | "stale"
```

- Concrete field names and types; comments only where a field's origin or lifecycle is non-obvious (persisted vs. derived, nullable and why).
- Mark every type as `(new)` or `(altered)`, and append the file path where the type lives (or will live), e.g. `// Foo (altered) — src/domain/foo.ts`. Use the same field-level annotations as the DTO section for altered ones.
- No method signatures — behavior belongs to the test plan, not here.
- Skip types that already exist unchanged; show only new types or changed fields on existing ones.

### 5. Test Plan (most important)

List every test file that will be **created or altered**, and under each file the **names of the tests** to be written.

- Test names must be descriptive full sentences of behavior, e.g. `returns 409 when a foo with the same name already exists` — never vague names like `works correctly` or `handles errors`.
- The test names must collectively cover the requirements as understood. The user reviews these names to verify the agent's understanding is correct, so favor completeness and precision over brevity.
- Format:

```markdown
**tests/foo/create-foo.test.ts** (new)
- creates a foo and returns its id
- returns 409 when a foo with the same name already exists
- rejects names longer than 64 characters with a validation error

**tests/foo/foo-service.test.ts** (altered)
- (added) notifies subscribers after a foo is created
```

### 6. Proposed Commits

An ordered list of the commits the implementation is expected to produce, in the sequence they would be made. This serves as both a roadmap for the agent and an abstract milestone overview the user reviews before approving the sketch.

- **Maximize descriptiveness.** Each entry describes, in plain language, *what the commit accomplishes and why it matters toward the final goal* — not the low-level technical mechanics. A non-technical reviewer should be able to read the list and understand what each milestone contributes.
- Prefer describing the user-visible or behavioral outcome over the code detail. Lead with the "what it does for the goal", and only mention module/type/test names as a secondary, parenthetical anchor.
- Avoid jargon-heavy subjects like `add FooStatus enum and wire into serializer`. Instead: `Track whether a foo is active or stale so the UI can flag ones that went quiet`.
- Order commits by execution: each should build on the previous and leave the codebase in a working, ideally green state.
- Keep each commit a small, coherent, independently reviewable slice — not "implement the whole feature" and not one commit per line changed.
- Anchor each entry back to the sketch by naming the relevant modules, types, or test files in parentheses, so the technical reader can still map it to the sections above.
- Format:

```markdown
1. Introduce an "active vs. stale" state for each foo, based on when it last checked in, so the rest of the system can tell healthy foos apart (`Foo`, `FooStatus`).
2. Let clients create a foo through a new endpoint, rejecting duplicate names and over-long names with clear errors (create-foo.test.ts).
3. Notify subscribers whenever a foo is created, so downstream features can react in real time (foo-service.test.ts).
```

## Workflow

1. Explore the codebase enough to ground the sketch in real module names and existing conventions.
2. Present all parts in one message. Keep prose minimal — the diagrams, DTOs, types, and test names carry the information.
3. Wait for the user's feedback. Iterate on the sketch until approved.
4. Only after approval, continue with the detailed plan or implementation.
