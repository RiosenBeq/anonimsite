import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-root">
      <div className="app">
        <div className="ambient" />
        <div className="grid-bg" />
        <Nav />
        <div className="screen-wrap">{children}</div>
        <SiteFooter />
        <div className="grain" />
      </div>
    </div>
  );
}
