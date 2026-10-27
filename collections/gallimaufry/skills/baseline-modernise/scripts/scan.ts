import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { featureStatus, satisfies } from "./baseline.ts";
import { forbidden, resolveLocal, within } from "./config.ts";
import type { Config, Dataset, Finding } from "./types.ts";

const extensions = new Set([
  ".css",
  ".astro",
  ".html",
  ".tsx",
  ".jsx",
  ".ts",
  ".js",
  ".mjs",
  ".cjs",
]);
// Mask comments without changing offsets; optionally mask JS string contents.
export function mask(
  text: string,
  strings = false,
  lineComments = true,
): string {
  const chars = text.split("");
  let quote = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (strings && c !== "\n") chars[i] = " ";
      if (c === "\\") {
        i++;
        if (strings && i < chars.length && chars[i] !== "\n") chars[i] = " ";
      } else if (c === quote) quote = "";
    } else if (c === '"' || c === "'" || c === "`") {
      quote = c;
      if (strings) chars[i] = " ";
    } else {
      const endMarker = text.startsWith("<!--", i)
        ? "-->"
        : text.startsWith("/*", i)
          ? "*/"
          : lineComments && text.startsWith("//", i)
            ? "\n"
            : "";
      if (!endMarker) continue;
      const end = text.indexOf(endMarker, i + (endMarker === "-->" ? 4 : 2));
      const stop =
        end < 0
          ? text.length
          : end + (endMarker === "\n" ? 0 : endMarker.length);
      for (; i < stop; i++) if (text[i] !== "\n") chars[i] = " ";
      i--;
    }
  }
  return chars.join("");
}
const patterns: {
  feature: string | null;
  regex: RegExp;
  js?: boolean;
  reason: string;
}[] = [
  {
    feature: "container-queries",
    regex:
      /\b(?:ResizeObserver|matchMedia)\s*\(|\bwindow\.innerWidth\b|\.getBoundingClientRect\s*\(/g,
    js: true,
    reason:
      "Inspect whether this layout measurement can use container queries. Measurements can serve unrelated purposes; no replacement is established.",
  },
  {
    feature: "dialog",
    regex: /\b(?:role\s*=\s*["']dialog["']|aria-modal\s*=)/g,
    reason:
      "Inspect custom modal behaviour against native dialog, including focus, dismissal, and accessibility. Existing native dialogs may already be appropriate.",
  },
  {
    feature: "popover",
    regex: /\baria-expanded\s*=/g,
    reason:
      "Inspect whether a transient surface can use popover. Disclosure controls are not necessarily popovers, and popover alone does not provide menu semantics or keyboard behaviour.",
  },
  {
    feature: "subgrid",
    regex: /\bgrid-template-(?:columns|rows)\s*:/g,
    reason:
      "Inspect nested grids for duplicated parent tracks. An ordinary grid declaration is not itself a modernisation problem.",
  },
  {
    feature: "field-sizing",
    regex: /\.scrollHeight\b/g,
    js: true,
    reason:
      "Inspect whether this measures a form field for content sizing. Scrolling and other uses may be unrelated.",
  },
  {
    feature: null,
    regex: /@supports\b/g,
    reason:
      "Identify the exact queried feature and fallback before evaluating support. A feature query alone is not obsolete and has no automatic Baseline mapping.",
  },
];
export async function scan(
  root: string,
  config: Config,
  dataset: Dataset,
): Promise<{ filesInspected: number; findings: Finding[] }> {
  const files = new Set<string>();
  const excluded = config.exclude.map((path) => resolveLocal(root, path));
  const output = resolveLocal(root, config.reportDir);
  async function visit(path: string): Promise<void> {
    if (
      within(output, path) ||
      excluded.some((excludedPath) => within(excludedPath, path))
    )
      return;
    const stat = await lstat(path);
    if (stat.isSymbolicLink()) return;
    if (stat.isDirectory()) {
      for (const entry of (await readdir(path, { withFileTypes: true })).sort(
        (a, b) => a.name.localeCompare(b.name),
      )) {
        if (!forbidden.has(entry.name)) await visit(resolve(path, entry.name));
      }
    } else if (stat.isFile() && extensions.has(extname(path))) files.add(path);
  }
  for (const path of config.paths) await visit(resolveLocal(root, path));
  const findings: Finding[] = [];
  for (const path of [...files].sort()) {
    const text = await readFile(path, "utf8");
    const extension = extname(path);
    const content = mask(text, false, ![".css", ".html"].includes(extension));
    const code = mask(text, true);
    const seen = new Set<string>();
    for (const pattern of patterns) {
      for (const match of (pattern.js ? code : content).matchAll(
        pattern.regex,
      )) {
        const line = text.slice(0, match.index).split("\n").length;
        const key = `${pattern.feature}:${line}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const feature = pattern.feature
          ? dataset.features[pattern.feature]
          : undefined;
        findings.push({
          id: "",
          recommendation: "INVESTIGATE",
          feature: pattern.feature,
          status: featureStatus(feature),
          satisfiesTarget: satisfies(feature, config.target),
          lowDate: feature?.status?.baseline_low_date,
          highDate: feature?.status?.baseline_high_date,
          file: relative(root, path),
          line,
          signal: match[0],
          reason: pattern.reason,
          runtime: "not tested",
        });
      }
    }
  }
  findings.sort(
    (a, b) =>
      a.file.localeCompare(b.file) ||
      a.line - b.line ||
      (a.feature ?? "").localeCompare(b.feature ?? ""),
  );
  findings.forEach((finding, index) => {
    finding.id = `BSL${String(index + 1).padStart(2, "0")}`;
  });
  return { filesInspected: files.size, findings };
}
