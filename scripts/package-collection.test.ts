import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const packager = fileURLToPath(
  new URL("./package-collection.ts", import.meta.url),
);

function fixture() {
  const root = mkdtempSync(join(tmpdir(), "skillwerk-package-"));
  const output = join(root, "dist", "idiolect.tar.gz");
  mkdirSync(join(root, "dist"));
  mkdirSync(join(root, "collections", "idiolect"), { recursive: true });
  writeFileSync(
    join(root, "collections", "idiolect", "README.md"),
    "New content\n",
  );
  writeFileSync(output, "Previous archive\n");
  return {
    root,
    output,
    run: (path = process.env.PATH) =>
      spawnSync(process.execPath, [packager, "--collection", "idiolect"], {
        cwd: root,
        env: { ...process.env, PATH: path },
        encoding: "utf8",
      }),
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("failed tar preserves the previous archive and removes partial output", () => {
  const setup = fixture();
  try {
    const bin = join(setup.root, "bin");
    mkdirSync(bin);
    const tar = join(bin, "tar");
    writeFileSync(
      tar,
      `#!${process.execPath}\nconst fs = require('node:fs');\nfs.writeFileSync(process.argv[process.argv.indexOf('-czf') + 1], 'Partial archive');\nprocess.exit(23);\n`,
    );
    chmodSync(tar, 0o755);
    const result = setup.run(bin);
    assert.equal(result.status, 23, result.stderr);
    assert.equal(readFileSync(setup.output, "utf8"), "Previous archive\n");
    assert.deepEqual(readdirSync(join(setup.root, "dist")), [
      "idiolect.tar.gz",
    ]);
    assert.equal(result.stdout, "");
  } finally {
    setup.cleanup();
  }
});

test("failure to start tar preserves the previous archive and cleans up", () => {
  const setup = fixture();
  try {
    const bin = join(setup.root, "empty-bin");
    mkdirSync(bin);
    const result = setup.run(bin);
    assert.notEqual(result.status, 0);
    assert.equal(readFileSync(setup.output, "utf8"), "Previous archive\n");
    assert.deepEqual(readdirSync(join(setup.root, "dist")), [
      "idiolect.tar.gz",
    ]);
  } finally {
    setup.cleanup();
  }
});

test("successful packaging replaces the previous archive with a readable archive", () => {
  const setup = fixture();
  try {
    const result = setup.run();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(
      execFileSync("tar", ["-xOzf", setup.output, "idiolect/README.md"], {
        encoding: "utf8",
      }),
      "New content\n",
    );
    assert.deepEqual(readdirSync(join(setup.root, "dist")), [
      "idiolect.tar.gz",
    ]);
    assert.equal(result.stdout.trim(), join("dist", "idiolect.tar.gz"));
    assert.ok(existsSync(setup.output));
  } finally {
    setup.cleanup();
  }
});
