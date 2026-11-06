---
id: gallimaufry
name: gallimaufry
title: Gallimaufry
description: Route Gallimaufry requests to skills for audience-aware explanations, Astro development, frontend modernisation, source analysis, reference frontmatter, and SCQA message rewrites.
metadata:
  version: "1.0.0"
---

Route the request to the most specific skill below. Read only the selected entry point. These links require the selected skill to be installed; if it is missing, identify it and ask the user to install it. Do not claim to have followed an unavailable skill. Routing does not authorise sending, publishing, or other external changes.

## Routing

* [explain](../explain/SKILL.md): Explain topics, code, documents, or errors for a stated age, knowledge level, or audience, including ELI5 requests.
* [astro](../astro/SKILL.md): Build and review Astro components and architecture, or guide website migrations.
* [baseline-modernise](../baseline-modernise/SKILL.md): Scan frontend source for modern Web Platform candidates with Baseline evidence and separate runtime verification.
* [distil](../distil/SKILL.md): Extract and critically assess the useful core of rhetorically presented source material.
* [dnb-reference](../dnb-reference/SKILL.md): Add or update strict reference frontmatter from supplied HTTP or HTTPS URLs.
* [interrogate-source](../interrogate-source/SKILL.md): Analyse external material in depth, separating transcription, scrutiny, and reusable knowledge extraction.
* [scqa-rewrite](../scqa-rewrite/SKILL.md): Rewrite emails and messages with Situation, Complication, Question, and Answer while preserving meaning and tone.

Use Explain for understanding a topic and SCQA rewrite for restructuring an existing message. A request merely to message someone does not select Explain. Use Distil for critical extraction and Interrogate source for a deeper analysis or reusable framework. For multi-step requests, load each needed skill when its step begins.

If no route fits, state the coverage gap. Ask for clarification only when it is needed to select a workflow.
