---
id: idiolect
name: idiolect
title: Idiolect
description: Capture, check, and apply a person's idiolect - their own distinctive vocabulary, rhythm, and habits in writing. Use when the user wants to build a voice profile from writing samples, check whether a draft sounds like them, or rewrite a draft so it reads in their voice.
---

Work with a single person's idiolect: the specific, recognisable way they write,
as opposed to a house style, a genre convention, or generic assistant prose.
This skill builds and uses a voice profile grounded in the author's own writing,
not a personality invented for the occasion.

## Modes

Choose one mode before acting. If the user's request implies more than one,
run them in order.

### Profile

Build or update a voice profile from writing samples the user provides or
points to.

1. Read every sample offered. Prefer several short samples over one long one;
   note when a sample looks atypical (a legal notice, a quote, a co-written
   piece) and weight it less.
2. Extract concrete, checkable habits, not vibes:
   * typical sentence and paragraph length, and how much they vary
   * punctuation habits (dashes, semicolons, parentheticals, sentence
     fragments)
   * vocabulary register and any recurring words or phrases
   * how the author opens and closes a piece
   * where they use first person, humour, or a direct address to the reader
   * British/American spelling and other mechanical conventions
   * what they avoid (hedging, exclamation marks, rhetorical questions, etc.)
3. Write the profile as a short, falsifiable list, not adjectives like
   "engaging" or "witty" on their own. Pair any adjective with the textual
   evidence for it.
4. Store or return the profile in the form the user asked for. Do not silently
   invent a storage location; ask if none is implied by the conversation.

### Check

Compare a draft against the profile (or, if none exists yet, against samples
supplied in the same request) and report where it drifts.

1. Read the draft in full before judging any part of it.
2. Flag concrete mismatches: sentence rhythm, vocabulary that would not appear
   in the samples, structure the author would not use, and tone shifts within
   the draft itself.
3. Separate voice drift from generic AI-shaped prose (filler, false
   enthusiasm, inflated significance, hedging, listy padding) - both matter,
   but they are different problems and the user may want only one addressed.
4. Lead the report with the clearest, most representative examples. Quote the
   offending text plus a short reason, not just a verdict.
5. Do not rewrite unless asked. Checking and rewriting are different jobs.

### Apply

Rewrite or edit a draft so it reads in the author's voice.

1. Preserve the author's meaning, argument, and level of certainty. Do not
   invent facts, claims, examples, or first-person experience the source does
   not support.
2. Match the profile's concrete habits rather than a generic idea of "good
   writing." A profile built from terse, dry samples should not produce warm,
   expansive prose, even if that would read better in the abstract.
3. Keep the piece's actual form in mind (email, documentation, essay, note)
   and apply the voice within that form rather than forcing every piece into
   one shape.
4. When editing a file directly, keep unrelated structure, frontmatter, links,
   and code blocks untouched unless the user asked for structural changes.
5. When no profile exists yet and the user has not supplied samples, say so
   and offer to build one first rather than guessing at a voice.

## Working without a stored profile

If the user has not built a profile yet, treat any samples given in the
current request as an implicit one-off profile for that request only. Do not
carry an implicit profile over to unrelated future requests.

## Caution cases

Do not claim the author experienced, verified, or endorsed something the
source does not support. Do not remove required disclaimers, legal text, or
safety warnings to make a passage sound more like the author; flag the clash
instead. Do not overfit a single unusual sample - infer the underlying habit
rather than copying that sample's surface mood everywhere.
