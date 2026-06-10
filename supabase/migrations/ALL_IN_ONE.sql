-- AskScripture initial schema
-- Run on a fresh Supabase project after creating the project.
-- All user-data tables use Row Level Security; only the owning user can read/write.

-- =========================================================
-- Profiles (1:1 with auth.users)
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  -- preferences mirror lib/preferences/types.ts
  translation text default 'BSB',
  lens text default 'none',
  denomination text default 'none',
  default_chat_mode text default 'objective',
  daily_verse boolean default true,
  is_early_user boolean default false,  -- grandfathered free tier flag
  is_lifetime boolean default false,    -- explicitly granted lifetime access
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
  on public.profiles for update
  using (auth.uid() = id);

-- =========================================================
-- Notes
-- =========================================================
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_slug text not null,
  chapter integer not null,
  verse integer not null,
  text text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists notes_user_idx on public.notes (user_id, updated_at desc);
create index if not exists notes_ref_idx on public.notes (user_id, book_slug, chapter);

alter table public.notes enable row level security;

create policy "Notes are owned by user"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Highlights
-- =========================================================
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_slug text not null,
  chapter integer not null,
  verse integer not null,
  color text not null,
  created_at timestamptz default now(),
  unique (user_id, book_slug, chapter, verse, color)
);

create index if not exists highlights_user_idx on public.highlights (user_id, book_slug, chapter);

alter table public.highlights enable row level security;

create policy "Highlights are owned by user"
  on public.highlights for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Bookmarks
-- =========================================================
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_slug text not null,
  chapter integer not null,
  verse integer not null,
  label text,
  created_at timestamptz default now(),
  unique (user_id, book_slug, chapter, verse)
);

create index if not exists bookmarks_user_idx on public.bookmarks (user_id, created_at desc);

alter table public.bookmarks enable row level security;

create policy "Bookmarks are owned by user"
  on public.bookmarks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Reading progress
-- =========================================================
create table if not exists public.reading_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  book_slug text not null,
  chapter integer not null,
  verse integer not null,
  updated_at timestamptz default now()
);

alter table public.reading_progress enable row level security;

create policy "Progress is owned by user"
  on public.reading_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Streaks
-- =========================================================
create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current integer default 0,
  best integer default 0,
  last_read date,
  updated_at timestamptz default now()
);

alter table public.streaks enable row level security;

create policy "Streaks are owned by user"
  on public.streaks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Chat usage (for daily limits on free tier)
-- =========================================================
create table if not exists public.chat_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null,
  messages integer default 0,
  generates integer default 0,
  primary key (user_id, day)
);

alter table public.chat_usage enable row level security;

create policy "Chat usage is owned by user"
  on public.chat_usage for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- =========================================================
-- Auto-create profile on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_early_user)
  values (
    new.id,
    new.email,
    -- grandfather everyone who signed up in the first 90 days post-launch
    (now() < (select coalesce(min(created_at), now()) from auth.users) + interval '90 days')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- AskScripture migration 0002 — admin helpers
-- Adds:
--   * Admin SELECT/UPDATE policies on profiles + chat_usage so the admin page
--     can read everyone's records.
--   * A SQL function `public.grant_lifetime(target uuid, value boolean)`
--     callable by admins only.
--
-- "Admin" is defined as any auth.users row whose lowercase email is in the
-- `public.admin_emails` allowlist table. (The original 0002 design used a
-- Postgres GUC `app.admin_emails`, but hosted Supabase no longer allows
-- setting custom `app.*` GUCs at the database or role level — supautils
-- blocks `current_setting('app.admin_emails', true)`. Migration 0007
-- replaced the GUC approach with this table; this consolidated bootstrap
-- file ships the table version directly.)

-- Admin allowlist. RLS enabled with no policies + revoked grants means
-- only the table owner (postgres, via security definer functions) and
-- service_role can read or write it.
create table if not exists public.admin_emails (
  email text primary key
);
revoke all on table public.admin_emails from anon, authenticated;
alter table public.admin_emails enable row level security;

-- Seed the initial admin (must be lowercase). Add more later via:
--   insert into public.admin_emails (email) values ('other@example.com');
insert into public.admin_emails (email)
values ('stepdugas@gmail.com')
on conflict do nothing;

-- Helper: is the current auth user an admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from auth.users u
    join public.admin_emails a on lower(u.email) = a.email
    where u.id = auth.uid()
  );
$$;

-- Allow admins to read every profile (for the /admin user list)
drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Admins can update all profiles" on public.profiles;
create policy "Admins can update all profiles"
  on public.profiles for update
  using (public.is_admin());

-- Allow admins to read everyone's chat_usage (for stats)
drop policy if exists "Admins can read all chat_usage" on public.chat_usage;
create policy "Admins can read all chat_usage"
  on public.chat_usage for select
  using (public.is_admin());

