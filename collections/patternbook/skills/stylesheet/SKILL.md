---
id: stylesheet
name: stylesheet
title: Patternbook Stylesheet Rules
description: Apply Patternbook authoring rules (CSS001 and up) when writing, editing, refactoring, or reviewing stylesheets - CSS, SCSS, PostCSS, CSS modules, Tailwind classes, or inline styles. Use before choosing units, layout techniques, or property values so that project-wide CSS rules, such as full viewport height handling, are followed consistently.
metadata:
  version: "1.1.0"
---

Authoring rules for stylesheet work. Each rule is one file in `rules/` and has a stable `CSS###` ID. The rules describe how to write new styles and how to correct existing styles that you touch.

## When to apply

Apply this skill whenever you write, edit, refactor, or review styles in any form:

* `.css`, `.scss`, `.sass`, `.less`, and `.pcss` files
* `<style>` blocks in HTML, Astro, Vue, Svelte, or similar components
* CSS modules and CSS-in-JS
* Tailwind or other utility classes
* inline `style` attributes

For visual design decisions, such as colour, spacing, typography, or depth, also apply the `visual-design` skill.

## Procedure

1. Read the rule index below. Open the rule file for each rule whose trigger matches the current change.
2. Apply the matching rules to new code.
3. In code that you change anyway, fix violations of matching rules. Do not change unrelated files only to satisfy a rule unless the user asks for it.
4. If a rule conflicts with an explicit user instruction or a project convention, follow the user or project and state the rule ID that you did not follow.
5. If you break a rule on purpose because of a documented exception, name the rule ID and the exception in your reply.
6. When reviewing, report each violation as `CSS001: <short finding>`, with the file, the line, and the suggested fix.
7. When rules change an implementation decision, list their IDs in the final summary of your reply, for example `CSS: 001`. Do not put rule IDs in source code comments.

## Rule index

| ID | Title | Trigger |
| :--- | :--- | :--- |
| [`CSS001`](rules/css001-viewport-height.md) | Use small or dynamic viewport units for full height | Any height, min-height, max-height, block-size, or inset value based on the viewport height, such as `100vh`, `h-screen`, or `min-h-screen` |

## Rule file format

Each file in `rules/` is named `<id>-<slug>.md` in lowercase and uses this shape. Keep the shape when you add rules.

```markdown
---
id: <rule ID, for example CSS002>
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
