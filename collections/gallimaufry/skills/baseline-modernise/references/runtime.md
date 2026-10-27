# Optional runtime verification

This is a manual follow-up, not a CLI mode. Use browser tooling already available and authorised in the environment. If it is unavailable, record the limit and keep runtime state as not tested; do not silently install an MCP server or pretend static data verifies browser behaviour.

Ask the running site questions that source scanning cannot answer: which CSS declarations win, whether a fallback or polyfill actually executes, whether DOM changes after interaction, and whether the candidate works at relevant viewports with keyboard input and assistive semantics. Testing one browser does not prove support across the project's browser policy.

Use explicit representative routes. If broader discovery is authorised, keep it same-origin, bound the page count before starting, and exclude private, logout, mutation, and action URLs. Do not operate real payment, email, or destructive flows. Use authorised development servers and test modes; do not execute arbitrary configuration as a trusted shell command.

Keep follow-up evidence in a separate `verification.md` outside the scanner's report directory, which is reserved for generated files. Reference the exact report path, generation time, dataset version, finding ID, file, line, signal, route, browser/version, viewport, interaction, observed result, and remaining gaps. Do not rewrite the generated static report's mode or mark a candidate confirmed merely because a page loaded.

For each candidate, record one result: pending investigation, verified reason to retain, proposed simplification, or unavailable evidence. Explain behaviour, fallback, accessibility, and support-policy implications. Only a user-authorised implementation step may change source. After a new static scan, reconcile findings by source and feature rather than assuming old IDs still identify the same code.
