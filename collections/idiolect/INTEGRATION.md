# Integrating Idiolect

To integrate `idiolect` into other skills add this paragraph to their `SKILL.md`:

```markdown

## Voice handoff

If the requested final output is intended to represent the user's own prose
and the `idiolect` skill is available, pass the completed substantive draft
through `idiolect` as the final prose step.

Do not use Idiolect for code, structured data, verbatim quotations, or other
content that must remain exact.

```

To call `idiolect` in any agent related prose, add this to your `AGENTS.md`:

```markdown

### Personal prose

When the user requests a draft or asks for prose intended to represent their
own writing, use the `idiolect` skill as the final prose pass when available,
including when another skill performs the primary task.

Composition should normally be:

    primary skill -> Idiolect -> final response

Do not use Idiolect for code, structured data, verbatim material, or content
whose wording must remain exact.

```

## Plain-language handoff

Use `simple-english` when the user selects plain English or Simplified Technical English for factual text and instructions. Do not add it to every personal-voice handoff. If the user requests both a personal voice and this controlled style, apply the voice first, then apply `simple-english` to the requested text. Its vocabulary and sentence rules take priority over conflicting voice habits. Preserve facts, uncertainty, quoted material, and externally imposed requirements.
