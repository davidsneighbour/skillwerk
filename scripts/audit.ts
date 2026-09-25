import type { Dirent } from "node:fs";
import { access, readdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { Inspection } from "./types.ts";

const frontmatterPattern = /^---\n([\s\S]*?)\n---\n/;
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

async function exists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function skillFiles(root: string): Promise<string[]> {
	if (await exists(resolve(root, "SKILL.md")))
		return [resolve(root, "SKILL.md")];
	let entries: Dirent[];
	try {
		entries = await readdir(root, { withFileTypes: true });
	} catch {
		return [];
	}
	const files: string[] = [];
	for (const entry of entries) {
		if (
			!entry.isDirectory() ||
			entry.name === "node_modules" ||
			entry.name.startsWith(".")
		)
			continue;
		const candidate = resolve(root, entry.name, "SKILL.md");
		if (await exists(candidate)) files.push(candidate);
	}
	return files;
}

export async function inspectSkills(root: string): Promise<Inspection[]> {
	const results: Inspection[] = [];
	for (const path of await skillFiles(root)) {
		const contents = await readFile(path, "utf8");
		const issues: string[] = [];
		const frontmatter = contents.match(frontmatterPattern)?.[1];
		const name =
			frontmatter?.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? "unknown";
		const description = frontmatter
			?.match(/^description:\s*(.+)$/m)?.[1]
			?.trim();
		if (!frontmatter) issues.push("Missing YAML frontmatter.");
		if (!/^[a-z][a-z0-9-]*$/.test(name))
			issues.push("Name is missing or is not lower-case hyphen-case.");
		if (!description) issues.push("Description is missing.");
		if (/\[TODO(?::[^\]]*)?\]/i.test(contents))
			issues.push("Contains an unfinished TODO placeholder.");
		if (contents.split("\n").length > 500)
			issues.push(
				"SKILL.md exceeds 500 lines; consider progressive disclosure.",
			);
		const references = [...contents.matchAll(linkPattern)]
			.map((match) => match[1])
			.filter(
				(link): link is string =>
					typeof link === "string" && !link.includes(":"),
			);
		for (const reference of references) {
			if (!(await exists(resolve(dirname(path), reference))))
				issues.push(`Dead relative reference: ${reference}`);
		}
		results.push({
			path,
			name,
			valid: issues.length === 0,
			issues,
			references,
			lineCount: contents.split("\n").length,
		});
	}
	return results;
}
