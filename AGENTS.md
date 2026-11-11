# Konoha project guidance

Reusable Codex skills live in `.agents/skills/`; `app.js` maps their concise workflows into the in-app department prompts.

The local Agent Harness has a separate SQLite job queue and optional Windows worker. It is not connected to the Konoha app's department queue. Its current result state remains `needs_review`; automated merge and deployment are not implemented.

- Route task intake and assignment through Naruto with clear owners, deliverables, acceptance criteria, dates, and blockers.
- Use `evidence-first-research` for current claims and record source/date; distinguish fact from inference.
- Use `short-video-content-pack` for reviewable social video assets; Founder approval is required before external publishing.
- Use `build-and-verify` for repository changes and `independent-qa` for a separate acceptance review.
- Use `campaign-metrics` for observed baselines and checkpoints; do not invent platform results.
- These roles and skills are prompts/workflows, not independent always-on workers. Report runtime and external outcomes only when directly observed.
