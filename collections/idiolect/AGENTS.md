# Repository Guidelines

AGENTS.md is the single source of truth for repository instructions. Tool- or
assistant-specific files may add narrow overrides, but shared workflow,
structure, security, and editing rules belong here.

## Project Structure & Module Organization

Idiolect is a collection of standalone AI skills for capturing, checking, and
applying a person's idiolect in writing. There is no app, build output, or
central test suite; the repository product is the Markdown and scripts under
`skills/`. Each `skills/<skill-name>/` directory is independently loadable and
uses `SKILL.md` as its entrypoint. Supporting files belong inside the owning
skill directory, commonly in `resources/` or `scripts/`.

## Skill Map

* `idiolect`: the core skill. Builds a voice profile from writing samples
  (`profile`), checks a draft against that profile (`check`), and rewrites a
  draft into the author's voice (`apply`).

## Build, Test, and Development Commands

There is no root build step. Run helper scripts directly from the repository
root once a skill defines one, for example:

```bash
node skills/idiolect/resources/some-script.ts --help
```

TypeScript resource scripts are run with `node <path>.ts`; do not assume
compiled JavaScript, `tsx`, or a build step exists.

Repository-wide checks run from `package.json`:

```bash
npm run check         # biome, typecheck, validate:skills, test, markdown, spelling
npm run validate:skills
npm run lint:markdown
npm run lint:spelling
```

## Coding Style & Naming Conventions

Use plain Markdown for skill documentation. Keep `SKILL.md` frontmatter
specific and actionable, especially `id`, `name`, `title`, and `description`.
Skill directories use lowercase hyphenated names such as `idiolect` or, for
future companion skills, `idiolect-<purpose>`; resource scripts use
action-oriented names. Prefer ASCII punctuation unless quoting existing text.

## Testing Guidelines

No coverage threshold is defined. Validate changed scripts with targeted
`--help`, dry-run, or non-writing modes before handoff. When a skill's
behaviour changes, update its `SKILL.md` in the same change.

## Commit & Pull Request Guidelines

Always work on `main`. Do not create branches unless the user explicitly asks
for a feature branch.

Every commit must refer to a GitHub issue. If no fitting issue exists, or the
work did not start from an issue, create one before committing. Apply fitting
GitHub labels for type, priority, status, and affected area, using existing
repository labels. Close issues only through `closes #123` in commit messages;
do not close issues manually.

When reporting, reviewing, or documenting repository work, link references to
commits, pull requests, and issues whenever they are mentioned. If the
referenced object is not available locally yet but will have a stable GitHub
URL after the repository state is pushed, use that URL form anyway.

Use conventional changelog subjects for all commits:
`type(optional-scope): imperative summary`. For skill changes, use
`feat(<skill-name>): ...` for new or changed capabilities and
`fix(<skill-name>): ...` for corrections. Write verbose commit bodies that
explain what changed, why it changed, validation performed, and the issue
reference. Commit when the change is complete. If open questions remain or the
change is not done, do not commit; explain what remains and offer to commit
once resolved. Push when stopping work if one or more commits were added.

Pull requests should explain the affected skill, list validation performed,
and link the related issue or task. Include screenshots only for asset or
README visual changes.

## Voice Samples and Personal Data

Writing samples used to build or check a voice profile may be personal. Do
not copy sample text into commits, issues, or pull requests beyond what is
needed to explain a change. Do not commit a user's stored voice profile to
this repository; profiles belong with the user, not with the skill code.

## Agent Workflow

Before starting repository work, agents must check for project-root
`RESUME.md`. If it exists, read it first, resolve or explicitly abandon the
unfinished work, and remove `RESUME.md` before starting unrelated work.

Keep edits scoped to the requested skill or document. Preserve existing user
changes in this dirty worktree unless the user explicitly asks to include,
replace, or remove them.
