/**
 * Anonim — static fallbacks.
 *
 * The live data layer lives in `src/lib/queries.ts`, which talks to Supabase.
 * The UI used to render from a hardcoded list; we keep a tiny topic shim here
 * so isomorphic components (e.g. tag tones) can resolve a topic's color
 * without a round-trip when no live row exists yet.
 */

import type { Topic } from "@/lib/types";

export const FALLBACK_TOPICS: Topic[] = [
  {
    slug: "relationships",
    label: "Relationships",
    color: "warm",
    count: "—",
    desc: "Love, friendships, family, distance.",
    angle: 20,
  },
  {
    slug: "career",
    label: "Career",
    color: "accent",
    count: "—",
    desc: "Quitting, switching, stuck, ambition.",
    angle: 70,
  },
  {
    slug: "money",
    label: "Money",
    color: "lime",
    count: "—",
    desc: "Debt, salaries, taboo, freedom.",
    angle: 110,
  },
  {
    slug: "mind",
    label: "The Mind",
    color: "violet",
    count: "—",
    desc: "Anxiety, therapy, growth, doubt.",
    angle: 160,
  },
  {
    slug: "creative",
    label: "Creative",
    color: "accent",
    count: "—",
    desc: "Writing, making, blocks, taste.",
    angle: 210,
  },
  {
    slug: "tech",
    label: "Tech & AI",
    color: "accent",
    count: "—",
    desc: "Building, ethics, futures.",
    angle: 250,
  },
  {
    slug: "philosophy",
    label: "Philosophy",
    color: "violet",
    count: "—",
    desc: "Meaning, ethics, the long view.",
    angle: 290,
  },
  {
    slug: "body",
    label: "The Body",
    color: "warm",
    count: "—",
    desc: "Health, image, intimacy.",
    angle: 330,
  },
];

export function topicMeta(slug: string, topics: Topic[] = FALLBACK_TOPICS): Topic {
  return topics.find((t) => t.slug === slug) ?? FALLBACK_TOPICS[0];
}
