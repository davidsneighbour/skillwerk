---
name: synchwork
description: Synchronize, compare, and maintain shared project state across the local Posthaste, Clerkwork, Idiolect, Gazetteer, and Patternbook projects. Supports full synchronization, individual synchronization targets, arbitrary shared files or sections, and read-only status comparisons.
---

# Synchwork

Use this skill when asked to synchronize, compare, inspect, or maintain shared
project state across these five local repositories:

```text
~/github.com/davidsneighbour/clerkwork
~/github.com/davidsneighbour/gazetteer
~/github.com/davidsneighbour/idiolect
~/github.com/davidsneighbour/patternbook
~/github.com/davidsneighbour/posthaste
```

Keep these paths as the project set for now. Do not infer additional
repositories unless the user explicitly adds them. Do not drop a repository
from this list just because it is currently empty or mid-bootstrap; report it
as not-yet-ready instead of removing it.

## Invocation Modes

Determine the scope from the user's request before doing any synchronization.

Supported modes are:

### Full synchronization

Examples:

```text
/synchwork
/synchwork sync
/synchwork all
```

Inspect all relevant shared state, determine the intended current state for
each synchronization target, then run the full applicable checklist.

Do not assume that the repository containing the skill invocation has the
authoritative version.

A full synchronization must first compare all five repositories and determine
whether another repository contains newer or more complete shared state.

### Single checklist item

Examples:

```text
/synchwork cspell dictionaries
/synchwork vscode settings
/synchwork social poster image
/synchwork README shared section
```

Run only the matching checklist item and the minimum prerequisite checks
required to do it safely.

Do not run unrelated checklist items.

### Ad-hoc synchronization target

The user may request synchronization of a shared item that is not a named
checklist item.

Examples:

```text
/synchwork the section `# Notes` in README.md across the repos
/synchwork package.json#engines across the repos
/synchwork `.github/FUNDING.yml`
/synchwork the `## Development` section in AGENTS.md
```

For an ad-hoc target:

1. Parse the request into:

   * file path;
   * optional section, key, field, block, or other sub-target;
   * target repositories, defaulting to all five;
   * any explicitly stated authoritative source.

2. Inspect only the requested target plus the repository instructions and Git
   metadata needed to determine its state.

3. Determine the intended canonical state using
   [Authority Resolution](#authority-resolution).

4. Modify only that target.

   * For a Markdown section, replace only that section.
   * For a JSON/TOML/YAML key, modify only that key or subtree.
   * For a complete file request, synchronize the complete file.
   * Preserve unrelated content and formatting wherever possible.

5. Verify that the requested target matches across all applicable repositories.

Do not expand an ad-hoc request into a full synchronization run.

### Status

Examples:

```text
/synchwork status
/synchwork st
```

Status is strictly read-only.

Compare shared project state across all five repositories and report drift.
Do not modify any file.

Status should concentrate on material that is intended to be shared between
repositories.

Exclude repository-specific content from generic drift reporting, including:

* `skills/`;
* `skills.sh.json`;
* repository-specific project content;
* repository-specific README prose;
* repository-specific images except assets intentionally replicated across
  the project set;
* `workbench.colorCustomizations`;
* `peacock.color`;
* generated output that is intentionally repository-specific;
* any other item explicitly documented as local to one repository.

Status should include known synchronization targets from this skill and may
also identify other obviously shared files or sections when there is strong
evidence that they are intended to match.

Do not classify files as shared merely because the same pathname exists in
multiple repositories.

## Operating Rules

* Treat the five repositories as separate working trees.
* Start every run by checking each applicable repository's `AGENTS.md` and
  project-root `RESUME.md` if present.
* Preserve unrelated dirty worktree changes in every repository.
* Touch only the files or sub-targets needed for the requested synchronization
  task.
* Do not commit, push, publish, or run mutating external commands unless the
  user explicitly asks for that action.
* Report skipped steps, blockers, and pre-existing unrelated dirty files.
* Never use one repository as the default source merely because the command
  was invoked from that repository.
* Never resolve conflicting shared state by repository ordering.
* Prefer evidence over assumptions.
* A synchronization request means "make the requested shared state agree",
  not "copy the current repository over the others".

## Scope Resolution

Before inspecting content, classify the request as exactly one of:

```text
full
checklist-item
ad-hoc-target
status
```

Then determine the allowed mutation scope.

For example:

```text
/synchwork the section `# Notes` in README.md across the repos
```

has the scope:

```text
mode: ad-hoc-target
file: README.md
target: Markdown section "# Notes"
repositories: all five
mutation scope: that section only
```

Do not modify another README section even if drift is discovered there.
Mention unrelated drift in the report only when useful.

## Authority Resolution

Synchronization frequently involves multiple different versions of the same
shared state. Determine the canonical state before making changes.

### Explicit authority wins

If the user identifies the desired source or content, use it.

Examples:

```text
use the Patternbook version
Posthaste has the correct version
set all five to this value: ...
```

No further authority inference is needed unless the specified state cannot be
used safely.

### Do not use modification time as authority

Filesystem modification times are weak evidence and may result from clones,
rebases, checkouts, formatting tools, or unrelated filesystem operations.

Do not select a canonical state solely from `mtime`.

### Inspect Git history

For each differing candidate, inspect relevant Git history where available.

Useful evidence includes:

```bash
git log -n 10 --follow -- PATH
git log -n 10 -p -- PATH
git blame PATH
```

For a subsection or structured key, inspect commits affecting the containing
file and determine which changes affected the requested target.

Consider:

* commit timestamp;
* commit topology;
* commit message;
* whether the commit intentionally updated the shared state;
* whether later commits reverted or superseded it;
* whether equivalent changes appear in several repositories.

The newest commit is useful evidence, but not automatically authoritative.

### Prefer clearly newer intentional changes

If one candidate can be shown to contain a later intentional update to the
shared item and the others contain older versions, treat the newer state as
canonical unless contradictory evidence exists.

Example:

```text
Patternbook:
  commit A — "add Node 26 to supported versions"

