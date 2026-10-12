---
id: dependency-maintenance
name: dependency-maintenance
title: Clerkwork Dependency Maintenance
type: skill
description: Safely maintain npm dependencies in a single-package repository or npm monorepo. Use when asked to inspect outdated packages, update dependency ranges and lockfiles, assess or fix npm audit findings, check Dependabot alerts and dependency PRs, update compatible package groups, track unresolved vulnerabilities in GitHub issues, and validate, commit, and push a complete maintenance run while preserving unrelated work.
metadata:
  version: "1.1.0"
---

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

Maintain npm dependencies without mixing unrelated work into the update.

## Invocation contract

`foreman packages` requests a complete maintenance run: inspect updates and GitHub state, apply safe patch and minor updates and vulnerability fixes, validate, commit scoped changes, push, verify CI, recheck security findings, create or reuse follow-up issues, and review remaining dependency or versioning PRs. This invocation authorises those actions in the current repository. It does not authorise major upgrades, forced audit fixes, alert dismissal, PR merges, or PR closure. `foreman packages latest` also authorises major upgrades, subject to compatibility and validation.

Inspection-only wording such as `foreman packages check` means inspect and report without installing, editing, committing, pushing, or creating issues. For inspection-only runs, read local state, audit results, available updates, GitHub alerts, issues, and PRs, then report proposed work. Skip stashing, synchronisation, upgrades, installation, audit fixes, and all remote mutations. Direct skill calls follow the user's requested scope. Repository instructions take precedence over these defaults.

## Boundaries

* Work only in the current repository.
* Support npm projects only. Stop on pnpm, Yarn, Bun, or ambiguous package-manager state unless the user explicitly asks to adapt the workflow.
* Preserve unrelated tracked and untracked work.
* Do not make unrelated source, formatting, or refactoring changes.
* Do not install maintenance tooling as a project dependency.
* Do not use `npm audit fix --force` without explicit approval.
* Do not treat a generic "update dependencies" request as approval for major upgrades.
* Do not merge, rebase, use plain `git pull`, dismiss alerts, or merge or close PRs without explicit authorisation.
* Do not commit when validation fails unless the user explicitly accepts the failure.
* Commit and push only when the request authorises them, including the complete-run invocation above. Do not push unrelated local commits without authorisation.

## Track run state

Keep these facts for the final report:

```text
package_manager: npm / ambiguous / unsupported
repository_type: single package / npm workspaces / configured monorepo / ambiguous
upstream_branch: <branch or none>
sync_result: up to date / fast-forwarded / no upstream / diverged / failed / skipped
stash_created: yes / no
stash_ref: <ref or none>
package_files_changed: <list>
lockfiles_changed: <list>
major_upgrades: <list>
audit_fixes_applied: yes / no
validation_commands: <command and result list>
commit_created: yes / no
commit_hash: <hash or none>
update_groups: <members, target versions, and compatibility evidence>
github_security: checked / unavailable / pending
follow_up_issues: <created or reused URLs>
push_result: pushed / failed / skipped
ci_result: passed / failed / pending / unavailable / not configured
dependency_prs: <URLs and dispositions>
```

## Workflow

### 1. Inspect repository instructions and state

Read repository guidance such as `AGENTS.md`, `CONTRIBUTING.md`, and relevant documentation before changing files. Resolve any project-root `RESUME.md` first, inspect `git stash list`, and honour excluded paths in every search. Do not restore saved work without user authorisation.

Run:

```bash
git rev-parse --show-toplevel
git branch --show-current
git status --short
node --version
npm --version
```

Inspect package-manager markers:

```bash
find . -maxdepth 3 \
  \( -name package.json -o -name package-lock.json -o -name npm-shrinkwrap.json \
  -o -name pnpm-lock.yaml -o -name yarn.lock -o -name bun.lock -o -name bun.lockb \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/scratch/*"
npm pkg get packageManager workspaces 2>/dev/null || true
```

Classify the project:

* Continue as npm when `package-lock.json` or `npm-shrinkwrap.json` exists, `packageManager` identifies npm, or the user explicitly identifies npm.
* Stop as unsupported when only another package manager's lockfile exists.
* Stop as ambiguous when multiple package-manager lockfile types exist.
* Stop when no `package.json` exists.

### 2. Determine repository shape

