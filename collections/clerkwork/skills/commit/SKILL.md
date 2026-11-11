---
name: commit
description: Write Git commit messages that follow the Conventional Commits specification (v1.0.0) — types, scopes, description, body, and footers — with examples and best practices. Use when creating a commit, drafting or reviewing a commit message, or checking commit history for consistency.
metadata:
  version: "1.1.1"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

Write commit messages that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification: an explicit, machine-readable commit history that makes project changes and automation (changelogs, releases) easier.

## When to use this skill

Use this skill when:

* creating a Git commit
* drafting or reviewing a commit message
* reviewing commit messages in a pull request
* checking commit history for consistency with the specification

## Commit message structure

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

```bash
git commit -m "type(scope): description"
```

## Commit types

**feat** — a new feature for the user

```text
feat: add export to PDF functionality
feat(api): add webhook signature verification
```

**fix** — a bug fix for the user

```text
fix: resolve login redirect loop
fix(api): handle null response from GitHub webhook
```

**docs** — documentation only changes

```text
docs: update API endpoint documentation
```

**style** — changes that don't affect code meaning (formatting, whitespace)

```text
style: format code with Biome
```

**refactor** — a code change that neither fixes a bug nor adds a feature

```text
refactor: extract user validation to service object
```

**perf** — performance improvements

```text
perf: add database index for user lookups
```

**test** — adding or updating tests

```text
test: add specs for user authentication
```

**chore** — repository housekeeping or maintenance with no more specific type

```text
chore: remove obsolete repository metadata
```

**build** — changes to the build system or dependencies

```text
build: configure Docker for production
```

**ci** — changes to CI configuration

```text
ci: add security scanning to GitHub Actions
```

**revert** — reverts a previous commit

```text
revert: revert "feat: add export feature"

This reverts commit abc123.
```

Use `chore` only when no more specific type applies.

## Scope (optional)

Follow the project's commit and release conventions before choosing types or scopes. Do not copy scopes from another repository.

Scope names the part of the codebase that changed. Choose scopes that match the project's own architecture and domain areas, for example `auth`, `api`, `ui`, `database`, `deps`, `config`, `docs`.

Prefer a short, consistent scope when it identifies the affected area; omit it when no single scope is accurate. Avoid vague scopes such as `misc` or `changes`.

```text
feat(auth): add two-factor authentication
fix(api): handle rate limit errors
```

## Description

**Rules:**

* use imperative, present tense: "add", not "added" or "adds";
* start in lower case unless a proper noun requires capitals;
* no period at the end;
* keep under 72 characters, ideally under 50.

**Good:**

```text
add user profile page
fix memory leak in file upload
```

**Bad:**

```text
Added user profile page          # past tense
Fix Memory Leak In File Upload   # capitalised
Updated email templates.         # period at end
Lots of changes to the codebase  # vague
```

## Body (optional)

Include a body for complex changes, non-obvious design decisions, breaking changes, or migration instructions. Separate it from the description with a blank line, use the imperative mood, and explain *why*, not *what* — the diff already shows what changed.

```text
feat(api): add webhook signature verification

Add HMAC-SHA256 signature verification for all incoming webhooks
to prevent unauthorized access and replay attacks.
```

## Footer (optional)

**Breaking changes** use a `BREAKING CHANGE:` footer, or a `!` after the type/scope:

```text
feat(api)!: remove deprecated /login endpoint

BREAKING CHANGE: The /auth endpoint now requires a client_id parameter.
```

**Issue references:**

Follow the project's issue policy. Use `Closes`, `Fixes`, or `Resolves` only when the commit completes the issue. Use `Refs` or `Related to` for partial work. Put references in footers when the project requires them; do not impose an issue requirement on projects that have none.

```text
fix(auth): resolve session timeout bug

Fixes #123
Closes #456
Refs #789
```

**Co-authors:**

```text
feat: add data export feature

Co-authored-by: Jane Doe <jane@example.com>
```

## Workflow

1. Read the project's commit, issue, branch, validation, and publication rules. Drafting or reviewing a message does not authorise a commit or push.
2. Run `git status --short`, inspect the relevant diff, and distinguish intended additions from incidental untracked files. Preserve unrelated changes and saved work.
3. Run the documented validation for the intended change. Fix failures caused by it; report unrelated failures with the command and error summary rather than silently expanding scope.
4. Stage only intended paths with `git add <file>`, then inspect `git diff --cached`. Construct the message from that staged diff, not from the file list alone.
5. Commit when authorised and required checks and hooks pass. Use a message file for a multiline body when it avoids quoting or newline errors.
6. When reporting a GitHub commit, link the exact hash returned by Git using the verified repository remote. If it is not pushed, state that the link will resolve after pushing. Never invent or complete a hash. For other hosts, use their commit URL format, or report the hash and explain that no link is available.

## Best practices

Do:

* use present-tense imperative mood ("add", not "added");
* keep the first line under 50 characters when possible;
* reference issues or PRs in the footer;
* explain "why" in the body, not "what";
* make commits atomic — one logical change per commit.

Don't:

* use vague descriptions ("fix stuff", "updates");
* combine multiple unrelated changes in one commit;
* capitalise the opening word unless it is a proper noun, or end the description with a period;
* use past tense;
* commit broken code.

For a fuller set of examples covering every type, scope pattern, and footer combination, see `resources/commit-examples.md`.
