import { spawnSync } from "node:child_process";
import { collections } from "./collections.ts";
import { releaseState } from "./release-state.ts";

// Releases every collection that has unreleased commits, one after the other.
// With `--dry-run`, each collection runs `release:dry` instead. The run stops
// at the first failure, because a failed release can leave the working tree
// dirty and every later release requires a clean working tree.

const dryRun = process.argv.includes("--dry-run");
const script = dryRun ? "release:dry" : "release";

// Without the token, release-it pushes the tag and only prints a link to
// create each GitHub release manually, so check it before the first release.
if (!dryRun && !process.env.GITHUB_TOKEN_CONTENT_PRIVATE) {
  console.error("GITHUB_TOKEN_CONTENT_PRIVATE is not set.");
  process.exit(1);
}

const changed = collections.flatMap((collection) => {
  const { version, next } = releaseState(collection);
  return next ? [{ collection, version, next }] : [];
});

if (changed.length === 0) {
  console.log("No collection has unreleased commits.");
  process.exit(0);
}

console.log(`Collections to release${dryRun ? " (dry run)" : ""}:`);
for (const { collection, version, next } of changed) {
  console.log(`  ${collection} ${version} -> ${next}`);
}

for (const [index, { collection }] of changed.entries()) {
  console.log(`\n=== ${collection}`);
  const result = spawnSync(
    "npm",
    ["run", script, "--workspace", `collections/${collection}`],
    { stdio: "inherit" },
  );
  if (result.status !== 0) {
    const remaining = changed.slice(index + 1).map((entry) => entry.collection);
    console.error(`\n${script} failed for ${collection}.`);
    if (remaining.length > 0)
      console.error(`Not started: ${remaining.join(", ")}`);
    process.exit(result.status ?? 1);
  }
}
