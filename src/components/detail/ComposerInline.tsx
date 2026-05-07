"use client";

import { useState } from "react";
import { IconArrow, IconBookmark, IconLayers, IconShield, IconSpark } from "@/components/icons";
import { Eyebrow } from "@/components/primitives";

export function ComposerInline() {
  const [v, setV] = useState("");
  const [anon, setAnon] = useState(true);

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
            <span>
              {anon ? "Anonymous · new pseudonym for this thread" : "Visible as: Wren"}
            </span>
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
              disabled={!v}
            >
              Send answer <IconArrow size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
