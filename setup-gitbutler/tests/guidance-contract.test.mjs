import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillUrl = new URL("../SKILL.md", import.meta.url);
const guidanceUrl = new URL("../references/parallel-agent-guidance.md", import.meta.url);

const [skill, guidanceReference] = await Promise.all([
  readFile(skillUrl, "utf8"),
  readFile(guidanceUrl, "utf8"),
]);

const templateMatch = guidanceReference.match(/```markdown\n([\s\S]*?)\n```/);
assert.ok(templateMatch, "parallel-agent guidance must contain an injectable Markdown template");
const template = templateMatch[1];

test("injected guidance scopes commit precedence to GitButler workspace mode", () => {
  assert.match(template, /If, and only if, the current branch is `gitbutler\/workspace`/);
  assert.match(template, /overrides skill-level no-commit approval gates/);
  assert.match(template, /Outside GitButler workspace mode, use `pr-work` unchanged/);
});

test("injected guidance keeps consequential actions approval-gated", () => {
  for (const action of [
    "push",
    "create a PR",
    "react or reply on GitHub",
    "resolve a review thread",
    "destructive or history-changing operations",
  ]) {
    assert.ok(template.includes(action), `missing gated action: ${action}`);
  }
});

test("pr-work Step A commits locally before the approval stop", () => {
  assert.match(
    template,
    /For `pr-work` specifically, Step A implements and verifies one selected issue, immediately commits only that issue's owned files or hunks to the resolved lane, presents the result, and stops\./,
  );
  assert.match(
    template,
    /Approval authorizes the Step B reaction or reply, thread resolution when appropriate, and push\./,
  );
});

test("setup instructions require both injected guidance and lifecycle enforcement", () => {
  assert.match(skill, /overrides skill-level no-commit approval gates/);
  assert.match(skill, /workspace-mode reminders that explicitly say immediate selective local commits override/);
  assert.match(skill, /a `pr-work` simulation proving Step A implements, verifies, and selectively commits/);
});
