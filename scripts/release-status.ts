import { collections, selectedCollection } from "./collections.ts";
import { releaseState } from "./release-state.ts";

// Shows which collections have unreleased commits and the version that their
// release would propose. With `--collection <name>`, the commits are also
// listed.

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
  const { version, tag, commits, bump, next } = releaseState(collection);
  rows.push([
    collection,
    version,
    tag ?? "none",
    String(commits.length),
    String(commits.filter((commit) => commit.own).length),
    bump ?? "-",
    next ?? "-",
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
