# Unsplash authentication

Use this procedure before every Unsplash API operation.

## Supported variables

The skill checks for credentials in this order:

```text
UNSPLASH_POSTHASTE_ACCESS_KEY
UNSPLASH_ACCESS_KEY
```

Prefer `UNSPLASH_POSTHASTE_ACCESS_KEY` so Posthaste can use its own Unsplash API key when other workflows also use Unsplash.

Never use bundled, example, demo, or testing credentials.

Never print or log the key.

Whenever referring to an existing key in output, represent it only as:

```text
***
```

## Credential resolution

Load global `~/.env` first, then project `.env`, and then any different dotenv file selected by Posthaste configuration or an explicit request. Later files override matching keys. Preserve existing process environment variables above all dotenv values. Use the shared `posthaste-config/resources/dotenv.ts` loader when preparing the child script environment; it parses data without executing shell commands. Check `UNSPLASH_POSTHASTE_ACCESS_KEY` first, falling back to `UNSPLASH_ACCESS_KEY`, after merging all layers. Ensure child Bash scripts inherit the result, and continue only when a usable key is available.

Do not expose the credential while checking for it.

## Safe loading

Follow the credential file precedence in `posthaste-config`. Pass the merged values to the child script, with existing process environment variables applied last. Do not source dotenv files as shell scripts, and do not print the environment after loading it.

## Forbidden diagnostics

Do not use commands whose visible output could expose secrets, including:

```bash
env
printenv
cat .env
grep UNSPLASH_POSTHASTE_ACCESS_KEY .env
echo "$UNSPLASH_POSTHASTE_ACCESS_KEY"
grep UNSPLASH_ACCESS_KEY .env
echo "$UNSPLASH_ACCESS_KEY"
```

A secret-presence check must reveal only whether the variable is configured, never its value.

## Missing credential

If no usable key can be found, stop before calling Unsplash.

Return:

```text
No Unsplash API key is configured.

I need UNSPLASH_POSTHASTE_ACCESS_KEY or UNSPLASH_ACCESS_KEY available in the environment or project .env before I can use Unsplash.

You can either:
1. configure an existing Unsplash API key, or
2. create an Unsplash developer application and obtain an API key at https://unsplash.com/developers
```

Let the user choose whether to configure an existing key or create an Unsplash application.

Do not create an account, application, or credential automatically.

Do not substitute another photo provider unless explicitly requested.

## Getting an Unsplash API key

If the user needs a new key, direct them to:

```text
https://unsplash.com/developers
```

Setup flow:

1. Sign in to Unsplash.
2. Open the developer page.
3. Create a new application.
4. Accept the API terms presented by Unsplash.
5. Open the application's Keys section.
6. Copy the application's **Access Key**.
7. Store it as `UNSPLASH_POSTHASTE_ACCESS_KEY` in the appropriate environment or project `.env`. Use `UNSPLASH_ACCESS_KEY` only when a shared Unsplash key is intentional.

Example `.env` entry:

```dotenv
UNSPLASH_POSTHASTE_ACCESS_KEY=your_access_key_here
```

Do not ask the user to paste the key into chat unless they explicitly choose to do so.

Prefer that they configure it directly in their environment or `.env`.

If demonstrating a configured key, always mask it:

```text
UNSPLASH_POSTHASTE_ACCESS_KEY=***
UNSPLASH_ACCESS_KEY=***
```

## Invalid credential

If Unsplash rejects the configured credential:

```text
The configured Unsplash API key was rejected.

The configured Unsplash access key is currently set to ***, but Unsplash did not accept it.
```

Do not reveal the actual value.

## Child-process requirement

Before reporting an authentication failure from `search.sh`, `random.sh`, or `track.sh`, verify that the script actually inherited `UNSPLASH_POSTHASTE_ACCESS_KEY` or `UNSPLASH_ACCESS_KEY`.

A key present only inside an unexported shell variable is insufficient.

## Secret handling

Treat both Unsplash Access Keys and Secret Keys as confidential.

This skill only needs the Access Key for its current public API operations.

Never:

* commit credentials;
* write them into `SKILL.md`;
* put real credentials in example configuration;
* return them in JSON;
* include them in URLs shown to the user;
* include them in logs or error messages;
* expose authorisation headers.
