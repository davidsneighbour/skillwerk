import { fingerprint } from "./storage.ts";
import type { FettleConfig, FettleEvent, Finding, RuleId } from "./types.ts";

interface TaggedRule {
  prefix: string;
  rule: RuleId;
  title: string;
  minimum: "one" | "repeated";
}

const rules: TaggedRule[] = [
  {
    prefix: "instruction-conflict:",
    rule: "FTL02",
    title: "Instruction conflict",
    minimum: "one",
  },
  {
    prefix: "user-correction:",
    rule: "FTL04",
    title: "Repeated user correction",
    minimum: "repeated",
  },
  {
    prefix: "skill-invocation:",
    rule: "FTL05",
    title: "Skill invocation failure",
    minimum: "one",
  },
  {
    prefix: "unnecessary-interaction:",
    rule: "FTL06",
    title: "Unnecessary interaction",
    minimum: "repeated",
  },
  {
    prefix: "regression:",
    rule: "FTL07",
    title: "Verified regression",
    minimum: "one",
  },
];

export function detectTagged(
  events: FettleEvent[],
  config: FettleConfig,
): Finding[] {
  const findings: Finding[] = [];
  for (const rule of rules) {
    const groups = new Map<string, FettleEvent[]>();
    for (const event of events) {
      for (const tag of event.tags?.filter((item) =>
        item.startsWith(rule.prefix),
      ) ?? []) {
        const key = fingerprint(rule.rule, event.skill, tag);
        groups.set(key, [...(groups.get(key) ?? []), event]);
      }
    }
    for (const [key, group] of groups) {
      const threshold =
        rule.minimum === "repeated" ? config.detection.repetitionThreshold : 1;
      if (group.length < threshold) continue;
      const first = group[0];
      const last = group.at(-1);
      if (!first || !last) continue;
      findings.push({
        id: "FTL-0000",
        fingerprint: key,
        rule: rule.rule,
        title: rule.title,
        status: "open",
        causality: "established",
        ...(first.skill ? { affectedSkill: first.skill } : {}),
        firstSeen: first.timestamp,
        lastSeen: last.timestamp,
        occurrences: group.length,
        evidence: group.map((event) => event.id),
        summary: `Host evidence explicitly classified ${group.length} event${group.length === 1 ? "" : "s"} as ${rule.title.toLowerCase()}.`,
        proposedInvestigation:
          "Verify the tagged evidence against the applicable instruction and skill version.",
        acceptanceCriteria: [
          "The tagged scenario no longer reproduces.",
          "A regression fixture preserves the corrected behaviour.",
        ],
      });
    }
  }
  return findings;
}
