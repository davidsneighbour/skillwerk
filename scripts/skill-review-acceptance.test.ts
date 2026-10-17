// cspell:words gpgsign
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
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
import { checkStagedReviews, setReview } from "./skill-review-acceptance.ts";
import { changedSinceReview } from "./skill-review-state.ts";

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "skillwerk-acceptance-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  const write = (path: string, text: string) => {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  git("init", "--initial-branch=main");
  git("config", "user.name", "Test Reviewer");
  git("config", "user.email", "test@example.com");
  git("config", "commit.gpgsign", "false");
  git("config", "core.hooksPath", join(root, ".git/hooks"));
  write("collections/fettle/skills/example/SKILL.md", "# Example\n");
  write("collections/fettle/skills/untouched/SKILL.md", "# Untouched\n");
  write(
    "skill-reviews.json",
    JSON.stringify({
      version: 1,
      default_interval_days: 60,
      due_soon_days: 7,
      collections: {},
      skills: { "fettle/example": { interval_days: 30 } },
    }),
  );
  git("add", ".");
  git("commit", "-m", "Initial fixture");
  const read = () =>
    JSON.parse(readFileSync(join(root, "skill-reviews.json"), "utf8"));
  return {
    root,
    git,
    write,
    read,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("setter records staged acceptance, preserves overrides, and gate requires the staged record", async () => {
  const f = fixture();
  try {
    f.write(
      "collections/fettle/skills/example/SKILL.md",
      "# Changed example\n",
    );
    f.git("add", "collections");
    assert.throws(() => checkStagedReviews(f.root), /Review required/);
    assert.equal(await setReview(f.root, "example"), "fettle/example");
    const record = f.read().skills["fettle/example"];
    assert.equal(record.interval_days, 30);
    assert.equal(record.review.reviewed_by, "Test Reviewer");
    assert.equal(
      record.review.reviewed_on,
      new Date().toISOString().slice(0, 10),
    );
    assert.equal(record.review.reviewed_commit, f.git("rev-parse", "HEAD"));
    assert.match(record.review.reviewed_content_hash, /^[a-f0-9]{64}$/);
    assert.match(record.review.evidence, /Manual review accepted/);
    assert.throws(() => checkStagedReviews(f.root), /Review required/);
    f.git("add", "skill-reviews.json");
    assert.deepEqual(checkStagedReviews(f.root), ["fettle/example"]);
    assert.equal(
      changedSinceReview(
        f.root,
        "fettle/example",
        record.review.reviewed_commit,
        record.review.reviewed_content_hash,
      ),
      false,
    );
    f.git("commit", "-m", "Accept changed skill");
    assert.equal(
      changedSinceReview(
        f.root,
        "fettle/example",
        record.review.reviewed_commit,
        record.review.reviewed_content_hash,
      ),
      false,
    );
    f.write(
      "collections/fettle/skills/example/resource.md",
      "New supporting file\n",
    );
    assert.equal(
      changedSinceReview(
        f.root,
        "fettle/example",
        record.review.reviewed_commit,
        record.review.reviewed_content_hash,
      ),
      true,
    );
    f.git("add", "collections");
    assert.throws(() => checkStagedReviews(f.root), /Review required/);
    await setReview(
      f.root,
      "fettle/example",
      "Checked the added resource and accepted it.",
    );
    f.git("add", "skill-reviews.json");
    assert.deepEqual(checkStagedReviews(f.root), ["fettle/example"]);
  } finally {
    f.cleanup();
  }
});

test("reject unstaged and untracked skill content, unknown names, and ambiguous names", async () => {
  const f = fixture();
  try {
    f.write(
      "collections/fettle/skills/example/resource.md",
      "Untracked file\n",
    );
    await assert.rejects(setReview(f.root, "example"), /Stage all/);
    f.git("add", "collections");
    f.write("collections/fettle/skills/example/SKILL.md", "# Unstaged edit\n");
    await assert.rejects(setReview(f.root, "example"), /Stage all/);
    await assert.rejects(setReview(f.root, "missing"), /Unknown skill/);
    f.write(
      "collections/clerkwork/skills/example/SKILL.md",
      "# Another example\n",
    );
    await assert.rejects(setReview(f.root, "example"), /Ambiguous skill/);
  } finally {
    f.cleanup();
  }
});

test("untouched, entirely new, and fully removed skills do not trigger the gate", async () => {
  const f = fixture();
  try {
    f.write("README.md", "# Repository\n");
    f.git("add", "README.md");
    assert.deepEqual(checkStagedReviews(f.root), []);
    f.write("collections/fettle/skills/new-skill/SKILL.md", "# New skill\n");
    f.git("add", "collections");
    assert.deepEqual(checkStagedReviews(f.root), []);
    await setReview(f.root, "new-skill");
    const review = f.read().skills["fettle/new-skill"].review;
    assert.equal(
      changedSinceReview(
        f.root,
        "fettle/new-skill",
        review.reviewed_commit,
        review.reviewed_content_hash,
      ),
      false,
    );
    f.git("rm", "collections/fettle/skills/example/SKILL.md");
    assert.deepEqual(checkStagedReviews(f.root), []);
  } finally {
    f.cleanup();
  }
});

test("deleted supporting files trigger the gate, and expired acceptance fails", async () => {
  const f = fixture();
  try {
    f.write("collections/fettle/skills/example/resource.md", "Resource\n");
    f.git("add", "collections");
    f.git("commit", "-m", "Add resource fixture");
    f.git("rm", "collections/fettle/skills/example/resource.md");
    assert.throws(() => checkStagedReviews(f.root), /Review required/);
    await setReview(f.root, "example");
    const register = f.read();
    register.skills["fettle/example"].review.reviewed_on = "2020-01-01";
    f.write("skill-reviews.json", JSON.stringify(register));
    f.git("add", "skill-reviews.json");
    assert.throws(() => checkStagedReviews(f.root), /Review required/);
  } finally {
    f.cleanup();
  }
});

test("installed simple-git-hooks hook blocks an unaccepted skill and runs lint-staged after acceptance", async () => {
  const f = fixture();
  try {
    const script = fileURLToPath(
      new URL("./check-staged-reviews.ts", import.meta.url),
    );
    const lint = fileURLToPath(
      new URL(
        "../node_modules/lint-staged/bin/lint-staged.js",
        import.meta.url,
      ),
    );
    f.write(
      "package.json",
      JSON.stringify({
        private: true,
        scripts: {
          "validate:staged": `${process.execPath} ${script}`,
          "lint:staged": `${process.execPath} ${lint} --config ${join(f.root, "lint-staged.config.mjs")}`,
        },
        "simple-git-hooks": {
          "pre-commit":
            "npm run --silent validate:staged && npm run --silent lint:staged",
          preserveUnused: true,
        },
      }),
    );
    f.write(
      "lint-staged.config.mjs",
      'export default () => "node --version";\n',
    );
    execFileSync(
      process.execPath,
      [
        fileURLToPath(
          new URL("../node_modules/simple-git-hooks/cli.js", import.meta.url),
        ),
      ],
      { cwd: f.root, stdio: "pipe" },
    );
    f.write(
      "collections/fettle/skills/example/SKILL.md",
      "# Reviewed change\n",
    );
    f.git("add", ".");
    assert.throws(() => f.git("commit", "-m", "Must fail before acceptance"));
    await setReview(f.root, "example");
    f.git("add", "skill-reviews.json");
    const result = spawnSync(
      "git",
      ["commit", "-m", "Accepted staged content"],
      { cwd: f.root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stderr, /Review gate passed for 1/);
    assert.match(result.stderr, /node --version/);
    assert.equal(f.git("diff", "--cached", "--name-only"), "");
  } finally {
    f.cleanup();
  }
});
