import "server-only";

import { formatDistanceToNowStrict } from "date-fns";
import { maskBannedWords } from "@/lib/moderation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Answer, Notif, Question, Topic, TopicColor } from "@/lib/types";

const mask = (s: string): string => maskBannedWords(s).masked;

type Row<T> = T;

interface TopicRow {
  slug: string;
  label: string;
  color: TopicColor;
  description: string;
  display_order: number;
  angle: number;
}

interface QuestionRow {
  id: string;
  title: string;
  context: string;
  topic_slug: string;
  moods: string[];
  pseudonym: string;
  asker_id: string;
  answers_count: number;
  saves_count: number;
  views_count: number;
  pulse: number;
  featured: boolean;
  created_at: string;
}

interface AnswerRow {
  id: string;
  question_id: string;
  body: string;
  pseudonym: string;
  responder_id: string;
  helpfulness: number;
  upvotes: number;
  badge: string | null;
  honest_count: number;
  warm_count: number;
  useful_count: number;
  deep_count: number;
  created_at: string;
}

const ageLabel = (iso: string) =>
  formatDistanceToNowStrict(new Date(iso), { addSuffix: false })
    .replace(" hours", "h").replace(" hour", "h")
    .replace(" minutes", "m").replace(" minute", "m")
    .replace(" days", "d").replace(" day", "d")
    .replace(" months", "mo").replace(" month", "mo")
    .replace(" years", "y").replace(" year", "y")
    .replace(" seconds", "s").replace(" second", "s")
    .replace(/\s+/g, "");

const compactNumber = (n: number): string => {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) {
    const k = n / 1000;
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`;
  }
  const m = n / 1_000_000;
  return m % 1 === 0 ? `${m}m` : `${m.toFixed(1)}m`;
};

const mapTopic = (row: Row<TopicRow>): Topic => ({
  slug: row.slug,
  label: row.label,
  color: row.color,
  count: compactNumber(0),
  desc: row.description,
  angle: row.angle,
});

const summaryFor = (q: QuestionRow): string => {
  const ctx = mask(q.context ?? "");
  if (ctx.length > 0) return ctx.length > 200 ? `${ctx.slice(0, 197)}…` : ctx;
  return `A growing thread with ${compactNumber(q.answers_count)} answers and ${compactNumber(q.saves_count)} saves.`;
};

const mapQuestion = (q: Row<QuestionRow>): Question => ({
  id: q.id,
  title: mask(q.title),
  summary: summaryFor(q),
  topic: q.topic_slug,
  mood: q.moods[0] ?? "Open",
  age: ageLabel(q.created_at),
  answers: q.answers_count,
  views: compactNumber(q.views_count),
  pulse: q.pulse,
  saves: q.saves_count,
  featured: q.featured,
});

const mapAnswer = (a: Row<AnswerRow>): Answer => ({
  id: a.id,
  handle: a.pseudonym,
  helpfulness: a.helpfulness,
  age: ageLabel(a.created_at),
  upvotes: a.upvotes,
  body: mask(a.body)
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean),
  badge: a.badge ?? undefined,
});

export async function fetchTopics(): Promise<Topic[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .order("display_order", { ascending: true });

  if (error || !data) return [];

  // Pull aggregate counts per topic for the "12.4k" labels.
  const { data: counts } = await supabase
    .from("questions")
    .select("topic_slug")
    .is("deleted_at", null);

  const map = new Map<string, number>();
  (counts ?? []).forEach((r) => map.set(r.topic_slug, (map.get(r.topic_slug) ?? 0) + 1));

  return data.map((row) => ({
    ...mapTopic(row as TopicRow),
    count: compactNumber(map.get(row.slug) ?? 0),
  }));
}

export async function fetchQuestions(opts?: {
  limit?: number;
  topicSlug?: string;
  featured?: boolean;
}): Promise<Question[]> {
  const supabase = await createSupabaseServerClient();
  let q = supabase
    .from("questions")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (opts?.topicSlug) q = q.eq("topic_slug", opts.topicSlug);
  if (opts?.featured) q = q.eq("featured", true);
  if (opts?.limit) q = q.limit(opts.limit);

  const { data } = await q;
  return (data ?? []).map((row) => mapQuestion(row as QuestionRow));
}

export async function fetchTrendingQuestions(limit = 8): Promise<Question[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("questions")
    .select("*")
    .is("deleted_at", null)
    .order("pulse", { ascending: false })
    .order("answers_count", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => mapQuestion(row as QuestionRow));
}

export async function fetchFeaturedQuestion(): Promise<Question | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("questions")
    .select("*")
    .is("deleted_at", null)
    .eq("featured", true)
    .order("pulse", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return null;
  return mapQuestion(data as QuestionRow);
}

export async function fetchQuestion(id: string): Promise<Question | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();
  if (!data) return null;
  return mapQuestion(data as QuestionRow);
}

export async function fetchAnswers(questionId: string, limit = 25): Promise<Answer[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("answers")
    .select("*")
    .eq("question_id", questionId)
    .is("deleted_at", null)
    .order("badge", { ascending: false, nullsFirst: false })
    .order("helpfulness", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => mapAnswer(row as AnswerRow));
}

export async function fetchMySaves(sessionId: string | null): Promise<string[]> {
  if (!sessionId) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("app_my_saves", { p_session: sessionId });
  return (data ?? []) as string[];
}

export async function fetchMyTopicFollows(sessionId: string | null): Promise<string[]> {
  if (!sessionId) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("app_my_topic_follows", { p_session: sessionId });
  return (data ?? []) as string[];
}

export async function fetchMyReactionsForQuestion(
  sessionId: string | null,
  questionId: string,
): Promise<Record<string, "honest" | "warm" | "useful" | "deep">> {
  if (!sessionId) return {};
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("app_my_reactions_for_question", {
    p_session: sessionId,
    p_question_id: questionId,
  });
  const map: Record<string, "honest" | "warm" | "useful" | "deep"> = {};
  for (const row of (data ?? []) as { answer_id: string; kind: "honest" | "warm" | "useful" | "deep" }[]) {
    map[row.answer_id] = row.kind;
  }
  return map;
}

export async function fetchAnswerReactionCounts(
  questionId: string,
): Promise<Record<string, { honest: number; warm: number; useful: number; deep: number }>> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("answers")
    .select("id, honest_count, warm_count, useful_count, deep_count")
    .eq("question_id", questionId)
    .is("deleted_at", null);
  const map: Record<string, { honest: number; warm: number; useful: number; deep: number }> = {};
  for (const row of (data ?? []) as { id: string; honest_count: number; warm_count: number; useful_count: number; deep_count: number }[]) {
    map[row.id] = {
      honest: row.honest_count,
      warm: row.warm_count,
      useful: row.useful_count,
      deep: row.deep_count,
    };
  }
  return map;
}

// Static notification feed — kept identical to the prototype mock so the UI
// looks the same. Real-time activity feed lives in the realtime pulse hook.
export const NOTIFS_DEMO: Notif[] = [
  { kind: "answer", text: "3 new answers on a question you saved", topic: "career", time: "12m" },
  { kind: "pulse", text: 'Activity spike on "Therapists of Anonim…"', topic: "mind", time: "1h" },
  { kind: "ask", text: "Someone is waiting for an answer in The Mind", topic: "mind", time: "3h" },
  { kind: "trust", text: "Your last answer was marked helpful by 24 people", topic: null, time: "5h" },
];
