# Skills index

This index records the current skill entries in this repository. Update this
file in the same change whenever a skill is added, removed, renamed, or moved.

## Layout

This repository uses a flat skill layout, not a numbered category taxonomy:

```text
skills/<skill-id>/SKILL.md
```

The directory directly containing `SKILL.md` must match the skill `id` (or
`name`) frontmatter.

## Installable skills

| Skill | Contents |
| --- | --- |
| [`posthaste`](skills/posthaste/SKILL.md) | Router skill for choosing the right Posthaste workflow (link prep, hashtags, config, credential helpers). |
| [`posthaste-config`](skills/posthaste-config/SKILL.md) | Loads, merges, validates, explains, or creates Posthaste TOML configuration. |
| [`posthaste-post-retrieve-hashtags`](skills/posthaste-post-retrieve-hashtags/SKILL.md) | Generates topical hashtags for a URL or supplied text block. |
| [`posthaste-prepare-link`](skills/posthaste-prepare-link/SKILL.md) | Drafts and (after confirmation) publishes a social post for a URL, with screenshot and per-network posted-log tracking. |
| [`posthaste-reddit-refresh-token`](skills/posthaste-reddit-refresh-token/SKILL.md) | Creates a Reddit OAuth refresh token for direct Reddit posting. |
| [`posthaste-threads-refresh-token`](skills/posthaste-threads-refresh-token/SKILL.md) | Creates or refreshes a long-lived Threads API access token. |
| [`posthaste-tumblr-refresh-token`](skills/posthaste-tumblr-refresh-token/SKILL.md) | Creates or refreshes Tumblr OAuth2 credentials. |
| [`posthaste-unsplash`](skills/posthaste-unsplash/SKILL.md) | Searches, previews, selects, and tracks Unsplash photos with mandatory attribution. |
| [`posthaste-voice`](skills/posthaste-voice/SKILL.md) | Edits prose so it reads in Patrick's voice. |
