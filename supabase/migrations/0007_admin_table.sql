-- AskScripture migration 0007 — table-based admin check
--
-- Hosted Supabase no longer allows setting custom `app.*` GUCs at the
-- database or role level (blocked by supautils: "permission denied to
-- set parameter"), so the GUC approach from 0002 doesn't work in
-- production. This migration replaces it with a dedicated table.
--
-- APPLIED TO PRODUCTION 2026-06-10 via SQL Editor.

-- Admin allowlist. RLS enabled with no policies + revoked grants means
-- only the table owner (postgres, via security definer functions) and
-- service_role can read or write it.
create table if not exists public.admin_emails (
  email text primary key
);

revoke all on table public.admin_emails from anon, authenticated;
alter table public.admin_emails enable row level security;

-- Seed the admin (lowercase).
insert into public.admin_emails (email)
values ('stepdugas@gmail.com')
on conflict do nothing;

-- Replace the GUC-based is_admin() from 0002. Same signature, so all
-- existing policies and functions keep working unchanged.
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

-- To add another admin later, run as service_role / SQL editor:
--   insert into public.admin_emails (email) values ('other@example.com');
