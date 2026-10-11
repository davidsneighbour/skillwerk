---
id: scqa-rewrite
title: SCQA rewrite
name: scqa-rewrite
description: Rewrite a text using Situation, Complication, Question, and Answer (SCQA). Use when the user wants clearer context, reasoning, and a request or conclusion while preserving the original meaning and tone.
metadata:
  version: "1.0.0"
---

Turn an existing email or message into a clear communication organised around the recipient's question and the sender's answer. Produce a usable rewrite, not a business analysis or an invented recommendation.

## Inputs

Use the supplied draft and any context about the recipient, channel, desired outcome, tone, and length. Infer these only where the text makes them clear. Do not require a questionnaire before editing.

If no draft is supplied, ask for the text. If the intended answer or request is materially ambiguous, ask one focused question before producing the final rewrite. When a useful rewrite is possible without clarification, proceed without adding unsupported specifics.

## Preserve meaning

* Preserve facts, names, dates, amounts, commitments, conditions, and the sender's position.
* Preserve uncertainty, disagreement, urgency, and relationship-sensitive wording where they affect meaning.
* Do not turn a possibility into a fact, a suggestion into a commitment, or a preference into an obligation.
* Do not invent causes, evidence, benefits, deadlines, recipients, or decisions. Flag a material contradiction outside the rewrite instead of silently choosing a version.
* Follow the user's language and tone instructions. Otherwise, preserve the original language and use a natural tone suited to the channel.

## Build the underlying structure

Identify these elements from the supplied material:

1. **Situation:** The minimum relevant context the recipient needs. Do not assume agreement with a disputed claim.
2. **Complication:** The change, obstacle, uncertainty, or unmet need that makes a response necessary. Do not manufacture a problem to complete the pattern.
3. **Question:** The specific question the complication raises for the recipient.
4. **Answer:** The sender's recommendation, request, explanation, or conclusion that addresses that question.

Check that the complication creates the question and that the answer addresses it. For an information-only message, the answer can be an update or explanation; do not add an unnecessary request.

Distinguish the sender's answer from the decision requested of the recipient. A proposed action is not an approved action.

## Choose the presentation order

Use Situation → Complication → Question → Answer when the recipient needs context before the answer will make sense.

For a busy recipient, familiar context, or a time-sensitive request, lead with the answer or request, then give the situation and complication needed to understand it. Retain the underlying SCQA logic.

The question may remain implicit when stating it would sound artificial. Do not show SCQA labels unless the user requests a labelled structure. Do not force four sentences, a fixed number of reasons, or separate paragraphs for every element.

## Rewrite for the channel

Keep only context that explains the answer or changes the recipient's decision. Group related supporting reasons beneath the answer where needed. Remove repeated reasoning and unnecessary background; retain material qualifications and evidence.

For an email, retain useful greetings and sign-offs, and supply a concise subject suited to the message. For a chat message, keep the wording conversational and omit email conventions. Use bullets only when several items or actions are easier to scan that way.

Make any request explicit. Include who should act, what they should do, and when only to the extent supported by the supplied material. Do not impose a deadline merely to make the request more actionable.

## Final check

Before returning the rewrite, check:

* Can the recipient quickly identify the answer or request?
* Does the context explain why it matters?
* Do the supporting reasons actually support the answer?
* Are all material facts, qualifications, and commitments preserved?
* Is the recipient's next step clear, if a next step is required?
* Does the result sound like a person communicating in the chosen channel?

If the structure exposes missing support, preserve the uncertainty or briefly flag the gap. Clear organisation does not establish that a claim is true.

## Output

Return one finished rewrite by default, using the host application's writing-artifact format when available. Keep editorial comments outside the message. Add a brief note only for a material ambiguity, contradiction, or evidence gap. Explain changes or provide alternatives only when requested or materially useful.

This skill authorises drafting only. It does not authorise sending, scheduling, or publishing the message.
