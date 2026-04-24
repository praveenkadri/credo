"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { RightRailSection } from "@/components/overview/right-rail-section";
import { rightRail } from "@/components/overview/overview-data";
import { CompanyRightRailForId } from "@/components/company-detail/company-right-rail";

export default function RightRail() {
  const pathname = usePathname();
  const companyId = useMemo(() => {
    const match = pathname.match(/^\/companies\/([^/]+)$/);
    return match?.[1] ?? null;
  }, [pathname]);

  if (companyId) {
    return <CompanyRightRailForId companyId={companyId} />;
  }

  return (
    <aside className="hidden xl:flex xl:w-[clamp(340px,24vw,414px)] xl:shrink-0 xl:flex-col">
      <div className="sticky top-3 flex flex-col gap-4 px-2 pb-4 pt-0">
        <RightRailCard title="Today" eyebrow="Operational focus" tone="soft" className="shell-enter">
          <RightRailSection items={rightRail.todayItems} emptyMessage="No items due today" />
        </RightRailCard>

        <RightRailCard
          title="Next"
          eyebrow="Upcoming"
          className="shell-enter shell-enter-delay-1"
          tone="inset"
        >
          <RightRailSection items={rightRail.nextItems} emptyMessage="No upcoming deadlines" />
        </RightRailCard>
      </div>
    </aside>
  );
}
