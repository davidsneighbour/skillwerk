# Manual skill reviews

The repository owns [the review register](../skill-reviews.json), reporting, and scheduling. Fettle owns its review capabilities; this first version does not change Fettle or require it to run. Automated checks can provide evidence, but only explicit human acceptance renews a manual review.

## Find reviews due

```sh
npm run reviews
npm run reviews -- --markdown
npm run validate:reviews
```

The default output is a terminal table. Use `--markdown` for a Markdown table, or `npm run --silent reviews -- --markdown > reviews.md` to save it without the npm command banner. The `--github` option adds a Markdown workflow summary and grouped warning independently of the selected terminal output format. It can be combined with `--markdown`; `--validate` must be used alone.

The report discovers every `collections/<collection>/skills/<skill>/SKILL.md` in the configured collections. A skill without a review record is shown as **requires review**. The initial register contains no accepted reviews, so all existing skills require review. Newly added skills enter this state automatically. Do not invent an initial review date from a file timestamp, commit date, or successful lint run.

The default interval is 60 calendar days, with a seven-day warning window. A review is overdue on its due date. All date calculations use UTC dates. The report orders unreviewed skills first, then overdue, due-soon, and current reviews. Within each dated group, the earliest due date comes first.

The weekly [Skill reviews workflow](../.github/workflows/skill-reviews.yml) runs on Mondays at 03:17 UTC (10:17 in Thailand), and can also be started manually. It writes the report to the job summary and emits one grouped warning. Review age does not fail the report command or block unrelated commits. Commits that change an existing skill require current acceptance of its staged content, as described below. Invalid records fail validation, including in `npm run check`. The workflow does not create issues or send messages; warnings are visible in GitHub Actions.

The report uses 🔴 for **requires review** and **overdue**, 🟡 for **due soon**, and 🟢 for **current**. Text labels remain visible alongside the colours.

## Configure intervals

Edit `default_interval_days` or `due_soon_days` in the register. Set an optional collection override in `collections`, or a skill override in `skills`. The skill override takes precedence over the collection override, which takes precedence over the default. Intervals must be integers from 1 to 36500 days; the warning window also allows zero.

For example, this is a partial configuration, not an accepted review:

```json
{
  "collections": {
    "fettle": { "interval_days": 90 }
  },
  "skills": {
    "fettle/fettle-inspect": { "interval_days": 30 }
  }
}
```

Skills do not need explicit entries unless they have an override or an accepted review. Unknown collection or skill keys fail validation: update the register when moving, renaming, or retiring skills. Unknown fields also fail validation to catch configuration mistakes.

## Perform a review

1. Select a skill and inspect its applicable repository and collection instructions. Review the complete skill directory, including supporting scripts and references.
2. Check that its purpose is still useful and distinct. Check clarity, authority, conflicting instructions, permissions, portability, and duplicated responsibility.
3. Verify commands, links, external documentation, dependencies, and assumptions where practical. Run the relevant deterministic checks.
4. Examine representative normal and failure scenarios. Record the inputs, expected behaviour, actual results, and any verification limits. An agent assessment is evidence, not human acceptance or proof of general behaviour.
5. Decide whether to retain, repair, merge, or retire the skill. Record findings and follow-up work. Do not renew the review while material findings remain unresolved unless the human reviewer explicitly accepts them and records the reason.
6. Obtain explicit human acceptance of the completed review. An agent may prepare the record, but must not claim to be the human reviewer or renew the date without that acceptance.
7. Update the register with the accepted review and commit it. Several completed reviews can share one register commit. Git history preserves previous records; the register holds the latest accepted review only.

## Record acceptance

Under the skill's `collection/skill` key, add a `review` object with these required fields:

| Field | Value |
| --- | --- |
| `reviewed_on` | Date of human acceptance as `YYYY-MM-DD`; future dates are rejected |
| `reviewed_by` | Human reviewer name or handle |
| `reviewed_commit` | Full 40-character Git commit SHA containing the reviewed skill |
| `evidence` | Review note or stable issue/document link recording scope, findings, checks, limitations, follow-up, and human acceptance |

## Accept a review from the command line

After reviewing and staging a skill, run:

```sh
git add collections/fettle/skills/fettle-inspect/
npm run validate:set -- fettle-inspect
git add skill-reviews.json
```

The command accepts a unique skill name or a full `collection/skill` identifier. It records today's UTC date, your `git config user.name`, the latest `HEAD` commit hash, a fingerprint of the staged skill directory, and a note that you accepted the review. It preserves interval overrides and other skills' records. It does not stage files or run a review for you. Unstaged edits and untracked files inside the selected skill must be staged or removed before acceptance.

For a specific review note or evidence link, use:

```sh
npm run validate:set -- fettle/fettle-inspect --evidence "Reviewed the scenarios and accepted the findings; see issue #123."
```

Running this command means that you accept the manual review. An assistant may run it only when you explicitly authorise acceptance of that reviewed skill; an instruction to implement or test this tooling is not acceptance of any skill review.

`reviewed_commit` remains the latest existing commit. The optional `reviewed_content_hash` field records a SHA-256 fingerprint of Git's staged paths, file modes, and blob identities for the whole skill directory. This identifies the exact reviewed content before its commit exists, without a circular requirement to know the future commit SHA. Reports use this fingerprint when present, and use the commit comparison for older records. Fingerprints include all staged files in the skill, including tracked files matched by ignore rules. Untracked ignored files and scratch files are excluded.

## Commit checks

`simple-git-hooks` installs the pre-commit hook during `npm install` or `npm ci`. It preserves hooks that this repository does not configure, including `prepare-commit-msg`. Run `npm run prepare` after changing the hook configuration. The hook first runs `npm run validate:staged`, then `lint-staged` runs read-only code, Markdown, spelling, and secret checks on staged files. It does not auto-format or change accepted skill content. Scratch files are excluded from checks.

The review gate checks only existing skills touched by the staged diff. Adding, editing, deleting, or renaming files inside an existing skill requires an accepted, unexpired review whose fingerprint matches the staged content. You must stage the updated register too. An edit staged after acceptance invalidates the fingerprint: review it and run `validate:set` again. Unstaged edits are outside the commit and do not invalidate an already accepted staged snapshot, but the report still shows that the working skill has changed.

Untouched skills do not block commits, even if they require review. Entirely new skills and complete skill removals are outside this gate. A new skill starts as **requires review**; subsequent commits that change it require acceptance. Remove obsolete register entries when retiring skills. Older date-only records still appear in reports, but changed existing skills need the content fingerprint produced by `validate:set`.

This is a local commit hook, rather than a server-side enforcement policy. CI continues to validate register structure and run the repository checks. The local hook is not installed when lifecycle scripts are disabled.

The baseline must exist in local Git history, be an ancestor of `HEAD`, and contain that skill's entry point. Fetch full history before validation in a shallow clone; the scheduled workflow does this automatically. Missing history is an error, rather than an unchanged result.

**Changed since review** is independent of review age. It compares the complete skill directory with the reviewed commit, including staged, unstaged, and untracked files that Git does not ignore. A change does not reset the review date. Changes to shared instructions, tools, dependencies, and external services are not detected by this comparison; consider them during manual review even when this column says **no**. An urgent known defect warrants immediate review regardless of the date.
