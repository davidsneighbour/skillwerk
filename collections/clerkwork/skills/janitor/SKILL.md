---
id: janitor
name: janitor
title: Janitor
type: skill
description: Simplify the current project's code, tests, documentation, and configuration through evidence-backed removal and focused refactoring. Use for codebase cleanup, dead-code removal, or reducing unnecessary complexity; use check mode for findings without edits.
argument-hint: "[check] [path or concern]"
metadata:
  version: "1.0.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

## Purpose and scope

Reduce maintenance work by removing unnecessary concepts, duplication, and obsolete code while preserving required behaviour. Less code is useful when it makes the system easier to understand and change; line count is not a success target.

A cleanup request authorises focused edits within its scope. `janitor check`, an audit, or a request for recommendations produces findings without edits. Follow project instructions for protected paths, validation, and delivery. This skill does not itself authorise commits, publication, infrastructure destruction, or changes to product behaviour.

## Find the useful work

Inspect project instructions, worktree changes, existing conventions, entry points, and relevant checks. Preserve unrelated work. Use a named path or concern when supplied. For a broad request, survey the project, choose a coherent area with a clear maintenance benefit, and state the scope; do not turn it into a repository-wide rewrite.

Prioritise demonstrably unused code, redundant sources of truth, unnecessary layers, and repeated domain logic. Explain the concrete cost before changing a pattern. Prefer a correction at the canonical source over a downstream override. Similar-looking code may serve different contracts; consolidate only when ownership and reasons for change are shared.

Before declaring something unused, check callers, public exports, scripts, configuration, framework discovery, generated inputs, dynamic imports, and relevant consumers. A text search or unused-code tool supplies candidates, not proof. If external use or runtime discovery cannot be established, retain the candidate and report the uncertainty while continuing independent work.

Use existing analysis tools first. Check current primary documentation when a change depends on uncertain or version-specific behaviour; select sources for the actual stack rather than requiring one documentation service.

## Simplify with judgement

* Remove dead paths, obsolete debug output, and commented-out implementations when their purpose and replacement are established. Retain useful diagnostics, legal notices, and comments that explain constraints or intent.
* Flatten control flow or remove abstractions when this improves readability and preserves evaluation order, side effects, errors, and asynchronous behaviour. Keep useful names and boundaries even when they have one caller.
* Use a built-in or existing project utility when its semantics match. Avoid new helpers for incidental resemblance, speculative reuse, or moving complexity between files.
* Remove dependencies only after checking runtime, tooling, build, peer, and optional uses. Update manifests and lockfiles with the project's package manager, and verify the affected install or build path. Treat upgrades, vulnerability fixes, and dependency replacements as separate work unless requested; use an available dependency-maintenance workflow when appropriate, without requiring a sibling skill.
* Remove a test only when its behaviour is obsolete or demonstrably covered elsewhere. A flaky test needs diagnosis, not deletion to obtain a passing run. Add focused coverage when an important affected contract is otherwise unverified; avoid tests that merely mirror the implementation.
* Correct stale documentation and links, and remove redundant explanation. Preserve operational instructions and non-obvious rationale. Update documentation when cleanup changes a documented path or interface.
* Treat configuration and infrastructure as executable contracts. Verify environment, deployment, and external consumers before removing entries. Retire live resources through a separately authorised operational change.

Keep formatting and naming changes local to the cleanup. Do not impose a new style, framework, or architecture as housekeeping.

## Validate and stop

Establish the relevant baseline, then make small, reviewable changes by concept. Run checks that exercise affected contracts after each coherent change; use the project's required final gate before delivery. For visible UI changes, inspect the rendered result. For claimed performance improvements, compare representative before-and-after measurements; simpler source alone does not prove faster execution.

Review the diff for accidental behaviour changes and generated-file drift. Separate existing failures from regressions. If a change cannot be validated adequately, narrow it, add proportionate evidence, or report the candidate without applying it. Do not weaken checks to make cleanup pass.

Stop when the scoped maintenance problem is resolved. Leave uncertain candidates and broader migrations as recommendations, rather than extending the task until no possible cleanup remains.

## Report

Summarise what changed, why it reduces maintenance work, and which checks passed, failed, or were unavailable. For deferred findings, give a navigable location, evidence, uncertainty, and next action. Distinguish verified results from inference. Report size or performance savings only when measured; do not create a permanent cleanup report unless requested or required by the project.