Inspect npm-check-updates configuration:

```bash
find . -maxdepth 3 \
  \( -name ".ncurc" -o -name ".ncurc.json" -o -name ".ncurc.yml" \
  -o -name ".ncurc.yaml" -o -name ".ncurc.js" -o -name "ncu.config.js" \
  -o -name "ncu.config.cjs" -o -name "ncu.config.mjs" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/scratch/*"
```

Use this decision model:

* **Single package:** one root package manifest; update the root manifest and lockfile.
* **npm workspaces:** root `package.json` declares workspaces; update included workspace manifests and refresh the root lockfile.
* **Configured monorepo:** an existing npm-check-updates configuration defines package-file scope; run from the repository root and respect it.
* **Ambiguous monorepo:** multiple manifests exist without workspaces or clear configuration; stop and ask which package paths are in scope.

Do not update arbitrary nested manifests.

### 3. Protect existing work

Inspect both staged and unstaged dependency changes:

```bash
git status --short
git diff --stat
git diff --cached --stat
git diff -- '**/package.json' '**/package-lock.json' '**/npm-shrinkwrap.json'
git diff --cached -- '**/package.json' '**/package-lock.json' '**/npm-shrinkwrap.json'
```

Handle the result as follows:

* Continue when the tree is clean.
* Continue with unrelated untracked files, but leave them untouched.
* Stop when package manifests or lockfiles already have changes. Ask whether to include them, commit them separately, or use them as the update baseline.
* For unrelated tracked changes, prefer asking the user to commit or stash them.
* Auto-stash only when the user requested an automated end-to-end run, the changes are clearly unrelated, and hiding them cannot affect the maintenance result.

When auto-stashing:

```bash
git stash push --message "pre-dependency-maintenance" --
git stash list --max-count=1
```

Do not include untracked files unless explicitly requested. Record the actual stash ref and never pop it automatically.

### 4. Synchronize safely

Synchronize only after dependency files are clean and unrelated tracked changes are absent or safely stashed.

```bash
git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true
git fetch --prune
git status --branch --short
```

* If there is no upstream, record `no upstream` and continue.
* If local and upstream are equal, record `up to date`.
* If the branch is only behind, run `git pull --ff-only`.
* If the branch has diverged, stop. Do not merge or rebase.
* If fetch or pull fails, stop and report the failure.

### 5. Inspect GitHub security and existing work

Capture an initial `npm audit --json` result before changing dependencies so the final comparison has a local baseline. Store temporary output outside the repository, and distinguish findings from command or registry errors.

For complete and inspection-only runs, identify the repository from its remote and verify access with `gh repo view --json nameWithOwner,url,defaultBranchRef`. Use the actual `OWNER/REPO` in commands. Fetch every page of open Dependabot alerts:

```bash
gh api --paginate 'repos/OWNER/REPO/dependabot/alerts?state=open&per_page=100'
gh issue list --repo OWNER/REPO --state open --limit 100 --json number,title,body,labels,url
gh pr list --repo OWNER/REPO --state open --limit 100 --json number,title,body,author,baseRefName,headRefName,url
```

Paginate issues and PRs when the limit is reached. Inspect dependency and versioning PRs by their changed files and bodies, including human-authored PRs; do not rely only on bot authors or labels. Read relevant PR diffs and checks without checking out or merging their branches. Distinguish package updates from release-only version bumps, and avoid duplicating work already in progress.

Record advisory identifiers, alert URLs, affected manifests, vulnerable ranges, patched versions, and runtime or development scope. Correlate npm audit and Dependabot findings by advisory and dependency path; neither source replaces the other. Authentication failures, disabled alerts, and insufficient permissions mean unavailable, never zero findings. Continue independent local maintenance when safe, and report the missing GitHub coverage.

