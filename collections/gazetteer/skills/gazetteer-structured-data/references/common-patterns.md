# Common Schema.org patterns

These are modelling patterns, not mandatory property checklists. Use only facts supported by visible content or authoritative project data, and verify version-sensitive terms against the current Schema.org release.

## Organisation and contact

Use `Organization` or the most specific applicable subtype for the organisation itself. Attach contact channels with `contactPoint` / `ContactPoint`, physical addresses with `address` / `PostalAddress`, and public identity URLs with `sameAs` when they genuinely identify the same entity.

Prefer a stable site-wide `@id` such as `https://example.com/#organization` and reference that entity from articles, services, products, locations and pages rather than recreating disconnected organisation objects.

Do not turn a generic contact page into a standalone `ContactPoint` entity without linking the contact point to the organisation or person it serves.

## Local business and locations

For a customer-facing physical business, prefer the most specific `LocalBusiness` subtype supported by the business's actual activity. Useful related types and properties can include:

- `PostalAddress` via `address`;
- `GeoCoordinates` via `geo` when authoritative coordinates exist;
- `OpeningHoursSpecification` via `openingHoursSpecification`;
- `telephone`, `email`, `url` and `image`;
- `priceRange` only when the source provides a meaningful range;
- `areaServed` where the business explicitly serves a wider region;
- `parentOrganization` or `branchOf` relationships when the organisational structure is known.

For multi-location organisations, model the organisation once and each real location separately with its own stable `@id`, address and location-specific facts.

Do not copy headquarters details onto branches merely to fill properties.

## Products and offers

Use `Product` for a product entity and `ProductGroup` when the content genuinely represents a group of product variants. Link commercial terms using `Offer` or `AggregateOffer` as appropriate.

Potentially useful facts include `sku`, `gtin`, `mpn`, `brand`, `image`, `description`, `color`, `size`, `material`, `offers` and product-specific properties supported by the current vocabulary.

Offers can include facts such as `price`, `priceCurrency`, `availability`, `url`, seller and validity dates when the source establishes them.

Never infer stock, price, currency, reviews or ratings. Do not emit stale commercial data from static markup when the visible product page is driven by fresher data.

## Services

Use `Service` when the page describes a service rather than a tangible product. Link the provider with `provider`, service geography with `areaServed`, commercial terms with `offers`, and service classification with appropriate supported properties when project data establishes them.

A service page may also have a `WebPage` node whose `mainEntity` references the `Service` node.

Do not model the service provider itself as the service.

## People and profile pages

Use `Person` for the person. Use `ProfilePage` for a page whose principal purpose is a profile, and connect the page's `mainEntity` to the `Person`.

Potential facts include public name, job title, affiliation, image, URL, public identity links and other properties supported by the current vocabulary.

Do not expose private contact details or infer employment, credentials, honorifics or affiliations from context.

## Articles, news and blog posts

Choose the most specific supported type that matches the publication:

- `Article` for generic editorial articles;
- `NewsArticle` for journalistic/news content;
- `BlogPosting` for blog posts.

Common relationships include `author`, `publisher`, `image`, `datePublished`, `dateModified`, `headline`, `description`, `about`, `mainEntityOfPage` and `isPartOf` where supported and accurate.

Use stable `@id` links to existing `Person` and `Organization` entities instead of embedding contradictory copies.

Do not invent modification dates or use build timestamps as editorial modification dates unless the project explicitly defines them that way.

## Events

Use `Event` or the most specific event subtype supported by the current release. Model venue/location, organisers, performers, offers, start/end dates and attendance mode only from established facts.

For online/hybrid events, check the current vocabulary for the correct attendance/location modelling instead of assuming a physical `Place`.

Do not infer cancellation status, ticket availability or price.

## Website and web pages

A site can use a stable `WebSite` entity and individual pages can use `WebPage` or a justified subtype such as `AboutPage`, `ContactPage` or `ProfilePage`.

Useful relationships include `isPartOf` from page to site, `mainEntity` for the page's principal entity, `about` for significant topics, and `breadcrumb` for the page hierarchy.

Do not create a unique site/organisation identity on every page when stable shared `@id` references are available.

## Breadcrumbs

Use `BreadcrumbList` with ordered `ListItem` entries. Each item should reflect the real user-facing hierarchy and use canonical absolute URLs when a navigable page exists.

Do not fabricate breadcrumb levels that are not represented by the site's information architecture.

## Places

Use `Place` or a more specific subtype for a meaningful physical location that is not necessarily a business. Connect addresses, coordinates, contained locations and relevant entities only where sourced.

A geographic service area is not automatically a physical business location; use the appropriate relationship such as `areaServed` rather than inventing an address.

## Images and video

Use `ImageObject` or `VideoObject` when the media itself is a meaningful entity and the available metadata justifies modelling it. Link media to the entity/page it depicts or belongs to rather than creating isolated objects without context.

Do not invent dimensions, thumbnails, upload dates, duration or licensing metadata.

## Questions, answers and FAQ pages

`Question` and `Answer` can describe genuine question-and-answer content. `FAQPage` should only be used when the page itself is an FAQ page according to the current Schema.org definition.

Schema.org validity and Google rich-result eligibility are separate questions. Do not add FAQ markup solely because an old SEO checklist recommends it.

## Reviews and ratings

Use `Review` and `AggregateRating` only when the source contains real review/rating data that can be represented faithfully. Preserve the reviewed entity and source relationship.

Never manufacture ratings, convert testimonials into numeric reviews without source data, or mark up self-authored promotional claims as independent reviews.

## Jobs

Use `JobPosting` when the page is an actual vacancy. Verify current properties for employer, location/remote status, dates, compensation and application details against Schema.org and the target search consumer's documentation.

Do not mark generic careers pages as individual job postings.

## Discovering less-common opportunities

When content does not fit the patterns above:

1. Identify the real-world entity or relationship in plain language.
2. Search the current Schema.org vocabulary for candidate types.
3. Inspect type ancestry and inherited properties.
4. Check each intended property's expected domain and range.
5. Prefer the narrowest type supported by the evidence.
6. Check whether the term is published, pending, superseded or otherwise version-sensitive.
7. Model the entity only when doing so adds truthful machine-readable meaning.

Examples of content that often warrants vocabulary discovery beyond the common list include vessels, recipes, courses, creative works, datasets, medical/health resources, government/public-service entities, accommodation, tourism attractions, vehicles, software, organisations with specialised subtypes, and domain-specific events.