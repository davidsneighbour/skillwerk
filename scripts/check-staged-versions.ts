import { git } from "./skill-review-git.ts";
import { checkStagedVersions } from "./skill-versions.ts";

try {
  if (process.argv.includes("--help")) {
    console.log(
      "Usage: npm run validate:versions\nRequire a higher stable metadata.version for each staged existing skill, or 1.0.0 for a new skill. Compare the index with HEAD; deleted skills and historical changes are excluded.",
    );
  } else {
    const root = git(process.cwd(), "rev-parse", "--show-toplevel").trim();
    console.log(
      `Version gate passed for ${checkStagedVersions(root).length} staged skill(s).`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
