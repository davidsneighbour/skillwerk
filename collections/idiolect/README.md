# AI skills for writing voice and plain language

![Idiolect](../../.github/assets/images/skillwerk/idiolect.png)

Idiolect is a collection of reusable AI skills for personal writing voice, plain language, and controlled writing styles. Capture, check, and apply a person's distinctive vocabulary, rhythm, and habits, or select a plain-language style for factual text and instructions.

* [AI skills for writing voice and plain language](#ai-skills-for-writing-voice-and-plain-language)
* [Install](#install)
* [Update](#update)
* [Skills](#skills)
* [The cabinet of @davidsneighbour's skills](#the-cabinet-of-davidsneighbours-skills)

## Install

Install the current Idiolect skill set with:

```bash
npx skills add davidsneighbour/idiolect --yes
```

## Update

Re-run the install command to refresh an existing install:

```bash
npx skills add davidsneighbour/idiolect --yes
```

Use `--global` when the skills should be available outside the current project.

## Skills

* `idiolect` builds a voice profile from writing samples, checks a draft against that profile, and rewrites drafts so they read in the author's own voice.

* [`simple-english`](skills/simple-english/SKILL.md) writes, rewrites, and checks factual text and instructions in plain English, with a Strict mode for ASD-STE100 requests. It includes guidance for documentation, runbooks, error messages, and other technical prose.

Select `simple-english` explicitly through a named invocation or a request for plain English or Simplified Technical English. It does not automatically apply to personal-voice rewrites. For the requested text, its style rules take priority over conflicting voice habits, while facts, uncertainty, quoted material, and externally imposed requirements remain intact.

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
