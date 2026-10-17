# Onboard a repository

Use this procedure for `foreman onboard`, `foreman onboard check`, or a concrete request to prepare a repository for Clerkwork. Clerkwork is the collection; Foreman coordinates onboarding rather than introducing another instruction authority.

## Inspect readiness

For `onboard check`, inspect and report only. For implementation requests, complete the same inspection before making scoped changes.

1. Identify the target project root, read its canonical instructions, and resolve any required handoff first. Inspect the current branch, working tree, and stash list. Preserve unrelated changes and saved drafts; do not restore stashes automatically.
2. Inspect existing instructions, relevant project documentation, defined validation commands, CI, delivery policy, and task records. Respect protected paths. Report evidence and unknowns rather than inventing defaults.
3. Inspect installed skills, lockfiles, ignore rules, and agent skill paths, including symlink targets and local modifications. Distinguish available specialist skills from missing skills; do not claim Foreman includes their implementation.
4. Establish direct-to-main or branch-and-pull-request policy, issue ownership, label conventions, commit cadence, merge method, and publication boundaries from existing instructions. Ask only about unresolved choices needed for the proposed setup. Repository delivery conventions and authorisation for this onboarding run are separate facts.
5. Report the proposed changes, their evidence, any policy decisions still needed, and specialist responsibilities. Continue independent work while unresolved choices remain; do not apply dependent changes until they are resolved.

## Apply the agreed setup

Use existing specialist workflows rather than duplicating them. Read each available skill's entry point before invoking it, and respect its scope. A named specialist is a routing target, not a runtime file dependency of this procedure. If it is unavailable, report that and continue independent work; do not install it without authorisation.

* Use `agent-align` for canonical `AGENTS.md`, path-scoped instructions, and task-triggered references. An explicit onboarding request already supplies its alignment confirmation; do not ask again merely to repeat that authorisation. Use `agent-instructions-audit` for legacy instruction cleanup and context efficiency.
* Use `project-task-triage` when the agreed workflow uses GitHub Issues with local task records. Preserve the established authority and tracking policy. Do not create empty records, rename a roadmap, or remove tracked files from the index merely to match a template.
* Use `quality-gate-organisation`, `dnbhq-configs`, or `manage-node-version-policy` only when the request includes the corresponding changes. Inspection does not authorise broad configuration maintenance.

Skill storage and ignore rules are onboarding work outside `agent-align`'s instruction-only scope. Apply them only when included in the agreed setup:

* Prefer one canonical skill directory when that is the chosen repository policy. Reuse supported agent paths and verify their discovery behaviour before adding adapters. Do not create unused agent directories.
* Before replacing a directory with a symlink, inspect its contents and preserve unique skills and local edits. Resolve conflicts explicitly. Verify the relative target from the link's parent, and confirm it resolves to the intended directory. Never blindly remove a directory.
* Classify upstream and local skills from actual files and lockfile records. Verify restoration support through the installed tool's help and recorded source information; do not assume a particular experimental command exists or that every locked skill is reproducible.
* If reproducible upstream skills are to be ignored, retain the lockfile and track local skills with explicit exceptions. Use a contents pattern such as `.agents/skills/*` rather than excluding the parent directory when exceptions must work. Check representative paths with `git check-ignore -v --no-index` and inspect tracked files separately: ignore rules do not untrack files.
* Keep shared instructions and intended symlinks visible to Git. Ignore only established local settings and reproducible files; do not blanket-ignore `.agents`, `.claude`, or `.codex` without inspecting what would be hidden.

Do not install tools, authenticate, deploy, merge, or publish merely because onboarding detects a provider or missing integration. Existing user authorisation and repository instructions govern those actions.

## Verify and report

Run the relevant defined checks for changed files. Verify instruction links, symlink resolution, ignore behaviour, preserved local content, and the final staged and unstaged diff where applicable. Report configured capabilities separately from checks or installations that remain unavailable.

Summarise what changed, what was already ready, unresolved choices, and the next useful Foreman commands. Include unrelated working-tree changes in the report without staging them. Follow the repository's authorised commit and push policy; do not inherit an automatic commit, squash-merge, or no-push rule from an onboarding template.
