-- =============================================================
--  Anonim — application RPC layer
--  All writes go through SECURITY DEFINER functions that take
--  the visitor's anonymous session UUID (held in an HTTP-only
--  cookie) as the first argument. Reads still go through PostgREST
--  with the standard RLS policies.
-- =============================================================

create or replace function public.app_check_session(p_session uuid)
returns void
language plpgsql immutable as $$
begin
  if p_session is null then
    raise exception 'session_required' using errcode = '22023';
  end if;
end;
$$;

revoke execute on function public.app_check_session(uuid) from public;
grant   execute on function public.app_check_session(uuid) to anon, authenticated;

-- ---------- ASK QUESTION ----------
create or replace function public.app_ask_question(
  p_session    uuid,
  p_title      text,
  p_context    text,
  p_topic_slug text,
  p_moods      text[],
  p_pseudonym  text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  qid uuid;
begin
  perform public.app_check_session(p_session);

  if char_length(coalesce(p_title, '')) < 8 or char_length(p_title) > 600 then
    raise exception 'invalid_title' using errcode = '22023';
  end if;
  if not exists (select 1 from public.topics where slug = p_topic_slug) then
    raise exception 'invalid_topic' using errcode = '22023';
  end if;
  if char_length(coalesce(p_context, '')) > 2000 then
    raise exception 'context_too_long' using errcode = '22023';
  end if;
  if char_length(coalesce(p_pseudonym, '')) < 2 or char_length(p_pseudonym) > 60 then
    raise exception 'invalid_pseudonym' using errcode = '22023';
  end if;

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id)
  values (p_title, coalesce(p_context, ''), p_topic_slug, coalesce(p_moods, '{}'),
          p_pseudonym, p_session)
  returning id into qid;

  return qid;
end;
$$;

revoke execute on function public.app_ask_question(uuid, text, text, text, text[], text) from public;
grant   execute on function public.app_ask_question(uuid, text, text, text, text[], text) to anon, authenticated;

