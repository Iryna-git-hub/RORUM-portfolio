# Task backlog

Each task is one reviewable unit of work: ~1 hour, ≤ ~150 changed lines, one commit.
Run one with `/next-task T-03` in Claude Code. Tick the box only after the change is reviewed and committed.

Format: **Goal** · **Files** · **Done when** · **Verify**

---

## Phase 0 — Make the project trustworthy

- [x] **T-01 Verify the Sanity import**
  **Goal:** Confirm the new Sanity project contains the imported content and that the site and Studio read from it (not from the old client project).
  **Files:** none changed (read-only check; may add notes to `docs/PROGRESS.md`).
  **Done when:** project id in `.env.local` differs from the client's; Studio at `/studio` shows pages, events and images; the home page renders real content.
  **Verify:** `npm run dev`, open `/` and `/studio`; compare document counts with the old project (the owner runs `npx sanity documents query`).

- [x] **T-02 Add `.env.example`**
  **Goal:** Document every environment variable by name only, with a one-line comment each.
  **Files:** `.env.example`, `README.md` (setup section).
  **Done when:** a fresh clone can follow the README and start `npm run dev`.
  **Verify:** `git diff`; no real values or tokens appear anywhere.

- [x] **T-03 Fix TypeScript errors, batch 1**
  **Goal:** Get `npm run typecheck` from 41 errors to fewer by fixing the first group (same root cause).
  **Files:** decided in the plan step after running typecheck.
  **Done when:** the chosen group of errors is gone, nothing else changed.
  **Verify:** `npm run typecheck` (count before/after).

- [x] **T-04 Fix TypeScript errors, batch 2…n** — not needed: all 41 errors had one root cause, fixed in T-03.
  **Goal:** Repeat T-03 until typecheck is clean. Split into as many tasks as needed.
  **Verify:** `npm run typecheck` → 0 errors.

- [x] **T-05 Fix failing unit tests (form tests), batch 1** — not needed: all 873 tests already passed once `.env.example`/`.env.local` were complete.
  **Goal:** Find why the form tests fail, fix the root cause (not the assertions).
  **Verify:** `npm run test:unit` — report passing count before/after.

- [x] **T-06 Fix failing unit tests, batch 2…n** — not needed, see T-05.
  **Verify:** `npm run test:unit` → all green.

- [x] **T-07 Replace the old project id in tests**
  **Goal:** Remove the hard-coded client project id (`939cqwfo`) from `tests/event-sharing.spec.ts`; read it from env.
  **Files:** `tests/event-sharing.spec.ts`.
  **Verify:** `grep` finds no occurrence; the spec still lists/loads.

- [x] **T-08 Replace `.claude/settings.json` with the safe version**
  **Goal:** Remove the old allow-list (contains personal paths and risky `git`/`npm run *` permissions); add the new settings, hook and skill from the starter kit.
  **Files:** `.claude/settings.json`, `.claude/hooks/block-git-writes.mjs`, `.claude/skills/next-task/SKILL.md`.
  **Verify:** ask the agent to run `git status` (works) and `git add .` (blocked).

- [ ] **T-09 GitHub Actions CI**
  **Goal:** On every push and pull request run `typecheck`, `lint`, `test:unit`.
  **Files:** `.github/workflows/ci.yml`.
  **Done when:** green check on a pull request.
  **Verify:** open the Actions tab on GitHub.

- [ ] **T-10 Slim down the repo (decision first)**
  **Goal:** Decide what to do with heavy media in git history (≈590 MB). Agent only prepares the options and the exact commands; the owner decides and runs them.

## Phase 1 — Deploy a preview

- [ ] **T-11 Vercel preview deploy** — *Owner: manual, no agent*
  **Goal:** Deploy the current frontend + embedded Studio to Vercel Hobby.
  **Steps:**
  1. Vercel → Add New Project → import the GitHub repository (Framework: Next.js, build command stays `npm run build`).
  2. Add environment variables from `.env.example` (see T-02): `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN` (Viewer, read-only), plus the other variables the site needs. Do NOT add the write token.
  3. Deploy once. Copy the resulting `https://<project>.vercel.app` URL.
  4. Set `NEXT_PUBLIC_SITE_URL` to that URL and redeploy (the site rejects an unset or localhost value by design).
  5. sanity.io/manage → project → API → CORS origins → add the Vercel URL, with credentials allowed (needed for `/studio`).
  **Done when:** the preview URL renders real content in EN/DA/UK and `/studio` opens and loads data.
  **Verify:** open the URL on desktop and phone; check the Vercel build log for warnings.

- [ ] **T-12 English-only Studio help text, step 1: tooling**
  **Goal:** Write a script that lists all `"English. / Ukrainian."` strings under `sanity/` (dry run, prints only).
  **Verify:** output count matches the earlier analysis (~220 lines).

