# Host integration

## Claude Code

Validate the repository with `claude plugin validate .`. The native hook manifest captures `SessionStart`, `PostToolUse`, `PostToolUseFailure`, `UserPromptSubmit`, and `Stop` events. The adapter is fail-open: invalid input or storage failure does not block the original operation.

## Codex CLI

Validate the repository with the plugin validator used by `npm run validate:plugins`. Codex CLI 0.157.0 discovers the skills from the plugin root but does not accept a `hooks` field in `.codex-plugin/plugin.json`. Integrations that can export lifecycle events can pipe one JSON object into the explicit adapter:

```sh
printf '%s' "$EVENT_JSON" | node scripts/fettle.ts capture codex tool-result
```

The adapter accepts arbitrary host payloads, normalises known fields, redacts configured secret keys, and stores newline-delimited JSON below `reports/events/`.

## Failure policy

Capture is bounded by `observation.maximumEvents`. Hook failures are diagnostics only. Fettle does not block the host, publish GitHub issues, or modify skills automatically.
