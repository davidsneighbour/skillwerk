# Skillwerk

Skillwerk is a monorepo for independently installable agent-skill collections.

The repository owns development tooling, validation, maintenance automation, and releases. Each collection retains its own scope, documentation, versioning, and distribution. Collections must not require other Skillwerk collections to be installed.

* [Architecture](ARCHITECTURE.md)
* [Manual skill reviews](docs/skill-reviews.md)

## Collections

* **[Posthaste](collections/posthaste/README.md)**
  * **Tagline:** Prepare it. Adapt it. Send it forth.
  * **Scope:** Communication through social networks, including drafting and adapting posts, platform-specific formatting, cross-posting, hashtags, media selection, attribution, review, scheduling, and publishing workflows.
* **[Clerkwork](collections/clerkwork/README.md)**
  * **Tagline:** Keeping repositories in good order.
  * **Scope:** Repository engineering and project management, including setup, configuration, issues, branches, pull requests, releases, dependencies, CI, security, maintenance, documentation, and administrative workflows.
* **[Idiolect](collections/idiolect/README.md)**
  * **Tagline:** Your meaning, in your voice.
  * **Scope:** Written-output transformation, including personal voice, tone, phrasing, register, terminology, audience adaptation, and stylistic consistency. It acts as a finishing layer without changing facts or externally imposed requirements.
* **[Patternbook](collections/patternbook/README.md)**
  * **Tagline:** Patterns for better digital work.
  * **Scope:** Digital design and presentation, including design systems, branding, typography, colour, composition, interface patterns, responsive design, usability, accessibility, visual audits, consistency checks, and design recommendations.
* **[Gazetteer](collections/gazetteer/README.md)**
  * **Tagline:** Describe it. Place it. Make it findable.
  * **Scope:** Search visibility and content discovery, including technical SEO, local SEO, content optimisation, metadata, structured data, entities, locations, service areas, internal linking, crawlability, indexing, and search-result presentation.
* **[Gallimaufry](collections/gallimaufry/README.md)**
  * **Tagline:** Useful things of every sort.
  * **Scope:** Small, specialised, and miscellaneous skills that do not naturally belong to one of the established collections. It serves as an incubator for independent utilities, experiments, and emerging groups of related skills that may later justify their own repository.
* **[Apparatus](collections/apparatus/README.md)**
  * **Tagline:** AI skills for operating browsers and other technical machinery.
  * **Scope:** Practical, tool-driven skills for operating browsers, diagnostics, media utilities, and other reusable technical machinery, including deterministic web screenshots and reusable machine-local runtimes.
* **[Fettle](collections/fettle/README.md)**
  * **Tagline:** A plugin-first engineering system for agent skills.
  * **Scope:** Agent-skill engineering, including lightweight execution evidence, deduplicated findings, inspection, observation, engineering, proof, and collection stewardship through five portable workflows: Inspector, Observer, Engineer, Prover, and Steward.

## Install a collection

Replace `<collection>` with `apparatus`, `clerkwork`, `fettle`, `gallimaufry`, `gazetteer`, `idiolect`, `patternbook`, or `posthaste`:

```sh
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/<collection>/skills --yes
```

Each collection remains self-contained. Collection-specific versions use tags such as `clerkwork/v2.0.0`, and release archives contain one collection only.

## Release a collection

To see which collections have unreleased commits, run `npm run release:status`. It lists, for each collection, the commits since its last `<collection>/v*` tag, how many of them change no other collection (`own`), and the version bump that the release would propose. Add `--collection <collection>` to also list the commits.

Run the release from the repository root with a clean working tree and `GITHUB_TOKEN_CONTENT_PRIVATE` set:

```sh
npm run release:dry --workspace collections/<collection>
npm run release --workspace collections/<collection>
```

To release every collection that has unreleased commits, run `npm run release:changed:dry` and then `npm run release:changed`. The collections are released one after the other, and the run stops at the first failure.

The release covers one collection only:

* The version in `package.json` and in any plugin manifest (`.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`) changes.
* `CHANGELOG.md` lists only commits since the previous `<collection>/v*` tag that change files in `collections/<collection>/`. Commits that change only repository tooling do not appear.
* The release commit is `chore(release): <collection> v<version>`, the tag is `<collection>/v<version>`, and the GitHub release uses the same changelog entry as its notes.

The tag starts the release workflow. It runs `npm run check -- --collection <collection>`, packages the collection, runs the clean-room archive test, and attaches `<collection>.tar.gz` to the release.
