# Visual design principle consolidation review

Date: 2026-10-27.

## Scope

Consolidate the sole file in stash `be2617bde50e50d9378189c4b776f89b24ebdfdf`, `collections/patternbook/skills/patternbook/references/principles-for-good-design-by-dieter-rams.md`, into the existing `visual-design` skill. The stash is retained pending user acceptance and later cleanup. The source draft is not installed as a separate reference or skill.

## Coverage and duplication decisions

| Stashed principle | Consolidated location | Decision |
| --- | --- | --- |
| GDR01: innovation | DSG029 | Add a concrete user-benefit test for new patterns and technology. |
| GDR02: usefulness | DSG029 and DSG031 | Connect new choices and visual restraint to the user's task. |
| GDR03: aesthetics | DSG004 | Extend the existing deliberate-design rule to assess composition and finishing across states; avoid a subjective beauty test. |
| GDR04: understanding | DSG030 | Add explicit checks for grouping, action purpose, and feedback. |
| GDR05: unobtrusiveness | DSG031 | Add task-focused restraint, with room for expressive briefs. |
| GDR06: honesty | DSG032 | Add checks for truthful capabilities, state, results, and choice presentation. |
| GDR07: longevity | DSG033 | Add durable-pattern and maintenance checks with time-limited exceptions. |
| GDR08: detail | DSG004 | Reuse the existing rule rather than creating a duplicate ID. |
| GDR09: environment | DSG034 | Adapt to resource-aware visual choices; prohibit unsupported environmental savings claims. |
| GDR10: simplicity | DSG031 | Consolidate with restraint, retaining necessary information, accessibility cues, and choice. |

Existing DSG003 and DSG017 address contrast hierarchy and foreground/background complexity, but do not cover task relevance, honest representation, understandable actions, or resource cost. They remain unchanged. No existing rule IDs are removed or renumbered.

The new checks are Patternbook's interface adaptations of the principles, not quotations or claims that Dieter Rams specified web implementation techniques. The [Rams Foundation source](https://rams-foundation.org/foundation/design-comprehension/theses/) was checked. Attribution is included in every new rule and the amended DSG004 rule. The skill entry point indexes all additions and expands its triggers. Its version increases from `1.1.0` to `1.2.0` for new review capabilities.

## Constraints and review limits

Existing precedence for explicit user instructions, project design systems, and accessibility rules remains in force. Innovation does not require new dependencies; restraint does not mean removing needed content; durability does not forbid campaigns; resource optimisation does not justify removing accessibility or required content. Findings must identify observable problems or conflicts with the stated purpose rather than personal taste.

The scoped Patternbook check passed, including lint, spelling, secret scanning, TypeScript, collection and skill validation, and 17 repository-tooling tests. The packaged archive installed all four skills in a clean project. The review document passed Markdown and spelling checks. The staged version gate checks the final version increase. It does not prove the outcome of future design reviews, establish accessibility conformance, or measure environmental impact. No UI implementation or browser behaviour is changed.

## Acceptance and next step

The user explicitly accepted the final staged `visual-design` content and authorised commit and cleanup. Acceptance is recorded against its staged fingerprint in `skill-reviews.json`. [Issue #79](https://github.com/davidsneighbour/skillwerk/issues/79) tracks the consolidation. Remove only the identified source stash after the commit is pushed; preserve the other stashes.
