# Skillwerk

Skillwerk is a monorepo for independently installable agent-skill collections.

The repository owns development tooling, validation, maintenance automation, and releases. Each collection retains its own scope, documentation, versioning, and distribution. Collections must not require other Skillwerk collections to be installed.

* [Architecture](ARCHITECTURE.md)

## Install a collection

Replace `<collection>` with `apparatus`, `clerkwork`, `fettle`, `gallimaufry`, `gazetteer`, `idiolect`, `patternbook`, or `posthaste`:

```sh
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/<collection>/skills --yes
```

Each collection remains self-contained. Collection-specific versions use tags such as `clerkwork/v2.0.0`, and release archives contain one collection only.

## Release a collection

Run the release from the repository root with a clean working tree and `GITHUB_TOKEN_CONTENT_PRIVATE` set:

```sh
npm run release:dry --workspace collections/<collection>
npm run release --workspace collections/<collection>
```

The release covers one collection only:

* The version in `package.json` and in any plugin manifest (`.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`) changes.
* `CHANGELOG.md` lists only commits since the previous `<collection>/v*` tag that change files in `collections/<collection>/`. Commits that change only repository tooling do not appear.
* The release commit is `chore(release): <collection> v<version>`, the tag is `<collection>/v<version>`, and the GitHub release uses the same changelog entry as its notes.

The tag starts the release workflow. It runs `npm run check -- --collection <collection>`, packages the collection, runs the clean-room archive test, and attaches `<collection>.tar.gz` to the release.
