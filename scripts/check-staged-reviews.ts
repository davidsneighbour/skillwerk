import { checkStagedReviews } from "./skill-review-acceptance.ts";
import { git } from "./skill-review-git.ts";

try {
  if (process.argv.includes("--help"))
    console.log(
      "Usage: npm run validate:staged\nRequire current human acceptance of staged changes to existing skills. New and untouched skills are exempt.",
    );
  else {
    const skills = checkStagedReviews(
      git(process.cwd(), "rev-parse", "--show-toplevel").trim(),
    );
    console.log(
      `Review gate passed for ${skills.length} changed existing skill(s).`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
