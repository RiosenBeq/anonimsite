import type { CSSProperties, ReactNode } from "react";
import type { TopicColor } from "@/lib/types";

interface TagProps {
  tone?: "default" | TopicColor;
  children: ReactNode;
  icon?: ReactNode;
}

export function Tag({ tone = "default", children, icon }: TagProps) {
  const cls = tone === "default" ? "tag" : `tag tag-${tone}`;
  return (
    <span className={cls}>
      {icon}
      {children}
    </span>
  );
}

interface PulseDotProps {
  color?: string;
  style?: CSSProperties;
}

export function PulseDot({ color = "var(--accent)", style }: PulseDotProps) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 10px ${color}`,
        animation: "pulse 1.8s ease-in-out infinite",
        ...style,
      }}
    />
  );
}

interface EyebrowProps {
  children: ReactNode;
  live?: boolean;
}

export function Eyebrow({ children, live = false }: EyebrowProps) {
  return (
    <span className="eyebrow">
      {live && <span className="dot-anim" />}
      {children}
    </span>
  );
}

export function AiMark({ children = "AI · summary" }: { children?: ReactNode }) {
  return <span className="ai-mark">{children}</span>;
}