-- ---------- POST ANSWER ----------
create or replace function public.app_post_answer(
  p_session     uuid,
  p_question_id uuid,
  p_body        text,
  p_pseudonym   text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  aid uuid;
begin
  perform public.app_check_session(p_session);

  if char_length(coalesce(p_body, '')) < 1 or char_length(p_body) > 5000 then
    raise exception 'invalid_body' using errcode = '22023';
  end if;
  if not exists (select 1 from public.questions where id = p_question_id and deleted_at is null) then
    raise exception 'question_not_found' using errcode = '22023';
  end if;
  if char_length(coalesce(p_pseudonym, '')) < 2 or char_length(p_pseudonym) > 60 then
    raise exception 'invalid_pseudonym' using errcode = '22023';
  end if;

  insert into public.answers (question_id, body, pseudonym, responder_id)
  values (p_question_id, p_body, p_pseudonym, p_session)
  returning id into aid;

  return aid;
end;
$$;

revoke execute on function public.app_post_answer(uuid, uuid, text, text) from public;
grant   execute on function public.app_post_answer(uuid, uuid, text, text) to anon, authenticated;

-- ---------- TOGGLE REACTION ----------
create or replace function public.app_toggle_reaction(
  p_session   uuid,
  p_answer_id uuid,
  p_kind      public.reaction_kind
) returns public.reaction_kind
language plpgsql security definer set search_path = '' as $$
declare
  existing public.reaction_kind;
begin
  perform public.app_check_session(p_session);

  if not exists (select 1 from public.answers where id = p_answer_id and deleted_at is null) then
    raise exception 'answer_not_found' using errcode = '22023';
  end if;

  select kind into existing from public.reactions
   where answer_id = p_answer_id and user_id = p_session;

  if existing is null then
    insert into public.reactions (answer_id, user_id, kind)
    values (p_answer_id, p_session, p_kind);
    return p_kind;
  elsif existing = p_kind then
    delete from public.reactions where answer_id = p_answer_id and user_id = p_session;
    return null;
  else
    update public.reactions set kind = p_kind, created_at = now()
     where answer_id = p_answer_id and user_id = p_session;
    execute format('update public.answers set %I = greatest(%I - 1, 0) where id = $1',
                   existing::text || '_count', existing::text || '_count')
      using p_answer_id;
    execute format('update public.answers set %I = %I + 1 where id = $1',
                   p_kind::text || '_count', p_kind::text || '_count')
      using p_answer_id;
    return p_kind;
  end if;
end;
$$;

revoke execute on function public.app_toggle_reaction(uuid, uuid, public.reaction_kind) from public;
grant   execute on function public.app_toggle_reaction(uuid, uuid, public.reaction_kind) to anon, authenticated;

-- ---------- TOGGLE SAVE ----------
create or replace function public.app_toggle_save(
  p_session     uuid,
  p_question_id uuid
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  hit boolean;
begin
  perform public.app_check_session(p_session);

  if not exists (select 1 from public.questions where id = p_question_id and deleted_at is null) then
    raise exception 'question_not_found' using errcode = '22023';
  end if;

  select true into hit from public.saves
   where question_id = p_question_id and user_id = p_session;

  if hit is true then
    delete from public.saves where question_id = p_question_id and user_id = p_session;
    return false;
  end if;

  insert into public.saves (question_id, user_id) values (p_question_id, p_session)
  on conflict do nothing;
  return true;
end;
$$;

revoke execute on function public.app_toggle_save(uuid, uuid) from public;
grant   execute on function public.app_toggle_save(uuid, uuid) to anon, authenticated;

-- ---------- TOGGLE TOPIC FOLLOW ----------
create or replace function public.app_toggle_topic_follow(
  p_session    uuid,
  p_topic_slug text
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  hit boolean;
begin
  perform public.app_check_session(p_session);

  if not exists (select 1 from public.topics where slug = p_topic_slug) then
    raise exception 'invalid_topic' using errcode = '22023';
  end if;

  select true into hit from public.topic_follows
   where topic_slug = p_topic_slug and user_id = p_session;

  if hit is true then
    delete from public.topic_follows where topic_slug = p_topic_slug and user_id = p_session;
    return false;
  end if;

  insert into public.topic_follows (topic_slug, user_id) values (p_topic_slug, p_session)
  on conflict do nothing;
  return true;
end;
$$;

revoke execute on function public.app_toggle_topic_follow(uuid, text) from public;
grant   execute on function public.app_toggle_topic_follow(uuid, text) to anon, authenticated;

-- ---------- VIEW INCREMENT ----------
create or replace function public.app_register_view(p_question_id uuid)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  update public.questions set views_count = views_count + 1
   where id = p_question_id and deleted_at is null;
end;
$$;

revoke execute on function public.app_register_view(uuid) from public;
grant   execute on function public.app_register_view(uuid) to anon, authenticated;

-- ---------- QUERY HELPERS ----------
create or replace function public.app_my_saves(p_session uuid)
returns setof uuid
language sql security definer set search_path = '' stable as $$
  select question_id from public.saves where user_id = p_session;
$$;

revoke execute on function public.app_my_saves(uuid) from public;
grant   execute on function public.app_my_saves(uuid) to anon, authenticated;

create or replace function public.app_my_topic_follows(p_session uuid)
returns setof text
language sql security definer set search_path = '' stable as $$
  select topic_slug from public.topic_follows where user_id = p_session;
$$;

revoke execute on function public.app_my_topic_follows(uuid) from public;
grant   execute on function public.app_my_topic_follows(uuid) to anon, authenticated;

create or replace function public.app_my_reactions_for_question(p_session uuid, p_question_id uuid)
returns table (answer_id uuid, kind public.reaction_kind)
language sql security definer set search_path = '' stable as $$
  select r.answer_id, r.kind
    from public.reactions r
    join public.answers a on a.id = r.answer_id
   where a.question_id = p_question_id and r.user_id = p_session;
$$;

revoke execute on function public.app_my_reactions_for_question(uuid, uuid) from public;
grant   execute on function public.app_my_reactions_for_question(uuid, uuid) to anon, authenticated;
