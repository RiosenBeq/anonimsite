import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswersList } from "@/components/detail/AnswersList";
import { ComposerInline } from "@/components/detail/ComposerInline";
import { PresenceGrid } from "@/components/detail/Presence";
import { SaveButton } from "@/components/detail/SaveButton";
import { IconArrow, IconBell, IconLayers } from "@/components/icons";
import { AiMark, Eyebrow, PulseDot, Tag } from "@/components/primitives";
import { topicMeta } from "@/lib/data";
import {
  fetchAnswerReactionCounts,
  fetchAnswers,
  fetchMyReactionsForQuestion,
  fetchMySaves,
  fetchQuestion,
  fetchQuestions,
  fetchTopics,
} from "@/lib/queries";
import { getAnonimSession } from "@/lib/session";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const q = await fetchQuestion(id);
  if (!q) return { title: "Anonim" };
  return {
    title: `${q.title.slice(0, 80)} · Anonim`,
    description: q.summary,
  };
}

export const revalidate = 10;

export default async function QuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sessionId = await getAnonimSession();

  const [q, topics, answers, related, reactionCounts, myReactions, mySaves] = await Promise.all([
    fetchQuestion(id),
    fetchTopics(),
    fetchAnswers(id, 25),
    fetchQuestions({ limit: 5 }),
    fetchAnswerReactionCounts(id),
    fetchMyReactionsForQuestion(sessionId, id),
    fetchMySaves(sessionId),
  ]);

  if (!q) notFound();

  const t = topicMeta(q.topic, topics);
  const relatedThreads = related.filter((r) => r.id !== q.id).slice(0, 4);
  const initialSaved = mySaves.includes(q.id);

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
            {q.summary && q.summary !== q.title && (
              <p className="qhead-context">
                <span style={{ color: "var(--text-3)" }}>Asker added: </span>
                &ldquo;{q.summary}&rdquo;
              </p>
            )}
            <div className="qhead-actions">
              <SaveButton
                questionId={q.id}
                initialSaved={initialSaved}
                initialCount={q.saves}
              />
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
              <PulseDot /> &nbsp;{Math.max(1, q.pulse)} people are typing now
            </div>
          </div>

          {answers.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "var(--text-3)",
                background: "var(--surface)",
                border: "1px dashed var(--line-2)",
                borderRadius: 16,
              }}
            >
              No answers yet — yours could be the first.
            </div>
          ) : (
            <AnswersList
              questionId={q.id}
              answers={answers}
              reactionCountsById={reactionCounts}
              myReactionByAnswerId={myReactions}
            />
          )}

          {answers.length > 0 && q.answers > answers.length && (
            <div className="show-more">
              <button className="btn btn-outline" type="button">
                Show {q.answers - answers.length} more answers
              </button>
            </div>
          )}

          <ComposerInline questionId={q.id} />
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
                <div className="hg-num">{q.answers}</div>
                <div className="hg-l">in thread</div>
              </div>
            </div>
            <div className="health-note">
              Moderation by humans is on. The asker said:{" "}
              <span style={{ color: "var(--text-2)" }}>&ldquo;Please be gentle.&rdquo;</span>
            </div>
          </div>

          {relatedThreads.length > 0 && (
            <div className="surface" style={{ padding: 18 }}>
              <div className="side-head">
                <Eyebrow>If this resonated</Eyebrow>
                <button className="side-link" type="button">
                  More
                </button>
              </div>
              <div className="related-list">
                {relatedThreads.map((r) => (
                  <Link
                    key={r.id}
                    href={`/q/${r.id}`}
                    className="related-row"
                    style={{ display: "block" }}
                  >
                    <div className="related-q">{r.title}</div>
                    <div className="related-meta">
                      <Tag tone={topicMeta(r.topic, topics).color}>#{r.topic}</Tag>
                      <span className="dot-sep" />
                      <span>{r.answers} answers</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="surface" style={{ padding: 18 }}>
            <Eyebrow live>Anonymous presence</Eyebrow>
            <PresenceGrid questionId={q.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
