import { resolve } from "node:path";
import { loadDataset } from "./baseline.ts";
import { assertNoSymlinks, loadConfig, resolveLocal } from "./config.ts";
import { writeReport } from "./report.ts";
import { scan } from "./scan.ts";
import type { Audit, Config } from "./types.ts";

const help = `Usage: node <skill-directory>/scripts/cli.ts [options]
  --cwd <path>          Target project (default: current directory)
  --mode static         Only static candidate scanning is implemented
  --target <target>     widely | newly | YYYY
  --report-dir <path>   Dedicated project-relative output directory
  --data <path>         Versioned dataset JSON instead of installed web-features
  --help                Show help without dependencies or scanning
No source files are modified. Reports contain candidates, not approved changes.`;
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log(help);
    return;
  }
  let cwd = process.cwd();
  let dataFile: string | undefined;
  const overrides: Partial<Config> = {};
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (
      !option ||
      !["--cwd", "--mode", "--target", "--report-dir", "--data"].includes(
        option,
      )
    )
      throw new Error(`Unknown option: ${option}`);
    if (!value || value.startsWith("--"))
      throw new Error(`Missing value for ${option}`);
    switch (option) {
      case "--cwd":
        cwd = resolve(value);
        break;
      case "--mode":
        if (value !== "static")
          throw new Error("Only static mode is implemented.");
        overrides.mode = "static";
        break;
      case "--target":
        overrides.target = value;
        break;
      case "--report-dir":
        overrides.reportDir = value;
        break;
      case "--data":
        dataFile = resolve(value);
        break;
    }
  }
  const { root, config } = await loadConfig(cwd, overrides);
  const dataset = await loadDataset(dataFile);
  const result = await scan(root, config, dataset);
  const audit: Audit = {
    schemaVersion: 1,
    tool: "baseline-modernise",
    mode: "static",
    target: config.target,
    generatedAt: new Date().toISOString(),
    dataset: { source: dataset.source, version: dataset.version },
    ...result,
    limitations: [
      "Lexical heuristics are candidates only, not a parser or proof of behaviour. Strings, regular expressions, generated code, and framework syntax can cause missed or false matches.",
      "Runtime verification is not performed. Inspect behaviour, accessibility, cascade, and actual fallback use before approving changes.",
      "Unknown feature data remains unknown; meeting a Baseline target does not prove equivalence or suitability for every project's browsers.",
      "The dataset is an installed or supplied snapshot, not a live compatibility query. Review its version and current authoritative data before acting.",
      "IDs identify this report only. Reruns may renumber candidates; check file, signal, and source before reusing approval.",
      "This scan neither reconciles Browserslist nor audits all reviewed-and-retained implementations. No matches does not prove a clean project.",
    ],
  };
  const output = resolveLocal(root, config.reportDir);
  await assertNoSymlinks(root, output);
  await writeReport(output, audit);
  console.log(
    `Static Baseline scan: ${result.filesInspected} files; ${result.findings.length} candidates.\nDataset: ${dataset.source} ${dataset.version}\nRuntime: not tested\nReport: ${resolve(output, "index.html")}`,
  );
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
