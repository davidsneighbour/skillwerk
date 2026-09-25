# Skillwerk architecture

## Purpose and boundaries

Skillwerk is a single development repository for eight independently scoped agent-skill collections. Repository consolidation must not turn the collections into one package or make any collection depend on another.

The repository owns shared development tooling, validation, CI, maintenance automation, and release orchestration. Each collection owns its skills, resources, scripts required at runtime, documentation, manifest if needed, release version, and installation artefacts.

Fettle remains a skill or skill collection. It may inspect, audit, and propose maintenance changes, but it is not the monorepo's build system, release manager, or CI infrastructure.

## Required invariants

1. **Independent installation:** users can install one collection without cloning, downloading, or installing any other collection.
2. **No required collection dependencies:** a collection's distributed contents must not import or require files from sibling collections or monorepo-only paths. Optional interoperability must degrade cleanly when other collections are absent.
3. **Self-contained releases:** package and test each collection outside the working monorepo, using only its release artefact and explicitly documented external prerequisites.
4. **Independent versioning and releases:** changing one collection does not require releasing all others. A shared tooling change can validate many collections without triggering unnecessary releases.
5. **Preserved Git history:** import the complete original commit ancestry of each of the eight source repositories without squash or history rewrite. Keep original commit IDs where possible and verify reachability after import. Preserve existing branch and tag metadata separately where required.
6. **Source continuity:** retain original repository URLs and their GitHub issues, PR conversations, releases, and references at least through the transition. Do not delete or archive the source repositories before inventory, imports, distribution checks, and link strategy are complete.
7. **Explicit rules:** root-level project requirements govern shared work; narrower collection instructions must comply with them. Conflicts are surfaced for an explicit decision rather than silently overridden.
8. **Scoped work:** CI and agent tasks should inspect only affected collections where practical, while repository-wide checks remain available.

## Proposed layout

```text
skillwerk/
├── AGENTS.md
├── ARCHITECTURE.md
├── MIGRATION.md
├── README.md
├── collections/
│   ├── <collection-a>/
│   │   ├── README.md
│   │   └── skills/
│   └── <collection-b>/
│       ├── README.md
│       └── skills/
├── packages/                 # Optional shared development-time utilities
├── scripts/                  # Repository maintenance and release tooling
└── .github/workflows/        # CI and independent collection releases
```

Names, exact collection directories, existing configuration, and any additional files will be set from the source repository inventory. The layout is a target, not a reason to rename or restructure skills during history import.

Shared packages are development-time dependencies only. They must not leak into a collection's installation artefact unless their required runtime files are bundled into that collection.

## Installation and release contract

- Document the supported installation mechanism for every collection before migration, including currently used repository URLs and whether the installer supports a repository subdirectory.
- Preserve each collection's existing user-facing installation workflow, or provide and verify an explicit compatible replacement before switching.
- Produce one independently addressable release artefact per changed collection, with a collection-specific version/tag namespace to prevent collisions.
- Validate the actual published artefact in a clean directory. Check that skill metadata, entrypoints, referenced resources, scripts, and licences are present and that no relative link escapes the collection.
- Decide distribution URLs, installer syntax, and compatibility mirrors only after testing the installers. Do not assume arbitrary GitHub subdirectory installation is supported.

## History and repository metadata

Use a non-squashed, non-rewriting Git import, normally `git subtree add --prefix=collections/<name> <source-remote> <source-ref>` **without** `--squash`. The subtree merge makes original commits reachable from the monorepo and keeps their object IDs. The original commits retain their historical root paths; the new prefixed layout appears in the import merge. Path-limited history traversal may need `git log --follow` or an explicit source commit/ref, so verify both ancestry and per-collection browsing.

GitHub issues, PRs, comments, stars, releases, branch protection, and Actions history are not Git commit objects and do not migrate with subtree. Inventory those separately and retain the original repositories as reference archives or compatibility endpoints as appropriate. Do not rewrite source history merely to obtain prettier path-specific logs.

## Change management

A collection is the default unit of release. Shared tooling may coordinate checks, packaging, and releases, but release decisions are based on changed distributed files or explicit maintenance releases. A change crossing multiple collections must still honour each collection's independence and release policy.
