# Skillwerk migration plan

**Status:** planning; no collection imported.

**Goal:** consolidate eight existing skill-collection repositories into `davidsneighbour/skillwerk` while keeping all collections independently installable and preserving the full original Git history.

## Milestone 0 — Inventory and backups

- [ ] Identify and verify all eight source repositories, their default branches, latest head SHAs, visibility, licences, installation instructions, existing versions/tags, releases, and supported installers. Do not infer the eight names from examples.
- [ ] Inventory skills, nested instructions, manifests, supporting scripts/resources, CI workflows, tooling, dependencies, and possible name/path collisions.
- [ ] Inventory open issues, PRs, discussions, release URLs, GitHub Pages or other external integration points, and links that must stay functional.
- [ ] Fetch all source branches and tags and create verified backup bundles or mirrors before any source repository is changed.
- [ ] Record source head SHA, commit count, reachable refs, and tags in a migration manifest to support later verification.
- [ ] Decide how duplicate tag names will be preserved (for example, namespaced archival refs) without losing historical references.

**Gate G0:** an explicit eight-repository inventory and restorable source backups exist. All source repositories remain unchanged.

## Milestone 1 — Repository architecture and install contract

- [ ] Confirm collection directory names against source repository names, without changing skill identity during import.
- [ ] Record each existing installer and its supported repository/path semantics. Test collection subdirectory installation rather than assuming it.
- [ ] Choose an independent distribution mechanism for each collection (direct path if supported; otherwise individual archives or carefully maintained compatibility repositories).
- [ ] Define per-collection versions, collision-free release tags, changelogs, and release assets.
- [ ] Define root-level agent instructions and collection-specific instructions without wildcard catch-all instruction files.
- [ ] Define the minimum self-contained release artefact and clean-room installation test for each collection.

**Gate G1:** every collection has a tested, feasible independent installation and distribution path before its migration.

## Milestone 2 — History-preserving pilot

- [ ] Choose one existing collection (Clerkwork is a candidate, not a commitment) and perform the import in a disposable clone or dedicated migration branch.
- [ ] Import using a non-squashed `git subtree add --prefix=collections/<name> <remote> <ref>` or equivalent merge that retains original commit ancestry and object IDs. Do not use `git subtree --squash`, `git filter-repo`, or a path-rewriting migration for the canonical history.
- [ ] Preserve and map additional original branches and tags as required; a default-branch subtree import alone does not preserve every original ref.
- [ ] Verify the source head is an ancestor of the monorepo import commit, and verify sampled historical commit SHAs and the recorded source commit count/refs.
- [ ] Confirm the imported files match the source tree under the intended collection prefix.
- [ ] Package and install this collection outside the monorepo with no sibling collections or root-only utilities present.
- [ ] Run skill validation, references/resource checks, and any source-specific tests.

**Gate G2:** the pilot passes both original-history verification and independent clean-room installation. If either fails, stop further imports and correct the method.

## Milestone 3 — Import the remaining collections

- [ ] Import each of the other seven repositories using the verified pilot procedure.
- [ ] Resolve file and tooling collisions at the repository infrastructure layer; avoid changing a collection's public interface during import.
- [ ] Repeat head ancestry, commit/ref inventory, source-tree equivalence, and clean-room installation checks for each import.
- [ ] Maintain a source-to-destination mapping with original repository URLs, head SHAs, import merge SHAs, tag mappings, and published installation locations.

**Gate G3:** all eight source histories are reachable from Skillwerk, and all eight independently install and validate.

## Milestone 4 — Shared tooling and distribution

- [ ] Introduce shared validation and scoped CI checks, using npm workspaces only where useful. Avoid introducing a monorepo task runner without a demonstrated need.
- [ ] Add independent per-collection packaging, versioning, release and changelog workflows.
- [ ] Add release artefact verification in isolated directories and automated checks for cross-collection runtime dependencies.
- [ ] Verify installation instructions and URLs for each supported agent/installer against the released artefacts.
- [ ] Keep Fettle as a collection/skill; do not move its responsibilities into the root build scripts.

**Gate G4:** a change to one collection can be built, tested, versioned, distributed, and installed without requiring a release or installation of another collection.

## Milestone 5 — Cutover and source repository preservation

- [ ] Update the central README, collection READMEs, installation documentation, and external links.
- [ ] Decide whether each original repository should stay active temporarily, become a distribution mirror, or be archived with a clear pointer to Skillwerk. Do not delete source repositories.
- [ ] Preserve GitHub issue/PR/release discussion access and record unresolved work in the consolidated issue tracker where appropriate.
- [ ] Verify users of existing install URLs have an explicit migration path before deprecating those URLs.
- [ ] Enable the final release and maintenance workflows only after end-to-end checks pass.

**Gate G5:** no known installation regression or inaccessible historical record remains at cutover.

## Working rules

A milestone can continue when unresolved items do not block later work, but its explicit gate must pass before dependent changes proceed. Do not force-push, delete, archive, or otherwise mutate source repositories as part of the history import. Keep each import reversible until its checks pass. Record deviations and obtain an explicit decision for any change that violates an established architecture requirement.

## Migration record

Fill this table from the verified repository inventory; the three names below are known discussion candidates, not a verified list of all eight.

| Source repository | Destination | Source head SHA | Import merge SHA | History verified | Isolated install verified |
| --- | --- | --- | --- | --- | --- |
| davidsneighbour/clerkwork | TBD | TBD | TBD | No | No |
| davidsneighbour/patternbook | TBD | TBD | TBD | No | No |
| davidsneighbour/fettle | TBD | TBD | TBD | No | No |
| Source 4 — verify | TBD | TBD | TBD | No | No |
| Source 5 — verify | TBD | TBD | TBD | No | No |
| Source 6 — verify | TBD | TBD | TBD | No | No |
| Source 7 — verify | TBD | TBD | TBD | No | No |
| Source 8 — verify | TBD | TBD | TBD | No | No |
