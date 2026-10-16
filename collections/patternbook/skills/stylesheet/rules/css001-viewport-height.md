---
id: CSS001
title: Use small or dynamic viewport units for full height
applies-when: A height, min-height, max-height, block-size, or inset value is based on the viewport height, such as 100vh, h-screen, or min-h-screen.
---

## Rule

Do not use `vh` for elements that must fill the viewport height. Use `svh` for full-height page sections. Use `dvh` for elements that must always match the visible viewport.

## Do

```css
/* Full-height hero or page section: stable, never hidden behind browser toolbars */
.hero {
  min-height: 100svh;
}

/* Overlay, modal, drawer, or app shell that must fit the visible area exactly */
.dialog {
  max-height: 100dvh;
}
```

In Tailwind, use `min-h-svh`, `h-svh`, `h-dvh`, or `max-h-dvh` instead of `h-screen` and `min-h-screen`.

## Don't

```css
.hero {
  min-height: 100vh;
}
```

Do not use `h-screen` or `min-h-screen` in Tailwind. They compile to `100vh`.

Do not use JavaScript that sets a custom property such as `--vh` from `window.innerHeight`. The viewport units replace this workaround.

## Why

On mobile browsers, `vh` uses the large viewport, which is the height with the browser toolbars hidden. When the toolbars are visible, a `100vh` element is taller than the visible area, and its lower part is hidden.

* `svh` uses the small viewport, the height with the toolbars visible. The element always fits and does not change size when the toolbars move.
* `dvh` follows the toolbars as they show and hide. The element always matches the visible area, but it resizes during scrolling. That can cause reflow and moving content, so do not use it for large page sections with content below them.
* `lvh` is the same as `vh` on most browsers. Use it only when content must cover the largest possible area, such as a fixed background.

## Exceptions

* Keep a `vh` declaration before the new unit only when the project's browser target includes browsers without support (Safari before 15.4, Chrome before 108, or Firefox before 101):

  ```css
  .hero {
    min-height: 100vh;
    min-height: 100svh;
  }
  ```

* Use `dvh` instead of `svh` for a full-height section when the design requires it to fill the screen exactly at all times and the resize during scrolling is acceptable.
* Width units (`vw`) are not covered by this rule.

## Sources

* [MDN: `<length>` - viewport units](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length#relative_length_units_based_on_viewport)
* [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/CSSOM_view/Viewport_concepts)
* [CSS Values and Units Module Level 4: viewport-percentage lengths](https://drafts.csswg.org/css-values/#viewport-relative-lengths)
* [web.dev: The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units)
