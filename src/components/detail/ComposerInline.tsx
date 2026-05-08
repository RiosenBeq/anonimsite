"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState, useTransition } from "react";
import { IconArrow, IconBookmark, IconLayers, IconShield, IconSpark } from "@/components/icons";
import { Eyebrow } from "@/components/primitives";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { postAnswerAction } from "@/lib/actions";
import { postAnswerSchema } from "@/lib/validators";

interface ComposerInlineProps {
  questionId: string;
}

export function ComposerInline({ questionId }: ComposerInlineProps) {
  const router = useRouter();
  const [v, setV] = useState("");
  const [anon, setAnon] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const [hp, setHp] = useState("");
  const renderedAt = useRef<number>(Date.now());
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const turnstileRequired = !!process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY;
  const onTurnstileToken = useCallback((t: string) => setTurnstileToken(t), []);
  const onTurnstileError = useCallback(() => setTurnstileToken(""), []);

  const submit = () => {
    setError(null);
    const parsed = postAnswerSchema.safeParse({
      questionId,
      body: v,
      hp,
      renderedAt: renderedAt.current,
      turnstileToken,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    if (turnstileRequired && !turnstileToken) {
      setError("Bot doğrulamasını tamamlayıp tekrar dener misin?");
      return;
    }
    startTransition(async () => {
      const res = await postAnswerAction(parsed.data);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setV("");
      router.refresh();
    });
  };

  return (
    <div className="composer-inline" id="composer">
      <Eyebrow>Your turn</Eyebrow>
      <div className="composer-prompt">
        Someone&apos;s been waiting. <span className="italic-accent">Take your time.</span>
      </div>
      <div className="composer-shell">
        <textarea
          placeholder="Write the kind of answer you'd want to receive…"
          value={v}
          onChange={(e) => setV(e.target.value)}
          rows={6}
        />
        <div className="composer-helpers">
          <span className="helper-chip">
            <IconSpark size={11} /> Suggest a kinder opener
          </span>
          <span className="helper-chip">
            <IconLayers size={11} /> Cite a related thread
          </span>
          <span className="helper-chip">
            <IconShield size={11} /> Add a content note
          </span>
        </div>
        {error && (
          <div
            style={{
              padding: 10,
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
        {turnstileRequired && (
          <TurnstileWidget onToken={onTurnstileToken} onError={onTurnstileError} />
        )}
        {/* Honeypot — hidden from humans, magnet for bots. */}
        <label className="hp-field" aria-hidden="true">
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
          />
        </label>
        <div className="composer-foot">
          <label className="anon-toggle">
            <span
              className={`anon-track ${anon ? "on" : ""}`}
              onClick={() => setAnon(!anon)}
              role="switch"
              aria-checked={anon}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setAnon(!anon);
              }}
            >
              <span className="anon-thumb" />
            </span>
            <span>{anon ? "Anonymous · new pseudonym for this thread" : "Visible as: Wren"}</span>
          </label>
          <div className="composer-actions">
            <button className="btn btn-pill-dark" type="button" style={{ fontSize: 12.5 }}>
              <IconBookmark size={12} /> Save draft
            </button>
            <button className="btn btn-pill-dark" type="button" style={{ fontSize: 12.5 }}>
              Preview
            </button>
            <button
              className="btn btn-primary"
              type="button"
              style={{ fontSize: 13 }}
              disabled={!v || pending || (turnstileRequired && !turnstileToken)}
              onClick={submit}
            >
              {pending ? "Sending…" : "Send answer"} <IconArrow size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
