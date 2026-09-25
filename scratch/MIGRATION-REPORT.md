# Migration record

Recorded on 2026-09-25 from GitHub and verified full Git mirrors. Source repositories were not changed.

## Sources and imports

| Collection | Source head | Reachable commits across all refs | Import merge | Version | Licence | Open work |
| --- | --- | ---: | --- | --- | --- | --- |
| apparatus | `51785d30422c8f6c2095acf999c1d35eee1791c4` | 4 | `0067cb9ca812a7e39f7a604ab6d6caca71daf100` | 2.0.0 | MIT | PRs 2 and 3 |
| clerkwork | `e5a87032d6df2a7cdb9e281e1a9d0f6b855d6d13` | 32 | `d4b201ea707850dbc54fdda4cc691225563f5f18` | 2.0.0 | MIT | None open |
| fettle | `d7b9d918449b904bfc332ae716369ef80b34ef8b` | 3 | `4ed50240be59fbf4ca1fd629c25bf4f674e2b252` | 2.0.0 | MIT | PR 1 |
| gallimaufry | `9ef19740f65c2083b89f83786bc9dd1a858aced0` | 6 | `811f67737d27428a736f720fb1383e3841da028f` | 2.0.0 | MIT | None open |
| gazetteer | `78e0cb57a7fed047d26392eb4e052d0df33bf3f4` | 5 | `f4ecd35e471dd20ffff430038db7fa4672575f72` | 2.0.0 | MIT | None open |
| idiolect | `bb10f22d8014921655455618434ffb81ed04e867` | 8 | `bff924f886fc5d1874654aa6b75fd8a30712d05b` | 2.0.0 | MIT | None open |
| patternbook | `634341049447488d89db871e3bf8901c2224ac87` | 3 | `78ffdd9a372116374b5867ea16135133bce9abf8` | 2.0.0 | MIT | None open |
| posthaste | `e374b30ac1bb477bf4d76d4a9a5178cfc50b0392` | 48 | `81ea17494a1771e76e3130fa1289668bd9329890` | 2.0.0 | MIT | None open |

All default branches are `main`. All repositories are public, have GitHub Issues enabled, and do not have Discussions enabled. No homepage or GitHub Pages URL was configured. Existing releases remain available in their source repositories.

## Backups and refs

Complete verified bundles are in the ignored local directory `.migration/backups/`. Restore with `git clone .migration/backups/<collection>.bundle <destination>`. SHA-256 checksums:

| Bundle | SHA-256 |
| --- | --- |
| apparatus | `8a9f14e6902a642939e1250b91a5d9a52941b5c69bd0e0ba0d054aae4348ae44` |
| clerkwork | `57c9ceb2ca943d787b4d877f1eaf238d771aa4855ae1547b3dec9dba8efbde5a` |
| fettle | `029221114bb6356242ca3fa944a17693601cbcd69350d85163b4284930582eb8` |
| gallimaufry | `21fca3debf1081cfc5c01bf72711f11dd47ce5e85beacba048fead1429e0bb64` |
| gazetteer | `70a0120e639d08f642a71175a66c99366b5b3a06f38e1f64ddfd8d3b21189498` |
| idiolect | `468bdaed33c5585f85c09f7af49cf575753ce029fc9ee664931f6b458f74b920` |
| patternbook | `112bbd02fb81bd662a32aecee6407264a3af08f954602b85735271ac93566fe6` |
| posthaste | `0a81b45e6043518e5b18dd5557442ff66271787bc2bdfd872a13f783ee40d757` |

Source branches and annotated tags are retained under `refs/archive/<collection>/heads/*` and `refs/archive/<collection>/tags/*`. Push these refs explicitly during cutover; ordinary `git push` does not publish custom refs.

## Distribution contract

Install one collection from its scoped GitHub tree URL:

```sh
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/<collection>/skills --yes
```

Create an isolated archive with `npm run package -- --collection <collection>`. Release tags use `<collection>/v<version>`. The release workflow attaches only that collection's archive. Existing source repository install URLs remain valid until a separate cutover decision is made.

## Verification and known debt

Every source head is an ancestor of the current repository history. Each imported tree matched its source tree at its import merge. All eight packaged collections passed isolated discovery with the current `skills` installer. Root validation found 39 skills and rejected cross-collection links.

Clerkwork's source `npm run check` had existing failures. Its skill metadata validator initially found nine missing or invalid entries; these were corrected after import, and TypeScript, metadata validation, and tests pass. Its Markdown lint step still reports 1,813 pre-existing findings under the current shared Markdown configuration. `npm ci` also reported three high-severity development dependency advisories. These are recorded debt, not hidden migration successes.

The Skillwerk main branch, archival refs, and eight collection-specific 2.0.0 tags and releases are published. Each release includes its isolated collection archive. The source repositories, their releases, issues, and pull requests remain unchanged; source-repository redirects or archival decisions remain a manual follow-up.

## Close-out audit

The migration is complete, but the following plan items were not implemented exactly as written or were deliberately changed:

* The Clerkwork pilot was imported directly on `main`, not in a disposable clone or dedicated migration branch.
* The pilot's full source `npm run check` did not pass because of existing Markdown lint findings. Functional TypeScript, skill validation, and tests passed, and the migration continued with that debt recorded.
* Clean-room verification used `skills add <isolated-path> --list` to verify discovery from each extracted archive. It did not perform a full installation into every supported agent host.
* CI validates skill structure, rejects collection-escaping Markdown links, packages each collection, and uploads the archive. It does not execute the `skills` installer against each archive or comprehensively analyse runtime imports.
* Fettle's Claude and Codex plugin validation command was not run during the final collection test pass. Its TypeScript checks and tests passed.
* Existing open source work was recorded here, but Apparatus PRs 2 and 3 and Fettle PR 1 were not copied into the Skillwerk issue tracker.
* The eight initial 2.0.0 releases were published directly with `gh release create`. GitHub did not emit release-workflow runs because all eight tags were pushed together; future individual collection tags use the shared release workflow.
* All eight collections were deliberately reset to a shared `2.0.0` cutover baseline instead of continuing their inherited version sequences. Releases are independent after that baseline.
* MIT was standardised across all eight collection copies. Apparatus and Fettle had no licence detected at source, and existing MIT files were normalised to one text.
* Post-import validation corrections changed Clerkwork metadata and Idiolect skill identity and manifests. The import commits retain exact source trees, but the current collection trees intentionally include these fixes.
* Complete backup bundles remain local and ignored under `.migration/backups/`; published archival refs provide the remote historical preservation layer.
* One shared tag-driven workflow implements independent collection releases instead of eight duplicated workflow files.
* Original repository disposition, redirects, and archival remain a manual follow-up by explicit owner decision. The source repositories were not modified.
* Markdown lint debt and reported dependency advisories were explicitly deferred to the later DNBHQ configuration work.
