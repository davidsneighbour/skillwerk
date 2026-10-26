---
id: A11Y009
title: Choose table or grid by interaction
applies-when: Presenting tabular data, sortable tables, calendars, or interactive grids.
---

## Rule

Prefer native HTML tables for tabular information. Updating or sorting data does not itself require `role="grid"`. A table may contain links, buttons, and form controls with normal Tab navigation. Choose a grid only when managed directional navigation or cell interaction warrants the complete composite-widget behaviour.

* Associate data cells with their actual headers. Use `th` and appropriate `scope="col"` or `scope="row"` for simple tables; use explicit header associations where complex relationships require them. Not all tables need both row and column headers, and headers need not always occupy the first row.
* Provide a useful caption when it helps identify the table. Prefer simpler structures when they preserve the relationships; do not replace a useful table with cards that lose those relationships.
* In ARIA grids, put cells and headers within rows, and rows within the grid or its row groups. Implement a reachable entry point, movement, selection/editing where applicable, and state exposure. A collection of `gridcell` elements without rows or focus handling is incomplete.
* Do not use tables for page layout or confuse CSS grid layout with an ARIA grid widget.

## Check

Test header announcements and relationships with a screen reader. For grids, also complete navigation and editing with the keyboard; source roles alone do not establish usability.

## Sources

* [APG: table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/)
* [APG: grid pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
* [WAI: tables tutorial](https://www.w3.org/WAI/tutorials/tables/)
