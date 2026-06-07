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
