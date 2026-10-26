---
id: A11Y005
title: Preserve keyboard operation and focus
applies-when: Building or reviewing controls, composite widgets, overlays, or focus management.
---

## Rule

Use native keyboard behaviour first. Every operation must be available from the keyboard, with predictable focus order and a visible focus indicator. Keep focus at least partially visible under sticky content and overlays (WCAG 2.4.11, AA); keeping it fully visible is a stronger design goal.

* Keep ordinary controls in DOM order. Avoid positive `tabindex`. Static content normally stays outside the tab sequence; use `tabindex="-1"` when it needs programmatic focus.
* Hidden or collapsed content must not leave operable controls in the tab sequence. `aria-hidden` alone does not prevent focus.
* Follow the specific APG pattern for custom composites. With roving tabindex, one child has `tabindex="0"`, other participating children have `-1`, and arrow-key movement updates both tabindex and DOM focus. Do not also add a container tab stop by default.
* With `aria-activedescendant`, keep DOM focus on the supported controlling element, reference a valid active descendant under the role's ownership requirements, and update its visual indication and scroll position. A combobox may keep focus on its input; not every pattern focuses a container.
* Distinguish focus from selection. Choose initial focus, remembered focus, and selection behaviour according to the widget pattern, rather than always selecting the first item.
* Test Tab, Shift+Tab, activation keys, widget-specific arrows, and dismissal. Buttons support Enter and Space; links normally activate with Enter. Do not impose one key map on all controls.
* Prevent traps. Modal dialogs need deliberate initial focus, containment, a keyboard close mechanism, and focus restoration. Ordinary disclosures and non-modal surfaces do not automatically need containment.

## Check

Complete the affected task with the keyboard in the rendered interface, including opening, closing, validation, and removal of focused content.

## Sources

* [WCAG 2.2: keyboard and focus criteria](https://www.w3.org/TR/WCAG22/)
* [APG: developing a keyboard interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
