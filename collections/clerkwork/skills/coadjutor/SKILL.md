---
id: coadjutor
name: coadjutor
title: Coadjutor
description: Find and compare skills across all eight Skillwerk collections, then route an authorised request to the selected skill or collection router. Use for coadjutor, cross-collection capability discovery, or choosing which Skillwerk skill handles a topic.
argument-hint: "<overview|topic|skill> [request]"
metadata:
  version: "1.0.1"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection.

Coadjutor is the router for all Skillwerk collections. Use [the bundled catalogue](resources/catalogue.md) to discover capabilities without loading every skill. The catalogue is a distribution snapshot, not proof that a skill is installed. Coadjutor installs independently and does not require sibling collections or repository tooling at runtime.

## Discovery

* For bare `coadjutor`, `coadjutor overview`, or help, show all eight collections, their routing entry points where available, and their scope. Offer a topic filter or the full skill list. For an explicit request for all skills, list every catalogue entry grouped by collection.
* For a topic such as `/coadjutor accessibility`, search all collection entries by capability, not just exact names. Recognise ordinary synonyms, abbreviations such as a11y, and obvious spelling errors. List relevant specialist skills with their collection, a short purpose, and the difference between them. Do not present a broad router as another specialist match.
* If exactly one skill fits, explain its purpose and ask, "Should I run it?" A topic or catalogue request alone does not authorise execution.
* If several skills fit, show the options and ask which to use. Recommend the closest match when the wording supports it, but wait for a selection. Do not silently run several skills.
* If no skill fits, say so. Offer the nearest relevant collection only when useful, and explain the capability gap. Never invent a capability or treat a placeholder as an implemented router.

## Handoff

1. Distinguish discovery from execution. If the user explicitly requests execution of a named skill, or has selected a listed skill, proceed without repeating the selection question. For an actionable request with one clear match and explicit execution intent, route directly. If the task remains ambiguous, ask only for the missing choice.
2. Resolve the selected skill from the current session's available skills or its installed entry point. Prefer current verified metadata over this snapshot if they differ. If unavailable, identify its collection and skill name, explain that installation is needed, and stop the handoff. Do not fetch or install it automatically, or claim to have used it.
3. Read and apply the selected skill's complete entry point and its required resources. Preserve the user's original request, target, constraints, and authorised actions. Selection authorises that task, not unrelated publishing, credential changes, or other actions reserved by the target skill.
4. Use the local collection router for collection overviews, its bundled procedures, or routing decisions that need its own rules. Use a specific specialist directly once chosen, avoiding a Coadjutor-to-router-to-Coadjutor loop. Never duplicate the specialist's work inside this skill.

## Examples

* `/coadjutor accessibility`: offer `accessibility-review` (Clerkwork) for frontend implementation and WCAG reviews, `accessible-design` (Patternbook) for interface accessibility rules, and `gazetteer-audit` (Gazetteer) for a broader website audit that includes accessibility. Include narrower relevant skills, such as `markdown-formatting`, when the request concerns that format. Ask which scope the user wants.
* `/coadjutor take a screenshot`: describe `web-screenshot` (Apparatus), then ask whether to run it and obtain a target if missing.
* `/coadjutor run web-screenshot for <URL>`: load the installed skill and hand off the requested capture without another selection question.

## Catalogue maintenance

When adding, renaming, removing, or changing a skill's capabilities, update its local collection router where one exists, then regenerate this bundled catalogue with `node scripts/sync-coadjutor-catalogue.ts` from the Skillwerk repository root. This is a development command, not an installation requirement. Stage new skills and their manifest registrations before regeneration. Check freshness with `node scripts/sync-coadjutor-catalogue.ts --check`. Include the Coadjutor version increase when its bundled catalogue changes.
