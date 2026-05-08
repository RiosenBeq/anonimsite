import Link from "next/link";
import { ExploreGalaxy } from "@/components/explore/Galaxy";
import { QuestionCard } from "@/components/QuestionCard";
import { Eyebrow } from "@/components/primitives";
import { IconArrow, IconPlus, IconSearch } from "@/components/icons";
import { fetchQuestions, fetchTopics } from "@/lib/queries";

const SEASONAL = [
  { l: "Late November threads", m: "247 questions", c: "var(--violet)" },
  { l: "End-of-year reckoning", m: "Picks up Dec 1", c: "var(--accent)" },
  { l: "Quiet things asked at 3am", m: "Always open", c: "var(--warm)" },
  { l: "Therapist takeover · Sun", m: "Scheduled", c: "var(--lime)" },
];

export const metadata = {
  title: "Explore · Anonim",
  description:
    "A small universe of honest curiosity. Eight rooms, each a different kind of question.",
};

export const revalidate = 60;

export default async function ExplorePage() {
  const [topics, allQuestions, picks] = await Promise.all([
    fetchTopics(),
    fetchQuestions({ limit: 80 }),
    fetchQuestions({ limit: 3 }),
  ]);

  const topQuestionsByTopic: Record<string, typeof allQuestions> = {};
  for (const t of topics) {
    topQuestionsByTopic[t.slug] = allQuestions.filter((q) => q.topic === t.slug).slice(0, 4);
  }

  return (
    <div className="explore-shell">
      <div className="explore-head">
        <div>
          <Eyebrow live>The map</Eyebrow>
          <h1 className="h-display h2" style={{ marginTop: 14, maxWidth: 720 }}>
            A small universe of <span className="italic-accent">honest curiosity.</span>
          </h1>
          <p className="explore-sub">
            Eight rooms. Each one a different kind of question. Drift, hover, follow what catches.
          </p>
        </div>
        <div className="explore-side-actions">
          <div className="search-mini" style={{ width: 320 }}>
            <IconSearch size={13} />
            <span>Find a topic, mood, or thread</span>
            <kbd>⌘K</kbd>
          </div>
          <Link className="btn btn-primary" href="/ask">
            <IconPlus size={13} /> Ask
          </Link>
        </div>
      </div>

      <ExploreGalaxy topics={topics} topQuestionsByTopic={topQuestionsByTopic} />

      <section className="moments">
        <div className="section-head" style={{ marginBottom: 24 }}>
          <div>
            <Eyebrow>Moments</Eyebrow>
            <h2 className="h-display h3" style={{ marginTop: 12 }}>
              What people are <span className="italic-accent">circling</span> this week.
            </h2>
          </div>
        </div>
        <div className="moments-grid">
          {SEASONAL.map((s, i) => (
            <div key={i} className="moment-card">
              <span
                className="moment-glyph"
                style={{ background: s.c, boxShadow: `0 0 16px ${s.c}` }}
              />
              <div className="moment-l">{s.l}</div>
              <div className="moment-m">{s.m}</div>
              <span className="moment-arrow">
                <IconArrow size={14} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {picks.length > 0 && (
        <section className="picks">
          <div className="section-head" style={{ marginBottom: 24 }}>
            <div>
              <Eyebrow>Editor&apos;s quiet picks</Eyebrow>
              <h2 className="h-display h3" style={{ marginTop: 12 }}>
                Threads worth a slow read.
              </h2>
            </div>
            <Link className="btn btn-pill-dark" href="/feed">
              The full feed <IconArrow size={13} />
            </Link>
          </div>
          <div className="trend-grid">
            {picks.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
