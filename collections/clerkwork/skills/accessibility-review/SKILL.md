---
id: accessibility-review
name: accessibility-review
title: Clerkwork accessibility review
type: skill
description: Implement and review accessible frontend markup and interactions, or investigate keyboard, focus, screen-reader, contrast, and semantic issues. Use for accessibility reviews and frontend changes where accessibility materially affects implementation. Target WCAG 2.2 AA unless the project specifies another target.
metadata:
  version: "1.0.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

## When to use

Use this skill when implementing or changing navigation, forms, dialogs, menus, search, tabs, accordions, or other frontend features where accessibility affects the implementation. Also use it for explicit accessibility audits and investigations of keyboard operation, focus, accessible names, screen-reader output, contrast, or semantics.

Scale the review to the affected pages, components, and states. A component change needs checks in its containing page; an explicit site audit needs representative templates and complete user journeys. Backend-only, tooling-only, and documentation-only changes do not trigger browser accessibility checks unless they affect the rendered interface.

## Reusable baseline

Frontend work must target WCAG 2.2 AA unless the project specifies another conformance target. Prefer semantic HTML and native platform behaviour before ARIA and custom controls. Preserve keyboard operation, visible focus, useful accessible names, readable content, and perceivable states. For frontend changes that can affect rendered markup, interactions, navigation, forms, focus, or visual accessibility, run the project's available accessibility checks and relevant manual verification before declaring the work complete. Report any verification gaps.

This baseline is available here for reuse in consuming projects. Do not add it to unrelated repository instructions or create a new rules convention as part of a review.

## Implementation guidance

Read [implementation guidance](references/implementation.md) when building or correcting the interface. Apply the four WCAG principles: information must be perceivable, controls operable, content and interactions understandable, and semantics robust across browsers and assistive technologies.

Preserve existing accessible shared components and fix defects at their shared source where practical. Inspect actual rendered HTML and behaviour as well as source code. ARIA supplies semantics; it does not add keyboard handling or native behaviour. Use a documented WAI-ARIA Authoring Practices pattern when a custom widget is necessary, and verify the implementation in the project's supported environments.

A review request authorises inspection and reporting. Make fixes when the user's request includes implementation or remediation; keep unrelated findings in the report.

## Systematic review workflow

1. Establish scope and target. Read project instructions, relevant components, layouts, package scripts, accessibility configuration, and existing tests. Record routes, states, viewports, supported browsers, and assistive technologies. Use WCAG 2.2 AA by default, including applicable level A criteria. Record any project-specific target instead of silently changing it.
2. Inspect structure and semantics. Check document language, page titles, landmarks, logical headings, reading order, lists, tables, links, and buttons. Check site/layout bypass navigation where repeated blocks exist; do not demand a skip link in each component.
3. Inspect names and alternatives. Check image purpose and text alternatives, visible labels, control names, instructions, required fields, error associations, and multimedia alternatives. Confirm that accessible names include visible control text.
4. Inspect keyboard operation and focus. Check the full interaction path, expected widget keys, tab order, visible focus, opening and closing overlays, focus restoration, and removal of focused content. Check that sticky headers or overlays do not entirely obscure focus. Prevent keyboard traps; contain focus only where a modal interaction requires it.
5. Inspect visual and adaptable presentation. Check text and non-text contrast, information conveyed without colour alone, zoom, reflow, text spacing, focus styling, pointer targets, and forced-colour modes where supported. Check reduced-motion behaviour and controls for moving or time-limited content.
6. Inspect dynamic behaviour and input. Check state exposure, loading, errors, empty and success states, notifications, input alternatives, and predictable navigation. Review dragging alternatives, accessible authentication, repeated entry, and consistent help where applicable. Use live regions only for updates users need to hear without moving focus.
7. Run the relevant automated checks below against rendered pages and affected interaction states. Investigate each result rather than treating the tool's severity or rule mapping as a final judgement.
8. Perform manual verification below. If remediation is authorised, fix confirmed issues, rerun affected checks, and repeat the relevant user journey to check for regressions.
9. Report confirmed findings, fixes, evidence, and limitations. Keep suspected issues separate from reproduced failures.

