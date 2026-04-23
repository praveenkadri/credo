"use client";

import { useState } from "react";
import Sidebar from "@/components/ui-shell/sidebar";
import Topbar from "@/components/ui-shell/topbar";
import RightRail from "@/components/ui-shell/right-rail";
import { APP_LAYOUT, SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";
import { PageFrame, PageMain, PageRail } from "@/components/ui-shell/page-layout";

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
            <div className={["w-full", APP_LAYOUT.contentPaddingX].join(" ")}>
              <Topbar />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className={["w-full", APP_LAYOUT.contentPaddingX, APP_LAYOUT.contentPaddingBottom].join(" ")}>
              <PageFrame>
                <PageMain>{children}</PageMain>
                <PageRail>
                  <RightRail />
                </PageRail>
              </PageFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
