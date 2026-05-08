"use client";

import { useState, useTransition } from "react";
import { IconBookmark, IconMore, IconMsg, IconShield } from "@/components/icons";
import { PulseDot } from "@/components/primitives";
import { HelpfulnessRing } from "@/components/detail/HelpfulnessRing";
import { toggleReactionAction } from "@/lib/actions";
import type { Answer } from "@/lib/types";
import type { ReactionKind } from "@/lib/supabase/database.types";

const REACTIONS = [
  { k: "honest", label: "Honest", glyph: "✶" },
  { k: "warm", label: "Warm", glyph: "❀" },
  { k: "useful", label: "Useful", glyph: "✓" },
  { k: "deep", label: "Deep", glyph: "≋" },
] as const;

export type ReactionCounts = Record<ReactionKind, number>;

interface AnswerBlockProps {
  answer: Answer;
  initialCounts: ReactionCounts;
  initialMine: ReactionKind | null;
}

export function AnswerBlock({ answer: a, initialCounts, initialMine }: AnswerBlockProps) {
  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [mine, setMine] = useState<ReactionKind | null>(initialMine);
  const [pending, startTransition] = useTransition();

  const pick = (k: ReactionKind) => {
    if (pending) return;
    const prev = mine;

    // optimistic
    setCounts((c) => {
      const next: ReactionCounts = { ...c };
      if (prev === k) {
        next[k] = Math.max(0, next[k] - 1);
      } else {
        if (prev) next[prev] = Math.max(0, next[prev] - 1);
        next[k] = next[k] + 1;
      }
      return next;
    });
    setMine(prev === k ? null : k);

    startTransition(async () => {
      const res = await toggleReactionAction({ answerId: a.id, kind: k });
      if (!res.ok) {
        // revert
        setMine(prev);
        setCounts(initialCounts);
      }
    });
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
              disabled={pending}
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
