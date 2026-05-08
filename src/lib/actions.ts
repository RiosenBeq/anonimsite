"use server";

import { revalidatePath } from "next/cache";
import { ensureAnonimSession } from "@/lib/session";
import { generatePseudonym } from "@/lib/pseudonyms";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  askQuestionSchema,
  postAnswerSchema,
  reactSchema,
  toggleFollowSchema,
  toggleSaveSchema,
  type AskQuestionInput,
  type PostAnswerInput,
  type ReactInput,
  type ToggleFollowInput,
  type ToggleSaveInput,
} from "@/lib/validators";

export type ActionResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

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

  const { data, error } = await supabase.rpc("app_ask_question", {
    p_session: session,
    p_title: parsed.data.title,
    p_context: parsed.data.context ?? "",
    p_topic_slug: parsed.data.topicSlug,
    p_moods: parsed.data.moods,
    p_pseudonym: pseudonym,
  });

  if (error || !data) return { ok: false, error: error?.message ?? "Could not ask question" };

  revalidatePath("/feed");
  revalidatePath("/explore");
  revalidatePath("/");
  return { ok: true, data: { questionId: data as unknown as string } };
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

  const { data, error } = await supabase.rpc("app_post_answer", {
    p_session: session,
    p_question_id: parsed.data.questionId,
    p_body: parsed.data.body,
    p_pseudonym: pseudonym,
  });

  if (error || !data) return { ok: false, error: error?.message ?? "Could not post answer" };

  revalidatePath(`/q/${parsed.data.questionId}`);
  return { ok: true, data: { answerId: data as unknown as string } };
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
