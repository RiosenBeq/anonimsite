import { z } from "zod";

export const askQuestionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(8, "A bit more, please.")
    .max(600, "That's a long question — try trimming it."),
  context: z.string().max(2000, "The context is over 2000 characters.").optional().default(""),
  topicSlug: z.string().min(1, "Pick a room."),
  moods: z.array(z.string()).max(3, "Up to 3 moods.").default([]),
});

export type AskQuestionInput = z.infer<typeof askQuestionSchema>;

export const postAnswerSchema = z.object({
  questionId: z.uuid(),
  body: z
    .string()
    .trim()
    .min(1, "Write something.")
    .max(5000, "That's longer than this thread allows."),
});

export type PostAnswerInput = z.infer<typeof postAnswerSchema>;

export const reactionKindSchema = z.enum(["honest", "warm", "useful", "deep"]);
export type ReactionKindInput = z.infer<typeof reactionKindSchema>;

export const reactSchema = z.object({
  answerId: z.uuid(),
  kind: reactionKindSchema,
});
export type ReactInput = z.infer<typeof reactSchema>;

export const toggleSaveSchema = z.object({ questionId: z.uuid() });
export type ToggleSaveInput = z.infer<typeof toggleSaveSchema>;

export const toggleFollowSchema = z.object({ topicSlug: z.string().min(1) });
export type ToggleFollowInput = z.infer<typeof toggleFollowSchema>;

export const reportReasonSchema = z.enum([
  "csam",
  "violence_threat",
  "hate_harassment",
  "self_harm",
  "illegal_activity",
  "spam_scam",
  "personal_info",
  "other",
]);
export type ReportReasonInput = z.infer<typeof reportReasonSchema>;

export const reportContentSchema = z.object({
  targetType: z.enum(["question", "answer"]),
  targetId: z.uuid(),
  reason: reportReasonSchema,
  details: z.string().max(1000).optional().default(""),
});
export type ReportContentInput = z.infer<typeof reportContentSchema>;
