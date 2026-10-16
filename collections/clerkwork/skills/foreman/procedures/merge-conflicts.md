# Resolve merge conflicts

Inspect the active merge, rebase, or cherry-pick, its base and both sides, unresolved paths, and unrelated local edits. Resolve the current operation without starting a different integration operation.

Resolve intent and public behaviour, rather than choosing whichever side compiles or keeping both sides mechanically. Use surrounding code, history, specifications, and tests to establish the intended result. Ask about incompatible product decisions that the evidence cannot resolve.

Regenerate lockfiles with the project's package manager when appropriate, preserving intended dependency versions and avoiding unrelated upgrades. Check unresolved index entries and remaining conflict markers, then run relevant validation.

Stage only resolved paths when finalising resolution is authorised. Continuing the operation may create or rewrite commits: do so only within the authorised workflow. Do not abort the operation, discard unrelated work, push, or tag merely to resolve conflicts.

Report files resolved, decisions between competing intentions, validation, and whether the integration operation is still in progress.
