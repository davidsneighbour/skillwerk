# Patternbook

![Patternbook](../../.github/assets/images/skillwerk/patternbook.png)

## Patterns for better digital work

Patternbook is a collection of reusable AI skills for digital design and presentation: design systems, branding, typography, colour, composition, interface patterns, responsive design, usability, accessibility, visual audits, consistency checks, and design recommendations. The goal is to keep design judgement consistent and portable across projects and AI assistants.

* [Patterns for better digital work](#patterns-for-better-digital-work)
* [Install](#install)
* [Update](#update)
* [Skills](#skills)
* [The cabinet of @davidsneighbour's skills](#the-cabinet-of-davidsneighbours-skills)

## Install

Install the current Patternbook skill set with:

```bash
npx skills add davidsneighbour/patternbook --yes
```

## Update

Re-run the install command to refresh an existing install:

```bash
npx skills add davidsneighbour/patternbook --yes
```

Use `--global` when the skills should be available outside the current project.

## Skills

* `patternbook` is a placeholder entry point. No operating instructions are defined yet.
* `stylesheet` applies Patternbook authoring rules whenever an agent writes, edits, or reviews CSS, SCSS, PostCSS, Tailwind classes, or inline styles.

### Rules

Skills can keep authoring rules in a `rules/` directory, one rule per file. Each rule file has frontmatter with `id`, `title`, and `applies-when`, and the sections Rule, Do, Don't, Why, Exceptions, and Sources. The owning `SKILL.md` lists every rule in a rule index, so the agent can open only the rules that match the current change. See [`skills/stylesheet/`](skills/stylesheet/) for the reference implementation.

## The cabinet of @davidsneighbour's skills

| Exhibit | Skill |
| :---: | :--- |
| [![Apparatus](../../.github/assets/images/skillwerk/apparatus-thumb.png)](https://github.com/davidsneighbour/apparatus) | **[Apparatus:](https://github.com/davidsneighbour/apparatus)** A collection of practical, tool-driven skills for operating browsers, diagnostics, media utilities, and other reusable technical machinery. |
| [![Clerkwork](../../.github/assets/images/skillwerk/clerkwork-thumb.png)](https://github.com/davidsneighbour/clerkwork) | **[Clerkwork:](https://github.com/davidsneighbour/clerkwork)** It's an engineers world. Start your engines, maintain, contrive, and put in the works. |
| [![Gallimaufry](../../.github/assets/images/skillwerk/gallimaufry-thumb.png)](https://github.com/davidsneighbour/gallimaufry) | **[Gallimaufry:](https://github.com/davidsneighbour/gallimaufry)** A miscellaneous collection of small AI skills and odd useful workflows. |
| [![Gazetteer](../../.github/assets/images/skillwerk/gazetteer-thumb.png)](https://github.com/davidsneighbour/gazetteer) | **[Gazetteer:](https://github.com/davidsneighbour/gazetteer)** Place-aware patterns for geographic content, local context, and location-rich publishing. |
| [![Idiolect](../../.github/assets/images/skillwerk/idiolect-thumb.png)](https://github.com/davidsneighbour/idiolect) | **[Idiolect:](https://github.com/davidsneighbour/idiolect)** Finding your own language in skill outputs. |
| [![Patternbook](../../.github/assets/images/skillwerk/patternbook-thumb.png)](https://github.com/davidsneighbour/patternbook) | **[Patternbook:](https://github.com/davidsneighbour/patternbook)** Patterns for better digital work. |
| [![Posthaste](../../.github/assets/images/skillwerk/posthaste-thumb.png)](https://github.com/davidsneighbour/posthaste) | **[Posthaste:](https://github.com/davidsneighbour/posthaste)** A collection of skills to post to social media of all kinds. |
