import { lstat, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Audit } from "./types.ts";

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ] ?? character,
  );
}
export function html(audit: Audit): string {
  const cards = audit.findings
    .map(
      (
        finding,
      ) => `<article data-search="${escapeHtml(`${finding.file} ${finding.feature ?? "feature query"}`.toLowerCase())}" data-status="${escapeHtml(finding.status)}">
<h2>${escapeHtml(finding.id)}: ${escapeHtml(finding.feature ?? "Feature query")}</h2>
<p><strong>INVESTIGATE</strong> · Baseline: ${escapeHtml(finding.status)} · Target: ${finding.satisfiesTarget === null ? "unknown" : finding.satisfiesTarget ? "met" : "not met"}</p>
<p><code>${escapeHtml(finding.file)}:${finding.line}</code> · Signal: <code>${escapeHtml(finding.signal)}</code></p>
<p>${escapeHtml(finding.reason)}</p><p>Newly available date: ${escapeHtml(finding.lowDate ?? "unknown")} · Widely available date: ${escapeHtml(finding.highDate ?? "unknown")}</p>
<p>Evidence: lexical candidate only. Runtime: not tested.</p>
${finding.feature ? `<p><a href="https://webstatus.dev/features/${encodeURIComponent(finding.feature)}">Check current feature data</a></p>` : ""}</article>`,
    )
    .join("\n");
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Baseline candidates</title>
<style>body{font:1rem/1.6 system-ui,sans-serif;max-width:70rem;margin:auto;padding:1rem;color:#18212b;background:#fafafa}article{border:1px solid #66717c;padding:1rem;margin:1rem 0}h2{font-size:1.2rem}code{overflow-wrap:anywhere}label{display:block;margin-top:.5rem}input,select{font:inherit;max-width:100%}a{color:#124e86}:focus-visible{outline:3px solid #124e86;outline-offset:3px}[hidden]{display:none}</style></head>
<body><header><h1>Baseline modernisation candidates</h1><p>${audit.filesInspected} files inspected; ${audit.findings.length} candidates. Static scan only.</p>
<p>Target: ${escapeHtml(audit.target)}. Dataset: ${escapeHtml(audit.dataset.source)} ${escapeHtml(audit.dataset.version)}. Generated: ${escapeHtml(audit.generatedAt)}.</p><p>No candidate is an approved change or proof that a fallback can be removed.</p></header>
<section aria-label="Filter candidates"><label for="search">File or feature</label><input id="search" type="search"><label for="status">Baseline status</label><select id="status"><option value="">All statuses</option><option>widely</option><option>newly</option><option>limited</option><option>unknown</option></select><p id="count" role="status">${audit.findings.length} candidates shown</p></section>
<main>${cards || "<p>No matching signals found. This does not prove that no modernisation opportunities exist.</p>"}</main>
<section><h2>Method and limits</h2><ul>${audit.limitations.map((limit) => `<li>${escapeHtml(limit)}</li>`).join("")}</ul><p><a href="https://web.dev/baseline">Baseline methodology</a></p></section>
<script>const search=document.getElementById('search'),status=document.getElementById('status');function filter(){let count=0;for(const card of document.querySelectorAll('article')){card.hidden=!card.dataset.search.includes(search.value.toLowerCase())||(status.value!==''&&status.value!==card.dataset.status);if(!card.hidden)count++}document.getElementById('count').textContent=count+' candidates shown'}search.addEventListener('input',filter);status.addEventListener('change',filter);</script></body></html>`;
}
export async function writeReport(output: string, audit: Audit): Promise<void> {
  let names: string[] = [];
  try {
    names = await readdir(output);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  for (const name of names) {
    if ((await lstat(resolve(output, name))).isSymbolicLink())
      throw new Error("Refusing symbolic links in the report directory.");
  }
  if (names.length) {
    if (names.some((name) => !["audit.json", "index.html"].includes(name)))
      throw new Error(
        "Report directory contains unrelated files; choose a dedicated empty directory.",
      );
    const existing = JSON.parse(
      await readFile(resolve(output, "audit.json"), "utf8"),
    ) as Partial<Audit>;
    if (existing.tool !== "baseline-modernise" || existing.schemaVersion !== 1)
      throw new Error("Refusing to overwrite an unrecognised report.");
  }
  await mkdir(output, { recursive: true });
  await writeFile(
    resolve(output, "audit.json"),
    `${JSON.stringify(audit, null, 2)}\n`,
    "utf8",
  );
  await writeFile(resolve(output, "index.html"), html(audit), "utf8");
}
