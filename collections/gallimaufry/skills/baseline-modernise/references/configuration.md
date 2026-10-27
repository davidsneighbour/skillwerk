# Configuration and data

Precedence is explicit CLI overrides, then `baseline` in project-root `patternbook.json`, then built-in defaults. The legacy filename remains supported for this cross-framework workflow; the CLI reads only its `baseline` section and does not write configuration.

```json
{
  "baseline": {
    "target": "widely",
    "mode": "static",
    "paths": ["src"],
    "exclude": ["src/generated"],
    "reportDir": "reports/baseline"
  }
}
```

Targets are `widely`, `newly`, or a year from `1900` to `2099`. Years are snapshot date comparisons, not a promise of future browser support. Only static mode is supported. Unknown baseline options and invalid types are errors; earlier draft runtime and glob options must be removed rather than silently ignored.

Source and exclusion paths are literal project-relative files or directories, not glob expressions. Directory exclusions also exclude descendants. Absolute paths, parent traversal, symbolic-link ancestors, and protected directories are rejected. Nested `scratch`, `.scratch`, `.git`, `node_modules`, `dist`, `build`, `.astro`, and `coverage` directories are always skipped before reading their contents. Sources are limited to CSS, Astro, HTML, JSX/TSX, and JS/TS files. The report directory is excluded from scanning even when a source root contains it.

Use a dedicated report directory outside authored source trees. An existing directory must contain only a recognised `audit.json` from this tool and its optional `index.html`; unrelated output is not overwritten. Each run replaces the previous report there. Use different report directories to preserve snapshots and their finding IDs.

For reproducible offline data, supply a JSON envelope:

```json
{
  "source": "web-features snapshot",
  "version": "record-the-actual-package-version",
  "features": {
    "dialog": {
      "name": "Dialog",
      "status": {
        "baseline": "high",
        "baseline_low_date": "2022-03-01",
        "baseline_high_date": "2024-09-01"
      }
    }
  }
}
```

The dates above illustrate the format only; they are not verified feature-support dates. Use an actual complete exported dataset for an audit. Missing features remain unknown. Status `high` maps to widely available, `low` to newly available, and `false` to limited availability. Unrecognised or missing status remains unknown. The tool records the source and version supplied by the caller, but cannot authenticate a custom snapshot.

To export an installed package when authorised, run this from the directory where it resolves, and use the version from that installation's `package.json`:

```javascript
import { features } from "web-features";
const snapshot = { source: "web-features", version: actualInstalledVersion, features };
```

Save that object as JSON with an appropriate local script. Do not claim data is current merely because an installed package or a report exists. Inspect package age and current official feature data before acting on a candidate.
