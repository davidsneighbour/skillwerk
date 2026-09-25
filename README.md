# Skillwerk

Skillwerk is a monorepo for independently installable agent-skill collections.

The repository owns development tooling, validation, maintenance automation, and releases. Each collection retains its own scope, documentation, versioning, and distribution. Collections must not require other Skillwerk collections to be installed.

- [Architecture](ARCHITECTURE.md)
- [Migration plan](MIGRATION.md)

> Migration status: all eight collections are imported locally with preserved ancestry and verified isolated packages. External publication and source-repository cutover are pending. See [Migration record](MIGRATION-RECORD.md).

## Install a collection

Replace `<collection>` with `apparatus`, `clerkwork`, `fettle`, `gallimaufry`, `gazetteer`, `idiolect`, `patternbook`, or `posthaste`:

```sh
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/<collection>/skills --yes
```

Each collection remains self-contained. Collection-specific versions use tags such as `clerkwork/v2.0.0`, and release archives contain one collection only.
