import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="legal-bar" role="contentinfo">
      <span>© Anonim {new Date().getFullYear()}</span>
      <span className="legal-sep">·</span>
      <Link href="/legal/terms">Kullanım</Link>
      <Link href="/legal/privacy">Gizlilik</Link>
      <Link href="/legal/kvkk">KVKK</Link>
      <Link href="/legal/cookies">Çerez</Link>
      <Link href="/legal/community">Topluluk</Link>
      <Link href="/legal/notice-takedown">Bildirim</Link>
      <span className="legal-sep">·</span>
      <Link href="/legal?lang=en" style={{ color: "var(--text-3)" }}>
        EN
      </Link>
    </footer>
  );
}
