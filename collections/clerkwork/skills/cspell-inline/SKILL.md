---
id: cspell-inline
name: cspell-inline
title: CSpell Inline Document Settings
type: skill
description: Apply CSpell in-document directives to source and documentation files. Use automatically when the user asks to ignore or accept a word in CSpell, disable or enable CSpell/spell checking for a line, next line, section, or file-local pattern, change compound-word checking, select a dictionary for one file, or otherwise requests an inline CSpell setting. Prefer the narrowest supported directive and never invent unsupported CSpell rule-ID suppression.
argument-hint: "<ignore|accept|disable|enable|regex|compound|dictionary> [word|scope|pattern|dictionary]"
metadata:
  version: "1.0.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

## Purpose

Use CSpell's in-document settings for file-local spell-check behaviour. This version is deliberately limited to inline document directives documented at <https://cspell.org/docs/Configuration/document-settings>.

Use this skill automatically when a request means any of the following:

* ignore a word in this file;
* accept a word as valid in this file;
* disable or re-enable CSpell for a line, the next line, or a section;
* ignore or include text by regular expression within one file;
* enable or disable compound-word handling for one file;
* select a named CSpell dictionary for one file;
* add, remove, repair, or review an existing inline CSpell directive.

Requests do not need to name this skill. Phrases such as "ignore this word", "CSpell should ignore this", "disable spellcheck here", "disable CSpell for the next line", or "use the lorem dictionary in this file" are sufficient when the context is CSpell or a CSpell diagnostic.

## Operating rule

Make the smallest inline change that satisfies the request. Do not change project CSpell configuration, dictionary files, editor settings, CI configuration, or package configuration in this version.

Prefer `cspell:` in new directives. If the file already uses another valid CSpell prefix style, preserve the local style rather than creating mixed conventions. CSpell accepts the `cSpell:`, `spell-checker:`, and `spellchecker:` prefixes case-insensitively.

Place the directive in a comment syntax that is valid for the target file type. Preserve surrounding formatting and comment conventions.

## Directive catalogue

### Ignore one or more words

Use when the user explicitly wants CSpell to ignore tokens in this document.

```text
// cspell:ignore foobar bazqux
```

`ignore` applies to the entire file regardless of where the directive appears.

Use `ignore` for tolerated tokens that should not be treated as spelling errors. Do not use it when the user means that a term is valid vocabulary and should participate in suggestions; use `words` for that distinction.

### Accept words as valid vocabulary

Use when the user wants terms considered correct in this document.

```text
// cspell:words AcmeWidget Frobnicator
```

`words` applies to the entire file. Words added this way are considered correct and can participate in suggestions.

### Disable checking for the current line

Use when only the current line should be exempt.

```text
const fixture = "mispellled fixture text"; // cspell:disable-line
```

Prefer this over disabling a larger section when one line is sufficient.

### Disable checking for the next line

Use immediately before the line that should be exempt.

```text
// cspell:disable-next-line
const fixture = "mispellled fixture text";
```

Prefer this when placing an end-of-line directive would make the target line noisy or invalid.

### Disable and re-enable a section

Use paired directives around a contiguous section.

```text
// cspell:disable
const fixtureA = "mispellled fixture text";
const fixtureB = "anotherr fixture";
// cspell:enable
```

Rules:

* close the disabled section as soon as checking should resume;
* do not leave checking disabled to end-of-file unless the user explicitly wants that scope;
* do not nest disable/enable sections; CSpell does not support nesting;
* do not use a section when a line or next-line directive is sufficient.

### Ignore text matching a regular expression

Use for repeated structured text that should not be spell checked.

```text
// cspell:ignoreRegExp /0x[0-9A-F]+/g
```

`ignoreRegExp` applies to the entire file; it does not start at the comment and stop later. CSpell adds `gim` flags when a regular expression is supplied without flags.

Prefer a line comment for regex directives where the target language supports one. Avoid placing a regex directive inside a block comment when the block-comment terminator could become part of the expression.

### Restrict checking to text matching a regular expression

Use only when the user explicitly wants CSpell to check a selected pattern or class of text.

```text
# cspell:includeRegExp #.*
```

`includeRegExp` applies to the entire file. CSpell first finds text matching `includeRegExp`, then removes text matching `ignoreRegExp`, then checks the remainder.

