"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { IconArrow, IconCheck, IconClose, IconShield } from "@/components/icons";
import { AiMark, Eyebrow, PulseDot } from "@/components/primitives";
import { askQuestionAction } from "@/lib/actions";
import { generatePseudonym } from "@/lib/pseudonyms";
import { askQuestionSchema } from "@/lib/validators";
import type { Question, Topic } from "@/lib/types";

const MOOD_OPTIONS = [
  "Tender",
  "Curious",
  "Searching",
  "Honest",
  "Reflective",
  "Anxious",
  "Hopeful",
  "Confused",
  "Practical",
];

interface AskFlowProps {
  topics: Topic[];
  similarQuestions: Question[];
}

export function AskFlow({ topics, similarQuestions }: AskFlowProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const [moods, setMoods] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [pseudonym, setPseudonym] = useState(() => generatePseudonym());
  const [error, setError] = useState<string | null>(null);
  const [postedId, setPostedId] = useState<string | null>(null);

  const toggleMood = (m: string) =>
    setMoods((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m].slice(0, 3)));

  const reroll = () => setPseudonym(generatePseudonym());

  const aiSuggestions = useMemo(
    () => [
      {
        title: "A clearer way to ask",
        body:
          q.trim().length > 30
            ? "Try opening with what you've already tried — it gives answerers a place to land."
            : "Add one sentence of context. The most-answered questions describe what you've already considered.",
      },
      {
        title: "Best room for this",
        body:
          topics.length > 0
            ? `${topics.find((t) => t.slug === "mind")?.label ?? "The Mind"} has therapists answering this week. Career has the highest helpfulness this month.`
            : "Pick the room that matches the shape of the question.",
      },
      {
        title: "Three threads with overlapping ground",
        body: "We'll show them after you ask. They won't cap your audience.",
      },
    ],
    [q, topics],
  );

  const submit = () => {
    setError(null);
    const parsed = askQuestionSchema.safeParse({
      title: q,
      context,
      topicSlug: topic ?? "",
      moods,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    startTransition(async () => {
      const res = await askQuestionAction(parsed.data);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setPostedId(res.data.questionId);
      setStep(2);
    });
  };

  const topicMeta = topics.find((t) => t.slug === topic);

  return (
    <div className="ask-shell">
      <div className="ask-stage">
        <div className="ask-left">
          <div className="ask-header">
            <Eyebrow>
              {step === 0 ? "Step 01 · Ask" : step === 1 ? "Step 02 · Refine" : "Sent"}
            </Eyebrow>
            <Link href="/feed" className="micro-btn">
              <IconClose size={11} /> Cancel
            </Link>
          </div>

          {step === 0 && (
            <>
              <h1 className="h-display" style={{ fontSize: 56, lineHeight: 1.05, marginTop: 18 }}>
                Ask freely. <span className="italic-accent">No one will know it was you.</span>
              </h1>
              <p className="ask-sub">
                Anonim doesn&apos;t store your name, your face, or your account against this
                question. A new pseudonym is generated just for this thread.
              </p>

              <div className="ask-field">
                <label className="ask-label" htmlFor="ask-q">
                  Your question
                </label>
                <textarea
                  id="ask-q"
                  className="ask-input"
                  rows={4}
                  placeholder="What is the thing you've been carrying around?"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  autoFocus
                />
                <div className="ask-input-foot">
                  <span>{q.length}/300 · plain language is best</span>
                  <span style={{ color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {q.length > 20 ? (
                      <>
                        <PulseDot /> Looks askable
                      </>
                    ) : (
                      "Take your time"
                    )}
                  </span>
                </div>
              </div>

              <div className="ask-field">
                <label className="ask-label" htmlFor="ask-context">
                  Add a little context (optional)
                </label>
                <textarea
                  id="ask-context"
                  className="ask-input"
                  rows={3}
                  placeholder="What you've already tried. What you don't want. The shape of what would help."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <div className="ask-field">
                <label className="ask-label">Which room is this for?</label>
                <div className="topic-pick">
                  {topics.slice(0, 8).map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      className={`topic-tile ${topic === t.slug ? "on" : ""}`}
                      onClick={() => setTopic(t.slug)}
                    >
                      <span className={`topic-dot follow-${t.color}`} />
                      <span className="topic-tile-l">{t.label}</span>
                      <span className="topic-tile-c">{t.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="ask-field">
                <label className="ask-label">
                  Mood — for tone, not for filing{" "}
                  <span style={{ color: "var(--text-3)" }}>(pick up to 3)</span>
                </label>
                <div className="mood-row">
                  {MOOD_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`mood-chip ${moods.includes(m) ? "on" : ""}`}
                      onClick={() => toggleMood(m)}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ask-actions">
                <div className="ask-disclaimer">
                  <IconShield size={13} />
                  <span>
                    Encrypted in transit · No identifying metadata · You can delete anytime
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "12px 22px", fontSize: 14 }}
                  disabled={!q || !topic}
                  onClick={() => setStep(1)}
                >
                  Continue <IconArrow size={13} />
                </button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h1 className="h-display" style={{ fontSize: 48, lineHeight: 1.05, marginTop: 18 }}>
                A small refinement <span className="italic-accent">— if you want it.</span>
              </h1>
              <p className="ask-sub">
                Your question, clearer. You don&apos;t have to take any of this. Anonim never edits
                without you.
              </p>

              <div className="refine-card">
                <div className="refine-l">Your question</div>
                <div className="refine-q">{q}</div>
              </div>

              <div className="refine-card refine-suggest">
                <div className="refine-l">
                  <AiMark>AI · gentler version</AiMark>
                </div>
                <div className="refine-q italic-accent">
                  &ldquo;{q.replace(/\?$/, "")} — and how have others found the words for it?&rdquo;
                </div>
                <div className="refine-actions">
                  <button className="micro-btn" type="button">
                    Use this version
                  </button>
                  <button className="micro-btn" type="button">
                    Show two more
                  </button>
                  <button className="micro-btn" type="button">
                    Keep mine
                  </button>
                </div>
              </div>

              {similarQuestions.length > 0 && (
                <div className="similar-block">
                  <Eyebrow>Three people asked something nearby</Eyebrow>
                  <div className="similar-list">
                    {similarQuestions.slice(0, 3).map((s) => (
                      <Link key={s.id} href={`/q/${s.id}`} className="similar-row" style={{ display: "flex" }}>
                        <span className="similar-q">{s.title}</span>
                        <span className="similar-meta">
                          {s.answers} answers · {s.age}
                        </span>
                      </Link>
                    ))}
                  </div>
                  <div className="similar-foot">
                    Yours is different — go ahead. Or read these first.
                  </div>
                </div>
              )}

              {error && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    border: "1px solid var(--warm)",
                    background: "rgba(255,138,91,0.08)",
                    borderRadius: 8,
                    color: "var(--warm)",
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              <div className="ask-actions">
                <button
                  className="btn btn-pill-dark"
                  type="button"
                  onClick={() => setStep(0)}
                  disabled={pending}
                >
                  ← Back
                </button>
                <div style={{ flex: 1 }} />
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ padding: "12px 22px", fontSize: 14 }}
                  disabled={pending}
                  onClick={submit}
                >
                  {pending ? "Sending…" : "Send anonymously"} <IconArrow size={13} />
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <div className="ask-sent">
              <div className="sent-orbit">
                <div />
                <div />
                <div />
                <span className="sent-mark">
                  <IconCheck size={28} />
                </span>
              </div>
              <h1
                className="h-display"
                style={{ fontSize: 56, lineHeight: 1.05, marginTop: 32, textAlign: "center" }}
              >
                Out into the quiet.
              </h1>
              <p className="ask-sub" style={{ textAlign: "center", margin: "20px auto 0" }}>
                Your question is live in {topic ? `#${topic}` : "the feed"}. We&apos;ll quietly
                notify you when someone honest writes back.
              </p>
              <div className="sent-actions">
                <Link href="/feed" className="btn btn-pill-dark">
                  Read the feed
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => postedId && router.push(`/q/${postedId}`)}
                  disabled={!postedId}
                >
                  Watch it as it answers <IconArrow size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {step !== 2 && (
          <aside className="ask-right">
            <div className="ask-pseudo">
              <Eyebrow>Posting as</Eyebrow>
              <div className="pseudo-row">
                <span className="pseudo-mark" />
                <div>
                  <div className="pseudo-name">{pseudonym}</div>
                  <div className="pseudo-meta">a one-time pseudonym, just for this thread</div>
                </div>
                <button className="micro-btn" type="button" onClick={reroll}>
                  ↻ New
                </button>
              </div>
              <div className="pseudo-rules">
                <div>
                  <IconCheck size={11} /> Your account is never linked to this question.
                </div>
                <div>
                  <IconCheck size={11} /> You see notifications. No one else sees them.
                </div>
                <div>
                  <IconCheck size={11} /> You can delete this thread at any time.
                </div>
              </div>
            </div>

            <div className="ai-rail">
              <div className="ai-rail-head">
                <AiMark>AI · gentle helper</AiMark>
                <span className="ai-rail-meta">private to you</span>
              </div>
              {aiSuggestions.map((s, i) => (
                <div key={i} className="ai-tip">
                  <div className="ai-tip-t">{s.title}</div>
                  <div className="ai-tip-b">{s.body}</div>
                </div>
              ))}
            </div>

            <div className="surface" style={{ padding: 18 }}>
              <Eyebrow>Reading the room</Eyebrow>
              <div className="room-stat">
                <div className="rs-cell">
                  <div className="rs-num">{topicMeta?.count ?? "—"}</div>
                  <div className="rs-l">people in this room</div>
                </div>
                <div className="rs-cell">
                  <div className="rs-num">{topic ? "12m" : "—"}</div>
                  <div className="rs-l">avg time to first answer</div>
                </div>
              </div>
              <div className="room-tip">
                Most-answered questions in {topic ? `#${topic}` : "this room"} are{" "}
                <span style={{ color: "var(--text)" }}>asked between 9pm and 1am</span>. You&apos;re
                right on time.
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
