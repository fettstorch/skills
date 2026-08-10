---
name: tdd
description: Test Driven Development workflow. Enforces writing failing tests before implementing behavior, then implementing until tests pass. Invoke manually when you want to drive a bug fix or feature with TDD.
disable-model-invocation: true
---

# TDD (Test Driven Development)

Follow this workflow whenever fixing a bug or developing new functionality/behavior/features.

## Workflow

Copy this checklist and track progress:

```
TDD Progress:
- [ ] Step 1: Stub — declare new API, project builds, behavior NOT implemented
- [ ] Step 2: Red — write tests for new behavior, verify they FAIL
- [ ] Step 3: Green — implement behavior, verify tests PASS
```

### Step 1: Prepare the codebase (stub)

Declare the new functions/methods/types so the project **builds**, but do NOT implement the behavior yet.

- Prefer the language's "not implemented" mechanism where available:
  - Rust: `todo!()` / `unimplemented!()`
  - Python: `raise NotImplementedError`
  - C#: `throw new NotImplementedException()`
  - Kotlin: `TODO()`
  - TypeScript/JS, Go, etc.: `throw new Error("not implemented")` or return a stub
- If the return type is primitive enough, returning a default/stub value (e.g. `0`, `""`, `false`, empty list) is acceptable.
- For bug fixes: no stub is usually needed — the buggy code already exists. Proceed to Step 2.

Verify the project builds/compiles before moving on.

### Step 2: Write failing tests (red)

Implement the tests that verify the new behavior (or reproduce the bug).

- Run the tests and **confirm they fail**. This is expected and required.
- If a test passes at this stage, it does not actually test the new behavior — fix the test.
- Follow the project's existing test conventions (framework, file location, naming).

### Step 3: Implement the behavior (green)

Implement the actual behavior (replace the stub / fix the bug).

- Run the tests and **confirm they now pass**.
- Do not modify the tests to make them pass unless the test itself was wrong — the tests are the specification.
- Run the broader test suite to check for regressions.

## Rules

- Never skip Step 2 or write the implementation before the tests.
- Never claim tests pass without actually running them.
- Report actual test output at each red/green checkpoint.
