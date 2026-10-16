---
id: A11Y001
title: Meet text contrast requirements for all meaningful text
applies-when: Choosing or reviewing the colour, opacity, or background of any text, including muted, secondary, helper, or placeholder text.
---

## Rule

All meaningful text must meet the WCAG text contrast requirements. This includes captions, metadata, helper text, placeholders, and secondary content. Muted text must remain readable.

## Do

* Give normal text a contrast ratio of at least 4.5:1 against its background.
* Give large text a contrast ratio of at least 3:1. Large text is at least 18pt (about 24px), or at least 14pt bold (about 18.5px bold).
* Make muted text quieter with a lighter weight, a smaller size, or a colour that still passes, such as `#767676` on white (4.54:1).
* Measure the colour that the user actually sees. When text uses `opacity`, a transparent colour, or sits on an image or gradient, measure against the composed colours at the lowest-contrast point.
* Check text that shows only on hover or focus, such as tooltips.
* Check every theme, including dark mode.

## Don't

* Do not use `#999999` on white (2.85:1) or Tailwind `gray-400` (`#9ca3af`) on white (2.54:1) for readable text.
* Do not exempt placeholders, captions, timestamps, footnotes, or legal text because they are secondary.
* Do not make text muted only by reducing its opacity until it fails.

## Why

Low-contrast text is hard or impossible to read for people with low vision, colour vision deficiencies, or ageing eyes, and for everyone on poor screens or in bright light. Secondary text often carries information that users need, such as error hints, dates, or input formats.

## Exceptions

WCAG 1.4.3 sets no contrast requirement for:

* text in an inactive (disabled) user interface component; see `A11Y003`
* text that is pure decoration or not visible to anyone
* text that is incidental in a picture with significant other visual content
* text that is part of a logo or brand name

## Sources

* [W3C: Understanding SC 1.4.3 Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
