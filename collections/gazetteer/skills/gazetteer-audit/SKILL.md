---
id: gazetteer-audit
name: gazetteer-audit
title: Gazetteer Site Audit
description: Audit a live website, staging deployment, or web project against a comprehensive checklist. Use for launch readiness, website quality reviews, technical SEO, accessibility, security headers, well-known URIs, agent readiness, performance, privacy, resilience, or internationalisation audits that require an evidence-backed report and prioritised remediation tasks.
---

## Gazetteer site audit

Perform a comprehensive, non-mutating audit against the checklist in `references/checklist.json`.

## Inputs

Accept any combination of:

* A live or staging URL.
* A local repository or project directory.
* A page list, sitemap, route inventory, or deployment preview.
* Requested categories, page types, locales, or environments.
* Existing Lighthouse, accessibility, security, analytics, or monitoring reports.

Infer available targets from the conversation and working directory. Ask one concise question only when no usable target exists.

## Read before auditing

Read:

1. `references/checks/`
2. `references/audit-methods.md`
3. `references/report-template.md`

Treat the bundled checklist as a dated snapshot. When internet access is available, compare it with the canonical checklist at `https://specification.website/checklist/`. Note additions, removals, or changed status levels in the report. Do not silently replace the bundled snapshot.

## Operating rules

* This is a non-mutating quality gate. Do not change project files, configuration, infrastructure, DNS, or production data unless the user separately requests fixes.
* Do not install dependencies, launch intrusive scanners, submit forms that create data, authenticate as another person, or probe beyond normal browser and HTTP behaviour without explicit permission.
* Never mark an item as passed from assumption, framework convention, or absence of an obvious failure.
* Record concrete evidence: URL, route, file, line, selector, response status, response header, screenshot reference, command output, or reproducible interaction.
* Separate the checklist's status level from remediation priority. "Required" is a source classification, not automatically a legal conclusion.
* Treat emerging conventions and optional features as contextual. Do not penalise a site for an item that is genuinely not applicable.
* Legal and policy checks may identify missing or inconsistent implementation, but must not claim legal compliance.
* Accessibility automation is partial. Include keyboard, focus, zoom, motion, media, error handling, and assistive-technology considerations as manual review where direct verification is unavailable.
* Performance lab results are snapshots. Distinguish lab data from field or RUM data.

## Result states

Assign exactly one state to every applicable checklist item:

* **Pass**: direct evidence demonstrates the requirement.
* **Fail**: direct evidence demonstrates a defect or contradiction.
* **Partial**: implementation exists but is incomplete, inconsistent, or fails on some sampled pages.
* **Manual review**: the item applies but cannot be concluded with available tools or access.
* **Not applicable**: the item does not apply; state why.
* **Blocked**: the item applies but required access, environment, data, or tooling is unavailable.

Do not use "Pass" for items marked Manual review or Blocked.

## Audit workflow

### 1. Establish scope

Record:

* Target URL and environment.
* Repository path and framework, when available.
* Public versus authenticated surfaces.
* Page types and templates.
* Forms, authentication, media, feeds, APIs, apps, locales, and regional variants.
* Production-only systems such as DNS, CDN, monitoring, consent management, and RUM.

Select representative pages rather than checking only the homepage. Include, where present:

* Homepage.
* One page from each major template.
* A deep content page.
* A form and its error state.
* Authentication or account flow.
* Search, pagination, or filtering.
* A deliberately unknown URL.
* A redirecting legacy URL.
* A media-heavy page.
* Each locale or regional template.
* An authenticated page, only with authorised access.

### 2. Build the applicability matrix

Read all 162 items in `references/checks/`.

For every item:

1. Decide whether it applies.
2. Identify evidence sources and affected page types.
3. Choose suitable methods from `references/audit-methods.md`.
4. Record the result state.
5. Capture evidence.
6. For Fail or Partial, write an actionable fix and a verification procedure.
7. For Manual review or Blocked, state the exact next action required to reach a conclusion.

### 3. Inspect the repository

When source access exists:

* Identify routing, templates, layouts, head generation, server or CDN configuration, middleware, redirects, error pages, manifests, feeds, sitemaps, robots policies, well-known resources, locale handling, form components, media components, and deployment configuration.
* Search for duplicated or inconsistent implementations across templates.
* Prefer existing project checks. Run existing lint, validation, tests, Lighthouse, accessibility, or build commands only when safe and relevant.
* Do not infer deployed behaviour solely from source configuration.

### 4. Inspect live behaviour

When a URL exists:

* Inspect initial HTML, rendered DOM, response status, redirect chain, response headers, cookies, linked resources, console and network failures, public endpoints, and representative interactions.
* Test desktop and mobile layouts.
* Test keyboard-only operation and visible focus.
* Test reduced motion and, where possible, forced colours.
* Test an unknown route for a real 404 response.
* Inspect behaviour with JavaScript disabled when core content should remain available.
* Use production field data for Core Web Vitals when supplied; otherwise label measurements as lab-only.

### 5. Reconcile source and deployment

Call out mismatches such as:

* Correct code that is not deployed.
* CDN or platform headers overriding repository configuration.
* Generated output differing across templates.
* Staging indexing rules leaking into production or vice versa.
* Localised routes using inconsistent metadata or canonicals.

### 6. Prioritise remediation

Use this priority model:

* **P0 — Immediate risk**: exploitable security exposure, personal-data leakage, production indexing catastrophe, inaccessible critical transaction, or complete service failure.
* **P1 — Required defect**: failed Required item or severe Avoid item with broad impact.
* **P2 — Material improvement**: failed Recommended item, partial Required item, or repeated template defect.
* **P3 — Contextual enhancement**: Optional item, emerging convention, or low-impact polish.

Adjust priority using impact, affected scope, exploitation risk, user harm, frequency, and implementation effort. Explain any departure from the default.

### 7. Produce the report

Follow `references/report-template.md`.

The report must include:

* Audit date, target, environment, scope, sample pages, and limitations.
* Checklist snapshot date and whether the canonical source was compared.
* Counts by category and result state.
* Separate coverage counts for concluded, manual-review, blocked, and not-applicable items.
* Immediate risks and Required failures.
* A prioritised remediation backlog.
* A complete item-by-item matrix covering all 162 items.
* Evidence and verification instructions.
* Explicit uncertainty and untested areas.

Do not hide failed or unverified items behind a single score. A score may be included only as a secondary, fully explained metric.

## Action item format

Each Fail or Partial item must produce an implementation-ready action:

* **ID and title**
* **Priority**
* **Affected scope**
* **Evidence**
* **Why it matters**
* **Required change**
* **Suggested implementation location**
* **Acceptance criteria**
* **Verification command or manual procedure**
* **Dependencies or owner**, when known

Combine findings only when one root cause and one fix genuinely resolves all included items. Preserve every checklist ID in the combined action.

## Completion criteria

The audit is complete only when:

* Every checklist item has a result state.
* Every Pass has evidence.
* Every Fail and Partial has an actionable fix and verification step.
* Every Not applicable has a reason.
* Every Manual review and Blocked item has a concrete follow-up.
* The report distinguishes sampled evidence from site-wide conclusions.
