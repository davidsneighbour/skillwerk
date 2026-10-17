import { appendFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  changedSinceReview,
  discoverSkills,
  markdownReport,
  reviewRows,
  terminalReport,
  validateRegister,
} from "./skill-review-state.ts";

try {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(
      "Usage: node scripts/skill-reviews.ts [--markdown] [--github] | --validate\nReport manual skill reviews due. Age warnings never fail; invalid records do.\nDefault: formatted terminal table\n--markdown  Print Markdown instead\n--validate  Validate records and Git baselines only\n--github    Add a workflow summary and grouped warning",
    );
  } else {
    if (
      new Set(args).size !== args.length ||
      (args.includes("--validate") && args.length > 1) ||
      args.some(
        (arg) => !["--validate", "--github", "--markdown"].includes(arg),
      )
    )
      throw new Error("Unknown arguments; use --help");
    const root = fileURLToPath(new URL("../", import.meta.url));
    const today = new Date().toISOString().slice(0, 10);
    const skills = await discoverSkills(root);
    const register = validateRegister(
      JSON.parse(
        readFileSync(new URL("../skill-reviews.json", import.meta.url), "utf8"),
      ),
      skills,
      today,
    );
    const rows = reviewRows(register, skills, today);
    for (const row of rows) {
      const review = register.skills[row.skill]?.review;
      if (review)
        row.changed = changedSinceReview(
          root,
          row.skill,
          review.reviewed_commit,
          review.reviewed_content_hash,
        );
    }
    if (args.includes("--validate"))
      console.log(`Validated review register for ${skills.length} skills.`);
    else {
      const report = markdownReport(rows, today);
      console.log(
        args.includes("--markdown") ? report : terminalReport(rows, today),
      );
      if (args.includes("--github")) {
        if (process.env.GITHUB_STEP_SUMMARY)
          appendFileSync(process.env.GITHUB_STEP_SUMMARY, report);
        const due = rows.filter((row) => row.status !== "current").length;
        if (due)
          console.log(
            `::warning title=Manual skill reviews due::${due} skills require review or are approaching their review date. See the workflow summary. Review age is advisory.`,
          );
      }
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
