"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/ui-shell/sidebar";
import Topbar from "@/components/ui-shell/topbar";
import RightRail from "@/components/ui-shell/right-rail";
import { APP_LAYOUT, SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";
import { PageFrame, PageMain, PageRail } from "@/components/ui-shell/page-layout";
import { isFirstCompanySetupPath, routes, shouldHideRightRail, shouldHideSidebar, shouldUseFocusedFormChrome } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  initialSidebarCollapsed = false,
}: {
  children: React.ReactNode;
  initialSidebarCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMarketingHome = pathname === routes.home;
  const isFirstTimeCompanySetup = isFirstCompanySetupPath(pathname, searchParams.get("mode"));
  const hideRail = shouldHideRightRail(pathname);
  const hideSidebar = shouldHideSidebar(pathname);
  const useFocusedFormChrome = shouldUseFocusedFormChrome(pathname);

  if (isMarketingHome || isFirstTimeCompanySetup) {
    return <div className="min-h-screen bg-[var(--bg-canvas)]">{children}</div>;
  }

  function toggleSidebar() {
    const next = !collapsed;
    setCollapsed(next);
    document.cookie = `${SIDEBAR_COOKIE_KEY}=${next ? "1" : "0"}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg-canvas)]">
      <div className="flex h-full">
        {!hideSidebar || useFocusedFormChrome ? (
          <Sidebar collapsed={useFocusedFormChrome ? true : collapsed} onToggle={toggleSidebar} lockedCollapsed={useFocusedFormChrome} />
        ) : null}

        <div className="min-w-0 flex flex-1 flex-col">
          {!useFocusedFormChrome ? (
            <div className="sticky top-0 z-30 bg-[var(--bg-canvas)]/88 backdrop-blur-sm">
              <div className={cn("mx-auto w-full", APP_LAYOUT.containerMaxWidth, APP_LAYOUT.contentPaddingX)}>
                <Topbar className={APP_LAYOUT.topbarHeight} />
              </div>
            </div>
          ) : null}

          <div className={cn("min-h-0 flex-1 overflow-y-auto", hideSidebar ? "scrollbar-hidden" : "")}>
            <div
              className={cn(
                "mx-auto w-full",
                useFocusedFormChrome ? "max-w-[1120px]" : hideSidebar ? "max-w-[760px]" : APP_LAYOUT.containerMaxWidth,
                APP_LAYOUT.contentPaddingX,
                useFocusedFormChrome ? "pb-0 pt-6" : hideSidebar ? "pb-0 pt-3" : APP_LAYOUT.contentPaddingBottom,
                useFocusedFormChrome ? "" : hideSidebar ? "" : APP_LAYOUT.pageTopSpacing
              )}
            >
              <PageFrame withRail={!hideRail}>
                <PageMain>{children}</PageMain>
                {!hideRail ? (
                  <PageRail>
                    <RightRail />
                  </PageRail>
                ) : null}
              </PageFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
