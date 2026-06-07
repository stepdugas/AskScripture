# AskScripture — Setup Checklist

The app **runs locally with zero configuration**: scripture, translations,
cross-references, bias flags, reading plans, settings, notes/bookmarks
(localStorage), and the editorial UI all work right now via
`npm run dev`.

The features below need accounts/keys before they're functional. Each
section explains what it unlocks and how long the setup takes.

---

## 1. Anthropic API key — unlocks Study Chat + generators (~5 min)

Without this key, the chat drawer and `/generate/*` routes return a
graceful "ANTHROPIC_API_KEY is not configured" message. With it, all
six chat modes (Objective / Scholarly / Devotional / Affirming /
Storytelling / Kids) and content generation (personal devotional /
family devotional / sermon outline) start streaming responses.

**Steps:**
1. Sign up at [console.anthropic.com](https://console.anthropic.com).
2. Add a payment method and at least $5 of credits (Claude Sonnet 4.6
   runs ~$3/M input tokens, ~$15/M output — a single user typing
   actively can do study sessions for cents).
3. Create an API key in the dashboard.
4. Locally: copy `.env.example` to `.env.local` and paste the key as
   `ANTHROPIC_API_KEY`.

The app uses `claude-sonnet-4-6` by default (defined in
`src/app/api/chat/route.ts` and `src/app/api/generate/route.ts`).

---

## 2. Supabase project — unlocks accounts + cross-device sync (~20 min)

Without Supabase, sign-in/up pages show a "not configured" notice and
all user data lives in localStorage on each device. With Supabase: real
accounts (email + Google OAuth), notes/highlights/bookmarks/streaks
syncing across devices, per-user freemium usage tracking, and admin
access for you.

**Steps:**
1. Sign up at [supabase.com](https://supabase.com) → create a new
   project (free tier is fine to start).
2. From Project Settings → API copy the **Project URL** and **anon
   public key** into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. **REQUIRED:** Copy the **service_role** key as
   `SUPABASE_SERVICE_ROLE_KEY`. This is what the freemium usage RPC, the
   admin lifetime toggle, the Stripe webhook, and the email-digest cron all
   use to bypass RLS for privileged writes. Without it, those flows fall
   back to a fail-closed state (e.g. usage tracking returns 500 instead of
   silently allowing unlimited calls).
4. Run the schema migrations in order:
   - Open Supabase SQL Editor.
   - Paste the contents of `supabase/migrations/0001_initial.sql`, run.
   - Paste `supabase/migrations/0002_admin_helpers.sql`, run.
   - Paste `supabase/migrations/0003_stripe.sql`, run.
   - Paste `supabase/migrations/0004_lockdown.sql`, run.
5. Set the admin GUC in Supabase → Settings → Database → Custom Postgres
   Config: add a row `app.admin_emails = stepdugas@gmail.com` (or your
   comma-separated lowercase list). This is what makes the SQL
   `is_admin()` function return true for you. Required for the admin
   page to read other users' rows.
6. In Supabase → Authentication → URL Configuration:
   - Add your production URL to **Site URL** (e.g. `https://askscripture.com`).
   - Add to **Redirect URLs**: `https://askscripture.com/auth/callback`,
     `http://localhost:3000/auth/callback`, and any Vercel preview URLs.

### Enable Google sign-in (~5 min)
1. Supabase → Authentication → Providers → Google → enable.
2. Click "Get your client ID and secret" — it walks you through
   creating a Google Cloud OAuth client. The redirect URI Supabase
   shows you (something like `https://<project>.supabase.co/auth/v1/callback`)
   is the one to paste into Google Cloud Console.
3. Paste the Google Client ID + Client Secret back into Supabase.
4. Save.

Grandfathering: the migration's `handle_new_user()` trigger marks
any user who signs up in the first 90 days as `is_early_user = true`.
Use this flag in any future paywall logic; the freemium check already
treats early users as unlimited.

---

## 3. Domain + Vercel deploy — production (~30 min)

The app is ready to deploy on Vercel. The default `siteUrl` is
`https://askscripture.com` (see `src/lib/env.ts`); override via the
`NEXT_PUBLIC_SITE_URL` env var if your domain ends up being something
else.

**Steps:**
1. Push the project to GitHub (it's a git repo already with the
   default `git init` from create-next-app).
2. Import the repo in [vercel.com](https://vercel.com).
3. Add all env vars from `.env.local` to the Vercel project settings
   (Production, Preview, Development scopes).
4. Buy `askscripture.com` (Cloudflare Registrar, Namecheap, etc.) and
   point the apex + `www` to Vercel per their domain instructions.
5. If the domain differs from `askscripture.com`, set
   `NEXT_PUBLIC_SITE_URL` to your actual production URL — this is
   what sitemap.xml and robots.txt use.

---

## 4. Stripe — paid Pro tier + donations (~20 min)

Without this, `/pricing` shows the plans but the upgrade button does nothing, and `/support` shows the donation form but checkout doesn't open. Both pages explain that themselves.

**Steps:**
1. Sign up at [stripe.com](https://stripe.com), grab API keys from Developers → API keys.
2. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
3. Create a recurring price (e.g. $5/month) in Stripe dashboard → Products → AskScripture Pro → Add price. Copy the price ID (`price_...`) into `.env.local` as `STRIPE_PRICE_PRO`.
4. Set up a webhook endpoint at Stripe → Developers → Webhooks → Add endpoint:
   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the signing secret (`whsec_...`) to `.env.local` as `STRIPE_WEBHOOK_SECRET`.
5. Run migration `supabase/migrations/0003_stripe.sql` to add the `is_pro` and `stripe_customer_id` columns plus the `donations` log table. (Migration `0004_lockdown.sql` then adds the unique constraint on `stripe_customer_id` and the `stripe_events` idempotency table — must be applied for the webhook to work safely.)

After this, Stripe checkout opens for both the Pro upgrade and one-time donations, and the webhook flips `profiles.is_pro = true` on successful subscription. Pro users get unlimited usage just like lifetime/admin.

For local development: use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

---

## 5. Paid translations (NIV, NASB, ESV, NRSVue) — optional

These are the most-requested translations and **none of them are free
to redistribute**. Each requires applying to the publisher for an API
key and accepting their attribution + per-request limits.

| Translation | API | Process |
|---|---|---|
| NIV, NASB | [API.Bible](https://scripture.api.bible) | Free dev key; commercial use requires per-translation approval from Biblica/Lockman |
| ESV | [api.esv.org](https://api.esv.org) | Free for non-commercial; rate-limited to 5000 queries/day |
| NRSVue | Multiple paths | Contact NCC or use Bible Gateway's licensing |

When you have keys, wire them into `src/lib/bible/translations.ts`
and `src/lib/bible/api.ts`. The architecture already supports multiple
backends.

---

## 5. Email + transactional — for digests, password resets (~15 min)

Not blocking. Needed when you want to send weekly digests of saved
notes, password-reset emails, or onboarding messages.

**Recommended: Resend** (cheap, modern, plays nice with Vercel).
1. Sign up at [resend.com](https://resend.com).
2. Verify your sending domain (`mail.askscripture.com` works fine).
3. Add `RESEND_API_KEY` to env when you wire up the digest job.

Supabase Auth's confirmation/reset emails ship via Supabase's own
SMTP by default; you only need Resend for app-driven email.

---

## 7. Search Console + analytics — when public (~10 min)

1. [Google Search Console](https://search.google.com/search-console) → Add property → choose **HTML tag** verification → copy the content value. Paste it into `.env.local` as `GOOGLE_SITE_VERIFICATION=` (just the value, no quotes). Redeploy. Click verify. Then submit `https://askscripture.com/sitemap.xml`.
2. Bing Webmaster Tools — same drill, into `BING_SITE_VERIFICATION`.
3. Analytics: I'd recommend Vercel Analytics (one toggle, free for personal sites) or Plausible (privacy-first, ~$9/mo). Avoid GA4 unless you need its complexity.

---

## 7. Admin access + lifetime for you

Already wired up — just add your email.

In `.env.local` (and Vercel env settings for production):
```
ADMIN_EMAILS=stepdugas@gmail.com
```

That single var gives `stepdugas@gmail.com`:
1. **Admin access** to `/admin` (user count, today's usage, $ spend estimate, list of recent users with a lifetime toggle).
2. **Lifetime / unlimited usage** — the freemium gate skips you entirely.
3. **An "Admin" link** in the site header when signed in.

Comma-separate to add more admins:
```
ADMIN_EMAILS=stepdugas@gmail.com,missy@example.com
```

If you also set the matching `app.admin_emails` GUC in Supabase (Section 2 step 5), the SQL `is_admin()` function returns true for those emails, which is what lets the admin page read other users' profile rows under RLS.

For non-admin users you want to grant lifetime to, flip the toggle in `/admin` or run in SQL:
```sql
update public.profiles set is_lifetime = true where email = 'someone@example.com';
```

---

## 8. Freemium math — how the limits cost out

The gate in `src/lib/usage/check.ts` enforces:

| Tier | Chat msgs/day | Generates/day | Daily worst case |
|---|---|---|---|
| Guest (not signed in) | 5 | 1 | ~$0.12 |
| Free (signed in) | 20 | 3 | ~$0.46 |
| Lifetime / Admin | ∞ | ∞ | n/a |

Per-call cost estimates (Claude Sonnet 4.6, ~$3/M input / ~$15/M output):
- A chat message: ~2-3K input + 600 output ≈ **$0.012-0.020**
- A generation: ~2K input + 800 output ≈ **$0.018**

So if a free user **maxes out every day for a month** they'd cost ~$14 in API. In reality most active users will burn far less because (a) they don't hit the cap most days, and (b) caching reduces real cost. If you ever see a user spiking, flip them to paid or temporarily disable in `/admin`.

Want tighter or looser? Edit the `LIMITS` object in `src/lib/usage/limits.ts`. No DB migration needed.

---

## 9. Optional later

- **Stripe** — for paid subscriptions. Architecture supports a
  free → paid upgrade; flip `is_early_user` to grandfather.
- **OCR for "upload your own Bible photos"** — try Tesseract.js
  client-side first (free, no API); upgrade to a paid OCR API only if
  Tesseract accuracy isn't enough.
- **NIV/NASB licensing** — see section 4.
- **Public API** — already easy to expose by adding `/api/v1/*`
  routes that proxy the existing `lib/bible/*` functions.
- **Email digests** — cron job (Vercel Cron or Supabase Edge
  Functions) that emails saved notes weekly.

---

## .env.example

Drop this file into the project root, then `cp .env.example .env.local`
and fill in the keys you have.

```
# Anthropic (Section 1)
ANTHROPIC_API_KEY=

# Supabase (Section 2)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Site (Section 3)
NEXT_PUBLIC_SITE_URL=https://askscripture.com

# Admin + lifetime (Section 7) — get yourself unlimited + /admin access
ADMIN_EMAILS=stepdugas@gmail.com

# Email (Section 5)
RESEND_API_KEY=
```

---

## What's already done

- **66-book canonical registry** with USFM IDs, slugs, scholarly sections
- **10 free translations** wired via HelloAO Free Use Bible API (BSB, WEB, NET, LSV, KJV, ASV, Geneva, YLT, Darby, BBE)
- **Translation switcher** persists to localStorage and to URL `?t=` param
- **Reference parser** accepts "John 3:16", "Rom 8:28-30", "1 Cor 13", "Ps 23", etc.
- **Side-by-side comparison** at `/compare/[book]/[chapter]` with word-level diff highlighting
- **18 translation-debate entries** (`/word-study`) with original-language data and renderings
- **344,720 cross-references** from OpenBible.info, surfaced per-chapter in the study panel
- **5 reading plans** (Gospels-30, Psalms-50, Romans-14, Wisdom-21, Torah-20)
- **AI chat drawer** with 6 modes — Objective, Scholarly, Devotional, Affirming, Storytelling, Kids
- **Content generators** for personal devotional, family devotional, sermon outline
- **Quote card generator** (`/card`) producing 1200×1200 shareable PNGs via next/og
- **Settings** page with translation, theological lens, denomination, default chat mode
- **Dashboard, notes, bookmarks** pages reading from localStorage
- **Static pages**: About, Method, Sources & attribution, Privacy, Terms
- **SEO**: sitemap.xml (every book/chapter + compare + word-study + plans), robots.txt, OG image, JSON-LD ready
- **PWA**: manifest.webmanifest + monogram SVG icon
- **Supabase scaffolding**: SSR-aware client + server helpers, full SQL migration with RLS policies, signin/signup pages that gracefully degrade when env vars are missing

---

## Run it

```bash
cd ~/Desktop/askscripture
npm run dev
# → http://localhost:3000
```

That's it. Open the home page and click around.
