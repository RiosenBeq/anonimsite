-- =============================================================
--  Anonim — initial schema
--  Tables, types, indexes, denormalized-count triggers, realtime
-- =============================================================

create extension if not exists pgcrypto;

create type public.reaction_kind as enum ('honest', 'warm', 'useful', 'deep');
create type public.topic_color  as enum ('accent', 'violet', 'warm', 'lime');

-- ---------- TOPICS (reference data) ----------
create table public.topics (
  slug          text primary key,
  label         text not null,
  color         public.topic_color not null,
  description   text not null default '',
  display_order int  not null default 0,
  angle         int  not null default 0
);

-- ---------- QUESTIONS ----------
create table public.questions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null check (char_length(title) between 8 and 600),
  context       text not null default '' check (char_length(context) <= 2000),
  topic_slug    text not null references public.topics(slug),
  moods         text[] not null default '{}',
  pseudonym     text not null,
  asker_id      uuid not null default auth.uid(),
  answers_count int  not null default 0,
  saves_count   int  not null default 0,
  views_count   int  not null default 0,
  pulse         int  not null default 0,
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index questions_topic_slug_idx on public.questions(topic_slug);
create index questions_created_at_idx on public.questions(created_at desc);
create index questions_featured_idx   on public.questions(featured) where featured;
create index questions_asker_id_idx   on public.questions(asker_id);
create index questions_live_idx       on public.questions(created_at desc) where deleted_at is null;

-- ---------- ANSWERS ----------
create table public.answers (
  id            uuid primary key default gen_random_uuid(),
  question_id   uuid not null references public.questions(id) on delete cascade,
  body          text not null check (char_length(body) between 1 and 5000),
  pseudonym     text not null,
  responder_id  uuid not null default auth.uid(),
  helpfulness   int  not null default 60 check (helpfulness between 0 and 100),
  upvotes       int  not null default 0,
  badge         text,
  honest_count  int  not null default 0,
  warm_count    int  not null default 0,
  useful_count  int  not null default 0,
  deep_count    int  not null default 0,
  created_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create index answers_question_id_idx  on public.answers(question_id);
create index answers_responder_id_idx on public.answers(responder_id);

-- ---------- REACTIONS ----------
create table public.reactions (
  answer_id  uuid not null references public.answers(id) on delete cascade,
  user_id    uuid not null default auth.uid(),
  kind       public.reaction_kind not null,
  created_at timestamptz not null default now(),
  primary key (answer_id, user_id)
);

create index reactions_user_id_idx on public.reactions(user_id);

-- ---------- SAVES (bookmarks) ----------
create table public.saves (
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id     uuid not null default auth.uid(),
  created_at  timestamptz not null default now(),
  primary key (question_id, user_id)
);

create index saves_user_id_idx on public.saves(user_id);

-- ---------- TOPIC FOLLOWS ----------
create table public.topic_follows (
  topic_slug text not null references public.topics(slug),
  user_id    uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (topic_slug, user_id)
);

create index topic_follows_user_id_idx on public.topic_follows(user_id);

-- ---------- DENORMALIZED COUNTER TRIGGERS ----------

create or replace function public.bump_answers_count() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.questions set answers_count = answers_count + 1 where id = new.question_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.questions set answers_count = greatest(answers_count - 1, 0) where id = old.question_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger answers_count_trg
after insert or delete on public.answers
for each row execute function public.bump_answers_count();

create or replace function public.bump_saves_count() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.questions set saves_count = saves_count + 1 where id = new.question_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.questions set saves_count = greatest(saves_count - 1, 0) where id = old.question_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger saves_count_trg
after insert or delete on public.saves
for each row execute function public.bump_saves_count();

create or replace function public.bump_reaction_count() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  delta int;
  col   text;
  ans   uuid;
begin
  if tg_op = 'INSERT' then
    delta := 1; col := new.kind::text || '_count'; ans := new.answer_id;
  elsif tg_op = 'DELETE' then
    delta := -1; col := old.kind::text || '_count'; ans := old.answer_id;
  end if;

  execute format(
    'update public.answers set %1$I = greatest(%1$I + $1, 0) where id = $2',
    col
  ) using delta, ans;

  return coalesce(new, old);
end;
$$;

create trigger reactions_count_trg
after insert or delete on public.reactions
for each row execute function public.bump_reaction_count();

-- ---------- REALTIME PUBLICATION ----------
alter publication supabase_realtime add table public.questions;
alter publication supabase_realtime add table public.answers;
alter publication supabase_realtime add table public.reactions;
