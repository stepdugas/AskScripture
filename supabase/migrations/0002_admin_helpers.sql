-- AskScripture migration 0002 — admin helpers
-- Adds:
--   * Admin SELECT/UPDATE policies on profiles + chat_usage so the admin page
--     can read everyone's records.
--   * A SQL function `public.grant_lifetime(target uuid, value boolean)`
--     callable by admins only.
--
-- "Admin" is defined as any auth.users row whose email is in the
-- `app.admin_emails` GUC. The GUC is set per session by the app at sign-in.
-- For now we also allow Supabase Edge superusers via the service_role key.

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
    where u.id = auth.uid()
      and lower(u.email) = any (
        coalesce(
          string_to_array(
            lower(current_setting('app.admin_emails', true)),
            ','
          ),
          array[]::text[]
        )
      )
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

-- IMPORTANT: in the Supabase dashboard, set the GUC so is_admin() works:
--   Settings → Database → Custom Postgres Config
--   Add:  app.admin_emails = 'stepdugas@gmail.com,other@example.com'
-- (comma-separated, lowercase)
