# Astro components

Use this reference to create, review, refactor, or optimise an Astro component. Follow the shared rules in the entry point and inspect existing components before introducing a new one.

## Component boundaries and API

Give each component a clear semantic, behavioural, styling, data, or reuse responsibility. Extract meaningful units, including small list items or controls when the boundary helps. Do not split markup solely to reduce file length, and do not retain unrelated responsibilities merely to minimise the diff. An Astro component boundary does not itself add a DOM wrapper.

Use a local `Props` interface and deliberate defaults. Export a type only when another module needs that contract. Reuse Astro's native HTML attribute types when forwarding attributes is useful, and handle `class`, conflicting attributes, and URLs deliberately. Prefer a discriminated union over many interacting boolean flags.

Use slots for caller-owned markup and props for structured data or component-owned rendering. Document non-trivial props, units, defaults, accessibility constraints, and named slots. Preserve existing APIs unless an authorised change requires migrating their consumers.

## Markup and styles

Use valid semantic HTML with appropriate heading structure, labelled controls, image alternatives, and state communication. Prefer native controls over simulated controls and unnecessary ARIA. Use empty alternative text for decorative images. Avoid wrappers added only for convenience when the layout does not require them.

Keep component-specific CSS in scoped styles or established utility classes. Follow the project's styling system without assuming Tailwind. Import shared styles from the established layout or entry point, not from every component. Use dynamic CSS custom properties when data must enter CSS, and prefer CSS to browser JavaScript for layout.

## Browser behaviour

Implement the server-rendered result first. Add native browser code only when interaction requires it; use a framework island when it supplies a justified state or composition boundary.

Astro can bundle a component script once per page even when the component appears several times. Initialise every instance deliberately using scoped queries, element relationships, or custom-element lifecycles. Do not assume a single global element or add duplicate IDs. Clean up listeners, observers, subscriptions, and timers when the component lifecycle requires it. For client navigation, verify re-entry, cleanup, and preserved elements against the installed router's documented lifecycle.

Support keyboard operation, visible focus, reduced motion, and meaningful initial content. Retain a usable no-script path where the interaction permits it. Verify native form submission and error states when affected.

## Media and input boundaries

Use Astro media APIs appropriate to the installed version and source. Supply dimensions when known, suitable responsive sizes, and meaningful alternatives. Check loading priorities rather than applying lazy loading universally.

Retain Astro's normal escaping. Use raw HTML only with an explicit trust or sanitisation boundary. Validate untrusted URLs and structured inputs where they enter the component; do not add redundant sanitisation for trusted typed data.

## Review and verification

Check API usage and obsolete flags, repeated markup, meaningful extraction opportunities, prop and slot contracts, generated DOM, CSS scope, unnecessary hydration, multi-instance behaviour, and existing deferred work. Use the project's comment and TODO conventions; resolve stale items within scope rather than adding speculative follow-ups.

Run the relevant configured checks and build. For visible or interactive changes, inspect the rendered component at relevant viewports, with multiple instances, keyboard input, and reduced motion. Include client navigation if present. Report public API changes and any unverified state.

## Official sources

* [Astro components](https://docs.astro.build/en/basics/astro-components/)
* [Scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/)
* [Styles and CSS](https://docs.astro.build/en/guides/styling/)
* [TypeScript](https://docs.astro.build/en/guides/typescript/)
* [Images](https://docs.astro.build/en/guides/images/)
