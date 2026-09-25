# PERF-003 — lazy loading images, iframes, and video

* **Source status:** Recommended
* **Methods:** `html,browser,repo,performance,manual`
* **Applicability:** Off-screen media; exclude the LCP element
* **Audit requirement:** Gather direct evidence using the listed methods. Apply the result-state rules in `../../../SKILL.md`; do not infer a pass from framework defaults.
* **Failure output:** Identify affected URLs or files, explain the defect, specify the implementation change, define acceptance criteria, and provide a repeatable verification step.
