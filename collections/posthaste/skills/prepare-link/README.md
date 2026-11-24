# Direct network credentials

This note records the practical credential setup for
`prepare-link`. The skill itself is the source of truth for the
posting workflow; this file is only a quick operator map.

## Working networks

* Mastodon through Crosspost
* Bluesky through Crosspost
* LinkedIn through Crosspost
* Nostr through Crosspost
* Reddit through `resources/post-reddit.ts`
* Threads through `resources/post-threads.ts`
* Tumblr through `resources/post-tumblr.ts`

Reddit uses:

```bash
node skills/reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
  --write-env
```

It stores `REDDIT_REFRESH_TOKEN` in `~/.env` without printing it.

Threads and Tumblr both reject `localhost`/`127.0.0.1` OAuth redirect URIs,
so their token helpers use a hosted Netlify callback microsite instead of a
local loopback server. See each skill's `auth-site/README.md` for the
current deployed callback URL and deploy commands:

* `skills/threads-refresh-token/auth-site/README.md`
* `skills/tumblr-refresh-token/auth-site/README.md`

```bash
node skills/threads-refresh-token/scripts/create-threads-refresh-token.ts \
  --write-env \
  --redirect-uri "<threads auth-site URL>/callback"

node skills/tumblr-refresh-token/scripts/create-tumblr-refresh-token.ts \
  --write-env \
  --redirect-uri "<tumblr auth-site URL>/callback"
```

Both store their tokens in `~/.env` without printing them. The hosted
callback page is a static, client-side-only page; it never stores or
transmits the OAuth `code`/`state` anywhere itself.

Threads text posts do not reliably auto-attach a link preview via the API,
so `post-crosspost.ts` passes `--canonical-url`/`--source-url` through as
`--link-attachment` for Threads automatically. Tumblr posts support an
optional `--image`/`--image-alt` local file attachment via NPF multipart
upload. When `post-crosspost.ts` receives `--image-url`, it downloads the image once before anything is published, checks its format, and uploads that temporary file to Tumblr.

Crosspost networks accept `--image` for a local file or `--image-url` for a public `http:` or `https:` image URL, for example the page's `og:image`. The helper pins `@humanwhocodes/crosspost@^1.1.0`, the first release with `--image-url`. Crosspost accepts only PNG, JPEG, and GIF images up to 20 MB. A WebP image works for Tumblr alone, but the helper stops before publishing when a Crosspost network is also selected.

## Browser-Assisted networks (not an API integration)

* Patreon through Playwright MCP, driven live by the agent — see
  [Patreon browser-assisted
  posting](SKILL.md#patreon-browser-assisted-posting) in the skill itself.

Patreon has no public post-creation API for third-party apps and no stable
composer URL — clicking Patreon's own Post nav button mints a fresh draft
with a one-time URL every time, so that URL can never be stored or reused.
The flow clicks that button itself instead. `.env` only needs
`PATREON_LOGIN_URL` (optional, overrides the default login page) and
`PATREON_DASHBOARD_URL` (optional, only if the post-login landing page does
not already show the Post nav button). No Patreon username or password is
ever stored — login happens by hand in the automated browser window, and the
skill always stops before the final Publish click.