- [ ] **T-13 English-only Studio help text, step 2…n: apply per folder**
  **Goal:** Replace bilingual descriptions with English-only in one folder per task, update the matching test assertions in the same task.
  **Verify:** `npm run test:unit`, open Studio for the touched type.

- [ ] **T-14 Make Sanity the only source of event data, step 1: move event types**
  **Goal:** `lib/data.ts` mixes TypeScript types with legacy hard-coded content. Move the event-related types (`RorumEvent`, `ShareAction`, `TicketProviderInfo`, `DEFAULT_SHARE_ACTIONS`, …) into their own file and update imports. No behavior change.
  **Files:** `lib/data.ts`, a new `lib/eventTypes.ts` (name decided in the plan step), the files that import these types.
  **Verify:** `npm run typecheck`, `npm run test:unit`.

- [ ] **T-15 Make Sanity the only source of event data, step 2: remove the runtime fallback**
  **Goal:** The event detail page, events listing, home page and sitemap fall back to the static `events` array in `lib/data.ts` when Sanity returns nothing, so a missing or mistyped slug silently shows stale hard-coded content instead of a 404. Remove that fallback (and the per-field `staticBySlug` fallback in `lib/sanityEvents.ts`); decide in the plan step what happens when Sanity is not configured.
  **Files:** `app/[locale]/(site)/events/[slug]/page.tsx`, `app/[locale]/(site)/events/page.tsx`, `app/[locale]/(site)/page.tsx`, `app/sitemap.ts`, `lib/sanityEvents.ts`.
  **Done when:** an event that exists only in `lib/data.ts` (e.g. `/events/community-reset-night`) returns 404.
  **Verify:** `npm run typecheck`, `npm run test:unit`, open an existing and a non-existing event in the browser.

- [ ] **T-16 Make Sanity the only source of event data, step 3: delete static events and fix tests**
  **Goal:** Delete the `events` arrays from `lib/data.ts`. Unit tests that used them get small local fixtures; `tests/event-sharing.spec.ts` is pointed at an event that exists in Sanity (its titles/descriptions updated to match).
  **Files:** `lib/data.ts`, affected `*.test.ts(x)` files, `tests/event-sharing.spec.ts`. The import scripts in `scripts/` that read `events` are historical — decide in the plan step whether to delete them or leave them.
  **Verify:** `npm run typecheck`, `npm run test:unit`, `npx playwright test tests/event-sharing.spec.ts` green.

- [ ] **T-17 Remove the remaining hard-coded content (audit first)**
  **Goal:** No editorial content in source code — Sanity is the only source. After T-16, `lib/data.ts` still holds nav items, page metadata, membership/about texts, packages, service cards and FAQs. First list which of these are already served from Sanity (code is dead) and which are still rendered; then remove them one group per follow-up task, moving any missing content into Sanity.
  **Files:** audit is read-only; follow-up tasks decided from the audit.
  **Done when:** `lib/data.ts` contains no editorial content (or is deleted).

## Phase 2 — Backend foundation

- [ ] **T-20 PostgreSQL in Docker**
  **Goal:** `docker-compose.yml` with Postgres; `DATABASE_URL` in `.env.example`.
  **Verify:** `docker compose up -d`, connect with `psql` or a GUI.

- [ ] **T-21 Drizzle setup**
  **Goal:** Install Drizzle, add `server/db/client.ts`, `drizzle.config.ts`, npm scripts for generate/migrate.
  **Verify:** `npm run db:migrate` runs on an empty database.

- [ ] **T-22 Schema: `submissions` table + first migration**
- [ ] **T-23 Zod schema for the contact form (shared by client and server)**
- [ ] **T-24 `POST /api/contact` route handler → service → repository (no email yet)**
- [ ] **T-25 Unit + integration tests for `/api/contact`**
- [ ] **T-26 Switch the contact form from Formspree to `/api/contact`**
- [ ] **T-27 Send email through Resend (+ failure handling)**
- [ ] **T-28 Rate limiting stored in Postgres**

## Phase 3 — Event registrations

- [ ] **T-30 Schema: `registrations` (UNIQUE event + email) + migration**
- [ ] **T-31 `POST /api/events/[slug]/register` with capacity check in a transaction**
- [ ] **T-32 Signed cancel link + `DELETE`/cancel route**
- [ ] **T-33 Tests for race conditions (two simultaneous last-seat requests)**
- [ ] **T-34 Registration form UI in the event page**

## Phase 4 — Admin and polish

- [ ] **T-40 Admin auth (Auth.js or Better Auth) + `admin_users`**
- [ ] **T-41 Admin: list submissions and registrations**
- [ ] **T-42 `audit_log` for admin actions**
- [ ] **T-43 README with architecture diagram, screenshots, "how to run"**
- [ ] **T-44 Neon production database + migrations on deploy**

> Detailed acceptance criteria for T-22 and later are written when the previous phase is done — the plan step of `/next-task` expands them.
