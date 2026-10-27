---
id: astro
name: astro
title: Astro development and migration
description: Build, review, and refactor Astro components and project architecture, or migrate an existing website to Astro with explicit parity checks. Use for Astro-specific rendering, content collections, routing, component APIs, scripts, and migration planning. Confirm an existing Astro project or an explicit migration target before applying.
metadata:
  version: "1.0.0"
---

Use one Astro workflow at a time. Load only the references needed for the requested task; a component edit does not require migration planning or a full architecture review.

## Select the workflow

| Task | Read |
| --- | --- |
| Create, review, refactor, or optimise a component | [Components](references/components.md) |
| Change project structure, content models, rendering, routes, or shared systems | [Architecture](references/architecture.md) |
| Plan or implement migration from another website system | [Migration](references/migration.md) |

For combined work, load the next reference when its decisions become relevant. Migration may need architecture first and component guidance later. All procedures and templates are bundled here; other collections and subagents are optional.

## Establish the project baseline

1. Read applicable repository instructions and inspect the worktree before editing. Preserve unrelated changes and follow the repository's branch, tracking, validation, and approval rules.
2. Confirm Astro through its dependency, configuration, or source files. For migration, identify the source framework and explicit Astro target instead. TypeScript or Markdown files alone do not establish an Astro project.
3. Inspect `package.json`, the lockfile, installed Astro and integration versions, `astro.config.*`, TypeScript configuration, build and deployment scripts, and nearby implementation conventions. Use the project's package manager; prefer npm when no choice exists.
4. Identify the requested outcome and affected consumers. Ask only when missing information controls a material implementation or parity decision.

## Shared engineering rules

* Use the installed Astro version as the implementation baseline. For a new migration target, select and record a version compatible with the runtime, integrations, and deployment target. Do not impose a fixed major version or silently upgrade the project.
* Verify version-sensitive APIs against the corresponding [official Astro documentation](https://docs.astro.build/) and release or upgrade notes. Read only relevant changes. If documentation cannot be checked, state the uncertainty and avoid speculative API changes.
* Prefer stable Astro-native features. Consider an experimental feature when its documented limitations are acceptable for the task; explain material risks and configuration changes before adoption. Do not enable unrelated experiments or add custom workarounds solely to avoid a suitable native capability.
* Prefer HTML and CSS, then Astro server-side logic, then small native browser scripts. Use an existing framework island when its state or interaction needs justify it. Hydrate only for a concrete browser requirement.
* Use strict TypeScript, existing Astro and platform types, and narrowing for untrusted values. Avoid `any` and duplicate models. Do not weaken an existing strict configuration.
* Reuse the project's content authority, design system, and components. Keep semantic, accessible HTML, progressive enhancement, visible focus, keyboard operation, and reduced-motion behaviour part of the result.
* Keep component-specific markup, styles, and browser behaviour together where useful. Extract shared or independently testable logic at meaningful boundaries, rather than to reduce file length.
* Preserve public APIs, routes, content, and supplied wording unless the task authorises changes. Find and update consumers when an authorised API change requires it.
* Document non-obvious contracts and decisions. Use the project's TODO convention for concrete deferred work; do not require comments, extensive documentation, or speculative TODOs on every change.

## Optional delegation

Complete small tasks in one agent. If delegation is available and authorised, use it only for substantial independent work: an architecture inspection alongside a rendered accessibility review, or separate migration route groups after shared architecture is settled. A single-agent environment must still support the complete workflow.

The lead agent defines the objective, evidence, allowed side effects, shared contracts, owned files, and acceptance criteria for each task. Keep concurrent edits in separate files; make shared configuration, schemas, layouts, and integration decisions sequentially. Agents report files changed, evidence, assumptions, and unresolved findings. Delegation grants no additional permissions to publish, commit, create issues, or change infrastructure. The lead agent resolves conflicts and owns final integration and parity acceptance.

## Verification and handover

Inspect and use repository scripts. Run relevant type checks, build, lint, and existing tests for the changed scope. Astro's development server does not perform type checking; use the project's configured check command and verify coverage of `.astro` files. Do not install tooling silently to satisfy a guessed command.

For meaningful rendering or interaction changes, inspect the running result at relevant viewports, including keyboard and reduced-motion states. Check console errors, repeated component instances, and client navigation where applicable. A passing build is not browser verification.

Report what changed, relevant version decisions, verification evidence, public API or URL changes, and remaining limits. Distinguish verified results from assumptions and untested behaviour. Update the project's existing tracking only where needed. A request to prepare work does not authorise a commit, push, deployment, publication, or instruction-file rewrite.
