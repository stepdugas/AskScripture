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