Other repositories:
  older content without Node 26
```

Patternbook is probably authoritative for that target.

### Prefer supersets for additive shared state

For additive data where merging is semantically valid, canonical state may be
a union instead of any repository's exact version.

Examples:

* spelling dictionaries;
* lists of replicated project assets;
* sets of shared references.

Do not use union semantics for prose, configuration values, or other content
where combining versions could change meaning.

### Use consensus as supporting evidence

If four repositories contain identical state and one differs, treat the
four-way consensus as strong evidence, but inspect Git history before
overwriting a plausible newer change in the outlier.

A minority version may be the newest intended state waiting to be propagated.

### Prefer completeness when versions are compatible

If candidates express compatible information but one is clearly more
complete, prefer the complete version when Git history supports it.

Do not silently merge competing prose versions merely because one is longer.

### Detect unresolved conflicts

Authority is unresolved when, for example:

* two repositories contain independently changed prose;
* two different configuration values were introduced intentionally;
* Git history does not establish which state supersedes the other;
* merging the states would require a semantic decision.

In that case:

1. Do not overwrite any candidate.
2. Report the competing states.
3. Identify which repositories contain each state.
4. Show relevant Git evidence.
5. Ask the user to choose the intended state.

Only ask when a genuine semantic decision remains after inspecting available
evidence.

### Record the decision

Every synchronization report involving differing states should state how the
canonical state was selected.

Examples:

```text
Canonical state: Gazetteer version
Reason: updated in commit abc123 on 2026-08-19 after the version present in
the other four repositories.
```

or:

```text
Canonical state: merged union
Reason: dictionary entries are additive; all unique entries from the five
repositories were retained.
```

## Step-Based Workflow

### 1. Resolve scope

Determine whether this is:

* full synchronization;
* one checklist item;
* an ad-hoc target;
* status.

Define exactly which files or sub-targets may be modified.

### 2. Confirm the project set

* Verify that all applicable paths exist after expanding `~`.
* Read each repository's local instructions before changing files.
* Read project-root `RESUME.md` where present.
* If a repository is missing, report it.
* If a `RESUME.md` describes work that conflicts with the requested
  synchronization, report the conflict before modifying that repository.

Do not remove missing or incomplete repositories from the configured project
set.

### 3. Inspect working trees

Run:

```bash
git status --short
```

in each applicable repository.

Identify pre-existing user changes before editing.

Pay particular attention to requested target files. If a requested target
already contains uncommitted changes, inspect them before determining
authority.

Uncommitted changes may represent the newest intended state and must not be
silently overwritten.

### 4. Inspect requested state

Read only:

* the requested synchronization targets;
* metadata necessary to establish authority;
* prerequisite files required by repository instructions.

For a full synchronization, inspect all relevant checklist items.

For status, inspect all known shared targets without changing them.

### 5. Determine canonical state

Apply [Authority Resolution](#authority-resolution).

For each differing target classify the result as one of:

```text
identical
canonical-state-determined
mergeable
conflict-needs-decision
missing
not-applicable
```

### 6. Apply changes

Skip this step entirely for status mode.

For synchronization modes:

* change only requested targets;
* preserve unrelated dirty state;
* preserve repository-specific exceptions;
* do not broaden scope merely because additional drift was found.

### 7. Verify

Run task-specific validation.

Where exact identity is expected, compare the relevant extracted target, not
necessarily the complete containing file.

Examples:

* complete files: compare file hashes;
* Markdown sections: extract sections and compare hashes;
* JSON keys: normalize/extract the requested subtree and compare values;
* assets: compare byte hashes.

Then re-run:

```bash
git status --short
```

and distinguish new changes from pre-existing changes.

### 8. Report

Report:

* requested scope;
* state before synchronization;
* canonical state and why it was selected;
* repositories changed;
* repositories already correct;
* unresolved conflicts;
* validation evidence;
* pre-existing dirty state relevant to the operation.

For a narrow synchronization, keep the report narrow as well.

## Status Workflow

`/synchwork status` is a comparison operation, not a synchronization
operation.

For each known shared target report one of:

```text
OK
DRIFT
MISSING
CONFLICT
NOT READY
```

Suggested report shape:

```text
Shared state
------------

