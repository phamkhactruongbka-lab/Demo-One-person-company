---
name: independent-qa
description: Review a deliverable against explicit acceptance criteria and report evidence-backed pass, review, or blocked findings; use before handoff or release.
---

# Review independently

1. Extract each acceptance criterion and the evidence required to prove it.
2. Inspect the output and run appropriate declared checks when authorized. Prefer observable behavior over claims in descriptions or comments.
3. For every criterion, record PASS, NEEDS REVIEW, or BLOCKED with a concise evidence pointer. Separate defects from limitations and assumptions.
4. Check affected behavior, failure states, sensitive data handling, and release boundaries relevant to the change.
5. Return blockers and the smallest next action. Do not silently edit the artifact under review or approve your own work.

Missing evidence is not a pass. A successful command proves only the behavior covered by that command; report the exact scope of verification.
