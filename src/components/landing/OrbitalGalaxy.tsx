"use client";

import { useMemo } from "react";

interface OrbitConf {
  r: number;
  dur: number;
  dir: 1 | -1;
}

interface SampleQuestion {
  o: number;
  t: number;
  label: string;
  topic: string;
}

const ORBITS: OrbitConf[] = [
  { r: 160, dur: 60, dir: 1 },
  { r: 240, dur: 90, dir: -1 },
  { r: 320, dur: 120, dir: 1 },
];

const SAMPLE: SampleQuestion[] = [
  { o: 0, t: 0, label: "Why am I still here?", topic: "mind" },
  { o: 0, t: 120, label: "How do I quit gracefully?", topic: "career" },
  { o: 0, t: 240, label: "Is love a decision?", topic: "relationships" },
  { o: 1, t: 40, label: "What did you spend on at 30?", topic: "money" },
  { o: 1, t: 160, label: "Was it worth the move?", topic: "career" },
  { o: 1, t: 280, label: "Can I tell my mother?", topic: "relationships" },
  { o: 2, t: 30, label: "Do you actually want kids?", topic: "relationships" },
  { o: 2, t: 110, label: "Is it too late to start?", topic: "creative" },
  { o: 2, t: 200, label: "What do you believe at 3am?", topic: "philosophy" },
  { o: 2, t: 290, label: "How do you forgive yourself?", topic: "mind" },
];

export function OrbitalGalaxy() {
  const stars = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const r = 80 + ((i * 9.317) % 320);
        const a = (i * 0.71) % (Math.PI * 2);
        return {
          left: `calc(50% + ${Math.cos(a) * r}px)`,
          top: `calc(50% + ${Math.sin(a) * r}px)`,
          opacity: 0.15 + ((i * 0.137) % 0.5),
          delay: `${(i * 0.21) % 4}s`,
        };
      }),
    [],
  );

  return (
    <div className="orbital">
      {ORBITS.map((o, i) => (
        <div
          key={`r-${i}`}
          className="orbit-ring"
          style={{
            width: o.r * 2,
            height: o.r * 2,
            marginLeft: -o.r,
            marginTop: -o.r,
          }}
        />
      ))}

      {ORBITS.map((o, i) => (
        <div
          key={`g-${i}`}
          className="orbit-spin"
          style={{
            width: o.r * 2,
            height: o.r * 2,
            marginLeft: -o.r,
            marginTop: -o.r,
            animation: `orbit-spin ${o.dur}s linear infinite ${o.dir < 0 ? "reverse" : ""}`,
          }}
        >
          {SAMPLE.filter((s) => s.o === i).map((s, j) => (
            <div
              key={`q-${i}-${j}`}
              className="orbit-q"
              style={{
                transform: `rotate(${s.t}deg) translate(${o.r}px) rotate(${-s.t}deg)`,
                animation: `orbit-spin ${o.dur}s linear infinite ${o.dir < 0 ? "" : "reverse"}`,
              }}
            >
              <div className={`orbit-pill orbit-${s.topic}`}>
                <span className="orbit-q-mark">?</span>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="orbital-core">
        <div className="orbital-core-ring" />
        <div className="orbital-core-ring r2" />
        <div className="orbital-core-dot" />
        <div className="orbital-core-pulse" />
      </div>

      {stars.map((s, i) => (
        <span
          key={`s-${i}`}
          className="star"
          style={{ left: s.left, top: s.top, opacity: s.opacity, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}
