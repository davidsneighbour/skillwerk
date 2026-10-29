---
id: gazetteer-structured-data
name: gazetteer-structured-data
title: Structured data
description: Find Schema.org opportunities in website content and implement accurate JSON-LD. Use for schema markup, structured data, rich-result markup, LocalBusiness, Organisation, ContactPoint, Product, Service, Article, Event, Person, Place, breadcrumbs, and unusual content that may map to a Schema.org type.
metadata:
  version: "1.0.0"
---

Find meaningful Schema.org opportunities in real page content, model them as linked entities, and add accurate JSON-LD without inventing facts.

This is not a fixed checklist of rich-result types. The common patterns below are fast paths. Always inspect the actual content and use the Schema.org vocabulary to identify more specific or unusual types when the page warrants them.

## Source of truth

Read [the Schema.org reference](references/schema-org.md) before implementing or changing markup when exact type/property support matters.

The bundled reference pins Schema.org **30.1 (2026-09-16)** as the release used when this skill was authored. It also records the authoritative locations for the current published release, release history, developer documentation, machine-readable vocabulary files, and validation.

Do not assume the pinned release is still current. When network access is available, check `https://schema.org/version/latest` or `https://schema.org/docs/releases.html` before relying on version-sensitive vocabulary. Use the stable release data for vocabulary semantics; use search-engine documentation separately for rich-result eligibility.

## Workflow

### 1. Inspect before modelling

Inspect the content, page template, route data, existing structured data, and any site-wide entity data that feed the rendered page.

Identify:

- the page's primary subject;
- named people, organisations, businesses, brands, products, services, places, events, articles, media and other entities;
- contact information, addresses, opening hours, prices, offers, dates, authorship and relationships;
- navigation hierarchy and breadcrumbs;
- reusable site-wide entities already represented elsewhere;
- existing JSON-LD, Microdata or RDFa that could conflict or duplicate facts.

Do not start from a desired rich result and work backwards. Start from facts actually present in the source or authoritative project data.

### 2. Build an opportunity inventory

For every plausible entity or relationship, record:

- source fact(s);
- candidate Schema.org type;
- more specific subtype if one exists;
- useful properties supported by the content;
- stable canonical URL or `@id` where available;
- confidence: `high`, `medium`, or `low`;
- whether implementation is safe now or requires missing/ambiguous data.

Implement high-confidence opportunities. Resolve medium-confidence cases from project data or authoritative sources when available. Do not emit low-confidence claims merely to increase schema coverage.

### 3. Resolve types from the vocabulary

Use the common-pattern table as a starting point, not a whitelist. If the content describes something outside it, search the current Schema.org vocabulary for the most specific applicable type and inspect its inherited properties, expected value types, supersession status and extension status.

Prefer a specific valid subtype over a generic parent when the facts support it. Examples: use a suitable `LocalBusiness` subtype rather than `LocalBusiness`, or `NewsArticle` rather than `Article`, when the content clearly establishes that distinction.

If no specific type is justified, use the closest accurate parent type or leave the entity untyped rather than guessing.

### 4. Design a connected entity graph

Prefer one coherent JSON-LD block with `@context: "https://schema.org"` and `@graph` when a page contains multiple related entities.

Use stable absolute `@id` values so entities can be referenced rather than duplicated. A useful convention is the canonical entity URL plus a fragment, for example:

- `https://example.com/#organization`
- `https://example.com/locations/phuket/#localbusiness`
- `https://example.com/products/widget/#product`
- `https://example.com/articles/example/#article`

Link entities using properties such as `publisher`, `author`, `brand`, `provider`, `seller`, `location`, `areaServed`, `mainEntity`, `about`, `isPartOf`, `breadcrumb`, `offers` and `contactPoint` when the relationship is supported by the content.

Do not repeat the same organisation or person as several disconnected objects when a shared `@id` can express identity.

### 5. Implement in the source layer

Add JSON-LD where the project's architecture can generate it reliably from source data. Prefer reusable typed helpers/components for repeated page classes instead of hand-maintained literal blocks on each page.

