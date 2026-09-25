import { detectTagged } from "./detect-tagged.ts";
import { fingerprint } from "./storage.ts";
import type { FettleConfig, FettleEvent, Finding, RuleId } from "./types.ts";

function baseFinding(
  rule: RuleId,
  title: string,
  events: FettleEvent[],
  summary: string,
): Finding {
  const first = events[0];
  const last = events.at(-1);
  if (!first || !last) throw new Error("A finding requires evidence");
  const skill = first.skill;
  return {
    id: "FTL-0000",
    fingerprint: fingerprint(rule, skill, first.operation, first.error),
    rule,
    title,
    status: "open",
    causality: skill ? "hypothesis" : "unknown",
    ...(skill ? { affectedSkill: skill } : {}),
    firstSeen: first.timestamp,
    lastSeen: last.timestamp,
    occurrences: events.length,
    evidence: events.map((event) => event.id),
    summary,
    proposedInvestigation:
      "Inspect the affected workflow and prerequisites before proposing a change.",
    acceptanceCriteria: [
      "The triggering scenario completes without the detected pattern.",
      "A regression test covers the observed evidence.",
    ],
  };
}

export function detect(events: FettleEvent[], config: FettleConfig): Finding[] {
  const findings: Finding[] = [];
  const failures = new Map<string, FettleEvent[]>();
  for (const event of events.filter((item) => item.outcome === "failure")) {
    const key = fingerprint(
      event.skill,
      event.operation,
      event.error?.toLowerCase().replaceAll(/\s+/g, " "),
    );
    failures.set(key, [...(failures.get(key) ?? []), event]);
  }
  for (const group of failures.values()) {
    if (group.length >= config.detection.repetitionThreshold) {
      findings.push(
        baseFinding(
          "FTL01",
          "Repeated tool failure",
          group,
          `The same operation failed ${group.length} times without evidence of a changed approach.`,
        ),
      );
    }
  }

  for (const event of events) {
    const tag = event.tags?.find((item) =>
      item.startsWith("missing-prerequisite:"),
    );
    if (tag) {
      const finding = baseFinding(
        "FTL03",
        "Missing prerequisite",
        [event],
        `Execution failed because a required ${tag.split(":")[1] ?? "prerequisite"} was unavailable.`,
      );
      finding.fingerprint = fingerprint(
        "FTL03",
        event.skill,
        tag,
        event.operation,
      );
      finding.causality = "established";
      findings.push(finding);
    }
  }

  const executions = Map.groupBy(events, (event) => event.executionId);
  for (const [executionId, group] of executions) {
    if (group.length > config.detection.overheadToolCallThreshold) {
      const finding = baseFinding(
        "FTL08",
        "Excessive execution overhead",
        group,
        `Execution ${executionId} emitted ${group.length} events, above the configured threshold.`,
      );
      finding.fingerprint = fingerprint("FTL08", executionId);
      finding.causality = "unknown";
      findings.push(finding);
    }
  }
  findings.push(...detectTagged(events, config));
  return findings;
}
