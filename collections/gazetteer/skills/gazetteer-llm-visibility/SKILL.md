---
id: gazetteer-llm-visibility
name: gazetteer-llm-visibility
title: LLM visibility
description: Audit and improve how agents retrieve public website content, including server-rendered HTML, llms.txt, Markdown alternatives, HTTP content negotiation, and crawler policy. Use for AI-readable content and measured discovery experiments; do not promise search rankings or citations.
metadata:
  version: "1.0.0"
---

Improve access to useful public content. Separate verified retrieval improvements from unverified effects on AI answers, citations, or rankings. Optional discovery files are experiments, not a requirement for appearing in AI answers.

## Inspect before changing

1. Identify the site, framework, content source, representative URLs, and intended consumers.
2. Fetch actual HTML responses. Check that useful content, links, status codes, and canonical URLs are available without running client JavaScript. Prefer fixing missing server-rendered content first.
3. Inspect existing crawler rules and the owner's policy. Keep search access, live retrieval, and training permission distinct. Never unblock crawlers or opt into training automatically.
4. Record a baseline with response bodies, headers, dates, and the tool used. Read current provider documentation before making provider-specific claims.

## Optional discovery and representations

Use the [llms.txt proposal](https://llmstxt.org/) when a curated guide would help the intended consumer. It is a community proposal. Follow its current format, link only to public content, and keep generated links current. Choose useful content rather than creating an exhaustive duplicate sitemap.

Offer Markdown alternatives when they improve retrieval. Generate HTML and Markdown from the same canonical source. Preserve meaning, links, code examples, language, and attribution. Apply the same authentication and privacy controls to every representation; never expose drafts or private content through exports.

Advertise alternatives with HTML links or HTTP `Link` headers. For an HTML response, for example:

```text
Link: </docs/start.md>; rel="alternate"; type="text/markdown"
```

A Markdown response linking back to HTML must use `type="text/html"`. Separate fixed URLs do not require `Vary: Accept` solely because they are alternatives.

Only add same-URL content negotiation when the intended client needs it. Follow [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1): account for media-range specificity, quality values, exclusions with `q=0`, and wildcards. Keep HTML as the default for ordinary browser requests; document the tie-breaking policy. When selection depends on `Accept`, merge `Accept` into `Vary` on all selected responses, preserve other cache variation, and ensure representation-specific validators. A `406` response is one possible policy when no representation is acceptable; document and test the selected policy.

Treat [Content Signals](https://contentsignals.org/) as a separate content-use policy mechanism. Read the current definitions and obtain the owner's policy before changing values. Do not present these signals as access control or a guarantee that crawlers comply.

Consider a full-text export only for a concrete consumer need. Limit its size, exclude private material, and keep it generated from the same source. Do not redirect a promised full export to an unrelated home-page summary.

## Evidence and limits

Do not add hidden messages aimed only at AI systems. Do not promise gains from special meta tags, files, or structured data without evidence from the intended consumer. Preserve useful structured data for its supported purposes. Prefer accurate, well-sourced content and useful public HTML over speculative infrastructure.

Measure retrieval success separately from citation frequency. Use server-side request records where available, minimise personal data, and treat User-Agent strings as untrusted labels. A request or scanner pass does not prove that a provider indexed or cited the page. Do not invent uplift percentages or universal statements about provider behaviour.

## Verification and handover

Test representative public pages, redirects, missing pages, and protected content. For negotiation, include HTML-only, Markdown-only, unequal quality values, ties, wildcards, explicit exclusions, and unsupported types. Check `GET`, `HEAD`, content types, links, cache variation, and body parity.

Report the exact changes, retrieval evidence, remaining failures, and any optional experiments. State what was not tested. Public scanners can supplement local HTTP checks, but require permission before submitting private or staging URLs to third parties. Do not describe a scanner score as proof of AI visibility.
