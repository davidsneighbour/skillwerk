import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

// biome-ignore lint/suspicious/noTemplateCurlyInString: release-it interpolates this placeholder.
const VERSION = "${version}";

// All collections share one Git history, so tags, release names, and
// changelog entries carry the collection name, and the changelog only reads
// commits that touch this collection's directory.
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  repository?: { directory?: string };
};
const collection = basename(packageJson.repository?.directory ?? process.cwd());
const tagPrefix = `${collection}/v`;

// Set the version in every plugin manifest the collection has. The value is
// replaced in place so each file keeps its formatting.
const updateManifestVersions = [
  "node",
  "--input-type=module",
  "--eval",
  '\'import { existsSync, readFileSync, writeFileSync } from "node:fs"; const version = process.argv.at(-1); for (const file of [".claude-plugin/marketplace.json", ".claude-plugin/plugin.json", ".codex-plugin/plugin.json"]) { if (existsSync(file)) writeFileSync(file, readFileSync(file, "utf8").replace(/("version"\\s*:\\s*")[^"]*"/, "$1" + version + "\\"")); }\'',
  VERSION,
].join(" ");

const config: Config = createReleaseConfig({
  githubTokenRef: "GITHUB_TOKEN_CONTENT_PRIVATE",
  overrides: {
    git: {
      commitMessage: `chore(release): ${collection} v${VERSION}`,
      tagName: `${tagPrefix}${VERSION}`,
    },
    github: {
      release: true,
      releaseName: `${collection} v${VERSION}`,
    },
    hooks: {
      "after:bump": updateManifestVersions,
    },
    npm: {
      publish: false,
    },
  },
});

// The shared config merges plugins shallowly, so extend the generated
// changelog options instead of replacing them.
const changelog = config.plugins?.["@release-it/conventional-changelog"] as
  | Record<string, unknown>
  | undefined;
if (!changelog) throw new Error("conventional-changelog plugin is missing");
Object.assign(changelog, {
  commitsOpts: { path: "." },
  gitRawCommitsOpts: { path: "." },
  tagPrefix,
});

export default config;
