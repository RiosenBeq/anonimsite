import Link from "next/link";
import { IconArrow, IconPlus } from "@/components/icons";
import { Eyebrow, PulseDot } from "@/components/primitives";
import { NOTIFS, topicMeta } from "@/lib/data";

const FOLLOWED = ["mind", "career", "relationships", "philosophy"];

const PULSE = [
  { t: "The Mind", v: 78, c: "var(--violet)" },
  { t: "Relationships", v: 92, c: "var(--warm)" },
  { t: "Career", v: 54, c: "var(--accent)" },
  { t: "Money", v: 41, c: "var(--lime)" },
  { t: "Philosophy", v: 33, c: "var(--violet)" },
  { t: "Creative", v: 28, c: "var(--accent)" },
];

export function FeedSidebar() {
  return (
    <aside className="feed-side">
      <div className="surface" style={{ padding: 18 }}>
        <div className="side-head">
          <Eyebrow>Continue where you left</Eyebrow>
          <button className="side-link" type="button">
            Resume <IconArrow size={11} />
          </button>
        </div>
        <Link href="/q/q1" className="resume-card" style={{ display: "block" }}>
          <div className="resume-bar">
            <span style={{ width: "62%" }} />
          </div>
          <div className="resume-q">&ldquo;How do you tell a partner of seven years…&rdquo;</div>
          <div className="resume-meta">8 of 142 answers · 2 new since you left</div>
        </Link>
      </div>

      <div className="surface" style={{ padding: 18 }}>
        <div className="side-head">
          <Eyebrow>Topics you follow</Eyebrow>
          <button className="side-link" type="button">
            Edit
          </button>
        </div>
        <div className="follow-list">
          {FOLLOWED.map((slug) => {
            const t = topicMeta(slug);
            return (
              <div key={slug} className="follow-row">
                <span className={`follow-dot follow-${t.color}`} />
                <span className="follow-name">#{t.label}</span>
                <span className="follow-meta">{t.count}</span>
                <PulseDot />
              </div>
            );
          })}
        </div>
        <Link href="/explore" className="add-topic">
          <IconPlus size={11} /> Discover more topics
        </Link>
      </div>

      <div className="surface" style={{ padding: 18 }}>
        <div className="side-head">
          <Eyebrow live>Live pulse</Eyebrow>
          <span className="side-link" style={{ cursor: "default" }}>
            218k awake
          </span>
        </div>
        <div className="pulse-grid">
          {PULSE.map((p) => (
            <div key={p.t} className="pulse-row">
              <span className="pulse-name">{p.t}</span>
              <div className="pulse-bar">
                <span style={{ width: `${p.v}%`, background: p.c }} />
              </div>
              <span className="pulse-val">{p.v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="surface" style={{ padding: 18 }}>
        <div className="side-head">
          <Eyebrow>Activity</Eyebrow>
          <button className="side-link" type="button">
            All
          </button>
        </div>
        <div className="notif-list">
          {NOTIFS.map((n, i) => (
            <div key={i} className="notif">
              <span className={`notif-dot notif-${n.kind}`} />
              <div className="notif-body">
                <div className="notif-text">{n.text}</div>
                <div className="notif-meta">
                  {n.topic && <span>#{n.topic}</span>}
                  {n.topic && <span className="dot-sep" />}
                  <span>{n.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
