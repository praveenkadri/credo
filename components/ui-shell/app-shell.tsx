"use client";

import { useState } from "react";
import Sidebar from "@/components/ui-shell/sidebar";
import Topbar from "@/components/ui-shell/topbar";
import RightRail from "@/components/ui-shell/right-rail";
import { SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";

export function AppShell({
  children,
  initialSidebarCollapsed = false,
}: {
  children: React.ReactNode;
  initialSidebarCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE_KEY}=${next ? "1" : "0"}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-canvas)]">
      <div className="flex h-full">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

        <div className="min-w-0 flex flex-1 flex-col">
          <div className="sticky top-0 z-30 bg-[var(--bg-canvas)]/95 backdrop-blur-sm">
            <div className="w-full px-4 md:px-5">
              <Topbar />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="w-full px-4 pb-8 md:px-5 md:pb-10">
              <div className="mt-1.5 grid w-full items-start gap-6 xl:grid-cols-[minmax(0,1fr)_clamp(340px,24vw,414px)]">
                <main className="min-w-0 px-0 md:px-0">{children}</main>
                <RightRail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
