import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  git,
  hasUnstagedSkillChanges,
  skillExistsAt,
  stagedFingerprint,
  stagedSkills,
} from "./skill-review-git.ts";
import {
  discoverSkills,
  reviewRows,
  validateRegister,
} from "./skill-review-state.ts";

export async function setReview(
  root: string,
  requested: string,
  evidence?: string,
): Promise<string> {
  const skills = await discoverSkills(root);
  const matches = skills.filter(
    (skill) =>
      skill === requested ||
      (!requested.includes("/") && skill.split("/")[1] === requested),
  );
  if (matches.length !== 1)
    throw new Error(
      matches.length
        ? `Ambiguous skill; use collection/skill: ${matches.join(", ")}`
        : `Unknown skill: ${requested}`,
    );
  const skill = matches[0];
  if (!skill) throw new Error("Missing skill");
  const today = new Date().toISOString().slice(0, 10);
  const path = join(root, "skill-reviews.json");
  const register = validateRegister(
    JSON.parse(readFileSync(path, "utf8")),
    skills,
    today,
  );
  if (
    !stagedSkills(root).includes(skill) ||
    hasUnstagedSkillChanges(root, skill)
  )
    throw new Error(
      `Stage all intended files in ${skill} first; unstaged or untracked skill files cannot be accepted.`,
    );
  const reviewer = git(root, "config", "user.name").trim();
  if (!reviewer)
    throw new Error("Set git config user.name before accepting a review");
  register.skills[skill] = {
    ...register.skills[skill],
    review: {
      reviewed_on: today,
      reviewed_by: reviewer,
      reviewed_commit: git(root, "rev-parse", "HEAD").trim(),
      reviewed_content_hash: stagedFingerprint(root, skill),
      evidence:
        evidence?.trim() ||
        `Manual review accepted by ${reviewer} via validate:set for the staged skill content.`,
    },
  };
  validateRegister(register, skills, today);
  writeFileSync(path, `${JSON.stringify(register, null, 2)}\n`);
  return skill;
}

export function checkStagedReviews(root: string): string[] {
  const paths = git(
    root,
    "diff",
    "--cached",
    "--name-only",
    "--no-renames",
    "-z",
  ).split("\0");
  const touched = [
    ...new Set(
      paths.flatMap((path) => {
        if (path.split("/").includes("scratch")) return [];
        const match = /^collections\/([^/]+)\/skills\/([^/]+)\//.exec(path);
        return match ? [`${match[1]}/${match[2]}`] : [];
      }),
    ),
  ];
  const skills = stagedSkills(root);
  const existing = touched.filter(
    (skill) => skills.includes(skill) && skillExistsAt(root, skill, "HEAD"),
  );
  if (!existing.length) return [];
  const today = new Date().toISOString().slice(0, 10);
  const register = validateRegister(
    JSON.parse(git(root, "show", ":skill-reviews.json")),
    skills,
    today,
  );
  for (const row of reviewRows(register, existing, today)) {
    const review = register.skills[row.skill]?.review;
    if (
      !review ||
      row.status === "overdue" ||
      review.reviewed_content_hash !== stagedFingerprint(root, row.skill)
    )
      throw new Error(
        `Review required for ${row.skill}. Review the staged skill, run npm run validate:set -- ${row.skill}, then git add skill-reviews.json.`,
      );
    git(root, "merge-base", "--is-ancestor", review.reviewed_commit, "HEAD");
  }
  return existing;
}
