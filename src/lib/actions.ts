"use server";

import { revalidatePath } from "next/cache";
import { maskBannedWords } from "@/lib/moderation";
import { ensureAnonimSession } from "@/lib/session";
import { generatePseudonym } from "@/lib/pseudonyms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

// ---------------- ASK QUESTION ----------------
export async function askQuestionAction(
  input: AskQuestionInput,
): Promise<ActionResult<{ questionId: string }>> {
  const parsed = askQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
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

  if (error || !data) return { ok: false, error: error?.message ?? "Could not ask question" };

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

  if (error || !data) return { ok: false, error: error?.message ?? "Could not post answer" };

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

  if (error || !data) return { ok: false, error: error?.message ?? "Could not file report" };
  return { ok: true, data: { reportId: data as unknown as string } };
}
