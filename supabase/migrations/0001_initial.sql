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
