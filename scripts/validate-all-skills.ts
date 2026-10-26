import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { collections, selectedCollection } from "./collections.ts";

const selected = selectedCollection(process.argv.slice(2));
const targets = selected ? [selected] : collections;
const skillNames = new Map<string, string>();
for (const collection of collections) {
  const root = join("collections", collection, "skills");
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "scratch") continue;
    const skillPath = join(root, entry.name, "SKILL.md");
    const source = readFileSync(skillPath, "utf8");
    const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1];
    const name = /^name:\s*["']?([a-z0-9-]+)["']?\s*$/m.exec(
      frontmatter ?? "",
    )?.[1];
    if (!name) continue;
    const previous = skillNames.get(name);
    if (previous) {
      console.error(
        `Duplicate skill name ${name}: ${previous} and ${skillPath}`,
      );
      process.exitCode = 1;
    } else {
      skillNames.set(name, skillPath);
    }
  }
}
const explicitOnlySkills = [
  "reddit-refresh-token",
  "threads-refresh-token",
  "tumblr-refresh-token",
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
