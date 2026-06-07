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
