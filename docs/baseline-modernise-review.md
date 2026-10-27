# Baseline modernisation implementation review

Date: 2026-10-27.

## Scope and source

Rework stash `76473f67ad984cab2c8e4337566ac4d21c4bbfcd` into one independently installable `baseline-modernise` skill in Gallimaufry. The original draft was stored under Patternbook. No tracked Patternbook skill or registration exists to remove. The source stash remains a backup pending acceptance and a later commit; all unrelated stashes remain unchanged.

The new skill starts at `1.0.0`, registers in both discovery manifests and the Gallimaufry README, and owns its scripts, tests, dependency declaration, and references. No root tooling or sibling collection is required at runtime.

## Implemented recommendations and cleanup

* Replace `tsx` and missing compiled `.js` imports with native Node.js TypeScript execution and `.ts` imports. Help runs without compatibility packages.
* Make the CLI explicitly static-only. Reject unsupported runtime or full modes rather than generating a report that appears complete. Replace the nested DevTools skill with an optional manual runtime reference; no tool installation or server startup is automatic.
* Treat every lexical match as `INVESTIGATE`. Record target eligibility separately as true, false, or unknown. Include feature-query candidates without pretending they map automatically to a feature.
* Keep missing features and unrecognised status unknown. For year targets, use only a valid newly-available date; never substitute the widely-available date. Validate configuration, arguments, dataset envelopes, and mode and target values.
* Remove the generic deep merge and glob dependency. Use bounded literal source paths, explicit extensions, fixed protected-directory exclusions, custom directory exclusions, and symbolic-link checks. Missing sources fail visibly. Ignore the output directory on subsequent scans.
* Mask comments and JavaScript strings to reduce obvious false matches. Retain explicit limitations for lexical scanning, framework syntax, regular expressions, generated code, and behaviours that need human inspection.
* Record the installed `web-features` package version or supplied snapshot provenance. Support explicit data without installed dependencies. No CLI network access or automatic package installation occurs.
* Render escaped report text with labelled filters, visible keyboard focus, status feedback, and readable no-script content. Refuse unrelated report-directory contents, unrecognised existing reports, and report-file symbolic links before replacing generated output.
* Remove stale standalone TypeScript configuration, unused migration-pattern scaffolding, duplicate defaults, unsupported runtime configuration, and claims of automatic source modification. Keep necessary configuration and verification procedures in two linked references.

## Verification

The scoped Gallimaufry check passed, including code and Markdown lint, spelling, secret scanning, TypeScript, collection and skill validation, and 24 tests. Seven new tests cover target evaluation, configuration and path errors, exclusions, symbolic links, comments and strings, unknown data, feature queries, safe output, dataset provenance, and running a copied skill outside the repository with explicit data and unchanged source.

The collection archive was built and installed all six skills in a clean project. The default installed-data path was exercised using `web-features` version `3.44.0`; its provenance appeared in a generated example report. This checks the installed snapshot, not live browser support.

A generated five-candidate report was inspected in headless Chromium at 390px and 1280px viewport widths. File/feature filtering reduced the visible cards to one matching result, the status filter selected the unknown candidate, keyboard Tab focused the search field, and all five cards remained visible with JavaScript disabled. No page errors or horizontal overflow were observed in the checked views. These checks do not establish full accessibility conformance or cross-browser compatibility.

## Remaining limits

The scanner is deliberately lexical, not a language parser or migration engine. A match is not a defect. It does not reconcile Browserslist, discover routes, perform runtime verification, authenticate custom datasets, prove equivalence, or decide that fallbacks are removable. Dataset freshness must be checked before acting. Finding IDs apply to the current report and may change after edits or reruns.

The manual follow-up records evidence outside the generated directory and keeps implementation subject to user authorisation. The user explicitly accepted the final staged implementation and requested commit. Acceptance is recorded in `skill-reviews.json`; [issue #80](https://github.com/davidsneighbour/skillwerk/issues/80) tracks the work. Remove only the identified source stash after the commit is pushed. No target-project source modifications, live-site audit, deployment, or report publication is authorised by this acceptance.
