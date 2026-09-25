# Governance and privacy

Fettle uses the authority order `dogma > rule > instruction`. It reports conflicts and does not resolve them silently. A finding is evidence for review, not permission to edit a skill. Publishing an issue is a separate action from changing a skill.

Observation is local by default. Capture only data needed for a detector, redact configured sensitive keys recursively, retain raw events for the configured period, and retain findings until explicit resolution or deletion. Generated reports must not be committed.

GitHub publication defaults to `propose`. A human must approve publication. Before publication, compare the proposal with local findings and accessible repository issues. Recurrences update the original finding where possible.

Hooks are non-blocking and fail open. Expensive or contextual analysis runs only during an explicit command or after a qualifying event. Fettle includes itself in audits but has no self-modification privilege.
