# Repository onboarding checklist

Use this checklist to identify missing repository-specific guidance during alignment. Inspect existing instructions, documentation, configuration, and scripts first. Ask only about decisions that cannot be established from those sources and that affect the proposed instruction changes. This is an inspection guide, not a questionnaire the user must complete in full.

## Instruction discovery

* What is the canonical entry point, and which existing sources contain unique rules?
* Which rules apply by file path, and which references need a semantic task trigger?
* Are referenced files present, and are their loading conditions clear?

Keep `AGENTS.md` canonical. Do not introduce a competing repository-wide defaults file or a custom hierarchy that claims to override higher-level instructions.

## Skill storage and tracking

* Where do installed and local skills live, and which agent paths are directories or symlinks?
* Does a skill lockfile exist, which installed directories does it describe, and which skills contain local changes?
* Which skills can be restored from recorded sources, and which local skills need version control?
* Do ignore rules preserve local skills and any intended symlinks without hiding shared agent instructions?

Record the established policy. A lockfile entry alone does not prove that a directory is unmodified or reproducible. Do not prescribe installer commands without checking the installed tool's help. Skill installation, symlink replacement, and ignore-file changes are outside alignment's scope; report or route them through Foreman's onboarding procedure.

## Validation and completion

* Which test, lint, type-check, build, and integration commands are actually defined?
* Which checks are required for particular areas or before a commit, and what evidence establishes completion?
* How should unavailable checks and unrelated baseline failures be reported under the existing policy?

Record verified commands and their scope. Do not invent missing commands, require every available check for every task, or convert an unknown policy into a mandatory gate.

## Protected files and ownership

* Which files are generated, and which scripts regenerate them?
* Which files or directories must not be read or edited, and what exceptions are explicitly permitted?
* Are lockfiles, release records, or other sensitive project files managed through a dedicated workflow?

## Delivery and operational constraints

* Does the repository use direct commits or branches and pull requests, and what is the intended base?
* What issue references, commit conventions, validation, and publication permissions apply?
* Which existing issue labels, issue-per-topic rules, commit cadence, merge method, and unrelated-change rules are established?
* Which deployment, migration, credential, and data-handling constraints change agent decisions?

Distinguish delivery policy from authorisation for the current task. Do not require confirmation merely because an already authorised task touches a sensitive topic; identify the unresolved decision or additional action that needs approval.

## Deployment providers

Establish the active deployment platform from current configuration, scripts, and project documentation. Historical mentions or a dependency alone do not establish that a provider is active. A project can use multiple providers for different services; record their actual roles.

When Netlify is active, use the [bundled Netlify reference](providers/netlify.md). Copy it to the target project's `.agents/references/netlify.md`, preserving its two linked sentences exactly. Reuse an equivalent existing reference, and preserve useful project-specific content instead of overwriting it. Add this semantic trigger to the narrowest applicable canonical instruction, using `AGENTS.md` when no path scope reliably covers deployment work:

> When working on Netlify configuration, features, or deployment, read `.agents/references/netlify.md`.

Keep the provider reference task-triggered and without `applyTo`. During onboarding, install the reference and its trigger; do not execute the linked setup instructions. During a relevant task, fetch current provider guidance and follow it within the user's authorisation and the project's deployment restrictions. Provider guidance does not override canonical project instructions or grant permission to install tools, authenticate, or deploy.

For other providers, identify relevant official documentation, skills, MCP tools, or CLI guidance already established by the project or supplied by the user. Keep stable discovery links rather than copying changing vendor procedures. Record available tools separately from tools that would require installation or configuration. Do not install integrations merely because a provider is detected. Add a provider reference only when its source and applicability are established; do not create speculative placeholders for future providers.

## Project conventions and working records

* Which language, editorial, architecture, diagnostic, and testing conventions are specific to this project?
* Which existing task, plan, review, or handoff files are authoritative, optional, or deliberately excluded?
* Does the project authorise storing durable lessons, where do they belong, and how are stale entries reviewed?
* Is there a project-specific delegation policy that needs recording?

Do not create task files, lessons files, risk classifications, or delegation requirements merely to fill out this checklist. Do not persist conversation-derived preferences without authorisation.

## Review the proposed instructions

Keep only concrete rules that change agent decisions. Remove repeated generic advice about small changes, root-cause fixes, planning, verification, and reporting when the authoritative instructions already cover it. Preserve any verified project-specific exceptions.

For each proposed addition, identify its evidence, owner, applicable scope or task trigger, and canonical destination. Leave unresolved policy choices as explicit questions in the alignment report, rather than installing placeholders or speculative rules. Confirm that meaningful existing rules remain discoverable and that no competing policy was introduced.
