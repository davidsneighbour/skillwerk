import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cp,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { loadDataset, satisfies } from "./baseline.ts";
import { loadConfig } from "./config.ts";
import { html, writeReport } from "./report.ts";
import { scan } from "./scan.ts";
import type { Audit, Config, Dataset } from "./types.ts";

const dataset: Dataset = {
  source: "test fixture",
  version: "1.0.0",
  features: {
    dialog: {
      status: {
        baseline: "high",
        baseline_low_date: "2022-03-01",
        baseline_high_date: "2024-09-01",
      },
    },
    "container-queries": {
      status: { baseline: "low", baseline_low_date: "2025-01-01" },
    },
  },
};
const defaults: Config = {
  mode: "static",
  target: "widely",
  paths: ["src"],
  exclude: [],
  reportDir: "reports/baseline",
};
const fixture = async (body: (root: string) => Promise<void>) => {
  const root = await mkdtemp(join(tmpdir(), "baseline-audit-test-"));
  try {
    await body(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
};
const audit: Audit = {
  schemaVersion: 1,
  tool: "baseline-modernise",
  mode: "static",
  target: "widely",
  generatedAt: "2026-10-27T00:00:00.000Z",
  dataset: { source: dataset.source, version: dataset.version },
  filesInspected: 1,
  limitations: ["Static only"],
  findings: [],
};

test("Baseline targets distinguish eligibility, unknown data, and newly-available date boundaries", () => {
  assert.equal(satisfies(dataset.features.dialog, "widely"), true);
  assert.equal(
    satisfies(dataset.features["container-queries"], "widely"),
    false,
  );
  assert.equal(satisfies(dataset.features["container-queries"], "newly"), true);
  assert.equal(satisfies(dataset.features.dialog, "2021"), false);
  assert.equal(satisfies(dataset.features.dialog, "2022"), true);
  assert.equal(satisfies(undefined, "widely"), null);
  assert.equal(satisfies({ status: { baseline: true } }, "newly"), null);
  assert.equal(
    satisfies(
      { status: { baseline: "high", baseline_high_date: "2020-01-01" } },
      "2024",
    ),
    null,
  );
  assert.equal(
    satisfies(
      { status: { baseline: "low", baseline_low_date: "2020-02-30" } },
      "2024",
    ),
    null,
  );
  assert.equal(satisfies({ status: { baseline: false } }, "2024"), false);
});

test("configuration validates overrides, unknown keys, types, and path boundaries", async () =>
  fixture(async (root) => {
    await writeFile(
      join(root, "patternbook.json"),
      JSON.stringify({
        other: {},
        baseline: { target: "newly", paths: ["source"] },
      }),
    );
    const result = await loadConfig(root, { target: "2024" });
    assert.equal(result.config.target, "2024");
    assert.deepEqual(result.config.paths, ["source"]);
    for (const baseline of [
      { mode: "full" },
      { target: "oops" },
      { paths: [] },
      { paths: "src" },
      { runtime: {} },
      { paths: ["../outside"] },
      { paths: ["/etc"] },
      { paths: ["scratch"] },
      { reportDir: "." },
    ]) {
      await writeFile(
        join(root, "patternbook.json"),
        JSON.stringify({ baseline }),
      );
      await assert.rejects(loadConfig(root, {}));
    }
  }));

test("scanner excludes protected directories, custom exclusions, links, comments, and JS strings", async () =>
  fixture(async (root) => {
    await mkdir(join(root, "src", "generated"), { recursive: true });
    await writeFile(
      join(root, "src", "card.ts"),
      '// ResizeObserver()\nconst sample = "window.innerWidth";\nconst width = window.innerWidth;\n',
    );
    await writeFile(
      join(root, "src", "card.css"),
      "/* grid-template-columns: auto; */\n@supports (display: grid) { .card { display: grid; } }",
    );
    await writeFile(
      join(root, "src", "dialog.html"),
      '<!-- role="dialog" -->\n<div role="dialog"></div>',
    );
    await writeFile(
      join(root, "src", "generated", "skip.ts"),
      "ResizeObserver()",
    );
    for (const directory of [
      "scratch",
      ".scratch",
      "node_modules",
      "dist",
      ".git",
      "coverage",
      "build",
      ".astro",
    ]) {
      await mkdir(join(root, "src", directory));
      // An unreadable entry ensures directory traversal would fail if not excluded.
      await symlink(
        join(root, "not-present"),
        join(root, "src", directory, "unreadable.ts"),
      );
    }
    await symlink(join(root, "src", "card.ts"), join(root, "src", "linked.ts"));
    const result = await scan(
      root,
      {
        ...defaults,
        paths: ["src", "src/card.ts"],
        exclude: ["src/generated"],
      },
      dataset,
    );
    assert.equal(result.filesInspected, 3);
    assert.equal(result.findings.length, 3);
    assert.equal(
      result.findings.find((finding) => finding.feature === "container-queries")
        ?.line,
      3,
    );
    assert.equal(
      result.findings.find((finding) => finding.feature === null)
        ?.satisfiesTarget,
      null,
    );
    assert.ok(
      result.findings.every(
        (finding) =>
          finding.recommendation === "INVESTIGATE" &&
          finding.runtime === "not tested",
      ),
    );
    const rerun = await scan(
      root,
      { ...defaults, exclude: ["src/generated"] },
      dataset,
    );
    assert.deepEqual(rerun.findings, result.findings);
    const unknown = await scan(
      root,
      { ...defaults, exclude: ["src/generated"] },
      { ...dataset, features: {} },
    );
    assert.ok(
      unknown.findings.every(
        (finding) =>
          finding.status === "unknown" && finding.satisfiesTarget === null,
      ),
    );
    await assert.rejects(
      scan(root, { ...defaults, paths: ["missing"] }, dataset),
    );
  }));

test("symbolic-link source ancestors and configuration are rejected", async () =>
  fixture(async (root) => {
    await mkdir(join(root, "source"));
    await symlink(join(root, "source"), join(root, "linked"));
    await assert.rejects(
      loadConfig(root, { paths: ["linked/child"] }),
      /Symbolic/,
    );
    await writeFile(join(root, "config.json"), "{}");
    await symlink(join(root, "config.json"), join(root, "patternbook.json"));
    await assert.rejects(loadConfig(root, {}), /Symbolic/);
  }));

test("reports escape data, label filters, and refuse unrelated contents or symlinks", async () =>
  fixture(async (root) => {
    const rendered = html({
      ...audit,
      dataset: { source: "<script>alert(1)</script>", version: "test" },
    });
    assert.ok(!rendered.includes("<script>alert(1)</script>"));
    assert.match(rendered, /<label for="search">/);
    const output = join(root, "reports");
    await writeReport(output, audit);
    await writeReport(output, audit);
    await writeFile(join(output, "notes.txt"), "preserve");
    await assert.rejects(writeReport(output, audit), /unrelated/);
    assert.equal(await readFile(join(output, "notes.txt"), "utf8"), "preserve");
    await rm(join(output, "notes.txt"));
    await rm(join(output, "index.html"));
    await writeFile(join(root, "private.txt"), "preserve");
    await symlink(join(root, "private.txt"), join(output, "index.html"));
    await assert.rejects(writeReport(output, audit), /symbolic/);
    assert.equal(await readFile(join(root, "private.txt"), "utf8"), "preserve");
  }));

test("installed or supplied datasets include provenance and reject malformed data", async () =>
  fixture(async (root) => {
    assert.equal((await loadDataset()).source, "web-features");
    const file = join(root, "data.json");
    await writeFile(file, JSON.stringify(dataset));
    assert.deepEqual(await loadDataset(file), dataset);
    for (const value of [
      { features: {} },
      { source: "fixture", version: "1", features: { dialog: null } },
      {
        source: "fixture",
        version: "1",
        features: { dialog: { status: "high" } },
      },
    ]) {
      await writeFile(file, JSON.stringify(value));
      await assert.rejects(loadDataset(file));
    }
  }));

test("CLI works outside the repository with explicit data and leaves sources unchanged", async () =>
  fixture(async (root) => {
    const installed = join(root, "installed");
    await cp(new URL("../", import.meta.url), installed, {
      recursive: true,
      filter: (source) => !source.split(/[\\/]/).includes("node_modules"),
    });
    const project = join(root, "project");
    await mkdir(join(project, "src"), { recursive: true });
    const source = join(project, "src", "example.css");
    const text = ".card { grid-template-columns: 1fr 1fr; }";
    await writeFile(source, text);
    const dataFile = join(root, "data.json");
    await writeFile(dataFile, JSON.stringify(dataset));
    const run = (args: string[]) =>
      spawnSync(
        process.execPath,
        [join(installed, "scripts", "cli.ts"), ...args],
        { encoding: "utf8", cwd: root },
      );
    assert.equal(run(["--help"]).status, 0);
    for (const args of [
      ["--mode", "full"],
      ["--mode", "runtime"],
      ["--bogus", "x"],
      ["--target"],
    ])
      assert.notEqual(run(args).status, 0);
    const result = run(["--cwd", project, "--data", dataFile]);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(
      await readFile(
        join(project, "reports", "baseline", "audit.json"),
        "utf8",
      ),
    ) as Audit;
    assert.deepEqual(report.dataset, {
      source: dataset.source,
      version: dataset.version,
    });
    assert.equal(report.mode, "static");
    assert.equal(report.findings[0]?.status, "unknown");
    assert.equal(await readFile(source, "utf8"), text);
  }));
