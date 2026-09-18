import assert from "node:assert/strict";
import { afterEach, describe, test } from "node:test";
import {
  getDefaultRuntimeRoot,
  parseArgs,
  runtimePackageJson,
  validateManifest,
} from "./runtime.mjs";

describe("parseArgs", () => {
  test("parses --name=value options", () => {
    const { options, passthrough } = parseArgs([
      "--action=exec",
      "--manifest=./runtime.json",
    ]);
    assert.deepEqual(options, { action: "exec", manifest: "./runtime.json" });
    assert.deepEqual(passthrough, []);
  });

  test("collects everything after -- as passthrough", () => {
    const { options, passthrough } = parseArgs([
      "--action=exec",
      "--",
      "--url=https://example.com",
    ]);
    assert.deepEqual(options, { action: "exec" });
    assert.deepEqual(passthrough, ["--url=https://example.com"]);
  });

  test("recognises --help without a value", () => {
    const { options } = parseArgs(["--help"]);
    assert.equal(options.help, true);
  });

  test("rejects an argument without --name=value syntax", () => {
    assert.throws(() => parseArgs(["--action"]), /Use --name=value syntax/);
    assert.throws(() => parseArgs(["positional"]), /Use --name=value syntax/);
  });
});

describe("getDefaultRuntimeRoot", () => {
  const originalRuntimeRoot = process.env.APPARATUS_RUNTIME_ROOT;
  const originalDataHome = process.env.XDG_DATA_HOME;

  afterEach(() => {
    if (originalRuntimeRoot === undefined)
      delete process.env.APPARATUS_RUNTIME_ROOT;
    else process.env.APPARATUS_RUNTIME_ROOT = originalRuntimeRoot;

    if (originalDataHome === undefined) delete process.env.XDG_DATA_HOME;
    else process.env.XDG_DATA_HOME = originalDataHome;
  });

  test("honours an explicit APPARATUS_RUNTIME_ROOT override", () => {
    process.env.APPARATUS_RUNTIME_ROOT = "/tmp/custom-runtime-root";
    assert.equal(getDefaultRuntimeRoot(), "/tmp/custom-runtime-root");
  });

  test("falls back to XDG_DATA_HOME/apparatus/runtimes", () => {
    delete process.env.APPARATUS_RUNTIME_ROOT;
    process.env.XDG_DATA_HOME = "/tmp/xdg-data";
    assert.equal(getDefaultRuntimeRoot(), "/tmp/xdg-data/apparatus/runtimes");
  });
});

describe("validateManifest", () => {
  const validManifest = {
    schemaVersion: 1,
    runtime: "browser",
    packages: { playwright: "^1.55.0" },
    playwright: { browsers: ["chromium"] },
  };

  test("accepts a well-formed manifest", () => {
    assert.doesNotThrow(() => validateManifest(validManifest, "runtime.json"));
  });

  test("rejects an unsupported schemaVersion", () => {
    assert.throws(
      () =>
        validateManifest(
          { ...validManifest, schemaVersion: 2 },
          "runtime.json",
        ),
      /Unsupported schemaVersion/,
    );
  });

  test("rejects a missing runtime name", () => {
    assert.throws(
      () => validateManifest({ ...validManifest, runtime: "" }, "runtime.json"),
      /non-empty "runtime" string/,
    );
  });

  test("rejects a missing packages object", () => {
    const { packages: _packages, ...withoutPackages } = validManifest;
    assert.throws(
      () => validateManifest(withoutPackages, "runtime.json"),
      /"packages" object/,
    );
  });

  test("rejects a non-array playwright.browsers", () => {
    assert.throws(
      () =>
        validateManifest(
          { ...validManifest, playwright: { browsers: "chromium" } },
          "runtime.json",
        ),
      /must be an array/,
    );
  });
});

describe("runtimePackageJson", () => {
  test("builds a private, namespaced runtime manifest", () => {
    const manifest = runtimePackageJson({
      runtime: "browser",
      packages: { playwright: "^1.55.0", tsx: "^4.20.0" },
    });

    assert.equal(manifest.private, true);
    assert.equal(manifest.type, "module");
    assert.equal(manifest.name, "apparatus-runtime-browser");
    assert.deepEqual(manifest.dependencies, {
      playwright: "^1.55.0",
      tsx: "^4.20.0",
    });
  });
});
