# Astro skill consolidation review

Date: 2026-10-27.

## Prepared change

One new `astro` skill in Gallimaufry replaces the proposed separate component, architecture, and migration skills. Its version starts at `1.0.0` because none of the source drafts is tracked in `HEAD`. The README and both discovery manifests register the new skill. Patternbook has no tracked Astro entry to remove, so its existing files remain unchanged. Source stashes remain intact until the user authorises their removal.

## Source drafts

| Stash object | Original draft |
| --- | --- |
| `8cfedd784358fd8d27bd85fbe9b42c05682b62f3` | Patternbook `astro-component` |
| `42c1bbd7a9d84af00fca7379cdd0302b072aea56` | Gallimaufry `dnb-astro-migration-project` and its four references |
| `c7d47100f4e7434eac06dcf19018cd985b308b47` | Gallimaufry `dnb-astro-architecture` |

## Consolidation decisions

* Shared project inspection, version awareness, strict TypeScript, native-first implementation, permissions, verification, and handover rules live in `SKILL.md`.
* Component guidance retains meaningful extraction, local styles and scripts, prop and slot contracts, multi-instance behaviour, accessibility, input boundaries, and rendered verification. It removes mandatory extensive documentation and speculative TODOs in favour of useful documentation and the target project's conventions.
* Architecture guidance retains content authority, typed collections, routing, rendering, islands, styles, assets, server boundaries, and deployment decisions. It removes the Astro 5 baseline, missing root-instruction dependencies, broad framework-island advice, and historical API recipes.
* Migration guidance retains source triage, inventory, parity-first delivery, recoverable source material, bounded route groups, accepted differences, and cleanup after verification. It removes the forced migration branch, compulsory seven-document bootstrap, mandatory GitHub dependency, and automatic agent-instruction rewrites. Plan, status, and starter-prompt assets are optional and self-contained.
* No fixed Astro major is required. The installed project version governs ordinary work; a migration selects a compatible target. Version-sensitive code must be checked against matching official documentation rather than copied from a different major.
* Delegation is optional, requires availability and authorisation, and is limited to independent tasks with file ownership, shared contracts, and evidence. A single agent supports every workflow. The lead agent owns shared decisions, integration, and final parity acceptance.
* No runtime dependency on Patternbook, Clerkwork, or any other collection is introduced. Existing project rules and available tracking tools can be used without becoming mandatory installation dependencies.

## Static scenario review

These are instruction-path reviews, not executed Astro project migrations or independent agent behaviour tests.

| Request | Expected path in the prepared skill | Review result |
| --- | --- | --- |
| Fix one component in an existing Astro project | Entry point and component reference; preserve installed version and existing tracking | No migration bootstrap, framework addition, or delegation is required. |
| Review collections and static or request-time rendering | Entry point and architecture reference; verify APIs for the installed version | No fixed-major upgrade, legacy `hybrid` recipe, or missing local instruction dependency is imposed. |
| Migrate a small site with no external tracker | Migration reference and only necessary local records | Work can proceed after an accepted baseline and plan unless actual repository rules require a tracker. |
| Migrate route groups using several agents | Settle shared architecture and ownership, then delegate independent groups if authorised | Shared configuration remains sequential, and integration and parity acceptance stay with the lead agent. |
| Request only a reusable migration prompt | Migration reference and bundled starter prompt | The requested output does not authorise repository edits. |
| Source and generated site disagree | Migration source decision before replacing implementation | The skill requires evidence and a focused question when the difference controls the result. |

## Validation and limits

The scoped Gallimaufry check passed, including lint, spelling, secret scanning, TypeScript, collection and skill validation, and 17 repository-tooling tests. The collection was packaged, and its archive installed all five skills in a clean project. The review document also passed Markdown and spelling checks. Final staged version and review validation checks the prepared snapshot. The repository test suite covers repository tooling; it does not establish that a future agent will execute every instruction correctly. No Astro application, browser interaction, deployment, or live migration is exercised by this documentation change.

Official Astro TypeScript, content collections, component script, and on-demand rendering documentation was checked while resolving the source conflicts. The merged references link official documentation and require version matching. No framework release snapshot is treated as permanently current.

The user explicitly accepted the final staged Astro skill and requested its commit. Acceptance is recorded in `skill-reviews.json`; [issue #78](https://github.com/davidsneighbour/skillwerk/issues/78) tracks the consolidation. Repository rules require pushing completed commits. No release or stash deletion is part of this task.
