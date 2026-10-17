import { setReview } from "./skill-review-acceptance.ts";
import { git } from "./skill-review-git.ts";

try {
  const args = process.argv.slice(2);
  if (args[0] === "--help")
    console.log(
      "Usage: npm run validate:set -- <skill|collection/skill> [--evidence <note-or-link>]\nAccept a human review of staged skill content. Records your Git name, UTC date, HEAD, and content fingerprint. Stage skill-reviews.json afterwards.",
    );
  else {
    const [skill, option, evidence] = args;
    if (
      !skill ||
      skill.startsWith("-") ||
      (args.length !== 1 &&
        (args.length !== 3 || option !== "--evidence" || !evidence?.trim()))
    )
      throw new Error("Use --help for usage");
    const root = git(process.cwd(), "rev-parse", "--show-toplevel").trim();
    console.log(
      `Accepted review for ${await setReview(root, skill, evidence)}. Stage skill-reviews.json to include it in the commit.`,
    );
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