## Automated checks

Run checks for frontend changes that can affect rendered markup, interactions, navigation, forms, focus, or visual accessibility, and for explicit reviews. Reuse project commands, installed versions, test fixtures, and browser integrations first. Read their configuration before relying on their coverage.

* Run existing accessibility tests and relevant component, integration, and end-to-end tests. Follow documented build and preview commands when checks depend on generated output.
* Run available pa11y and axe-core checks. If an existing pa11y configuration already uses its axe runner for the required states, record that coverage rather than claiming two independent engines or duplicating the same scan.
* Verify the installed pa11y version, runner, standard, and supported options. Do not assume a `WCAG22AA` standard option exists or that its default settings cover all WCAG 2.2 AA criteria.
* For axe-core, use the project's browser integration and verify that its configured rule set includes the applicable WCAG 2.0, 2.1, and 2.2 A/AA rules supported by that version. Record excluded rules and review `incomplete` results manually.
* Scan affected routes after rendering has settled, then expose changed states such as open dialogs, validation errors, expanded menus, and completed async updates. An initial-page scan does not test hidden or unvisited states.
* Record commands, versions, URLs, states, configuration, exit results, and relevant findings. Distinguish tool or environment failures from accessibility failures. Do not suppress a rule solely to obtain a passing result.

If a tool, browser, running site, or authenticated fixture is unavailable, continue useful source inspection and available checks, report the gap, and give the next verification step. Do not silently install a new testing stack, alter CI, or claim a check passed without running it. Recommend a small integration when no suitable automation exists and implementation is outside the requested scope.

Automated scans detect only part of the problem. A clean scan establishes no detected violations within its coverage; it does not establish WCAG conformance.

## Manual verification

Use the real rendered interface in a browser. Source review and an accessibility tree are useful evidence but do not replace keyboard or screen-reader testing.

* Complete affected journeys with the keyboard alone. Use Tab, Shift+Tab, Enter, Space, Escape, and widget-specific arrow keys as appropriate. Check logical focus order, visible and unobscured focus, no traps, modal behaviour, and focus return.
* Use a screen reader available in the supported test environment. Record its name, browser, and versions. Check names, roles, values, states, headings, landmarks, reading order, errors, and necessary announcements. Check announcement timing and duplication as well as their presence. If no screen reader is available, explicitly mark this verification as not performed.
* Check text resize to 200%, reflow at a 320 CSS-pixel width, and user text-spacing overrides without loss of content or functionality, applying WCAG exceptions where relevant. Test responsive variants and overlays, not only the default desktop state.
* Measure contrast for actual foreground/background combinations and interaction states. Check that colour is not the only indication of status, errors, links, or selection.
* Test pointer and touch operation where relevant, including alternatives to dragging and complex gestures, usable target spacing, and cancellation. Check time limits, pause controls, reduced motion, and flashing content where present.
* Review the meaning of image alternatives, captions, transcripts, audio description, labels, instructions, and error recovery. Tools cannot judge whether these convey the right information. Exercise authentication and multi-step forms when in scope.

## Reporting

State the scope, conformance target, routes and states covered, checks performed, and checks not performed. For each finding, provide:

* Affected component, route/state, and file with line reference where available.
* Reproduction steps and observed evidence, with the effect on users.
* Relevant WCAG criterion and level when established; identify best-practice advice separately from conformance failures.
* Severity based on user impact, such as blocked completion or a recoverable obstacle, and the reason for that assessment.
* A specific recommended fix, or the implemented fix and its retest result.

Separate confirmed violations, uncertain findings, resolved issues, and verification gaps. Record pre-existing issues separately from introduced regressions. Do not label the whole project compliant based on a scoped review, automated score, or partial manual pass.

## Authoritative references

Consult these sources for exact requirements, exceptions, patterns, or tool options rather than guessing:

* [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/).
* [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) for custom widget semantics and keyboard behaviour.
* [pa11y documentation](https://github.com/pa11y/pa11y) for installed-version options and runners.
* [axe-core documentation](https://github.com/dequelabs/axe-core) for rules, integrations, and manual-review results.
