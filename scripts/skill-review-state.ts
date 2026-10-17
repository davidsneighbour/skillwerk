import fg from "fast-glob";
import { collections } from "./collections.ts";
import {
  hasUnstagedSkillChanges,
  git as runGit,
  stagedFingerprint,
} from "./skill-review-git.ts";

const day = 86_400_000;
export type Review = {
  reviewed_on: string;
  reviewed_by: string;
  reviewed_commit: string;
  reviewed_content_hash?: string;
  evidence: string;
};
export type Register = {
  version: 1;
  default_interval_days: number;
  due_soon_days: number;
  collections: Record<string, { interval_days: number }>;
  skills: Record<string, { interval_days?: number; review?: Review }>;
};
export type ReviewRow = {
  skill: string;
  status: "requires review" | "overdue" | "due soon" | "current";
  due: string | null;
  daysRemaining: number | null;
  changed: boolean | null;
};

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Expected an object in review register");
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, allowed: string[]): void {
  for (const key of Object.keys(value))
    if (!allowed.includes(key)) throw new Error(`Unknown review field: ${key}`);
}
function integer(value: unknown, minimum: number): void {
  if (
    !Number.isSafeInteger(value) ||
    (value as number) < minimum ||
    (value as number) > 36500
  )
    throw new Error(
      `Review interval or warning window must be an integer from ${minimum} to 36500`,
    );
}
export function date(value: unknown): number {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error("Review dates must use YYYY-MM-DD");
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== value
  )
    throw new Error(`Invalid review date: ${value}`);
  return timestamp;
}
export async function discoverSkills(root: string): Promise<string[]> {
  const files = await fg(
    collections.map((name) => `collections/${name}/skills/*/SKILL.md`),
    {
      cwd: root,
      onlyFiles: true,
      followSymbolicLinks: false,
      ignore: ["**/scratch/**", "**/node_modules/**"],
    },
  );
  return files
    .map((file) =>
      file
        .replace(/^collections\//, "")
        .replace("/skills/", "/")
        .replace(/\/SKILL\.md$/, ""),
    )
    .sort();
}
export function validateRegister(
  input: unknown,
  skills: string[],
  today: string,
): Register {
  const value = object(input);
  keys(value, [
    "version",
    "default_interval_days",
    "due_soon_days",
    "collections",
    "skills",
  ]);
  if (value.version !== 1) throw new Error("Review register version must be 1");
  integer(value.default_interval_days, 1);
  integer(value.due_soon_days, 0);
  const now = date(today);
  for (const [name, input] of Object.entries(object(value.collections))) {
    if (!(collections as readonly string[]).includes(name))
      throw new Error(`Unknown review collection: ${name}`);
    const config = object(input);
    keys(config, ["interval_days"]);
    integer(config.interval_days, 1);
  }
  for (const [name, input] of Object.entries(object(value.skills))) {
    if (!skills.includes(name))
      throw new Error(`Unknown review skill: ${name}`);
    const config = object(input);
    keys(config, ["interval_days", "review"]);
    if (config.interval_days !== undefined) integer(config.interval_days, 1);
    if (config.review === undefined) continue;
    const review = object(config.review);
    keys(review, [
      "reviewed_on",
      "reviewed_by",
      "reviewed_commit",
      "reviewed_content_hash",
      "evidence",
    ]);
    if (
      review.reviewed_content_hash !== undefined &&
      (typeof review.reviewed_content_hash !== "string" ||
        !/^[a-f0-9]{64}$/.test(review.reviewed_content_hash))
    )
      throw new Error(`Invalid review content fingerprint: ${name}`);
    if (date(review.reviewed_on) > now)
      throw new Error(`Future review date: ${name}`);
    for (const key of ["reviewed_by", "evidence"])
      if (typeof review[key] !== "string" || !review[key].trim())
        throw new Error(`Missing ${key}: ${name}`);
    if (
      typeof review.reviewed_commit !== "string" ||
      !/^[a-f0-9]{40}$/.test(review.reviewed_commit)
    )
      throw new Error(`Review requires a full commit SHA: ${name}`);
  }
  return value as Register;
}
export function reviewRows(
  register: Register,
  skills: string[],
  today: string,
): ReviewRow[] {
  const now = date(today);
  const rows = skills.map((skill): ReviewRow => {
    const config = register.skills[skill];
    const collection = skill.split("/")[0] ?? "";
    const interval =
      config?.interval_days ??
      register.collections[collection]?.interval_days ??
      register.default_interval_days;
    if (!config?.review)
      return {
        skill,
        status: "requires review",
        due: null,
        daysRemaining: null,
        changed: null,
      };
    const due = date(config.review.reviewed_on) + interval * day;
    const daysRemaining = (due - now) / day;
    return {
      skill,
      status:
        daysRemaining <= 0
          ? "overdue"
          : daysRemaining <= register.due_soon_days
            ? "due soon"
            : "current",
      due: new Date(due).toISOString().slice(0, 10),
      daysRemaining,
      changed: null,
    };
  });
  const priority = {
    "requires review": 0,
    overdue: 1,
    "due soon": 2,
    current: 3,
  };
  return rows.sort(
    (a, b) =>
      priority[a.status] - priority[b.status] ||
      (a.daysRemaining ?? 0) - (b.daysRemaining ?? 0) ||
      a.skill.localeCompare(b.skill),
  );
}
export function changedSinceReview(
  root: string,
  skill: string,
  commit: string,
  contentHash?: string,
): boolean {
  const git = (...args: string[]): string => runGit(root, ...args).trim();
  // An unavailable baseline is an error, never evidence of an unchanged skill.
  git("merge-base", "--is-ancestor", commit, "HEAD");
  if (contentHash)
    return (
      stagedFingerprint(root, skill) !== contentHash ||
      hasUnstagedSkillChanges(root, skill)
    );
  const [collection, name] = skill.split("/");
  const path = `collections/${collection}/skills/${name}`;
  if (!git("ls-tree", commit, "--", `${path}/SKILL.md`))
    throw new Error(`Skill absent from reviewed commit: ${skill}`);
  return Boolean(
    git("diff", "--name-only", commit, "--", path, ":(exclude)**/scratch/**") ||
      git(
        "ls-files",
        "--others",
        "--exclude-standard",
        "--",
        path,
        ":(exclude)**/scratch/**",
      ),
  );
}
const statusIndicators: Record<ReviewRow["status"], string> = {
  "requires review": "🔴",
  overdue: "🔴",
  "due soon": "🟡",
  current: "🟢",
};

function reviewSummary(rows: ReviewRow[]): string {
  return ["requires review", "overdue", "due soon", "current"]
    .map(
      (status) =>
        `${rows.filter((row) => row.status === status).length} ${status}`,
    )
    .join(", ");
}

export function markdownReport(rows: ReviewRow[], today: string): string {
  return [
    `# Skill reviews: ${today}`,
    "",
    `${reviewSummary(rows)}. Review age is advisory; human acceptance is required to renew a review.`,
    "",
    "| Skill | Review status | Due (UTC) | Changed since review |",
    "| --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| ${row.skill} | ${statusIndicators[row.status]} ${row.status} | ${row.due ?? "-"} | ${row.changed === null ? "-" : row.changed ? "yes" : "no"} |`,
    ),
    "",
  ].join("\n");
}

