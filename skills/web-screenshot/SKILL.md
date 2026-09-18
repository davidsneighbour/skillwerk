---
id: web-screenshot
name: web-screenshot
title: Web screenshot
type: skill
description: Capture screenshots of web pages with requested viewport, colour scheme, full-page or fixed-height behaviour, output format, and browser state. Use when asked to take, make, save, or capture a screenshot of a URL or running web application.
---

Capture screenshots of web pages according to the user's requested visual and browser configuration.

The user's request is authoritative. Parse capture properties directly from natural language and perform the capture without asking for confirmation when the request contains enough information.

Examples:

* "Make a screenshot of [https://example.com](https://example.com) using dark mode, 1200 pixels wide, full page height."
* "Screenshot localhost:4321 at 1440x900."
* "Capture the pricing section in light mode as WebP."
* "Take mobile and desktop screenshots of this page."
* "Open the menu first, then screenshot the page."

## Defaults

Use these values only when the user does not specify otherwise:

* width: `1200`
* height: `800`
* full page: `false`
* colour scheme: `light`
* format: `webp`
* device scale factor: `1`
* screenshot scale: CSS pixels where supported
* output directory: `screenshots/` relative to the current project or working directory
* filename: derive from the final URL and relevant capture properties
* navigation/readiness timeout: `120000` ms
* additional delay: none unless needed for visual stability

Do not override an explicitly requested property with a default.

## Request interpretation

Recognise natural-language descriptions of capture settings.

Examples:

* "1200 wide" -> width `1200`
* "1200x800" -> width `1200`, height `800`
* "full page", "full height", "entire page" -> full-page capture
* "dark mode" -> emulate `prefers-color-scheme: dark`
* "light mode" -> emulate `prefers-color-scheme: light`
* "retina", "2x", "DPR 2" -> device scale factor `2`
* "mobile" -> use a suitable mobile viewport or requested device profile
* "after opening the menu" -> perform the interaction before capture
* "when `.hero` appears" -> wait for that element before capture
* "just the header" -> capture the requested element rather than the whole viewport

If width is provided without a height, use full-page mode only when the user explicitly requests full-page/full-height capture. Otherwise, use the default height.

Do not ask the user to restate properties that can be inferred unambiguously. Ask a question only when an essential value is genuinely missing or when two interpretations would produce materially different screenshots.

## Capture engine selection

Use the best available capture mechanism for the requested operation.

### Chrome devTools MCP

Prefer Chrome DevTools MCP for straightforward page captures when available, especially when the request includes viewport emulation, dark or light colour-scheme emulation, device pixel ratio, full-page capture, WebP output, or simple navigation and capture.

Typical flow:

1. Open or select the target page.
2. Apply the requested viewport and colour scheme.
3. Navigate or reload after emulation when necessary.
4. Wait until the page is visually ready.
5. Capture the requested viewport, full page, or element.
6. Save to the requested output path.

Apply visual emulation before the final page load where practical so that scripts and styles initialise under the requested conditions.

### Playwright MCP

Prefer Playwright MCP when meaningful interaction is required before the screenshot, including clicking controls, opening menus/dialogs/tabs/accordions, entering data, using authenticated browser state, waiting for application state, selecting a specific element, or otherwise manipulating UI before capture.

Use structured page state or accessibility information for interaction when available rather than trying to operate the page from screenshots.

Use the screenshot capability only after the required state has been reached.

Do not use arbitrary-code or unsafe execution merely to reproduce a capability that Chrome DevTools MCP or the local screenshot script provides directly.

### Local screenshot helper

Use `scripts/web-screenshot` when no suitable MCP browser tool is available, deterministic/repeatable capture behaviour is important, exact local output handling is required, the page contains extensive lazy-loaded visual content, the bundled settling behaviour is preferable, or the MCP implementation cannot reproduce the requested capture properties cleanly.

The helper is part of this skill and executes through the shared machine-local Apparatus browser runtime. Do not add screenshot dependencies to the consuming repository.

