# Web-screenshot

Apparatus skill for deterministic browser screenshots.

## Contents

```text
web-screenshot/
├── SKILL.md
├── runtime.json
└── scripts/
    ├── runtime.mjs
    ├── screenshot.ts
    └── web-screenshot
```

`SKILL.md` is the actual AI skill.

`runtime.json` declares the shared machine-local browser runtime requirements.

`scripts/runtime.mjs` is the zero-dependency bootstrapper. It installs and reuses dependencies under `~/.local/share/apparatus/runtimes/browser/` by default.

`scripts/screenshot.ts` is the deterministic Playwright implementation.

`scripts/web-screenshot` is the local executable entry point.

The consuming repository is not modified and receives no screenshot dependencies.
