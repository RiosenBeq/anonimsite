"use client";

import { useThreadPresence } from "@/lib/supabase/realtime";

export function PresenceGrid({ questionId }: { questionId: string }) {
  const count = useThreadPresence(questionId, 12);
  const cells = Math.max(6, Math.min(24, count));

  return (
    <div className="presence">
      <div className="presence-grid">
        {Array.from({ length: cells }).map((_, i) => (
          <span key={i} className="pres-dot" style={{ animationDelay: `${i * 0.18}s` }} />
        ))}
      </div>
      <div className="presence-text">
        <strong>{count} anonymous readers</strong> are in this thread with you.
        <span style={{ color: "var(--text-3)" }}>
          {" "}
          No one can see who anyone is, including us.
        </span>
      </div>
    </div>
  );
}
