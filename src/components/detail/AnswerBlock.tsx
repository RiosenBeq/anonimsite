"use client";

import { useState } from "react";
import { IconBookmark, IconMore, IconMsg, IconShield } from "@/components/icons";
import { PulseDot } from "@/components/primitives";
import { HelpfulnessRing } from "@/components/detail/HelpfulnessRing";
import type { Answer } from "@/lib/types";

const REACTIONS = [
  { k: "honest", label: "Honest", glyph: "✶" },
  { k: "warm", label: "Warm", glyph: "❀" },
  { k: "useful", label: "Useful", glyph: "✓" },
  { k: "deep", label: "Deep", glyph: "≋" },
] as const;

type ReactionKey = (typeof REACTIONS)[number]["k"];

interface AnswerBlockProps {
  answer: Answer;
}

export function AnswerBlock({ answer: a }: AnswerBlockProps) {
  const [counts, setCounts] = useState<Record<ReactionKey, number>>({
    honest: 84,
    warm: 41,
    useful: 122,
    deep: 33,
  });
  const [mine, setMine] = useState<ReactionKey | null>(null);

  const pick = (k: ReactionKey) => {
    if (mine === k) {
      setCounts((c) => ({ ...c, [k]: c[k] - 1 }));
      setMine(null);
      return;
    }
    setCounts((c) => {
      const next = { ...c, [k]: c[k] + 1 };
      if (mine) next[mine] = next[mine] - 1;
      return next;
    });
    setMine(k);
  };

  return (
    <article className={`answer ${a.badge ? "answer-top" : ""}`}>
      {a.badge && (
        <div className="answer-badge">
          <span className="ab-glyph">★</span>
          {a.badge} · chosen by the community
        </div>
      )}
      <header className="answer-head">
        <HelpfulnessRing value={a.helpfulness} />
        <div className="answer-id">
          <div className="answer-handle">{a.handle}</div>
          <div className="answer-meta">
            <span>
              {a.helpfulness}% helpful · {a.upvotes} upvotes
            </span>
            <span className="dot-sep" />
            <span>{a.age} ago</span>
            <span className="dot-sep" />
            <span
              style={{
                color: "var(--accent)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <PulseDot /> still answering
            </span>
          </div>
        </div>
        <div className="answer-tools">
          <button className="micro-btn" type="button">
            <IconBookmark size={12} /> Save
          </button>
          <button className="micro-btn" type="button" aria-label="More options">
            <IconMore size={12} />
          </button>
        </div>
      </header>
      <div className="answer-body">
        {a.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <footer className="answer-foot">
        <div className="reactions">
          {REACTIONS.map((o) => (
            <button
              key={o.k}
              type="button"
              className={`react ${mine === o.k ? "on" : ""}`}
              onClick={() => pick(o.k)}
            >
              <span className="react-glyph">{o.glyph}</span>
              <span className="react-l">{o.label}</span>
              <span className="react-c">{counts[o.k]}</span>
            </button>
          ))}
        </div>
        <div className="answer-actions">
          <button className="micro-btn" type="button">
            ↑ {a.upvotes}
          </button>
          <button className="micro-btn" type="button">
            <IconMsg size={12} /> Reply quietly
          </button>
          <button className="micro-btn" type="button">
            <IconShield size={12} /> Flag
          </button>
        </div>
      </footer>
    </article>
  );
}
