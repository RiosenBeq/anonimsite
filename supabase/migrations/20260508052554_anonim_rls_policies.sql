-- =============================================================
--  Anonim — Row Level Security
--  Anonymous-by-design: anyone can read live content. Writes go
--  through SECURITY DEFINER RPC functions; tables remain locked
--  down to direct INSERT from anon/authenticated.
-- =============================================================

alter table public.topics        enable row level security;
alter table public.questions     enable row level security;
alter table public.answers       enable row level security;
alter table public.reactions     enable row level security;
alter table public.saves         enable row level security;
alter table public.topic_follows enable row level security;

-- TOPICS — public reference data
create policy topics_select on public.topics
  for select to anon, authenticated using (true);

-- QUESTIONS
create policy questions_select on public.questions
  for select to anon, authenticated using (deleted_at is null);

create policy questions_insert on public.questions
  for insert to authenticated with check (auth.uid() = asker_id);

create policy questions_update on public.questions
  for update to authenticated
  using (auth.uid() = asker_id) with check (auth.uid() = asker_id);

create policy questions_delete on public.questions
  for delete to authenticated using (auth.uid() = asker_id);

-- ANSWERS
create policy answers_select on public.answers
  for select to anon, authenticated using (deleted_at is null);

create policy answers_insert on public.answers
  for insert to authenticated with check (auth.uid() = responder_id);

create policy answers_update on public.answers
  for update to authenticated
  using (auth.uid() = responder_id) with check (auth.uid() = responder_id);

create policy answers_delete on public.answers
  for delete to authenticated using (auth.uid() = responder_id);

-- REACTIONS — only owner sees the row, but counts are public via answers.{kind}_count
create policy reactions_select on public.reactions
  for select to authenticated using (auth.uid() = user_id);

create policy reactions_insert on public.reactions
  for insert to authenticated with check (auth.uid() = user_id);

create policy reactions_delete on public.reactions
  for delete to authenticated using (auth.uid() = user_id);

-- SAVES — private to user
create policy saves_select on public.saves
  for select to authenticated using (auth.uid() = user_id);

create policy saves_insert on public.saves
  for insert to authenticated with check (auth.uid() = user_id);

create policy saves_delete on public.saves
  for delete to authenticated using (auth.uid() = user_id);

-- TOPIC FOLLOWS — private to user
create policy topic_follows_select on public.topic_follows
  for select to authenticated using (auth.uid() = user_id);

create policy topic_follows_insert on public.topic_follows
  for insert to authenticated with check (auth.uid() = user_id);

create policy topic_follows_delete on public.topic_follows
  for delete to authenticated using (auth.uid() = user_id);
