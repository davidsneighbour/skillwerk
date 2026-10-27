# Astro architecture

Use this reference for project-wide rendering, content, routing, and shared-system decisions. Follow the baseline and shared rules in the skill entry point.

## Inspect the existing boundaries

Map routes and layouts, content sources and schemas, integrations, client islands, API endpoints, environment boundaries, assets, and deployment adapters. Identify which parts build ahead of time and which need request-time state. Preserve working architecture unless the requested change provides a concrete reason to alter it.

## Rendering and routing

Prefer static output for content that can be generated at build time. Use on-demand rendering for concrete request-time needs, with an adapter supported by the deployment environment. Check the installed version's output and route options rather than copying historical `hybrid` configuration. Verify dynamic parameters, static route generation, canonical paths, trailing slashes, redirects, error status codes, and locale handling when affected.

Keep ordinary navigation unless client-side routing solves a stated need. When a client router is already present or deliberately added, test script initialisation, cleanup, persistent state, focus, and navigation events across repeated visits. Do not add a router merely to animate transitions.

## Content and types

Use one canonical source for content, public data, and derived metadata. Choose content collections and loaders where schema validation and typed queries help. Inspect the project's content configuration before moving files or replacing a legacy collection API.

Verify loader, schema, and import syntax for the installed version. Current documentation and older Astro examples can use different schema imports; do not mix versions. Preserve entry identifiers, references, dates, draft filtering, and generated URLs when changing a content model. Test representative invalid input and missing references where the project has validation fixtures.

Extend the project's strict TypeScript setup rather than replacing it with `base`. Inspect generated type includes and environment declarations before removing or regenerating files. Generated Astro types do not imply that authored environment declarations are obsolete.

## Browser and server boundaries

Keep credentials, privileged API calls, and private data on the server. Review rendered HTML, serialized props, client bundles, static exports, and public assets for exposure when changing a boundary. Validate endpoint input and handle upstream failures explicitly. Do not invent an Astro-specific fetch or caching API without verifying that it exists in the installed version.

Use framework islands only for concrete interactions. Choose hydration timing from when the interaction must work, not from a blanket directive. Keep state local where possible; use an established shared store or explicit events when islands must communicate.

## Styles, assets, and delivery

Retain the existing styling authority. Scope component-specific CSS, and keep global styles in the shared entry point. Check the installed Tailwind and Astro integration model before changing configuration; do not mix integration recipes from different major versions.

Use Astro image capabilities where they fit the source and deployment model. Preserve meaningful alternative text, dimensions, responsive sizing, and above-the-fold loading priorities. Do not lazy-load every image. Keep metadata, feeds, redirects, sitemaps, and structured data derived from canonical content where practical.

Verify route output, build artifacts, server behaviour where applicable, and browser interactions affected by the architecture change. Document material decisions and rejected alternatives only when they help future maintenance.

## Official sources

* [Project structure](https://docs.astro.build/en/basics/project-structure/)
* [TypeScript](https://docs.astro.build/en/guides/typescript/)
* [Content collections](https://docs.astro.build/en/guides/content-collections/)
* [On-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
* [View transitions and client routing](https://docs.astro.build/en/guides/view-transitions/)
