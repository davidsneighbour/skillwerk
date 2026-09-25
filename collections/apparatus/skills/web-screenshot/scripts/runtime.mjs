#!/usr/bin/env node

import { spawn } from "node:child_process";
import { constants as fsConstants } from "node:fs";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";

const APP_NAME = "apparatus-runtime";

function printHelp() {
  console.log(
    `
Usage:
  apparatus-runtime --action=ensure --manifest=/path/to/runtime.json
  apparatus-runtime --action=exec --manifest=/path/to/runtime.json --script=/path/to/script.ts -- --url=https://example.com

Options:
  --action=ensure|exec     Ensure a runtime exists, or ensure it and execute a script.
  --manifest=PATH          Path to the skill runtime manifest.
  --script=PATH            Script to execute for --action=exec.
  --runtime-root=PATH      Override the shared runtime root.
  --help                   Show this help.

Environment:
  APPARATUS_RUNTIME_ROOT   Shared runtime root override.
  XDG_DATA_HOME            Used when APPARATUS_RUNTIME_ROOT is unset.

Default runtime root:
  $XDG_DATA_HOME/apparatus/runtimes
  or ~/.local/share/apparatus/runtimes
`.trim(),
  );
}

export function parseArgs(argv) {
  const options = {};
  const passthrough = [];
  let afterSeparator = false;

  for (const arg of argv) {
    if (afterSeparator) {
      passthrough.push(arg);
      continue;
    }

    if (arg === "--") {
      afterSeparator = true;
      continue;
    }

    if (arg === "--help") {
      options.help = true;
      continue;
    }

    if (!arg.startsWith("--") || !arg.includes("=")) {
      throw new Error(`Invalid argument "${arg}". Use --name=value syntax.`);
    }

    const [rawName, ...valueParts] = arg.slice(2).split("=");
    options[rawName] = valueParts.join("=");
  }

  return { options, passthrough };
}

export function getDefaultRuntimeRoot() {
  if (process.env.APPARATUS_RUNTIME_ROOT) {
    return resolve(process.env.APPARATUS_RUNTIME_ROOT);
  }

  const dataHome = process.env.XDG_DATA_HOME
    ? resolve(process.env.XDG_DATA_HOME)
    : join(homedir(), ".local", "share");

  return join(dataHome, "apparatus", "runtimes");
}

async function readJson(filePath) {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Failed to read JSON from ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      {
        cause: error,
      },
    );
  }
}

export function validateManifest(manifest, sourcePath) {
  if (!manifest || typeof manifest !== "object") {
    throw new Error(`Invalid runtime manifest: ${sourcePath}`);
  }

  if (manifest.schemaVersion !== 1) {
    throw new Error(`Unsupported schemaVersion in ${sourcePath}. Expected 1.`);
  }

  if (typeof manifest.runtime !== "string" || manifest.runtime.length === 0) {
    throw new Error(
      `Manifest ${sourcePath} must define a non-empty "runtime" string.`,
    );
  }

  if (
    !manifest.packages ||
    typeof manifest.packages !== "object" ||
    Array.isArray(manifest.packages)
  ) {
    throw new Error(`Manifest ${sourcePath} must define a "packages" object.`);
  }

  for (const [name, range] of Object.entries(manifest.packages)) {
    if (
      typeof name !== "string" ||
      !name ||
      typeof range !== "string" ||
      !range
    ) {
      throw new Error(
        `Manifest ${sourcePath} contains an invalid package requirement.`,
      );
    }
  }

  if (
    manifest.playwright?.browsers &&
    !Array.isArray(manifest.playwright.browsers)
  ) {
    throw new Error(
      `Manifest ${sourcePath} property "playwright.browsers" must be an array.`,
    );
  }
}

export function runtimePackageJson(manifest) {
  return {
    private: true,
    type: "module",
    name: `apparatus-runtime-${manifest.runtime}`,
    version: "0.0.0",
    dependencies: { ...manifest.packages },
  };
}

