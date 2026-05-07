"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { IconBell, IconPlus, IconSearch } from "@/components/icons";

interface NavLinkSpec {
  href: string;
  label: string;
  match?: (pathname: string) => boolean;
}

const links: NavLinkSpec[] = [
  { href: "/feed", label: "Feed", match: (p) => p === "/feed" },
  { href: "/explore", label: "Explore", match: (p) => p === "/explore" },
  { href: "/q/q1", label: "Reading", match: (p) => p.startsWith("/q") },
  { href: "/feed?tab=saved", label: "Saved" },
  { href: "/feed?tab=for-you", label: "For you" },
];

export function Nav() {
  const pathname = usePathname() ?? "/";

  return (
    <div className="nav">
      <div className="nav-left">
        <Logo />
        <div className="nav-links">
          {links.map((l) => {
            const active = l.match ? l.match(pathname) : false;
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={`nav-link ${active ? "active" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="nav-right">
        <div className="search-mini">
          <IconSearch size={13} />
          <span>Search anything you&apos;d never ask</span>
          <kbd>⌘K</kbd>
        </div>
        <button className="btn btn-ghost" title="Notifications" aria-label="Notifications">
          <IconBell size={15} />
        </button>
        <Link className="btn btn-primary" href="/ask">
          <IconPlus size={13} /> Ask anonymously
        </Link>
        <span className="avatar-pill">
          <span className="av" />
          you · anon
        </span>
      </div>
    </div>
  );
}
