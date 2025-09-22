-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  birth_year int,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Games table
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  description text,
  difficulty text default 'medium',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Game sessions per play attempt
create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  game_id uuid references public.games(id) on delete cascade,
  score integer not null,
  duration_seconds integer,
  accuracy numeric,
  metadata jsonb,
  played_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists game_sessions_user_id_idx on public.game_sessions(user_id);
create index if not exists game_sessions_game_id_idx on public.game_sessions(game_id);

-- Achievements
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  description text,
  requirement jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- User achievements junction
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  unlocked_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists user_achievements_user_id_idx on public.user_achievements(user_id);
create unique index if not exists user_achievements_unique_idx on public.user_achievements(user_id, achievement_id);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.game_sessions enable row level security;
alter table public.user_achievements enable row level security;

create policy "profiles are editable by owner" on public.profiles
  for all using (auth.uid() = id);

create policy "game sessions are selectable" on public.game_sessions
  for select using (true);

create policy "insert own game session" on public.game_sessions
  for insert with check (auth.uid() = user_id);

create policy "user can view own achievements" on public.user_achievements
  for select using (auth.uid() = user_id);

create policy "user can insert own achievements" on public.user_achievements
  for insert with check (auth.uid() = user_id);
