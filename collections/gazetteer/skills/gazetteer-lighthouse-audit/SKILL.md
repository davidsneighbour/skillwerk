---
id: gazetteer-lighthouse-audit
name: gazetteer-lighthouse-audit
title: Gazetteer Lighthouse Audit
description: Run reproducible Lighthouse audits against a live website and prepare reusable audit artifacts for another skill or agent. Use when a workflow needs Lighthouse performance, accessibility, best-practices, or SEO data for a live URL. Prefer delegation to a parallel/background subagent when the calling environment supports it.
argument-hint: "<url>"
---

<!-- cspell:words devtoolslog -->

## Gazetteer lighthouse audit

Run Lighthouse against a specified live URL and return the resulting audit
artifacts to the calling skill or agent.

This skill is primarily a **worker skill**. It performs data collection and
does not interpret, summarise, fix, or otherwise act on Lighthouse findings
unless explicitly requested.

## Execution model

When this skill is invoked as part of a larger workflow:

1. Prefer delegating the entire Lighthouse audit to an independent subagent or
   background task when the current agent runtime supports parallel execution.
2. The calling agent MAY continue unrelated work while the audit runs.
3. Do not make the calling workflow wait before performing independent work.
4. When parallel/background delegation is unavailable, run the audit
   synchronously.
5. The worker MUST finish both configured Lighthouse runs before reporting
   completion.
6. Return the generated manifest and artifact location to the caller.

Do not promise asynchronous execution when the current runtime does not provide
a mechanism for it.

## Audit concurrency

Run the two Lighthouse profiles **sequentially**, not concurrently.

Lighthouse performance measurements are sensitive to CPU, memory, browser, and
network contention. Parallel Lighthouse processes on the same machine can
distort measurements.

The intended concurrency model is therefore:

```text
parent agent
├── other independent work
└── lighthouse-audit worker
    ├── mobile audit
    └── desktop audit
```

The parent and Lighthouse worker may run concurrently. The mobile and desktop
Lighthouse runs must not.

## Input

Required:

* absolute HTTP or HTTPS URL of the live page to audit

Example:

```text
/gazetteer-lighthouse-audit https://example.com/
```

Reject malformed URLs and non-HTTP(S) URLs.

## Configuration

Use the configuration files supplied with this skill:

```text
configs/mobile.json
configs/desktop.json
```

These are Lighthouse CLI flags files and are passed using
`--cli-flags-path`.

Do not silently replace these configurations with Lighthouse defaults.

The configurations are part of the audit definition and allow audits taken at
different times or by different parent skills to remain comparable.

## Running the audit

Execute:

```bash
scripts/audit.sh --url "<URL>"
```

The script creates a unique temporary directory and performs:

1. mobile Lighthouse audit;
2. desktop Lighthouse audit.

Each Lighthouse invocation MUST generate all supported reusable report formats:

* JSON
* HTML
* CSV

Also preserve Lighthouse diagnostic assets using `--save-assets`, including
trace and DevTools log data produced by Lighthouse.

Do not open reports interactively.

## Temporary output

Create a unique directory beneath the operating system temporary directory.

Conceptually:

```text
/tmp/lighthouse-audit.XXXXXXXX/
```

Do not write audit results into the repository unless explicitly instructed by
the caller.

Do not automatically delete the temporary directory when the worker completes.
The parent workflow owns the artifacts after handoff and decides when they are
no longer required.

Expected structure:

```text
/tmp/lighthouse-audit.XXXXXXXX/
├── manifest.json
├── mobile.report.json
├── mobile.report.html
├── mobile.report.csv
├── mobile-0.trace.json
├── mobile-0.devtoolslog.json
├── desktop.report.json
├── desktop.report.html
├── desktop.report.csv
├── desktop-0.trace.json
└── desktop-0.devtoolslog.json
```

Exact diagnostic asset filenames may vary between Lighthouse versions. The
manifest, rather than filename assumptions, is authoritative.

## Manifest

After successful completion, create:

```text
manifest.json
```

It MUST contain at least:

* schema version;
* requested URL;
* final audited URL for each profile when available;
* UTC timestamp;
* Lighthouse version;
* Node version;
* status;
* output directory;
* configuration file used by each profile;
* report paths grouped by profile and format;
* diagnostic asset paths;
* failure information when applicable.

Paths MUST be absolute so another agent can consume them without knowing the
worker's original working directory.

Example shape:

```json
{
  "schemaVersion": 1,
  "status": "complete",
  "url": "https://example.com/",
  "createdAt": "2026-09-05T01:30:00Z",
  "lighthouseVersion": "13.x.x",
  "nodeVersion": "v26.x.x",
  "outputDirectory": "/tmp/lighthouse-audit.ABC123",
  "profiles": {
    "mobile": {
      "config": "/absolute/path/to/configs/mobile.json",
      "reports": {
        "json": "/tmp/lighthouse-audit.ABC123/mobile.report.json",
        "html": "/tmp/lighthouse-audit.ABC123/mobile.report.html",
        "csv": "/tmp/lighthouse-audit.ABC123/mobile.report.csv"
      },
      "assets": []
    },
    "desktop": {
      "config": "/absolute/path/to/configs/desktop.json",
      "reports": {
        "json": "/tmp/lighthouse-audit.ABC123/desktop.report.json",
        "html": "/tmp/lighthouse-audit.ABC123/desktop.report.html",
        "csv": "/tmp/lighthouse-audit.ABC123/desktop.report.csv"
      },
      "assets": []
    }
  }
}
```

## Handoff

This skill performs collection only.

After both audits have completed successfully, return a concise handoff such
as:

```text
Lighthouse audit complete.

Manifest:
/tmp/lighthouse-audit.ABC123/manifest.json

Output directory:
/tmp/lighthouse-audit.ABC123/
```

The manifest is the primary machine-readable return value.

A parent skill SHOULD read `manifest.json` first and use the JSON Lighthouse
reports for analysis. HTML and CSV exist for human inspection and alternate
processing.

Do not paste Lighthouse findings into the worker response unless requested.

## Failure handling

If an audit fails:

1. preserve any artifacts already generated;
2. do not report the overall audit as complete;
3. write or update `manifest.json`;
4. set the affected profile status to `failed`;
5. include the command exit status and concise error information;
6. return the temporary directory and manifest path to the caller.

If mobile succeeds and desktop fails, preserve and expose the successful
mobile artifacts.

Never destroy useful partial output because another profile failed.

## Requirements

Require:

* Node.js 22 or newer;
* Chrome or Chromium usable by Lighthouse;
* Lighthouse CLI, either installed locally or obtainable through `npx`;
* network access to the requested live URL.

Record the actual Lighthouse version in every manifest.

## Scope

This skill does not:

* interpret Lighthouse recommendations;
* modify the target website;
* modify source code;
* commit files;
* compare results with previous audits;
* determine whether scores are acceptable.

Those responsibilities belong to the calling skill.

Its sole responsibility is to produce a complete, reproducible Lighthouse
audit artifact set and hand it back reliably.
