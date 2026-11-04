---
id: scratchpad
name: scratchpad
title: Cross-repository scratch notes
description: Persist a finding from the current conversation as a local scratch note in another repository. Use for requests such as "scratch this to markdownlint-config", "scratch this for markdownlint-config", "/scratchpad into markdownlint-config", "write a scratch file about this in the markdownlint-config repo", or "track this upstream in @dnbhq/markdownlint-config". Applies when scratch, track, or note explicitly means saving a local cross-repository finding for later work.
argument-hint: "[into|to|for] <repository-or-package> [finding]"
metadata:
  version: "1.0.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and apply its meanings for project, project root, skill, and collection, including when invoked directly.

## Invocation and scope

Treat an explicit cross-repository scratch request as authorisation to create a new note. Resolve "this" from the relevant finding in the current conversation. Accept natural-language requests and direct skill calls; a slash prefix is client syntax, not a separate workflow. Do not interpret an ordinary request to take notes or track a GitHub issue as a scratch request without cross-repository scratch intent.

Distinguish the source repository or task, where the finding arose, from the target repository, where the note belongs. Preserve both identities in the note.

## Locate the target

Resolve the target path from the user's request and already available workspace context. Check only that the target repository exists at that path, using directory and Git marker existence checks where needed. Do not read target repository files, package manifests, Git remotes, agent instructions, or existing notes as part of this workflow. If the target is missing or ambiguous, ask one focused question; do not clone a repository, investigate its contents, or use the source repository as a substitute.

## Create the note

Use `scratch/<YYYY-MM-DD>-<short-slug>.md` below the target repository root. Use the current date in the user's timezone when known and a short lowercase hyphenated slug describing the finding. Create `scratch/` if needed.

Always create a new scratch note. Do not read, compare, append to, or update existing notes. Check only whether the proposed file path already exists. If it does, add a numeric suffix to the slug, such as `-2` or `-3`, until the path is unused. Create the file with exclusive creation so that a filename collision cannot overwrite an existing file; if creation reports that the path exists, choose the next suffix and retry.

Write the note from the current conversation and evidence already available. Do not investigate, reproduce, validate, or fix the finding in the target repository. Include enough context for a future agent to understand it without the conversation:

* Title and date.
* Source repository or task, and the affected package or repository.
* Problem observed and expected behaviour.
* Evidence or reproduction details, including relevant files, configuration, commands, outputs, and versions when available.
* Classification: bug, missing feature, documentation issue, compatibility issue, upstream dependency issue, or investigation needed. Mark uncertain classifications as tentative.
* Suggested next investigation step, if known.

Use clear Markdown with one source line per paragraph. Preserve supplied facts and distinguish verified observations from inference or uncertainty. Mark missing expected behaviour or reproduction details as unknown; do not invent them. Include only task-relevant evidence and exclude credentials or unrelated private data.

## Boundaries

The complete target-repository workflow is: check that the repository exists, choose an unused scratch note path, create the scratch directory if needed, and write the new note. Use exclusive creation as described above. Perform no other work in that repository. Do not inspect Git status or ignore rules, run commands from the note, run tests or builds, edit other files, create issues or task records, stage, commit, or push. Preserve all existing files. Do not extend the workflow to gather missing evidence; record unknown details as unknown.

Respect filesystem permissions. If writing fails, report the failure without claiming that the note was saved.

## Result

After a successful write, report the exact absolute path of the new note. No read-back, Git check, or further target-repository action is required. Stop after reporting the result.
