import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collections, selectedCollection } from "./collections.ts";

const selected = selectedCollection(process.argv.slice(2));
const targets = selected ? [selected] : collections;
const explicitOnlySkills = [
  "posthaste-reddit-refresh-token",
  "posthaste-threads-refresh-token",
  "posthaste-tumblr-refresh-token",
];
const validator = fileURLToPath(
  new URL("./validate-skills.ts", import.meta.url),
);

for (const collection of targets) {
  const result = spawnSync(
    process.execPath,
    [validator, join("collections", collection)],
    {
      env: {
        ...process.env,
        SKILLWERK_EXPLICIT_ONLY:
          collection === "posthaste" ? explicitOnlySkills.join(",") : "",
      },
      stdio: "inherit",
    },
  );

  if (result.status !== 0) process.exitCode = 1;
}
