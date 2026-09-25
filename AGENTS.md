# Repository instructions

## Scope

This repository contains eight independently installable skill collections under `collections/`. Keep collection runtime files self-contained. Do not add runtime imports from sibling collections or root-only tooling.

## Development

Use npm, ESM, and strict TypeScript. Run `npm run check` before committing shared changes. Run `npm run check -- --collection <name>` for one collection.

Preserve imported source history and `refs/archive/<collection>/...`. Use collection-prefixed release tags in the form `<collection>/v<version>`.

## Collection changes

Follow a collection's own `AGENTS.md` for files within that collection. Package with `npm run package -- --collection <name>`. The resulting archive must contain only that collection and must install without files from the repository root or sibling collections.