Requirements:

- output valid JSON-LD in `<script type="application/ld+json">`;
- use absolute canonical URLs for public identifiers and linked pages;
- escape/serialise data safely rather than concatenating JSON strings;
- keep generated values synchronised with the visible page and canonical project data;
- keep implementation idempotent: do not add duplicate graphs on repeated runs;
- preserve existing valid structured data unless consolidation improves correctness;
- do not expose private or non-public data simply because it exists in the repository.

Follow the framework's established head/layout/component conventions. For static-site generators, prefer build-time generation from the same data used to render the visible content.

### 6. Validate at three levels

1. **JSON/JSON-LD syntax** — parse the emitted data and inspect the rendered HTML.
2. **Schema.org semantics** — validate types and properties with the Schema.org validator and current vocabulary.
3. **Consumer eligibility** — if the goal includes a Google or other search feature, check that consumer's maintained documentation and test tools separately.

A Schema.org-valid graph can be ineligible for a rich result. A rich-result warning does not necessarily make otherwise useful Schema.org data invalid.

### 7. Report omissions and uncertainties

When useful markup cannot be added because the content lacks a required fact, report the missing fact rather than inventing it. Examples include an unknown price currency, unsupported aggregate rating, uncertain legal business name, ambiguous event location, or unverifiable opening hours.

## Common opportunity patterns

Read [common patterns](references/common-patterns.md) for modelling guidance and implementation cautions.

| Content | Common Schema.org starting point |
| --- | --- |
| Site/company identity | `Organization`, a more specific `Organization` subtype, `Brand` |
| Contact details | `ContactPoint`, `PostalAddress`, linked from the relevant `Organization` or `Person` |
| Physical business/location | most specific `LocalBusiness` subtype, `Place`, `GeoCoordinates`, `OpeningHoursSpecification` |
| Person/profile | `Person`, `ProfilePage` |
| Product/catalogue item | `Product`, `ProductGroup`, `Offer`, `AggregateOffer`, `Brand` |
| Service | `Service`, provider entity, `Offer`, `areaServed` |
| Article/news/blog content | `Article`, `NewsArticle`, `BlogPosting` |
| Event | `Event` or a more specific subtype, `Place`, `Offer`, `Organization`/`Person` |
| Page hierarchy | `BreadcrumbList`, `ListItem` |
| Site/page identity | `WebSite`, `WebPage` and specific page subtypes such as `AboutPage`, `ContactPage`, `ProfilePage` |
| Images/video | `ImageObject`, `VideoObject` |
| Job vacancy | `JobPosting` |
| Questions and answers | `Question`, `Answer`; use `FAQPage` only when the page genuinely matches that type |
| Reviews/ratings | `Review`, `AggregateRating` only from real, visible, attributable review data |

This table is intentionally incomplete. Schema.org contains many domain-specific types. Inspect unusual content for additional opportunities rather than forcing it into one of these rows.

## Guardrails

- Never fabricate ratings, reviews, prices, stock status, addresses, dates, credentials, relationships or identifiers.
- Do not mark hidden or absent content solely for search engines.
- Do not add `FAQPage`, `HowTo`, review or other markup merely because it once produced a rich result.
- Do not confuse Schema.org vocabulary support with Google Search feature support.
- Do not use a generic type when a more specific type is clearly established.
- Do not over-model incidental words. Model meaningful entities and relationships, not every noun on the page.
- Do not create disconnected duplicate entities with conflicting facts.
- Do not rely on examples as a substitute for checking the current vocabulary.
- Treat `pending.schema.org` terms as non-final and use them only deliberately.
- Preserve provenance: every material claim in JSON-LD must be traceable to visible content or authoritative project data.

## Output expectations

When auditing only, return an opportunity inventory grouped into:

1. existing markup and issues;
2. high-confidence additions;
3. opportunities blocked by missing/ambiguous facts;
4. consumer-specific rich-result considerations, if relevant.

When asked to implement, make the source changes, validate the rendered JSON-LD where tooling permits, and summarise the entities/types added plus any deliberately omitted opportunities.