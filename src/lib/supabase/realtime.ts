"use client";

import { useEffect, useRef, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

interface NewQuestionEvent {
  id: string;
  title: string;
  topic_slug: string;
  pseudonym: string;
  created_at: string;
}

/**
 * Subscribe to live new-question events. Used by the landing-page ticker
 * so it shows real activity instead of canned strings.
 */
export function useLiveQuestions(onInsert: (q: NewQuestionEvent) => void) {
  const cb = useRef(onInsert);

  useEffect(() => {
    cb.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel("anonim-questions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "questions" },
        (payload) => {
          const row = payload.new as NewQuestionEvent;
          cb.current(row);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

interface AnswerCountUpdate {
  id: string;
  honest_count: number;
  warm_count: number;
  useful_count: number;
  deep_count: number;
  upvotes: number;
}

/**
 * Subscribe to per-thread answer-count updates so reactions tally live
 * across every reader of the same question.
 */
export function useLiveAnswerCounts(
  questionId: string,
  onUpdate: (a: AnswerCountUpdate) => void,
) {
  const cb = useRef(onUpdate);

  useEffect(() => {
    cb.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`anonim-answers-${questionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "answers",
          filter: `question_id=eq.${questionId}`,
        },
        (payload) => cb.current(payload.new as AnswerCountUpdate),
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "answers",
          filter: `question_id=eq.${questionId}`,
        },
        (payload) => cb.current(payload.new as AnswerCountUpdate),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);
}

/** Lightweight presence — number of readers currently in a thread. */
export function useThreadPresence(questionId: string, fallback = 12): number {
  const [count, setCount] = useState(fallback);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel(`anonim-presence-${questionId}`, {
      config: { presence: { key: crypto.randomUUID() } },
    });
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ at: Date.now() });
        }
      });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);

  return count;
}
