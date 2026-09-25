import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { selectedCollection } from "./collections.ts";

// Runs the repository check. With `--collection <name>`, every step is scoped
// to that collection plus the shared tooling in scripts/, so a failure in one
// collection does not block the check or release of another.

type Step = { name: string; command: string; args: string[] };

const bin = (name: string): string => join("node_modules", ".bin", name);
const npmRun = (script: string): Step => ({
  name: script,
  command: "npm",
  args: ["run", script],
});

const collection = selectedCollection(process.argv.slice(2));
const cleanups: string[] = [];

const scopedSteps = (name: string): Step[] => {
  const root = join("collections", name);
  const repository = process.cwd();

  // tsconfig.json includes every collection, so type-check through a
  // temporary config that narrows `include` and keeps all other options.
  const tsconfigDirectory = mkdtempSync(join(tmpdir(), "skillwerk-check-"));
  cleanups.push(tsconfigDirectory);
  const tsconfig = join(tsconfigDirectory, "tsconfig.json");
  writeFileSync(
    tsconfig,
    JSON.stringify({
      extends: resolve("tsconfig.json"),
      compilerOptions: { typeRoots: [resolve("node_modules", "@types")] },
      include: [
        `${repository}/${root}/**/*.ts`,
        `${repository}/scripts/**/*.ts`,
      ],
    }),
  );

  return [
    {
      name: "lint:code",
      command: bin("biome"),
      args: ["check", root, "scripts"],
    },
    {
      name: "lint:markdown",
      command: bin("markdownlint-cli2"),
      args: [
        "--config",
        "./node_modules/@dnbhq/markdownlint-config/.markdownlint-cli2.jsonc",
        `${root}/**/*.{md,mdx}`,
        "#**/CHANGELOG.md",
        "#**/node_modules/**",
      ],
    },
    {
      name: "lint:spelling",
      command: bin("cspell"),
      args: ["--no-progress", `${root}/**`, "scripts/**"],
    },
    {
      name: "lint:secrets",
      command: bin("dnb-secretlint"),
      args: ["--secretlintignore", ".secretlintignore", `${root}/**/*`],
    },
    { name: "typecheck", command: bin("tsc"), args: ["-p", tsconfig] },
    {
      name: "validate:collections",
      command: process.execPath,
      args: ["scripts/check-collections.ts", "--collection", name],
    },
    {
      name: "validate:skills",
      command: process.execPath,
      args: ["scripts/validate-all-skills.ts", "--collection", name],
    },
    {
      name: "test",
      command: process.execPath,
      args: ["--test", `${root}/**/*.test.ts`],
    },
  ];
};

const steps: Step[] = collection
  ? scopedSteps(collection)
  : [npmRun("lint"), npmRun("typecheck"), npmRun("validate"), npmRun("test")];

const failed: string[] = [];
try {
  for (const step of steps) {
    console.log(`\n▶ ${step.name}${collection ? ` (${collection})` : ""}`);
    const result = spawnSync(step.command, step.args, { stdio: "inherit" });
    if (result.error) console.error(result.error.message);
    if (result.status !== 0) failed.push(step.name);
  }
} finally {
  for (const directory of cleanups)
    rmSync(directory, { recursive: true, force: true });
}

const scope = collection ?? "repository";
if (failed.length > 0) {
  console.error(`\n✗ ${scope}: failed ${failed.join(", ")}`);
  process.exitCode = 1;
} else {
  console.log(`\n✓ ${scope}: all checks passed`);
}
