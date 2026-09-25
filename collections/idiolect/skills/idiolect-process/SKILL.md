---
name: idiolect-process
description: >
  Rewrite user-facing prose into Patrick's established personal voice while
  preserving meaning, facts, structure, technical accuracy, and intent.
  This is a cross-cutting finishing skill: prefer running it on any draft,
  article, report, explanation, documentation prose, proposal, or other
  publishable/user-authored text produced by another skill when the user asks
  to "write this up", "write this up as a draft", "create a draft",
  "draft this", "write this in my words", "write this in my own words",
  "make this sound like me", or otherwise indicates that the resulting prose
  should represent their own voice. It may run after another skill rather
  than replacing that skill.
---


## Role in multi-skill workflows

Idiolect is a finishing and voice-transformation skill.

When another skill is responsible for research, analysis, reporting,
documentation, content generation, or another specialised task:

1. Let the specialised skill determine the facts, findings, structure, and
   required content.
2. Treat its prose output as the input to Idiolect.
3. Apply Idiolect as the final prose pass before presenting the draft to the
   user.
4. Preserve technical meaning, factual claims, citations, code, commands,
   identifiers, paths, URLs, and other content that must remain exact.
5. Do not replace the specialised skill's reasoning or domain rules with
   Idiolect's stylistic rules.

Think of the workflow as:

    specialised skill -> substantive draft -> Idiolect -> final draft

Do not treat Idiolect and the specialised skill as mutually exclusive.

## Automatic preference

Prefer applying Idiolect whenever the user asks for prose that is intended
to represent their own writing.

Strong triggers include phrases such as:

- "write this up"
- "write this up as a draft"
- "create a draft"
- "draft this"
- "write this in my words"
- "write this in my own words"
- "in my voice"
- "make this sound like me"

These triggers apply even when another skill is already handling the primary
task.

For example:

- "Audit this site and write up the report as a draft"
  -> audit skill -> Idiolect

- "Turn these findings into a blog post draft"
  -> relevant research/content skill -> Idiolect

- "Use the project-status skill and write this up for me"
  -> project-status skill -> Idiolect

Idiolect should normally be the last prose-producing step.


## Do not apply

Do not apply Idiolect merely because an agent internally creates a draft.

Apply it when the prose is intended to be presented as the user's writing.

Do not apply it to:

- source code
- configuration files
- shell commands
- JSON, YAML, TOML, or other structured data
- raw research notes unless requested as authored prose
- verbatim quotations
- generated commit messages unless explicitly requested
- factual values, identifiers, paths, URLs, or citations
- another person's writing when the task requires preserving that person's voice

## Authority

Idiolect controls voice, phrasing, rhythm, vocabulary, and other stylistic
characteristics.

It does not have authority to change:

- facts
- conclusions
- recommendations
- technical terminology where precision matters
- citations or attribution
- user requirements
- domain-specific decisions made by the primary skill

If style and substantive accuracy conflict, substantive accuracy wins.
