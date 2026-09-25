import assert from "node:assert/strict";
import { test } from "node:test";
import { detectTagged } from "../scripts/detect-tagged.ts";
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

function event(id: string, tags: string[]): FettleEvent {
  return {
    id,
    timestamp: new Date().toISOString(),
    host: "test",
    executionId: "run",
    kind: "evidence",
    outcome: "failure",
    operation: "task",
    skill: "example",
    tags,
    data: {},
  };
}

test("direct evidence detects conflicts and regressions", () => {
  const findings = detectTagged(
    [
      event("one", ["instruction-conflict:RULE-1"]),
      event("two", ["regression:FTL-0042"]),
    ],
    config,
  );
  assert.deepEqual(
    findings.map((finding) => finding.rule),
    ["FTL02", "FTL07"],
  );
});

test("correction patterns require repetition", () => {
  assert.equal(
    detectTagged([event("one", ["user-correction:asking-again"])], config)
      .length,
    0,
  );
  assert.equal(
    detectTagged(
      [
        event("one", ["user-correction:asking-again"]),
        event("two", ["user-correction:asking-again"]),
      ],
      config,
    )[0]?.rule,
    "FTL04",
  );
});
