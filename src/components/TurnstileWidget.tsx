"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "flexible" | "compact";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface Props {
  onToken: (token: string) => void;
  onError?: () => void;
}

// Renders a Cloudflare Turnstile widget when the public site key is set.
// If NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY is not configured, it returns null
// so the form keeps working in dev/preview without a CF account.
export function TurnstileWidget({ onToken, onError }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  onTokenRef.current = onToken;
  onErrorRef.current = onError;

  const siteKey = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile) return;
      try {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token) => onTokenRef.current(token),
          "error-callback": () => onErrorRef.current?.(),
          "expired-callback": () => onErrorRef.current?.(),
          theme: "dark",
          size: "flexible",
        });
      } catch {
        onErrorRef.current?.();
      }
    };

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector(
        `script[src="${SCRIPT_SRC}"]`,
      ) as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener("load", render, { once: true });
      } else {
        const s = document.createElement("script");
        s.src = SCRIPT_SRC;
        s.async = true;
        s.defer = true;
        s.addEventListener("load", render, { once: true });
        document.head.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
      const id = widgetId.current;
      if (id && window.turnstile) {
        try {
          window.turnstile.remove(id);
        } catch {
          // ignore
        }
      }
    };
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={ref} className="turnstile-host" />;
}
