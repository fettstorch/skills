import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const [skill, guidance, discovery, permissions, metadata] = await Promise.all([
  read("../SKILL.md"),
  read("../references/parallel-agent-guidance.md"),
  read("../references/discovery-and-interview.md"),
  read("../references/permission-adapters.md"),
  read("../agents/openai.yaml"),
]);
const template = guidance.match(/```markdown\n([\s\S]*?)\n```/)?.[1];

// Instruction contracts guard the scope regressions seen during real setup.
// They do not claim to prove an agent's behavior or live harness integration.
test("manual invocation remains configured for both harness formats", () => {
  assert.match(skill, /^disable-model-invocation: true$/m);
  assert.match(metadata, /^  allow_implicit_invocation: false$/m);
});

test("new lane reminders are required while verification hooks remain migration-only", () => {
  assert.match(skill, /Create lightweight hooks that remind agents/);
  assert.match(skill, /Reuse suitable existing reminder hooks or add the smallest supported hook when none exists/);
  assert.match(skill, /These hooks must not build, typecheck, lint, test, invoke a verifier/);
  assert.match(skill, /Adapt existing verification hooks only when necessary for GitButler compatibility/);
  assert.match(skill, /Prefer a stateless reminder/);
  assert.match(skill, /must not automatically commit, run project checks, or introduce ownership infrastructure/);
  assert.match(discovery, /Create lightweight lane-assignment reminder hooks even when no hooks existed previously/);
  assert.doesNotMatch([skill, guidance, discovery, permissions].join("\n"), /must automatically dispatch|standing user authorization|For every capable harness|two-step clean handshake|overrides skill-level no-commit/);
});

test("guidance retains selective lane ownership and existing approval gates", () => {
  assert.ok(template, "shared guidance example is available");
  assert.match(template, /When the current branch is `gitbutler\/workspace`/);
  assert.match(template, /select only your owned file or hunk IDs/);
  assert.match(template, /including any no-commit gate in a workflow skill/);
  assert.match(template, /Do not push, publish, create a PR, or merge without explicit authorization/);
  assert.match(template, /does not authorize automatic repair tasks or history rewrites/);
});

test("existing harnesses and checks do not trigger ceremonial questions or adapters", () => {
  assert.match(skill, /Support the harnesses already established by repository evidence without asking/);
  assert.match(skill, /Do not ask rhetorical confirmation questions/);
  assert.match(skill, /Run appropriate existing checks for the changed surfaces/);
  assert.match(permissions, /do not install adapters simply because a harness is supported/);
});

test("local skill and protected database boundaries remain intact", () => {
  assert.match(template, /Global installation is prohibited/);
  assert.match(template, /Ignore the known missing-global-skill warning/);
  assert.match(template, /Do not run `but setup` as a workaround or fall back to raw Git writes/);
  assert.match(template, /do not create or use a Git worktree without explicit user instruction/);
});

test("all entrypoint reference links resolve locally", async () => {
  const references = [...skill.matchAll(/\]\((references\/[^)]+)\)/g)].map((m) => m[1]);
  assert.equal(new Set(references).size, 3);
  await Promise.all(references.map((path) => read(`../${path}`)));
});