function spawnCommand(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("error", (error) => {
      rejectPromise(
        new Error(`Failed to start "${command}": ${error.message}`, {
          cause: error,
        }),
      );
    });

    child.on("exit", (code, signal) => {
      if (signal) {
        rejectPromise(
          new Error(`Command "${command}" terminated by signal ${signal}.`),
        );
        return;
      }

      if (code !== 0) {
        rejectPromise(
          new Error(`Command "${command}" exited with code ${code}.`),
        );
        return;
      }

      resolvePromise();
    });
  });
}

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureRuntime(manifestPath, runtimeRoot) {
  const resolvedManifestPath = resolve(manifestPath);
  const manifest = await readJson(resolvedManifestPath);
  validateManifest(manifest, resolvedManifestPath);

  const runtimeDir = join(runtimeRoot, manifest.runtime);
  const packagePath = join(runtimeDir, "package.json");
  const statePath = join(runtimeDir, ".runtime.json");
  const desiredPackage = runtimePackageJson(manifest);

  await mkdir(runtimeDir, { recursive: true });

  let installRequired = true;

  if (await fileExists(packagePath)) {
    try {
      const currentPackage = await readJson(packagePath);
      installRequired =
        JSON.stringify(currentPackage.dependencies ?? {}) !==
        JSON.stringify(desiredPackage.dependencies);
    } catch {
      installRequired = true;
    }
  }

  if (installRequired) {
    await writeFile(
      packagePath,
      `${JSON.stringify(desiredPackage, null, 2)}\n`,
      "utf8",
    );

    console.log(
      `[${APP_NAME}] Installing runtime "${manifest.runtime}" dependencies...`,
    );
    await spawnCommand("npm", ["install", "--no-audit", "--no-fund"], {
      cwd: runtimeDir,
      env: process.env,
    });
  } else {
    console.log(
      `[${APP_NAME}] Runtime "${manifest.runtime}" dependencies already satisfy the manifest.`,
    );
  }

  const browsers = Array.isArray(manifest.playwright?.browsers)
    ? manifest.playwright.browsers
    : [];

  if (browsers.length > 0) {
    const playwrightBin = join(
      runtimeDir,
      "node_modules",
      ".bin",
      "playwright",
    );
    const browserRoot = join(runtimeDir, "browsers");

    if (!(await fileExists(playwrightBin))) {
      throw new Error(
        `Manifest requests Playwright browsers, but "playwright" is not installed in runtime "${manifest.runtime}".`,
      );
    }

    await mkdir(browserRoot, { recursive: true });

    for (const browser of browsers) {
      const marker = join(browserRoot, `.installed-${browser}`);

      if (await fileExists(marker)) {
        console.log(
          `[${APP_NAME}] Playwright browser "${browser}" already bootstrapped.`,
        );
        continue;
      }

      console.log(
        `[${APP_NAME}] Installing Playwright browser "${browser}"...`,
      );
      await spawnCommand(playwrightBin, ["install", browser], {
        cwd: runtimeDir,
        env: {
          ...process.env,
          PLAYWRIGHT_BROWSERS_PATH: browserRoot,
        },
      });

      await writeFile(marker, `${new Date().toISOString()}\n`, "utf8");
    }
  }

  await writeFile(
    statePath,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        runtime: manifest.runtime,
        node: process.version,
        manifest: resolvedManifestPath,
        packages: manifest.packages,
        browsers,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return {
    manifest,
    runtimeDir,
    browserRoot: join(runtimeDir, "browsers"),
  };
}

async function executeScript(runtimeInfo, scriptPath, passthrough) {
  const resolvedScript = resolve(scriptPath);
  const tsxBin = join(runtimeInfo.runtimeDir, "node_modules", ".bin", "tsx");

  if (!(await fileExists(tsxBin))) {
    throw new Error(
      `Runtime "${runtimeInfo.manifest.runtime}" cannot execute TypeScript because "tsx" is not installed.`,
    );
  }

  if (!(await fileExists(resolvedScript))) {
    throw new Error(`Script does not exist: ${resolvedScript}`);
  }

  await spawnCommand(tsxBin, [resolvedScript, ...passthrough], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PLAYWRIGHT_BROWSERS_PATH: runtimeInfo.browserRoot,
    },
  });
}

async function main() {
  const { options, passthrough } = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const action = options.action;
  const manifestPath = options.manifest;
  const runtimeRoot = options["runtime-root"]
    ? resolve(options["runtime-root"])
    : getDefaultRuntimeRoot();

  if (action !== "ensure" && action !== "exec") {
    throw new Error(
      "Missing or invalid --action. Expected --action=ensure or --action=exec.",
    );
  }

  if (!manifestPath) {
    throw new Error("Missing required --manifest=/path/to/runtime.json.");
  }

  const runtimeInfo = await ensureRuntime(manifestPath, runtimeRoot);

  console.log(`[${APP_NAME}] Runtime ready: ${runtimeInfo.runtimeDir}`);

  if (action === "exec") {
    if (!options.script) {
      throw new Error("--action=exec requires --script=/path/to/script.ts.");
    }

    await executeScript(runtimeInfo, options.script, passthrough);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await main();
  } catch (error) {
    console.error(
      `[${APP_NAME}] ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}
