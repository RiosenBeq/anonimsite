"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { IconArrow, IconBookmark, IconEye, IconMsg } from "@/components/icons";
import { AiMark, PulseDot, Tag } from "@/components/primitives";
import { ReportButton } from "@/components/ReportButton";
import { topicMeta } from "@/lib/data";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  showActions?: boolean;
  showMeta?: "compact" | "full";
}

export function QuestionCard({
  question: q,
  showActions = false,
  showMeta = "compact",
}: QuestionCardProps) {
  const tone = topicMeta(q.topic).color;
  const stop = (e: MouseEvent) => e.preventDefault();
  return (
    <Link href={`/q/${q.id}`} className="qcard card-hover">
      <div className="qcard-meta">
        <Tag tone={tone}>#{q.topic}</Tag>
        <Tag>{q.mood}</Tag>
        {showMeta === "full" ? (
          <>
            <span className="dot-sep" />
            <span style={{ color: "var(--text-3)" }}>asked anonymously · {q.age} ago</span>
            <span
              style={{
                marginLeft: "auto",
                color: "var(--accent)",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <PulseDot /> {q.pulse} reading
            </span>
          </>
        ) : (
          <span style={{ marginLeft: "auto", color: "var(--text-3)" }}>{q.age} ago</span>
        )}
      </div>
      <h3 className="qcard-q">{q.title}</h3>
      <p className="qcard-summary">
        <AiMark />
        {q.summary}
      </p>
      <div className="qcard-foot">
        <span className="qcard-stat">
          <IconMsg size={13} /> {q.answers} answers
        </span>
        <span className="qcard-stat">
          <IconEye size={13} /> {q.views}
        </span>
        {showMeta === "compact" ? (
          <>
            <span className="qcard-stat" style={{ color: "var(--accent)" }}>
              <PulseDot /> {q.pulse} reading
            </span>
            <span style={{ marginLeft: "auto", display: "inline-flex", gap: 8, alignItems: "center" }}>
              <span className="qcard-stat">
                <IconBookmark size={13} /> {q.saves}
              </span>
              <ReportButton targetType="question" targetId={q.id} />
            </span>
          </>
        ) : (
          <>
            <span className="qcard-stat">
              <IconBookmark size={13} /> {q.saves}
            </span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <ReportButton targetType="question" targetId={q.id} />
              {showActions && (
                <>
                  <button
                    className="micro-btn"
                    type="button"
                    onClick={stop}
                    aria-label="Save question"
                  >
                    <IconBookmark size={12} /> Save
                  </button>
                  <button className="micro-btn" type="button" aria-label="Read question">
                    Read <IconArrow size={11} />
                  </button>
                </>
              )}
            </span>
          </>
        )}
      </div>
      <span className="live-bar" />
    </Link>
  );
}
