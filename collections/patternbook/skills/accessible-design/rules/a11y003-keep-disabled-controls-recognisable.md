---
id: A11Y003
title: Keep disabled controls recognisable and explain why they are unavailable
applies-when: Styling or designing a disabled, inactive, or unavailable control.
---

## Rule

Genuinely disabled controls are exempt from the contrast minima. They must still be visible enough for users to recognise the control and to understand why it is unavailable.

## Do

* Keep the shape, label, and position of the control visible, so users can see that the control exists.
* Tell users why the control is unavailable and what makes it available, for example with visible text next to the control or text connected with `aria-describedby`.
* Add a disabled style for forced colours mode, for example `color: GrayText` and `border-color: GrayText` in `@media (forced-colors: active)`.

## Don't

* Do not fade a disabled control so much that users cannot read its label or see that it is a control.
* Do not put the reason only in a `title` attribute or a hover-only tooltip.
* Do not style an active control as disabled. The exemption applies only to controls that cannot be operated.

## Why

WCAG 1.4.3 and 1.4.11 exempt inactive components from contrast minima, but users still need to find the control, read its label, and know how to make it available. A control that is hard to see without a reason leaves users stuck.

## Sources

* [W3C: Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
* [W3C: Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
* [MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
