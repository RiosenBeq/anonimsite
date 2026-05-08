-- =============================================================
--  Anonim — anti-abuse layer inside the existing RPC functions
--  · Per-session rate limits: 10 questions/hour & 3/minute,
--    30 answers/hour
--  · 24h duplicate-content guard on questions (title) and
--    answers (body) per session
-- =============================================================

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
  recent_hour int;
  recent_min int;
  duplicate_count int;
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

  -- Rate limits: 10/hour and 3/minute (race-safe inside the RPC)
  select count(*) into recent_hour
    from public.questions
    where asker_id = p_session and created_at > now() - interval '1 hour';
  if recent_hour >= 10 then
    raise exception 'rate_limited_hour' using errcode = '22023';
  end if;

  select count(*) into recent_min
    from public.questions
    where asker_id = p_session and created_at > now() - interval '1 minute';
  if recent_min >= 3 then
    raise exception 'rate_limited_minute' using errcode = '22023';
  end if;

  -- Duplicate-title guard (24h, same session)
  select count(*) into duplicate_count
    from public.questions
    where asker_id = p_session
      and title = p_title
      and created_at > now() - interval '24 hours';
  if duplicate_count >= 1 then
    raise exception 'duplicate_title' using errcode = '22023';
  end if;

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id)
  values (p_title, coalesce(p_context, ''), p_topic_slug, coalesce(p_moods, '{}'),
          p_pseudonym, p_session)
  returning id into qid;

  return qid;
end;
$$;

create or replace function public.app_post_answer(
  p_session     uuid,
  p_question_id uuid,
  p_body        text,
  p_pseudonym   text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  aid uuid;
  recent_hour int;
  duplicate_count int;
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

  -- Rate limit: 30 answers/hour
  select count(*) into recent_hour
    from public.answers
    where responder_id = p_session and created_at > now() - interval '1 hour';
  if recent_hour >= 30 then
    raise exception 'rate_limited_hour' using errcode = '22023';
  end if;

  -- Duplicate-body guard (24h, same session, any thread)
  select count(*) into duplicate_count
    from public.answers
    where responder_id = p_session
      and body = p_body
      and created_at > now() - interval '24 hours';
  if duplicate_count >= 1 then
    raise exception 'duplicate_body' using errcode = '22023';
  end if;

  insert into public.answers (question_id, body, pseudonym, responder_id)
  values (p_question_id, p_body, p_pseudonym, p_session)
  returning id into aid;

  return aid;
end;
$$;
