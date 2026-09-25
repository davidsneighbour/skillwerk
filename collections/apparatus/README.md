# AI skills for operating browsers and other technical machinery

Apparatus is a collection of practical, tool-driven skills for operating browsers, diagnostics, media utilities, and other reusable technical machinery.

* [Install](#install)
* [Update](#update)
* [Skills](#skills)
* [Shared runtime](#shared-runtime)
* [The cabinet of @davidsneighbour's skills](#the-cabinet-of-davidsneighbours-skills)

## Install

Install the current Apparatus skill set with:

```bash
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/apparatus/skills --yes
```

## Update

Re-run the install command to refresh an existing install:

```bash
npx skills add https://github.com/davidsneighbour/skillwerk/tree/main/collections/apparatus/skills --yes
```

Use `--global` when the skills should be available outside the current project.

## Skills

* `web-screenshot` captures deterministic screenshots of web pages with a requested viewport, colour scheme, full-page or fixed-height behaviour, and output format.

## Shared runtime

A skill declares its executable requirements in `runtime.json`, but those dependencies are installed once per machine rather than into the consuming repository. Each skill bundles its own zero-dependency bootstrapper (for example `skills/web-screenshot/scripts/runtime.mjs`), which installs and reuses dependencies under a shared, skill-specific location such as:

```text
~/.local/share/apparatus/runtimes/<runtime-name>/
```

The bootstrapper itself uses only Node.js built-ins, so it needs no npm installation of its own. See a skill's own `README.md` for its exact runtime layout and root-override environment variable.

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
