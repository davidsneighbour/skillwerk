// cspell:words gpgsign
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  changedSinceReview,
  discoverSkills,
  markdownReport,
  reviewRows,
  terminalReport,
  validateRegister,
} from "./skill-review-state.ts";

const skills = [
  "fettle/example",
  "fettle/other",
  "apparatus/example",
  "clerkwork/example",
];
const sha = "a".repeat(40);
const review = {
  reviewed_on: "2026-01-01",
  reviewed_by: "patrick",
  reviewed_commit: sha,
  evidence:
    "Review note: references checked; normal and failure scenarios examined; accepted by Patrick.",
};
function register() {
  return {
    version: 1,
    default_interval_days: 60,
    due_soon_days: 7,
    collections: { fettle: { interval_days: 30 } },
    skills: {
      "fettle/example": { interval_days: 10, review },
      "fettle/other": { review },
      "apparatus/example": { review },
    },
  };
}

test("an empty register requires review for every existing and new skill", () => {
  const config = validateRegister(
    { ...register(), skills: {} },
    skills,
    "2026-01-31",
  );
  const rows = reviewRows(
    config,
    [...skills, "fettle/new-skill"],
    "2026-01-31",
  );
  assert.equal(rows.length, 5);
  assert.ok(
    rows.every((row) => row.status === "requires review" && row.due === null),
  );
});

test("interval precedence, warning window, and due-day boundary", () => {
  const config = validateRegister(register(), skills, "2026-01-31");
  const rows = reviewRows(config, skills, "2026-01-31");
  assert.deepEqual(
    rows.map((row) => [row.skill, row.status, row.due]),
    [
      ["clerkwork/example", "requires review", null],
      ["fettle/example", "overdue", "2026-01-11"],
      ["fettle/other", "overdue", "2026-01-31"],
      ["apparatus/example", "current", "2026-03-02"],
    ],
  );
  assert.equal(
    reviewRows(config, ["apparatus/example"], "2026-02-23")[0]?.status,
    "due soon",
  );
  assert.equal(
    reviewRows(config, ["apparatus/example"], "2026-02-22")[0]?.status,
    "current",
  );
  assert.match(
    markdownReport(rows, "2026-01-31"),
    /1 requires review, 2 overdue, 0 due soon, 1 current/,
  );
});

test("reject invalid records, stale keys, and future dates", () => {
  const invalid: unknown[] = [
    { ...register(), typo: 1 },
    { ...register(), default_interval_days: 0 },
    { ...register(), due_soon_days: -1 },
    { ...register(), collections: { missing: { interval_days: 1 } } },
    { ...register(), skills: { "fettle/deleted": {} } },
    { ...register(), skills: { "fettle/example": { interval_days: 1.5 } } },
    ...[
      { ...review, reviewed_on: "2026-02-30" },
      { ...review, reviewed_on: "2027-01-01" },
      { ...review, reviewed_by: " " },
      { ...review, evidence: "" },
      { ...review, reviewed_commit: "main" },
      { ...review, accepted: true },
    ].map((value) => ({
      ...register(),
      skills: { "fettle/example": { review: value } },
    })),
  ];
  for (const input of invalid)
    assert.throws(() => validateRegister(input, skills, "2026-01-31"));
});

test("Git comparison covers committed, staged, unstaged, and untracked skill changes", async () => {
  const root = mkdtempSync(join(tmpdir(), "skillwerk-reviews-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  try {
    git("init", "--initial-branch=main");
    git("config", "user.email", "test@example.com");
    git("config", "user.name", "Test");
    const directory = join(root, "collections/fettle/skills/example");
    mkdirSync(directory, { recursive: true });
    const entry = join(directory, "SKILL.md");
    writeFileSync(entry, "Initial skill\n");
    git("add", ".");
    git("-c", "commit.gpgsign=false", "commit", "-m", "Initial fixture");
    const commit = git("rev-parse", "HEAD");
    assert.deepEqual(await discoverSkills(root), ["fettle/example"]);
    assert.equal(changedSinceReview(root, "fettle/example", commit), false);
    writeFileSync(join(root, "unrelated.txt"), "Unrelated\n");
    assert.equal(changedSinceReview(root, "fettle/example", commit), false);
    writeFileSync(join(directory, "resource.md"), "New resource\n");
    assert.equal(changedSinceReview(root, "fettle/example", commit), true);
    rmSync(join(directory, "resource.md"));
    writeFileSync(entry, "Changed skill\n");
    assert.equal(changedSinceReview(root, "fettle/example", commit), true);
    git("add", entry);
    assert.equal(changedSinceReview(root, "fettle/example", commit), true);
    git("-c", "commit.gpgsign=false", "commit", "-m", "Change fixture");
    assert.equal(changedSinceReview(root, "fettle/example", commit), true);
    assert.throws(() => changedSinceReview(root, "fettle/example", sha));
    assert.throws(() => changedSinceReview(root, "fettle/absent", commit));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("report indicators retain text labels for every review state", () => {
  const config = validateRegister(register(), skills, "2026-01-31");
  const report = markdownReport(
    reviewRows(config, skills, "2026-01-31"),
    "2026-01-31",
  );
  assert.match(report, /🔴 requires review/);
  assert.match(report, /🔴 overdue/);
  assert.match(report, /🟢 current/);
  const soon = markdownReport(
    reviewRows(config, ["apparatus/example"], "2026-02-23"),
    "2026-02-23",
  );
  assert.match(soon, /🟡 due soon/);
});

test("terminal table aligns columns, retains indicators, and handles an empty queue", () => {
  const config = validateRegister(register(), skills, "2026-01-31");
  const report = terminalReport(
    reviewRows(config, skills, "2026-01-31"),
    "2026-01-31",
  );
  const lines = report.split("\n").filter((line) => /^[│┌├└]/u.test(line));
  assert.equal(new Set(lines.map((line) => line.length)).size, 1);
  assert.match(report, /🔴 requires review/);
  assert.match(report, /🟢 current/);
  assert.doesNotMatch(report, /\| ---/);
  assert.match(terminalReport([], "2026-01-31"), /0 current/);
});

test("CLI selects terminal or Markdown output independently of GitHub summaries", () => {
  const directory = mkdtempSync(join(tmpdir(), "skillwerk-review-output-"));
  const summary = join(directory, "summary.md");
  const run = (...args: string[]) =>
    execFileSync(
      process.execPath,
      [fileURLToPath(new URL("./skill-reviews.ts", import.meta.url)), ...args],
      {
        encoding: "utf8",
        env: { ...process.env, GITHUB_STEP_SUMMARY: summary },
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  try {
    assert.match(run(), /┌─/);
    const markdown = run("--markdown");
    assert.match(markdown, /^# Skill reviews:/);
    assert.doesNotMatch(markdown, /┌─/);
    assert.match(run("--github"), /┌─/);
    assert.equal(readFileSync(summary, "utf8"), markdown.slice(0, -1));
    writeFileSync(summary, "");
    assert.match(run("--github", "--markdown"), /^# Skill reviews:/);
    assert.equal(readFileSync(summary, "utf8"), markdown.slice(0, -1));
    assert.throws(() => run("--validate", "--markdown"));
    assert.throws(() => run("--markdown", "--markdown"));
    assert.throws(() => run("--unknown"));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
