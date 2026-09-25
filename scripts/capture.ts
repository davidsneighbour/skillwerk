import { randomUUID } from "node:crypto";
import type { FettleConfig, FettleEvent, Outcome } from "./types.ts";

function value(payload: Record<string, unknown>, ...keys: string[]): unknown {
	for (const key of keys) if (payload[key] !== undefined) return payload[key];
	return undefined;
}

function text(
	payload: Record<string, unknown>,
	...keys: string[]
): string | undefined {
	const candidate = value(payload, ...keys);
	return typeof candidate === "string" && candidate.length > 0
		? candidate
		: undefined;
}

export function redact(input: unknown, redactedKeys: string[]): unknown {
	const blocked = new Set(redactedKeys.map((key) => key.toLowerCase()));
	if (Array.isArray(input))
		return input.map((item) => redact(item, redactedKeys));
	if (input && typeof input === "object") {
		return Object.fromEntries(
			Object.entries(input).map(([key, item]) => [
				key,
				blocked.has(key.toLowerCase())
					? "[REDACTED]"
					: redact(item, redactedKeys),
			]),
		);
	}
	return input;
}

export function normaliseEvent(
	host: string,
	kind: string,
	payload: Record<string, unknown>,
	config: FettleConfig,
): FettleEvent {
	const failure =
		kind.includes("failure") || value(payload, "success") === false;
	const success = kind.includes("result") || value(payload, "success") === true;
	const outcome: Outcome = failure
		? "failure"
		: success
			? "success"
			: "unknown";
	const tool =
		text(payload, "tool_name", "toolName", "operation", "command") ?? kind;
	const error = text(payload, "error", "error_message", "message");
	const event: FettleEvent = {
		id: text(payload, "event_id", "eventId") ?? randomUUID(),
		timestamp: text(payload, "timestamp") ?? new Date().toISOString(),
		host,
		executionId:
			text(payload, "session_id", "sessionId", "execution_id", "executionId") ??
			"unknown",
		kind,
		outcome,
		operation: tool,
		data: redact(payload, config.observation.redactKeys) as Record<
			string,
			unknown
		>,
	};
	const skill = text(payload, "skill", "skill_name", "skillName");
	if (skill) event.skill = skill;
	if (error) event.error = error.slice(0, 1000);
	const tags = value(payload, "tags");
	if (Array.isArray(tags) && tags.every((tag) => typeof tag === "string"))
		event.tags = tags;
	const duration = value(payload, "duration_ms", "durationMs");
	if (typeof duration === "number" && duration >= 0)
		event.durationMs = duration;
	return event;
}
