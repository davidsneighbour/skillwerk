---
id: posthaste-reddit-refresh-token
name: posthaste-reddit-refresh-token
title: Posthaste Reddit Refresh Token
description: Create a Reddit OAuth refresh token for the posthaste-prepare-link direct Reddit poster using a local loopback callback server. Use when Reddit posting is missing REDDIT_REFRESH_TOKEN or REDDIT_ACCESS_TOKEN, when setting up Reddit OAuth for social posting, or when the user asks to generate Reddit credentials for posthaste-prepare-link.
---

Generate a Reddit OAuth refresh token for the `posthaste-prepare-link` Reddit
publisher without exposing the token in chat or terminal output.

## Bare invocation

If the user invokes `posthaste-reddit-refresh-token` without more context, explain
that the skill can be used directly or as a sub-skill from
`posthaste-prepare-link`, but the bundled script is not conversational. Tell
the user that a direct run opens Reddit in the browser, waits for the local
callback, writes the refresh token to `~/.env` only when `--write-env` is used,
and never prints the token.

Show this command shape:

```bash
node skills/posthaste-reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
  --write-env \
  --user-agent "posthaste-prepare-link/1.0 by u/<reddit-username>" \
  --subreddit "<subreddit-name>"
```

Then ask whether the user wants to run the setup now.

## Safety model

Never print, paste, summarise, or otherwise reveal `REDDIT_REFRESH_TOKEN`,
`REDDIT_ACCESS_TOKEN`, `REDDIT_CLIENT_SECRET`, or authorization codes.

Use the bundled script:

```bash
node skills/posthaste-reddit-refresh-token/scripts/create-reddit-refresh-token.ts
```

The script enforces the core safety checks:

* loopback-only redirect URI: `http://127.0.0.1`, `http://localhost`, or `http://[::1]`
* per-run random OAuth `state` with callback verification
* no token printing
* explicit `--write-env` before requesting a token
* private dotenv permissions; refuses to write if the file is group/other
  readable unless `--fix-permissions` is passed
* one local callback request, then server shutdown

## Required reddit app setup

The user needs a Reddit app at:

```text
https://www.reddit.com/prefs/apps
```

Use a confidential app type such as `script` and register this redirect URI
unless the user chooses a different loopback URI:

```text
http://127.0.0.1:8765/callback
```

Reddit requires the redirect URI in the authorization request to match the app
registration exactly, including host, port, path, and trailing slash. If Reddit
shows `invalid redirect_uri parameter`, ask the user for the registered redirect
URI and rerun with `--host`, `--port`, `--callback-path`, or `--redirect-uri`.

Required values:

* `REDDIT_CLIENT_ID`
* `REDDIT_CLIENT_SECRET`
* `REDDIT_USER_AGENT`
* `REDDIT_SUBREDDIT`

The user agent should be descriptive, for example:

```text
posthaste-prepare-link/1.0 by u/<reddit-username>
```

## Workflow

1. Confirm the user wants to write to `~/.env`. Writing outside the repository
   requires explicit approval in sandboxed Codex sessions.
2. Run the helper with existing env values when possible:

   ```bash
   node skills/posthaste-reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
     --write-env \
     --user-agent "posthaste-prepare-link/1.0 by u/<reddit-username>" \
     --subreddit "<subreddit-name>"
   ```

3. If the browser cannot open, rerun with `--no-open` and ask the user to open
   the printed authorization URL manually. The URL must not contain secrets.
4. After Reddit redirects to the local callback page, report only the safe
   summary printed by the script: dotenv path, updated key names, and granted
   scopes.
5. Verify the posting skill sees Reddit as configured:

   ```bash
   node skills/posthaste-prepare-link/resources/post-crosspost.ts --info
   ```

Do not include the refresh token in the final answer. If setup succeeds, say
that `REDDIT_REFRESH_TOKEN` is stored and Reddit is configured.

## Non-interactive / agent-driven invocation

This script never reads `process.stdin` — it only waits for the browser to
hit the local loopback callback server. Do not redirect stdin from a named
pipe (`< fifo`) for this script: a plain read-only `open()` on a fifo blocks
in the shell before Node even starts, which would delay or hide the printed
authorization URL for no benefit, since nothing in this script ever consumes
that input.

Run it in the background instead, capture its output to a log file, and read
the authorization URL from that log as soon as it appears:

```bash
LOG=/path/to/scratch/reddit_oauth.log
rm -f "$LOG"
node skills/posthaste-reddit-refresh-token/scripts/create-reddit-refresh-token.ts \
  --write-env --no-open \
  --user-agent "posthaste-prepare-link/1.0 by u/<reddit-username>" \
  --subreddit "<subreddit-name>" \
  > "$LOG" 2>&1 &
```

Then read `$LOG` for the "Open this Reddit authorization URL in your
browser:" line and hand that URL to the user. Once they authorize in a real
browser, Reddit redirects straight to the loopback server on its own — no
further input from the agent is needed. Poll `$LOG` (or wait on the
background job) for the final "Stored Reddit OAuth values in" line or an
`Error:` line to know when it's done.

If `$LOG` ever shows the state-mismatch error below, it means a stale browser
tab from an earlier run hit this run's callback server before the real
authorization happened — rerun the command above and use the fresh URL it
prints, not an old tab:

```text
OAuth state mismatch — this callback doesn't match the authorization request
from this run. This usually happens when a browser tab from a
different/earlier run hits this callback server. Restart this command and
use the authorization URL it prints this time, not a previously opened
browser tab.
```

## Options

Use these when defaults do not match the Reddit app:

```bash
--client-id "<id>"
--client-secret "<secret>"
--host "localhost"
--port 8080
--callback-path "/callback"
--redirect-uri "http://127.0.0.1:8765/callback"
--scope "identity submit"
--dotenv "~/.env"
--fix-permissions
--no-open
```

Use `--fix-permissions` only when the user agrees to chmod the dotenv file to
`0600`.
