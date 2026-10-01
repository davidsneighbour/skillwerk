---
id: distil
name: distil
title: Distil
description: Extract the useful core from social-media posts, infographics, carousels, screenshots, articles, slides, diagrams, documents, and other rhetorically presented material. Use when the user asks to distil, extract, or analyse a source, asks what it is actually saying, whether popular advice holds up, or whether anything useful sits underneath marketing or engagement bait. For requests to create a framework or to dive deep into a source, use interrogate-source instead. Not a summarisation skill.
metadata:
  version: "1.0.0"
---

Turn source material into structured, critical, reusable knowledge.

## Purpose

Distil extracts the useful core from popular, social-media, promotional, and other rhetorically presented material.

It first establishes what the source actually says, then separates substantive ideas from rhetoric, presentation, engagement mechanics, repetition, unsupported claims, and artificial novelty. It puts the remaining ideas into appropriate context and, where useful, develops them into a coherent and reusable framework.

Distil is not a summarisation skill.

Its job is to answer:

**What is this actually saying, how much of it survives scrutiny, what context is missing, and what can I use?**

The transformation is: **source → substance → context → structure → system**.

## Use this skill when

Use Distil when the user wants to:

* analyse a social-media post, infographic, carousel, screenshot, article, slide, diagram, document, or supplied text;
* determine whether popular advice or a widely shared claim is actually useful;
* extract substance from rhetoric, marketing, personal branding, or engagement bait;
* critically examine a framework, methodology, model, thread, or list;
* identify what is correct, questionable, misleading, obvious, exaggerated, or genuinely useful;
* put isolated claims into a wider practical or conceptual context;
* identify overlaps, redundancies, assumptions, vague claims, or artificial distinctions;
* reconstruct useful material into a more coherent structure;
* derive underlying patterns, archetypes, or principles;
* turn worthwhile source material into a reusable framework or procedure.

Typical requests include:

* "Distil this."
* "Analyse this."
* "What is this actually saying?"
* "Is this bullshit?"
* "Is there anything useful underneath the marketing?"
* "Tear down the rhetoric."
* "Extract the useful parts."
* "Put this into context."
* "Turn this into something reusable."

For requests to create a framework from a source, or to dive deep into a source, use `interrogate-source` instead.

## Principles

### Preserve before interpreting

Do not silently improve, correct, paraphrase, or restructure source material during capture.

Establish what the source says before analysing what it means.

Keep source content and interpretation distinguishable throughout the analysis.

### State uncertainty

Never invent missing source material.

Explicitly identify:

* illegible or obscured content;
* uncertain transcription;
* ambiguous relationships;
* layout that permits multiple interpretations;
* missing context;
* assumptions required for interpretation.

When confidence is insufficient, mark the uncertainty rather than selecting the most plausible interpretation without qualification.

### Separate substance from rhetoric

Treat the source's presentation as something to analyse, not something to inherit.

Distinguish substantive content from:

* rhetoric;
* branding;
* marketing language;
* personal-brand positioning;
* engagement bait;
* outrage or fear framing;
* motivational framing;
* repetition;
* decorative categorisation;
* false precision;
* superficial distinctions;
* claims of novelty;
* claims of authority without supporting evidence.

Do not assume that categories, terminology, diagrams, headings, or sequences supplied by the source represent meaningful conceptual distinctions.

Test whether they do.

### Context matters

A claim can be technically correct while still being misleading because relevant conditions, limitations, alternatives, history, or trade-offs have been omitted.

Where useful, identify:

* where the idea comes from;
* whether it is established knowledge presented as something new;
* conditions under which it works;
* conditions under which it fails;
* important exceptions;
* competing approaches;
* practical constraints;
* relevant evidence;
* what the source leaves unsaid.

Use external research when the task requires factual verification or broader context and such research is available.

Clearly distinguish source analysis from externally established context.

### Be constructively critical

Do not accept claims merely because the source presents them confidently.

Look for:

* unsupported claims;
* hidden assumptions;
* contradictions;
* missing prerequisites;
* vague terminology;
* category errors;
* overlapping concepts;
* duplicated advice;
* unrealistic promises;
* omitted trade-offs;
* oversimplified causality;
* correlation presented as causation;
* anecdotes presented as general evidence;
* obvious advice repackaged as proprietary insight.

Criticism must be specific.

Do not dismiss material merely because it is simplistic, promotional, popular, or badly presented.

If a useful idea exists underneath weak presentation, preserve it.

### Prefer systems over lists

When the source contains many individual tips, steps, categories, or claims, investigate whether they are manifestations of a smaller number of underlying mechanisms.

Prefer **principles → relationships → process** over **larger and cleaner lists of tips**.

Do not force a framework onto material that does not support one.

## Pipeline

Distil uses seven stages: **Capture → Verify → Assess → Critique → Contextualise → Structure → Operationalise**.

### 1. Capture

Create a faithful representation of the source.

For visual material:

* transcribe all readable text;
* preserve wording;
* preserve meaningful order and hierarchy;
* describe structural relationships that affect interpretation;
* identify relevant non-textual elements.

For textual material:

* preserve the original claims and conceptual structure;
* identify headings, categories, sequences, and relationships before restructuring them.

Formatting may be normalised for readability, but wording and meaning MUST NOT be silently improved.

**Output:** a faithful representation of the source.

### 2. Verify

Assess the reliability of the capture and the limits of what can be inferred from the source.

Identify:

* unreadable or uncertain content;
* ambiguous layout;
* interpretation required to reconstruct relationships;
* missing context;
* information the source assumes but does not provide.

Separate:

