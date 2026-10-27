---
id: gazetteer
name: gazetteer
title: Gazetteer
description: Route Gazetteer search visibility and content discovery requests to the matching skill, including content preparation, interface design, confirmed Mastodon publishing, technical SEO, local SEO, content optimisation, website audits, Lighthouse audits, metadata, structured data, entities, locations, service areas, internal linking, crawlability, indexing, and search-result presentation.
metadata:
  version: "1.1.0"
---

Gazetteer: describe it. Place it. Make it findable.

Route search visibility, content preparation, interface work, and confirmed Mastodon publishing to the most specific skill below. Read only the selected entry point. These links require the selected subskill to be installed; if it is missing, identify it and ask the user to install it rather than claiming to have followed it. Routing does not authorise publication or other external changes.

## Routing

* [gazetteer-audit](../gazetteer-audit/SKILL.md): Website audits covering launch readiness, technical SEO, accessibility, security, privacy, and resilience.
* [gazetteer-lighthouse-audit](../gazetteer-lighthouse-audit/SKILL.md): Reproducible Lighthouse measurements for a live HTTP or HTTPS URL.
* [gazetteer-llm-visibility](../gazetteer-llm-visibility/SKILL.md): Readable website content, Markdown alternatives, and measured AI discovery experiments.
* [blog-draft-meta-matter](../blog-draft-meta-matter/SKILL.md): Title, slug, description, and summary options before saving a blog draft.
* [blog-draft-materialise](../blog-draft-materialise/SKILL.md): Create or move a draft with selected metadata using repository publishing configuration.
* [markdown-formatting](../markdown-formatting/SKILL.md): Choose the Markdown flavour and follow the target renderer and project style.
* [gazetteer-voice](../gazetteer-voice/SKILL.md): Edit or review prose in Patrick's voice while preserving meaning and evidence.
* [interface-design](../interface-design/SKILL.md): Product interface direction, hierarchy, tokens, states, and design reviews.
* [interface-engineering](../interface-engineering/SKILL.md): Focused UI implementation and polish for typography, surfaces, motion, and performance.
* [post-into-void](../post-into-void/SKILL.md): Draft a Mastodon post from explicitly supplied text; publish only after confirmation.
* [post-session-into-void](../post-session-into-void/SKILL.md): Draft a Mastodon post from the current session; publish only after confirmation.

For `audit`, use `gazetteer-audit`; for `lighthouse`, use `gazetteer-lighthouse-audit`. For multi-step work, load each needed skill at its step, for example metadata selection before draft materialisation. Distinguish supplied-text posts from session-based posts by the user's chosen source.

If no route fits, state the coverage gap and ask for clarification only when needed to select a workflow.
