---
name: synchwork
description: Synchronize shared maintenance state across the skill collections under collections/ in the Skillwerk repository, using .agents/skills/synchwork/config.json.
---

# Synchwork

Use this skill when asked to synchronize, compare, or maintain shared state across the skill collections in this repository. This covers full checklist runs (see [Checklist](#checklist)) and ad hoc syncs of a single file or folder from one collection to the others (see [Ad hoc path sync](#ad-hoc-path-sync)).

## Project set

All collections live in this repository under `collections/<collection>/`. The authoritative collection list is the `collections` array in `scripts/collections.ts`. Read it at the start of every run. Do not hardcode or assume the list, and do not infer extra collections from other folders.

Shared repository configuration (`.vscode/`, `cspell.json`, Biome, markdownlint, CI, and the poster images in `.github/assets/images/skillwerk/`) exists once at the repository root. It needs no synchronization, and this skill does not touch it.

Agent instruction files (`AGENTS.md`, `CLAUDE.md`) are out of scope. The repository uses the root `AGENTS.md` only.

`.agents/skills/synchwork/config.json` holds the skill's data:

* `meld`: for each collection, the three collections to compare in Meld, in argument order.
* `readme.skip`: collections whose own `README.md` the README task does not touch. They still get a cabinet entry.
* `cabinet`: the ordered entries of the shared cabinet section, one per collection, each with `collection`, `title`, and `description`.

If the user wants a collection added, removed, or described differently, update `config.json` (and `scripts/collections.ts` for a new collection) and confirm the change with the user rather than editing this file.

## Operating rules

* Work in this single repository worktree.
* Start every run by reading the root `AGENTS.md` and, if present, the root `RESUME.md`.
* Preserve unrelated dirty worktree changes.
* Touch only the files needed for the requested synchronization task.
* Do not commit, push, publish, or run mutating external commands unless the user explicitly asks for that action.
* Report skipped steps, blockers, and pre-existing unrelated dirty files.

## Step-based workflow

1. Confirm the project set.
   * Read `scripts/collections.ts` and `.agents/skills/synchwork/config.json`.
   * Verify that `collections/<collection>/` exists for every listed collection.
   * Verify `config.json` agrees with the collection list: every collection has a `meld` entry and a `cabinet` entry, and every name used in `meld`, `readme.skip`, and `cabinet` is a listed collection. Report any mismatch and ask before proceeding with a task that depends on it.
   * Stop and ask if `RESUME.md` describes work that conflicts with the requested synchronization.

2. Inspect current state.
   * Run `git status --short` and identify existing user changes before editing.
   * Note which files the requested task is allowed to modify.

3. Run the synchronization checklist.
   * Complete each relevant task in [Checklist](#checklist).
   * Keep every task narrow: inspect, compute the intended common state, apply only that state, then verify it.
   * If a task would require editing outside its stated files, stop and report the reason before making that broader change.

4. Verify the result.
   * Re-run the task-specific checks.
   * Run `npm run validate:skills`. It already checks that each collection's `skills/` folders and `skills.sh.json` match one-to-one.
   * Re-run `git status --short` and distinguish new edits from pre-existing dirty state.

5. Report the outcome.
   * List the task results by collection.
   * Include counts, hashes, duplicate names, or other concrete evidence from the checks.
   * Mention validation commands run and any commands that could not be run.

## Checklist

### Skill names

Ensure no skill folder has the same name in more than one collection. The repository validators check each collection on its own, so they do not catch this.

1. List the direct child directories of `collections/*/skills/`.
2. Compare directory basenames across all collections.
3. Report any duplicate names with the collections where they appear.
4. If duplicates exist, do not rename anything unless the user explicitly asks for a rename plan or implementation.
5. If no duplicates exist, report that the skill namespace is clear.

### README structure and cabinet section

Keep each collection's `README.md` following the same overall structure, and keep the `## The cabinet of @davidsneighbour's skills` section byte-for-byte identical across collections. Skip every collection listed in `readme.skip`.

1. Read `collections/<collection>/README.md` for each collection not in `readme.skip`.
2. Compare the level-2 heading structure and report drift (missing, reordered, or renamed sections), without rewriting unrelated prose unless the user asks for that.
3. Build the canonical cabinet section from the `cabinet` array in `config.json`, in array order:

   ```markdown
   ## The cabinet of @davidsneighbour's skills

   | Exhibit | Skill |
   | :---: | :--- |
   | [![<title>](<image-url>)](<readme-url>) | **[<title>](<readme-url>):** <description> |
   ```

   * `<readme-url>` is `https://github.com/davidsneighbour/skillwerk/blob/main/collections/<collection>/README.md`.
   * `<image-url>` is `https://raw.githubusercontent.com/davidsneighbour/skillwerk/main/.github/assets/images/skillwerk/<collection>-thumb.png`.
   * Use absolute URLs only. Relative links escape the collection and break once a collection is packaged or installed on its own.
   * Include an entry only if its thumb image exists in `.github/assets/images/skillwerk/`. Report entries left out.
4. Replace the section in each README, from its heading up to the next level-2 heading or end of file, with the canonical section. If a README has no cabinet section, append it at the end.
5. Verify the extracted section is byte-for-byte identical across the synchronized READMEs (compare hashes).
6. Run `npm run lint:markdown`.
7. Report structural differences found outside the cabinet section, and confirm the cabinet section now matches.

### Meld comparison

Compare a collection's files visually against two related collections. The user runs this; it opens the Meld GUI.

* Command: `npm run synchwork:meld <collection>`. It runs `meld collections/<a> collections/<b> collections/<c>` with the three collections listed under `meld.<collection>` in `config.json`.
* Do not launch Meld unless the user asks. When the user wants to compare collections, give them the command to run.
* When a `meld` entry is added or changed, confirm it lists exactly three known collections.

## Ad hoc path sync

Use this mode when the user asks to sync one specific file or folder from one collection to the other collections, rather than running the full checklist. Recognize it from an invocation of the form `sync <path>` (for example, `/synchwork sync scripts/validate.ts`) or an equivalent natural-language request such as "sync `<path>` from clerkwork to the other collections". `<path>` is a single file or folder, relative to a collection root.

This mode touches only the given path in the source and target collections. It does not run the full [Checklist](#checklist) and is not a substitute for it.

### Resolving source and targets

1. Determine the source collection: the one the user names, or else the collection whose folder contains the current working directory or the file open in the editor. If none matches, or the match is ambiguous, stop and ask which collection is the source.
2. Determine the target collections: every other listed collection, unless the user names a subset.
3. Resolve `<path>` against `collections/<source>/`. If it does not exist there, stop and report that there is nothing to sync.

### Procedure

1. Read the source copy of `<path>`: file contents, or the full file tree if it is a folder.
2. For each target collection, resolve the same relative path.
   * If `<path>` does not yet exist in the target, it will be created; no permission is needed.
   * If it exists and its content differs from the source, run `git status --short -- collections/<target>/<path>` first. If the target already has uncommitted changes touching `<path>`, stop and ask for permission before overwriting it. Never overwrite dirty target content silently.
3. Once clear to proceed, copy the source content over:
   * For a file: overwrite the target file with the source file.
   * For a folder: copy every file from the source tree into the corresponding location in the target tree, creating missing directories and overwriting files that exist at the same relative path. Do not delete a file that exists only in the target. This is a merge, not a mirror, unless the user explicitly asks for mirroring.
4. Verify each updated target path matches the source byte-for-byte (per file, when `<path>` is a folder).
5. Report, per target collection, what was created, overwritten, skipped as already identical, or held back pending permission.

## Completion standard

A synchwork run is complete when every requested checklist item has either passed with concrete evidence or has a clearly reported blocker. The final report should make it obvious which collection changed, which checks passed, and which dirty worktree entries were already present before the run.
