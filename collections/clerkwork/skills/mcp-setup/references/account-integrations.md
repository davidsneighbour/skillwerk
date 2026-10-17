<!-- cspell:words Planable -->

# Account integrations

Load this reference only when the user explicitly names Planable or SE Ranking, or requests account integrations. Neither belongs in generic catalogue output, onboarding recommendations, or generic connection checks.

| Server ID | Purpose | Remote HTTP endpoint | Official setup source | Optional companion skills |
| --- | --- | --- | --- | --- |
| `planable` | Social content planning and management | `https://mcp.planable.io/mcp` | [Planable MCP help](https://help.planable.io/hc/en-us/articles/27538577098780-How-to-connect-Planable-MCP-to-your-AI-tools) | [SMM skills](https://github.com/seranking-planable/smm-skills) |
| `se-ranking` | SEO research and reporting | `https://api.seranking.com/mcp` | [SE Ranking's official skills and connection guide](https://github.com/seranking/seo-skills) | The same repository contains the optional SEO skills |

Recheck current endpoints, authentication, account entitlements, and client support in the official sources before setup. Both require an account with MCP access. Do not assume that an existing account has the required entitlement, quote stale plan names, or create an account as part of configuration.

Check whether an installed plugin or connected app already supplies the selected service. Some companion plugins register the MCP server themselves; inspect their actual behaviour before adding a duplicate registration. A connected app in this session does not establish configuration in another client.

Server setup does not include companion skill or plugin installation. When explicitly requested, inspect the current upstream installation instructions, explain bundled MCP registration where applicable, and follow the repository's skill storage policy. Do not vendor those skill collections into this skill or make them runtime dependencies.

Use OAuth or the current documented authentication method. Let the user complete sign-in. Verify with client status or MCP tool discovery without reading customer data, spending account credits on reports, changing content, or sending messages. Report sign-in and entitlement blockers separately from configuration success.
