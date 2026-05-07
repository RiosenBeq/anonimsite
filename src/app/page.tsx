import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LiveTicker } from "@/components/landing/LiveTicker";
import { OrbitalGalaxy } from "@/components/landing/OrbitalGalaxy";
import { QuestionCard } from "@/components/QuestionCard";
import { Eyebrow } from "@/components/primitives";
import {
  IconArrow,
  IconCheck,
  IconShield,
} from "@/components/icons";
import { QUESTIONS } from "@/lib/data";

const HOW_STEPS = [
  {
    n: "01",
    t: "Ask without trace",
    b: "No name, no photo, no inbox you'll regret. Just the question, set free.",
  },
  {
    n: "02",
    t: "AI helps you ask better",
    b: "Anonim suggests sharper phrasing, related threads, and the right room — never the answer.",
  },
  {
    n: "03",
    t: "People who've been there reply",
    b: "Helpfulness, not popularity. Reputation built quietly over time, never on identity.",
  },
  {
    n: "04",
    t: "Come back to the answer",
    b: "We'll quietly notify you when someone honest writes back. No notification noise.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <Eyebrow live>Open · Anonymous · 218k people awake</Eyebrow>
            <h1 className="h-display h1" style={{ marginTop: 22 }}>
              Ask what you can&apos;t
              <br />
              ask <span className="italic-accent">anywhere else.</span>
            </h1>
            <p className="hero-sub">
              Anonim is a quiet, anonymous place for the questions you carry around but never quite
              say out loud. Honest answers, from people who&apos;ve been there.
            </p>
            <div className="hero-ctas">
              <Link className="btn btn-primary" href="/ask">
                Ask anonymously <IconArrow size={13} />
              </Link>
              <Link className="btn btn-outline" href="/feed">
                Read the feed
              </Link>
            </div>
            <LiveTicker />
          </div>
          <div className="hero-visual">
            <OrbitalGalaxy />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="trust-cell">
          <div className="trust-num">
            2.1<span>m</span>
          </div>
          <div className="trust-lbl">questions asked, never traced</div>
        </div>
        <div className="trust-cell">
          <div className="trust-num">
            96<span>%</span>
          </div>
          <div className="trust-lbl">received an honest answer in &lt; 24h</div>
        </div>
        <div className="trust-cell">
          <div className="trust-num">
            0<span></span>
          </div>
          <div className="trust-lbl">profiles, photos, or follower counts</div>
        </div>
        <div className="trust-cell">
          <div className="trust-num">
            218<span>k</span>
          </div>
          <div className="trust-lbl">awake, somewhere, right now</div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <Eyebrow live>Live in the feed</Eyebrow>
            <h2 className="h-display h2" style={{ marginTop: 14 }}>
              Honest questions, <span className="italic-accent">moving right now.</span>
            </h2>
          </div>
          <Link className="btn btn-pill-dark" href="/feed">
            Open the full feed <IconArrow size={13} />
          </Link>
        </div>
        <div className="trend-grid">
          {QUESTIONS.slice(0, 3).map((q) => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      </section>

      <section className="section how">
        <div>
          <Eyebrow>The shape of it</Eyebrow>
          <h2 className="h-display h2" style={{ marginTop: 14, maxWidth: 640 }}>
            Four small moves.{" "}
            <span className="italic-accent">No followers, no faces, no scoreboard.</span>
          </h2>
        </div>
        <div className="how-grid">
          {HOW_STEPS.map((s) => (
            <div key={s.n} className="how-cell">
              <div className="how-n">{s.n}</div>
              <div className="how-t">{s.t}</div>
              <div className="how-b">{s.b}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section privacy">
        <div className="privacy-card">
          <div className="privacy-rings">
            <div />
            <div />
            <div />
            <div />
            <span className="privacy-glyph">
              <IconShield size={28} />
            </span>
          </div>
          <div className="privacy-copy">
            <Eyebrow>Safe by design</Eyebrow>
            <h2 className="h-display h3" style={{ marginTop: 14, maxWidth: 540 }}>
              Anonymity isn&apos;t a feature here.{" "}
              <span className="italic-accent">It&apos;s the foundation.</span>
            </h2>
            <p className="privacy-sub">
              No real names. No phone numbers stored after verification. No public profiles.
              Reputation lives only on the helpfulness of what you write — never on who you are.
              Posts are end-to-end encrypted in transit, hashed at rest, and impossible to trace
              back to a person, even by us.
            </p>
            <div className="privacy-bullets">
              <span className="pb">
                <IconCheck size={12} /> No identifiable metadata
              </span>
              <span className="pb">
                <IconCheck size={12} /> Per-question pseudonyms
              </span>
              <span className="pb">
                <IconCheck size={12} /> You own your delete button
              </span>
              <span className="pb">
                <IconCheck size={12} /> Moderation by humans, not models
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-final">
        <Eyebrow>One question is enough</Eyebrow>
        <h2 className="h-display" style={{ fontSize: 96, marginTop: 22, lineHeight: 1 }}>
          The thing you&apos;ve been
          <br />
          <span className="italic-accent">carrying around.</span>
        </h2>
        <p className="cta-sub">
          Someone, somewhere, has lived a version of it. They&apos;re awake, and they&apos;re
          answering.
        </p>
        <Link
          className="btn btn-primary"
          style={{ marginTop: 32, padding: "14px 24px", fontSize: 14.5 }}
          href="/ask"
        >
          Ask it now <IconArrow size={14} />
        </Link>
        <div style={{ marginTop: 22, color: "var(--text-3)", fontSize: 12.5 }}>
          Free · Anonymous · No account needed to read
        </div>
      </section>

      <footer className="foot">
        <Logo />
        <div className="foot-links">
          <a>Manifesto</a>
          <a>How we stay safe</a>
          <a>Press</a>
          <a>Careers</a>
          <a>Contact</a>
        </div>
        <div className="foot-meta">© Anonim 2032 — built quietly, for the questions you carry.</div>
      </footer>
    </div>
  );
}
