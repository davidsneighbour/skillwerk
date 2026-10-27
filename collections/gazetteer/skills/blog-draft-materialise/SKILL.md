---
id: blog-draft-materialise
name: blog-draft-materialise
title: Materialise Blog Draft
type: skill
description: Create or move a blog draft into the configured blog content path using a selected metadata option.
tags:
  - blog
  - metadata
  - publishing
  - writing
  - vscode
inputs:
  - draft
  - selectedOption
  - metadataOptions
  - config.toml
metadata:
  version: "1.0.0"
---

Use this skill after `blog-draft-meta-matter` has produced metadata options and the user has selected one option.

The user may select the option by writing:

```text
option 1
1
use 1
take option 1
```

## Goal

Create or move the blog draft to the configured final path and update the Markdown frontmatter with the selected metadata.

The final file path must come from the repository's publishing config.

## Configuration

Before writing or moving files, inspect the current repository for:

```text
config.toml
```

and read:

```toml
[dnb.publishing]
```

If `config.toml` or `[dnb.publishing]` is missing:

* stop before creating, moving, or editing files
* tell the user that publishing configuration is missing
* refer the user to the `README.md` located next to this `SKILL.md`
* do not guess the final blog path
* do not write to a fallback location

Expected minimum config:

```toml
[dnb.publishing]
content_root = "src/content/blog"
path_pattern = "{year}/{slug}/index.md"
url_pattern = "/blog/{year}/{slug}/"
date_format = "yyyy-MM-dd"
default_draft = true
frontmatter_fields = ["title", "date", "description", "summary", "draft"]
```

Build the target path from:

```text
{content_root}/{path_pattern}
```

Supported placeholders:

```text
{year}
{slug}
```

Use the selected option's slug for `{slug}`.

Use the current date to derive `{year}`, unless the user specifies another date.

## Input handling

The draft may be:

1. the currently open VS Code file
2. a selected text range in VS Code
3. a file path supplied by the user
4. pasted text in the conversation
5. draft text already available from the current context

If the draft already exists as a file, move or copy it to the final path according to the user's wording.

If the user says "move", remove the old draft file after creating the new file.

If the user says "create", "copy", or does not specify, create the new file and leave the old draft untouched.

## Metadata selection

Use the selected option from the previous `blog-draft-meta-matter` output.

Extract:

```text
title
slug
description
summary
```

Use the current date for `date`, unless the user specifies another date.

Use the configured `default_draft` value for `draft`.

Example selected metadata:

```text
title: How to Sync Claude Code Settings in Dotfiles Without Tracking State
slug: how-to-sync-claude-code-settings-dotfiles
description: Sync Claude Code settings with dotfiles while keeping runtime state, caches, history, logs, secrets, and agent memory out of Git repositories.
summary: This post explains how to add a global .claude directory to a dotfiles repository without turning runtime state into source code. It separates authored configuration from caches, logs, transcripts, local state, and agent memory, then shows the decision gates behind a safe allow-list.
```

Example target path:

```text
src/content/blog/2026/how-to-sync-claude-code-settings-dotfiles/index.md
```

## Frontmatter rules

Create or update YAML frontmatter.

Required fields are controlled by `frontmatter_fields` in `[dnb.publishing]`.

Default required fields:

```yaml
title: "..."
date: "YYYY-MM-DD"
description: "..."
summary: "..."
draft: true
```

If the draft already has frontmatter:

* update `title`
* update `date`
* update `description`
* update `summary`
* update `draft`
* preserve unrelated fields unless they conflict with selected metadata
* do not duplicate frontmatter
* keep the body content below the frontmatter unchanged

If the draft has no frontmatter, create it.

## File safety

Before writing:

* verify the target directory exists or create it
* verify the target file does not already exist
* if the target exists, do not overwrite silently
* show the existing path and ask whether to overwrite, rename, or stop
* keep Markdown body content unchanged except for frontmatter insertion or replacement

After writing:

* show the final file path
* show the frontmatter that was written
* mention whether the original draft file was kept, copied, or moved

## VS Code behaviour

When working in VS Code:

* prefer the currently open editor as the draft source when the user refers to "this draft" or "current file"
* prefer selected text only when the user explicitly says to use the selection
* resolve paths relative to the workspace root
* do not write outside the workspace unless the user explicitly provides an absolute path

## Configuration and move safety

Validate the selected slug as a single lowercase, hyphenated path segment. Reject path separators, absolute paths, dot segments, and unresolved placeholders. Resolve the target, including existing symlinks, and verify it stays inside the configured content root and authorised workspace before writing.

Use `date_format` for the selected date; if the format is unsupported or ambiguous, ask before writing. Write only the configured `frontmatter_fields`, using the selected values, and preserve other fields. Escape YAML values with a parser or serializer rather than string interpolation.

Keep the result in draft mode unless the user has explicitly authorised a published state. A configured `default_draft = false` requires that authorisation before writing. Do not commit, push, or deploy as part of materialising a draft.

For a move, verify that the new file contains the complete original body and selected metadata before removing the original. If source and target resolve to the same file, update in place; never delete the source in that case.
