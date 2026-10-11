# Repository instructions

## Scope

This root `AGENTS.md` is the single source of truth for repository instructions for all assistants, including Claude Code. Keep collection-specific rules in the named sections below. Do not add collection `AGENTS.md` files or assistant-specific adapters without explicit user confirmation.

This repository contains eight independently installable skill collections under `collections/`. Keep collection runtime files self-contained. Do not add runtime imports from sibling collections or root-only tooling.

Ignore `scratch/` in all cases unless an explicit instruction names it. Do not read, search, edit, or reference its contents. Keep it excluded from all tooling configuration, such as Biome, cspell, markdownlint, secretlint, and TypeScript.

## Development

Use npm, ESM, and strict TypeScript. Run `npm run check` before committing shared changes. Run `npm run check -- --collection <name>` for one collection.

Preserve imported source history and `refs/archive/<collection>/...`. Use collection-prefixed release tags in the form `<collection>/v<version>`.

## Issues and commits

Every commit must refer to a GitHub issue. Work from an existing issue, or create an issue when you commit. The issue must explain what needs to be done and what the end result looks like. Refer to the issue in the commit message footer with `Refs #<number>`, or with `Closes #<number>` when the commit completes the issue.

Package upgrades do not need an issue. Package maintenance, such as adding overrides or constraints to fix Dependabot alerts, needs an issue.

Use the labels that are configured in the GitHub repository (`gh label list`). If a necessary label from one of the taxonomies (`type:`, `status:`, `resolution:`, `prio:`, or `meta:`) is missing, ask whether to create it. Do not create labels without confirmation.

Always work on the `main` branch. Do not create branches unless explicitly asked. Commit finished tasks when the changes are coherent and do not need amendments.

## Collection changes

Apply the collection-specific rules below when working within that collection. Package with `npm run package -- --collection <name>`. The resulting archive must contain only that collection and must install without files from the repository root or sibling collections.

## Agent workflow

Before starting repository work, check for project-root `RESUME.md`. If it exists, read it first, resolve or explicitly abandon the unfinished work, and remove it before starting unrelated work. Check `git stash list` for saved draft work when inspecting changes; inspect relevant stashes as context, and restore them only when the user explicitly asks.

Keep edits scoped to the requested skill or document. Preserve existing user changes unless the user explicitly asks to include, replace, or remove them.

## Skill development

Each `collections/<collection>/skills/<skill-name>/` directory is independently loadable and uses `SKILL.md` as its entry point. Keep supporting resources, references, scripts, agents, and auth sites inside the owning skill where applicable. Shared README assets live in `.github/assets/`.

Use plain Markdown and specific, actionable `SKILL.md` frontmatter, especially `id`, `name`, `title`, and `description`. Use lowercase hyphenated skill directories and action-oriented script names. Prefer ASCII punctuation unless quoting existing text.

Run TypeScript helpers with `node <path>.ts`; do not assume compiled JavaScript, `tsx`, or a build step. Resolve former standalone-repository paths against `collections/<collection>/`, while running shared npm commands from this repository root. Use `npm run validate:skills`, `npm run lint:markdown`, and `npm run lint:spelling` for targeted validation.

No coverage threshold is defined. Validate changed scripts with targeted `--help`, dry-run, or non-writing modes. When a skill's behaviour changes, update its `SKILL.md` in the same change.

## Commit and pull request details

Use Conventional Commit subjects: `type(optional-scope): imperative summary`. For skill capabilities, use `feat(<skill-name>): ...`; for corrections, use `fix(<skill-name>): ...`. Explain the change, its reason, validation, and the issue reference in the commit body. Do not commit unfinished work with open questions. Push when stopping work if commits were added.

Close issues through `Closes #<number>` in commit messages, rather than closing them manually. Link commits, pull requests, and issues when reporting or documenting work, including their stable GitHub URLs before local commits are pushed. Pull requests must explain the affected skill, validation, and the related issue or task. Include screenshots only for asset or README visual changes.

## Collection-specific rules

These sections apply only to the named collection. Skill entry points and collection READMEs remain the authority for current capability inventories; do not rely on historical placeholder descriptions.

### Apparatus