On first local-helper execution, `scripts/runtime.mjs` provisions the dependencies declared in `runtime.json` under `${XDG_DATA_HOME:-$HOME/.local/share}/apparatus/runtimes/browser/`. Later executions reuse that runtime across unrelated repositories on the same machine. The bootstrapper itself uses only Node.js built-ins. Set `APPARATUS_RUNTIME_ROOT` to override the shared runtime root.

## Local script mapping

Map user requests to the script without inventing extra options.

Examples:

```bash
./scripts/web-screenshot \
  --url "https://example.com" \
  --scheme dark \
  --width 1200 \
  --full-page
```

```bash
./scripts/web-screenshot \
  --url "http://localhost:4321" \
  --width 1440 \
  --height 900 \
  --format webp
```

```bash
./scripts/web-screenshot \
  --url "https://example.com" \
  --wait-for-selector ".hero" \
  --selector ".hero" \
  --format png
```

Do not pass `--height` or `--aspect` together with `--full-page`. Do not pass `--selector` together with `--full-page`.

## Visual readiness

A successful HTTP load is not sufficient to assume that a page is ready for capture.

Before the screenshot, account for relevant visual state such as page load, web fonts, lazy-loaded images, CSS background images, viewport-triggered content, requested selectors or application state, animations and transitions, and explicit user-requested delays.

For full-page screenshots, ensure that lazy-loaded content below the initial viewport has had an opportunity to initialise.

Do not wait indefinitely for `networkidle`. Modern applications may maintain persistent network connections. Treat network idle as one readiness signal rather than the sole definition of readiness.

## Colour scheme

When the user requests dark or light mode, emulate the corresponding `prefers-color-scheme` media feature.

Do not merely change browser chrome or inject arbitrary page colours.

A requested dark screenshot means the page must render as if the user prefers a dark colour scheme.

If the site does not respond to the requested colour scheme, capture its actual rendered result and report that the site did not expose a corresponding theme.

## Full-page screenshots

For full-page capture:

1. use the requested width as the viewport width;
2. allow the browser to determine the document height;
3. trigger lazy-loaded and scroll-activated content where necessary;
4. return to the initial scroll position before capture when appropriate;
5. capture the complete scrollable document.

Do not emulate a giant fixed-height viewport as a substitute for true full-page capture unless the available browser tooling requires it.

## Output format

Support, when the selected capture engine permits:

* `webp`
* `png`
* `jpeg` / `jpg`

Prefer WebP for ordinary screenshots unless the user requests another format or the selected implementation cannot produce it.

Use lossless or maximum-quality output by default unless file size is a stated concern. For JPEG/WebP, use the user's requested quality when supplied.

## File naming

When no filename is provided, create a stable descriptive filename from the final URL and relevant capture properties.

Remove the protocol, query string, and URL fragment. Normalise unsupported filename characters to `-`, collapse repeated separators, and use lower case.

Include enough capture state to distinguish variants, for example:

```text
example-com-dark-1200x800.webp
example-com-dark-1200-full.webp
example-com-light-390x844.webp
```

When an automatically generated filename already exists, choose the next available numbered variant rather than silently overwriting it.

When the user explicitly supplies an output filename, do not overwrite an existing file unless they explicitly allow replacement.

## Authentication and sensitive data

Use existing authenticated browser state when appropriate and available.

When credentials, cookies, tokens, or request headers are supplied, use them only for the requested capture. Do not print them, include them in filenames, write them into reports or logs, or persist them unless the user explicitly requests persistence.

Prefer MCP/browser-session state for authenticated captures rather than extending the local helper with credential persistence.

## Local and development uRLs

URLs such as these are legitimate screenshot targets:

```text
http://localhost:4321/
http://127.0.0.1:3000/
http://project.local/
```

Do not treat local development URLs as suspicious merely because they are local.

Do not access unrelated internal hosts or resources outside the user's requested target.

## Multiple screenshots

Capture exactly the variants the user requests. A single request may legitimately ask for desktop and mobile, light and dark, several viewport widths, or before/after interaction states.

Do not impose a one-screenshot-per-request limitation.

## Result

After capture, report concisely:

* saved file path;
* effective dimensions or width/full-page mode;
* colour scheme;
* format;
* any material deviation from the requested state.

Do not repeat all defaults when the capture completed normally.

If capture fails, report the concrete failure and the relevant attempted configuration.
