import assert from "node:assert/strict";
import { test } from "node:test";
import { normaliseEvent, redact } from "../scripts/capture.ts";
import type { FettleConfig } from "../scripts/types.ts";

const config: FettleConfig = {
  version: 1,
  collections: [],
  reportsDirectory: "reports",
  observation: {
    enabled: true,
    rawLogRetentionDays: 7,
    maximumEvents: 100,
    redactKeys: ["token", "password"],
  },
  detection: { repetitionThreshold: 2, overheadToolCallThreshold: 30 },
  github: { publication: "propose" },
  automaticSkillModification: false,
};

test("redact removes nested configured secrets", () => {
  assert.deepEqual(
    redact(
      { token: "one", nested: { password: "two", safe: true } },
      config.observation.redactKeys,
    ),
    {
      token: "[REDACTED]",
      nested: { password: "[REDACTED]", safe: true },
    },
  );
});

test("normaliseEvent maps host failures", () => {
  const event = normaliseEvent(
    "claude",
    "tool-failure",
    { session_id: "run", tool_name: "Bash", error: "failed" },
    config,
  );
  assert.equal(event.host, "claude");
  assert.equal(event.executionId, "run");
  assert.equal(event.operation, "Bash");
  assert.equal(event.outcome, "failure");
  assert.equal(event.error, "failed");
});
