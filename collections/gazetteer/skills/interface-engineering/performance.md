# Performance

Transition specificity and GPU compositing hints.

## Transition only what changes

Prefer explicit transition properties. Tailwind's `transition` utility uses a defined property list, not `all`; inspect the project's version and generated CSS before changing it. See the [Tailwind reference](https://tailwindcss.com/docs/transition-property).

### Why

* `transition: all` forces the browser to watch every property for changes
* Causes unexpected transitions on properties you didn't intend to animate (colors, padding, shadows)
* Prevents browser optimizations

### CSS example

```css
/* Good — only transition what changes */
.button {
  transition-property: scale, background-color;
  transition-duration: 150ms;
  transition-timing-function: ease-out;
}

/* Bad — transition everything */
.button {
  transition: all 150ms ease-out;
}
```

### Tailwind

```tsx
// Good — explicit properties
<button className="transition-[scale,background-color] duration-150 ease-out">

// Broader than needed for a scale-only interaction
<button className="transition duration-150 ease-out">
```

### Tailwind `transition-transform` note

`transition-transform` in Tailwind maps to `transition-property: transform, translate, scale, rotate` — it covers all transform-related properties, not just `transform`. Use this when you're only animating transforms. For multiple non-transform properties, use the bracket syntax: `transition-[scale,opacity,filter]`.

## Use `will-change` sparingly

`will-change` is a rendering hint, not a guarantee of GPU compositing. Start without it, profile the affected browser, and use it only when a measured problem improves. Remove temporary hints after the interaction, and watch memory use and stacking-context changes. Prefer transform and opacity for motion; filters and clipping can still require expensive painting depending on the browser and content.

See the [MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change). Do not use `will-change: all` or apply hints to every element.
