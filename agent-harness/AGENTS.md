# Agent Harness

Use the Harness in this directory. Read HUONG_DAN.md before managing a job.
Use doctor before the first real run. Submit a JSON job then run its returned ID.
Only use repositories explicitly selected by the user. Default to review mode.
Read commands in tests before running: they execute locally outside the Codex sandbox.
Do not delegate to subagents unless explicitly requested by the user.
Never describe needs_review as approved or production-ready.
The worker processes queued jobs into isolated clones and reports. Automatic review approval, push, merge, and deployment are not implemented; do not claim those actions occurred.
Do not modify SQLite state manually to hide errors. A retry creates a new job.
Report exact artifact paths and actual test results. Distinguish fake adapter tests from real Codex runs.

## Continuous worker limits

- The optional Windows scheduled task processes queued jobs sequentially while the user is logged in. It cannot run while the PC is powered off or asleep, and it is not connected to the Konoha app's department queue.
- `needs_review` remains a human-review state. Do not convert it to approved, push, merge, or deploy; this worker has no release implementation or target configuration.
