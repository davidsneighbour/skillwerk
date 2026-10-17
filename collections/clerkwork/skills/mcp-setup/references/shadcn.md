# Component registry setup

Use the [official shadcn MCP guide](https://ui.shadcn.com/docs/mcp) for client-specific setup and registry configuration. The local npm package is `shadcn`; the official server command is `npx` with arguments `shadcn@latest` and `mcp`. Recheck current instructions and apply the target project's version policy before configuring it.

Do not initialise a shadcn application, modify `components.json`, add private registries, or install components merely to register or check the server. Preserve existing registry configuration. An existing server's read-only component listing can verify operation when requested; tool discovery is sufficient for a connection check. Keep private registry credentials in supported environment references or credential storage.
