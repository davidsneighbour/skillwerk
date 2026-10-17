# Browser debugging

Use the [official repository](https://github.com/ChromeDevTools/chrome-devtools-mcp) for requirements, client configuration, launch flags, and troubleshooting. The local npm package is `chrome-devtools-mcp`; the official example uses `npx` with arguments `-y` and `chrome-devtools-mcp@latest`. Recheck current instructions and apply the target project's version policy before configuring it.

Inspect Node.js, npm, and Chrome availability before setup. Read the official configuration guide before selecting browser attachment, isolation, telemetry, or profile options. Preserve existing choices. Do not attach to the user's personal browser profile or expose a debugging port merely to test installation. Prefer connection and tool discovery checks; if an actual browser test is requested, use a separate test session and a public page.
