# PERF-014 — HTTP/1.1 workarounds: sharding, sprites, and request-driven bundling

* **Source status:** Avoid
* **Methods:** `network,repo,manual`
* **Applicability:** Modern HTTP/2 or HTTP/3 deployments
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
