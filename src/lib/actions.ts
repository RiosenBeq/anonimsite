"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { maskBannedWords } from "@/lib/moderation";
import { ensureAnonimSession } from "@/lib/session";
import { generatePseudonym } from "@/lib/pseudonyms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { verifyTurnstile } from "@/lib/turnstile";
import {
  askQuestionSchema,
  postAnswerSchema,
  reactSchema,
  reportContentSchema,
  toggleFollowSchema,
  toggleSaveSchema,
  type AskQuestionInput,
  type PostAnswerInput,
  type ReactInput,
  type ReportContentInput,
  type ToggleFollowInput,
  type ToggleSaveInput,
} from "@/lib/validators";

export type ActionResult<T = unknown> =
  | { ok: true; data: T; warning?: string }
  | { ok: false; error: string };

const MASK_WARNING_TR =
  "Bazı kelimeler topluluk kuralları gereği maskelendi (cinayet/uyuşturucu/şiddet vb. ifadeler).";

// Forms render with a `renderedAt` timestamp; submissions in less than
// this many ms are treated as bot-driven.
const MIN_FILL_MS = 1500;

interface AntiAbuseInput {
  hp?: string;
  renderedAt?: number;
  turnstileToken?: string;
}

interface AntiAbuseDecision {
  silentlyDrop: boolean; // honeypot tripped — pretend success
  reject?: string; // user-visible error message (Turnstile failure, etc.)
}

async function evaluateAntiAbuse(input: AntiAbuseInput): Promise<AntiAbuseDecision> {
  if ((input.hp ?? "").trim().length > 0) {
    return { silentlyDrop: true };
  }
  if (typeof input.renderedAt === "number" && Date.now() - input.renderedAt < MIN_FILL_MS) {
    return { silentlyDrop: true };
  }
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    (await headers()).get("x-real-ip") ??
    undefined;
  const t = await verifyTurnstile(input.turnstileToken, ip);
  if (!t.ok) {
    return {
      silentlyDrop: false,
      reject: "Bot doğrulaması başarısız oldu. Sayfayı yenileyip tekrar dener misin?",
    };
  }
  return { silentlyDrop: false };
}

// Maps Postgres RPC error messages (raised via `errcode = '22023'`) to
// Turkish user-facing strings. Falls back to the raw error if unknown.
function rpcErrorToTr(message: string | undefined): string {
  switch (message) {
    case "rate_limited_hour":
      return "Saatlik gönderim limitine ulaştın. Bir süre sonra tekrar dener misin?";
    case "rate_limited_minute":
      return "Çok hızlı gidiyorsun — bir dakika sonra tekrar dene.";
    case "duplicate_title":
      return "Bu başlığı son 24 saatte zaten gönderdin.";
    case "duplicate_body":
      return "Bu cevabı son 24 saatte zaten yazdın.";
    case "rate_limited":
      return "Çok fazla rapor gönderdin, biraz bekle.";
    default:
      return message ?? "Bir şeyler ters gitti.";
  }
}

// ---------------- ASK QUESTION ----------------
export async function askQuestionAction(
  input: AskQuestionInput,
): Promise<ActionResult<{ questionId: string }>> {
  const parsed = askQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const ab = await evaluateAntiAbuse(parsed.data);
  if (ab.silentlyDrop) {
    // Pretend success so bots can't probe what tripped the trap.
    return { ok: true, data: { questionId: "" } };
  }
  if (ab.reject) {
    return { ok: false, error: ab.reject };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();
  const pseudonym = generatePseudonym();

  const titleMask = maskBannedWords(parsed.data.title);
  const contextMask = maskBannedWords(parsed.data.context ?? "");
  const masked = titleMask.hits.length + contextMask.hits.length > 0;

  const { data, error } = await supabase.rpc("app_ask_question", {
    p_session: session,
    p_title: titleMask.masked,
    p_context: contextMask.masked,
    p_topic_slug: parsed.data.topicSlug,
    p_moods: parsed.data.moods,
    p_pseudonym: pseudonym,
  });

  if (error || !data) return { ok: false, error: rpcErrorToTr(error?.message) };

  revalidatePath("/feed");
  revalidatePath("/explore");
  revalidatePath("/");
  return {
    ok: true,
    data: { questionId: data as unknown as string },
    ...(masked ? { warning: MASK_WARNING_TR } : {}),
  };
}

// ---------------- POST ANSWER ----------------
export async function postAnswerAction(
  input: PostAnswerInput,
): Promise<ActionResult<{ answerId: string }>> {
  const parsed = postAnswerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const ab = await evaluateAntiAbuse(parsed.data);
  if (ab.silentlyDrop) {
    return { ok: true, data: { answerId: "" } };
  }
  if (ab.reject) {
    return { ok: false, error: ab.reject };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();
  const pseudonym = generatePseudonym();

  const bodyMask = maskBannedWords(parsed.data.body);

  const { data, error } = await supabase.rpc("app_post_answer", {
    p_session: session,
    p_question_id: parsed.data.questionId,
    p_body: bodyMask.masked,
    p_pseudonym: pseudonym,
  });

  if (error || !data) return { ok: false, error: rpcErrorToTr(error?.message) };

  revalidatePath(`/q/${parsed.data.questionId}`);
  return {
    ok: true,
    data: { answerId: data as unknown as string },
    ...(bodyMask.hits.length > 0 ? { warning: MASK_WARNING_TR } : {}),
  };
}

// ---------------- TOGGLE REACTION ----------------
export async function toggleReactionAction(
  input: ReactInput,
): Promise<ActionResult<{ kind: ReactInput["kind"] | null }>> {
  const parsed = reactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("app_toggle_reaction", {
    p_session: session,
    p_answer_id: parsed.data.answerId,
    p_kind: parsed.data.kind,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { kind: (data ?? null) as ReactInput["kind"] | null } };
}

// ---------------- TOGGLE SAVE ----------------
export async function toggleSaveAction(
  input: ToggleSaveInput,
): Promise<ActionResult<{ saved: boolean }>> {
  const parsed = toggleSaveSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("app_toggle_save", {
    p_session: session,
    p_question_id: parsed.data.questionId,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/q/${parsed.data.questionId}`);
  return { ok: true, data: { saved: Boolean(data) } };
}

// ---------------- TOGGLE TOPIC FOLLOW ----------------
export async function toggleTopicFollowAction(
  input: ToggleFollowInput,
): Promise<ActionResult<{ following: boolean }>> {
  const parsed = toggleFollowSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("app_toggle_topic_follow", {
    p_session: session,
    p_topic_slug: parsed.data.topicSlug,
  });

  if (error) return { ok: false, error: error.message };
  revalidatePath("/feed");
  return { ok: true, data: { following: Boolean(data) } };
}

// ---------------- REGISTER VIEW ----------------
export async function registerViewAction(questionId: string): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.rpc("app_register_view", { p_question_id: questionId });
  } catch {
    // best-effort; view-counter is not critical
  }
}

// ---------------- REPORT CONTENT ----------------
export async function reportContentAction(
  input: ReportContentInput,
): Promise<ActionResult<{ reportId: string }>> {
  const parsed = reportContentSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const session = await ensureAnonimSession();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.rpc("app_report_content", {
    p_session: session,
    p_target_type: parsed.data.targetType,
    p_target_id: parsed.data.targetId,
    p_reason: parsed.data.reason,
    p_details: parsed.data.details ?? "",
  });

  if (error || !data) return { ok: false, error: rpcErrorToTr(error?.message) };
  return { ok: true, data: { reportId: data as unknown as string } };
}
