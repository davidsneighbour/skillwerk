import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { inspectSkills } from "../scripts/audit.ts";

test("Fettle portable skills pass structural inspection", async () => {
  const inspections = await inspectSkills(
    resolve(import.meta.dirname, "../skills"),
  );
  assert.equal(inspections.length, 6);
  assert.deepEqual(
    inspections.filter((inspection) => !inspection.valid),
    [],
  );
});

test("Fettle ignores scratch during discovery and direct inspection", async () => {
  const root = await mkdtemp(join(tmpdir(), "fettle-audit-"));
  try {
    const scratch = join(root, "scratch");
    const nested = join(scratch, "temporary-skill");
    const skill = join(root, "real-skill");
    for (const directory of [scratch, nested, skill]) {
      await mkdir(directory, { recursive: true });
      await writeFile(
        join(directory, "SKILL.md"),
        "---\nname: real-skill\ndescription: A valid skill.\n---\n",
      );
    }
    const inspections = await inspectSkills(root);
    assert.deepEqual(
      inspections.map((inspection) => inspection.path),
      [join(skill, "SKILL.md")],
    );
    assert.deepEqual(await inspectSkills(scratch), []);
    assert.deepEqual(await inspectSkills(nested), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
