import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { FettleConfig } from "./types.ts";

export const projectRoot = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"..",
);

export async function loadConfig(): Promise<FettleConfig> {
	const contents = await readFile(resolve(projectRoot, "fettle.json"), "utf8");
	const config = JSON.parse(contents) as FettleConfig;
	if (config.version !== 1 || config.automaticSkillModification !== false) {
		throw new Error("Unsupported or unsafe fettle.json configuration");
	}
	return config;
}

export function resolveFromRoot(path: string): string {
	return resolve(projectRoot, path);
}
