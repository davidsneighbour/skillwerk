---
name: fettle
description: Interface to the Fettle skill collection. Use `fettle overview` to list the Fettle workflows, route a concrete request such as `fettle inspect <skill>` or `fettle observe` to the matching Fettle skill, or use `fettle release <skill>` to prepare the release of an individual skill with a validated Semantic Versioning proposal. Fettle identifies the job and hands it off; it does not duplicate the target skill's work.
argument-hint: "<overview|inspect|observe|engineer|prove|steward|release|version> [skill|collection|finding-id]"
metadata:
  version: "1.0.0"
---

# Fettle

Use this skill whenever the user addresses `fettle`, wants to see what Fettle can do, cannot remember a Fettle skill name, wants Fettle to choose the right workflow, or wants to prepare the release of an individual skill.

## Overview

A bare `fettle`, `fettle overview`, `fettle help`, or equivalent request must print the complete catalogue below. Include each skill name and its short description. Do not require the user to remember an exact skill name before showing the overview.

## Catalogue

### Workflows

* `fettle-inspect` — statically audit a skill or collection for structure, clarity, conflicts, dead resources, duplication, portability, and context cost.
* `fettle-observe` — analyse execution events and logs for recurring failures, incorrect skill use, repeated corrections, regressions, and excessive work.
* `fettle-engineer` — convert an existing evidence-backed finding into a skill improvement or GitHub issue proposal.
* `fettle-prove` — test skill behaviour with deterministic fixtures and labelled variable agent-behaviour scenarios.
* `fettle-steward` — audit the health of skill collections: inventory, ownership, dependencies, overlaps, and obsolete assets.

### Router tasks

* `fettle release <skill>` — prepare the release of one skill (see the Skill release section).
* `fettle version <skill>` — audit or propose the `metadata.version` of one skill without the other release steps.

## Routing

1. If the user requests an overview, help, a list of skills, or asks what Fettle can do, show the catalogue instead of asking a clarifying question.
2. If the request clearly matches one workflow, hand off directly to that skill.
3. If multiple workflows remain plausible, list the relevant skills and ask the user to choose only when their intended job cannot be inferred.
4. If a request creates, audits, or changes a skill's version, apply [versioning](instructions/versioning.md) in addition to the target skill.
5. Do not perform the target skill's underlying work inside the router, and do not bypass its confirmation, governance, or safety rules.

## Common command routes

* `fettle inspect`, `fettle audit <skill>`, or `fettle lint <skill>` → `fettle-inspect`
* `fettle observe`, `fettle logs`, or `fettle failures` → `fettle-observe`
* `fettle engineer <finding-id>`, `fettle fix <finding-id>`, or `fettle propose <finding-id>` → `fettle-engineer`
* `fettle prove`, `fettle test <skill>`, or `fettle regression <skill>` → `fettle-prove`
* `fettle steward`, `fettle collections`, or `fettle health` → `fettle-steward`
* `fettle release <skill>` → Skill release section
* `fettle version <skill>` or `fettle bump <skill>` → [versioning](instructions/versioning.md)

Static construction questions belong to `fettle-inspect`. Runtime evidence questions belong to `fettle-observe`. A proposal needs an existing finding; without one, route to `fettle-inspect` or `fettle-observe` first.

## Skill release

A skill release prepares one skill's new `metadata.version`. It is independent of the collection version and of collection release tags in the form `<collection>/v<version>`. Preparing a skill release never runs a collection release, creates a tag, publishes a GitHub release, or pushes.

1. Resolve the skill directory and its collection. Stop and report if the skill does not exist.
2. Route the skill to `fettle-inspect` and report its findings. Route to `fettle-prove` when the skill has deterministic assertions or a known regression. Report unresolved defects before continuing; do not hide them to complete the release.
3. Follow every step of [versioning](instructions/versioning.md): validate the frontmatter against [the schema](schemas/skill-frontmatter.schema.json), lint the quotation style, establish the baseline, and propose `none`, `patch`, `minor`, or `major` with a rationale and the resulting version.
4. Get approval before you change the version. If the proposal is `none`, report it and stop.
5. After approval, update only `metadata.version`, then revalidate the frontmatter and quotation style.
6. Run the collection's checks, for example `npm run check -- --collection <name>` in the Skillwerk repository. Report the result. Do not claim the release is ready if validation or checks fail.
7. Report the old version, the new version, the reason for the increment, the validation and check results, and the remaining manual steps, such as the commit. Commit, tag, or run a collection release only when the user separately asks for it.

## Rules

* Treat `overview` as a discovery operation, not a work operation.
* Follow [governance](../../resources/governance.md): a finding, proposal, or version bump is not permission to edit a skill or publish an issue.
* Fettle includes itself in audits and releases under the same criteria and has no self-modification privilege.
* Never invent a skill that is not in the catalogue.
* If no skill fits, say so rather than forcing the request into the nearest workflow.
