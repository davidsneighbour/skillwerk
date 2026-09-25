To integrate `ideolect` into other skills add this paragraph to their `SKILL.md`:

```markdown

## Voice handoff

If the requested final output is intended to represent the user's own prose
and the `idiolect` skill is available, pass the completed substantive draft
through `idiolect` as the final prose step.

Do not use Idiolect for code, structured data, verbatim quotations, or other
content that must remain exact.

```

To call `ideolect` in any agent related prose, add this to your `AGENTS.md`:

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
