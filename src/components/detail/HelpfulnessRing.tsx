interface HelpfulnessRingProps {
  value: number;
}

export function HelpfulnessRing({ value }: HelpfulnessRingProps) {
  const C = 2 * Math.PI * 18;
  const off = C - (value / 100) * C;
  return (
    <div className="help-ring">
      <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden>
        <circle cx="23" cy="23" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle
          cx="23"
          cy="23"
          r="18"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeDasharray={C}
          strokeDashoffset={off}
          strokeLinecap="round"
          transform="rotate(-90 23 23)"
          style={{ filter: "drop-shadow(0 0 6px var(--accent-glow))" }}
        />
      </svg>
      <span>
        {value}
        <i>%</i>
      </span>
    </div>
  );
}
