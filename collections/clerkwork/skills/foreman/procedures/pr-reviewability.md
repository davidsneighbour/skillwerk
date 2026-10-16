# Prepare a pull request for review

Inspect the target pull request's actual base-to-head diff, commits, description, generated files, and validation evidence. Identify mixed concerns, stale descriptions, unclear entry points, and mechanical changes that obscure the behaviour change.

Prefer a concise reviewer walkthrough: problem and resulting behaviour, core files, generated or mechanical files, material risks, and validation. Draft it locally unless updating the pull request was authorised. Recommend splitting independent changes when notes cannot make the scope clear.

History rewriting requires explicit authorisation. Before an authorised rewrite, record the original head commit and tree, confirm branch ownership and remote state, and preserve a recovery reference. Afterwards, compare the resulting tree with the recorded tree when content must remain identical. Investigate any difference before publishing; a force push needs its own authorisation and protection against overwriting newer remote work.

Report improvements made or drafted, content verification, and remaining review obstacles. Do not post review comments, change behaviour, or rewrite history as an implied part of tidying a description.
