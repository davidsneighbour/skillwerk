# PERF-008 — no-vary-search response header

* **Source status:** Recommended
* **Methods:** `headers,network,repo,manual`
* **Applicability:** Resources where selected query parameters do not change content
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
