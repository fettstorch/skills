# Repository Guidance

## Cross-harness compatibility

Skills in this repository are shared across agent harnesses. No harness should create or update a skill so that it works only with itself.

- Preserve every supported harness's required metadata and behavior. Do not treat one harness's schema or validator as authoritative for the whole repository.
- Validate each skill against repository conventions and all relevant harness formats. If a harness-specific validator rejects metadata required by another harness, keep the cross-harness metadata and record the validator limitation instead of deleting compatibility.
- For a manually invoked skill, include both `disable-model-invocation: true` in `SKILL.md` for non-Codex harnesses and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` for Codex. Neither setting replaces the other.
- When a capability truly cannot work on a harness, declare that limitation explicitly and fail clearly rather than silently producing a harness-specific skill.
