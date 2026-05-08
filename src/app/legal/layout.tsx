import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="legal-page">
      <Link
        href="/"
        style={{ color: "var(--text-3)", fontSize: 12, textDecoration: "none" }}
      >
        ← Anonim
      </Link>
      <div style={{ marginTop: 16 }}>{children}</div>
    </div>
  );
}
