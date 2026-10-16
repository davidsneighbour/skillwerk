---
id: A11Y002
title: Meet non-text contrast requirements for controls and states
applies-when: Styling the boundaries, icons, focus indicators, or state indicators of interactive controls, such as inputs, checkboxes, radio buttons, toggles, tabs, and icon buttons.
---

## Rule

Active control boundaries, icons, and state indicators must meet the WCAG non-text contrast requirements: a contrast ratio of at least 3:1 against adjacent colours.

## Do

* Give a control boundary at least 3:1 when the boundary is the only visual way to identify the control, for example a text input without a background fill or a label inside it.
* Give icons at least 3:1 when they identify a control or its function, for example an icon-only button or the arrow of a drop-down.
* Give state indicators at least 3:1, for example checked, selected, pressed, expanded, and current states.
* Give focus indicators at least 3:1 against the adjacent colours.
* Measure against every adjacent colour, both inside and outside the control.

## Don't

* Do not use a light grey border such as `#d1d5db` on white (1.47:1) as the only visual sign of an input field.
* Do not show a state only through a small colour change that fails 3:1 against adjacent colours.
* Do not reduce the contrast of an icon that is the only identification of a control below 3:1, even when a design rule such as `DSG028` suggests lower icon contrast.

## Check

* A visible boundary is not required when the control has other visible content that identifies it, such as a text label or a sufficiently contrasting icon.
* State colours do not need 3:1 against each other unless they appear next to each other. The component must still keep 3:1 against its adjacent colours in each state.

## Exceptions

WCAG 1.4.11 does not apply to:

* inactive (disabled) components; see `A11Y003`
* components whose appearance is determined by the browser and not changed by the author
* hover-only effects

## Sources

* [W3C: Understanding SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)
