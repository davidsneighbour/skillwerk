import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import test from "node:test";

for (const skill of ["post-into-void", "post-session-into-void"]) {
  const script = new URL(
    `./skills/${skill}/resources/post-mastodon.ts`,
    import.meta.url,
  );
  const run = (args: string[], env: NodeJS.ProcessEnv = {}) => {
    const cleanEnv = { ...process.env };
    delete cleanEnv.MASTODON_ACCESS_TOKEN;
    delete cleanEnv.MASTODON_HOST;
    delete cleanEnv.CROSSPOST_DOTENV;
    return spawnSync(process.execPath, [script.pathname, ...args], {
      encoding: "utf8",
      env: { ...cleanEnv, ...env },
    });
  };

  test(`${skill}: help and dry run need no credentials or provider`, () => {
    assert.equal(run(["--help"]).status, 0);
    const result = run(["--message", "A".repeat(300), "--dry-run"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /No post was published/);
  });

  test(`${skill}: invalid inputs fail before delivery`, () => {
    for (const args of [
      ["--message", "hello", "--min-chars", "1abc"],
      ["--message", "hello", "--max-chars", "1.5"],
      ["--message", "hello", "--image"],
      ["--message", "hello", "--min-chars", "600", "--max-chars", "500"],
      ["--message", " ".repeat(300)],
      ["--message", "A".repeat(300), "--image", "missing.jpg"],
    ]) {
      assert.notEqual(
        run([...args, "--dry-run"]).status,
        0,
        JSON.stringify(args),
      );
    }
  });

  test(`${skill}: dotenv, exact text, and status URL through a local provider stub`, () => {
    const directory = mkdtempSync(join(tmpdir(), "gazetteer-post-test-"));
    try {
      const capture = join(directory, "captured.txt");
      const dotenv = join(directory, "test.env");
      writeFileSync(
        dotenv,
        "MASTODON_HOST=example.test\nMASTODON_ACCESS_TOKEN=test-only\n",
      );
      const stub = join(directory, "npx");
      writeFileSync(
        stub,
        `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
if (!args.includes("--mastodon") || process.env.MASTODON_ACCESS_TOKEN !== "test-only") process.exit(2);
fs.copyFileSync(args[args.indexOf("--file") + 1], process.env.GAZETTEER_TEST_CAPTURE);
console.log("https://npmjs.com/package/example");
console.log("https://example.test/@patrick/123");
`,
      );
      chmodSync(stub, 0o700);
      const message = `  ${"A".repeat(300)}\n`;
      const result = run(["--message", message, "--dotenv", dotenv], {
        PATH: `${directory}${delimiter}${process.env.PATH}`,
        GAZETTEER_TEST_CAPTURE: capture,
      });
      assert.equal(result.status, 0, result.stderr);
      assert.equal(readFileSync(capture, "utf8"), message);
      assert.equal(
        result.stdout.trim(),
        "Published: https://example.test/@patrick/123",
      );
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
}
