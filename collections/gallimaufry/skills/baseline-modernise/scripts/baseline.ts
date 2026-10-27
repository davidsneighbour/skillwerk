import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import type { Dataset, Feature, Finding } from "./types.ts";

export function featureStatus(feature: Feature | undefined): Finding["status"] {
  const baseline = feature?.status?.baseline;
  if (baseline === "high") return "widely";
  if (baseline === "low") return "newly";
  if (baseline === false) return "limited";
  return "unknown";
}
function yearOf(value: unknown): number | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return null;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) &&
    date.toISOString().slice(0, 10) === value
    ? date.getUTCFullYear()
    : null;
}
export function satisfies(
  feature: Feature | undefined,
  target: string,
): boolean | null {
  const status = featureStatus(feature);
  if (status === "unknown") return null;
  if (status === "limited") return false;
  if (target === "widely") return status === "widely";
  if (target === "newly") return status === "widely" || status === "newly";
  if (!/^(19|20)\d{2}$/.test(target))
    throw new Error(`Invalid target: ${target}`);
  const year = yearOf(feature?.status?.baseline_low_date);
  return year === null ? null : year <= Number(target);
}
export async function loadDataset(file?: string): Promise<Dataset> {
  let value: unknown;
  if (file) value = JSON.parse(await readFile(file, "utf8"));
  else {
    try {
      const require = createRequire(import.meta.url);
      const dataFile = require.resolve("web-features/data.json");
      const data = JSON.parse(await readFile(dataFile, "utf8")) as {
        features?: unknown;
      };
      const pkg = JSON.parse(
        await readFile(resolve(dirname(dataFile), "package.json"), "utf8"),
      ) as { version?: unknown };
      value = {
        source: "web-features",
        version: pkg.version,
        features: data.features,
      };
    } catch {
      throw new Error(
        "Install the skill's declared web-features dependency, or supply --data with a versioned dataset. See SKILL.md.",
      );
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Dataset must be an object.");
  const data = value as Partial<Dataset>;
  if (
    typeof data.source !== "string" ||
    !data.source.trim() ||
    typeof data.version !== "string" ||
    !data.version.trim() ||
    !data.features ||
    typeof data.features !== "object" ||
    Array.isArray(data.features)
  )
    throw new Error("Dataset requires source, version, and a features object.");
  for (const feature of Object.values(data.features)) {
    if (!feature || typeof feature !== "object" || Array.isArray(feature))
      throw new Error("Invalid feature record.");
    if (
      feature.status !== undefined &&
      (!feature.status ||
        typeof feature.status !== "object" ||
        Array.isArray(feature.status))
    )
      throw new Error("Invalid feature status.");
  }
  return data as Dataset;
}
