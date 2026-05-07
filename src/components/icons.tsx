import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export function IconSearch({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconArrow({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function IconArrowUp({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function IconSpark({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
    </svg>
  );
}

export function IconMsg({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M21 12a8.5 8.5 0 0 1-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1 1 21 12Z" />
    </svg>
  );
}

export function IconEye({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function IconBookmark({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M6 4h12v17l-6-4-6 4Z" />
    </svg>
  );
}

export function IconBell({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconShield({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
    </svg>
  );
}

export function IconPlus({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClose({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconCheck({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2} {...rest}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function IconMore({ size = 14, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...rest}
    >
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

export function IconGlobe({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function IconFilter({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  );
}

export function IconFlame({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M12 3c1 4 5 5 5 10a5 5 0 1 1-10 0c0-2 1-3 2-4-1 4 1 6 3 4-2-3 0-7 0-10Z" />
    </svg>
  );
}

export function IconClock({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconLayers({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M2 13l10 5 10-5M2 18l10 5 10-5" />
    </svg>
  );
}

export function IconGhost({ size = 14, ...rest }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.6} {...rest}>
      <path d="M5 21V11a7 7 0 0 1 14 0v10l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21Z" />
      <circle cx="9.5" cy="11" r="0.8" fill="currentColor" />
      <circle cx="14.5" cy="11" r="0.8" fill="currentColor" />
    </svg>
  );
}
