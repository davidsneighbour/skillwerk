import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, renameSync, rmSync } from "node:fs";
import { join } from "node:path";
import { selectedCollection } from "./collections.ts";

const collection = selectedCollection(process.argv.slice(2));
if (!collection) throw new Error("Use --collection <name>");
mkdirSync("dist", { recursive: true });
const output = join("dist", `${collection}.tar.gz`);
const temporaryDirectory = mkdtempSync(join("dist", `.${collection}-`));
const temporaryOutput = join(temporaryDirectory, `${collection}.tar.gz`);
try {
  const result = spawnSync(
    "tar",
    [
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=scratch",
      "-czf",
      temporaryOutput,
      "-C",
      "collections",
      collection,
    ],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  } else {
    renameSync(temporaryOutput, output);
    console.log(output);
  }
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
