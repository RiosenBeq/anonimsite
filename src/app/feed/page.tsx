import Link from "next/link";
import { FeedFeatured } from "@/components/feed/FeedFeatured";
import { FeedSidebar } from "@/components/feed/FeedSidebar";
import { FeedTabs } from "@/components/feed/FeedTabs";
import { QuestionCard } from "@/components/QuestionCard";
import { Eyebrow } from "@/components/primitives";
import { IconFilter, IconGlobe, IconPlus } from "@/components/icons";
import { QUESTIONS } from "@/lib/data";

const RAIL_CHIPS = [
  "Tender questions",
  "Late-night thinking",
  "Career inflection",
  "Money taboos",
  "Therapist takeovers",
  "Quiet wins",
  "Creative blocks",
  "Honest 30s",
];

export const metadata = {
  title: "Feed · Anonim",
  description:
    "Honest questions moving right now. Tender, curious, searching — asked anonymously, answered by people who've been there.",
};

export default function FeedPage() {
  const items = QUESTIONS.filter((_, i) => i !== 2);
  return (
    <div className="feed-shell">
      <div className="feed-hero">
        <div>
          <Eyebrow live>Tuesday morning · 218k awake</Eyebrow>
          <h1 className="h-display h2" style={{ marginTop: 16, maxWidth: 640 }}>
            The questions <span className="italic-accent">people are carrying today.</span>
          </h1>
        </div>
        <div className="feed-hero-side">
          <button className="btn btn-pill-dark" type="button">
            <IconFilter size={13} /> Mood: any
          </button>
          <button className="btn btn-pill-dark" type="button">
            <IconGlobe size={13} /> All topics
          </button>
          <Link className="btn btn-primary" href="/ask">
            <IconPlus size={13} /> Ask
          </Link>
        </div>
      </div>
      <div className="feed-grid">
        <main className="feed-main">
          <FeedTabs />
          <FeedFeatured />
          <div className="feed-rail">
            <Eyebrow>Wanderable</Eyebrow>
            <div className="rail-row">
              {RAIL_CHIPS.map((t) => (
                <span key={t} className="rail-chip">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="feed-list">
            {items.map((q) => (
              <QuestionCard key={q.id} question={q} showActions showMeta="full" />
            ))}
          </div>
        </main>
        <FeedSidebar />
      </div>
    </div>
  );
}
