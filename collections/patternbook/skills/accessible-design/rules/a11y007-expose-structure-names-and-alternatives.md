---
id: A11Y007
title: Expose structure, names, and alternatives
applies-when: Creating or reviewing document structure, labels, graphics, or status information.
---

## Rule

Use native HTML to expose structure, names, roles, values, and states. ARIA adds semantics, not behaviour. Prefer plain language, consistent landmarks, descriptive page titles, and logical heading levels. One descriptive page-level `h1` is a useful convention, not a standalone WCAG requirement.

* Reduce unnecessary distractions and cognitive load. Keep task structure and instructions clear, and avoid competing prompts or decorative motion that obstructs the task. Identify usability advice separately from established WCAG failures.
* Give controls useful accessible names. Include visible label text in the accessible name, preferably at the start, for speech input. Distinguish repeated actions with context without losing their visible wording.
* Prefer visible native form labels; explicitly associate `for` with the control ID, or use valid wrapping labels. Placeholders do not replace labels. Icon-only buttons need an accessible name and an understandable visual cue; not every control needs visible text.
* Classify graphics by purpose, including SVGs, icon fonts, emojis, and CSS images. Informative graphics need equivalent information; functional graphics convey the action or destination; complex graphics need a fuller explanation when a short alternative is insufficient.
* Use `alt=""` for decorative HTML images. Hide redundant decorative icons from assistive technologies without hiding the containing control or meaningful content. Do not assign `role="img"` to every graphic or emoji. For an informative standalone SVG, use appropriate image semantics and an accessible name, and verify browser support.
* Do not convey meaning through colour alone. Provide text, shape, or another perceivable cue. Announce necessary status changes without moving focus; avoid excessive live regions and duplicate announcements.

## Check

Inspect rendered semantics and test meaningful output with a screen reader. Check that alternative text explains purpose in context, rather than merely describing appearance.

## Sources

* [WCAG 2.2: semantics and alternatives](https://www.w3.org/TR/WCAG22/)
* [WAI: images tutorial](https://www.w3.org/WAI/tutorials/images/)
* [WAI: form labels](https://www.w3.org/WAI/tutorials/forms/labels/)
