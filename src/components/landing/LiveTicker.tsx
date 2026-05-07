"use client";

import { useEffect, useState } from "react";
import { PulseDot } from "@/components/primitives";

const ITEMS = [
  { who: "Someone in Berlin", what: "asked in The Mind", time: "now" },
  { who: "An anonymous reader", what: "saved a question", time: "2s" },
  { who: "Wren", what: "answered in Career", time: "4s" },
  { who: "8 people", what: "are typing answers", time: "now" },
  { who: "A new question", what: "is gaining momentum", time: "6s" },
];

export function LiveTicker() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ITEMS.length), 2400);
    return () => clearInterval(t);
  }, []);

  const cur = ITEMS[i];
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
