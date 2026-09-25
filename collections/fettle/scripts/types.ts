export type Outcome = "success" | "failure" | "unknown";
export type RuleId =
	| "FTL01"
	| "FTL02"
	| "FTL03"
	| "FTL04"
	| "FTL05"
	| "FTL06"
	| "FTL07"
	| "FTL08";

export interface FettleConfig {
	version: 1;
	collections: string[];
	reportsDirectory: string;
	observation: {
		enabled: boolean;
		rawLogRetentionDays: number;
		maximumEvents: number;
		redactKeys: string[];
	};
	detection: {
		repetitionThreshold: number;
		overheadToolCallThreshold: number;
	};
	github: { publication: "local" | "propose" | "automatic" };
	automaticSkillModification: false;
}

export interface FettleEvent {
	id: string;
	timestamp: string;
	host: string;
	executionId: string;
	kind: string;
	outcome: Outcome;
	operation: string;
	skill?: string;
	error?: string;
	tags?: string[];
	durationMs?: number;
	data: Record<string, unknown>;
}

export interface Finding {
	id: string;
	fingerprint: string;
	rule: RuleId;
	title: string;
	status: "open" | "resolved";
	causality: "established" | "hypothesis" | "unknown";
	affectedSkill?: string;
	firstSeen: string;
	lastSeen: string;
	occurrences: number;
	evidence: string[];
	summary: string;
	suspectedCause?: string;
	proposedInvestigation: string;
	acceptanceCriteria: string[];
}

export interface Inspection {
	path: string;
	name: string;
	valid: boolean;
	issues: string[];
	references: string[];
	lineCount: number;
}
