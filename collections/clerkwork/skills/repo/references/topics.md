# Topics and taxonomy

## Verified GitHub capabilities

Checked on 8 November 2026 against GitHub documentation and installed GitHub CLI help:

* `gh repo view OWNER/REPO --json repositoryTopics` reads topics.
* `gh repo edit OWNER/REPO --add-topic NAME --remove-topic OTHER` supports incremental topic requests, but has no native dry-run flag. Never use it to preview changes.
* `gh api --hostname github.com repos/OWNER/REPO/topics` returns the complete `names` array. `PUT` to that endpoint replaces all topics, including an empty array to clear them. The bundled helper uses this endpoint with explicit set preservation and verification.
* Use lowercase letters, numbers, and hyphens, at most 50 characters per topic, and at most 20 topics per repository. Topic names are public even when used on private repositories. Do not encode client names, secrets, or confidential administration details.
* Repository administrators can manage topics. Read access does not establish write access. Fine-grained tokens need repository Administration write permission for the replace endpoint; permissions and organisation policy can still prevent a write.

Sources: [GitHub CLI edit](https://cli.github.com/manual/gh_repo_edit), [GitHub CLI view](https://cli.github.com/manual/gh_repo_view), [repository topics API](https://docs.github.com/en/rest/repos/repos#replace-all-repository-topics), and [GitHub topic rules](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).

## Reusable taxonomy

This is a proposed, opt-in convention. The `dnb-` prefix separates administration topics from ordinary discovery topics such as `astro` or `typescript`. It does not reserve the namespace on GitHub. Preserve existing topics and do not automatically migrate similar names.

| Group | Suggested values | Cardinality | Use |
| --- | --- | --- | --- |
| `dnb-kind-` | `app`, `website`, `library`, `config`, `skills`, `docs`, `tool` | Zero or one | Repository purpose |
| `dnb-stage-` | `experimental`, `active`, `maintenance`, `retired` | Zero or one | Intended lifecycle |
| `dnb-care-` | `self`, `shared`, `upstream` | Zero or one | Maintenance responsibility |
| `dnb-stack-` | `astro`, `wordpress`, `node`, `python` | Multiple | Technical administration cohorts |
| `dnb-group-` | A non-confidential portfolio or programme slug | Multiple | Cross-repository grouping |

For example, `dnb-kind-website`, `dnb-stage-active`, `dnb-care-self`, and `dnb-stack-astro` identify actively maintained Astro websites. All groups are optional, and suggestions are extensible. New values need a clear meaning and an explicit change request; never infer maintenance responsibility from fork status alone. Replacing a singleton value requires an explicit removal and addition. Unknown existing topics remain untouched.

Use GitHub's actual archived, fork, owner, and visibility fields for those facts. `dnb-stage-retired` expresses intent and does not archive anything. Do not duplicate these fields as topics or treat a topic as permission to delete, archive, or deploy a repository.

## Listing and administration

`repo list [owner] [--topic TOPIC ...]` is an agent workflow, not a helper subcommand. With no owner, resolve it through `gh api --hostname github.com user --jq .login`. Validate the owner as a GitHub login and each topic using the topic rules. Reject URLs or host-qualified owners rather than silently querying another host.

For complete owned-repository inventory, use explicit GET requests with pagination:

```bash
gh api --hostname github.com --method GET users/OWNER/repos --paginate -f per_page=100 -f type=owner
gh api --hostname github.com --method GET orgs/OWNER/repos --paginate -f per_page=100 -f type=all
```

Determine user versus organisation from `gh api --hostname github.com users/OWNER` and its `type` field. The user listing endpoint exposes public repositories for other users. For the authenticated user's own inventory, use `gh api --hostname github.com --method GET user/repos --paginate -f per_page=100 -f affiliation=owner -f visibility=all` to include accessible private repositories. Organisation listings include only repositories accessible to the current credentials. Describe that access boundary; do not call an incomplete public inventory complete.

Parse each page as JSON and apply exact local topic membership filters, requiring all requested topics. Filter archived, visibility, and fork state from API fields as requested. Display linked `full_name`, status, and matching topics. Report the number examined and matched, pagination failures, and access limitations. Search indexing can lag, so use this inventory for administration rather than a capped search result.

A convenient discovery alternative is `gh search repos --owner OWNER --topic TOPIC --limit 100 --json fullName,url,isArchived,isPrivate`. This is bounded search, not complete inventory. [GitHub CLI search reference](https://cli.github.com/manual/gh_search_repos).

Bulk changes require a fixed reviewed repository list and a per-repository before/add/remove/after plan. Re-read each baseline immediately before applying. Skip no failures silently; stop and report completed, failed, and untouched targets. Topic selection is a filter, not authorisation for the selected administration action.
