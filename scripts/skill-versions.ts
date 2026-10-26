import { git } from "./skill-review-git.ts";

// Skill versions use stable SemVer only. Keep the metadata mapping in the
// canonical block form used by the repository, rather than parsing the body.
export function skillVersion(source: string): string {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
    source,
  )?.[1];
  const lines = frontmatter?.split(/\r?\n/) ?? [];
  const mappings = lines.filter((line) => /^metadata:/.test(line));
  if (mappings.length !== 1 || !/^metadata:\s*$/.test(mappings[0] ?? ""))
    throw new Error("Use a single metadata block with a version field");
  const start = lines.findIndex((line) => /^metadata:/.test(line));
  const children: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\S/.test(line) && !line.startsWith("#")) break;
    if (line.trim() && !/^\s*#/.test(line)) children.push(line);
  }
  const indent = children[0]?.match(/^ +/)?.[0];
  const fields = children.filter((line) =>
    indent ? line.startsWith(`${indent}version:`) : false,
  );
  if (fields.length !== 1)
    throw new Error("Missing or duplicate metadata.version");
  const raw =
    fields[0]?.slice((indent?.length ?? 0) + "version:".length).trim() ?? "";
  const version = /^(?:"([^"]+)"|'([^']+)'|([^\s#]+))(?:\s+#.*)?$/.exec(raw);
  const value = version?.[1] ?? version?.[2] ?? version?.[3] ?? "";
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value))
    throw new Error(
      `Invalid metadata.version ${JSON.stringify(value)}; use stable MAJOR.MINOR.PATCH`,
    );
  return value;
}

function increased(before: string, after: string): boolean {
  const previous = before.split(".").map(BigInt);
  const next = after.split(".").map(BigInt);
  for (let index = 0; index < 3; index++) {
    if (next[index] !== previous[index])
      return (next[index] ?? 0n) > (previous[index] ?? 0n);
  }
  return false;
}

export function checkStagedVersions(root: string): string[] {
  const paths = git(
    root,
    "diff",
    "--cached",
    "--name-only",
    "--no-renames",
    "-z",
  ).split("\0");
  const skills = [
    ...new Set(
      paths.flatMap((path) => {
        if (path.split("/").includes("scratch")) return [];
        const match = /^collections\/([^/]+)\/skills\/([^/]+)\//.exec(path);
        return match
          ? [`collections/${match[1]}/skills/${match[2]}/SKILL.md`]
          : [];
      }),
    ),
  ];
  const checked: string[] = [];
  for (const path of skills) {
    // A removed skill has no staged entry point to version.
    if (!git(root, "ls-files", "--", path).trim()) continue;
    try {
      const after = skillVersion(git(root, "show", `:${path}`));
      const exists = git(root, "ls-tree", "HEAD", "--", path).trim();
      if (!exists) {
        if (after !== "1.0.0")
          throw new Error("New skills must start at 1.0.0");
      } else {
        const before = skillVersion(git(root, "show", `HEAD:${path}`));
        if (!increased(before, after))
          throw new Error(
            `Increase metadata.version above ${before}; staged value is ${after}`,
          );
      }
      checked.push(path);
    } catch (error) {
      throw new Error(
        `${path}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  return checked;
}
