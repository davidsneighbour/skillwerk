---
id: DSG024
title: Calculate nested corner radii
applies-when: Setting the corner radius of a rounded element inside another rounded element.
---

## Rule

When rounded containers are nested, derive the inner radius from the outer radius and the gap between them.

## Check

Use:

`inner radius = outer radius - gap`

Example: an outer radius of 30px with a 20px inset produces an inner radius of 10px.

* Avoid arbitrary nested radii that break concentric visual geometry.
* Clamp or redesign cases where the calculation would produce an invalid negative radius.

## Sources

* [Anthony Hobday: Visual design rules you can safely follow every time](https://anthonyhobday.com/sideprojects/saferules/)
