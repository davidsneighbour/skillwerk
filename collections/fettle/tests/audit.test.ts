import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";
import { inspectSkills } from "../scripts/audit.ts";

test("Fettle portable skills pass structural inspection", async () => {
  const inspections = await inspectSkills(
    resolve(import.meta.dirname, "../skills"),
  );
  assert.equal(inspections.length, 5);
  assert.deepEqual(
    inspections.filter((inspection) => !inspection.valid),
    [],
  );
});
