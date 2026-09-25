---
name: fettle-observe
description: Analyse agent execution events and historical logs to find recurring failures, incorrect skill use, repeated corrections, regressions, and excessive work. Use for runtime evidence, not static construction audits.
---

# Fettle observer

Analyse only evidence that the host exposes and the user permits.

1. Select a bounded time range. Use `node scripts/fettle.ts observe --since <duration>` when the Fettle runtime is available.
2. Correlate repeated events by operation, error, execution, and affected skill. Do not convert one failed execution into a defective-skill claim.
3. Apply the deterministic rules in [detection rules](../../resources/detection-rules.md). State when required evidence is unavailable.
4. Distinguish observation, correlation, and causation. Label a suspected cause as a hypothesis unless direct evidence establishes it.
5. Deduplicate against open findings and retain the original finding identity for recurrences.

Follow the [governance and privacy policy](../../resources/governance.md). Do not publish findings or modify a skill without separate authority.
