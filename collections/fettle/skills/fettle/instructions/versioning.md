# Skill versioning

Apply this instruction whenever Fettle creates, audits, or changes a skill's version. The version describes the individual skill's contract and behaviour, not the version of Fettle or its parent collection.

## Metadata contract

Every managed `SKILL.md` MUST contain a `metadata.version` field in its YAML frontmatter:

```yaml
---
name: example-skill
description: What this skill does.
metadata:
  version: "1.0.0"
---
```

* `metadata.version` MUST be a string in Semantic Versioning 2.0.0 format: `MAJOR.MINOR.PATCH`, with optional valid prerelease and build identifiers.
* The YAML value MUST be explicitly quoted with single or double quotes. JSON Schema validates its type and value; Fettle MUST separately lint the source text for quotation marks.
* Validate the parsed frontmatter against `schemas/skill-frontmatter.schema.json`. Unknown metadata keys are permitted so the schema can be extended without invalidating existing skills.
* Keep each skill's version independent of the collection's version and of other skills' versions.

## Selecting the next version

Inspect the actual changes to the skill since its last accepted version. Consider `SKILL.md`, referenced resources, scripts, examples, input/output formats, and invocation conventions when they affect the skill's observable contract.

* **PATCH**: Correct errors, improve wording or documentation, or make internal changes that preserve the skill's observable behaviour and contract.
* **MINOR**: Add backward-compatible capabilities, supported inputs, or workflows while preserving existing contracts.
* **MAJOR**: Break or remove an existing invocation, input, output, guarantee, or other externally observable contract.

Use the highest applicable increment when one change set contains multiple kinds of changes. A small textual diff can be a breaking change; never classify solely by the number of changed lines. Changes that do not affect the released skill may require no increment.

## Fettle workflow

1. Read the current frontmatter, validate it against the schema, and check the explicit quotation style of `metadata.version`.
2. Establish the last accepted version and compare against the relevant Git diff or release baseline. If no trustworthy baseline exists, report that limitation; do not invent change history.
3. Identify the observable changes and propose `none`, `patch`, `minor`, or `major`, with a short rationale and the resulting version.
4. For a missing or invalid version, report the issue and propose an initial version based on the actual release state; do not assume `1.0.0` is always appropriate.
5. Obtain approval before a proposed version change is applied. Do not silently bump versions while auditing or editing a skill.
6. After approval, update only the intended skill version, preserve unrelated frontmatter and formatting, then revalidate the frontmatter and quotation style.
7. Report the old and new versions, the reason for the increment, and the validation result. If a change requires approval under a project's dogma/rule/instruction hierarchy, follow that approval process independently; a version bump is not approval to override a rule.

If validation fails, do not present the version as valid or claim that the update is complete.
