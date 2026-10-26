---
id: foreman
name: foreman
title: Foreman
description: Interface to the Clerkwork skill collection. Use `foreman overview` to list all available skills by category, use category or topic requests such as `foreman git` or `foreman project` to narrow the catalogue, or route a concrete request such as `foreman packages` or `foreman cspell` to the matching Clerkwork skill. Foreman routes specialist jobs and applies bundled procedures for repository onboarding, CI diagnosis, pull request workflows, conflict resolution, verification, and maintainability review.
argument-hint: "<overview|mcp|onboard|janitor|packages|agent|repository|project|git|ci|conflicts|pr|deliver|verify|review|cspell|spelling|audit|issues|status|resume> [action|target]"
metadata:
  version: "1.4.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

Use this skill whenever the user addresses `foreman`, wants to see what Clerkwork can do, cannot remember a skill name, or wants Clerkwork to choose the right skill for a task.

## Overview

A bare `foreman`, `foreman overview`, `foreman help`, or equivalent request must print the complete catalogue below, grouped by category. Include each skill name and a short description, followed by the procedure requests and descriptions below. Do not require the user to remember a category or exact skill name before showing the overview.

If the user supplies a broad category or topic without a concrete action, show only the matching category and its available skills and procedures. Examples include `foreman git`, `foreman github`, `foreman project`, `foreman agent`, and `foreman repository`.

## Catalogue

### Agent management

* `agent-align` — create or repair repository agent entry-point files and alignment.
* `mcp-setup` — list curated MCP servers, check configuration, or set up a selected server for a client and scope.
* `agent-instructions-audit` — audit or optimise agent instruction architecture, scope, duplication, and context cost.

### Repository maintenance

* `cspell-inline` — apply CSpell in-document directives for file-local spelling exceptions, accepted words, disabled lines or sections, regex filtering, compound words, and per-file dictionaries.
* `janitor` - simplify code and remove verified cruft; use `foreman janitor check` for findings only.
* `dependency-maintenance` — inspect and safely update npm dependencies.
* `manage-node-version-policy` — audit and align Node.js and npm version declarations.
* `osv-scan` — scan dependencies for known vulnerabilities, apply safe fixes, and track follow-up work.

### Project management

* `project-state-report` — refresh and report repository state and recent GitHub activity.
* `project-task-triage` — sync TODO.md, GitHub Issues, and PROJECT.md.
* `resume-interrupted-work` — resume or resolve work recorded in RESUME.md before unrelated work starts.

### Repository governance

* `accessibility-review` - implement and review frontend accessibility against WCAG 2.2 AA, with automated checks, manual verification, and reporting.
* `behaviour-spec` — create, review, and generate tests from behaviour specifications.
* `dnbhq-configs` — audit repository configuration and coordinate shared configuration maintenance.
* `quality-gate-organisation` — organise repository quality-check commands.

### Git and GitHub

* `commit` — write a Git commit message that follows the Conventional Commits specification.
* `issues` — inspect, select, or work through project issues using Patrick's GitHub-first workflow.
* `labels` — classify issues with Patrick's category:value label taxonomy.

## Procedures

Procedures are supporting workflows bundled with Foreman, not separate skills. Read only the procedure that matches a concrete request. For a broad topic request, show the matching skills and procedures without starting work.

| Request | Procedure |
| --- | --- |
| `foreman onboard` or `foreman onboard check` | [Onboard a repository](procedures/onboarding.md); set up the agreed workflow or inspect readiness only |
| `foreman ci`, `foreman fix ci`, or `foreman watch ci` | [Diagnose and monitor CI](procedures/ci.md); infer inspection, fixing, or monitoring from the wording |
| `foreman conflicts` | [Resolve merge conflicts](procedures/merge-conflicts.md) |
| `foreman pr comments` | [Summarise pull request feedback](procedures/pr-feedback.md) |
| `foreman deliver` or `foreman new branch and pr` | [Deliver repository work](procedures/delivery.md); apply the target repository's branch policy |
| `foreman pr tidy` | [Prepare a pull request for review](procedures/pr-reviewability.md) |
| `foreman verify <claim>` | [Verify a claim](procedures/verification.md) |
| `foreman review maintainability` | [Review maintainability](procedures/maintainability-review.md) |

These procedures rely on ordinary agent capabilities. They add decision rules and evidence requirements rather than Git tutorials. Repository instructions and the user's authorised scope govern all actions. A procedure does not grant permission to commit, push, publish, merge, or rewrite history.

## Routing

1. If the user requests an overview, help, a list of skills, or asks what Clerkwork can do, show the catalogue instead of asking a clarifying question.
2. Route `foreman janitor` and `foreman janitor check` directly to `janitor`, preserving its edit or inspection mode. Route `foreman mcp` and its check or setup requests directly to `mcp-setup`; a bare MCP request lists servers without setup. Treat `foreman packages` as a concrete complete maintenance request and route it directly to `dependency-maintenance`. Otherwise, if the user gives only a category or topic, show that category and its available jobs, including relevant procedures.
3. Route repository onboarding requests, including `foreman onboard` and `foreman onboard check`, to the onboarding procedure before specialist routing. If the request clearly matches one specialist skill, hand off directly to that skill. Prefer its established workflow over a generic procedure.
4. If the category is known but multiple actions remain plausible, list the relevant skills and ask the user to choose only when their intended job cannot be inferred.
5. If a concrete request matches a bundled procedure, read it and apply it within Foreman. For broad Git or GitHub topics, include CI, conflict resolution, pull request feedback, delivery, and pull request preparation; for verification or review topics, show the relevant procedure.
6. Do not perform the target skill's underlying work inside Foreman, and do not bypass its confirmation or safety rules.

## Common command routes

* `foreman packages`, `foreman packages latest`, or `foreman packages check` → `dependency-maintenance` (complete run, majors authorised, or inspection only, respectively)
* `foreman audit packages` → `dependency-maintenance`
* `foreman audit security` → `osv-scan`
* `foreman audit node` → `manage-node-version-policy`
* `foreman cspell`, `foreman spelling`, or `foreman spellcheck` → `cspell-inline`
* `foreman mcp`, `foreman mcp check [server]`, or `foreman mcp setup <server>` → `mcp-setup` (catalogue, inspection, or selected-server setup, respectively)
* `foreman agent align` → `agent-align`
* `foreman agent instructions` → `agent-instructions-audit`
* `foreman status` or `foreman report` → `project-state-report`
* `foreman resume` → `resume-interrupted-work`
* `foreman issues`, `foreman issues select`, `foreman issues next`, or `foreman issues all` → `issues`
* `foreman issues 123` → `issues`
* `foreman issues labels` → `labels`
* `foreman issues sync` → `project-task-triage`
* `foreman commit` → `commit`
* `foreman accessibility`, `foreman a11y`, or `foreman audit accessibility` -> `accessibility-review`
* `foreman spec` → `behaviour-spec`
* `foreman configs` → `dnbhq-configs`
* `foreman quality gates` → `quality-gate-organisation`

The `issues` skill infers inspect, select, specific-issue, next-issue, or continuous behaviour from the user's wording. Foreman does not need separate routing targets for those operations.

## Rules

* Treat `overview` as a discovery operation, not a work operation.
* Prefer showing a small relevant catalogue over asking the user to remember exact names.
* Keep skill names flat; categories never become part of the public invocation name.
* Never invent a skill that is not in the catalogue.
* If neither a skill nor a procedure fits, say so rather than forcing the request into the nearest category.
