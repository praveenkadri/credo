"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { RightRailSection } from "@/components/overview/right-rail-section";
import { rightRail } from "@/components/overview/overview-data";
import { CompanyRightRailForId } from "@/components/company-detail/company-right-rail";
import { DocumentsRightRail } from "@/components/documents/documents-right-rail";
import { SoftNotice } from "@/components/system/SoftNotice";
import { SkeletonBlock } from "@/components/system/SkeletonBlock";
import { buttonClassName } from "@/components/ui-primitives/button";
import { getRouteCompanyId, isOverviewPath, routes } from "@/lib/routes";

export default function RightRail() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dashboardState, setDashboardState] = useState<{ hasCompanies: boolean; hasActivity: boolean } | null>(null);
  const companyId = useMemo(() => getRouteCompanyId(pathname), [pathname]);

  useEffect(() => {
    if (!isOverviewPath(pathname)) {
      setDashboardState(null);
      return;
    }

    let active = true;

    fetch("/api/dashboard/has-companies")
      .then((response) => response.json() as Promise<{ hasCompanies: boolean; hasActivity: boolean }>)
      .then((payload) => {
        if (active) {
          setDashboardState(payload);
        }
      })
      .catch(() => {
        if (active) {
          setDashboardState({ hasCompanies: true, hasActivity: true });
        }
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  if (companyId) {
    return <CompanyRightRailForId companyId={companyId} />;
  }

  if (pathname.startsWith(routes.documents)) {
    return (
      <DocumentsRightRail
        filters={{
          tab: searchParams.get("tab") ?? "pay-stubs",
          source: searchParams.get("source") ?? "all",
          month: searchParams.get("month") ?? "all",
        }}
      />
    );
  }

  const isDashboardPath = isOverviewPath(pathname);
  const isOverviewEmpty = isDashboardPath && dashboardState?.hasCompanies === false;
  const isOverviewNoActivity = isDashboardPath && dashboardState?.hasCompanies && dashboardState.hasActivity === false;
  const todayItems = isOverviewEmpty ? [] : rightRail.todayItems;
  const nextItems = isOverviewEmpty ? [] : rightRail.nextItems;
  const todayEmptyMessage = isOverviewEmpty ? "No company actions yet" : "No items due today";
  const nextEmptyMessage = isOverviewEmpty
    ? "Add a company to see upcoming payroll and filing deadlines"
    : "No upcoming deadlines";

  if (isDashboardPath && dashboardState === null) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-6 flex flex-col gap-4 pb-4">
          <RightRailCard title="Today" eyebrow="Operational focus" tone="soft" className="shell-enter">
            <SoftNotice
              title="Loading company data…"
              description="We’re preparing your operational view."
              variant="info"
            />
            <SkeletonBlock className="mt-2 h-10" />
            <SkeletonBlock className="mt-2 h-10" />
          </RightRailCard>
          <RightRailCard title="Next" eyebrow="Upcoming" tone="inset" className="shell-enter shell-enter-delay-1">
            <SoftNotice
              title="Loading company data…"
              description="We’re checking upcoming deadlines."
              variant="info"
            />
            <SkeletonBlock className="mt-2 h-10" />
            <SkeletonBlock className="mt-2 h-10" />
          </RightRailCard>
        </div>
      </div>
    );
  }

  if (isOverviewEmpty) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-6 flex flex-col gap-4 pb-4">
          <RightRailCard title="Get started" eyebrow="Setup" tone="soft" className="shell-enter">
            <div className="space-y-3">
              <p className="text-[13px] leading-[1.5] text-neutral-600">
                Add your first company to start tracking payroll, invoices, and activity.
              </p>
              <Link
                href={routes.firstCompanySetup()}
                className={buttonClassName("primary")}
              >
                Add company
              </Link>
            </div>
          </RightRailCard>
        </div>
      </div>
    );
  }

  if (isOverviewNoActivity) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-6 flex flex-col gap-4 pb-4">
          <RightRailCard title="Get started" eyebrow="Next steps" tone="soft" className="shell-enter">
            <div className="space-y-2.5">
              <Link
                href={routes.runPayroll}
                className={`${buttonClassName("secondary")} w-full`}
              >
                Run payroll
              </Link>
              <Link
                href={routes.companiesAlias}
                className={`${buttonClassName("secondary")} w-full`}
              >
                Create invoice
              </Link>
              <Link
                href={routes.companiesAlias}
                className={`${buttonClassName("secondary")} w-full`}
              >
                Add employee
              </Link>
            </div>
          </RightRailCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-6 flex flex-col gap-4 pb-4">
        <RightRailCard title="Today" eyebrow="Operational focus" tone="soft" className="shell-enter">
          <RightRailSection items={todayItems} emptyMessage={todayEmptyMessage} />
        </RightRailCard>

        <RightRailCard
          title="Next"
          eyebrow="Upcoming"
          className="shell-enter shell-enter-delay-1"
          tone="inset"
        >
          <RightRailSection items={nextItems} emptyMessage={nextEmptyMessage} />
        </RightRailCard>
      </div>
    </div>
  );
}
