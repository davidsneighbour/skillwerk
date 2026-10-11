---
applyTo: "collections/clerkwork/**"
---

# Clerkwork collection instructions

Paths in this file are relative to the repository root.

Keep public skill names flat and without a `clerkwork-` prefix. Categories are catalogue and navigation metadata, rather than invocation namespaces. Use the `foreman` skill for collection routing and capability discovery.

Every Clerkwork skill must read and apply `collections/clerkwork/resources/vocabulary.md`, including direct calls that bypass Foreman. Each skill bundles an identical copy at `collections/clerkwork/skills/<skill-name>/resources/vocabulary.md` for standalone installations. Edit the collection-level source, then run `node scripts/sync-clerkwork-vocabulary.ts` from the repository root. Collection validation rejects missing or different copies.
