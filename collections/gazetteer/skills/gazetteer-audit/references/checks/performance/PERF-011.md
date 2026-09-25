# PERF-011 — critical CSS and render-blocking resources

* **Source status:** Recommended
* **Methods:** `html,network,repo,performance,manual`
* **Applicability:** Pages with CSS or other render-blocking resources
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
