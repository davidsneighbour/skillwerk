---
name: fettle-inspect
description: Inspect one or more agent skills for structural correctness, clarity, conflicts, dead resources, duplication, portability, and unnecessary context. Use for static skill audits, not runtime behaviour analysis.
---

# Fettle inspector

Inspect the requested skill or collection without changing it.

1. Identify the applicable instruction hierarchy and collection conventions.
2. Run `node scripts/fettle.ts inspect <path>` from the Fettle repository when available.
3. Review semantic concerns that deterministic checks cannot establish: unclear authority, contradictory requirements, duplicated responsibility, portability assumptions, and excessive context.
4. Separate verified defects from hypotheses. A structural smell is not proof of a runtime failure.
5. Return affected files, evidence, impact, and a testable remediation proposal. Do not modify the skill unless the user separately authorises implementation.

Use the shared [detection rules](../../resources/detection-rules.md) and [governance policy](../../resources/governance.md). Store machine-readable output in `reports/inspector/` when operating inside Fettle.
