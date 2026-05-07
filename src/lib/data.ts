import type { Answer, Notif, Question, Topic } from "./types";

export const TOPICS: Topic[] = [
  {
    slug: "relationships",
    label: "Relationships",
    color: "warm",
    count: "12.4k",
    desc: "Love, friendships, family, distance.",
    angle: 20,
  },
  {
    slug: "career",
    label: "Career",
    color: "accent",
    count: "9.8k",
    desc: "Quitting, switching, stuck, ambition.",
    angle: 70,
  },
  {
    slug: "money",
    label: "Money",
    color: "lime",
    count: "7.1k",
    desc: "Debt, salaries, taboo, freedom.",
    angle: 110,
  },
  {
    slug: "mind",
    label: "The Mind",
    color: "violet",
    count: "11.2k",
    desc: "Anxiety, therapy, growth, doubt.",
    angle: 160,
  },
  {
    slug: "creative",
    label: "Creative",
    color: "accent",
    count: "5.4k",
    desc: "Writing, making, blocks, taste.",
    angle: 210,
  },
  {
    slug: "tech",
    label: "Tech & AI",
    color: "accent",
    count: "8.9k",
    desc: "Building, ethics, futures.",
    angle: 250,
  },
  {
    slug: "philosophy",
    label: "Philosophy",
    color: "violet",
    count: "4.2k",
    desc: "Meaning, ethics, the long view.",
    angle: 290,
  },
  {
    slug: "body",
    label: "The Body",
    color: "warm",
    count: "6.0k",
    desc: "Health, image, intimacy.",
    angle: 330,
  },
];

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    title:
      "How do you tell a partner of seven years that you've fallen out of love — without burning the entire history down?",
    summary:
      "Most answers say: don't lead with the verdict. Lead with the change. 142 people described the exact words they used.",
    topic: "relationships",
    mood: "Tender",
    age: "2h",
    answers: 142,
    views: "9.4k",
    pulse: 12,
    saves: 488,
    featured: true,
  },
  {
    id: "q2",
    title:
      "Has anyone here actually quit a six-figure job for something smaller and stayed happy?",
    summary:
      "31 people did it. 7 came back. The pattern in who stayed happy is not what you'd expect.",
    topic: "career",
    mood: "Curious",
    age: "5h",
    answers: 87,
    views: "6.1k",
    pulse: 4,
    saves: 612,
  },
  {
    id: "q3",
    title: "What's a thing you secretly believe that you'd never say at a dinner party?",
    summary:
      "1.2k answers. The most upvoted ones aren't the spicy takes — they're the quiet ones.",
    topic: "philosophy",
    mood: "Honest",
    age: "1d",
    answers: 1247,
    views: "48k",
    pulse: 28,
    saves: 4100,
  },
  {
    id: "q4",
    title:
      "Therapists of Anonim — what's the one thing you wish your clients understood from session one?",
    summary:
      "84 verified therapists answered. There's strong agreement on three things, and surprising disagreement on one.",
    topic: "mind",
    mood: "Grounding",
    age: "8h",
    answers: 84,
    views: "12.2k",
    pulse: 9,
    saves: 1820,
  },
  {
    id: "q5",
    title:
      "Is anyone else just… not sure they want kids, and tired of pretending the question is open?",
    summary:
      "A long, careful thread. The top answer is from someone who changed their mind both ways.",
    topic: "relationships",
    mood: "Searching",
    age: "11h",
    answers: 318,
    views: "21k",
    pulse: 6,
    saves: 1540,
  },
  {
    id: "q6",
    title: "What did you spend money on in your 30s that genuinely changed your life?",
    summary:
      "Therapy, a mattress, a passport, and silence — in that order. With caveats worth reading.",
    topic: "money",
    mood: "Practical",
    age: "1d",
    answers: 421,
    views: "33k",
    pulse: 3,
    saves: 2230,
  },
  {
    id: "q7",
    title: "How do you stay creative when nobody is watching and nothing is paying?",
    summary:
      "Writers, musicians, and one ceramicist — surprising overlap on what kept them going.",
    topic: "creative",
    mood: "Reflective",
    age: "3h",
    answers: 56,
    views: "3.1k",
    pulse: 7,
    saves: 290,
  },
  {
    id: "q8",
    title: "What's a question you've never been able to ask anyone you know?",
    summary:
      "Anonim asked Anonim. The thread is becoming a small archive of human curiosity.",
    topic: "philosophy",
    mood: "Open",
    age: "4d",
    answers: 2814,
    views: "112k",
    pulse: 41,
    saves: 9800,
    featured: true,
  },
];

export const ANSWERS: Answer[] = [
  {
    id: "a1",
    handle: "Wren · 4y on Anonim",
    helpfulness: 96,
    age: "1h",
    upvotes: 312,
    body: [
      "Don't open with the conclusion. The conclusion is what hurts. Open with the change you've both already noticed but haven't named.",
      "I rehearsed the sentence in the car for two weeks. The version I actually used was: \"I think we've been holding our breath, and I don't want to anymore.\" That gave us a door to walk through together, instead of one of us slamming it on the other.",
      "Seven years is a long history. You don't owe each other a clean ending — only an honest one.",
    ],
    badge: "Top Answer",
  },
  {
    id: "a2",
    handle: "Cipher · 11mo on Anonim",
    helpfulness: 88,
    age: "3h",
    upvotes: 184,
    body: [
      'Couples therapist here (verified). The thing that almost always backfires is treating the conversation as a single event — "the talk." Try treating it as the start of a series of small, honest check-ins.',
      "Also: don't have it tired. Don't have it hungry. Don't have it after a fight. Most of the worst breakups I've witnessed had nothing to do with what was said and everything to do with when.",
    ],
    badge: "Verified",
  },
  {
    id: "a3",
    handle: "Quiet Reader · 2y on Anonim",
    helpfulness: 71,
    age: "6h",
    upvotes: 91,
    body: [
      "I left a 9-year relationship six months ago. The thing nobody told me: grief and relief can coexist. You can be the one ending it and still be wrecked.",
      "Be ready for that. It's not a sign you made the wrong choice.",
    ],
  },
];

export const NOTIFS: Notif[] = [
  { kind: "answer", text: "3 new answers on a question you saved", topic: "career", time: "12m" },
  {
    kind: "pulse",
    text: 'Activity spike on "Therapists of Anonim…"',
    topic: "mind",
    time: "1h",
  },
  {
    kind: "ask",
    text: "Someone is waiting for an answer in The Mind",
    topic: "mind",
    time: "3h",
  },
  {
    kind: "trust",
    text: "Your last answer was marked helpful by 24 people",
    topic: null,
    time: "5h",
  },
];

export function topicMeta(slug: string): Topic {
  return TOPICS.find((t) => t.slug === slug) ?? TOPICS[0];
}

export function questionById(id: string): Question {
  return QUESTIONS.find((q) => q.id === id) ?? QUESTIONS[0];
}
