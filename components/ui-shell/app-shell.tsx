"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Sidebar from "@/components/ui-shell/sidebar";
import Topbar from "@/components/ui-shell/topbar";
import RightRail from "@/components/ui-shell/right-rail";
import { APP_LAYOUT, SIDEBAR_COOKIE_KEY } from "@/components/ui-shell/layout-constants";
import { PageFrame, PageMain, PageRail } from "@/components/ui-shell/page-layout";
import { Button } from "@/components/ui-primitives/button";
import { isAuthPath, isFirstCompanySetupPath, routes, shouldHideRightRail, shouldHideSidebar, shouldUseFocusedFormChrome } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  initialSidebarCollapsed = false,
}: {
  children: React.ReactNode;
  initialSidebarCollapsed?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(initialSidebarCollapsed);
  const [railOpen, setRailOpen] = useState(false);
  const railDialogRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMarketingHome = pathname === routes.home;
  const isAuthRoute = isAuthPath(pathname);
  const isFirstTimeCompanySetup = isFirstCompanySetupPath(pathname, searchParams.get("mode"));
  const hideRail = shouldHideRightRail(pathname);
  const hideSidebar = shouldHideSidebar(pathname);
  const useFocusedFormChrome = shouldUseFocusedFormChrome(pathname);

  useEffect(() => {
    setRailOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!railOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setRailOpen(false);
        return;
      }

      if (event.key !== "Tab" || !railDialogRef.current) {
        return;
      }

      const focusable = Array.from(
        railDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), details summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => {
      const firstFocusable = railDialogRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), details summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    });

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [railOpen]);

  if (isMarketingHome || isAuthRoute || isFirstTimeCompanySetup) {
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
        {!hideSidebar && !useFocusedFormChrome ? (
          <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        ) : null}

        <div className="min-w-0 flex flex-1 flex-col">
          {!useFocusedFormChrome ? (
            <div className="sticky top-0 z-30 bg-[var(--bg-canvas)]">
              <div className={cn("mx-auto w-full", APP_LAYOUT.containerMaxWidth, APP_LAYOUT.contentPaddingX)}>
                <Topbar className={APP_LAYOUT.topbarHeight} />
              </div>
            </div>
          ) : null}

          <div className={cn("min-h-0 flex-1 overflow-y-auto", hideSidebar ? "scrollbar-hidden" : "")}>
            <div
              className={cn(
                "mx-auto w-full",
                useFocusedFormChrome ? APP_LAYOUT.focusedContainerMaxWidth : hideSidebar ? "max-w-[760px]" : APP_LAYOUT.containerMaxWidth,
                APP_LAYOUT.contentPaddingX,
                useFocusedFormChrome ? "pb-0 pt-5" : hideSidebar ? "pb-0 pt-2" : APP_LAYOUT.contentPaddingBottom,
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

      {!hideRail && !useFocusedFormChrome ? (
        <>
          <Button
            type="button"
            variant="floating"
            aria-label="Open actions and filters"
            aria-expanded={railOpen}
            onClick={() => setRailOpen(true)}
            className="bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 h-11 gap-2 rounded-xl px-4 text-[14px] font-semibold xl:hidden"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M3 4.5H13M5 8H11M6.5 11.5H9.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </svg>
            Filters
          </Button>

          {railOpen ? (
            <div className="fixed inset-0 z-[70] xl:hidden" role="dialog" aria-modal="true" aria-label="Actions and filters">
              <button
                type="button"
                aria-label="Close actions and filters"
                className="absolute inset-0 cursor-default bg-black/20"
                onClick={() => setRailOpen(false)}
              />
              <div ref={railDialogRef} className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-y-auto rounded-t-[28px] bg-[#fafaf7] px-3 pb-5 pt-3 shadow-[0_-24px_80px_rgba(31,34,28,0.18)] md:left-auto md:top-0 md:h-full md:max-h-none md:w-[360px] md:rounded-l-[28px] md:rounded-t-none">
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="type-caption text-neutral-500">Actions and filters</p>
                  <Button
                    type="button"
                    variant="toolbarIcon"
                    aria-label="Close actions and filters"
                    onClick={() => setRailOpen(false)}
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                      <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
                    </svg>
                  </Button>
                </div>
                <RightRail />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
