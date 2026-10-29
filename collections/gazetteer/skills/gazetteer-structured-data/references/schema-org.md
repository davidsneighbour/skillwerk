# Schema.org sources

Use Schema.org itself as the authority for vocabulary semantics. Treat search-engine documentation as a separate authority for consumer-specific eligibility and presentation.

## Pinned release

This skill was authored against **Schema.org 30.1**, published **2026-09-16**.

- Release summary: https://schema.org/version/30.1
- Portable release data: https://github.com/schemaorg/schemaorg/tree/main/data/releases/30.1
- Release listing: https://schema.org/docs/releases.html

Release 30.1 provides the full core and extension definitions in portable formats including JSON-LD, Turtle, N-Triples and Quads. Use these files when machine-readable vocabulary inspection is preferable to individual term pages.

The pinned release is a reproducible reference, not a permanent claim that 30.1 is the newest version.

## Find the current release

When network access is available, check one of these before version-sensitive work:

1. https://schema.org/version/latest — current published release summary.
2. https://schema.org/docs/releases.html — release history, newest first.
3. https://github.com/schemaorg/schemaorg/blob/main/versions.json — machine-readable current version and release log.
4. https://github.com/schemaorg/schemaorg/tree/main/data/releases — published portable release directories.

If the current release is newer than 30.1, use the current release to decide whether a type/property is valid now while retaining 30.1 as this skill's pinned baseline until the skill itself is deliberately updated.

Do not use the development/staging vocabulary as though it were a published release unless the user explicitly wants experimental terms.

## Developer documentation

Authoritative developer entry point:

- https://schema.org/docs/developers.html

It documents release data, machine-readable term definitions and Schema.org's development conventions. Individual term pages on `https://schema.org/<Term>` remain useful for human-readable definitions, inheritance, property ranges and examples.

## Validation

- Schema.org Validator: https://validator.schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results

Use the Schema.org Validator for vocabulary/markup validation. Use consumer-specific tools only when consumer-specific search features matter.

## Update protocol for this skill

When updating the pinned baseline:

1. Confirm the newest published version from `https://schema.org/version/latest` and `https://schema.org/docs/releases.html`.
2. Confirm the matching directory exists under `https://github.com/schemaorg/schemaorg/tree/main/data/releases/<version>`.
3. Review release notes for changed, added, superseded or promoted terms that affect this skill's common patterns.
4. Update the pinned version and publication date in this file and `../SKILL.md`.
5. Review `common-patterns.md` against the new release; do not merely change the version number.
6. Keep the links for discovering the current release so future agents do not treat the pinned version as evergreen.