-- Convenience: grant lifetime in one call
create or replace function public.grant_lifetime(target uuid, value boolean)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  update public.profiles set is_lifetime = value, updated_at = now() where id = target;
end;
$$;

-- Admin seeding is handled by the `public.admin_emails` table above —
-- no Supabase dashboard configuration required.
-- AskScripture migration 0003 — Stripe / paid tier columns
-- Adds is_pro and stripe_customer_id to profiles, plus an optional donations log.

alter table public.profiles
  add column if not exists is_pro boolean default false,
  add column if not exists stripe_customer_id text;

create index if not exists profiles_stripe_customer_idx
  on public.profiles (stripe_customer_id);

-- Optional donations log (the webhook can append here when kind=donation)
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  amount_cents integer not null,
  currency text not null default 'usd',
  stripe_session_id text,
  created_at timestamptz default now()
);

create index if not exists donations_user_idx on public.donations (user_id, created_at desc);
alter table public.donations enable row level security;

create policy "Donations are readable by donor"
  on public.donations for select
  using (auth.uid() = user_id);

create policy "Admins can read all donations"
  on public.donations for select
  using (public.is_admin());
-- AskScripture migration 0004 — lockdown
-- Closes off freemium-counter tampering, adds Stripe event idempotency,
-- and enforces uniqueness on the customer linkage.

-- =========================================================
-- chat_usage: counters cannot be edited by the user.
-- The user can still SELECT their own row (for the usage meter UI),
-- but only the increment_usage() RPC may write.
-- =========================================================

-- Drop the old permissive policy from 0001 (it allowed all CRUD).
drop policy if exists "Chat usage is owned by user" on public.chat_usage;

create policy "Chat usage readable by owner"
  on public.chat_usage for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies → users cannot write directly.
-- Writes go through increment_usage() below.

