# PERF-007 — conditional requests (eTag, last-modified, 304)

* **Source status:** Recommended
* **Methods:** `headers,network,manual`
* **Applicability:** Cacheable responses
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
