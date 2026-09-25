import { createHash } from "node:crypto";
import {
  appendFile,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { projectRoot } from "./config.ts";
import type { FettleConfig, FettleEvent, Finding } from "./types.ts";

function reportsPath(config: FettleConfig, ...parts: string[]): string {
  return resolve(projectRoot, config.reportsDirectory, ...parts);
}

export function fingerprint(...parts: Array<string | undefined>): string {
  return createHash("sha256")
    .update(parts.filter(Boolean).join("\0"))
    .digest("hex")
    .slice(0, 20);
}

export async function appendEvent(
  config: FettleConfig,
  event: FettleEvent,
): Promise<void> {
  const path = reportsPath(
    config,
    "events",
    `${event.timestamp.slice(0, 10)}.ndjson`,
  );
  await mkdir(dirname(path), { recursive: true });
  await appendFile(path, `${JSON.stringify(event)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
}

export async function readEvents(
  config: FettleConfig,
  since?: Date,
): Promise<FettleEvent[]> {
  const directory = reportsPath(config, "events");
  const { readdir } = await import("node:fs/promises");
  let names: string[];
  try {
    names = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const events: FettleEvent[] = [];
  for (const name of names
    .filter((value) => value.endsWith(".ndjson"))
    .sort()) {
    const lines = (await readFile(resolve(directory, name), "utf8"))
      .split("\n")
      .filter(Boolean);
    for (const line of lines) {
      const event = JSON.parse(line) as FettleEvent;
      if (!since || new Date(event.timestamp) >= since) events.push(event);
    }
  }
  return events.slice(-config.observation.maximumEvents);
}

export async function readFindings(config: FettleConfig): Promise<Finding[]> {
  try {
    return JSON.parse(
      await readFile(reportsPath(config, "findings.json"), "utf8"),
    ) as Finding[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function mergeFindings(
  config: FettleConfig,
  detected: Finding[],
): Promise<Finding[]> {
  const existing = await readFindings(config);
  let nextNumber =
    existing.reduce(
      (maximum, finding) => Math.max(maximum, Number(finding.id.slice(4))),
      0,
    ) + 1;
  for (const candidate of detected) {
    const match = existing.find(
      (finding) =>
        finding.fingerprint === candidate.fingerprint &&
        finding.status === "open",
    );
    if (match) {
      match.lastSeen = candidate.lastSeen;
      match.occurrences = Math.max(match.occurrences, candidate.occurrences);
      match.evidence = [...new Set([...match.evidence, ...candidate.evidence])];
    } else {
      candidate.id = `FTL-${String(nextNumber).padStart(4, "0")}`;
      nextNumber += 1;
      existing.push(candidate);
    }
  }
  const path = reportsPath(config, "findings.json");
  await mkdir(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  await writeFile(temporary, `${JSON.stringify(existing, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await rename(temporary, path);
  return existing;
}

export async function writeReport(
  config: FettleConfig,
  persona: string,
  report: object,
): Promise<string> {
  const directory = reportsPath(config, persona);
  await mkdir(directory, { recursive: true });
  const path = resolve(
    directory,
    `${new Date().toISOString().replaceAll(":", "-")}.json`,
  );
  await writeFile(path, `${JSON.stringify(report, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  return path;
}