`collections/apparatus/` contains browser, diagnostic, media, and other technical utility skills. `web-screenshot` uses its machine-local browser runtime through `collections/apparatus/skills/web-screenshot/scripts/runtime.mjs`. Validate its command interface with `collections/apparatus/skills/web-screenshot/scripts/web-screenshot --help`.

### Clerkwork

`collections/clerkwork/` contains engineering, repository maintenance, project management, Git, GitHub, and agent management skills. `foreman` is the collection interface; `foreman overview` lists skills by category, and topic requests route to the relevant skill. Keep public skill names flat and without a `clerkwork-` prefix. Categories are catalogue and navigation metadata, rather than invocation namespaces.

Every Clerkwork skill must read and apply `collections/clerkwork/resources/vocabulary.md`, including direct calls that bypass Foreman. Each skill bundles an identical copy at `collections/clerkwork/skills/<skill-name>/resources/vocabulary.md` for standalone installations. Edit the collection-level source, then run `node scripts/sync-clerkwork-vocabulary.ts` from the repository root. Collection validation rejects missing or different copies.

### Gallimaufry

`collections/gallimaufry/` contains miscellaneous AI asset maintenance and specialised workflows that do not fit the other collections, including source analysis with `distil`, strict HTTP or HTTPS references frontmatter with `dnb-reference`, and Situation, Complication, Question, and Answer message rewriting with `scqa-rewrite`.

### Gazetteer

`collections/gazetteer/` contains search visibility and content discovery skills, including technical and local SEO, metadata, structured data, entities, locations, service areas, internal linking, crawlability, indexing, and search-result presentation. Consult the actual `SKILL.md` before relying on an entry point that may still be a placeholder. `gazetteer-audit` audits website specifications against evidence; `gazetteer-lighthouse-audit` collects reproducible Lighthouse audit artefacts.

### Idiolect

`collections/idiolect/` contains skills for capturing, checking, and applying a person's writing voice. The core `idiolect` skill builds a profile from samples with `profile`, checks a draft with `check`, and rewrites it with `apply`.

Writing samples may be personal. Do not copy sample text into commits, issues, or pull requests beyond what is needed to explain a change. Do not commit a user's stored voice profile; profiles belong with the user.

### Patternbook

`collections/patternbook/` contains digital design and presentation skills covering design systems, branding, typography, colour, composition, interface patterns, responsive design, usability, accessibility, visual audits, consistency checks, and recommendations. Read the actual `SKILL.md` before using a placeholder entry point.

### Posthaste

`collections/posthaste/` contains skills for drafting, adapting, reviewing, and publishing social content. `posthaste` resolves configuration and routes requests. Route every hashtag request to the single prompt-only `hashtags` skill, including from `posthaste-prepare-link`. It returns five tags by default, a requested count, or all relevant tags in full mode, supports plain tags or social-ready hashtags, and returns its session vocabulary with `extract`.

`posthaste-prepare-link` fetches metadata, captures screenshots, drafts posts in Patrick's voice, publishes only after explicit confirmation, and logs posted networks to avoid repeats. For substantial prose edits, use `collections/posthaste/skills/posthaste-voice/resources/tropes-and-rules.md` as the diagnostic checklist.

When running or citing ported examples with `skills/70-content-design-and-voice/<skill-name>/...`, substitute `collections/posthaste/skills/<skill-name>/...` from this repository root. Fix stale references when already touching the affected file.

For publishing, OAuth, and browser-assisted flows, do not perform real posting, credential writes, login automation, or final publish clicks without explicit user confirmation. OAuth refresh-token helpers must never expose token values.

Publishing and auth skills read `~/.env` first, then the current project root's `.env`, then a different configured or explicit dotenv path such as `CROSSPOST_DOTENV` or `--dotenv`. Later files override matching keys; missing files contribute no values. Existing process environment variables take precedence over dotenv values. Keep project credential files ignored by Git. Refresh-token scripts write only to the selected dotenv path, require explicit write flags, and must refuse unsafe dotenv permissions unless the user requests a permissions fix.

Never print, paste, summarise, or commit real token, secret, authorisation code, or credential values. `posthaste-unsplash` requires attribution and download tracking on final selection. It must use caller-provided `UNSPLASH_POSTHASTE_ACCESS_KEY`, falling back to `UNSPLASH_ACCESS_KEY`, and must not use bundled, demo, testing, or repository-owned credentials.
