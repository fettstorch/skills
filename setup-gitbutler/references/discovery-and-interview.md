# Discover and adapt existing workflows

Read project instructions first. Inspect version-control state, local skill discovery, supported harnesses, permissions, manifests, CI and contributor check instructions. Use targeted `rg` and follow relevant callers; inspect the supported lifecycle events needed for lane reminders without auditing every possible harness capability.

For an existing hook or check that touches version control, establish its configured entry point, trigger, scope, mutations, and approval boundary. A similarly named helper or unused configuration is not evidence of an active workflow. Do not assume a CI command is an agent completion verifier.

Summarize only findings that affect the change. A compact table can distinguish existing mechanism, compatibility problem, minimal adaptation, and unresolved decision. If verification hooks or a completion verifier are absent, leave them absent. Create lightweight lane-assignment reminder hooks even when no hooks existed previously; this does not authorize new verification automation.

Preserve all established harnesses and run appropriate existing checks without confirmation questions. Ask only for a consequential unresolved choice, such as two plausible owners of an existing lane or conflicting project instructions. Do not ask the user to reconfirm discoverable facts or ordinary verification.

## Migration examples — only when the mechanism already exists

- An existing pre-commit hook uses raw Git staging to gather files. Adapt that version-control operation to the project's supported GitButler selection workflow while preserving the hook's existing check commands, trigger, scope, and failure behavior. Keep lane-reminder registration separate from this verification migration.
- An existing agent reminder tells agents to use `git add` and `git commit`. Update that reminder to use the local GitButler skill in workspace mode; preserve its existing event registration. For supported harnesses without a reminder, add a lightweight lane-assignment reminder at a suitable supported event.
- An existing check auto-formats files. Keep its invocation and scope unchanged. Inspect resulting changes and selectively assign only owned changes using the existing workflow; do not add snapshots, fingerprint infrastructure, edit markers, or a completion pipeline.
- Existing supported harnesses discover instructions differently. Update their existing pointers to shared GitButler guidance rather than copying a new automation stack into each harness.
- A repository has guidance and checks but no hooks. Adapt guidance and skill access, add lightweight lane-assignment reminder hooks, and run checks relevant to the edited files. Do not add build or typecheck hooks.

These examples are decision aids, not files or features to install. If adapting an existing mechanism would require a broader redesign, explain the incompatibility and isolate that decision from the minimal setup.