* directly observed content;
* reasonable interpretation;
* unresolved ambiguity.

**Output:** a confidence and limitations assessment.

### 3. Assess

Give the user a concise assessment before the detailed analysis.

This is the **quick summary**.

It should answer, in plain language:

* Is there substantial useful content here?
* How much appears sound?
* What is questionable or overstated?
* How much is primarily rhetoric, repackaging, or engagement material?
* Is the source worth examining further?

Do not use a rigid numerical score.

Prefer a short qualitative assessment such as:

> **Quick assessment:** The central idea is sound, but most of the surrounding framework is repackaging. Three of the seven distinctions collapse into the same principle, two claims need important qualifications, and one appears unsupported. There is a useful model underneath it, but not the novel system the presentation suggests.

Or, where appropriate:

> **Quick assessment:** Mostly rhetoric. The source expands one conventional idea into several artificial categories and adds claims it does not substantiate. The underlying principle is useful, but considerably simpler than presented.

Or:

> **Quick assessment:** Broadly sound. The presentation is promotional, but the distinctions are meaningful and the core process survives scrutiny. The main weakness is missing context around when the approach does not apply.

The assessment MUST be justified by the subsequent analysis.

Do not make provocative dismissal a substitute for analysis.

**Output:** a concise qualitative verdict on the material's substantive value.

### 4. Critique

Examine the material on its own terms.

Ask:

* Does the content make logical sense?
* Do its categories represent genuinely different concepts?
* Are multiple items saying substantially the same thing?
* Are claims supported by reasoning or merely asserted?
* What assumptions does the source depend on?
* What context or trade-offs are absent?
* Does terminology clarify the idea or merely make it sound distinctive?
* Is complexity being hidden behind slogans?
* Is obvious advice being presented as proprietary insight?
* Does the proposed process actually lead from its stated inputs to its stated outcome?

Distinguish between:

* substantive insight;
* established knowledge;
* useful simplification;
* reasonable but unsupported claims;
* oversimplification;
* speculation;
* rhetoric;
* marketing;
* engagement bait;
* noise.

**Output:** a critical teardown of the source as presented.

### 5. Contextualise

Place the surviving ideas outside the rhetorical frame supplied by the source.

Determine, where possible:

* what broader concept the idea belongs to;
* whether similar ideas already exist elsewhere;
* whether terminology has been renamed or repackaged;
* what evidence or established knowledge supports it;
* what evidence challenges it;
* where it works;
* where it does not;
* what important qualifications are missing;
* what practical constraints affect its usefulness.

This stage should help distinguish between:

* **a genuinely useful idea**;
* **a genuinely useful idea presented as a revolutionary discovery**;
* **an attractive claim that does not survive scrutiny**.

**Output:** the substantive ideas placed into appropriate wider context.

### 6. Structure

Reconstruct what remains after critique and contextualisation.

Ignore the source's taxonomy where necessary.

Identify:

* conceptual clusters;
* repeated mechanisms;
* dependencies;
* sequences;
* feedback loops;
* inputs;
* transformations;
* outputs;
* constraints;
* recurring archetypes.

Collapse distinctions that do not survive analysis.

Preserve distinctions that materially change how the system behaves.

If appropriate, synthesise the resulting structure into a framework with:

* a clear purpose;
* defined inputs;
* a defined process or flow;
* explicit outputs;
* relevant constraints or conditions.

Do not manufacture a framework when the surviving material does not justify one.

**Output:** the distilled core, expressed in the simplest structure that preserves its actual value.

### 7. Operationalise

Where the distilled material is useful, turn it into something reusable.

Possible outputs include:

* reusable prompts;
* procedures;
* decision trees;
* evaluation questions;
* templates;
* schemas;
* checklists where a checklist genuinely fits the problem.

A generated prompt should normally establish:

* the analytical perspective;
* required input;
* purpose;
* reasoning process;
* required outputs;
* constraints;
* uncertainty handling;
* criteria for challenging weak assumptions.

Do not operationalise material merely because the pipeline contains this stage.

Sometimes the correct conclusion is simply:

**There is nothing here worth turning into a system.**

**Output:** reusable mechanisms where justified.

## Default response structure

For a substantial source, prefer:

1. **Source capture**
2. **Capture limitations**
3. **Quick assessment**
4. **Critical analysis**
5. **Context**
6. **Distilled core**
7. **Reusable framework or prompt**, when justified

The **Quick assessment** should appear near the beginning so that the user does not need to read a complete teardown before learning whether the material is worth their attention.

Adapt the remaining sections to the source rather than mechanically filling every heading.

## Boundaries

Distil MUST NOT:

* silently rewrite the source during capture;
* guess unreadable content;
* preserve source categories merely because they exist;
* mistake polished presentation or popularity for conceptual quality;
* mistake cynicism for critical thinking;
* invent evidence for unsupported claims;
* create artificial distinctions to retain every source item;
* manufacture depth from shallow material;
* manufacture a framework when the source does not support one;
* turn every analysis into generic advice;
* treat criticism as an objective in itself.

The purpose is not to prove that popular material is bad.

The purpose is to determine **what remains after the rhetoric is removed**.

## Style

* Be precise and explicit.
* Prefer depth over volume.
* Avoid generic advice.
* Avoid unnecessary simplification.
* Do not use hype to replace explanation.
* State trade-offs and constraints.
* Mark uncertainty rather than concealing it.
* Keep faithful capture separate from interpretation.
* Prefer coherent systems over collections of tips.
* Use direct language when material is weak.
* Do not soften criticism merely because the source is popular.
* Do not exaggerate criticism merely because the source is promotional.
