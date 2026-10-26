# Repository instructions

## Scope

This root `AGENTS.md` is the canonical entry point for repository instructions for all assistants, including Claude Code. Keep shared rules here and collection-specific rules in `.agents/instructions/`. Do not add collection `AGENTS.md` files or assistant-specific adapters without explicit user confirmation.

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

Before inspecting or editing a collection, read `.agents/instructions/<collection>.instructions.md` if it exists, and apply its rules when the repository-relative path matches its `applyTo` pattern. Load the file explicitly even if the assistant does not load scoped instructions automatically. When work spans multiple collections, read each matching instruction file. These files have the same authority as this file within their scope.

Use collection READMEs and skill entry points for capability inventories and operating procedures. Create scoped instruction files only for actionable rules, with `applyTo: "collections/<collection>/**"`; do not include descriptive catalogues or repository-wide scopes.

Package with `npm run package -- --collection <name>`. The resulting archive must contain only that collection and must install without files from the repository root or sibling collections.

## Agent workflow

Before starting repository work, check for project-root `RESUME.md`. If it exists, read it first, resolve or explicitly abandon the unfinished work, and remove it before starting unrelated work. Check `git stash list` for saved draft work when inspecting changes; inspect relevant stashes as context, and restore them only when the user explicitly asks.

Keep edits scoped to the requested skill or document. Preserve existing user changes unless the user explicitly asks to include, replace, or remove them.

## Skill development

Each `collections/<collection>/skills/<skill-name>/` directory is independently loadable and uses `SKILL.md` as its entry point. Keep supporting resources, references, scripts, agents, and auth sites inside the owning skill where applicable. Shared README assets live in `.github/assets/`.

Use plain Markdown and specific, actionable `SKILL.md` frontmatter, especially `id`, `name`, `title`, and `description`. Use lowercase hyphenated skill directories and action-oriented script names. Prefer ASCII punctuation unless quoting existing text.

Run TypeScript helpers with `node <path>.ts`; do not assume compiled JavaScript, `tsx`, or a build step. Resolve former standalone-repository paths against `collections/<collection>/`, while running shared npm commands from this repository root. Use `npm run validate:skills`, `npm run lint:markdown`, and `npm run lint:spelling` for targeted validation.

### Individual skill versions

From this change onwards, increment `metadata.version` in the owning `SKILL.md` once per coherent skill commit. This version is independent of the collection release version. Do not backfill versions for earlier commits. Start new skills at `1.0.0` and keep the version as a quoted, stable `MAJOR.MINOR.PATCH` string in a block-style `metadata` mapping.

* Patch: corrections and clarifications that preserve intended behaviour.
* Minor: new capabilities, rules, or supported workflows.
* Major: incompatible changes to invocation, required inputs, outputs, or operating behaviour.

Every commit that changes files inside an existing skill must include a higher version for that skill, including changes to bundled references, rules, scripts, and assets. Use a patch increase for changes with no behavioural effect. Removed skills need no increase. Root-only and collection-only changes do not require individual skill increases unless skill files also change. Collection releases must not rewrite individual skill versions merely to match the collection version.

Run `npm run validate:versions` after staging. The pre-commit `validate:staged` gate compares staged skill versions with `HEAD`; an unstaged version increase does not count. The gate checks valid versions and monotonic increases; reviewers still decide whether patch, minor, or major is appropriate. Stage the final version before recording human review acceptance, because it changes the reviewed content fingerprint.

No coverage threshold is defined. Validate changed scripts with targeted `--help`, dry-run, or non-writing modes. When a skill's behaviour changes, update its `SKILL.md` in the same change.

## Commit and pull request details

Use Conventional Commit subjects: `type(optional-scope): imperative summary`. For skill capabilities, use `feat(<skill-name>): ...`; for corrections, use `fix(<skill-name>): ...`. Explain the change, its reason, validation, and the issue reference in the commit body. Do not commit unfinished work with open questions. Push when stopping work if commits were added.

Close issues through `Closes #<number>` in commit messages, rather than closing them manually. Link commits, pull requests, and issues when reporting or documenting work, including their stable GitHub URLs before local commits are pushed. Pull requests must explain the affected skill, validation, and the related issue or task. Include screenshots only for asset or README visual changes.
