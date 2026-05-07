import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-root">
      <div className="app">
        <div className="ambient" />
        <div className="grid-bg" />
        <Nav />
        <div className="screen-wrap">{children}</div>
        <div className="grain" />
      </div>
    </div>
  );
}
