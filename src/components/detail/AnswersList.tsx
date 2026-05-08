"use client";

import { useState } from "react";
import { AnswerBlock, type ReactionCounts } from "@/components/detail/AnswerBlock";
import { useLiveAnswerCounts } from "@/lib/supabase/realtime";
import type { Answer } from "@/lib/types";
import type { ReactionKind } from "@/lib/supabase/database.types";

interface AnswersListProps {
  questionId: string;
  answers: Answer[];
  reactionCountsById: Record<string, ReactionCounts>;
  myReactionByAnswerId: Record<string, ReactionKind>;
}

export function AnswersList({
  questionId,
  answers,
  reactionCountsById,
  myReactionByAnswerId,
}: AnswersListProps) {
  const [counts, setCounts] = useState(reactionCountsById);

  useLiveAnswerCounts(questionId, (row) => {
    setCounts((prev) => ({
      ...prev,
      [row.id]: {
        honest: row.honest_count,
        warm: row.warm_count,
        useful: row.useful_count,
        deep: row.deep_count,
      },
    }));
  });

  return (
    <div className="answers-list">
      {answers.map((a) => (
        <AnswerBlock
          key={a.id}
          answer={a}
          initialCounts={counts[a.id] ?? { honest: 0, warm: 0, useful: 0, deep: 0 }}
          initialMine={myReactionByAnswerId[a.id] ?? null}
        />
      ))}
    </div>
  );
}
