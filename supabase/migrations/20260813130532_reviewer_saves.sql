-- Durable LET Reviewer saves, keyed by a client-generated device_id.
-- RLS is enabled. Without Auth, anon/authenticated can read/write this table
-- so a phone PWA can persist progress. Tighten these policies after enabling
-- email or anonymous Auth (match rows to auth.uid() instead).

create table public.reviewer_saves (
  id bigint generated always as identity primary key,
  device_id text not null unique,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index reviewer_saves_updated_at_idx on public.reviewer_saves (updated_at desc);

alter table public.reviewer_saves enable row level security;

grant select, insert, update on table public.reviewer_saves to anon, authenticated;
grant usage, select on sequence public.reviewer_saves_id_seq to anon, authenticated;

create policy "anon can select reviewer_saves"
on public.reviewer_saves
for select
to anon, authenticated
using (true);

create policy "anon can insert reviewer_saves"
on public.reviewer_saves
for insert
to anon, authenticated
with check (true);

create policy "anon can update reviewer_saves"
on public.reviewer_saves
for update
to anon, authenticated
using (true)
with check (true);
