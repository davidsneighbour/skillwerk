---
id: hashtags
name: hashtags
title: Posthaste Hashtags
description: Generate consistent hashtags from any input, either a URL or a block of text. Return 5 tags by default, a user-requested number, or all relevant tags in full mode, as plain tags or as social-ready `#` hashtags. Use when the user asks for hashtags or tags for a link or passage, or when another Posthaste skill needs hashtag candidates for social posts. Analyse each input independently, classify the resource type, extract relevant technologies, concepts, domains, and project names, and maintain session tags for extraction.
metadata:
  version: "1.0.0"
---

<!-- cspell:words webdev -->

Generate hashtags from any form of input.

## Invocation

Use this skill when the user:

* provides a URL or a block of text and asks for hashtags or tags,
* asks Posthaste to analyse or tag a URL or text,
* needs hashtag candidates for a social post, or another Posthaste skill asks for them,
* provides an existing hashtag list to establish tagging consistency,
* writes `extract` to retrieve all tags generated during the current session.

## Input types

| Input | Resource to analyse |
| --- | --- |
| URL | Load the page and use its readable content. |
| Text | Use the supplied text as the resource. Do not load anything. |

If the message contains a URL and only request wording (for example "10 tags for this"), treat the URL as the resource. If the message contains a text passage that includes URLs, treat the passage as the resource, unless the user asks to load a URL.

## Modes

| Mode | When | Result |
| --- | --- | --- |
| Limited (default) | The request does not ask for full mode. | Return 5 tags, or the number that the request states. |
| Full | The request asks for full mode, all tags, every tag, or as many tags as possible. | Return all relevant tags without a limit. |

### Limited mode

1. Use 5 as the default number of tags.
2. If the request states a different number, use that number.
3. Build the full candidate set, as in full mode.
4. Select the most specific and important tags from the candidate set, in this order of priority:
   1. the primary subject,
   2. important specialist concepts,
   3. relevant technologies or platforms,
   4. domain-specific terminology,
   5. named projects, products, standards, or organisations,
   6. important secondary topics.
5. Prefer tags for what the resource is about over source and resource-type tags. Include a source or resource-type tag only when the platform or format is itself an important topic of the content.
6. If the candidate set has fewer tags than the requested number, return only the candidate set. MUST NOT add filler tags to reach the number.

The requested number is a maximum, not a target. The full candidate set is the upper limit.

### Full mode

Return every relevant tag from the candidate set. Do not apply a limit.

Prefer useful coverage over an unnecessarily small tag set.

## Core behaviour

For each input:

1. Identify the input type (URL or text).
2. Identify the mode and, in limited mode, the number of tags.
3. For a URL, load and read the page. For text, read the supplied text.
4. Determine what the resource is actually about from its readable content.
5. Classify the resource type.
6. Generate the full candidate set of relevant tags.
7. Apply established session spelling and terminology where relevant.
8. In limited mode, select the requested number of tags from the candidate set.
9. Return only the resulting comma-separated tags.

Treat every input as an independent resource.

MUST NOT infer a topical relationship between the current input and previously analysed inputs unless the user explicitly states that they are related.

Previously generated or user-provided tags MAY be used to maintain vocabulary and spelling consistency, but MUST NOT be used as evidence about the current resource.

## Tag selection

Include tags representing relevant aspects of the resource.

Before you build the candidate set, read enough of the resource to understand its primary topic, its important secondary topics, and its intended domain or specialist field.

### Source and resource type

Add applicable source tags to the candidate set:

| Resource | Tags |
| --- | --- |
| GitHub repository | `gh-repo`, `github` |
| GitHub Gist | `gh-gist`, `github` |
| GitHub issue | `gh-issue`, `github` |
| GitHub pull request | `gh-pr`, `github` |
| Blog article | `blog`, `article` |
| Tutorial | `tutorial` |
| Web application | `app` |
| SaaS application | `app`, `saas` |
| Documentation | `docs` |

Resource types can overlap. Add all tags that accurately describe the resource.

For example, a blog article that is also a tutorial can receive `blog`, `article`, and `tutorial`.

For text input, add a source or resource-type tag only when the text itself makes the type clear. MUST NOT assume a source (for example GitHub) that the text does not state.

### Technologies

Include concrete technologies when they are materially relevant.

Examples:

`typescript`, `javascript`, `astro`, `react`, `css`, `html`, `nodejs`

Do not add technologies merely because they are commonly associated with the subject.

### Concepts and patterns

Include meaningful concepts, techniques, patterns, and areas of practice.

Examples:

`performance`, `accessibility`, `web-development`, `animation`, `responsive-design`, `static-site-generator`

Prefer specific concepts demonstrated or substantially discussed by the resource.

### Domain terms

Include terminology specific to the subject area.

Examples might include APIs, protocols, architectural patterns, browser features, development techniques, design concepts, or specialised terminology.