Do not reach for `includeRegExp` when a narrower line, section, or ignore pattern solves the problem.

### Enable or disable compound words

Use for concatenated words such as `errormessage` when the user wants compound-word handling changed for the document.

```text
// cspell:enableCompoundWords
```

or

```text
// cspell:disableCompoundWords
```

This is file-wide. It cannot be toggled by section: the last compound-word setting in the file determines the value for the entire file.

### Select dictionaries for the document

Use named dictionaries for this file when the dictionary is already known to CSpell.

```text
// cspell:dictionaries lorem-ipsum
```

The selected dictionaries apply to the entire file.

Do not define, install, or edit dictionaries in this version of the skill.

## Decision rules

Apply these rules in order:

1. If the user names an exact supported directive, use that directive unless doing so would clearly exceed the requested scope.
2. If the user says "ignore this word" or equivalent, use `cspell:ignore` for the token or tokens, not a broad disable directive.
3. If the user says the word is valid, accepted, correct, or should be suggested, use `cspell:words`.
4. If the request concerns one line, use `disable-line` or `disable-next-line`.
5. If it concerns a contiguous multi-line region, use paired `disable` and `enable`.
6. If it concerns repeated structured text across the file, consider `ignoreRegExp`.
7. Use `includeRegExp` only for an explicit positive-selection requirement.
8. Use compound-word or dictionary directives only when that is the actual requested behaviour.
9. Never widen a local request into project configuration merely because a configuration file exists.

## "Disable a CSpell rule" requests

CSpell's documented inline settings do not provide a generic directive for disabling an arbitrary diagnostic or rule identifier.

When the user says "disable this CSpell rule", inspect the actual problem and translate the intent only when it maps unambiguously to a supported inline mechanism:

* misspelled token the user wants tolerated -> `ignore`;
* token the user wants treated as valid vocabulary -> `words`;
* one line -> `disable-line` or `disable-next-line`;
* section -> `disable` / `enable`;
* repeated pattern -> `ignoreRegExp`;
* dictionary choice -> `dictionaries`;
* compound handling -> `enableCompoundWords` or `disableCompoundWords`.

If the requested rule cannot be represented by a documented inline setting, say that it is not available inline. Do not invent syntax and do not silently disable more spell checking than requested.

## Scope and precedence

In-document CSpell directives are applied after project configuration, overrides, and language settings, so they have the final say for the document.

Do not confuse directive placement with directive scope:

* `disable-line` -> current line;
* `disable-next-line` -> next line;
* `disable` / `enable` -> the section between them;
* `ignore` -> entire file;
* `words` -> entire file;
* `ignoreRegExp` -> entire file;
* `includeRegExp` -> entire file;
* compound-word setting -> entire file, last setting wins;
* `dictionaries` -> entire file.

## Editing existing directives

Before adding a directive:

1. search the document for existing CSpell directives;
2. reuse or extend an existing compatible directive when that produces a clearer file;
3. avoid duplicate words and duplicate directives;
4. preserve the file's existing prefix casing and comment style when practical;
5. keep word lists readable rather than accumulating an unbounded line.

If removing the last item from an inline directive, remove the now-empty directive as well.

## Validation

After editing, run the project's existing CSpell command if one is available and appropriate. Do not introduce a new project-level CSpell setup merely to validate an inline change.

When validation reports unrelated pre-existing spelling findings, report them separately; do not suppress them unless the user requested that work.

## Current boundary and future extensions

This version owns only inline document settings.

Reserve the same skill as the routing point for future CSpell vocabulary/configuration capabilities so users do not need to learn another skill name. Future extensions can add explicit modes such as:

* project words or terms -> project CSpell configuration;
* persistent ignored terms -> project ignore dictionary/configuration;
* phrases -> the appropriate dictionary or CSpell configuration representation;
* custom dictionaries -> dictionary files plus configuration;
* project-wide dictionary enable/disable -> CSpell configuration.

Until those capabilities are implemented, do not convert a project-wide or phrase-level request into an inline directive merely to complete the task. State that the current skill handles inline settings only.

## Canonical reference

The source of truth for supported inline syntax is CSpell's official document-settings documentation:

<https://cspell.org/docs/Configuration/document-settings>
