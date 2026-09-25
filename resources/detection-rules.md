# Detection rules

Every detector identifies its required evidence. Missing host evidence produces no causal claim.

- `FTL01` — repeated tool failure. Requires at least the configured number of failed events with the same operation and normalised error.
- `FTL02` — instruction conflict. Requires an event explicitly tagged with both the action and the conflicting instruction reference.
- `FTL03` — missing prerequisite. Requires a failed event classified as a missing tool, permission, file, or environment setting.
- `FTL04` — repeated user correction. Requires repeated prompt events explicitly tagged as corrections for the same skill and behaviour.
- `FTL05` — skill invocation failure. Requires an expected skill and evidence that it was skipped, unavailable, or invoked incorrectly.
- `FTL06` — unnecessary interaction. Requires repeated requests for a fact already identified in permitted context.
- `FTL07` — regression. Requires a prior resolved finding or regression marker and a matching new failure.
- `FTL08` — excessive overhead. Requires measured tool-call or duration data above a configured threshold.

One failure is an observation, not a defective skill. Findings say `hypothesis` when evidence supports correlation but not causation.
