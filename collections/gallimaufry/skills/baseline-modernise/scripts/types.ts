export interface Config {
  target: string;
  mode: "static";
  paths: string[];
  exclude: string[];
  reportDir: string;
}
export interface Feature {
  name?: string;
  status?: {
    baseline?: string | boolean;
    baseline_low_date?: string;
    baseline_high_date?: string;
  };
}
export interface Dataset {
  source: string;
  version: string;
  features: Record<string, Feature>;
}
export interface Finding {
  id: string;
  recommendation: "INVESTIGATE";
  feature: string | null;
  status: "widely" | "newly" | "limited" | "unknown";
  satisfiesTarget: boolean | null;
  lowDate?: string;
  highDate?: string;
  file: string;
  line: number;
  signal: string;
  reason: string;
  runtime: "not tested";
}
export interface Audit {
  schemaVersion: 1;
  tool: "baseline-modernise";
  mode: "static";
  target: string;
  generatedAt: string;
  dataset: { source: string; version: string };
  filesInspected: number;
  limitations: string[];
  findings: Finding[];
}
