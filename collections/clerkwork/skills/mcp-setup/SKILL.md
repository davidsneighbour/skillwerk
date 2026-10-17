---
id: mcp-setup
name: mcp-setup
title: MCP server setup
description: List curated MCP servers, inspect client configuration and connection status, or set up a named server for a selected client and scope. Use for Foreman MCP requests and explicit MCP configuration work.
metadata:
  version: "1.0.0"
---

<!-- cspell:words planable seranking -->

## Shared vocabulary

Before applying this skill, read [the shared vocabulary](resources/vocabulary.md) and use its meanings for project, project root, skill, and collection. This rule applies whether the skill is invoked directly or through Foreman. The project is the repository that the current task concerns, and its root is that repository's top-level directory.

## Select the operation

* `foreman mcp`, `mcp-setup`, or a catalogue request: show the default catalogue below with purpose and locally detected status. Inspect only relevant client metadata without starting servers, making remote calls, installing packages, or changing files. Mark unavailable evidence as unknown.
* `foreman mcp check [server]`: inspect configuration and existing connections without changes. Use an already available client status or read-only MCP discovery operation. Do not launch an uninstalled package, authenticate, or invoke business tools to test a connection. An explicit named server includes its account-specific reference.
* `foreman mcp setup <server>`: configure only the selected server, following the workflow below. A bare server name without an action means show its details; it does not authorise setup.
* Requests to remove, upgrade, or replace an existing server need that explicit scope. Do not interpret setup as permission to replace a conflicting registration.

## Catalogue

This is the single catalogue for server identity, purpose, and reference ownership. Read only the selected reference during setup or detailed inspection.

| Server ID | Purpose | Setup reference |
| --- | --- | --- |
| `mdn` | Web platform documentation and browser compatibility | [MDN](references/mdn.md) |
| `chrome-devtools` | Inspect and debug a Chrome browser | [Chrome DevTools](references/chrome-devtools.md) |
| `shadcn` | Discover components and registries | [shadcn](references/shadcn.md) |

Account-specific entries are explicit-only: `planable` and `se-ranking` (alias `seranking`). Do not include them in the default catalogue or generic checks, recommend their installation during onboarding, or load their reference unless the user names one or explicitly requests account integrations. For those requests, read [account integrations](references/account-integrations.md). Mention that account integrations are available on request without probing accounts. Optional companion skills require a separate installation request; they are not MCP servers.

For each displayed server, distinguish configuration present, authentication required or not applicable, and connection verified or unverified. Include client and scope when known. Tool availability in this session does not prove that another client is configured, and an HTTP response from an endpoint does not prove an MCP connection works.

## Configure a selected server

1. Identify the target client and its installed version where practical. Reuse the requested or established scope; otherwise establish project or user scope before writing. If multiple clients or scopes are plausible, ask about those choices while completing independent inspection. Do not default silently to user-wide configuration.
2. Inspect relevant configuration and existing registrations through the client's supported read-only interface where possible. Read only the needed configuration sections, redact secrets, and preserve unrelated settings, comments, disabled state, and local edits. Check for duplicate registrations across plugin, project, and user sources before adding another.
3. Read the selected reference and fetch current official server and client setup instructions. Verify CLI flags with the installed client's help before running them. Use the client documentation linked by the server's official guide; do not assume JSON schemas, configuration paths, transport support, scope defaults, or TOML tables are shared across clients. If authoritative guidance is unavailable, report the proposed configuration and uncertainty without applying an unverified schema or command.
4. Prepare a concrete configuration change or supported client command for the selected server and scope. An explicit setup request authorises this bounded change; ask only for unresolved choices or additional actions. Never overwrite a complete configuration file to add one entry. If equivalent configuration exists, leave it intact and report readiness. Resolve conflicting commands, endpoints, or credentials before replacing anything.
5. Use the official remote endpoint or local package from the selected reference, rechecked against current documentation. Prefer npm for local packages. Preserve a project's version policy; explain when an official example uses a moving version such as `@latest`. Do not add application dependencies, initialise a UI project, or install a browser merely to register an MCP server. Report missing prerequisites and request any extra installation scope needed.
6. Use the client's credential store, supported OAuth flow, or supported environment-variable references. Do not place tokens in tracked files, command arguments, transcripts, or reports. A setup request permits the selected server's normal sign-in flow; let the user complete interactive consent. Do not create accounts, buy plans, or change account permissions.
7. Apply the smallest supported change. Parse or validate the resulting configuration with the client's supported check where available. Review a redacted diff. Do not commit user-level configuration or authentication material.
8. Check through the target client where possible, using MCP initialisation, tool discovery, or a documented read-only status check. Avoid browsing personal tabs, accessing customer data, creating posts, or installing components as a smoke test. If the client needs a restart or cannot reload here, report that connection verification remains pending rather than claiming success.

## Report

State the server, client, scope, changed configuration location, checks performed, and remaining sign-in or restart steps. Distinguish configured, authenticated, and connection verified with evidence for each applicable state. Report unavailable checks without inferring failure. Follow repository instructions and the user's scope for commits and publication; setup itself does not authorise a commit or push.
