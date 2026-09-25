---
name: fettle-prove
description: Test whether an agent skill behaves as intended with deterministic fixtures and explicitly labelled variable agent-behaviour scenarios. Use for regression validation and instruction-conflict scenarios.
---

# Fettle Prover

Choose the least variable test that can establish the claim.

1. Run `node scripts/fettle.ts prove <path>` for deterministic structural assertions.
2. Reproduce a finding with an isolated fixture when event evidence is involved.
3. Separate deterministic results from variable agent-behaviour evaluations. Do not represent a single model run as proof of general behaviour.
4. Cover tool choice, error handling, escalation, instruction conflicts, and known regressions where relevant.
5. Record the tested version, inputs, observable result, and pass criteria.

Do not weaken an assertion only to obtain a passing result. Use [detection rules](../../resources/detection-rules.md) for evidence requirements.
