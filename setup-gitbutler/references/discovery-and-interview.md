# Project discovery and interview

Use this process before designing GitButler-specific changes. Its purpose is to find the repository's actual workflow without assuming filenames, tools, languages, or agent harnesses.

## 1. Discover entry points

Inspect the repository structure and follow the mechanisms it actually uses:

- agent guidance and harness configuration;
- package manifests and their scripts;
- task runners, build tools, make targets, workspace configuration, and executable tooling directories;
- CI workflows and required checks;
- Git hooks, agent hooks, lifecycle callbacks, and editor automation;
- contributor documentation describing local checks, commits, releases, or parallel work;
- ignore rules and repository-local state directories;
- existing GitButler configuration, skills, lanes, and reminders.
- native project-level command permission rules for each supported harness, including existing allow and deny precedence.

Search semantically for concepts such as format, fix, lint, check, test, validate, generate, pre-commit, completion, stop, hook, commit, and push. These are discovery terms, not required filenames or commands. Follow the repository's actual entry points instead of centering the audit on one conventional script name.

Use `rg --files`, targeted `rg`, and the repository's read-only inspection tools. Avoid broad dependency, generated-output, or vendored-directory scans unless the relevant entry point leads there.

## 2. Trace behavior

For each candidate, trace callers and callees far enough to answer:

- What invokes it locally, in CI, or through an agent harness?
- Does it mutate files, only report errors, or do both?
- Which commands run, in what order and scope?
- Does it run for main agents, subagents, humans, or all of them?
- What indicates success, failure, retry, and completion?
- Can concurrent changes from another agent affect its inputs or output?
- Which routine GitButler commands currently prompt or fail, and which native project configuration controls that behavior?
- Is this the canonical path or merely an unused helper, wrapper, or historical configuration?

Do not infer that similarly named commands are equivalent. Do not call a hook active until its owning configuration references it. Do not call a pipeline canonical solely because CI invokes it if local agent behavior uses another path.

## 3. Present evidence

Summarize findings compactly before proposing changes:

| Area | Entry point | Observed behavior | GitButler interaction | Unknown |
|---|---|---|---|---|
| Verification | concrete command or config | order, scope, mutations | attribution or lane risk | user decision if needed |

Include only rows that affect the setup. Mark facts as verified, inferred, or unverified runtime behavior.

## 4. Interview on unresolved choices

Ask focused questions when evidence cannot resolve a material choice. Prefer one question at a time. Typical questions include:

- “I found these two verification entry points. Which one is canonical for agent completion?”
- “The formatter mutates the full workspace. Should GitButler attribution wrap that existing behavior unchanged?”
- “This harness has agent completion but no subagent completion event. Should we install only a start/edit reminder and document the limitation?”
- “No verification workflow appears to exist. Should this setup introduce one, or limit itself to lane-assignment enforcement?”
- “Several existing lanes appear to own this exact task, and a new independent lane would fragment one of them. Which lane should continue the work?”

Do not ask questions already answered by current repository evidence. Creating a task lane is routine ownership setup: inspect existing lanes, reuse one only when it clearly fits, and otherwise create a concise descriptive lane without asking. Ask only for a genuine ownership conflict that a new independent lane cannot resolve. Do not silently choose a behavior that changes verification, publishing authorization, or harness enforcement.

## 5. Design from the answers

Only after discovery and necessary user answers, propose the concrete files and integration points. Preserve existing pipelines by default. Add GitButler attribution, reminders, and gates around verified runtime paths; do not manufacture a known example project's topology.
