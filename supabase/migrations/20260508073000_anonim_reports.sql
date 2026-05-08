-- =============================================================
--  Anonim — content reports (5651/KVKK "Bildirim ve Kaldırma")
--  User-flagged content lands in public.reports. Reads are
--  forbidden to anon/authenticated; admin reviews via the
--  public.app_admin_list_reports RPC behind a server-side token.
-- =============================================================

do $$ begin
  create type public.report_reason as enum (
    'csam',
    'violence_threat',
    'hate_harassment',
    'self_harm',
    'illegal_activity',
    'spam_scam',
    'personal_info',
    'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_target as enum ('question', 'answer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('open', 'reviewed', 'actioned', 'dismissed');
exception when duplicate_object then null; end $$;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  target_type public.report_target not null,
  target_id uuid not null,
  reason public.report_reason not null,
  details text not null default '',
  reporter_session uuid not null,
  status public.report_status not null default 'open',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_note text not null default ''
);

create index if not exists reports_target_idx on public.reports (target_type, target_id);
create index if not exists reports_status_created_idx on public.reports (status, created_at desc);

alter table public.reports enable row level security;
-- No SELECT policy: anon/authenticated cannot read reports directly.
-- All reads go through SECURITY DEFINER RPC behind admin auth.

-- ---------- FILE A REPORT ----------
create or replace function public.app_report_content(
  p_session     uuid,
  p_target_type public.report_target,
  p_target_id   uuid,
  p_reason      public.report_reason,
  p_details     text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  rid uuid;
  recent_count int;
begin
  perform public.app_check_session(p_session);

  if char_length(coalesce(p_details, '')) > 1000 then
    raise exception 'details_too_long' using errcode = '22023';
  end if;

  if p_target_type = 'question'
     and not exists (select 1 from public.questions where id = p_target_id) then
    raise exception 'target_not_found' using errcode = '22023';
  end if;
  if p_target_type = 'answer'
     and not exists (select 1 from public.answers where id = p_target_id) then
    raise exception 'target_not_found' using errcode = '22023';
  end if;

  -- Light rate-limit so a single session cannot flood: 5 reports / hour.
  select count(*) into recent_count
    from public.reports
    where reporter_session = p_session and created_at > now() - interval '1 hour';
  if recent_count >= 5 then
    raise exception 'rate_limited' using errcode = '22023';
  end if;

  insert into public.reports (target_type, target_id, reason, details, reporter_session)
  values (p_target_type, p_target_id, p_reason, coalesce(p_details, ''), p_session)
  returning id into rid;

  return rid;
end;
$$;

revoke execute on function public.app_report_content(
  uuid, public.report_target, uuid, public.report_reason, text
) from public;
grant execute on function public.app_report_content(
  uuid, public.report_target, uuid, public.report_reason, text
) to anon, authenticated;

-- Admin reads bypass the table by using the service-role key from a
-- token-gated server route (/admin/reports). No SELECT policy is created
-- for anon/authenticated, so the publishable key cannot read reports.
