import Link from "next/link";
import { AnswerBlock } from "@/components/detail/AnswerBlock";
import { ComposerInline } from "@/components/detail/ComposerInline";
import { IconArrow, IconBell, IconBookmark, IconLayers } from "@/components/icons";
import { AiMark, Eyebrow, PulseDot, Tag } from "@/components/primitives";
import { ANSWERS, QUESTIONS, questionById, topicMeta } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return QUESTIONS.map((q) => ({ id: q.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const q = questionById(id);
  return {
    title: `${q.title.slice(0, 80)} · Anonim`,
    description: q.summary,
  };
}

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const q = questionById(id);
  const t = topicMeta(q.topic);
  const related = QUESTIONS.filter((r) => r.id !== q.id).slice(0, 4);

  return (
    <div className="detail-shell">
      <div className="crumbs">
        <Link href="/feed" style={{ color: "inherit" }}>
          Feed
        </Link>
        <span className="crumb-sep">/</span>
        <Link href="/explore" style={{ color: "inherit" }}>
          #{q.topic}
        </Link>
        <span className="crumb-sep">/</span>
        <span style={{ color: "var(--text-2)" }}>Reading</span>
      </div>

      <div className="detail-grid">
        <main className="detail-main">
          <div className="qhead">
            <div className="qhead-tags">
              <Tag tone={t.color}>#{q.topic}</Tag>
              <Tag tone="violet">{q.mood}</Tag>
              <span className="dot-sep" />
              <span style={{ color: "var(--text-3)", fontSize: 12 }}>
                asked anonymously · {q.age} ago · {q.views} reading this week
              </span>
            </div>
            <h1 className="h-display" style={{ fontSize: 44, lineHeight: 1.1, marginTop: 22 }}>
              {q.title}
            </h1>
            <p className="qhead-context">
              <span style={{ color: "var(--text-3)" }}>Asker added: </span>
              &ldquo;I&apos;ve thought about it for months. I&apos;m not asking what to do.
              I&apos;m asking how to find the words. Please be gentle.&rdquo;
            </p>
            <div className="qhead-actions">
              <button className="btn btn-pill-dark" type="button">
                <IconBookmark size={13} /> Save · {q.saves}
              </button>
              <button className="btn btn-pill-dark" type="button">
                <IconBell size={13} /> Notify if answered
              </button>
              <button className="btn btn-pill-dark" type="button">
                <IconLayers size={13} /> Follow thread
              </button>
              <span style={{ flex: 1 }} />
              <a href="#composer" className="btn btn-primary" style={{ fontSize: 13 }}>
                Write an answer <IconArrow size={13} />
              </a>
            </div>
          </div>

          <div className="ai-summary">
            <div className="ai-summary-head">
              <AiMark>AI · summary of {q.answers} answers</AiMark>
              <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--text-3)" }}>
                updated 3m ago
              </span>
            </div>
            <p className="ai-text">
              Three patterns emerge across {q.answers} answers. <strong>1.</strong> Don&apos;t lead
              with the verdict — most who did regret the framing.
              <strong> 2.</strong> Choose the moment carefully; tired or hungry conversations almost
              always derail.
              <strong> 3.</strong> Treat it as the start of a series, not a single event.{" "}
              <span className="italic-accent">
                Helpfulness is highest in the answers from people who&apos;ve been on both sides.
              </span>
            </p>
            <div className="ai-controls">
              <button className="micro-btn" type="button">
                Make it shorter
              </button>
              <button className="micro-btn" type="button">
                Show counter-views
              </button>
              <button className="micro-btn" type="button">
                Read in original voices
              </button>
            </div>
          </div>

          <div className="answers-head">
            <div className="answers-tabs">
              <button className="atab on" type="button">
                Top
              </button>
              <button className="atab" type="button">
                Newest
              </button>
              <button className="atab" type="button">
                Therapists
              </button>
              <button className="atab" type="button">
                Lived through it
              </button>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-3)" }}>
              <PulseDot /> &nbsp;6 people are typing now
            </div>
          </div>

          <div className="answers-list">
            {ANSWERS.map((a) => (
              <AnswerBlock key={a.id} answer={a} />
            ))}
            <div className="show-more">
              <button className="btn btn-outline" type="button">
                Show {Math.max(0, q.answers - ANSWERS.length)} more answers
              </button>
            </div>
          </div>

          <ComposerInline />
        </main>

        <aside className="detail-side">
          <div className="surface" style={{ padding: 18 }}>
            <Eyebrow>Thread health</Eyebrow>
            <div className="health-grid">
              <div className="hg-cell">
                <div className="hg-num">
                  94<span>%</span>
                </div>
                <div className="hg-l">helpful</div>
              </div>
              <div className="hg-cell">
                <div className="hg-num">0</div>
                <div className="hg-l">flagged</div>
              </div>
              <div className="hg-cell">
                <div className="hg-num">12</div>
                <div className="hg-l">in thread</div>
              </div>
            </div>
            <div className="health-note">
              Moderation by humans is on. The asker said:{" "}
              <span style={{ color: "var(--text-2)" }}>&ldquo;Please be gentle.&rdquo;</span>
            </div>
          </div>

          <div className="surface" style={{ padding: 18 }}>
            <div className="side-head">
              <Eyebrow>If this resonated</Eyebrow>
              <button className="side-link" type="button">
                More
              </button>
            </div>
            <div className="related-list">
              {related.map((r) => (
                <Link key={r.id} href={`/q/${r.id}`} className="related-row" style={{ display: "block" }}>
                  <div className="related-q">{r.title}</div>
                  <div className="related-meta">
                    <Tag tone={topicMeta(r.topic).color}>#{r.topic}</Tag>
                    <span className="dot-sep" />
                    <span>{r.answers} answers</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface" style={{ padding: 18 }}>
            <Eyebrow live>Anonymous presence</Eyebrow>
            <div className="presence">
              <div className="presence-grid">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="pres-dot"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
              <div className="presence-text">
                <strong>12 anonymous readers</strong> are in this thread with you.
                <span style={{ color: "var(--text-3)" }}>
                  {" "}
                  No one can see who anyone is, including us.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
