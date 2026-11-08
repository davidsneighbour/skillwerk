import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export type Run = (command: string, args: string[], input?: string) => string;
const execute: Run = (command, args, input) =>
  execFileSync(command, args, {
    encoding: "utf8",
    input,
    env: { ...process.env, GH_HOST: "github.com", GH_PROMPT_DISABLED: "1" },
    stdio: ["pipe", "pipe", "pipe"],
  }).trim();

export function parseTarget(value: string): string {
  const match =
    /^(?:https:\/\/github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)?([a-z\d](?:[a-z\d-]*[a-z\d])?)\/([a-z\d_.-]+?)(?:\.git)?\/?$/i.exec(
      value,
    );
  if (!match || match[2] === "." || match[2] === "..")
    throw new Error(
      "Expected a github.com repository: owner/repo or a GitHub remote URL.",
    );
  return `${match[1]}/${match[2]}`;
}

export function resolveTarget(target: string | undefined, run: Run): string {
  if (target) {
    if (/^[a-z\d_.-]+$/i.test(target) && target !== "." && target !== "..") {
      const owner = run("gh", [
        "api",
        "--hostname",
        "github.com",
        "user",
        "--jq",
        ".login",
      ]);
      return parseTarget(`${owner}/${target}`);
    }
    return parseTarget(target);
  }
  run("git", ["rev-parse", "--show-toplevel"]);
  const remotes = run("git", ["remote"]).split(/\s+/).filter(Boolean);
  if (!remotes.length)
    throw new Error("No Git remote. Supply owner/repo explicitly.");
  const names = remotes.includes("origin") ? ["origin"] : remotes;
  const targets = names.map((name) => {
    const urls = run("git", ["remote", "get-url", "--all", name]).split(
      /\r?\n/,
    );
    const repositories = [...new Set(urls.map(parseTarget))];
    if (repositories.length !== 1)
      throw new Error("Ambiguous remote URLs. Supply owner/repo explicitly.");
    return repositories[0] as string;
  });
  if (new Set(targets.map((name) => name.toLowerCase())).size !== 1)
    throw new Error("Ambiguous remotes. Supply owner/repo explicitly.");
  return targets[0] as string;
}

export function planTopics(
  current: string[],
  add: string[],
  remove: string[],
): string[] {
  for (const topic of [...current, ...add, ...remove]) {
    if (!/^[a-z0-9-]{1,50}$/.test(topic))
      throw new Error(`Invalid topic: ${topic}`);
  }
  if (add.some((topic) => remove.includes(topic)))
    throw new Error("Cannot add and remove the same topic.");
  const after = [
    ...new Set([...current.filter((topic) => !remove.includes(topic)), ...add]),
  ].sort();
  if (after.length > 20) throw new Error("GitHub allows at most 20 topics.");
  for (const prefix of ["dnb-kind-", "dnb-stage-", "dnb-care-"]) {
    if (after.filter((topic) => topic.startsWith(prefix)).length > 1)
      throw new Error(
        `Use one ${prefix} topic; explicitly remove the old value.`,
      );
  }
  return after;
}

type Repository = {
  name: string;
  full_name: string;
  html_url: string;
  owner: { login: string; html_url: string };
  archived: boolean;
  visibility: string;
  topics: string[];
  fork: boolean;
  parent?: { full_name: string; html_url: string };
};

export function main(args: string[], run: Run = execute): string {
  if (args.includes("--help"))
    return "Usage: node manage-repo.ts [info|topics] [owner/repo|repo] [--add topic] [--remove topic] [--dry-run|--apply]\nDefault: info. Topic edits default to dry-run. Repeat --add and --remove. Only github.com is supported.";
  const command =
    args[0] === "info" || args[0] === "topics" ? args.shift() : "info";
  let target: string | undefined;
  let apply = false;
  let dryRun = false;
  const add: string[] = [];
  const remove: string[] = [];
  while (args.length) {
    const arg = args.shift() as string;
    if (arg === "--apply") apply = true;
    else if (arg === "--dry-run") dryRun = true;
    else if (arg === "--add" || arg === "--remove") {
      const value = args.shift();
      if (!value || value.startsWith("-"))
        throw new Error(`${arg} requires a topic.`);
      (arg === "--add" ? add : remove).push(value);
    } else if (arg.startsWith("-") || target)
      throw new Error(`Unexpected argument: ${arg}`);
    else target = arg;
  }
  if (apply && dryRun) throw new Error("Choose --apply or --dry-run.");
  if (command !== "topics" && (add.length || remove.length || apply || dryRun))
    throw new Error("Topic options require the topics command.");
  // Reject malformed topic inputs before making network requests.
  planTopics([], add, remove);
  const repo = resolveTarget(target, run);
  const api = (method: string, path: string, input?: string): string =>
    run(
      "gh",
      [
        "api",
        "--hostname",
        "github.com",
        "--method",
        method,
        path,
        ...(input ? ["--input", "-"] : []),
      ],
      input,
    );
  const data = JSON.parse(api("GET", `repos/${repo}`)) as Repository;
  // Do not apply through renamed or transferred repository redirects.
  if (data.full_name.toLowerCase() !== repo.toLowerCase())
    throw new Error(
      `Repository now resolves to ${data.full_name}. Run again with that explicit target.`,
    );
  if (command === "info") {
    const visibility =
      data.visibility === "public"
        ? "Public"
        : data.visibility === "private"
          ? "Private"
          : "Internal";
    return [
      `Name: [${data.name}](${data.html_url})`,
      `Owner: [${data.owner.login}](${data.owner.html_url})`,
      `Status: ${data.archived ? "Archived / " : ""}${visibility}`,
      ...(data.fork
        ? [
            data.parent
              ? `Fork: [${data.parent.full_name}](${data.parent.html_url})`
              : "Fork: parent unavailable",
          ]
        : []),
    ].join("\n");
  }
  const readTopics = (): string[] =>
    (
      JSON.parse(api("GET", `repos/${repo}/topics`)) as { names: string[] }
    ).names.sort();
  const before = readTopics();
  const after = planTopics(before, add, remove);
  const plan = JSON.stringify(
    {
      repository: data.full_name,
      before,
      add: after.filter((topic) => !before.includes(topic)),
      remove: before.filter((topic) => !after.includes(topic)),
      after,
    },
    null,
    2,
  );
  if (!add.length && !remove.length) return plan;
  if (!apply) return `Dry run; no changes made.\n${plan}`;
  if (data.archived)
    throw new Error("Archived repository; topic changes refused.");
  if (JSON.stringify(before) === JSON.stringify(after))
    return `No changes needed.\n${plan}`;
  if (JSON.stringify(readTopics()) !== JSON.stringify(before))
    throw new Error("Topics changed during planning. Run a new dry run.");
  api("PUT", `repos/${repo}/topics`, JSON.stringify({ names: after }));
  if (JSON.stringify(readTopics()) !== JSON.stringify(after))
    throw new Error(
      "Post-write verification failed. Inspect live topics; do not retry automatically.",
    );
  return `Applied and verified.\n${plan}`;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    console.log(main(process.argv.slice(2)));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
