import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { expandHomePath } from "./config.ts";

/** Read global defaults, project overrides, and an optional selected overlay. */
export async function readDotenv(
  dotenvPath = "~/.env",
  options: { home?: string; cwd?: string } = {},
): Promise<Record<string, string>> {
  const home = options.home ?? homedir();
  const cwd = options.cwd ?? process.cwd();
  const globalPath = join(home, ".env");
  const selectedPath = resolve(
    cwd,
    dotenvPath === "~/.env" ? globalPath : expandHomePath(dotenvPath),
  );
  const paths = [
    ...new Set([
      globalPath,
      join(cwd, ".env"),
      ...(selectedPath === globalPath ? [] : [selectedPath]),
    ]),
  ];
  const values: Record<string, string> = {};
  for (const path of paths) {
    let content: string;
    try {
      content = await readFile(path, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") continue;
      throw error;
    }
    Object.assign(values, parseDotenv(content));
  }
  return values;
}

function parseDotenv(content: string): Record<string, string> {
  const values: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const withoutExport = trimmed.startsWith("export ")
      ? trimmed.slice("export ".length).trim()
      : trimmed;
    const separatorIndex = withoutExport.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = withoutExport.slice(0, separatorIndex).trim();
    let value = withoutExport.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) {
      values[key] = value;
    }
  }

  return values;
}
