import Link from "next/link";
import { useId } from "react";

interface LogoMarkProps {
  size?: number;
  animate?: boolean;
  glow?: boolean;
}

export function LogoMark({ size = 28, animate = true, glow = true }: LogoMarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const R = 13.5;
  const C = 2 * Math.PI * R;
  const gap = 7.5;
  const dash = `${C - gap} ${gap}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={`logo-mark${animate ? " logo-mark-animate" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
          <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.7" />
        </radialGradient>
        <radialGradient id={`${uid}-halo`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.55" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.12" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {glow && <circle cx="17.4" cy="16.6" r="11" fill={`url(#${uid}-halo)`} />}

      <circle
        className="lm-ring"
        cx="16"
        cy="16"
        r={R}
        stroke="currentColor"
        strokeWidth="0.9"
        strokeOpacity="0.55"
        strokeLinecap="round"
        strokeDasharray={dash}
        transform="rotate(-58 16 16)"
      />

      <circle cx="16" cy="16" r="8.2" stroke="currentColor" strokeWidth="0.65" strokeOpacity="0.28" />

      <circle cx="17.4" cy="16.6" r="3.6" fill={`url(#${uid}-core)`} />
      <circle
        cx="17.4"
        cy="16.6"
        r="3.6"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.4"
        strokeOpacity="0.9"
      />

      <g className="lm-orbit">
        <circle cx="29.5" cy="16" r="1.35" fill="currentColor" opacity="0.85" />
      </g>
    </svg>
  );
}

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  href?: string;
}

export function Logo({ size = 28, withWordmark = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className="brand">
      <LogoMark size={size} />
      {withWordmark && (
        <span className="brand-word">
          anonim<span className="brand-dot">.</span>
        </span>
      )}
    </Link>
  );
}
