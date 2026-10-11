import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { readDotenv } from "./dotenv.ts";

test("dotenv layers retain global keys and override matching keys", async () => {
  const root = await mkdtemp(join(tmpdir(), "posthaste-dotenv-"));
  const home = join(root, "home");
  const cwd = join(root, "project");
  try {
    await mkdir(home);
    await mkdir(cwd);
    await writeFile(
      join(home, ".env"),
      "SHARED=global\nACCOUNT=global\nEMPTY=global\n",
    );
    await writeFile(join(cwd, ".env"), "ACCOUNT=local\nEMPTY=\n");
    assert.deepEqual(await readDotenv("~/.env", { home, cwd }), {
      SHARED: "global",
      ACCOUNT: "local",
      EMPTY: "",
    });
    await writeFile(join(cwd, "selected.env"), "ACCOUNT=selected\n");
    assert.deepEqual(await readDotenv("selected.env", { home, cwd }), {
      SHARED: "global",
      ACCOUNT: "selected",
      EMPTY: "",
    });
    await rm(join(cwd, ".env"));
    assert.equal(
      (await readDotenv("missing.env", { home, cwd })).ACCOUNT,
      "global",
    );
    await mkdir(join(cwd, ".env"));
    await assert.rejects(readDotenv("~/.env", { home, cwd }));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
