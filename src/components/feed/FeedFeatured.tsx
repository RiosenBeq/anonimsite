import Link from "next/link";
import { IconArrow, IconEye, IconMsg } from "@/components/icons";
import { AiMark, Eyebrow, PulseDot } from "@/components/primitives";
import { ANSWERS, QUESTIONS } from "@/lib/data";

export function FeedFeatured() {
  const q = QUESTIONS[2];
  return (
    <Link href={`/q/${q.id}`} className="feed-featured" style={{ textDecoration: "none" }}>
      <div className="ff-l">
        <Eyebrow>Editor&apos;s pick · A long thread worth your time</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 40, marginTop: 16, lineHeight: 1.05 }}>
          {q.title}
        </h2>
        <p className="ff-summary">
          <AiMark />
          {q.summary}
        </p>
        <div className="ff-foot">
          <span className="qcard-stat">
            <IconMsg size={13} /> {q.answers} answers
          </span>
          <span className="qcard-stat">
            <IconEye size={13} /> {q.views}
          </span>
          <span className="qcard-stat" style={{ color: "var(--accent)" }}>
            <PulseDot /> {q.pulse} reading right now
          </span>
          <span style={{ marginLeft: "auto" }}>
            <span className="btn btn-pill-dark">
              Open thread <IconArrow size={13} />
            </span>
          </span>
        </div>
      </div>
      <div className="ff-r">
        <div className="ff-orbit">
          <div />
          <div />
          <div />
          <span>?</span>
        </div>
        <div className="ff-stack">
          {ANSWERS.slice(0, 3).map((a, i) => (
            <div
              key={a.id}
              className="ff-mini"
              style={{
                transform: `translateY(${i * -12}px) translateX(${i * 8}px)`,
                zIndex: 10 - i,
              }}
            >
              <span className="ff-mini-meta">
                {a.handle.split(" · ")[0]} · {a.helpfulness}% helpful
              </span>
              <span className="ff-mini-snip">&ldquo;{a.body[0].slice(0, 88)}…&rdquo;</span>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
