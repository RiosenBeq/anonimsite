"use client";

import { useState, type ReactElement } from "react";
import {
  IconArrow,
  IconClock,
  IconFlame,
  IconGhost,
  IconLayers,
  IconSpark,
} from "@/components/icons";

const TABS: { k: string; l: string; i: ReactElement }[] = [
  { k: "trending", l: "Trending", i: <IconFlame size={13} /> },
  { k: "latest", l: "Just asked", i: <IconClock size={13} /> },
  { k: "unanswered", l: "Waiting for you", i: <IconGhost size={13} /> },
  { k: "deep", l: "Deep threads", i: <IconLayers size={13} /> },
  { k: "for-you", l: "For you", i: <IconSpark size={13} /> },
];

export function FeedTabs() {
  const [tab, setTab] = useState("trending");
  return (
    <div className="feed-tabs">
      {TABS.map((t) => (
        <button
          key={t.k}
          type="button"
          className={`feed-tab ${tab === t.k ? "on" : ""}`}
          onClick={() => setTab(t.k)}
        >
          {t.i} {t.l}
        </button>
      ))}
      <div style={{ flex: 1 }} />
      <span className="feed-sort">
        Sort by <strong>helpfulness</strong> <IconArrow size={11} />
      </span>
    </div>
  );
}
