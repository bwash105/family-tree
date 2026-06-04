-- profiles: one row per auth user, auto-created by trigger
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  person_id   uuid,
  created_at  timestamptz default now() not null
);
alter table public.profiles enable row level security;
create policy "Authenticated can view all profiles"
  on public.profiles for select to authenticated using (true);
create policy "Users insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

-- people: every family member (may or may not have an account)
create table public.people (
  id              uuid primary key default gen_random_uuid(),
  full_name       text not null,
  birth_date      date,
  death_date      date,
  birthplace      text,
  bio             text,
  cover_photo_url text,
  added_by        uuid references public.profiles(id) on delete set null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);
alter table public.people enable row level security;
create policy "Authenticated can view all people"
  on public.people for select to authenticated using (true);
create policy "Authenticated can insert people"
  on public.people for insert to authenticated with check (true);
create policy "Authenticated can update people"
  on public.people for update to authenticated using (true);

-- add FK from profiles to people (after people table exists)
alter table public.profiles
  add constraint profiles_person_id_fkey
  foreign key (person_id) references public.people(id) on delete set null;

-- relationships: directed edges between people
-- parent_child: person_a_id = parent, person_b_id = child
-- spouse: order arbitrary
create table public.relationships (
  id                uuid primary key default gen_random_uuid(),
  person_a_id       uuid not null references public.people(id) on delete cascade,
  person_b_id       uuid not null references public.people(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('parent_child', 'spouse')),
  added_by          uuid references public.profiles(id) on delete set null,
  created_at        timestamptz default now() not null,
  constraint no_self_relationship check (person_a_id <> person_b_id),
  constraint unique_relationship unique (person_a_id, person_b_id, relationship_type)
);
alter table public.relationships enable row level security;
create policy "Authenticated can view all relationships"
  on public.relationships for select to authenticated using (true);
create policy "Authenticated can insert relationships"
  on public.relationships for insert to authenticated with check (true);
create policy "Authenticated can delete relationships"
  on public.relationships for delete to authenticated using (true);

-- heritage_notes: stories and facts about a person
create table public.heritage_notes (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references public.people(id) on delete cascade,
  title       text not null,
  body        text not null,
  added_by    uuid references public.profiles(id) on delete set null,
  created_at  timestamptz default now() not null
);
alter table public.heritage_notes enable row level security;
create policy "Authenticated can view all heritage notes"
  on public.heritage_notes for select to authenticated using (true);
create policy "Authenticated can insert heritage notes"
  on public.heritage_notes for insert to authenticated with check (true);
create policy "Authors can delete own heritage notes"
  on public.heritage_notes for delete to authenticated
  using (auth.uid() = added_by);

-- updated_at trigger for people
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger people_updated_at
  before update on public.people
  for each row execute function public.handle_updated_at();

-- auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
