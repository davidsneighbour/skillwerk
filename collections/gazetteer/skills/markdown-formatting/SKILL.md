---
name: markdown-formatting
description: Choose the Markdown flavour for the target renderer, apply project formatting conventions, and review Markdown accessibility beyond lint checks. Use when writing or reviewing Markdown for a named or uncertain renderer, or checking image alternatives, headings, links, lists, and emoji in Markdown documents.
metadata:
  version: "1.1.1"
---

A file's extension does not establish its Markdown flavour. Check the target renderer and project conventions before using extensions or changing style.

## Determine the target

* For GitHub documents, issue bodies, and pull request bodies, use GFM and account for GitHub's additional HTML sanitisation.
* For static site generators, documentation tools, MDX, and editor previews, inspect the actual parser, plugins, configuration, and relevant documentation. Do not assume GFM support from the tool category or file extension. Frontmatter, shortcodes, directives, and embedded components are renderer-specific features.
* For an explicit CommonMark-only renderer or a specification fixture, use the declared syntax without GFM-only extensions.
* If the target is unknown, use portable CommonMark constructs where practical. Ask only when a feature needed for the task depends on the unresolved renderer. State any remaining assumption.

## Separate syntax from house style

Use the [CommonMark specification](https://spec.commonmark.org/) for base parsing questions and the [GFM specification](https://github.github.com/gfm/) for its extensions, including tables, task lists, strikethrough, and bare-URL autolinks. Consult the relevant section rather than copying the specifications into project instructions.

Follow project instructions and the configured linter for style choices such as list markers, table alignment, fence characters, and frontmatter format. Language labels on fences are useful style guidance, not a CommonMark syntax requirement. Use a fence long enough to enclose its contents safely; do not impose exactly three backticks when the example contains a closing fence of that length.

Preserve existing compliant style. Do not introduce another rule-ID system or override project conventions with preferences copied from another repository. If requested syntax is unsupported by the target renderer, explain the conflict and use a supported equivalent where possible.

## Review and validate

When checking Markdown accessibility, read [the Markdown accessibility reference](references/accessibility.md). It covers content judgement that syntax and style checks cannot establish, without requiring a browser audit for every document edit.

Inspect the project's installed Markdown lint command and configuration before relying on its coverage. Run the relevant checks for changed files, and inspect the target rendering when extension support, heading structure, HTML handling, or image alternatives are uncertain. A passing linter does not establish correct rendering or accessibility. Report existing unrelated failures and checks that could not be performed.

A review request authorises inspection and recommendations. Apply edits when remediation is requested; preserve supplied meaning and flag missing information rather than inventing it.

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
