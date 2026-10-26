// cspell:words gpgsign
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkStagedVersions, skillVersion } from "./skill-versions.ts";

const source = (version: string, body = "Example") =>
  `---\nname: example\nmetadata:\n  version: "${version}"\n---\n${body}\n`;
const entry = "collections/patternbook/skills/example/SKILL.md";
function fixture() {
  const root = mkdtempSync(join(tmpdir(), "skillwerk-versions-"));
  const git = (...args: string[]) =>
    execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  const write = (path: string, value: string) => {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), value);
  };
  git("init", "--initial-branch=main");
  git("config", "user.name", "Test Reviewer");
  git("config", "user.email", "test@example.com");
  git("config", "commit.gpgsign", "false");
  git("config", "core.hooksPath", join(root, ".git/hooks"));
  write(entry, source("1.0.0"));
  write("collections/patternbook/skills/example/reference.md", "Original\n");
  git("add", ".");
  git("commit", "-m", "Baseline");
  return {
    root,
    git,
    write,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("read only a canonical metadata version from frontmatter", () => {
  assert.equal(skillVersion(source("1.2.3")), "1.2.3");
  assert.equal(skillVersion(source("1.2.3").replaceAll("\n", "\r\n")), "1.2.3");
  for (const value of [
    "01.2.3",
    "1.0",
    "v1.0.0",
    "1.0.0-beta.1",
    "1.0.0+build",
    "-1.0.0",
  ]) {
    assert.throws(() => skillVersion(source(value)), /Invalid/);
  }
  assert.throws(
    () => skillVersion("# Body\nmetadata:\n  version: 9.0.0\n"),
    /metadata/,
  );
  assert.throws(
    () =>
      skillVersion(
        source("1.0.0").replace(
          '  version: "1.0.0"',
          '  version: "1.0.0"\n  version: "2.0.0"',
        ),
      ),
    /duplicate/,
  );
});

test("require a staged increase for entry point and supporting changes", () => {
  const f = fixture();
  try {
    assert.deepEqual(checkStagedVersions(f.root), []);
    f.write(entry, source("1.0.0", "Changed"));
    f.git("add", entry);
    assert.throws(() => checkStagedVersions(f.root), /Increase/);
    f.write(entry, source("1.1.0", "Changed"));
    assert.throws(
      () => checkStagedVersions(f.root),
      /Increase/,
      "unstaged bump must not count",
    );
    f.git("add", entry);
    assert.deepEqual(checkStagedVersions(f.root), [entry]);
    f.git("commit", "-m", "Feature");
    f.write("collections/patternbook/skills/example/reference.md", "Changed\n");
    f.git("add", ".");
    assert.throws(() => checkStagedVersions(f.root), /Increase/);
    f.write(entry, source("1.0.9"));
    f.git("add", ".");
    assert.throws(
      () => checkStagedVersions(f.root),
      /Increase/,
      "a lower minor cannot be offset by a higher patch",
    );
    f.write(entry, source("1.1.1"));
    f.git("add", ".");
    assert.deepEqual(checkStagedVersions(f.root), [entry]);
    f.git("commit", "-m", "Correction");
    f.git("rm", "collections/patternbook/skills/example/reference.md");
    assert.throws(
      () => checkStagedVersions(f.root),
      /Increase/,
      "supporting file removal requires a bump",
    );
    f.write(entry, source("2.0.0"));
    f.git("add", ".");
    assert.deepEqual(checkStagedVersions(f.root), [entry]);
  } finally {
    f.cleanup();
  }
});

test("new skills start at 1.0.0; removed skills, root changes, and history need no bump", () => {
  const f = fixture();
  try {
    f.write("collections/patternbook/skills/new/SKILL.md", source("1.1.0"));
    f.git("add", ".");
    assert.throws(() => checkStagedVersions(f.root), /start at 1.0.0/);
    f.write("collections/patternbook/skills/new/SKILL.md", source("1.0.0"));
    f.git("add", ".");
    assert.equal(checkStagedVersions(f.root).length, 1);
    f.git("commit", "-m", "New skill");
    f.git("rm", "-r", "collections/patternbook/skills/example");
    f.write("README.md", "Root change\n");
    f.git("add", ".");
    assert.deepEqual(checkStagedVersions(f.root), []);
  } finally {
    f.cleanup();
  }
});

test("installed pre-commit gate rejects unchanged and unstaged versions and accepts a staged bump", () => {
  const f = fixture();
  try {
    const script = fileURLToPath(
      new URL("./check-staged-versions.ts", import.meta.url),
    );
    f.write(
      "package.json",
      JSON.stringify({
        private: true,
        scripts: {
          "validate:versions": `${process.execPath} ${script}`,
          "validate:staged": "npm run --silent validate:versions",
        },
        "simple-git-hooks": {
          "pre-commit": "npm run --silent validate:staged",
          preserveUnused: true,
        },
      }),
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
    f.write(entry, source("1.0.0", "Changed"));
    f.git("add", ".");
    const commit = () =>
      spawnSync("git", ["commit", "-m", "Changed skill"], {
        cwd: f.root,
        encoding: "utf8",
      });
    assert.notEqual(commit().status, 0);
    f.write(entry, source("1.0.1", "Changed"));
    assert.notEqual(commit().status, 0);
    f.git("add", entry);
    const result = commit();
    assert.equal(result.status, 0, result.stderr);
  } finally {
    f.cleanup();
  }
});

test("check every touched skill independently and reject missing staged metadata", () => {
  const f = fixture();
  const other = "collections/clerkwork/skills/other/SKILL.md";
  try {
    f.write(other, source("1.0.0"));
    f.git("add", ".");
    f.git("commit", "-m", "Second baseline skill");
    f.write(entry, source("1.1.0"));
    f.write("collections/clerkwork/skills/other/rule.md", "New rule\n");
    f.git("add", ".");
    assert.throws(() => checkStagedVersions(f.root), /other.*Increase/);
    f.write(other, "---\nname: other\n---\nMissing metadata\n");
    f.git("add", ".");
    assert.throws(() => checkStagedVersions(f.root), /other.*metadata/);
    f.write(other, source("1.0.1"));
    f.git("add", ".");
    assert.equal(checkStagedVersions(f.root).length, 2);
  } finally {
    f.cleanup();
  }
});
