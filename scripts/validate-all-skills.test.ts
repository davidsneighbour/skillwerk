import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
import { collections } from "./collections.ts";

const validator = fileURLToPath(
  new URL("./validate-all-skills.ts", import.meta.url),
);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "skillwerk-validation-"));
  const write = (path: string, content: string) => {
    mkdirSync(join(root, path, ".."), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const collection = (name: string, skills: string[]) => {
    const base = `collections/${name}`;
    mkdirSync(join(root, base, "skills"), { recursive: true });
    write(`${base}/package.json`, JSON.stringify({ name: `@test/${name}` }));
    write(
      `${base}/skills.sh.json`,
      JSON.stringify({ groupings: [{ skills }] }),
    );
    write(
      `${base}/.claude-plugin/marketplace.json`,
      JSON.stringify({
        plugins: [
          {
            name,
            source: "./",
            strict: false,
            skills: skills.map((skill) => `./skills/${skill}`),
          },
        ],
      }),
    );
    for (const skill of skills) {
      write(
        `${base}/skills/${skill}/SKILL.md`,
        `---\nname: ${skill}\ndescription: Check an example document.\nmetadata:\n  version: "1.0.0"\n---\n\nCheck the requested document.\n`,
      );
      write(
        `${base}/skills/${skill}/agents/openai.yaml`,
        `interface:\n  display_name: "Example"\n  short_description: "Check an example document for errors"\n  default_prompt: "Use $${skill} to check this document."\n${name === "posthaste" ? "policy:\n  allow_implicit_invocation: false\n" : ""}`,
      );
    }
  };
  for (const name of collections) {
    collection(
      name,
      name === "posthaste"
        ? [
            "reddit-refresh-token",
            "threads-refresh-token",
            "tumblr-refresh-token",
          ]
        : [],
    );
  }
  return {
    root,
    collection,
    run: (...args: string[]) =>
      spawnSync(process.execPath, [validator, ...args], {
        cwd: root,
        encoding: "utf8",
      }),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("scoped validation ignores an incomplete unrelated skill", () => {
  const setup = fixture();
  try {
    mkdirSync(join(setup.root, "collections/posthaste/skills/incomplete"));
    const result = setup.run("--collection", "idiolect");
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /collections\/idiolect: 0 skill\(s\) valid/);
    assert.doesNotMatch(result.stdout + result.stderr, /posthaste/);
  } finally {
    setup.cleanup();
  }
});

test("full validation rejects cross-collection duplicate names while scoped validation passes", () => {
  const setup = fixture();
  try {
    setup.collection("idiolect", ["example"]);
    const baseline = setup.run();
    assert.equal(baseline.status, 0, baseline.stderr);
    setup.collection("gallimaufry", ["example"]);
    const scoped = setup.run("--collection", "idiolect");
    assert.equal(scoped.status, 0, scoped.stderr);
    const full = setup.run();
    assert.equal(full.status, 1, full.stderr);
    assert.match(full.stderr, /Duplicate skill name example/);
    assert.match(
      full.stderr,
      /collections\/idiolect\/skills\/example\/SKILL.md/,
    );
    assert.match(
      full.stderr,
      /collections\/gallimaufry\/skills\/example\/SKILL.md/,
    );
  } finally {
    setup.cleanup();
  }
});

for (const field of ["id", "type", "title"]) {
  test(`reject legacy skill frontmatter field ${field} without rejecting resource metadata in the body`, () => {
    const setup = fixture();
    try {
      setup.collection("idiolect", ["example"]);
      const path = join(
        setup.root,
        "collections/idiolect/skills/example/SKILL.md",
      );
      const source = readFileSync(path, "utf8");
      writeFileSync(
        path,
        source +
          "\nResource example:\n\n```yaml\nid: RULE001\ntype: rule\ntitle: Resource title\n```\n",
      );
      const baseline = setup.run("--collection", "idiolect");
      assert.equal(baseline.status, 0, baseline.stderr);
      writeFileSync(
        path,
        readFileSync(path, "utf8").replace("---\n", `---\n${field}: legacy\n`),
      );
      const result = setup.run("--collection", "idiolect");
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        new RegExp(`Legacy skill frontmatter field .*${field}`),
      );
    } finally {
      setup.cleanup();
    }
  });
}
