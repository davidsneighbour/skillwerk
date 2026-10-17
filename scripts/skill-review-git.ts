import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

export function git(root: string, ...args: string[]): string {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}
export function skillPath(skill: string): string {
  const [collection, name] = skill.split("/");
  return `collections/${collection}/skills/${name}`;
}
export function skillPaths(skill: string): string[] {
  return [skillPath(skill), ":(exclude)**/scratch/**"];
}
export function stagedSkills(root: string): string[] {
  return git(root, "ls-files", "-z")
    .split("\0")
    .flatMap((path) => {
      const match = /^collections\/([^/]+)\/skills\/([^/]+)\/SKILL\.md$/.exec(
        path,
      );
      return match && match[1] !== "scratch" && match[2] !== "scratch"
        ? [`${match[1]}/${match[2]}`]
        : [];
    })
    .sort();
}
export function stagedFingerprint(root: string, skill: string): string {
  const entries = git(
    root,
    "ls-files",
    "--stage",
    "-z",
    "--",
    ...skillPaths(skill),
  );
  if (!entries)
    throw new Error(`Stage the skill before recording its review: ${skill}`);
  if (
    entries
      .split("\0")
      .some((entry) => entry && !/^\d+ [a-f0-9]+ 0\t/.test(entry))
  )
    throw new Error(`Resolve index conflicts before reviewing ${skill}`);
  return createHash("sha256").update(entries).digest("hex");
}
export function hasUnstagedSkillChanges(root: string, skill: string): boolean {
  return Boolean(
    git(root, "diff", "--name-only", "--", ...skillPaths(skill)).trim() ||
      git(
        root,
        "ls-files",
        "--others",
        "--exclude-standard",
        "--",
        ...skillPaths(skill),
      ).trim(),
  );
}
export function skillExistsAt(
  root: string,
  skill: string,
  revision: string,
): boolean {
  return Boolean(
    git(root, "ls-tree", revision, "--", `${skillPath(skill)}/SKILL.md`).trim(),
  );
}
