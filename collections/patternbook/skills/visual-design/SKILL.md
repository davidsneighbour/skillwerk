---
id: visual-design
name: visual-design
title: Patternbook Visual Design Rules
description: Apply Patternbook visual design rules (DSG001 and up) when designing, implementing, or reviewing user interfaces - colour, contrast, neutrals, spacing, alignment, grids, typography, line length, buttons, corner radii, borders, shadows, depth, and icons. Use when building or changing UI components, pages, themes, or design tokens, and for design or implementation reviews that need rule-based findings.
metadata:
  version: "1.1.0"
---

Visual design rules for interface work. Each rule is one file in `rules/` and has a stable `DSG###` ID.

The rules are defaults, not absolutes. Break a rule only for a deliberate design reason, and state that reason.

Source basis: [Anthony Hobday, Visual design rules you can safely follow every time](https://anthonyhobday.com/sideprojects/saferules/).

## When to apply

Apply this skill when you design, implement, or review visual properties of an interface:

* colours, palettes, neutrals, and themes, including dark themes
* spacing, sizing, alignment, and grids
* typography, font sizes, line height, letter spacing, and line length
* buttons, containers, borders, corner radii, shadows, and depth
* icons next to text
* design tokens and design system values

For CSS authoring rules, such as which units to use, also apply the `stylesheet` skill. For contrast, disabled controls, and other accessibility requirements, also apply the `accessible-design` skill. Its `A11Y###` rules take precedence over `DSG###` rules.

## Procedure

1. Read the rule index below. Open the rule file for each rule whose trigger matches the current change.
2. Apply the matching rules to new work.
3. In work that you change anyway, fix violations of matching rules. Do not change unrelated components only to satisfy a rule unless the user asks for it.
4. If a rule conflicts with an explicit user instruction or a project design system, follow the user or the design system and state the rule ID that you did not follow.
5. Keep deliberate exceptions apart from accidental violations. Document the reason when you break a rule on purpose.

## Review procedure

Use the rule index as the review checklist. For each rule:

* check whether the implementation complies;
* report only relevant findings, not compliant rules;
* refer to each finding by its rule ID; and
* mark deliberate exceptions as exceptions, not as violations.

Report each violation on one line:

```text
DSG020: Body copy computes to 14px; use at least 16px unless this is intentionally secondary text.
```

For detailed findings, use:

```markdown
* `DSG021` - Body text exceeds the preferred readable line length.
  * File: `src/components/Article.astro`
  * Reason: The content column has no effective maximum width.
  * Suggested fix: Add an appropriate `max-width`, for example using `ch`.
```

## Rule application trace

When rules change an implementation decision, list them in the final summary of your reply. Do not list rules that you only checked. Do not put the trace in source code comments or production output.

Use the shortest useful form:

```text
DSG: 019, 024, 027
```

Add context when it helps:

```text
DSG019: card spacing
DSG024: nested radii
DSG027: depth treatment
```

## Rule index

| ID | Title | Trigger |
| :--- | :--- | :--- |
| [`DSG001`](rules/dsg001-use-near-black-and-near-white-instead-of-pure-black-and-white.md) | Use near-black and near-white instead of pure black and white | Choosing text, background, or surface colours, especially black or white values. |
| [`DSG002`](rules/dsg002-saturate-neutrals.md) | Saturate neutrals | Defining grey or neutral colours in a palette that has a colour direction. |
| [`DSG003`](rules/dsg003-use-high-contrast-for-important-elements.md) | Use high contrast for important elements | Deciding the contrast of content, controls, borders, dividers, shadows, or decoration. |
| [`DSG004`](rules/dsg004-make-every-design-decision-deliberate.md) | Make every design decision deliberate | Setting any visual value, such as spacing, size, colour, border, radius, or shadow. |
| [`DSG005`](rules/dsg005-prefer-optical-alignment-where-mathematical-alignment-looks-wrong.md) | Prefer optical alignment where mathematical alignment looks wrong | Centring or aligning icons, shapes, or text inside other elements. |
| [`DSG006`](rules/dsg006-adjust-letter-spacing-and-line-height-with-text-size.md) | Adjust letter spacing and line height with text size | Setting letter spacing or line height for text at any size. |
| [`DSG007`](rules/dsg007-make-container-borders-contrast-with-both-adjacent-surfaces.md) | Make container borders contrast with both adjacent surfaces | Adding a border to a container that sits on another surface. |
| [`DSG008`](rules/dsg008-align-every-element-with-something.md) | Align every element with something | Positioning elements in a layout. |
| [`DSG009`](rules/dsg009-give-palette-colours-distinct-brightness-values.md) | Give palette colours distinct brightness values | Defining or reviewing palette or accent colours. |
| [`DSG010`](rules/dsg010-keep-saturated-neutrals-consistently-warm-or-cool.md) | Keep saturated neutrals consistently warm or cool | Defining tinted neutral colours. |
| [`DSG011`](rules/dsg011-relate-measurements-mathematically.md) | Relate measurements mathematically | Choosing spacing, sizing, or dimension values. |
| [`DSG012`](rules/dsg012-order-sequential-elements-by-visual-weight.md) | Order sequential elements by visual weight | Arranging a row or column of elements with different visual weights, such as button groups. |
| [`DSG013`](rules/dsg013-use-12-columns-for-horizontal-grid-systems.md) | Use 12 columns for horizontal grid systems | Defining a horizontal column grid. |
| [`DSG014`](rules/dsg014-measure-spacing-between-points-of-high-contrast.md) | Measure spacing between points of high contrast | Judging or adjusting the visible space between elements. |
| [`DSG015`](rules/dsg015-make-visually-closer-surfaces-lighter.md) | Make visually closer surfaces lighter | Choosing surface colours for elevated elements, such as cards, menus, or dialogs. |
| [`DSG016`](rules/dsg016-set-drop-shadow-blur-to-twice-its-distance.md) | Set drop-shadow blur to twice its distance | Defining a drop shadow. |
| [`DSG017`](rules/dsg017-pair-simple-with-complex.md) | Pair simple with complex | Placing content on a background image, pattern, or other complex surface. |
| [`DSG018`](rules/dsg018-keep-container-brightness-differences-within-limits.md) | Keep container brightness differences within limits | Choosing the colour of a container relative to its background. |
| [`DSG019`](rules/dsg019-make-outer-padding-at-least-as-large-as-inner-padding.md) | Make outer padding at least as large as inner padding | Setting padding in a container that holds several items. |
| [`DSG020`](rules/dsg020-keep-body-text-at-16px-or-above.md) | Keep body text at 16px or above | Setting the font size of body text. |
| [`DSG021`](rules/dsg021-keep-text-lines-around-70-characters.md) | Keep text lines around 70 characters | Setting the width of a column that holds prose. |
| [`DSG022`](rules/dsg022-make-button-horizontal-padding-twice-vertical-padding.md) | Make button horizontal padding twice vertical padding | Setting button padding. |
| [`DSG023`](rules/dsg023-use-no-more-than-two-typefaces.md) | Use no more than two typefaces | Choosing or adding typefaces. |
| [`DSG024`](rules/dsg024-calculate-nested-corner-radii.md) | Calculate nested corner radii | Setting the corner radius of a rounded element inside another rounded element. |
| [`DSG025`](rules/dsg025-avoid-adjacent-hard-visual-divides.md) | Avoid adjacent hard visual divides | Separating areas with borders, dividers, or background changes. |
| [`DSG026`](rules/dsg026-avoid-shadows-in-dark-interfaces.md) | Avoid shadows in dark interfaces | Adding depth to elements in a dark theme. |
| [`DSG027`](rules/dsg027-use-one-depth-technique-consistently.md) | Use one depth technique consistently | Choosing how elements show elevation or depth. |
| [`DSG028`](rules/dsg028-reduce-icon-contrast-when-paired-with-text.md) | Reduce icon contrast when paired with text | Placing an icon next to a text label. |

## Rule file format

Each file in `rules/` is named `<id>-<slug>.md` in lowercase and uses this shape. Keep the shape when you add rules.

```markdown
---
id: <rule ID, for example DSG029>
title: <short imperative title>
applies-when: <one sentence that describes the trigger>
---

## Rule
## Why        (optional)
## Do         (optional)
## Don't      (optional)
## Check      (optional)
## Exceptions (optional)
## Sources
```

## Maintenance

* Do not renumber or reuse rule IDs.
* Give a new rule the next free ID and add it to the rule index in the same change.
* Keep the ID when you extend a rule.
* When you split a rule, keep the original ID for the main rule and give new IDs to the other rules.
* When you merge rules, keep both IDs visible unless the user asks for a cleanup.
* Deprecate rules instead of deleting them. Keep the file, add `deprecated: true` to its frontmatter, and mark the rule as deprecated in the index.
* Do not change the `DSG` prefix without an explicit ID migration.
