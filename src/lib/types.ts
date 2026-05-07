export type TopicColor = "accent" | "violet" | "warm" | "lime";

export interface Topic {
  slug: string;
  label: string;
  color: TopicColor;
  count: string;
  desc: string;
  angle: number;
}

export interface Question {
  id: string;
  title: string;
  summary: string;
  topic: string;
  mood: string;
  age: string;
  answers: number;
  views: string;
  pulse: number;
  saves: number;
  featured?: boolean;
}

export interface Answer {
  id: string;
  handle: string;
  helpfulness: number;
  age: string;
  upvotes: number;
  body: string[];
  badge?: string;
}

export interface Notif {
  kind: "answer" | "pulse" | "ask" | "trust";
  text: string;
  topic: string | null;
  time: string;
}
