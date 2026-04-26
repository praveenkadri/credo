"use client";

import Link from "next/link";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

type DocumentsFilters = {
  tab: string;
  source: string;
  month: string;
};

export function DocumentsRightRail({ filters }: { filters: DocumentsFilters }) {
  const c = useContent();
  const view = c.documents;

  return (
    <div className="flex flex-col">
      <div className="sticky top-6 flex flex-col gap-4 pb-4">
        <RightRailCard title={view.filters.title} eyebrow={view.filters.eyebrow} tone="soft" className="shell-enter">
          <div className="space-y-5">
            <FilterGroup
              title={view.filters.tabsLabel}
              items={view.tabs.map((tab) => ({
                id: tab.id,
                label: tab.label,
                active: filters.tab === tab.id,
                href: routes.documentsView({
                  tab: tab.id,
                  source: filters.source !== "all" ? filters.source : undefined,
                  month: filters.month !== "all" ? filters.month : undefined,
                }),
              }))}
            />

            <FilterGroup
              title={view.filters.sourceLabel}
              items={view.filters.sources.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.source === item.id,
                href: routes.documentsView({
                  tab: filters.tab,
                  source: item.id !== "all" ? item.id : undefined,
                  month: filters.month !== "all" ? filters.month : undefined,
                }),
              }))}
            />

            <FilterGroup
              title={view.filters.monthLabel}
              items={view.filters.months.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.month === item.id,
                href: routes.documentsView({
                  tab: filters.tab,
                  source: filters.source !== "all" ? filters.source : undefined,
                  month: item.id !== "all" ? item.id : undefined,
                }),
              }))}
            />
          </div>
        </RightRailCard>

        <RightRailCard title={view.actions.title} eyebrow={view.actions.eyebrow} tone="inset" className="shell-enter shell-enter-delay-1">
          <div className="space-y-2.5">
            <Link href={routes.documentsView({ action: "request" })} className={`${buttonClassName("secondary")} w-full`}>
              {view.actions.requestDocuments}
            </Link>
            <Link href={routes.documentsView({ action: "upload" })} className={`${buttonClassName("outline")} w-full`}>
              {view.actions.uploadDocuments}
            </Link>
          </div>
        </RightRailCard>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  items,
}: {
  title: string;
  items: Array<{ id: string; label: string; active: boolean; href: string }>;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.11em] text-neutral-500">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(buttonClassName(item.active ? "chipActive" : "chip"), "h-8 px-3 text-[12px]")}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
