create table mentions (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  author_name text not null,
  author_id text not null,
  message_text text not null,
  thread_id text,
  channel_name text,
  created_at timestamptz default now()
);

-- Index for platform filter
create index idx_mentions_platform on mentions(platform);

-- Index for date range queries (descending for latest-first)
create index idx_mentions_created_at on mentions(created_at desc);

-- RLS: read is public, write is service_role only
alter table mentions enable row level security;

create policy "Anyone can read mentions"
  on mentions for select
  to anon, authenticated
  using (true);