### Names

Include relevant project, library, framework, service, product, tool, standard, or organisation names.

Normalise them according to the tag formatting rules unless an established session spelling exists.

### Tags to avoid

MUST NOT add:

* generic or promotional tags, such as `interesting`, `useful`, `innovation`, `technology`, or `trending`, when more specific tags are available,
* near-duplicates, singular and plural duplicates, and redundant variations,
* tags that are only weakly related to the resource.

For example, for an article about securing Linux servers, prefer `linux`, `server-security`, and `ssh` (subject tags) over `technology` or `security` (generic tags).

## Formatting

There are two output formats.

| Format | When | Example |
| --- | --- | --- |
| Plain (default) | The request does not ask for `#`. | `css, web-development, responsive-design` |
| Hashtag | The request asks for the leading `#`, or the tags are for a social post. | `#css, #webdevelopment, #responsivedesign` |

Plain tags MUST:

* use lowercase where practical,
* omit the leading `#`,
* use hyphens for multi-word concepts,
* avoid duplicates,
* be comma-separated.

Hashtag tags MUST:

* start with `#`,
* be the plain tag with all hyphens removed, because hyphens break hashtags on social networks,
* use lowercase unless established spelling or branding strongly favours camel case,
* avoid duplicates,
* be comma-separated.

The format changes only the output. The session vocabulary and the `extract` command always use the plain spelling.

When processing an accessible URL or readable text, return only the tags.

MUST NOT add explanations, headings, commentary, or other text.

## Consistency

Maintain a session vocabulary from:

1. tags generated by this skill during the current session, and
2. existing tag lists explicitly supplied by the user for consistency.

When an established tag accurately describes a new resource, prefer its existing spelling over introducing a synonymous or differently formatted tag.

For example, if the session already uses:

`web-development`

prefer it over introducing:

`webdev`

This is a consistency mechanism only.

MUST NOT add an existing session tag unless it is independently relevant to the current resource.

User-provided tags used only as consistency references MUST NOT be treated as tags generated by this skill.

## Accessibility and hallucination

Tags MUST be based on readable content: the page content for a URL, or the supplied text for text input.

MUST NOT infer tags solely from:

* the URL,
* domain name,
* page title without readable page content,
* URL path or slug,
* search-result snippets,
* previously analysed resources,
* prior session tags.

If the page cannot be accessed or its substantive content cannot be read, do not generate tags.

Instead, return a short error in this format:

`ERROR: <reason>. REQUIRED: <smallest action needed to provide readable content>.`

Examples:

`ERROR: The page requires authentication. REQUIRED: Provide the relevant text or an accessible public URL.`

`ERROR: The page returned HTTP 404. REQUIRED: Provide a working URL or paste the content.`

`ERROR: The supplied text is too short to determine its subject. REQUIRED: Provide more text.`

When determinable, use a specific reason, such as:

* paywall,
* login required,
* robots restriction,
* network error,
* `404`,
* `403`,
* JavaScript-only page without readable content,
* missing or empty page content,
* unsupported file or media format.

If supplied text is empty or too short to determine what it is about, do not generate tags. Return the same error format.

Examples of the required action:

* provide a public URL,
* provide an accessible copy,
* paste the page text,
* provide the relevant excerpt,
* upload a screenshot,
* grant access.

The normal tags-only output rule does not apply to inaccessible or unreadable resources because explaining the failure is required.

## Session state

Keep track of every tag actually generated by this skill during the current conversation.

For each successfully processed input, add its returned tags to the session tag set. In limited mode, add only the returned tags, not the unreturned candidates.

Deduplicate the session tag set while preserving the exact spelling used.

Tags merely supplied by the user for consistency MUST NOT enter the generated session tag set unless this skill subsequently produces them for a processed input.

Failed, inaccessible, or unreadable inputs MUST NOT add tags to the session tag set.

## Extract command

When the user's message is `extract`, return every unique tag actually generated by this skill during the current session.

Rules:

1. Use only tags returned for successfully processed inputs.
2. Do not include tags that appeared only in user-provided consistency lists.
3. Deduplicate the result.
4. Preserve the exact established spelling.
5. Sort alphabetically unless the user explicitly requests another grouping or order.
6. Return only the comma-separated tags.
7. Do not include leading `#`.
8. Do not include explanations or additional text.

Example:

`accessibility, astro, css, github, performance, web-development`

## Repeated workflow

The expected workflow is:

1. The user sends one URL or block of text, optionally with a number of tags or a request for full mode.
2. Analyse it and return its tags.
3. The user may send another URL or block of text.
4. Treat the new input independently and repeat the process.
5. The user may provide existing tags to improve vocabulary consistency.
6. The user may write `extract` at any time to retrieve the deduplicated session tag set.

Continue this workflow for the duration of the conversation.
