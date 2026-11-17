-- 0001_schema.sql
-- Portfolio schema, Row Level Security and Storage.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

-- ---------------------------------------------------------------------------
-- Admin allow-list. Only users listed here can modify content.
-- Rows are added manually after the owner's Auth user is created (see README).
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No policies on purpose: nobody can read or write this table through the API.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Keeps updated_at current.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Singleton tables (exactly one row each, id = 1). Saved edits are live.
-- ---------------------------------------------------------------------------
create table public.profile (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  designation text not null,
  headline text not null,
  intro text not null,
  summary text[] not null default '{}',
  career_interests text not null default '',
  email text,
  photo_path text,
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  resume_path text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- List tables. is_published = false means draft (hidden from the public).
-- ---------------------------------------------------------------------------
create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,            -- 'github', 'linkedin', 'other'...
  label text not null,
  url text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  start_date text not null,          -- display text, e.g. 'Nov 2025'
  end_date text,                     -- null = present
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  specialization text not null,
  institution text,
  graduation_year int not null,
  notes text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  icon text not null default 'code'
    check (icon in ('code','layout','server','database','brain','wrench')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories (id) on delete cascade,
  name text not null,
  level text not null default 'professional'
    check (level in ('professional','project','familiar')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  short_description text not null,
  overview text not null default '',
  problem text not null default '',
  features text[] not null default '{}',
  stack text[] not null default '{}',
  contribution text not null default '',
  implementation text[] not null default '{}',
  status text not null default 'in-development'
    check (status in ('in-development','completed','archived')),
  github_url text,
  live_url text,
  image_path text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  issued_on text,
  url text,
  file_path text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at triggers
do $$
declare t text;
begin
  foreach t in array array[
    'profile','site_settings','social_links','experiences','education',
    'skill_categories','skills','projects','certifications'
  ] loop
    execute format(
      'create trigger set_updated_at before update on public.%I
         for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

create index on public.skills (category_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
--   public (anon + authenticated): read published rows only
--   admin: full access
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  -- Tables with a draft/publish flag
  foreach t in array array[
    'social_links','experiences','education','projects','certifications'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "public reads published" on public.%I
         for select using (is_published)', t);
    execute format(
      'create policy "admin reads all" on public.%I
         for select to authenticated using (public.is_admin())', t);
    execute format(
      'create policy "admin inserts" on public.%I
         for insert to authenticated with check (public.is_admin())', t);
    execute format(
      'create policy "admin updates" on public.%I
         for update to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
    execute format(
      'create policy "admin deletes" on public.%I
         for delete to authenticated using (public.is_admin())', t);
  end loop;

  -- Always-public tables (no draft flag)
  foreach t in array array[
    'profile','site_settings','skill_categories','skills'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "public reads" on public.%I
         for select using (true)', t);
    execute format(
      'create policy "admin inserts" on public.%I
         for insert to authenticated with check (public.is_admin())', t);
    execute format(
      'create policy "admin updates" on public.%I
         for update to authenticated
         using (public.is_admin()) with check (public.is_admin())', t);
    execute format(
      'create policy "admin deletes" on public.%I
         for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- Overlapping select policies are OR-ed, so "admin reads all" lets the owner
-- see drafts in the dashboard while visitors only ever see published rows.

-- ---------------------------------------------------------------------------
-- Storage buckets (public read, admin-only write)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('resume', 'resume', true, 5242880, array['application/pdf']),
  ('project-images', 'project-images', true, 5242880,
     array['image/png','image/jpeg','image/webp']),
  ('certificates', 'certificates', true, 5242880,
     array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do nothing;

create policy "admin uploads to portfolio buckets"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('resume','project-images','certificates') and public.is_admin()
  );

create policy "admin updates portfolio files"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('resume','project-images','certificates') and public.is_admin()
  );

create policy "admin deletes portfolio files"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('resume','project-images','certificates') and public.is_admin()
  );
-- Public buckets serve files by URL without a select policy, so visitors can
-- download files but cannot list or modify bucket contents.
