# AI skills for software engineering workflows

![clerkwork and foreman](../../.github/assets/images/skillwerk/clerkwork.png)

Clerkwork is a collection of reusable AI skills reflecting Patrick's engineering knowledge: dependency maintenance, GitHub issue triage, project tracking, and repository upkeep. The goal is to keep the routine parts of maintaining a repository consistent and portable across projects and AI assistants.

> Clerkwork is the collection. Foreman is its interface. Skills describe jobs. Foreman procedures describe supporting workflows. Categories organise the collection.

* [AI skills for software engineering workflows](#ai-skills-for-software-engineering-workflows)
* [Install](#install)
* [Update](#update)
* [Shared vocabulary](#shared-vocabulary)
* [Skills](#skills)
* [Procedures](#procedures)
* [The cabinet of @davidsneighbour's skills](#the-cabinet-of-davidsneighbours-skills)

## Install

Install the current Clerkwork skill set with:

```bash
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/clerkwork/skills --yes
```

## Update

Re-run the install command to refresh an existing install:

```bash
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/clerkwork/skills --yes
```

Use `--global` when the skills should be available outside the current project.

## Shared vocabulary

All Clerkwork skills use [the shared vocabulary](resources/vocabulary.md), including skills invoked directly. Each installed skill includes a copy, so project and project root always refer to the repository that the current task concerns and its top-level directory. To update the vocabulary, edit the collection-level source and run `node scripts/sync-clerkwork-vocabulary.ts` from the repository root; collection validation checks that all bundled copies match.

## Skills

Use `/foreman overview` when you do not remember a skill name. Foreman lists the complete collection by category and can narrow it with requests such as `/foreman git`, `/foreman project`, or route concrete jobs such as `/foreman packages`.

Use `/foreman packages` for a complete npm maintenance run: compatible grouped updates, safe vulnerability fixes, validation, commit, push, CI verification, unresolved-finding issues, and dependency or versioning PR review. Use `/foreman packages check` for inspection only, or `/foreman packages latest` to include major upgrades. The complete run does not authorise forced fixes, alert dismissal, or merging or closing PRs.

Foreman also bundles [focused procedures](skills/foreman/SKILL.md#procedures): CI diagnosis and monitoring, merge conflict resolution, pull request feedback, repository delivery, pull request preparation for review, claim verification, and maintainability review. These are available with Foreman alone. Delivery follows the target repository's documented branch policy, including direct-to-main and branch-and-pull-request workflows; it does not impose one policy across projects.

Skill names are intentionally flat. Categories organise the collection without becoming part of the invocation name, so individual skills remain independently installable and portable.

### Agent management

* `agent-align` creates or repairs the repository agent entry-point setup.
* `agent-instructions-audit` audits and optimises agent instruction architecture and context cost.

### Repository maintenance

* `cspell-inline` applies the narrowest supported CSpell in-document directive for file-local spelling exceptions, accepted words, disabled lines or sections, regex filtering, compound words, and per-file dictionaries.
* `dependency-maintenance` safely maintains npm dependencies in a single-package repository or npm monorepo.
* `manage-node-version-policy` audits and updates Node.js and npm version declarations against actively supported releases.
* `osv-scan` scans dependencies for known vulnerabilities, auto-applies safe fixes, and files issues for the rest.

### Project management

* `project-state-report` reports what changed in a repository since a given time, including GitHub PR and issue activity.
* `project-task-triage` syncs the local TODO.md scratch pad with GitHub Issues and regenerates the local PROJECT.md dashboard.
* `resume-interrupted-work` manages a project-root RESUME.md handoff file that blocks new work until interrupted work is resolved.

### Repository governance

* `behaviour-spec` creates, reviews, and generates tests from behaviour specifications.
* `dnbhq-configs` audits repository configuration and coordinates shared configuration maintenance.
* `quality-gate-organisation` organises repository quality-check commands.

### Git and GitHub

* `commit` writes Git commit messages that follow the Conventional Commits specification.
* `issues` inspects, selects, and works through project issues using Patrick's GitHub-first workflow, while preserving the same principles on other issue systems where practical.
* `labels` analyses issue text and selects or applies labels from Patrick's category:value label taxonomy.

## Procedures

Procedures live inside Foreman and are loaded only for the requested workflow. They install with Foreman and have no separate manifest entries or sibling-skill dependencies.

| Request | Outcome |
| --- | --- |
| `foreman ci` | Inspect CI for the target pull request or branch. |
| `foreman fix ci` | Diagnose and correct an actionable failure within the authorised scope. |
| `foreman watch ci` | Monitor checks for the current head commit and report their result. |
| `foreman conflicts` | Resolve the active integration operation while preserving intended behaviour. |
| `foreman pr comments` | Summarise outstanding review feedback with links and context. |
| `foreman deliver` | Follow the target repository's direct or pull request delivery policy. |
| `foreman new branch and pr` | Apply branch-and-pull-request delivery where the repository permits it. |
| `foreman pr tidy` | Prepare reviewer guidance and identify obstacles to review. |
| `foreman verify <claim>` | Check a falsifiable claim with reproducible evidence. |
| `foreman review maintainability` | Report supported structural findings in the requested change range. |

Repository instructions define branch, validation, and delivery policy. The user's request defines the authorised actions. Inspection, watching checks, and summarising comments do not imply permission to edit code or publish changes. Existing specialist workflows, such as `foreman packages`, retain their own operating modes.

The incoming sketches were consolidated rather than published as ten new skills. The two CI sketches became one procedure. Verification permits direct observation for absolute claims and baseline comparisons for improvement claims. Maintainability review uses evidence of maintenance cost rather than arbitrary file-size limits. The interactive review canvas was omitted because its required renderer, styles, and template were absent. Chat-derived preference extraction was omitted because transcript access, privacy, evidence quality, and ownership of generated guidance need a separate design.

## The cabinet of @davidsneighbour's skills

| Exhibit | Skill |
| :---: | :--- |
| [![Apparatus](../../.github/assets/images/skillwerk/apparatus-thumb.png)](https://github.com/davidsneighbour/apparatus) | **[Apparatus](https://github.com/davidsneighbour/apparatus):** A collection of practical, tool-driven skills for operating browsers, diagnostics, media utilities, and other reusable technical machinery. |
| [![Clerkwork](../../.github/assets/images/skillwerk/clerkwork-thumb.png)](https://github.com/davidsneighbour/clerkwork) | **[Clerkwork](https://github.com/davidsneighbour/clerkwork):** It's an engineers world. Start your engines, maintain, contrive, and put in the works. |
| [![Gallimaufry](../../.github/assets/images/skillwerk/gallimaufry-thumb.png)](https://github.com/davidsneighbour/gallimaufry) | **[Gallimaufry](https://github.com/davidsneighbour/gallimaufry):** A miscellaneous collection of small AI skills and odd useful workflows. |
| [![Gazetteer](../../.github/assets/images/skillwerk/gazetteer-thumb.png)](https://github.com/davidsneighbour/gazetteer) | **[Gazetteer](https://github.com/davidsneighbour/gazetteer):** Place-aware patterns for geographic content, local context, and location-rich publishing. |
| [![Idiolect](../../.github/assets/images/skillwerk/idiolect-thumb.png)](https://github.com/davidsneighbour/idiolect) | **[Idiolect](https://github.com/davidsneighbour/idiolect):** Finding your own language in skill outputs. |
| [![Patternbook](../../.github/assets/images/skillwerk/patternbook-thumb.png)](https://github.com/davidsneighbour/patternbook) | **[Patternbook](https://github.com/davidsneighbour/patternbook):** Patterns for better digital work. |
| [![Posthaste](../../.github/assets/images/skillwerk/posthaste-thumb.png)](https://github.com/davidsneighbour/posthaste) | **[Posthaste](https://github.com/davidsneighbour/posthaste):** A collection of skills to post to social media of all kinds. |
