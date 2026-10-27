# Gazetteer release preparation review

Date: 2026-10-27.

## Scope and release state

Restored the nine Gazetteer stashes without dropping them. Patternbook and Gallimaufry stashes remain untouched. The collection now has 12 skills, including the router and two existing audit skills. Removed `dnb-` from all eight affected directory names, entry point identifiers, invocation examples, and agent prompts. Used `gazetteer-voice` because `voice` already exists in Posthaste; repository validation rejects duplicate skill names. The `[dnb.publishing]` configuration namespace remains compatible with the supplied drafts because it is not a skill slug.

The router links all 11 child skills. The README, skills.sh grouping, and Claude marketplace registration list the same inventory. Router version is now `1.1.0`; restored skills start at `1.0.0` because they are new to the current tracked tree. Collection release metadata is unchanged: allow the normal release tooling to choose and write the release version after acceptance and a coherent issue-linked commit. A minor release is recommended for the new capabilities; this is a recommendation, not a verified release-tool result.

## Repairs and remaining recommendations

The repairs below are verified in the prepared files. Recommendations are design assessments, not proof that all future invocations will behave correctly.

| Skill | Repairs made | Recommended follow-up or missing capability |
| --- | --- | --- |
| `gazetteer-llm-visibility` | Removed unsupported citation uplift claims, blanket provider claims, hidden AI messages, mandatory training opt-in, and mandatory Markdown infrastructure. Corrected reverse-link media types and cache variation guidance; added parity, protected-content, negotiation, and measurement checks. | Build a small HTTP fixture if a reusable negotiation implementation is added. Record actual client retrieval and citation evidence separately. Current guidance is a procedure, not a tested server implementation. |
| `gazetteer-voice` | Replaced missing root instruction dependencies in both the entry point and companion reference; retained the Patrick-specific editorial profile. | Compare its intended role with Idiolect before a future consolidation. Keep the current identity clear: this is Patrick-specific editing, not a general voice inference system. |
| `markdown-formatting` | Replaced missing root instruction files with authoritative CommonMark and GFM references. | Add renderer-specific examples if repeated work exposes differences, especially MDX and enabled Hugo extensions. The actual renderer configuration should decide extension support. |
| `blog-draft-meta-matter` | Removed a conflicting legacy version field; repaired README fences and invocation names. | Treat description and slug lengths as editorial defaults rather than universal SEO limits. Add locale-aware slug examples and URL collision checks when implementing deterministic metadata tooling. |
| `blog-draft-materialise` | Added traversal and symlink boundary checks, configuration validation, YAML escaping, field ownership, draft-state authorisation, and verified copy-before-delete guidance. Removed automatic commit advice. | A deterministic helper with fixture tests would materially improve reliability for existing frontmatter, dates, field subsets, duplicate targets, and same-source moves. These behaviours currently rely on agent execution of instructions. |
| `interface-design` | Added missing identity fields, removed obsolete upstream plugin, hook, funding, and Vercel files, preserved the MIT licence and attribution, linked review procedures, and corrected installation documentation. Added explicit precedence for accessibility and existing project design systems. | Consider moving the bundled Claude command references into a neutral references directory in a separate change. More of the inherited visual prescriptions could become conditional guidance; avoid treating craft preferences as functional blockers. |
| `interface-engineering` | Added accessibility and project-design precedence, a reduced-motion final-state requirement, and keyboard and rendered-state checks. Corrected the Tailwind transition claim and replaced unconditional GPU-compositing claims with profiling guidance. | Add small rendered examples for reduced motion, visible focus, forced colours, and touch behaviour. The inherited examples still need project-specific adaptation; no browser component implementation was tested in this task. |
| `post-into-void` | Corrected installed paths and Node commands, enabled credential-free dry runs, loaded configured dotenv credentials, tightened numeric and missing-argument validation, preserved supplied whitespace, and filtered result URLs to matching Mastodon status paths. Kept explicit publication confirmation. | Add server-aware counting and instance limits before describing counts as Mastodon-accurate. Consider pinning the tested Crosspost version and recording delivery identifiers. No live delivery was tested. |
| `post-session-into-void` | Applied the same runtime repairs while preserving its separate session-source boundary and length default. | Keep its distinction from supplied-text posting explicit. Add timeout and ambiguous-delivery fixtures before implementing retries. Review overlap with Posthaste before expanding destinations. |

The two publishing helpers remain separately bundled so each skill can be installed alone. Their runtime fixes have common behavioural tests. A future shared implementation must preserve that installation property rather than import from a sibling skill or root-only tooling.

## Suggested additions

1. Add a focused local-search workflow for business entities, service areas, location pages, and evidence-backed business data. These topics are advertised by the collection but currently have no dedicated non-audit workflow.
2. Add a technical search implementation workflow for canonical URLs, redirects, indexing controls, sitemaps, and internal links. Auditing and implementation have different inputs and completion criteria.
3. Add a metadata and structured-data implementation workflow grounded in the site's canonical content model. Keep traditional search support separate from speculative AI visibility claims.
4. Add a content refresh workflow that checks dated claims, broken links, duplication, and search intent while preserving editorial provenance.

These are recommendations, not added skills. First decide collection ownership: interface work overlaps Patternbook, Patrick-specific editing overlaps Idiolect, and Mastodon delivery overlaps Posthaste. Keeping the restored work in Gazetteer respects the requested scope, but expanding those areas without a clear boundary would increase routing ambiguity.

## Verification and limits

The scoped collection check passes, including code lint, Markdown lint, spelling, secret scanning, TypeScript, collection validation, skill validation, and 23 tests. Six publishing tests exercise both helpers with credential-free dry runs, invalid inputs, and a local provider stub that checks dotenv loading, exact message preservation, and status URL selection. No post was sent, and no real credentials were used by these tests.

The archive is built with `npm run package -- --collection gazetteer` and checked with `npm run test:archive -- --collection gazetteer`. The archive check installs into an empty project outside the checkout and checks installed files and dependencies. The router intentionally links sibling child skills; installing the router alone requires installing the selected subskill before following that route.

The shared Biome configuration reports an informational schema-version mismatch but does not fail the collection check. This task does not change that shared dependency configuration.

The user explicitly accepted all ten prepared skills after reviewing this preparation. Acceptance is recorded in `skill-reviews.json` against the final staged content, following [the manual review policy](skill-reviews.md). Automated checks do not constitute that acceptance. [Issue #77](https://github.com/davidsneighbour/skillwerk/issues/77) tracks this preparation. The user authorised committing, pushing, and removing the nine restored Gazetteer stashes after the push. No release tag or publication is part of this task.

## Sources checked

* [llms.txt proposal](https://llmstxt.org/): status and intended retrieval use; no guaranteed citation gains.
* [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1): Accept negotiation.
* [Crosspost documentation](https://github.com/humanwhocodes/crosspost/blob/main/README.md): CLI flags, Mastodon variables, and dotenv support.
* [W3C animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): reduced-motion considerations.
* [Tailwind transition documentation](https://tailwindcss.com/docs/transition-property): defined utility property lists.
* [MDN will-change reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change): rendering hints and performance limits.
