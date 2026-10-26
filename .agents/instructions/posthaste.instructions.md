---
applyTo: "collections/posthaste/**"
---

# Posthaste collection instructions

Paths in this file are relative to the repository root.

Use the `posthaste` skill to resolve configuration and route requests. Route every hashtag request to the single prompt-only `hashtags` skill, including from `prepare-link`. It returns five tags by default, a requested count, or all relevant tags in full mode, supports plain tags or social-ready hashtags, and returns its session vocabulary with `extract`.

`prepare-link` fetches metadata, captures screenshots, drafts posts in Patrick's voice, publishes only after explicit confirmation, and logs posted networks to avoid repeats. For substantial prose edits, use `collections/posthaste/skills/voice/resources/tropes-and-rules.md` as the diagnostic checklist.

When running or citing ported examples with `skills/70-content-design-and-voice/<skill-name>/...`, substitute `collections/posthaste/skills/<skill-name>/...` from this repository root. Fix stale references when already touching the affected file.

For publishing, OAuth, and browser-assisted flows, do not perform real posting, credential writes, login automation, or final publish clicks without explicit user confirmation. OAuth refresh-token helpers must never expose token values.

Publishing and auth skills read `~/.env` first, then the current project root's `.env`, then a different configured or explicit dotenv path such as `CROSSPOST_DOTENV` or `--dotenv`. Later files override matching keys; missing files contribute no values. Existing process environment variables take precedence over dotenv values. Keep project credential files ignored by Git. Refresh-token scripts write only to the selected dotenv path, require explicit write flags, and must refuse unsafe dotenv permissions unless the user requests a permissions fix.

Never print, paste, summarise, or commit real token, secret, authorisation code, or credential values. `unsplash` requires attribution and download tracking on final selection. It must use caller-provided `UNSPLASH_POSTHASTE_ACCESS_KEY`, falling back to `UNSPLASH_ACCESS_KEY`, and must not use bundled, demo, testing, or repository-owned credentials.
