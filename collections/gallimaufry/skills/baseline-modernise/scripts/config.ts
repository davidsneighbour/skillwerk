import { lstat, readFile, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import type { Config } from "./types.ts";

export const forbidden = new Set([
  "scratch",
  ".scratch",
  ".git",
  "node_modules",
  "dist",
  "build",
  ".astro",
  "coverage",
]);
export function targetValid(target: string): boolean {
  return ["widely", "newly"].includes(target) || /^(19|20)\d{2}$/.test(target);
}
export function within(root: string, path: string): boolean {
  const offset = relative(root, path);
  return (
    offset === "" ||
    (!offset.startsWith(`..${sep}`) && offset !== ".." && !isAbsolute(offset))
  );
}
export function resolveLocal(root: string, path: string): string {
  if (
    !path ||
    isAbsolute(path) ||
    path.split(/[\\/]/).some((part) => part === ".." || forbidden.has(part))
  ) {
    throw new Error(
      `Use a project-relative path outside excluded directories: ${path}`,
    );
  }
  const result = resolve(root, path);
  if (!within(root, result)) throw new Error(`Path escapes project: ${path}`);
  return result;
}
export async function assertNoSymlinks(
  root: string,
  path: string,
): Promise<void> {
  let current = root;
  for (const segment of relative(root, path).split(sep).filter(Boolean)) {
    current = resolve(current, segment);
    try {
      if ((await lstat(current)).isSymbolicLink())
        throw new Error(`Symbolic links are not followed: ${current}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
      throw error;
    }
  }
}
export async function loadConfig(
  cwd: string,
  overrides: Partial<Config>,
): Promise<{ root: string; config: Config }> {
  const root = await realpath(cwd);
  await assertNoSymlinks(root, resolve(root, "patternbook.json"));
  let project: unknown = {};
  try {
    project = JSON.parse(
      await readFile(resolve(root, "patternbook.json"), "utf8"),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (!project || typeof project !== "object" || Array.isArray(project))
    throw new Error("patternbook.json must contain an object.");
  const supplied = (project as { baseline?: unknown }).baseline ?? {};
  if (!supplied || typeof supplied !== "object" || Array.isArray(supplied))
    throw new Error("baseline must contain an object.");
  const allowed = new Set(["target", "mode", "paths", "exclude", "reportDir"]);
  for (const key of Object.keys(supplied))
    if (!allowed.has(key)) throw new Error(`Unknown baseline option: ${key}`);
  const config = {
    target: "widely",
    mode: "static",
    paths: ["src"],
    exclude: [],
    reportDir: "reports/baseline",
    ...supplied,
    ...overrides,
  } as Config;
  if (typeof config.target !== "string" || !targetValid(config.target))
    throw new Error(
      "Target must be widely, newly, or a four-digit year from 1900 to 2099.",
    );
  if (config.mode !== "static")
    throw new Error(
      "The CLI supports static mode only. Runtime verification is a separate manual procedure.",
    );
  for (const key of ["paths", "exclude"] as const) {
    if (
      !Array.isArray(config[key]) ||
      config[key].some((value) => typeof value !== "string")
    )
      throw new Error(`${key} must be a string array.`);
  }
  if (config.paths.length === 0)
    throw new Error("At least one source path is required.");
  if (typeof config.reportDir !== "string")
    throw new Error("reportDir must be a string.");
  for (const path of [...config.paths, ...config.exclude, config.reportDir]) {
    const absolute = resolveLocal(root, path);
    await assertNoSymlinks(root, absolute);
  }
  if (resolveLocal(root, config.reportDir) === root)
    throw new Error("Use a dedicated report directory, not the project root.");
  return { root, config };
}
