---
name: fettle-steward
description: Audit the health of agent skill collections, including inventory, ownership, dependencies, overlaps, obsolete skills, shared resources, and cross-collection consistency.
---

# Fettle steward

Review collections as an ecosystem while preserving their ownership boundaries.

1. Run `node scripts/fettle.ts steward --all` to inventory configured collections when available.
2. Check duplicate names, overlapping responsibilities, undiscoverable resources, dependency direction, and obsolete assets.
3. Treat shared names as leads, not proof of duplicated functionality; inspect semantics before recommending consolidation.
4. Include Fettle in scope under the same criteria. Self-audit does not grant self-modification permission.
5. Return prioritised findings with affected owners, evidence, and safe next actions.

Follow [governance](../../resources/governance.md), especially the separate approvals for issue publication and skill changes.
