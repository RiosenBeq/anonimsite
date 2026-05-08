import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { AppShell } from "@/components/AppShell";

import "./globals.css";
import "@/styles/landing.css";
import "@/styles/feed.css";
import "@/styles/detail.css";
import "@/styles/ask.css";
import "@/styles/explore.css";
import "@/styles/legal.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anonim — Ask what you can't ask anywhere else.",
  description:
    "Anonim is a quiet, anonymous place for the questions you carry around but never quite say out loud. Honest answers, from people who've been there.",
  applicationName: "Anonim",
  authors: [{ name: "Anonim" }],
  keywords: [
    "anonymous questions",
    "honest answers",
    "anonim",
    "community",
    "Q&A",
    "privacy first",
  ],
  openGraph: {
    title: "Anonim — Ask what you can't ask anywhere else.",
    description:
      "A quiet, anonymous place for the questions you carry around but never quite say out loud.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='13.5' fill='none' stroke='%23e6e8ee' stroke-opacity='0.55' stroke-width='1' stroke-dasharray='77 7.8' transform='rotate(-58 16 16)'/><circle cx='16' cy='16' r='8.2' fill='none' stroke='%23e6e8ee' stroke-opacity='0.28' stroke-width='0.7'/><circle cx='17.4' cy='16.6' r='3.8' fill='%2322d3ee'/><circle cx='29.5' cy='16' r='1.4' fill='%23e6e8ee'/></svg>",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 1440,
  initialScale: 1,
  themeColor: "#07080c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