export function terminalReport(rows: ReviewRow[], today: string): string {
  const cells = [
    ["Skill", "Review status", "Due (UTC)", "Changed"],
    ...rows.map((row) => [
      row.skill,
      `${statusIndicators[row.status]} ${row.status}`,
      row.due ?? "-",
      row.changed === null ? "-" : row.changed ? "yes" : "no",
    ]),
  ];
  // The report uses ASCII text and circle emoji. Each circle is two UTF-16
  // code units and occupies two terminal columns, so padEnd keeps alignment.
  const widths =
    cells[0]?.map((_, column) =>
      Math.max(...cells.map((row) => row[column]?.length ?? 0)),
    ) ?? [];
  const rule = (left: string, middle: string, right: string) =>
    left + widths.map((width) => "─".repeat(width + 2)).join(middle) + right;
  const line = (row: string[]) =>
    `│ ${row.map((cell, column) => cell.padEnd(widths[column] ?? 0)).join(" │ ")} │`;
  return [
    `Skill reviews: ${today}`,
    "",
    reviewSummary(rows),
    "",
    rule("┌", "┬", "┐"),
    line(cells[0] ?? []),
    rule("├", "┼", "┤"),
    ...cells.slice(1).map(line),
    rule("└", "┴", "┘"),
    "",
    "Changed: skill directory changed since its reviewed commit; - means no review.",
    "Review age is advisory; human acceptance is required to renew a review.",
    "",
  ].join("\n");
}
