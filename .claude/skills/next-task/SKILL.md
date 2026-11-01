---
name: next-task
description: Work on exactly one small task from docs/TASKS.md — plan, implement in small steps, run checks, then stop with a summary and a suggested commit message. Never touches Git.
disable-model-invocation: true
argument-hint: "[task id, e.g. T-03]  (empty = first unchecked task)"
---

# Work on one small task

The user is a developer who must **understand and review every change** and who makes **all commits herself**.
Your job is to produce a small, reviewable diff — not to finish the project.

Task requested: `$ARGUMENTS` (if empty, take the first unchecked task in `docs/TASKS.md`).

## Procedure

1. **Read** `docs/TASKS.md`, find the task, and read only the files it lists (plus what you must read to understand them).
2. **Plan first.** Reply with a short plan before editing anything:
   - what the task changes and why (2–3 sentences, plain language),
   - the exact files you will touch,
   - what you will NOT touch,
   - how the result will be verified.
   Then **stop and wait for the user to say "go"** (or to adjust the plan).
3. **Implement in small steps.** One logical change at a time. After each step, briefly say what changed and why it was done this way.
   - Keep the whole task under ~150 changed lines (excluding lockfiles and generated files). If it will not fit, say so and propose splitting the task in `docs/TASKS.md` — do not just continue.
   - No drive-by refactors, renames, formatting sweeps or dependency upgrades that the task does not ask for.
   - Explain any new concept (e.g. a Drizzle schema, a transaction) in 2–3 sentences, as if for a developer new to it. The user must be able to explain this code in an interview.
4. **Verify.** Run, in this order, whatever applies: `npm run typecheck`, `npm run lint`, `npm run test:unit`, and the task's own verification step. Report real results. If something fails and the failure was not caused by this task, say so — do not hide it and do not "fix" unrelated code.
5. **Summarise** in this exact shape:
   - **Changed files** — each with one line saying why.
   - **How to review it** — what to read first, what to run (`git diff`, the commands, the URL to open).
   - **Check results** — pass/fail per command.
   - **Suggested commit message** — Conventional Commits, English, imperative, ≤ 72 chars subject, optional body.
   - **Suggested branch name** — `feature/…`, `fix/…` or `chore/…` (the user creates it).
6. **Stop.** Do not start the next task. Tick the checkbox in `docs/TASKS.md` only after the user says the task is accepted.

## Hard rules

- Never run `git add/commit/push/branch/checkout/stash/reset/merge/rebase` or `gh pr/repo/issue/release`. Reading is fine (`git status`, `git diff`, `git log`). A hook enforces this.
- Never run `npm run sanity:*` or `npm run billetto:*` scripts — they write to live services. If a task needs one, tell the user the command and let her run it.
- Never read or print `.env*` files or tokens. Use `.env.example` and variable *names* only.
- Everything written into the repository (code, comments, docs, commit messages) is in **English**. Talk to the user in the language she writes to you in.
