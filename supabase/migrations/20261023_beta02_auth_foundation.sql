-- DIVE Commercial Planner — BETA-02A Authentication Foundation
-- Run once in Supabase SQL Editor for the beta project.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'TESTER' check (role in ('ADMIN', 'TESTER', 'USER')),
  status text not null default 'INVITED' check (status in ('INVITED', 'ACTIVE', 'SUSPENDED')),
  beta_terms_version text,
  beta_terms_accepted_at timestamptz,
  telemetry_consent boolean not null default false,
  telemetry_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on public.profiles from anon;
revoke insert, update, delete on public.profiles from authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role, status)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'name', ''),
    'TESTER',
    'INVITED'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.activate_current_tester()
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
begin
  update public.profiles
  set
    status = case when status = 'INVITED' then 'ACTIVE' else status end,
    updated_at = now()
  where id = auth.uid()
  returning * into result;

  return result;
end;
$$;

revoke all on function public.activate_current_tester() from public;
grant execute on function public.activate_current_tester() to authenticated;

commit;
