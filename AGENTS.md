# Repository instructions

## Scope

This repository contains eight independently installable skill collections under `collections/`. Keep collection runtime files self-contained. Do not add runtime imports from sibling collections or root-only tooling.

Ignore `scratch/` in all cases unless an explicit instruction names it. Do not read, search, edit, or reference its contents. Keep it excluded from all tooling configuration, such as Biome, cspell, markdownlint, secretlint, and TypeScript.

## Development

Use npm, ESM, and strict TypeScript. Run `npm run check` before committing shared changes. Run `npm run check -- --collection <name>` for one collection.

Preserve imported source history and `refs/archive/<collection>/...`. Use collection-prefixed release tags in the form `<collection>/v<version>`.

## Issues and commits

Every commit must refer to a GitHub issue. Work from an existing issue, or create an issue when you commit. The issue must explain what needs to be done and what the end result looks like. Refer to the issue in the commit message footer with `Refs #<number>`, or with `Closes #<number>` when the commit completes the issue.

Package upgrades do not need an issue. Package maintenance, such as adding overrides or constraints to fix Dependabot alerts, needs an issue.

Use the labels that are configured in the GitHub repository (`gh label list`). If a necessary label from one of the taxonomies (`type:`, `status:`, `resolution:`, `prio:`, or `meta:`) is missing, ask whether to create it. Do not create labels without confirmation.

Always work on the `main` branch. Do not create branches unless explicitly asked. Commit finished tasks when the changes are coherent and do not need amendments.

## Collection changes

Follow a collection's own `AGENTS.md` for files within that collection. Package with `npm run package -- --collection <name>`. The resulting archive must contain only that collection and must install without files from the repository root or sibling collections.
