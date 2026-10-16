---
id: stylesheet
name: stylesheet
title: Patternbook Stylesheet Rules
description: Apply Patternbook authoring rules when writing, editing, refactoring, or reviewing stylesheets - CSS, SCSS, PostCSS, CSS modules, Tailwind classes, or inline styles. Use before choosing units, layout techniques, or property values so that project-wide CSS rules, such as full viewport height handling, are followed consistently.
metadata:
  version: "1.0.0"
---

Authoring rules for stylesheet work. Each rule is one file in `rules/`. The rules describe how to write new styles and how to correct existing styles that you touch.

## When to apply

Apply this skill whenever you write, edit, refactor, or review styles in any form:

* `.css`, `.scss`, `.sass`, `.less`, and `.pcss` files
* `<style>` blocks in HTML, Astro, Vue, Svelte, or similar components
* CSS modules and CSS-in-JS
* Tailwind or other utility classes
* inline `style` attributes

## Procedure

1. Read the rule index below. Open the rule file for each rule whose trigger matches the current change.
2. Apply the matching rules to new code.
3. In code that you change anyway, fix violations of matching rules. Do not change unrelated files only to satisfy a rule unless the user asks for it.
4. If a rule conflicts with an explicit user instruction or a project convention, follow the user or project and state the rule ID that you did not follow.
5. If you break a rule on purpose because of a documented exception, name the rule ID and the exception in your reply.
6. When reviewing, report violations with the rule ID, the file and line, and the suggested fix.

## Rule index

| ID | Title | Trigger |
| :--- | :--- | :--- |
| `viewport-height` | Use small or dynamic viewport units for full height | Any height, min-height, max-height, block-size, or inset value based on the viewport height, such as `100vh`, `h-screen`, or `min-h-screen` |

## Rule file format

Each file in `rules/` uses this shape. Keep the shape when you add rules.

```markdown
---
id: <rule-id, same as the file name>
title: <short imperative title>
applies-when: <one sentence that describes the trigger>
---

## Rule
## Do
## Don't
## Why
## Exceptions
## Sources
```

Add every new rule to the rule index in this file in the same change.
