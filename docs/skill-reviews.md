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

The weekly [Skill reviews workflow](../.github/workflows/skill-reviews.yml) runs on Mondays at 03:17 UTC (10:17 in Thailand), and can also be started manually. It writes the report to the job summary and emits one grouped warning. Review age does not fail the command or block commits. Invalid records fail validation, including in `npm run check`. The workflow does not create issues or send messages; warnings are visible in GitHub Actions.

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

Use `git rev-parse HEAD` to obtain the full revision when reviewing the current committed skill. Commit skill repairs before recording the reviewed revision. The review record can then be committed separately or batched with other accepted reviews. Do not record a revision for uncommitted skill content.

The baseline must exist in local Git history, be an ancestor of `HEAD`, and contain that skill's entry point. Fetch full history before validation in a shallow clone; the scheduled workflow does this automatically. Missing history is an error, rather than an unchanged result.

**Changed since review** is independent of review age. It compares the complete skill directory with the reviewed commit, including staged, unstaged, and untracked files that Git does not ignore. A change does not reset the review date. Changes to shared instructions, tools, dependencies, and external services are not detected by this comparison; consider them during manual review even when this column says **no**. An urgent known defect warrants immediate review regardless of the date.
