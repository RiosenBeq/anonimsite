-- =============================================================
--  Anonim — seed data
--  Eight topics, eight demo questions, three top answers,
--  matching the original prototype copy.
--  Demo asker UUIDs are stable so reseeding is idempotent.
-- =============================================================

insert into public.topics (slug, label, color, description, display_order, angle) values
  ('relationships', 'Relationships', 'warm',   'Love, friendships, family, distance.',     1,  20),
  ('career',        'Career',        'accent', 'Quitting, switching, stuck, ambition.',    2,  70),
  ('money',         'Money',         'lime',   'Debt, salaries, taboo, freedom.',          3, 110),
  ('mind',          'The Mind',      'violet', 'Anxiety, therapy, growth, doubt.',         4, 160),
  ('creative',      'Creative',      'accent', 'Writing, making, blocks, taste.',          5, 210),
  ('tech',          'Tech & AI',     'accent', 'Building, ethics, futures.',               6, 250),
  ('philosophy',    'Philosophy',    'violet', 'Meaning, ethics, the long view.',          7, 290),
  ('body',          'The Body',      'warm',   'Health, image, intimacy.',                 8, 330)
on conflict (slug) do nothing;

do $$
declare
  asker_a uuid := 'a1111111-1111-1111-1111-111111111111';
  asker_b uuid := 'b2222222-2222-2222-2222-222222222222';
  asker_c uuid := 'c3333333-3333-3333-3333-333333333333';
  responder_wren    uuid := 'd4444444-4444-4444-4444-444444444444';
  responder_cipher  uuid := 'e5555555-5555-5555-5555-555555555555';
  responder_quiet   uuid := 'f6666666-6666-6666-6666-666666666666';
  q1 uuid;
begin
  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'How do you tell a partner of seven years that you''ve fallen out of love — without burning the entire history down?',
    'I''ve thought about it for months. I''m not asking what to do. I''m asking how to find the words. Please be gentle.',
    'relationships', array['Tender'], 'Quiet Wren', asker_a, 12, true, 142, 488, 9400,
    now() - interval '2 hours'
  ) returning id into q1;

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'Has anyone here actually quit a six-figure job for something smaller and stayed happy?',
    '', 'career', array['Curious'], 'Slow River', asker_b, 4, false, 87, 612, 6100,
    now() - interval '5 hours'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'What''s a thing you secretly believe that you''d never say at a dinner party?',
    '', 'philosophy', array['Honest'], 'Half Light', asker_a, 28, false, 1247, 4100, 48000,
    now() - interval '1 day'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'Therapists of Anonim — what''s the one thing you wish your clients understood from session one?',
    '', 'mind', array['Grounding'], 'Open Door', asker_c, 9, false, 84, 1820, 12200,
    now() - interval '8 hours'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'Is anyone else just… not sure they want kids, and tired of pretending the question is open?',
    '', 'relationships', array['Searching'], 'North Pine', asker_b, 6, false, 318, 1540, 21000,
    now() - interval '11 hours'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'What did you spend money on in your 30s that genuinely changed your life?',
    '', 'money', array['Practical'], 'Soft Echo', asker_a, 3, false, 421, 2230, 33000,
    now() - interval '1 day'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'How do you stay creative when nobody is watching and nothing is paying?',
    '', 'creative', array['Reflective'], 'Late Reader', asker_c, 7, false, 56, 290, 3100,
    now() - interval '3 hours'
  );

  insert into public.questions (title, context, topic_slug, moods, pseudonym, asker_id, pulse, featured, answers_count, saves_count, views_count, created_at)
  values (
    'What''s a question you''ve never been able to ask anyone you know?',
    '', 'philosophy', array['Open'], 'Sand & Sea', asker_b, 41, true, 2814, 9800, 112000,
    now() - interval '4 days'
  );

  insert into public.answers (question_id, body, pseudonym, responder_id, helpfulness, upvotes, badge, honest_count, warm_count, useful_count, deep_count, created_at) values
    (q1,
     E'Don''t open with the conclusion. The conclusion is what hurts. Open with the change you''ve both already noticed but haven''t named.\n\nI rehearsed the sentence in the car for two weeks. The version I actually used was: "I think we''ve been holding our breath, and I don''t want to anymore." That gave us a door to walk through together, instead of one of us slamming it on the other.\n\nSeven years is a long history. You don''t owe each other a clean ending — only an honest one.',
     'Wren · 4y on Anonim', responder_wren, 96, 312, 'Top Answer', 84, 41, 122, 33,
     now() - interval '1 hour'),
    (q1,
     E'Couples therapist here (verified). The thing that almost always backfires is treating the conversation as a single event — "the talk." Try treating it as the start of a series of small, honest check-ins.\n\nAlso: don''t have it tired. Don''t have it hungry. Don''t have it after a fight. Most of the worst breakups I''ve witnessed had nothing to do with what was said and everything to do with when.',
     'Cipher · 11mo on Anonim', responder_cipher, 88, 184, 'Verified', 62, 35, 91, 28,
     now() - interval '3 hours'),
    (q1,
     E'I left a 9-year relationship six months ago. The thing nobody told me: grief and relief can coexist. You can be the one ending it and still be wrecked.\n\nBe ready for that. It''s not a sign you made the wrong choice.',
     'Quiet Reader · 2y on Anonim', responder_quiet, 71, 91, null, 38, 29, 41, 18,
     now() - interval '6 hours');

  update public.questions set answers_count = 142 where id = q1;
end $$;
