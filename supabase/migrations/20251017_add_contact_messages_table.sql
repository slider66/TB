create extension if not exists "pgcrypto";

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  source text,
  metadata jsonb
);

alter table public.contact_messages enable row level security;
