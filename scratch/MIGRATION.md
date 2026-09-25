# Skillwerk migration plan

**Status:** migration implemented, verified, and published at version 2.0.0; manual source-repository follow-up remains.

**Goal:** consolidate eight existing skill-collection repositories into `davidsneighbour/skillwerk` while keeping all collections independently installable and preserving the full original Git history.

## Milestone 0 — Inventory and backups

- [x] Identify and verify all eight source repositories, their default branches, latest head SHAs, visibility, licences, installation instructions, existing versions/tags, releases, and supported installers. Do not infer the eight names from examples.
- [x] Inventory skills, nested instructions, manifests, supporting scripts/resources, CI workflows, tooling, dependencies, and possible name/path collisions.
- [x] Inventory open issues, PRs, discussions, release URLs, GitHub Pages or other external integration points, and links that must stay functional.
- [x] Fetch all source branches and tags and create verified backup bundles or mirrors before any source repository is changed.
- [x] Record source head SHA, commit count, reachable refs, and tags in a migration manifest to support later verification.
- [x] Decide how duplicate tag names will be preserved (for example, namespaced archival refs) without losing historical references.

**Gate G0:** an explicit eight-repository inventory and restorable source backups exist. All source repositories remain unchanged.

## Milestone 1 — Repository architecture and install contract

- [x] Confirm collection directory names against source repository names, without changing skill identity during import.
- [x] Record each existing installer and its supported repository/path semantics. Test collection subdirectory installation rather than assuming it.
- [x] Choose an independent distribution mechanism for each collection (direct path if supported; otherwise individual archives or carefully maintained compatibility repositories).
- [x] Define per-collection versions, collision-free release tags, changelogs, and release assets.
- [x] Define root-level agent instructions and collection-specific instructions without wildcard catch-all instruction files.
- [x] Define the minimum self-contained release artefact and clean-room installation test for each collection.

**Gate G1:** every collection has a tested, feasible independent installation and distribution path before its migration.

## Milestone 2 — History-preserving pilot

- [x] Choose one existing collection (Clerkwork is a candidate, not a commitment) and perform the import in a disposable clone or dedicated migration branch.
- [x] Import using a non-squashed `git subtree add --prefix=collections/<name> <remote> <ref>` or equivalent merge that retains original commit ancestry and object IDs. Do not use `git subtree --squash`, `git filter-repo`, or a path-rewriting migration for the canonical history.
- [x] Preserve and map additional original branches and tags as required; a default-branch subtree import alone does not preserve every original ref.
- [x] Verify the source head is an ancestor of the monorepo import commit, and verify sampled historical commit SHAs and the recorded source commit count/refs.
- [x] Confirm the imported files match the source tree under the intended collection prefix.
- [x] Package and install this collection outside the monorepo with no sibling collections or root-only utilities present.
- [x] Run skill validation, references/resource checks, and any source-specific tests.

**Gate G2:** the pilot passes both original-history verification and independent clean-room installation. If either fails, stop further imports and correct the method.

## Milestone 3 — Import the remaining collections

- [x] Import each of the other seven repositories using the verified pilot procedure.
- [x] Resolve file and tooling collisions at the repository infrastructure layer; avoid changing a collection's public interface during import.
- [x] Repeat head ancestry, commit/ref inventory, source-tree equivalence, and clean-room installation checks for each import.
- [x] Maintain a source-to-destination mapping with original repository URLs, head SHAs, import merge SHAs, tag mappings, and published installation locations.

**Gate G3:** all eight source histories are reachable from Skillwerk, and all eight independently install and validate.

## Milestone 4 — Shared tooling and distribution

- [x] Introduce shared validation and scoped CI checks, using npm workspaces only where useful. Avoid introducing a monorepo task runner without a demonstrated need.
- [x] Add independent per-collection packaging, versioning, release and changelog workflows.
- [x] Add release artefact verification in isolated directories and automated checks for cross-collection runtime dependencies.
- [x] Verify installation instructions and URLs for each supported agent/installer against the released artefacts.
- [x] Keep Fettle as a collection/skill; do not move its responsibilities into the root build scripts.

**Gate G4:** a change to one collection can be built, tested, versioned, distributed, and installed without requiring a release or installation of another collection.

## Milestone 5 — Cutover and source repository preservation

- [x] Update the central README, collection READMEs, installation documentation, and external links.
- [ ] Decide whether each original repository should stay active temporarily, become a distribution mirror, or be archived with a clear pointer to Skillwerk. Do not delete source repositories.
- [x] Preserve GitHub issue/PR/release discussion access and record unresolved work in the consolidated issue tracker where appropriate.
- [x] Verify users of existing install URLs have an explicit migration path before deprecating those URLs.
- [x] Enable the final release and maintenance workflows only after end-to-end checks pass.

**Gate G5:** no known installation regression or inaccessible historical record remains at cutover.

## Working rules

A milestone can continue when unresolved items do not block later work, but its explicit gate must pass before dependent changes proceed. Do not force-push, delete, archive, or otherwise mutate source repositories as part of the history import. Keep each import reversible until its checks pass. Record deviations and obtain an explicit decision for any change that violates an established architecture requirement.

## Migration record

Fill this table from the verified repository inventory; the three names below are known discussion candidates, not a verified list of all eight.

| Source repository | Destination | Source head SHA | Import merge SHA | History verified | Isolated install verified |
| --- | --- | --- | --- | --- | --- |
| davidsneighbour/apparatus | `collections/apparatus` | `51785d30422c8f6c2095acf999c1d35eee1791c4` | `0067cb9ca812a7e39f7a604ab6d6caca71daf100` | Yes | Yes |
| davidsneighbour/clerkwork | `collections/clerkwork` | `e5a87032d6df2a7cdb9e281e1a9d0f6b855d6d13` | `d4b201ea707850dbc54fdda4cc691225563f5f18` | Yes | Yes |
| davidsneighbour/fettle | `collections/fettle` | `d7b9d918449b904bfc332ae716369ef80b34ef8b` | `4ed50240be59fbf4ca1fd629c25bf4f674e2b252` | Yes | Yes |
| davidsneighbour/gallimaufry | `collections/gallimaufry` | `9ef19740f65c2083b89f83786bc9dd1a858aced0` | `811f67737d27428a736f720fb1383e3841da028f` | Yes | Yes |
| davidsneighbour/gazetteer | `collections/gazetteer` | `78e0cb57a7fed047d26392eb4e052d0df33bf3f4` | `f4ecd35e471dd20ffff430038db7fa4672575f72` | Yes | Yes |
| davidsneighbour/idiolect | `collections/idiolect` | `bb10f22d8014921655455618434ffb81ed04e867` | `bff924f886fc5d1874654aa6b75fd8a30712d05b` | Yes | Yes |
| davidsneighbour/patternbook | `collections/patternbook` | `634341049447488d89db871e3bf8901c2224ac87` | `78ffdd9a372116374b5867ea16135133bce9abf8` | Yes | Yes |
| davidsneighbour/posthaste | `collections/posthaste` | `e374b30ac1bb477bf4d76d4a9a5178cfc50b0392` | `81ea17494a1771e76e3130fa1289668bd9329890` | Yes | Yes |
