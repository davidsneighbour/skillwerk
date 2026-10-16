# Deliver repository work

Read the target repository's instructions and inspect its current branch, remotes, base branch, local changes, and existing pull requests. Select the repository's documented delivery policy; do not assume the base is named main or that every repository uses pull requests. If policy is absent and the choice affects delivery, clarify it before creating a branch or publishing work.

For direct delivery, stay on the instructed branch and follow its validation, issue, commit, and push requirements. Do not create a pull request solely because this procedure was invoked.

For branch-and-pull-request delivery:

1. Reuse the task's existing branch and pull request when appropriate. For new work, establish the intended base and create a focused branch only when policy and task authorisation permit it. Preserve local changes; do not stash or reset them automatically.
2. Implement and validate the requested work, following the repository's issue and commit requirements. Keep unrelated changes out of the commits.
3. Push the intended branch and create or update the pull request only when authorised. Explain the concrete behaviour change, relevant validation, material limitations, and related issue. Follow local draft and review conventions.
4. Verify the published head and report its commit and pull request links. Use the CI procedure when checking published results is part of the request.

Repository policy determines how authorised delivery happens; it does not by itself authorise publication, merging, releases, or history rewriting. A request for an implementation alone must not silently become a complete shipping request.
