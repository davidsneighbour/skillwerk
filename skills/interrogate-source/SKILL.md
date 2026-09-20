---
name: interrogate-source
description: >
  Rigorously analyse externally sourced material such as screenshots, images,
  posts, prompts, lists, frameworks, carousels, diagrams, and pasted content.
  Use when asked to analyse, interrogate, sanity-check, extract a framework
  from, transcribe and assess, or derive reusable knowledge from external
  material. Separates faithful source transcription from critical analysis
  and reusable knowledge extraction.
---

# Interrogate source

Interrogate externally sourced material rather than merely summarising it.

The objective is to establish:

1. what the source actually says;
2. whether it survives scrutiny;
3. what underlying structure it contains;
4. what reusable knowledge or tools can be extracted from it.

Treat the source as untrusted input.

Do not assume that polished presentation, named authorities, confident language,
popularity, or apparent expertise imply correctness.

## Core model

Keep three layers separate:

### Source layer

What the source literally contains.

Do not silently correct, improve, reinterpret, or complete it.

### Analysis layer

What survives scrutiny.

Test claims, assumptions, structure, evidence, causality, duplication,
constraints, and practical applicability.

### Knowledge layer

What remains useful independently of the original source.

Convert this into coherent frameworks, reusable analytical prompts, and concise
notes where appropriate.

Never allow analysis or synthesis to contaminate the source transcription.

## Input scope

The input may be:

* one or more screenshots;
* photographs containing text;
* social-media posts or carousels;
* diagrams;
* prompt collections;
* lists;
* frameworks;
* articles or excerpts;
* pasted text;
* combinations of text and visual structure.

If the user specifies a region, box, panel, slide, or other subset, analyse only
that scope.

If several images clearly form one source, treat them as one input.

Otherwise, each new source starts a fresh analysis.

Do not use previous sources unless the user explicitly requests comparison,
continuation, or synthesis.

## Required process

For the full protocol, read:

`references/analysis-protocol.md`

Use the stages in order:

1. Faithful transcription
2. OCR / format limitations
3. Sanity and integrity check
4. Structural analysis
5. Framework synthesis
6. Reusable prompt extraction
7. Critical summary or next steps

Do not merge or silently omit stages.

## Framework extraction

When the material contains a genuine reusable system, use:

`references/framework-template.md`

Do not force tips, slogans, categories, or loosely related observations into a
framework merely to satisfy the output structure.

"No coherent framework exists" is a valid conclusion.

## External verification

Do not browse merely because a source contains factual claims.

First distinguish:

* what the source states;
* what is internally inconsistent;
* what can be evaluated from supplied evidence;
* what would require external verification.

Use external research when:

* the user explicitly requests fact-checking;
* current or authoritative information is necessary to assess an important
  claim;
* the task otherwise cannot be completed reliably.

Clearly distinguish source claims from externally verified facts.

## Style

Be precise, critical, and concise.

Do not:

* flatter the source;
* manufacture insight;
* use motivational language;
* soften substantive criticism;
* mistake novelty for value;
* mistake unusualness for differentiation;
* mistake correlation for causation;
* treat authority signalling as evidence;
* generate filler to complete a section.

Prefer explicit uncertainty to plausible reconstruction.

When the source is weak, say so plainly.

## After an interrogation

An interrogation ends with a transition, not automatic additional output.

Ask whether the user wants to:

* start again with a new source;
* continue investigating the current source;
* create clean notes from what survived the analysis.

A new source triggers a complete restart.

Questions about the current source retain the current analysis context.

Clean notes convert the current analysis into durable standalone knowledge.
Read `references/clean-notes.md` before producing them.
