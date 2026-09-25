import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { test } from "node:test";
import { detect } from "../scripts/detect.ts";
import type { FettleConfig, FettleEvent } from "../scripts/types.ts";

const config: FettleConfig = {
  version: 1,
  collections: [],
  reportsDirectory: "reports",
  observation: {
    enabled: true,
    rawLogRetentionDays: 7,
    maximumEvents: 100,
    redactKeys: [],
  },
  detection: { repetitionThreshold: 2, overheadToolCallThreshold: 30 },
  github: { publication: "propose" },
  automaticSkillModification: false,
};

test("controlled failure produces repeated-failure and prerequisite findings", async () => {
  const contents = await readFile(
    resolve(import.meta.dirname, "fixtures/controlled-failure/events.ndjson"),
    "utf8",
  );
  const events = contents
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line) as FettleEvent);
  const findings = detect(events, config);
  assert.deepEqual(
    findings.map((finding) => finding.rule),
    ["FTL01", "FTL03", "FTL03"],
  );
  assert.equal(findings[0]?.occurrences, 2);
  assert.equal(findings[0]?.causality, "hypothesis");
});

test("one unclassified failure is only an observation", () => {
  const event: FettleEvent = {
    id: "one",
    timestamp: new Date().toISOString(),
    host: "test",
    executionId: "run",
    kind: "tool-failure",
    outcome: "failure",
    operation: "command",
    error: "failed",
    data: {},
  };
  assert.deepEqual(detect([event], config), []);
});
