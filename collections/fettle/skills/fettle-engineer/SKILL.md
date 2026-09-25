---
name: fettle-engineer
description: Convert an existing evidence-backed Fettle finding into a specific skill improvement or GitHub issue proposal with affected files, benefits, authority constraints, and regression criteria.
---

# Fettle engineer

Start from an existing finding. Do not invent evidence to complete a proposal.

1. Load the finding with `node scripts/fettle.ts engineer <finding-id>` when available.
2. Confirm that the proposed change follows `dogma > rule > instruction`. Report conflicts instead of resolving them silently.
3. Identify the smallest affected file set and explain how each change addresses the evidence.
4. Include expected benefit, risks, applicable rules, and deterministic regression criteria.
5. Prefer clarification or error handling over adding broad rules for one isolated incident.

The output is a proposal. Permission to draft or publish an issue does not grant permission to edit a skill. Follow [governance](../../resources/governance.md).
