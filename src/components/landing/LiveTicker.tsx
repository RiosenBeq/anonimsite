"use client";

import { useEffect, useState } from "react";
import { PulseDot } from "@/components/primitives";
import { useLiveQuestions } from "@/lib/supabase/realtime";

interface TickerItem {
  who: string;
  what: string;
  time: string;
  topic?: string;
}

const FALLBACK: TickerItem[] = [
  { who: "Someone in Berlin", what: "asked in The Mind", time: "now" },
  { who: "An anonymous reader", what: "saved a question", time: "2s" },
  { who: "Wren", what: "answered in Career", time: "4s" },
  { who: "8 people", what: "are typing answers", time: "now" },
  { who: "A new question", what: "is gaining momentum", time: "6s" },
];

export function LiveTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK);
  const [i, setI] = useState(0);

  useLiveQuestions((q) => {
    setItems((prev) =>
      [
        {
          who: q.pseudonym,
          what: `asked in #${q.topic_slug}`,
          time: "now",
          topic: q.topic_slug,
        },
        ...prev,
      ].slice(0, 12),
    );
    setI(0);
  });

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 2400);
    return () => clearInterval(t);
  }, [items.length]);

  const cur = items[i] ?? FALLBACK[0];
  return (
    <div className="ticker">
      <PulseDot />
      <span className="ticker-text">
        <strong>{cur.who}</strong> {cur.what}
        <span className="ticker-time"> · {cur.time}</span>
      </span>
    </div>
  );
}
