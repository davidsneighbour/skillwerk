import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { collections, selectedCollection } from "./collections.ts";

// Clean-room check for packaged collection archives. For each collection it
// extracts dist/<collection>.tar.gz outside the repository, installs every
// skill with the pinned `skills` CLI into an empty project, and verifies that
// the installed copy is complete and self-contained. Run `npm run package`
// first so the check tests the archive that will be published.

const INSTALLER = resolve("node_modules", ".bin", "skills");
const AGENT = "claude-code";
const INSTALL_DIRECTORY = join(".claude", "skills");
const SCRIPT_EXTENSIONS = /\.(?:[cm]?[jt]s)$/;

// Known, tracked host-specific exceptions. Matching problems are reported but
// do not fail the check. Remove an entry when its issue is resolved.
const EXCEPTIONS: Record<string, { matches: RegExp; reason: string }> = {
  fettle: {
    matches: /points outside the installed skills$/,
    reason:
      "plugin-first: Claude Code and Codex install the whole collection, the skills CLI does not (#8)",
  },
};

const selected = selectedCollection(process.argv.slice(2));
const targets = selected ? [selected] : collections;

const filesBelow = (root: string): string[] =>
  readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => !entry.isDirectory())
    .map((entry) => relative(root, join(entry.parentPath, entry.name)))
    .sort();

const isInside = (root: string, path: string): boolean => {
  const offset = relative(root, path);
  return offset !== "" && !offset.startsWith("..") && !offset.startsWith("/");
};

// Relative Markdown link targets, without anchors or query strings. Code
// blocks and code spans hold examples and placeholders, not links.
const markdownLinks = (source: string): string[] =>
  [
    ...source
      .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, "")
      .replace(/`[^`\n]*`/g, "")
      .matchAll(/\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g),
  ]
    .map((match) => match[1] ?? "")
    .filter((link) => link && !/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(link))
    .map((link) => decodeURIComponent(link.replace(/[#?].*$/, "")))
    .filter(Boolean);

// Relative module specifiers in static imports, dynamic imports, and require.
const scriptImports = (source: string): string[] =>
  [
    ...source.matchAll(
      /(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*|^\s*import\s+)["'](\.{1,2}\/[^"']+)["']/gm,
    ),
  ].map((match) => match[1] ?? "");

type Result = { problems: string[]; notes: string[] };

// A reference may leave its skill only to reach another installed skill of the
// same collection; that works when the whole collection is installed, so it is
// reported as a dependency, not a failure.
const checkReferences = (
  installRoot: string,
  skill: string,
  result: Result,
): void => {
  const skillRoot = join(installRoot, skill);
  for (const file of filesBelow(skillRoot)) {
    const path = join(skillRoot, file);
    const references = file.endsWith(".md")
      ? markdownLinks(readFileSync(path, "utf8"))
      : SCRIPT_EXTENSIONS.test(file)
        ? scriptImports(readFileSync(path, "utf8"))
        : [];
    for (const reference of references) {
      const target = resolve(dirname(path), reference);
      const where = `${skill}/${file}: \`${reference}\``;
      if (!isInside(installRoot, target)) {
        result.problems.push(`${where} points outside the installed skills`);
      } else if (!existsSync(target)) {
        result.problems.push(`${where} does not exist`);
      } else if (!isInside(skillRoot, target)) {
        const sibling = relative(installRoot, target).split("/")[0];
        result.notes.push(`${where} requires sibling skill ${sibling}`);
      }
    }
  }
};

