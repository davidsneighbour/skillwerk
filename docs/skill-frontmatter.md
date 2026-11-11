# Skill frontmatter

The [Agent Skills specification](https://agentskills.io/specification) defines the portable skill format. Skillwerk uses `name` as the canonical identifier. Do not add the legacy top-level fields `id`, `type`, or `title` to `SKILL.md` frontmatter. Human-facing display names belong in `agents/openai.yaml` under `interface.display_name`.

## Required fields

| Field | Contract |
| --- | --- |
| `name` | A string of 1 to 64 lowercase ASCII letters, digits, and single hyphens, matching the skill directory. No leading, trailing, or consecutive hyphens. |
| `description` | A non-empty string of at most 1024 characters that states what the skill does and when to use it. |
| `metadata.version` | Skillwerk requires an explicitly quoted, stable `MAJOR.MINOR.PATCH` string. Increment it once per coherent commit that changes an existing skill. |

```yaml
---
name: example-skill
description: Check a requested document for a specific class of errors.
metadata:
  version: "1.0.0"
---
```

The specification requires `name` and `description`; the version requirement is repository policy. Removing redundant frontmatter without changing the skill's operating behaviour uses a patch increase.

## Optional fields and extensions

The specification also defines `license`, `compatibility`, `metadata`, and the experimental `allowed-tools` field. Preserve applicable fields when cleaning up frontmatter. Its `metadata` field is a mapping of string keys to string values.

Existing skills also use extensions such as `argument-hint`, `inputs`, `tags`, and `references`. These are not part of the portable specification's field list, and support depends on the consuming tool. This cleanup preserves them; it does not establish their portability or remove other project-specific metadata.

The restriction on `id`, `type`, and `title` applies only to skill frontmatter. Patternbook rule files use rule IDs and titles, and JSON Schema documents use `type` and `title` as schema keywords. Those contracts remain separate.

## Schema and validation

The existing [Fettle skill frontmatter schema](../collections/fettle/skills/fettle/schemas/skill-frontmatter.schema.json) is bundled with Fettle for standalone use. It now requires `name`, `description`, and `metadata.version`, checks their basic value constraints, and rejects the three legacy fields. Other top-level and metadata properties remain allowed. The schema cannot verify the directory name or explicit YAML quotation marks; those require source and filesystem checks.

Fettle permits full Semantic Versioning, including valid prerelease and build identifiers, because it can manage skills outside this repository. Skillwerk's staged version gate applies the narrower stable-version policy above.

The shared validator in `scripts/validate-skills.ts` implements repository skill checks, including name-to-directory matching, description limits, legacy-field rejection, installation manifests, UI metadata, and resource links. It is not driven by the Fettle schema and uses a limited frontmatter parser rather than a complete YAML parser. The schema is therefore not a complete description of every repository check.

Run these commands from the repository root:

```sh
npm run validate:skills
npm run validate:versions
```

The version gate reads staged changes. Full validation remains `npm run check`. A successful automated check does not replace the explicit human acceptance required before committing changes to existing skills.
