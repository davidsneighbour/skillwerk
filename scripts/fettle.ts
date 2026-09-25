#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inspectSkills } from "./audit.ts";
import { normaliseEvent } from "./capture.ts";
import { loadConfig, projectRoot, resolveFromRoot } from "./config.ts";
import { detect } from "./detect.ts";
import {
	appendEvent,
	mergeFindings,
	readEvents,
	readFindings,
	writeReport,
} from "./storage.ts";
import type { Finding } from "./types.ts";

function parseSince(value: string | undefined): Date | undefined {
	if (!value) return undefined;
	const match = value.match(/^(\d+)([dh])$/);
	if (!match)
		throw new Error(
			"--since must use a whole number followed by d or h, for example 7d",
		);
	const amount = Number(match[1]);
	const milliseconds = amount * (match[2] === "d" ? 86_400_000 : 3_600_000);
	return new Date(Date.now() - milliseconds);
}

async function stdinJson(): Promise<Record<string, unknown>> {
	let input = "";
	for await (const chunk of process.stdin) input += String(chunk);
	if (!input.trim()) return {};
	const parsed: unknown = JSON.parse(input);
	if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
		throw new Error("Hook input must be a JSON object");
	return parsed as Record<string, unknown>;
}

function report(
	persona: string,
	scope: string,
	summary: object,
	findings: Finding[] = [],
	notes: string[] = [],
) {
	return {
		version: 1,
		generatedAt: new Date().toISOString(),
		persona,
		scope,
		summary,
		findings,
		notes,
	};
}

async function main(): Promise<void> {
	const [command, ...args] = process.argv.slice(2);
	const config = await loadConfig();
	if (command === "capture") {
		if (!config.observation.enabled) return;
		const [host = "unknown", kind = "unknown"] = args;
		await appendEvent(
			config,
			normaliseEvent(host, kind, await stdinJson(), config),
		);
		return;
	}
	if (command === "inspect") {
		const scope = args[0] ?? "./skills";
		const path = resolve(projectRoot, scope);
		const inspections = await inspectSkills(path);
		const result = report("inspector", scope, {
			inspected: inspections.length,
			valid: inspections.filter((item) => item.valid).length,
			inspections,
		});
		console.log(JSON.stringify(result, null, 2));
		await writeReport(config, "inspector", result);
		return;
	}
	if (command === "observe") {
		const sinceIndex = args.indexOf("--since");
		const events = await readEvents(
			config,
			parseSince(sinceIndex >= 0 ? args[sinceIndex + 1] : undefined),
		);
		const detected = detect(events, config);
		const findings = await mergeFindings(config, detected);
		const result = report(
			"observer",
			sinceIndex >= 0 ? `since ${args[sinceIndex + 1]}` : "all retained events",
			{
				events: events.length,
				detected: detected.length,
				open: findings.filter((item) => item.status === "open").length,
			},
			detected,
		);
		console.log(JSON.stringify(result, null, 2));
		await writeReport(config, "observer", result);
		return;
	}
	if (command === "engineer") {
		const id = args[0];
		if (!id) throw new Error("engineer requires a finding ID");
		const finding = (await readFindings(config)).find((item) => item.id === id);
		if (!finding) throw new Error(`Finding not found: ${id}`);
		const proposal = {
			affectedFiles: finding.affectedSkill
				? [`${finding.affectedSkill}/SKILL.md`]
				: [],
			evidence: finding.evidence,
			expectedBenefit: `Prevent recurrence of ${finding.title.toLowerCase()}.`,
			authority:
				"Proposal only; approval is required before modification or publication.",
			regressionCriteria: finding.acceptanceCriteria,
		};
		const result = report("engineer", id, { proposal }, [finding]);
		console.log(JSON.stringify(result, null, 2));
		await writeReport(config, "engineer", result);
		return;
	}
	if (command === "prove") {
		const scope = args[0] ?? "./skills";
		const inspections = await inspectSkills(resolve(projectRoot, scope));
		const failed = inspections.filter((item) => !item.valid);
		const result = report(
			"prover",
			scope,
			{
				deterministic: {
					passed: inspections.length - failed.length,
					failed: failed.length,
				},
				variableBehaviour: "not run",
			},
			[],
			failed.flatMap((item) => item.issues),
		);
		console.log(JSON.stringify(result, null, 2));
		await writeReport(config, "prover", result);
		if (failed.length > 0) process.exitCode = 1;
		return;
	}
	if (command === "steward") {
		const roots = config.collections.map(resolveFromRoot);
		const collections = await Promise.all(
			roots.map(async (root) => ({ root, skills: await inspectSkills(root) })),
		);
		const names = collections.flatMap((collection) =>
			collection.skills.map((skill) => skill.name),
		);
		const duplicates = [
			...new Set(names.filter((name, index) => names.indexOf(name) !== index)),
		];
		const result = report(
			"steward",
			args.includes("--all")
				? "all configured collections"
				: "configured collections",
			{
				collections: collections.map((collection) => ({
					path: collection.root,
					skills: collection.skills.length,
				})),
				totalSkills: names.length,
				duplicateNames: duplicates,
			},
		);
		console.log(JSON.stringify(result, null, 2));
		await writeReport(config, "steward", result);
		return;
	}
	if (command === "fixture") {
		const fixture = args[0];
		if (!fixture) throw new Error("fixture requires an NDJSON file");
		for (const line of (await readFile(resolve(projectRoot, fixture), "utf8"))
			.split("\n")
			.filter(Boolean))
			await appendEvent(config, JSON.parse(line));
		return;
	}
	throw new Error(
		`Unknown command: ${command ?? "(none)"}. Use inspect, observe, engineer, prove, steward, capture, or fixture.`,
	);
}

main().catch((error: unknown) => {
	console.error(
		`fettle: ${error instanceof Error ? error.message : String(error)}`,
	);
	process.exitCode = 1;
});
