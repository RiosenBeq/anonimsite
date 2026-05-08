"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { IconArrow, IconBookmark, IconSearch } from "@/components/icons";
import { Eyebrow, PulseDot } from "@/components/primitives";
import type { Question, Topic } from "@/lib/types";

const ORBITS = [{ r: 110 }, { r: 200 }, { r: 290 }];
const CX = 380;
const CY = 380;

interface GalaxyProps {
  topics: Topic[];
  topQuestionsByTopic: Record<string, Question[]>;
}

export function ExploreGalaxy({ topics, topQuestionsByTopic }: GalaxyProps) {
  const [active, setActive] = useState<string>(topics[0]?.slug ?? "mind");
  const t = topics.find((x) => x.slug === active) ?? topics[0];
  const topQs = topQuestionsByTopic[active] ?? [];

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => {
        const r = 50 + ((i * 11.13) % 340);
        const a = (i * 0.83) % (Math.PI * 2);
        return {
          left: CX + Math.cos(a) * r,
          top: CY + Math.sin(a) * r,
          opacity: 0.1 + ((i * 0.149) % 0.4),
          delay: `${(i * 0.27) % 4}s`,
        };
      }),
    [],
  );

  if (!t) return null;

  return (
    <div className="explore-grid">
      <div className="galaxy-stage">
        <div className="galaxy" style={{ width: 760, height: 760 }}>
          {ORBITS.map((o, i) => (
            <div
              key={`r-${i}`}
              className="g-ring"
              style={{
                width: o.r * 2,
                height: o.r * 2,
                left: CX - o.r,
                top: CY - o.r,
              }}
            />
          ))}

          <svg className="g-lines" viewBox="0 0 760 760" width="760" height="760" aria-hidden>
            {topics.map((tp, i) => {
              const ring = i % 3;
              const r = ORBITS[ring].r;
              const ang = (tp.angle * Math.PI) / 180;
              const x = CX + Math.cos(ang) * r;
              const y = CY + Math.sin(ang) * r;
              return (
                <line
                  key={tp.slug}
                  x1={CX}
                  y1={CY}
                  x2={x}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
              );
            })}
          </svg>

          <div className="g-core">
            <div className="g-core-pulse" />
            <div className="g-core-dot">
              <IconSearch size={18} />
            </div>
          </div>

          {topics.map((tp, i) => {
            const ring = i % 3;
            const r = ORBITS[ring].r;
            const ang = (tp.angle * Math.PI) / 180;
            const x = CX + Math.cos(ang) * r;
            const y = CY + Math.sin(ang) * r;
            const isAct = active === tp.slug;
            return (
              <div
                key={tp.slug}
                className={`g-node g-${tp.color} ${isAct ? "g-active" : ""}`}
                style={{ left: x, top: y, animationDelay: `${i * 0.3}s` }}
                onMouseEnter={() => setActive(tp.slug)}
                onFocus={() => setActive(tp.slug)}
                tabIndex={0}
                role="button"
                aria-label={`${tp.label}: ${tp.count} questions`}
              >
                <div className="g-node-orb" />
                <div className="g-node-label">
                  <div className="g-node-name">#{tp.label}</div>
                  <div className="g-node-count">
                    {tp.count} · {tp.desc}
                  </div>
                </div>
              </div>
            );
          })}

          {stars.map((s, i) => (
            <span
              key={`gs-${i}`}
              className="g-star"
              style={{ left: s.left, top: s.top, opacity: s.opacity, animationDelay: s.delay }}
            />
          ))}
        </div>
      </div>

      <aside className="explore-detail">
        <div className="surface" style={{ padding: 24 }}>
          <Eyebrow>You&apos;re hovering</Eyebrow>
          <h2 className="h-display" style={{ fontSize: 36, marginTop: 14, lineHeight: 1.05 }}>
            #{t.label}
          </h2>
          <p style={{ color: "var(--text-2)", marginTop: 10, fontSize: 14, lineHeight: 1.55 }}>
            {t.desc} {t.count} questions. Live.
          </p>
          <div className="topic-stats">
            <div>
              <span>Live now</span>{" "}
              <strong style={{ color: "var(--accent)" }}>312 reading</strong>
            </div>
            <div>
              <span>Avg first answer</span> <strong>11 min</strong>
            </div>
            <div>
              <span>Helpfulness</span> <strong>94%</strong>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-pill-dark"
              style={{ flex: 1, justifyContent: "center" }}
            >
              <IconBookmark size={13} /> Follow
            </button>
            <Link
              href="/feed"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: "center" }}
            >
              Open feed <IconArrow size={13} />
            </Link>
          </div>
        </div>

        <div className="surface" style={{ padding: 18 }}>
          <div className="side-head">
            <Eyebrow>Top in #{t.label}</Eyebrow>
            <button className="side-link" type="button">
              All
            </button>
          </div>
          <div className="related-list">
            {topQs.length === 0 && (
              <div style={{ color: "var(--text-3)", fontSize: 12.5, padding: "12px 0" }}>
                No threads here yet. <Link href="/ask" style={{ color: "var(--accent)" }}>Be first</Link>.
              </div>
            )}
            {topQs.slice(0, 4).map((q) => (
              <Link
                key={q.id}
                href={`/q/${q.id}`}
                className="related-row"
                style={{ display: "block" }}
              >
                <div className="related-q">{q.title}</div>
                <div className="related-meta">
                  <span>{q.answers} answers</span>
                  <span className="dot-sep" />
                  <span style={{ color: "var(--accent)" }}>
                    <PulseDot /> {q.pulse} reading
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
