# Accessible implementation

## Semantic HTML and alternatives

Use native elements for their intended purpose: buttons for actions, links with real destinations for navigation, and native form controls for input. Use landmarks, headings, lists, and table headers to represent the content's actual structure. Do not add redundant roles to native elements or use ARIA to conceal a semantic mismatch.

Set the document language at page/layout level and identify changes of language where needed. Use logical heading levels and meaningful page titles, with distinguishing information early where useful. One descriptive page-level `h1` is a useful convention, not a standalone WCAG requirement. Keep DOM reading and focus order consistent with the intended visual order.

Give each image an appropriate text-alternative strategy. Informative images need useful alternatives in context. Decorative or fully redundant images may use `alt=""`; do not omit the attribute on decorative HTML images. Functional images need an alternative that conveys the action or destination. Complex diagrams need an equivalent explanation. Hide decorative icons from assistive technologies only when the containing control has an accessible name. Do not hide meaningful content or focusable elements with `aria-hidden`.

Assess SVGs, icon fonts, emojis, and CSS images by purpose too. Do not give every graphic `role="img"`; decorative graphics should not add redundant announcements. Informative standalone SVGs need appropriate image semantics and an accessible name, verified in supported browsers.

Provide captions, transcripts, and audio description as required by the media type and applicable WCAG criteria. Do not assume one alternative fulfils every requirement for audio and video.

At site/layout level, provide a way to bypass repeated navigation or content blocks. A skip link to the main content is a useful approach: ensure it becomes visible on focus and that its target works. Do not add duplicate skip links to every reusable component.

## Labels, forms, and errors

Prefer a visible `<label>` associated with each form control. Use `fieldset` and `legend` for related groups where appropriate. A placeholder is not a label. Use `aria-labelledby` to associate existing visible text when native labelling cannot express the relationship. Use `aria-label` only when an appropriate visible label is not suitable; do not replace useful visible labels with hidden names. The accessible name must include any visible label text to support speech input.

Make required fields and expected formats clear before submission. Use native `required` where supported, or `aria-required` for custom controls where needed; an unexplained asterisk is insufficient. Associate instructions and error messages with the relevant controls, expose invalid states, and describe how to correct errors. Use `aria-describedby` for associated help and inline errors where appropriate, set `aria-invalid="true"` for detected errors, and clear or reset it after correction. Retain entered values where possible. Move focus to an error summary or invalid field when this helps recovery, and avoid duplicate announcements.

Prefer allowing submission to reveal useful errors rather than disabling the submit button solely because fields are incomplete. If disabling is justified, explain the reason and how to proceed.

Use appropriate input types, autocomplete tokens, and native validation where suitable. Support password managers, pasting, and accessible alternatives to cognitive authentication tests. Avoid unnecessary repeated entry during the same process, and keep help in a consistent location where provided.

## Keyboard, focus, and dynamic content

Native controls are the starting point. When custom interaction is necessary, implement the complete relevant keyboard pattern, semantics, states, and focus behaviour. Adding `tabindex` or an ARIA role alone does not make a control operable. Avoid positive `tabindex` values and unexpected focus movement.

For ordinary site navigation, use links in lists and buttons for disclosures, with synchronised `aria-expanded` and visibility. Preserve normal Tab navigation. Arrow keys are optional additions for disclosure navigation, not a reason to remove links or top-level buttons from the tab sequence. Use `menu` and `menubar` only when implementing the complete application-style widget pattern.

Expose the current page or step with an appropriate `aria-current` value where applicable, such as `page` in navigation or `step` in a process. Keep it synchronised with the current item. Do not use it as a substitute for `aria-selected` in widgets that require selection state.

For composites, follow the specific APG focus strategy. Roving tabindex puts one participating child in the tab sequence and moves DOM focus as tabindex changes; do not also add a container tab stop by default. With `aria-activedescendant`, keep focus on a supported controlling element, satisfy the role's descendant/ownership requirements, and update the active item's visual indication and scroll position. Combobox focus may remain on an input. Distinguish selection from focus and choose initial or remembered focus according to the pattern.

For modal dialogs, provide a name, an appropriate initial focus position, a keyboard close mechanism, focus containment, an inactive background, and focus restoration. Verify native dialog behaviour in supported browsers before adding custom code. Non-modal popovers and disclosures do not automatically need a focus trap. Apply Escape and arrow-key handling according to the widget's expected pattern.

Keep focus stable for ordinary content updates. Move it deliberately for context changes, and choose a logical destination when a focused element is removed. Expose expanded, selected, checked, disabled, and busy states through native semantics or appropriate ARIA.

Use a live region or status role when an update must be announced without moving focus, such as an asynchronous result count or submission status. Do not make every dynamic container live. Use polite announcements for routine updates and assertive alerts only for urgent interruptions. Avoid announcing the same change through both focus movement and a live region; verify actual screen-reader output.

## Tables and grids

Choose by interaction, not update frequency. Native tables can contain controls and dynamically updated or sortable data. Use `th` and suitable `scope` for simple header relationships, explicit associations where needed for complex headers, and useful captions. Tables do not always need both row and column headers or headers in the first row. Prefer simpler structures without losing meaningful data relationships.

Use an ARIA grid when managed directional navigation or cell interaction warrants a composite widget. Include rows containing cells and headers, a reachable entry point, keyboard movement, and relevant selection or editing behaviour. CSS grid layout does not require an ARIA grid role. Verify header announcements and keyboard behaviour in the rendered result.

## Presentation and input alternatives

Preserve sufficient text and non-text contrast in relevant states, including focus and error states. Do not communicate meaning through colour alone. Use the WCAG criteria for exact contrast thresholds and exceptions, rather than assuming all text and controls share one threshold.

Reduce unnecessary distractions and cognitive load: keep instructions and task structure clear, and avoid competing prompts or decorative motion that obstructs the task. Distinguish these usability recommendations from established WCAG failures.

Use flexible layouts and relative units where they support resizing and reflow. Fixed units are not universally forbidden; verify the resulting interface. Support text spacing, zoom, and small viewports without clipping content or controls. Retain clear focus indicators; do not remove outlines without a suitable replacement.

Distinguish intentional hiding from accidental exclusion. Content hidden with `display: none` or `visibility: hidden` is generally unavailable to screen readers. Use an established visually hidden utility when content must remain available to assistive technology, and keep focusable controls visible when focused. Collapsed content should not leave hidden controls in the tab order.

Provide alternatives to dragging, path-based gestures, and multi-point gestures where required. Check pointer target size and spacing against WCAG 2.2 exceptions. Keep keyboard focus from being entirely obscured by sticky elements or overlays.

Allow users to extend or disable time limits where required and to pause relevant moving or updating content. Avoid harmful flashing. Check [WCAG 2.3.1, Three Flashes or Below Threshold](https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html): content must stay within the frequency limit of three flashes in any one-second period, or below the defined general-flash and red-flash thresholds. Use the criterion's definitions and assessment guidance rather than treating frequency alone as the complete test. Respect reduced-motion preferences as implementation guidance, and do not equate that preference alone with complete WCAG AA coverage.

## Reference guidance

Use the [APG disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/), [keyboard interface guidance](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/), [table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/), and [grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) for the relevant interactions.

Use the [WAI image tutorials](https://www.w3.org/WAI/tutorials/images/) and [form labelling tutorial](https://www.w3.org/WAI/tutorials/forms/labels/) for alternative-text and label decisions. Use [ARIA Authoring Practices guidance](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) before introducing custom ARIA widgets. Check the [WCAG 2.2 requirements](https://www.w3.org/TR/WCAG22/) for exact conformance decisions and exceptions.
