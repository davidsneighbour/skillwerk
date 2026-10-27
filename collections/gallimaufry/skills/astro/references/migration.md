# Astro migration

Use this reference for an explicitly requested website migration. Default to preserving the accepted source site's public design, behaviour, content, metadata, URLs, assets, forms, redirects, and deployment behaviour. Record intentional differences separately from verified parity.

## Establish the source and scope

Inspect the source framework, package and build configuration, templates, content, data, static assets, deployment rules, and available generated output. Read existing migration records and relevant issues when present. Do not read ignored or excluded directories, private backups, or unrelated artifacts without authorisation.

Choose the parity source with evidence: maintained source that reproduces the public site, accepted generated output, a live site, or a documented combination. Generated output may be useful when the source build is incomplete; a directory name such as `public` alone does not establish authority. Ask a focused question when competing sources would produce different results. Record the accepted source and date, and preserve a recoverable copy or Git reference before replacing it; do not silently copy secrets or large unrelated trees.

Inventory route groups, canonical and locale URLs, redirects, error pages, feeds, sitemaps, robots, favicons, media, downloads, fonts, styles, scripts, embeds, widgets, forms, third-party services, and deployment requirements. Mark unknowns rather than assuming a feature is unused.

## Plan only the necessary tracking

Follow the repository's existing branch and task-tracking policy. Do not create a migration branch, impose GitHub Issues, or block implementation merely because a preferred tracker is unavailable. Reuse existing project and migration documentation. Create only the missing records needed for the task; a small migration can use one plan with a route table.

For authorised local documentation, use the optional [plan template](../assets/migration/plan.md) and [status template](../assets/migration/status.md) as starting points. Adapt their names and fields to existing conventions, fill known values, and mark remaining unknowns explicitly. Do not overwrite existing records or create or rewrite `AGENTS.md` automatically. Do not create `PROJECT.md`, `ROADMAP.md`, `TODO.md`, or duplicate task authorities solely because this skill was invoked.

If issue-backed tracking is requested or required, read [tracking](tracking.md). If the user requests only a reusable prompt, adapt the [starter prompt](../assets/migration/starter-prompt.md) instead of changing repository files.

## Implement parity in bounded steps

1. Establish the accepted inventory and completion criteria before replacing the current implementation. Select and record the target Astro version, runtime, integrations, output mode, and deployment model. Prefer static generation where it meets parity needs; request-time functionality can justify on-demand routes.
2. Build a representative route and shared layout to validate the approach. Read [architecture](architecture.md) for shared-system decisions and [components](components.md) when implementing components.
3. Migrate coherent route or system groups with explicit file ownership. Preserve URLs, content, assets, and behaviour. Check content encodings, path case, trailing slashes, fragments, metadata, downloads, redirects, and forms.
4. Compare the generated and running result against the accepted source. Record evidence and failures per group rather than treating a successful build as parity.
5. Remove legacy implementation only within authorised scope after affected parity checks pass and the source remains recoverable. For public URLs, record an accepted removal or redirect. Do not delete a route, taxonomy, widget, or CMS integration merely because it appears old or administrative.

Keep redesign, editorial rewrites, broad performance work, new services, and asset-pipeline changes separate unless the user includes them. Do not introduce new accessibility, privacy, or security failures to reproduce the source. Raise discovered material defects, and record how they affect scope or parity acceptance rather than silently claiming they are preserved or fixed.

## Tracking and completion

Use the existing status record, or the optional template, to distinguish inventory, implementation, verified parity, accepted differences, and remaining unknowns. Mark a group verified only with evidence appropriate to its behaviour. Record acceptance of a deliberate difference by the user or other authorised reviewer; an agent's recommendation alone is not acceptance.

For forms, payments, emails, analytics, and third-party integrations, use authorised test modes or local stubs. Migration authorisation does not authorise sending real messages, charging accounts, or altering production services. State what remains untested.

If asked to take in changes from another branch, inspect the changes and dependencies first, and integrate deliberately under the repository's workflow. Do not reset, rebase, or broadly merge merely to update a migration.

Finish with the migrated scope, evidence, accepted differences, unresolved questions, and remaining work. Update the necessary existing records. Commit, push, deploy, or remove migration backups only when authorised.
