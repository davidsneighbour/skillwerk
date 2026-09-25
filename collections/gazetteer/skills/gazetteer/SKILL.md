---
id: gazetteer
name: gazetteer
title: Gazetteer
description: Route Gazetteer search visibility and content discovery requests to the matching skill, including technical SEO, local SEO, content optimisation, website audits, Lighthouse audits, metadata, structured data, entities, locations, service areas, internal linking, crawlability, indexing, and search-result presentation.
---

Gazetteer: describe it. Place it. Make it findable.

Use this as the router for Gazetteer skills. Match the user's requested mode,
then invoke or follow the most specific skill.

## Scope

When this skill is filled in, it should cover search visibility and content
discovery work, including:

* technical SEO
* local SEO
* content optimisation
* metadata
* structured data
* entities
* locations and service areas
* internal linking
* crawlability and indexing
* search-result presentation

## Routing

Use these modes when the user names them directly or clearly asks for the
matching work:

* `audit`: use `$gazetteer-audit` for comprehensive website, launch readiness,
  technical SEO, accessibility, security, performance, privacy, resilience,
  internationalisation, and agent-readiness audits.
* `lighthouse`: use `$gazetteer-lighthouse-audit` for reproducible Lighthouse
  data collection against a live HTTP or HTTPS URL.

If no mode fits, explain that Gazetteer does not yet define a dedicated
workflow for the request, and ask for the target task or desired audit type.
