---
id: markdown-formatting
name: markdown-formatting
title: Markdown Formatting
description: Decide whether strict CommonMark or GitHub Flavored Markdown (GFM) rules apply to a Markdown file, then apply the matching instruction set. Use when writing or reviewing Markdown and the target renderer is not obvious from the file name or path alone, or when a user names a specific Markdown flavour or target renderer.
metadata:
  version: "1.0.0"
---

A file's `.md` extension does not say which Markdown flavour applies. A
strict CommonMark parser, GitHub, a static site generator's own renderer
(Hugo/Goldmark, MDX, etc.), and an IDE preview can all disagree on whether
tables, task lists, strikethrough, or bare-URL autolinking are valid. This
skill decides which rule set to apply before writing or reviewing a Markdown
file, instead of guessing from the file extension.

## 1. Determine the target

Ask, or infer from context, what will render the file:

* **GitHub** (README, issue, PR body, this registry's own docs): GFM.
* **A static site generator or docs tool the user names** (Hugo, Jekyll,
  Docusaurus, MkDocs, etc.): check whether it documents itself as
  GFM-compatible; most are. If unsure, ask.
* **A test fixture, spec-compliance check, or a renderer the user explicitly
  says is CommonMark-only**: strict CommonMark, no extensions.
* **Unspecified, and no signal either way**: default to GFM. In practice
  almost everything that renders Markdown today, including GitHub, most
  static site generators, and IDE previews, is GFM-compatible or a superset
  of it, and GFM is a strict superset of CommonMark, so defaulting to it is
  the safer guess.

Only ask the user when the choice changes what is valid syntax for the task
at hand, for example when the draft would use a table, task list, or bare
autolink and a strict CommonMark target would reject it.

## 2. Apply the matching instructions

* Use the [CommonMark specification](https://spec.commonmark.org/) for base syntax and parsing questions.
* For a GFM target, also use the [GFM specification](https://github.github.com/gfm/) for tables, task lists, strikethrough, and autolinks.
* Check the actual project's renderer configuration before using extensions. For a strict CommonMark target, use no GFM-only constructs.

## 3. Prefer the project's linter for style, not spec compliance

Spec files describe what is valid syntax and how ambiguous constructs
resolve; they are not a style guide. If the repository has a Markdown linter
configured (for example `markdownlint` with a `.markdownlint.jsonc` or
`.markdownlint.yml`), run it for house style, formatting, and accessibility
mechanics. Use the spec instructions to resolve genuine parsing questions the
linter cannot answer, such as whether a construct is valid at all, not to
re-derive style rules the linter already enforces.

## Markdown and prose formatting

Do not hard-wrap prose or other block text to a fixed line length.

Write paragraphs as single logical lines and allow the editor to perform visual line wrapping. Do not insert manual line breaks at 80 characters, 100 characters, or any other arbitrary column width.

Manual line breaks are appropriate only when they are semantically required or improve the structure of the source, for example:

* list items
* blockquotes
* tables
* code blocks
* frontmatter
* intentionally line-oriented formats
* content where a line break has semantic meaning

For ordinary Markdown paragraphs, documentation, instructions, explanations, and similar prose, use one source line per paragraph regardless of line length.

Never reflow existing prose solely to satisfy a maximum line length.