Use [GitHub's Dependabot alerts API documentation](https://docs.github.com/en/rest/dependabot/alerts) when response fields or permissions need verification.

### 6. Inspect available updates

Run from the repository root:

```bash
npm outdated || true
npx --yes npm-check-updates
```

Allow an existing npm-check-updates configuration to control package scope. Do not add npm-check-updates to `package.json`.

Classify proposed updates:

* patch and minor updates
* major updates
* production dependencies
* development dependencies
* high-risk tooling such as frameworks, build tools, TypeScript, test runners, linters, and deployment packages

### 7. Choose update scope and compatible groups

Follow an explicit user scope when provided.

Otherwise:

* Apply patch and minor updates by default.
* Present major updates before applying them.
* Apply majors without another prompt only when the user explicitly asked for all/latest dependencies or clearly authorized major upgrades.

Before changing versions, inspect project update-group rules, npm-check-updates configuration, Dependabot or Renovate groups, installed manifests, and target package peer dependencies. Use current upstream compatibility documentation or `npm view PACKAGE@VERSION peerDependencies engines --json` to verify proposed versions.

Treat packages that must move together as one update group. For Vitest, inspect `vitest` and each installed `@vitest/*` companion, such as UI, browser, and coverage packages. Select mutually compatible releases and preserve exact version alignment where their requirements demand it. Do not assume Vite, plugins, or every package in a namespace uses the same version number. Do not add companions that the project does not use.

Apply all manifest changes for a group before one install. If a filter or ignored package prevents a compatible group update, keep the whole group unchanged and report the blocker. Do not bypass peer conflicts with `--force` or `--legacy-peer-deps`. Major restrictions apply to the entire group. Record members, target versions, and compatibility evidence, and run the relevant test, coverage, browser, or build checks after installation. The generic commands below must be adjusted to preserve these groups and repository scope.

For patch and minor updates:

```bash
npx --yes npm-check-updates --target minor --upgrade
npm install
```

For explicitly approved major updates:

```bash
npx --yes npm-check-updates --upgrade
npm install
```

For workspaces, use workspace-aware behaviour supported by the installed npm-check-updates version or the repository configuration. If neither defines safe scope, stop instead of guessing.

After installation:

```bash
git status --short
git diff --stat
git diff -- '**/package.json' '**/package-lock.json' '**/npm-shrinkwrap.json'
```

Verify that changes are limited to intended dependency manifests and lockfiles. Record exact changed files and version transitions.

### 8. Audit dependencies

Run:

```bash
npm audit || true
```

Use `npm audit --json` when structured details are needed, writing temporary output outside the repository when practical.

Before applying audit fixes, inspect the proposed remediation:

```bash
npm audit fix --dry-run || true
```

Run `npm audit fix` only when its proposed changes are non-breaking and remain inside the approved dependency scope:

```bash
npm audit fix
git diff --stat
git diff -- '**/package.json' '**/package-lock.json' '**/npm-shrinkwrap.json'
npm audit || true
```

Apply the same compatible-group checks to audit remediation, parent upgrades, and overrides. After `npm audit fix`, inspect the diff again. If it changed files outside the approved dependency scope or introduced unapproved major changes, stop and report the situation before committing.

Do not automatically fix findings when:

* `--force` is required
* a major upgrade is required but not approved
* framework or build-tool changes may be breaking
* no safe fix is available
* the remediation risk exceeds the vulnerability risk

For each npm audit or Dependabot finding, inspect the actual dependency chain with `npm explain PACKAGE` or `npm ls PACKAGE --all`. Prefer upgrading the direct parent to a release with a patched transitive dependency. Consider an override only after checking compatibility, project policy, and validation; never assume an override is safe because installation succeeds. Do not dismiss a finding merely because it is a development dependency.

For remaining findings, record package, advisory, severity, direct or transitive status, affected paths, safe-fix availability, and recommended action. Preserve non-zero audit results as findings; distinguish them from network or registry failures, which are unavailable results. A known tracked finding need not prevent committing validated improvements unless repository policy says otherwise.

### 9. Validate the repository

Inspect repository scripts and documented checks:

```bash
npm pkg get scripts
```

Run the repository's documented validation gate. When no project-specific order exists, use applicable scripts in this order:

```text
test
lint
typecheck
check
build
```

Run only scripts that exist. Prefer root orchestration scripts in workspaces and monorepos.

Record every command and whether it passed, failed, or was skipped. If validation fails:

* stop before committing or pushing, but still track confirmed unresolved findings and report PR status when safe
* preserve the dependency changes for inspection
* report whether the failure appears update-related
* provide exact rollback commands using only changed dependency files

### 10. Review and optionally commit

Review staged and unstaged state:

```bash
git status --short
git diff --check
git diff --stat
git diff -- '**/package.json' '**/package-lock.json' '**/npm-shrinkwrap.json'
```

Ensure no temporary audit artifacts or unrelated files are included.

Follow repository issue-reference rules, including any package-upgrade exemption. For maintenance that needs an issue, reuse or create the issue before committing and include the required `Refs` or `Closes` footer. Do not close an unresolved vulnerability issue through a partial fix.

If a commit is authorized and validation passed:

1. Build the exact list of intended changed dependency files.
2. Stage those paths explicitly with `git add -- <paths>`.
3. Inspect `git diff --cached --stat` and `git diff --cached --check`.
4. Commit with a Conventional Commit subject:

```text
build(deps): update dependencies
```

Include a concise body covering:

* updated package and lockfiles
* major upgrades, if any
* audit result and remaining findings
* validation commands

Capture the commit hash:

```bash
git rev-parse --short HEAD
```

Never stage through broad globs, `git add .`, or `git add -A`.

### 11. Push and verify the result

For a complete run, inspect outgoing commits before pushing. Push only the authorised work to the configured upstream with ordinary `git push`; never force-push. If there is no upstream, report the blocked push rather than guessing a destination. Stop dependent remote verification if push fails. When no changes were needed, skip the commit and push, but still perform the final security and PR checks.

For a successful push, record the full commit SHA and stable GitHub URL. Query workflow runs for that exact SHA with `gh run list --repo OWNER/REPO --commit SHA --json databaseId,headSha,status,conclusion,url`. Inspect failures with `gh run view RUN_ID --repo OWNER/REPO --log-failed`. Do not use an older passing run as evidence. Poll with short waits for up to ten minutes, keeping the user informed; report pending or unavailable when the result cannot be established. No matching runs means not configured or pending, not passed. Repair update-related failures within scope, validate, commit, push, and verify again; stop and report if repair requires an unapproved migration or remains blocked.

Rerun `npm audit --json` and refresh Dependabot alerts after the push. Compare them with the initial findings and the pushed manifests and lockfile. GitHub scanning may lag: report a locally verified fix with remote confirmation pending when appropriate, and do not claim that an open alert has closed. Do not poll indefinitely or dismiss alerts to make the report clean.

### 12. Track unresolved findings and review remaining pull requests

For a complete run, create or reuse GitHub issues for findings that remain actionable but cannot be safely fixed. Search existing issues by advisory identifier, package, and dependency chain before creating anything. Combine matching npm audit and Dependabot reports in one issue; retain distinct affected paths and blockers. Reuse a matching open issue and update it only when there is new material evidence. Avoid duplicate issues or repetitive comments on repeated runs.

Include the advisory and alert URLs, severity, affected package and dependency chain, current and patched versions, attempted remediation and validation, the concrete blocker, and the next action or condition for revisiting. Distinguish no upstream fix from a fix requiring unapproved breaking work or failing validation. Do not expose private advisory details in a public issue; report restricted findings through the repository's approved security channel. Check `gh label list` and use existing appropriate labels. Follow the available `issues` and `labels` skills when applicable; standalone installations must use repository rules and the requirements here without requiring sibling skill files. Never create missing taxonomy labels without confirmation. Use a body file or structured arguments to preserve issue text.

Refresh open PRs after the final push and inspect relevant diffs and checks against the updated base. Report each dependency or versioning PR as still needed, partially covered, superseded, blocked, or unrelated, with its URL and evidence. A newer base version alone does not prove a PR is superseded; check all changed files, group compatibility, and non-version changes. Review release-only PRs against repository release policy. Recommend the next action, but do not merge, close, rebase, or comment on PRs without separate authorisation.

### 13. Report

Report:

* status: completed, stopped, or failed
* branch and upstream sync result
* repository type and package manager
* package and lockfiles changed
* production and development updates
* major upgrades
* audit fixes and remaining findings
* validation results
* commit hash, or why no commit was created
* unrelated files left untouched
* grouped update decisions and compatibility evidence
* push and CI results for the exact commit
* final npm audit and Dependabot results, including pending or unavailable checks
* created or reused issue URLs and unresolved blockers
* remaining dependency and versioning PR URLs, dispositions, and recommended actions
* manual follow-up recommendations

When a stash was created, add a dedicated note with the actual ref and these recovery commands:

```bash
git stash list
git stash show --stat <stash-ref>
git stash pop <stash-ref>
```

Never omit a created stash from the report.
