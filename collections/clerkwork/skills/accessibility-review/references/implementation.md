# Accessible implementation

## Semantic HTML and alternatives

Use native elements for their intended purpose: buttons for actions, links with real destinations for navigation, and native form controls for input. Use landmarks, headings, lists, and table headers to represent the content's actual structure. Do not add redundant roles to native elements or use ARIA to conceal a semantic mismatch.

Set the document language at page/layout level and identify changes of language where needed. Use logical heading levels and meaningful page titles. Keep DOM reading and focus order consistent with the intended visual order.

Give each image an appropriate text-alternative strategy. Informative images need useful alternatives in context. Decorative or fully redundant images may use `alt=""`; do not omit the attribute on decorative HTML images. Functional images need an alternative that conveys the action or destination. Complex diagrams need an equivalent explanation. Hide decorative icons from assistive technologies only when the containing control has an accessible name. Do not hide meaningful content or focusable elements with `aria-hidden`.

Provide captions, transcripts, and audio description as required by the media type and applicable WCAG criteria. Do not assume one alternative fulfils every requirement for audio and video.

At site/layout level, provide a way to bypass repeated navigation or content blocks. A skip link to the main content is a useful approach: ensure it becomes visible on focus and that its target works. Do not add duplicate skip links to every reusable component.

## Labels, forms, and errors

Prefer a visible `<label>` associated with each form control. Use `fieldset` and `legend` for related groups where appropriate. A placeholder is not a label. Use `aria-labelledby` to associate existing visible text when native labelling cannot express the relationship. Use `aria-label` only when an appropriate visible label is not suitable; do not replace useful visible labels with hidden names. The accessible name must include any visible label text to support speech input.

Make required fields and expected formats clear before submission. Associate instructions and error messages with the relevant controls, expose invalid states, and describe how to correct errors. Retain entered values where possible. Move focus to an error summary or invalid field when this helps recovery, and avoid duplicate announcements.

Use appropriate input types, autocomplete tokens, and native validation where suitable. Support password managers, pasting, and accessible alternatives to cognitive authentication tests. Avoid unnecessary repeated entry during the same process, and keep help in a consistent location where provided.

## Keyboard, focus, and dynamic content

Native controls are the starting point. When custom interaction is necessary, implement the complete relevant keyboard pattern, semantics, states, and focus behaviour. Adding `tabindex` or an ARIA role alone does not make a control operable. Avoid positive `tabindex` values and unexpected focus movement.

For modal dialogs, provide a name, an appropriate initial focus position, a keyboard close mechanism, focus containment, an inactive background, and focus restoration. Verify native dialog behaviour in supported browsers before adding custom code. Non-modal popovers and disclosures do not automatically need a focus trap. Apply Escape and arrow-key handling according to the widget's expected pattern.

Keep focus stable for ordinary content updates. Move it deliberately for context changes, and choose a logical destination when a focused element is removed. Expose expanded, selected, checked, disabled, and busy states through native semantics or appropriate ARIA.

Use a live region or status role when an update must be announced without moving focus, such as an asynchronous result count or submission status. Do not make every dynamic container live. Use polite announcements for routine updates and assertive alerts only for urgent interruptions. Avoid announcing the same change through both focus movement and a live region; verify actual screen-reader output.

## Presentation and input alternatives

Preserve sufficient text and non-text contrast in relevant states, including focus and error states. Do not communicate meaning through colour alone. Use the WCAG criteria for exact contrast thresholds and exceptions, rather than assuming all text and controls share one threshold.

Use flexible layouts and relative units where they support resizing and reflow. Fixed units are not universally forbidden; verify the resulting interface. Support text spacing, zoom, and small viewports without clipping content or controls. Retain clear focus indicators; do not remove outlines without a suitable replacement.

Distinguish intentional hiding from accidental exclusion. Content hidden with `display: none` or `visibility: hidden` is generally unavailable to screen readers. Use an established visually hidden utility when content must remain available to assistive technology, and keep focusable controls visible when focused. Collapsed content should not leave hidden controls in the tab order.

Provide alternatives to dragging, path-based gestures, and multi-point gestures where required. Check pointer target size and spacing against WCAG 2.2 exceptions. Keep keyboard focus from being entirely obscured by sticky elements or overlays.

Allow users to extend or disable time limits where required and to pause relevant moving or updating content. Avoid harmful flashing. Respect reduced-motion preferences as implementation guidance, and do not equate that preference alone with complete WCAG AA coverage.

## Reference guidance

Use the [WAI image tutorials](https://www.w3.org/WAI/tutorials/images/) and [form labelling tutorial](https://www.w3.org/WAI/tutorials/forms/labels/) for alternative-text and label decisions. Use [ARIA Authoring Practices guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) before introducing custom ARIA widgets. Check the [WCAG 2.2 requirements](https://www.w3.org/TR/WCAG22/) for exact conformance decisions and exceptions.
