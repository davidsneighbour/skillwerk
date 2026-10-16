# Diagnose and monitor CI

Resolve the repository, target pull request or branch, and current head commit before diagnosing checks. Distinguish inspection, fixing, and continuous monitoring from the user's wording. Watching checks alone does not authorise edits or pushes.

For a pull request, inspect all attached checks, including external providers. For branch-only delivery, inspect the workflows attached to the target commit. Use the available GitHub tools or CLI; consult their current help for supported fields and options.

1. Inspect existing failures before waiting. Read failed job logs or the external check details and identify the first actionable cause.
2. Separate a code failure from infrastructure trouble, unavailable credentials, cancelled jobs, and suspected flakiness. Missing access or missing checks means unavailable evidence, not success.
3. In fixing mode, make a focused correction and run the relevant local validation. Commit and push only within the user's authorisation and repository policy.
4. After a push, resolve the new head commit and inspect its complete check set again. Do not reuse a green result from an earlier commit.
5. In monitoring mode, wait in bounded intervals and report progress. Stop when applicable checks complete, access is blocked, the same cause persists after a focused correction, or further work needs a scope decision. Report pending checks as pending.

Retry a suspected flaky job at most once when reruns are authorised, and retain the failure evidence. Do not merge the base branch merely because a failure appears unrelated; first establish the cause and follow the repository's integration policy. Never bypass checks to make the result green.

Report the target commit, check or run links, root cause, changes, validation, and outstanding checks. Claim CI success only for completed successful checks on that exact commit; explain skipped, neutral, or absent checks separately.
