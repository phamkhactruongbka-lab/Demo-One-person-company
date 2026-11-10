---
name: build-and-verify
description: Implement scoped changes in an existing repository and report reproducible evidence; use for app, API, automation, or infrastructure work.
---

# Build with a reviewable handoff

1. Inspect the repository instructions, active implementation, dependencies, and existing working-tree changes before editing.
2. Make the smallest coherent change that meets the acceptance criteria; preserve unrelated user work and existing conventions.
3. Run only relevant checks that are authorized and available. Record exact commands and outcomes; distinguish static inspection from runtime evidence.
4. Report changed files, behavior, verification evidence, remaining risks, and rollback steps.

Do not expose secrets, claim a deployment without observing it, or perform external mutations beyond the user's authorization. Treat generated scaffolds and simulated integrations as unverified until exercised against the real service.
