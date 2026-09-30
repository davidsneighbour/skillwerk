import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createChangelogScopes } from "@dnbhq/release-config";
import { collections, selectedCollection } from "./collections.ts";

// Shows which collections have unreleased commits and the version that
// `npm run release --workspace collections/<name>` would propose. The bump
// follows the conventionalcommits preset that the release config uses:
// a breaking change is major, `feat` is minor, and any other configured
// type is patch. With `--collection <name>`, the commits are also listed.

type Bump = "major" | "minor" | "patch";
type Commit = { hash: string; subject: string; bump?: Bump; own: boolean };

const levels: Bump[] = ["major", "minor", "patch"];
const bumpTypes = new Set(
  createChangelogScopes().map((entry) => String(entry.type)),
);

const git = (...arguments_: string[]): string =>
  execFileSync("git", arguments_, { encoding: "utf8" }).trim();

const latestTag = (collection: string): string | undefined => {
  try {
    return git("describe", "--tags", `--match=${collection}/v*`, "--abbrev=0");
  } catch {
    return undefined;
  }
};

const commitBump = (message: string): Bump | undefined => {
  const header = /^(\w+)(?:\([^)]*\))?(!)?:/.exec(message);
  if (header?.[2] || /^BREAKING[ -]CHANGE:/m.test(message)) return "major";
  const type = header?.[1]?.toLowerCase();
  if (!type || !bumpTypes.has(type)) return undefined;
  return type === "feat" ? "minor" : "patch";
};

const unreleasedCommits = (collection: string, tag?: string): Commit[] => {
  const root = `collections/${collection}/`;
  const output = git(
    "log",
    "--format=%x1e%H%x1f%B%x1f",
    "--name-only",
    // Without --full-diff, git lists only the files below the path filter.
    "--full-diff",
    tag ? `${tag}..HEAD` : "HEAD",
    "--",
    root,
  );
  return output
    .split("\x1e")
    .filter(Boolean)
    .map((record) => {
      const [hash = "", message = "", files = ""] = record.split("\x1f");
      // A commit is the collection's own when it changes no other collection.
      const own = files
        .split("\n")
        .filter((file) => file.startsWith("collections/"))
        .every((file) => file.startsWith(root));
      return {
        hash: hash.slice(0, 12),
        subject: message.trim().split("\n")[0] ?? "",
        bump: commitBump(message.trim()),
        own,
      };
    });
};

const nextVersion = (version: string, bump: Bump): string => {
  const [major = 0, minor = 0, patch = 0] = version.split(".").map(Number);
  if (bump === "major") return `${major + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
};

const selected = selectedCollection(process.argv.slice(2));
const targets = selected ? [selected] : collections;
const header = [
  "collection",
  "version",
  "tag",
  "commits",
  "own",
  "bump",
  "next",
];
const rows: string[][] = [];
const details: string[] = [];

for (const collection of targets) {
  const { version } = JSON.parse(
    readFileSync(join("collections", collection, "package.json"), "utf8"),
  ) as { version: string };
  const tag = latestTag(collection);
  const commits = unreleasedCommits(collection, tag);
  const bump = levels.find((level) =>
    commits.some((commit) => commit.bump === level),
  );
  // release-it falls back to a patch release when no commit sets a bump.
  const proposed = commits.length > 0 ? (bump ?? "patch") : undefined;
  rows.push([
    collection,
    version,
    tag ?? "none",
    String(commits.length),
    String(commits.filter((commit) => commit.own).length),
    proposed ?? "-",
    proposed ? nextVersion(version, proposed) : "-",
  ]);
  for (const commit of commits) {
    const marker = commit.own ? "own" : "shared";
    details.push(
      `${commit.hash} ${(commit.bump ?? "none").padEnd(5)} ${marker.padEnd(6)} ${commit.subject}`,
    );
  }
}

const widths = header.map((title, column) =>
  Math.max(title.length, ...rows.map((row) => row[column]?.length ?? 0)),
);
for (const row of [header, ...rows]) {
  console.log(
    row
      .map((cell, column) => cell.padEnd(widths[column] ?? 0))
      .join("  ")
      .trimEnd(),
  );
}
if (selected && details.length > 0) {
  console.log("");
  for (const line of details) console.log(line);
}
