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
