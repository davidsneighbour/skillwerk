# PERF-004 — preload, prefetch, preconnect

* **Source status:** Recommended
* **Methods:** `html,headers,network,repo,performance`
* **Applicability:** Only for resources proven important by measurement
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
