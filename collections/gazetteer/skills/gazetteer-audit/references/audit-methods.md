# Audit methods

Use the method tags in `checks/` to choose evidence. Combine methods where practical.

Replace `${target}` with the exact URL or endpoint. Preserve the final URL after redirects.

## Evidence hierarchy

Prefer evidence in this order:

1. Reproduced live behaviour.
2. Live response status, headers, cookies, DNS, and served source.
3. Rendered DOM and browser interaction.
4. Generated build output.
5. Repository implementation and configuration.
6. Documentation or stakeholder statement.

Lower-ranked evidence cannot prove higher-ranked deployed behaviour. Source code can support a finding but does not prove that production serves it.

## Method tags

### `html`

Inspect the initial response body, not only the hydrated DOM. Check element count, order, attributes, meaningful values, duplicate metadata, and template consistency.

Useful commands:

```bash
curl --fail-with-body \
    --silent --show-error --location \
    --dump-header /tmp/website-spec-headers.txt \
    --output /tmp/website-spec-page.html \
    --url "${target}"
```

Preserve the exact target URL and final URL in evidence.

### `headers`

Inspect every response in the redirect chain and the final response. Record status, `Location`, caching, security, discovery, content type, content encoding, cookies, validators, and indexing headers.

```bash
curl --silent --show-error --head \
    --url "${target}"
```

Use a full GET when the server treats HEAD differently.

### `endpoint`

Request the exact endpoint. Verify status, content type, redirects, syntax, internal references, and whether the content matches the current site.

Typical endpoints include:

```text
/robots.txt
/sitemap.xml
/sitemap-index.xml
/favicon.ico
/manifest.webmanifest
/.well-known/security.txt
/llms.txt
/llms-full.txt
```

Do not assume an endpoint is required without checking applicability.

### `crawl`

Sample or crawl internal URLs within the approved scope. Detect inconsistent metadata, heading structures, canonicals, indexing policy, broken internal links, orphan-like pages, redirects, and template drift. Respect rate limits and robots policies.

### `repo`

Inspect the implementation source and generated output. Record exact paths and line ranges. Search layouts, page templates, middleware, platform configuration, redirect rules, public assets, content collections, and deployment adapters.

### `browser`

Use a real browser for rendered state and interaction. Test:

* Keyboard order and operation.
* Visible focus.
* Modal and overlay behaviour.
* Responsive layout and zoom.
* Form errors.
* Motion preferences.
* Media controls and alternatives.
* JavaScript failure where relevant.
* Console and network errors.

### `manual`

Human judgement is required. State the test procedure, sampled pages, expected outcome, actual outcome, and any uncertainty. Do not convert a heuristic into a definitive pass.

### `validator`

Use standards-aware validators when available. Record tool name, version, target, date, configuration, and raw finding. Validate the result manually before reporting it.

### `css`

Inspect authored and generated CSS plus computed styles. Test relevant media features and viewport states. Avoid passing an item merely because a token or selector exists somewhere in the repository.

### `network`

Inspect resource requests, protocols, third-party origins, mixed content, caching, compression, cookie timing, and request failures. Distinguish first-party from third-party behaviour.

### `tls`

Verify HTTPS redirection, certificate validity and host coverage, and supported protocol configuration using authorised, non-invasive tools. Do not run aggressive vulnerability scanning without permission.

### `dns`

Inspect relevant records using `dig`, `delv`, or provider data. DNSSEC requires chain validation, not merely the presence of a DNSKEY record.

```bash
dig +short CAA ${target}
dig +dnssec ${target}
```

### `performance`

Use representative lab tests and supplied field data. Record device profile, network throttling, test location, run count, median result, and page state. Avoid presenting one Lighthouse run as field performance.

When Lighthouse data is required, delegate `gazetteer-lighthouse-audit` to an independent subagent/background worker when supported. Continue independent work while the audit runs. Before using Lighthouse findings, wait for the worker to complete and read the returned `manifest.json`. Do not start a second Lighthouse audit for the same URL while one is already running.

### `rum`

Use real-user or CrUX-style field data when available. Record the measurement window, percentile, URL/origin scope, and sample limitations.

### `lab`

Run multiple controlled measurements. Use medians and preserve raw reports.

### `policy`

Inspect actual policy text, consent behaviour, retention or operational documentation, and network behaviour. Report implementation gaps without declaring legal compliance.

### `history`

Use redirect maps, repository history, analytics, backlinks, sitemaps, and stakeholder records to assess whether published URLs remain stable.

### `operations`

Review monitoring, alerting, status-page separation, incident handling, and ownership. A visible status page alone does not prove effective monitoring.

### `forms`

Inspect every collected field, purpose, validation, error handling, submission transport, logging, and retention. Avoid submitting real personal data.

## Suggested existing tools

Prefer tools already present in the project:

* Browser developer tools or Playwright.
* Lighthouse and Chrome UX Report data.
* axe-core, Pa11y, or Accessibility Insights.
* HTML, feed, sitemap, structured-data, and manifest validators.
* `curl`, `openssl`, `dig`, `delv`, and browser network traces.
* Project lint, type-check, test, build, and link-check commands.

Do not install or execute a new third-party package without permission. When a useful tool is unavailable, mark the relevant item Manual review or Blocked and provide the exact command the user can run.

## Sampling rules

A sampled pass applies only to the sampled scope unless the implementation is demonstrably shared by all affected routes. Use wording such as:

* "Passed on 8 sampled pages using the shared base layout."
* "Failed on the article template; other templates were not affected."
* "Manual review required for authenticated routes because credentials were unavailable."

## Evidence quality

Good evidence is specific and reproducible:

```text
FAIL — SEO-009
URL: https://example.com/staging-preview/
Evidence: HTTP 200; no X-Robots-Tag; no meta robots noindex.
Impact: Preview environment is indexable.
```

Weak evidence is vague:

```text
SEO looks wrong.
```

## Mirror complete website

The complete website can be mirrored for offline inspection. The full command to do so is:

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent --wait=2 ${target}
```

* --mirror (or -m): Turns on recursion, infinite depth, time-stamping, and preserves local directory structures.
* --convert-links (or -k): Rewrites internal links so they point to your local downloaded files instead of the live web.
* --adjust-extension (or -E): Appends .html to files that are HTML but don't end in it, ensuring they open properly in a web browser.
* --page-requisites (or -p): Grabs all necessary images, stylesheets, and scripts needed to render the page correctly offline.
* --no-parent (or -np): Prevents wget from traveling upward into parent directories of the initial URL path.
* --wait=2: Pauses for 2 seconds between requests to be polite and prevent the server from blocking your IP address.

A concise shorthand for the above is:

```bash
wget -mkEp -np -w 2 ${target}
```
