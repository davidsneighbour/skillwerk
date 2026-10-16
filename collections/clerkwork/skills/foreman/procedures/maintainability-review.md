# Review maintainability

Establish the requested change range and intended behaviour. Review by default; do not turn a request for findings into a refactoring task.

Look for structural regressions: growing special cases, duplicated domain logic, unclear ownership, unnecessary layers, weak type boundaries, and partial updates that can leave inconsistent state. Prefer remedies that remove concepts or use an existing canonical boundary over remedies that merely distribute complexity across more files.

File size and conditional counts are investigation signals, not automatic blockers. Tie each finding to a concrete maintenance cost or failure mode, with a file location, supporting evidence, and a proportionate remedy. Distinguish a demonstrated regression from an optional alternative design.

Prioritise a few supported findings over cosmetic criticism. Do not require speculative architectural changes as a condition of approval. If refactoring is authorised, preserve behaviour and validate the affected contracts.
