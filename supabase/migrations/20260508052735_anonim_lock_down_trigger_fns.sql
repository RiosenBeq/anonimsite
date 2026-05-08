-- Trigger functions should only run via triggers, never as PostgREST RPC.
revoke execute on function public.bump_answers_count()  from public, anon, authenticated;
revoke execute on function public.bump_saves_count()    from public, anon, authenticated;
revoke execute on function public.bump_reaction_count() from public, anon, authenticated;