-- Atomic increment. Returns the post-increment row.
-- SECURITY DEFINER bypasses RLS so the service-role client (or any
-- authenticated session) can drive the counter through this single path.
create or replace function public.increment_usage(
  p_user_id uuid,
  p_day date,
  p_kind text
)
returns table (messages integer, generates integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind not in ('chat', 'generate') then
    raise exception 'invalid kind: %', p_kind;
  end if;

  insert into public.chat_usage (user_id, day, messages, generates)
  values (
    p_user_id,
    p_day,
    case when p_kind = 'chat' then 1 else 0 end,
    case when p_kind = 'generate' then 1 else 0 end
  )
  on conflict (user_id, day) do update set
    messages = public.chat_usage.messages + case when p_kind = 'chat' then 1 else 0 end,
    generates = public.chat_usage.generates + case when p_kind = 'generate' then 1 else 0 end
  returning public.chat_usage.messages, public.chat_usage.generates
  into messages, generates;

  return next;
end;
$$;

-- Allow signed-in users to call the RPC; gating still happens server-side
-- in lib/usage/check.ts which only calls this after the limit check passes.
grant execute on function public.increment_usage(uuid, date, text) to authenticated;
grant execute on function public.increment_usage(uuid, date, text) to service_role;

-- =========================================================
-- Stripe event idempotency
-- =========================================================
create table if not exists public.stripe_events (
  id text primary key,           -- stripe event id (evt_...)
  type text not null,
  received_at timestamptz default now()
);

alter table public.stripe_events enable row level security;
-- No policies → only service_role can read/write.

-- =========================================================
-- Profiles: customer linkage must be 1:1
-- =========================================================
create unique index if not exists profiles_stripe_customer_unique
  on public.profiles (stripe_customer_id)
  where stripe_customer_id is not null;

-- =========================================================
-- Profiles: allow user to delete their own row (GDPR papercut)
-- The auth.users delete cascades anyway, but explicit > implicit.
-- =========================================================
drop policy if exists "Profiles are deletable by owner" on public.profiles;
create policy "Profiles are deletable by owner"
  on public.profiles for delete
  using (auth.uid() = id);
-- AskScripture migration 0005 — daily shared content + cost caps
-- Adds a publicly-readable daily_content table so the free tier sees one
-- devotional / family / sermon / story per day total, not per user.
-- The cron + lazy fallback in src/lib/daily-content.ts is what writes here.

create table if not exists public.daily_content (
  day date not null,
  kind text not null check (kind in ('devotional', 'family', 'sermon', 'story')),
  ref text not null,
  content text not null,
  generated_at timestamptz default now(),
  primary key (day, kind)
);

create index if not exists daily_content_day_idx
  on public.daily_content (day desc);

alter table public.daily_content enable row level security;

-- Anyone (anonymous included) can read today's published content.
create policy "Daily content is publicly readable"
  on public.daily_content for select
  using (true);

-- No INSERT/UPDATE/DELETE policies → only service-role writes via the
-- cron route + the lazy-generation fallback.
-- AskScripture migration 0006 — lockdown writes
-- Closes the three highest-severity findings from the round-2 security audit:
--   1. Authenticated users could self-promote to Pro by writing is_pro via the
--      anon-key Supabase client.
--   2. increment_usage(p_user_id, ...) accepted any user id, enabling a
--      signed-in attacker to grief other users by pushing their counters past
--      the monthly cap.
--   3. The monthly cap was checked outside the RPC, leaving a small TOCTOU
--      race at the month boundary.

-- =========================================================
-- profiles: column-level UPDATE lockdown
-- =========================================================
-- The RLS UPDATE policy from migration 0001 lets a user UPDATE their own
-- profile row but doesn't restrict which columns. Postgres column-level
-- privilege REVOKEs are the right tool. We strip the protected billing
-- and entitlement columns from `authenticated`, then re-grant the safe
-- preference columns explicitly so the existing client code keeps working.
revoke update on public.profiles from authenticated;

grant update (
  display_name,
  translation,
  lens,
  denomination,
  default_chat_mode,
  daily_verse,
  updated_at
) on public.profiles to authenticated;

-- Admins (service-role + the is_admin() GUC path) can still touch the
-- protected fields via the existing admin policy on profiles.

-- =========================================================
-- increment_usage: caller must match p_user_id (or be admin)
-- + bake the monthly cap into the RPC so the check is atomic.
-- =========================================================
create or replace function public.increment_usage(
  p_user_id uuid,
  p_day date,
  p_kind text,
  p_chat_per_month integer default null  -- when set, return null if month cap exceeded
)
returns table (messages integer, generates integer, blocked_reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month_start date;
  v_month_count integer;
begin
  if p_kind not in ('chat', 'generate') then
    raise exception 'invalid kind: %', p_kind;
  end if;

  -- Caller must be the user themselves OR an admin.
  if p_user_id <> auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;

  -- Optional monthly cap (chat only). Returns immediately without
  -- incrementing if the user is already at or over the cap.
  if p_kind = 'chat' and p_chat_per_month is not null then
    v_month_start := date_trunc('month', p_day)::date;
    select coalesce(sum(c.messages), 0)
      into v_month_count
      from public.chat_usage c
     where c.user_id = p_user_id
       and c.day >= v_month_start;
    if v_month_count >= p_chat_per_month then
      messages := v_month_count;
      generates := 0;
      blocked_reason := 'monthly_limit';
      return next;
      return;
    end if;
  end if;

  insert into public.chat_usage (user_id, day, messages, generates)
  values (
    p_user_id,
    p_day,
    case when p_kind = 'chat' then 1 else 0 end,
    case when p_kind = 'generate' then 1 else 0 end
  )
  on conflict (user_id, day) do update set
    messages = public.chat_usage.messages + case when p_kind = 'chat' then 1 else 0 end,
    generates = public.chat_usage.generates + case when p_kind = 'generate' then 1 else 0 end
  returning public.chat_usage.messages, public.chat_usage.generates, null::text
  into messages, generates, blocked_reason;

  return next;
end;
$$;

grant execute on function public.increment_usage(uuid, date, text, integer) to authenticated;
grant execute on function public.increment_usage(uuid, date, text, integer) to service_role;

-- =========================================================
-- update_my_preferences: explicit safe-write RPC.
-- (Optional — the column-level UPDATE grant above already covers normal
-- client writes. This RPC is here so the same pattern is available if you
-- ever want to drop the GRANT and require every write to come through a
-- definer function.)
-- =========================================================
create or replace function public.update_my_preferences(
  p_translation text default null,
  p_lens text default null,
  p_denomination text default null,
  p_default_chat_mode text default null,
  p_daily_verse boolean default null,
  p_display_name text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
     set translation = coalesce(p_translation, translation),
         lens = coalesce(p_lens, lens),
         denomination = coalesce(p_denomination, denomination),
         default_chat_mode = coalesce(p_default_chat_mode, default_chat_mode),
         daily_verse = coalesce(p_daily_verse, daily_verse),
         display_name = coalesce(p_display_name, display_name),
         updated_at = now()
   where id = auth.uid();
end;
$$;

grant execute on function public.update_my_preferences(text, text, text, text, boolean, text) to authenticated;

-- =========================================================
-- daily_content retention: 90-day rolling window.
-- Run via a Supabase scheduled function or a periodic cron later; for now
-- this provides a documented purge SQL admins can run on demand.
-- =========================================================
create or replace function public.purge_old_daily_content()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_deleted integer;
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;
  with deleted as (
    delete from public.daily_content
     where day < (current_date - interval '90 days')::date
     returning 1
  )
  select count(*) into v_deleted from deleted;
  return v_deleted;
end;
$$;

grant execute on function public.purge_old_daily_content() to authenticated;