const testCollection = (collection: string, workspace: string): Result => {
  const result: Result = { problems: [], notes: [] };
  const { problems } = result;
  const archive = resolve("dist", `${collection}.tar.gz`);
  if (!existsSync(archive)) {
    problems.push(
      `missing ${relative(process.cwd(), archive)}; run npm run package -- --collection ${collection}`,
    );
    return result;
  }

  const extracted = join(workspace, "extracted");
  const project = join(workspace, "project");
  const home = join(workspace, "home");
  for (const directory of [extracted, project, home])
    mkdirSync(directory, { recursive: true });

  const extraction = spawnSync("tar", ["-xzf", archive, "-C", extracted], {
    encoding: "utf8",
  });
  if (extraction.status !== 0) {
    problems.push(`cannot extract archive: ${extraction.stderr}`);
    return result;
  }

  const entries = readdirSync(extracted);
  if (entries.length !== 1 || entries[0] !== collection) {
    problems.push(
      `archive must contain only ${collection}/, found: ${entries.join(", ")}`,
    );
  }
  const collectionRoot = join(extracted, collection);
  const skillsRoot = join(collectionRoot, "skills");
  if (!existsSync(skillsRoot)) {
    problems.push("archive has no skills/");
    return result;
  }

  for (const file of filesBelow(collectionRoot)) {
    if (lstatSync(join(collectionRoot, file)).isSymbolicLink())
      problems.push(`archive contains a symbolic link: ${file}`);
    if (file.split("/").includes("node_modules"))
      problems.push(`archive contains node_modules: ${file}`);
  }

  const expected = readdirSync(skillsRoot, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(join(skillsRoot, entry.name, "SKILL.md")),
    )
    .map((entry) => entry.name)
    .sort();

  writeFileSync(
    join(project, "package.json"),
    `${JSON.stringify({ name: "clean-room", private: true })}\n`,
  );
  const install = spawnSync(
    INSTALLER,
    ["add", skillsRoot, "--skill", "*", "--agent", AGENT, "--copy", "--yes"],
    {
      cwd: project,
      encoding: "utf8",
      env: {
        ...process.env,
        CI: "1",
        DISABLE_TELEMETRY: "1",
        DO_NOT_TRACK: "1",
        HOME: home,
      },
    },
  );
  if (install.status !== 0) {
    problems.push(
      `installer exited with ${install.status}:\n${install.stdout}${install.stderr}`,
    );
    return result;
  }

  const installRoot = join(project, INSTALL_DIRECTORY);
  const installed = existsSync(installRoot)
    ? readdirSync(installRoot).sort()
    : [];
  for (const skill of expected)
    if (!installed.includes(skill))
      problems.push(`${skill}: not installed by the installer`);
  for (const skill of installed)
    if (!expected.includes(skill))
      problems.push(`${skill}: installed but not in the archive`);

  for (const skill of expected.filter((name) => installed.includes(name))) {
    const source = join(skillsRoot, skill);
    const target = join(installRoot, skill);
    const sourceFiles = filesBelow(source);
    const targetFiles = filesBelow(target);
    for (const file of sourceFiles) {
      if (!targetFiles.includes(file)) {
        problems.push(`${skill}/${file}: missing after installation`);
      } else if (
        !readFileSync(join(source, file)).equals(
          readFileSync(join(target, file)),
        )
      ) {
        problems.push(`${skill}/${file}: changed during installation`);
      }
    }
    checkReferences(installRoot, skill, result);
  }

  if (problems.length === 0)
    console.log(`✓ ${collection}: ${installed.length} skill(s) installed`);
  return result;
};

let failed = false;
for (const collection of targets) {
  const workspace = mkdtempSync(join(tmpdir(), `skillwerk-${collection}-`));
  try {
    const { problems, notes } = testCollection(collection, workspace);
    const exception = EXCEPTIONS[collection];
    const excepted = problems.filter((problem) =>
      exception?.matches.test(problem),
    );
    const failures = problems.filter((problem) => !excepted.includes(problem));
    if (failures.length > 0) {
      failed = true;
      console.error(`✗ ${collection}: ${failures.length} problem(s)`);
      for (const problem of failures) console.error(`  ${problem}`);
    } else if (excepted.length > 0) {
      console.log(`✓ ${collection}: passed with a known exception`);
    }
    if (exception && excepted.length > 0) {
      console.log(`  exception: ${exception.reason}`);
      for (const problem of excepted) console.log(`    ${problem}`);
    }
    for (const note of notes) console.log(`  note: ${note}`);
  } finally {
    rmSync(workspace, { recursive: true, force: true });
  }
}
if (failed) process.exitCode = 1;
