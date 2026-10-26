---
id: A11Y006
title: Keep site navigation predictable
applies-when: Building or reviewing site navigation, disclosure links, or bypass mechanisms.
---

## Rule

Use a named `nav` landmark where needed, lists of links, and native buttons for disclosures. Preserve consistent navigation order across pages. Ordinary site navigation uses Tab and Shift+Tab; do not remove links or disclosure buttons from the tab sequence to imitate an application menu.

* Keep disclosure `aria-expanded` synchronised with visibility. Collapsed links must not remain focusable; expanded links must be reachable.
* Arrow-key navigation is optional for disclosure navigation and must supplement normal Tab navigation. Use `menu` or `menubar` only when implementing the complete application-style widget pattern, not merely because a navigation bar has dropdowns.
* Provide a working way to bypass repeated blocks at page/layout level. A skip link near the start of the page is a useful default; make it visible on focus, and verify that activation moves navigation to the intended content. Do not require a separate skip link in every component or claim it is the only WCAG technique.

## Check

Test the collapsed and expanded states, focus return on Escape where supported, and the bypass destination with the keyboard.

## Sources

* [APG: disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
* [WCAG: bypass blocks](https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html)
