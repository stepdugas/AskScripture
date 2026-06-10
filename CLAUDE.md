# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # local at http://localhost:3000
npm run build    # next build — run before push, catches Next 16 / RSC errors
npm run lint     # eslint
```

There is no test suite. Validate changes with `npm run build` + smoke testing in the browser. Two people work in this repo simultaneously (Stephanie via Claude Code locally + Co-work / Fable 5 via the Vercel-connected branch) — `git pull --rebase origin main` before committing, the other side often pushed in between.

## Live infrastructure

- Production: **https://askscripture-app.vercel.app** (the bare `askscripture.vercel.app` was taken at launch). All env vars + Vercel Crons are configured there; the source of truth for ops is `LAUNCH.md`.
- Supabase: hosted free tier; **custom Postgres GUCs are not allowed** — `is_admin()` reads from a `public.admin_emails` table seeded with the admin emails (migration `0007_admin_table.sql`). The `ADMIN_EMAILS` env var still drives the Node-side checks (`isAdminEmail` in `src/lib/env.ts`).
- Crons (`vercel.json`): `/api/cron/daily-content` at 00:05 UTC + `/api/cron/email-digest` Mondays 12:00 UTC. Both gated by `CRON_SECRET` (timing-safe compare).

## Architecture

### Graceful degradation by feature flag

Every external dependency is optional and detected by a boolean in `src/lib/env.ts`:

```ts
features.ai        // ANTHROPIC_API_KEY present
features.supabase  // NEXT_PUBLIC_SUPABASE_URL + ANON_KEY present
features.stripe    // STRIPE_SECRET_KEY present
features.email     // RESEND_API_KEY present
```

UI and routes check `features.*` before calling out — the home page, reader, translations, cross-references, and word study all work with **zero env vars** (just `npm run dev`). Chat, accounts, payments, and email each light up independently when their keys land.

### Bible data layer (`src/lib/bible/`)

- Primary source: **HelloAO Free Use Bible API** (`bible.helloao.org/api`) — no keys, no rate limits, CC0. Wrapped in `api.ts` with `"use cache"` + `cacheLife("weeks")` so chapters cache aggressively (this is why `cacheComponents: true` is set in `next.config.ts`).
- Canonical 66-book registry in `books.ts` (USFM IDs, slugs, scholarly sections).
- Reference parser in `parse-ref.ts` accepts "John 3:16", "Rom 8:28-30", "1 Cor 13", "Ps 23", etc.
- Cross-references (340k+ from OpenBible.info), search index, and Greek/Hebrew word study (STEPBible, 425k tagged words) are built from raw files via scripts in `scripts/build-*.mjs` and emitted to `src/data/`. Raw upstream files live in `data/` (gitignored).

### Auth + freemium gate

- `getCurrentUser()` in `src/lib/auth/user.ts` resolves the SSR session and decorates with `isAdmin`, `isLifetime`, `unlimited` flags. `unlimited` is the only gate that matters at request time — admins, early users (90-day grandfather), `is_lifetime` flag, and `is_pro` (Stripe) all collapse to it.
- `gateChat()` and `gateCustomGenerate()` in `src/lib/usage/check.ts` are the **only** way to do AI billing checks. They:
  - Resolve tier (anonymous / free / lifetime).
  - For signed-in users, call the `increment_usage` Postgres RPC via the **service role client** — this is atomic (no double-spend under concurrency) and enforces both daily and monthly caps inside SECURITY DEFINER SQL.
  - Fall back to in-memory IP buckets when Supabase isn't configured (dev) or for anonymous traffic.
- Custom-passage generation (`/generate/*`) is **Pro only** — free users see the daily shared content (`/today`) instead.
- Limits in `src/lib/usage/limits.ts`. Hard cost ceiling: ~$0.66/month for a maxed-out free signed-in user on Haiku 4.5.

### Claude model selection (`src/lib/anthropic.ts`)

| Surface | Model | Why |
|---|---|---|
| Free / anonymous chat | `claude-haiku-4-5` | ~3× cheaper input + output; adequate for Q&A |
| Pro / Lifetime / Admin chat | `claude-sonnet-4-6` | The thing Pro users notice |
| Daily shared `/today` content | `claude-sonnet-4-6` | One generation per kind per day total — fixed site cost |

Use `modelFor(user)` to pick per-user; use `DAILY_MODEL` for cron-generated content.

### Supabase client triad (`src/lib/supabase/`)

Three clients with different RLS postures — **picking the wrong one is a security bug**:

- `client.ts` — browser. Used in client components for the signed-in user's own data.
- `server.ts` — SSR (cookies-aware). Used in server components + route handlers for user-scoped queries that should respect RLS.
- `admin.ts` — **service role**, RLS-bypassing. Used for the `increment_usage` RPC, the Stripe webhook write, the email digest read of other users' notes, the admin lifetime toggle, and the daily-content cron insert. **Anything that touches another user's row or counts usage MUST go through this client** — using the SSR client makes those flows fail silently under RLS.

### Migrations

Located in `supabase/migrations/`, numbered `0001`-`0007`. There is a concatenated `ALL_IN_ONE.sql` for one-shot bootstrap of a new Supabase project. Important constraints baked into the schema:

- `chat_usage` is RLS-locked SELECT-only — increments happen exclusively through the `increment_usage` RPC.
- `stripe_events` table provides webhook idempotency.
- `profiles.stripe_customer_id` has a unique index.
- Column-level write restrictions prevent users from flipping their own `is_pro` / `is_lifetime` / `is_admin`.

When adding a migration, add it to both a new `000N_*.sql` file **and** `ALL_IN_ONE.sql`.

### Markdown rendering for AI output

All AI-generated text is markdown. Render it via the shared `<Markdown>` component in `src/components/markdown.tsx` (styled to match the editorial design system — Source Serif 4 headings, ink-subtle h3 labels, accent-bordered blockquotes). Do not render AI strings with `whitespace-pre-wrap` — users will see literal `**` and `##`. User-typed text (notes, chat user bubbles) keeps `whitespace-pre-wrap`.

### Editorial design system (non-negotiable)

- Ink navy `#1B2845` accent on off-white paper `#FBFAF7`.
- **Source Serif 4** for scripture/longform, **Inter** for UI, **JetBrains Mono** for Greek/Hebrew + microlabels.
- **No emojis.** Anywhere. Use uppercase tracked labels (`text-[0.6875rem] uppercase tracking-[0.16em] text-ink-subtle`) instead of emoji bullets.
- Verse numbers are printed-Bible superscripts, not parenthetical.
- 12-col grid feel; aim for tasteful editorial, not SaaS dashboard.

### Next.js 16 specifics

`next.config.ts` sets `cacheComponents: true`, which is why every Bible API call is wrapped in `"use cache"` + `cacheLife("weeks")`. The `/today` and `/admin` pages wrap their async/cookie-touching content in `<Suspense>` to avoid prerender errors. When adding a server component that reads cookies (`getCurrentUser`, anything reading session), wrap in `<Suspense>` like `/admin/page.tsx` does — otherwise the build fails with a prerender error.

## Repo-specific gotchas

- `git pull --rebase` before committing — Co-work pushes in between sessions.
- The `data/` dir (raw STEPBible + OpenBible files) is gitignored. To rebuild the word-study / cross-ref / search data, run `scripts/build-*.mjs` after downloading the raw sources.
- `.env.local` is required for any AI / Supabase / Stripe testing — `.env.example` documents the full set.
- There is no test framework. `npm run build` is the smoke test.
