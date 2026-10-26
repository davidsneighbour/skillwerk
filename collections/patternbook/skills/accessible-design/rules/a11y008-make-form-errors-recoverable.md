---
id: A11Y008
title: Make form errors recoverable
applies-when: Designing or reviewing form requirements, validation, or submission.
---

## Rule

Explain required input and expected formats before submission. Use native `required` where supported; use `aria-required` for custom controls where needed, rather than requiring both attributes everywhere. An unexplained asterisk is insufficient.

* Associate help and inline error text with controls, commonly through `aria-describedby`. Set `aria-invalid="true"` for detected errors, and clear or reset it when resolved.
* Identify the invalid field, explain the problem, and give a correction when known. Preserve entered values where possible.
* Choose focus recovery for the form: an error summary with links to fields or the first invalid control may be appropriate. Do not always force focus to the first field or announce the same error through several mechanisms.
* Prefer allowing submission to reveal useful errors rather than disabling submission solely because the form is incomplete. If disabling is justified, explain what is needed and apply A11Y003 and A11Y004.

## Check

Test empty, invalid, corrected, and successful submissions with the keyboard and a screen reader. Confirm that errors can be found and corrected without losing valid input.

## Sources

* [WAI: validating input](https://www.w3.org/WAI/tutorials/forms/validation/)
* [WAI: user notifications](https://www.w3.org/WAI/tutorials/forms/notifications/)
