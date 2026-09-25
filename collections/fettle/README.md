# Fettle

Fettle is a plugin-first engineering system for agent skills. It captures lightweight execution evidence, produces deduplicated findings, and supports five portable workflows: Inspector, Observer, Engineer, Prover, and Steward.

## Requirements

* Node.js 25 or later
* npm
* Claude Code 2.1.261 or later for native hook integration
* Codex CLI 0.157.0 or later for plugin discovery

## Set-up

```sh
npm install
npm run check
```

The repository root is both a Claude Code plugin and a Codex plugin. Claude Code discovers `hooks/hooks.json` and the skills automatically. Codex discovers the five skills; because Codex 0.157.0 does not register lifecycle hooks from `plugin.json`, use the explicit adapter documented in [Host integration](plugin/README.md).

## Commands

```sh
npm run fettle -- inspect [collection-or-skill]
npm run fettle -- observe [--since 7d]
npm run fettle -- engineer <finding-id>
npm run fettle -- prove [collection-or-skill]
npm run fettle -- steward [--all]
npm run fettle -- capture <host> <event-name>
```

Commands write generated data below `reports/`, which Git ignores. Observation never grants permission to edit a skill or publish an issue.

## Documentation

* [Host integration](plugin/README.md)
* [Detection rules](resources/detection-rules.md)
* [Governance and privacy](resources/governance.md)
* [Event schema](schemas/event.schema.json)
* [Finding schema](schemas/finding.schema.json)
* [Report schema](schemas/report.schema.json)

The original concept is retained in `scratch/PLAN.md`.
