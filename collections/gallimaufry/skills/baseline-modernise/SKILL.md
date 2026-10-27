---
id: baseline-modernise
name: baseline-modernise
title: Baseline modernisation audit
description: Scan frontend source for candidates where modern Web Platform features might simplify compatibility workarounds. Use for Baseline-aware HTML, CSS, and browser-script modernisation audits. Produces static candidate reports, records compatibility data provenance, and supports separate manual runtime verification; never automatically removes fallbacks or modifies source.
metadata:
  version: "1.0.0"
---

Audit first, and distinguish a lexical candidate from a justified change. This skill supports static scanning and an optional manual verification procedure. It is framework-independent and has no dependency on another skill or collection.

## Inspect and scope

Read project instructions and inspect its browser-support policy, source layout, build scripts, and existing compatibility code. Preserve unrelated changes. A Baseline target supplements the project's actual supported browsers; it does not replace audience requirements, Browserslist, accessibility checks, or behavioural equivalence.

Use existing project tooling first. Never remove a fallback simply because a newer feature exists. Do not configure browser tools, install dependencies, start servers, create issues, or publish reports without authorisation for that action.

## Run the static scanner

Resolve `<skill-directory>` to this installed skill's directory. Node.js 25 or newer runs the TypeScript directly; no `tsx`, compilation step, or root-repository tooling is required.

```bash
node <skill-directory>/scripts/cli.ts --help
node <skill-directory>/scripts/cli.ts --cwd /path/to/project --mode static --target widely
```

For default compatibility data, install this skill's declared dependency when authorised:

```bash
npm install --prefix <skill-directory> --ignore-scripts --no-audit --no-fund
```

The CLI never downloads packages or contacts sites. It reads installed `web-features` data, recording the package version. A supplied versioned snapshot can instead be passed with `--data /path/to/dataset.json`; see [configuration and data](references/configuration.md). Help and explicit-data operation need no installed dependency.

The scanner reads source and writes only `audit.json` and `index.html` in a dedicated report directory. It refuses unrelated existing report contents. It skips symbolic links and dependency, build, coverage, Git, and scratch directories. Missing configured source paths are errors, not successful empty audits. Reports are local artifacts and can contain private paths or signals; do not publish them automatically.

## Interpret the result

All matches are `INVESTIGATE`, never automatically `REPLACE`, `REMOVE`, or `KEEP`. The compatibility result is separately `true`, `false`, or unknown. Missing feature data and unparsed feature queries stay unknown. A `@supports` block is a candidate to inspect, not evidence of redundant fallback code.

The scanner covers layout measurement, modal and disclosure attributes, grid tracks, form-sizing signals, and feature queries. It uses lexical heuristics rather than language parsers. Inspect the real source and consumers to eliminate false positives, including native implementations, non-layout measurement, and disclosure controls that are not popovers. It does not enumerate every modernisation opportunity or prove that untouched code was reviewed.

The HTML report provides labelled file/feature and Baseline-status filters. All candidates remain readable without JavaScript. The JSON is the evidence record; preserve it when referring to finding IDs. IDs are deterministic within the same input, but can change after edits or a new scan. Do not carry approval across reports using an ID alone.

Compatibility is a snapshot, not a live claim. Check dataset provenance and current authoritative sources before recommending removal. Year targets mean a recorded newly-available date on or before 31 December of that year; missing or invalid dates are unknown. Do not substitute the widely-available date for a missing newly-available date.

## Optional verification and approved changes

Read [runtime verification](references/runtime.md) when the user requests behaviour checks. The CLI rejects `runtime` and `full`; it cannot complete those modes. Use available browser tooling or state that runtime verification is unavailable. No nested skill or specific browser connector is required.

For a concrete recommendation, inspect the source, check current support against the project's policy, compare behaviour and accessibility, and explain the benefit and retained fallback. Baseline eligibility alone does not establish that a replacement is appropriate.

Apply changes only when the user authorises them. Reload the report, match the source and feature, recheck support and behaviour, and limit edits to the approved scope. Run the project's relevant formatter, checks, build, and interaction tests. Report actual changes and verification limits. Audit authorisation alone does not authorise modification, commits, pushes, deployment, or publication.

## Sources

* [Baseline methodology](https://web.dev/baseline)
* [Web Platform DX web-features](https://github.com/web-platform-dx/web-features)
* [Feature status dashboard](https://webstatus.dev/)
* [MDN Web Docs](https://developer.mozilla.org/)
