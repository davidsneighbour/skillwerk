---
id: accessible-design
name: accessible-design
title: Patternbook Accessible Design Rules
description: Apply Patternbook accessibility rules (A11Y001 and up) when designing, implementing, or reviewing user interfaces - text contrast, muted and placeholder text, non-text contrast of control boundaries, icons, focus and state indicators, disabled controls, and native disabled versus aria-disabled. Use when choosing text or control colours, styling interactive states, or disabling controls, and for accessibility reviews that need rule-based findings.
metadata:
  version: "1.0.0"
---

Accessibility rules for interface work. Each rule is one file in `rules/` and has a stable `A11Y###` ID. The rules are based on WCAG 2.2 level AA.

## When to apply

Apply this skill when you design, implement, or review:

* the colour, opacity, or background of any text, including muted, secondary, helper, and placeholder text
* boundaries, icons, focus indicators, and state indicators of interactive controls
* disabled, inactive, or unavailable controls
* themes, including dark mode and forced colours mode

For visual design decisions, also apply the `visual-design` skill. For CSS authoring rules, also apply the `stylesheet` skill.

## Precedence

Accessibility rules take precedence over `DSG###` visual design rules and `CSS###` stylesheet rules. If a design rule would reduce contrast below an `A11Y###` minimum, follow the accessibility rule and state both rule IDs.

## Procedure

1. Read the rule index below. Open the rule file for each rule whose trigger matches the current change.
2. Apply the matching rules to new work.
3. In work that you change anyway, fix violations of matching rules. Do not change unrelated components only to satisfy a rule unless the user asks for it.
4. Measure contrast with a calculation or a tool, not by eye. State the measured ratio in findings.
5. If a rule conflicts with an explicit user instruction, follow the user, state the rule ID, and say which accessibility requirement is not met.

## Review procedure

Use the rule index as the review checklist. Report only relevant findings, not compliant rules. Report each violation on one line:

```text
A11Y001: Helper text #9ca3af on #ffffff is 2.54:1; use at least 4.5:1.
```

For detailed findings, add the file, the reason, and the suggested fix as sub-items.

When rules change an implementation decision, list their IDs in the final summary of your reply, for example `A11Y: 001, 004`. Do not put rule IDs in source code comments.

## Rule index

| ID | Title | Trigger |
| :--- | :--- | :--- |
| [`A11Y001`](rules/a11y001-meet-text-contrast-for-all-meaningful-text.md) | Meet text contrast requirements for all meaningful text | Colour, opacity, or background of any text, including muted, secondary, helper, or placeholder text |
| [`A11Y002`](rules/a11y002-meet-non-text-contrast-for-controls-and-states.md) | Meet non-text contrast requirements for controls and states | Boundaries, icons, focus indicators, or state indicators of interactive controls |
| [`A11Y003`](rules/a11y003-keep-disabled-controls-recognisable.md) | Keep disabled controls recognisable and explain why they are unavailable | Styling or designing a disabled, inactive, or unavailable control |
| [`A11Y004`](rules/a11y004-prefer-native-disabled-over-aria-disabled.md) | Prefer native disabled over aria-disabled | Disabling a control, link, menu item, or custom widget |

## Rule file format

Each file in `rules/` is named `<id>-<slug>.md` in lowercase and uses this shape. Keep the shape when you add rules.

```markdown
---
id: <rule ID, for example A11Y005>
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
* Deprecate rules instead of deleting them. Keep the file, add `deprecated: true` to its frontmatter, and mark the rule as deprecated in the index.