CSpell dictionary           OK
Social poster collection    DRIFT
VS Code shared settings     OK
synchwork package script    DRIFT
README shared section       OK
synchwork skill             DRIFT

Repositories
------------

clerkwork    clean
gazetteer    dirty: README.md
idiolect     clean
patternbook  clean
posthaste    dirty: unrelated-file.md
```

For drift, identify the differing repositories and, when reasonably cheap,
which version appears newer.

Do not report expected differences in repository-specific material as drift.

Status must not:

* modify files;
* normalize formatting;
* regenerate files;
* copy assets;
* update dictionaries;
* repair configuration.

## Checklist

### CSpell Dictionaries

Synchronize `.vscode/dictionary.txt` across all five repositories.

This target uses union semantics.

1. Read each repository's `.vscode/dictionary.txt`.
2. Merge all entries into one wordlist.
3. Remove blank lines and exact duplicates.
4. Preserve distinct case variants when they exist.
5. Sort case-insensitively, with a stable case-sensitive tie-breaker for case
   variants.
6. Write the exact same newline-terminated wordlist back to each
   `.vscode/dictionary.txt`.
7. Verify that all five dictionary files have identical hashes.
8. Run `git diff --check -- .vscode/dictionary.txt` in each repository.
9. Report the final word count and dictionary hash for each repository.

### Skill Names

This is a comparison-only namespace check, not shared synchronized content.

Ensure no skill folder under `skills/` has the same name across the five
repositories.

1. List direct child directories under each repository's `skills/` directory.
2. Compare directory basenames across the full project set.
3. Report any duplicate names with the repositories where they appear.
4. If duplicates exist, do not rename anything unless the user explicitly asks
   for a rename plan or implementation.
5. If no duplicates exist, report that the skill namespace is clear.

Do not include this check in generic `/synchwork status`, because `skills/`
content is repository-specific.

Run it during a full synchronization because it is an explicit cross-project
integrity check.

### Social Poster Image

Synchronize each repository's social poster image:

```text
.github/assets/images/SKILLNAME.png
```

where `SKILLNAME` is that repository's own project name:

```text
posthaste
clerkwork
idiolect
gazetteer
patternbook
```

Also synchronize its `-thumb` variant and generated size variants to the other
four repositories.

Each project's own repository is authoritative for that project's poster
assets unless Git history gives strong evidence that an unpropagated newer
copy exists elsewhere.

1. Locate the current poster image, thumb image, and size-variant assets for
   each repository under `.github/assets/images/`.
2. Compare same-project copies across the five repositories.
3. Determine the canonical poster set for each project using authority
   resolution.
4. Copy each canonical poster set into the corresponding location in all five
   repositories.
5. Verify that each repository now holds all five projects' poster images with
   matching byte content, for every project that has published a poster set so
   far.
6. Report which images were copied, skipped as already identical, missing, or
   involved an authority conflict.

### VS Code Settings

Synchronize shared options in `.vscode/settings.json` across all five
repositories, without touching per-repository theming.

1. Read each repository's `.vscode/settings.json`.
2. Treat these keys as repository-specific:

```text
workbench.colorCustomizations
peacock.color
```

3. Never modify, remove, or synchronize those keys.
4. Compare all remaining keys across the five files.
5. Use authority resolution for differing values.
6. If Git history clearly identifies a later intended shared value, propagate
   it.
7. If competing values remain semantically ambiguous, report the conflict and
   request a decision.
8. Apply the determined common values to all five files while preserving
   repository-specific theming.
9. Verify that all non-excluded keys are identical across the five files.
10. Report synchronized keys, untouched theming keys, and unresolved
    conflicts.

### `synchwork` Package Script

Ensure `package.json` in each repository defines:

```json
"synchwork": "meld ~/github.com/davidsneighbour/clerkwork ~/github.com/davidsneighbour/idiolect ~/github.com/davidsneighbour/posthaste ~/github.com/davidsneighbour/gazetteer ~/github.com/davidsneighbour/patternbook"
```

1. Read the `scripts` block in each repository's `package.json`.
2. The exact command documented above is canonical.
3. Add or correct the `synchwork` entry in all five repositories.
4. Preserve the existing key order and formatting conventions of each
   `package.json`.
5. Report whether the script was added, corrected, or already correct in each
   repository.

### `skills.sh.json`

Keep `skills.sh.json` accurate in each repository.

This is repository-local maintenance, not synchronized shared state.

1. Read each repository's `skills.sh.json` and its `skills/` directory
   listing.
2. Confirm every skill folder present in the repository is represented in a
   grouping.
3. Confirm no grouping references a skill folder that no longer exists.
4. Report additions, removals, or grouping fixes needed per repository.
5. Do not invent new groupings or reorder existing ones unless the user
   explicitly asks for that.
6. Apply only corrections needed to keep that repository's file accurate.

Do not compare the contents of `skills.sh.json` between repositories as if
they should be identical.

Do not include this item in generic `/synchwork status`.

### README Structure and Shared Section

Keep each repository's `README.md` following the same intended overall
structure, while synchronizing only explicitly shared sections.

The currently defined shared section is:

```text
## The cabinet of @davidsneighbour's skills
```

Its heading and contents must be byte-for-byte identical across all five
repositories.

1. Read each repository's `README.md`.
2. Compare heading structure across the five files and report structural drift
   where the structures are intended to correspond.
3. Do not treat repository-specific prose as synchronization drift.
4. Extract the shared cabinet section from its heading up to the next heading
   of the same or higher level, or end of file.
5. Compare candidate versions and inspect Git history.
6. Determine the canonical section using authority resolution.
7. Ensure it contains an entry for every repository that has a poster image
   ready.
8. If compatible additions exist across candidates, merge them rather than
   discarding newer entries.
9. Write the identical canonical section into all five README files.
10. Verify the extracted section is byte-for-byte identical across all five
    repositories.
11. Report structural differences separately from synchronized shared
    content.

An ad-hoc request for another README section overrides this checklist scope.

For example:

```text
/synchwork the section `# Notes` in README.md across the repos
```

must synchronize only that requested section and must not automatically update
the cabinet section.

### `synchwork` Skill Definition

Keep this skill's own definition:

```text
.agents/skills/synchwork/
```

identical across all five repositories.

Because this skill controls synchronization itself, authority must be
determined carefully.

1. Read `.agents/skills/synchwork/SKILL.md` and any supporting files in that
   directory from each repository.
2. Compare content across the five repositories.
3. Inspect Git history for differing copies.
4. Prefer the demonstrably latest intentional revision, even if it exists in
   only one repository.
5. Do not use majority state to overwrite a clearly newer revision.
6. If multiple repositories contain independent, incompatible changes that
   cannot safely be merged, report the conflict and request a decision.
7. Write the canonical definition back to the other repositories.
8. Verify all five copies are byte-for-byte identical.
9. Report which repository supplied the canonical state and which repositories
   were updated.

## Arbitrary Section Synchronization

Markdown section synchronization is a first-class operation.

Given:

```text
/synchwork the section `# Notes` in README.md across the repos
```

perform this procedure:

1. Locate `# Notes` in every `README.md`.
2. Treat its content as extending from that heading through the line before
   the next heading of the same or higher level, or EOF.
3. Record repositories where the section is missing.
4. Compare the extracted sections.
5. Inspect Git history for the section's containing file.
6. Determine which candidate is the intended current state.
7. If one candidate is demonstrably newer, use it.
8. If compatible candidates contain independently added information, merge
   only when doing so is semantically safe.
9. If authority remains ambiguous, do not modify the section.
10. Otherwise replace only that section in each applicable repository.
11. Verify hashes of the extracted sections after synchronization.

The same narrow-scope principle applies to other structured content.

## Completion Standard

A synchwork run is complete when every requested target has either:

* passed with concrete evidence;
* been synchronized and verified;
* been identified as already identical;
* been reported as missing or not applicable; or
* been left unchanged because of a clearly reported unresolved conflict.

A full synchronization must additionally establish the canonical state of each
shared target from the complete five-repository state before propagating
changes.

A narrow synchronization must not broaden into unrelated maintenance.

A status run must not make any changes.

The final report should make it obvious:

* what scope was requested;
* what state differed;
* how canonical state was determined;
* which repositories changed;
* which repositories were already correct;
* what remains unresolved;
* which dirty worktree entries existed before the run.
