# Launch checklist — askscripture.vercel.app

You don't have a domain yet, so the **closest-to-`askscripture.com`** free
URL you can get is **`askscripture.vercel.app`** (Vercel reserves the exact
subdomain match for the project name).

This file walks through the three steps you do yourself. I've prepped
everything so each one is mostly copy-paste.

---

## 1. Supabase (≈ 15 min)

### 1a. Create the project

1. Go to <https://supabase.com> → **New project**.
2. Project name: `askscripture` (or anything; doesn't affect the URL).
3. Database password: generate a strong one + save it in your password
   manager — you may need it for direct DB connections later.
4. Region: closest to you (US-East-1 if you're in the US).
5. Plan: **Free**.

Wait ~2 min for the project to provision.

### 1b. Apply ALL migrations in one paste

Once the project is up:

1. Left sidebar → **SQL Editor** → **New query**.
2. Open the file `supabase/migrations/ALL_IN_ONE.sql` in this repo.
3. Copy the entire contents, paste into the SQL Editor, click **Run**.

This applies all 6 migrations in order:

- `0001` — initial schema (profiles, notes, highlights, bookmarks,
  reading_progress, streaks, chat_usage) with full RLS
- `0002` — admin helpers (`is_admin()`, admin SELECT policies, GUC docs)
- `0003` — Stripe schema (is_pro, stripe_customer_id, donations table)
- `0004` — lockdown (chat_usage RLS write-lock, stripe_events idempotency,
  customer_id unique, profile delete policy)
- `0005` — daily shared content table
- `0006` — additional lockdown (column-level profile write restrictions,
  increment_usage caller check + monthly cap, retention helpers)

You should see "Success. No rows returned" if it ran clean.

### 1c. Admin access — DONE (2026-06-10)

~~Set the `app.admin_emails` GUC~~ — hosted Supabase no longer allows
custom `app.*` GUCs. Replaced by migration `0007_admin_table.sql`:
a `public.admin_emails` table seeded with `stepdugas@gmail.com`, and
`is_admin()` rewritten to read it. Already applied to production.

To add another admin, run in SQL Editor:
`insert into public.admin_emails (email) values ('other@example.com');`

### 1d. Grab the keys

1. **Project Settings → API**.
2. Copy these three values:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret — never expose to the browser)

Save them somewhere; you'll paste them into Vercel in step 3.

### 1e. Enable Google sign-in

1. **Authentication → Providers → Google → Enable**.
2. Click "Get your client ID and secret" — Supabase walks you through
   creating a Google Cloud OAuth client.
3. The redirect URI Supabase shows you (something like
   `https://abcdefgh.supabase.co/auth/v1/callback`) goes into Google
   Cloud Console as an authorized redirect URI.
4. Paste the Google Client ID + Client Secret back into Supabase. Save.

### 1f. Set the site URL

1. **Authentication → URL Configuration**.
2. **Site URL**: `https://askscripture.vercel.app`
3. **Redirect URLs** (add all of these):
   - `https://askscripture.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback`
4. Save.

---

## 2. GitHub (≈ 5 min)

### 2a. Create the repo

1. Go to <https://github.com/new>.
2. Repository name: `askscripture`.
3. Owner: your account.
4. **Private** is fine (you can flip to public later).
5. **Don't** initialize with a README — the local repo already has files.
6. Create repository.

### 2b. Push

GitHub will show you commands. From `~/Desktop/askscripture`, run:

```bash
git remote add origin https://github.com/<YOUR-USERNAME>/askscripture.git
git branch -M main
git push -u origin main
```

If the push asks for credentials, paste a **Personal Access Token** (not
your password). Generate one at
<https://github.com/settings/tokens?type=beta>.

---

## 3. Vercel (≈ 10 min)

### 3a. Import the GitHub repo

1. Go to <https://vercel.com> → **Add New → Project**.
2. **Import Git Repository** → connect GitHub if you haven't yet.
3. Pick `askscripture`.
4. Project name: `askscripture` ← **important: this name becomes your
   free URL: `askscripture.vercel.app`. If someone has it taken, try
   `askscripture-app` or `ask-scripture` instead.**
5. Framework Preset: **Next.js** (auto-detected).
6. Root directory: `./` (auto-detected).
7. **Don't deploy yet** — click **Environment Variables** first.

### 3b. Paste env vars

In the env var section, add each of these (paste values as plaintext, no
quotes):

```
ANTHROPIC_API_KEY        = sk-ant-...                        (Anthropic console)
NEXT_PUBLIC_SUPABASE_URL = https://abcdefgh.supabase.co       (step 1d)
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...                        (step 1d)
SUPABASE_SERVICE_ROLE_KEY = eyJ...                            (step 1d — REQUIRED)
ADMIN_EMAILS             = stepdugas@gmail.com
NEXT_PUBLIC_SITE_URL     = https://askscripture.vercel.app
CRON_SECRET              = <generate a long random string>
```

Optional (for paid tier + emails):

```
STRIPE_SECRET_KEY        = sk_test_...                        (skip for v1 launch)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET    = whsec_...
STRIPE_PRICE_PRO         = price_...
RESEND_API_KEY           = re_...
RESEND_FROM_EMAIL        = hello@askscripture.com
GOOGLE_SITE_VERIFICATION = ...
```

### 3c. Deploy

Click **Deploy**. First build takes 3-5 min.

Once it's done, you'll get a URL — should be `askscripture.vercel.app`
if the name was available. Visit it.

### 3d. Set the Vercel Cron Secret

1. After deploy, **Project Settings → Cron Jobs**.
2. The two crons in `vercel.json` (`/api/cron/daily-content` and
   `/api/cron/email-digest`) should already be listed.
3. Set **Cron Secret** to the same value you put in `CRON_SECRET` env
   var above.

### 3e. Pre-warm today's content

The cron fires at 00:05 UTC, but on launch day you want today's `/today`
page to have content already. Trigger it manually:

```bash
curl -X GET https://askscripture.vercel.app/api/cron/daily-content \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Wait ~30 seconds. Then load `https://askscripture.vercel.app/today` —
the four sections should be populated.

---

## 4. Done. Test it.

- Land on the home page
- Click around the reader
- Sign in with Google (uses the Supabase OAuth you set up)
- Visit `/admin` — should work since your email matches `ADMIN_EMAILS`
- Open chat — first message should stream from Claude Haiku
- Visit `/today` — should show today's generated content

---

## When you're ready to point a real domain at it

1. Buy `askscripture.com` (Cloudflare Registrar is cheapest).
2. Vercel **Project → Domains → Add** → paste `askscripture.com`.
3. Vercel shows the DNS records to add at your registrar.
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel env to `https://askscripture.com`.
5. Update the **Site URL** + **Redirect URLs** in Supabase to the same.
6. Update Google OAuth authorized redirect URIs in Google Cloud Console.
7. Redeploy.

The Vercel subdomain keeps working as a fallback.
