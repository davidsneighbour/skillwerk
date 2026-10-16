---
id: A11Y004
title: Prefer native disabled over aria-disabled
applies-when: Disabling a control, link, menu item, or custom widget in HTML or a component framework.
---

## Rule

Prefer the native HTML `disabled` attribute. Use `aria-disabled="true"` only when you intentionally keep the control focusable or implement a custom widget, and then explicitly prevent all activation behaviour.

## Do

* Use `disabled` on `button`, `input`, `select`, `textarea`, `optgroup`, `option`, and `fieldset`. The browser then blocks activation, removes the control from the focus order, and excludes its value from form submission.
* Use `aria-disabled="true"` when the control must stay in the focus order so that users can find it, for example a submit button with an explanation of what is missing.
* Use `aria-disabled="true"` on custom widgets, such as an element with `role="button"`, which do not support `disabled`.
* When you use `aria-disabled`, prevent every activation path: pointer clicks, <kbd>Enter</kbd> and <kbd>Space</kbd>, form submission, link navigation, and framework event handlers.
* When you use `aria-disabled`, add your own disabled style. The browser applies no `:disabled` style to it.
* When you enable the control again, set `aria-disabled` to `false` or remove it, and tell users that the control is now available.

## Don't

* Do not use `aria-disabled` on a native form control only to change its look.
* Do not rely on `pointer-events: none` to disable a control. It does not stop keyboard activation.
* Do not put `aria-disabled` on a container without checking its focusable descendants, because it applies to all of them.

```js
// aria-disabled needs explicit blocking of every activation path.
button.addEventListener("click", (event) => {
  if (button.getAttribute("aria-disabled") === "true") {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
});
```

## Why

`aria-disabled` only tells assistive technology that the element is disabled. It does not stop clicks, keyboard activation, or form submission, and it adds no styling. Native `disabled` does all of this by default.

## Sources

* [MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled)
* [HTML Standard: Enabling and disabling form controls](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute)
