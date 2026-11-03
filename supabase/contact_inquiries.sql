-- Run this in the Supabase SQL Editor to create the private inquiry table.
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  service text not null,
  description text not null,
  budget text
);

alter table public.contact_inquiries enable row level security;
revoke all on table public.contact_inquiries from anon, authenticated;
grant insert on table public.contact_inquiries to service_role;
