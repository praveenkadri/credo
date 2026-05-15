"use client";

import Link from "next/link";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { buttonClassName } from "@/components/ui-primitives/button";
import { createDocumentsHref, getDocumentsFilters } from "@/lib/documents-workspace";
import { useContent } from "@/lib/useContent";
import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";

export function DocumentsRightRail() {
  const c = useContent();
  const view = c.documents;
  const searchParams = useSearchParams();
  const filters = getDocumentsFilters(searchParams);
  const hasAdvancedFilters =
    filters.company !== "all" ||
    filters.team !== "all" ||
    filters.employee !== "all" ||
    filters.dateRange !== "all" ||
    filters.status !== "all";
  const hasActiveFilters = filters.quick !== "all" || hasAdvancedFilters;

  return (
    <div className="flex flex-col">
      <div className="sticky top-3 flex flex-col gap-3 pb-4">
        <RightRailCard title={view.filters.title} eyebrow={view.filters.eyebrow} tone="soft" className="shell-enter">
          <div className="space-y-4">
            {hasActiveFilters ? (
              <div className="flex justify-end">
                <Link href={routes.documents} className={buttonClassName("subtle")}>
                  Clear filters
                </Link>
              </div>
            ) : null}

            <FilterGroup
              title={view.filters.quickLabel}
              items={view.filters.quickFilters.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.quick === item.id,
                href: createDocumentsHref(filters, { quick: item.id }),
              }))}
            />

            <details className="border-t border-black/[0.04] pt-3" open={hasAdvancedFilters ? true : undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-2 py-2 transition-colors duration-[160ms] hover:bg-[#f1f2ef]">
                <span>
                  <span className="type-caption block text-neutral-500">Advanced filters</span>
                  <span className="type-caption mt-0.5 block text-[#1f221c]">
                    {hasAdvancedFilters ? "Additional filters applied" : "Company, team, employee, date, status"}
                  </span>
                </span>
                <span className="type-caption text-neutral-400" aria-hidden="true">v</span>
              </summary>
              <div className="mt-3 space-y-4">
                <FilterGroup
                  title={view.filters.companyLabel}
                  items={view.filters.companies.map((item) => ({
                    id: item.id,
                    label: item.label,
                    active: filters.company === item.id,
                    href: createDocumentsHref(filters, { company: item.id }),
                  }))}
                />

                <FilterGroup
                  title={view.filters.teamLabel}
                  items={view.filters.teams.map((item) => ({
                    id: item.id,
                    label: item.label,
                    active: filters.team === item.id,
                    href: createDocumentsHref(filters, { team: item.id }),
                  }))}
                />

                <FilterGroup
                  title={view.filters.employeeLabel}
                  items={view.filters.employees.map((item) => ({
                    id: item.id,
                    label: item.label,
                    active: filters.employee === item.id,
                    href: createDocumentsHref(filters, { employee: item.id }),
                  }))}
                />

                <FilterGroup
                  title={view.filters.dateRangeLabel}
                  items={view.filters.dateRanges.map((item) => ({
                    id: item.id,
                    label: item.label,
                    active: filters.dateRange === item.id,
                    href: createDocumentsHref(filters, { dateRange: item.id }),
                  }))}
                />

                <FilterGroup
                  title="Status"
                  items={[
                    { id: "all", label: "All statuses" },
                    { id: "generated", label: "Generated" },
                    { id: "ready", label: "Ready" },
                  ].map((item) => ({
                    id: item.id,
                    label: item.label,
                    active: filters.status === item.id,
                    href: createDocumentsHref(filters, { status: item.id }),
                  }))}
                />
              </div>
            </details>
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
      <p className="type-caption mb-2 text-neutral-500">{title}</p>
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            aria-current={item.active ? "true" : undefined}
            className={`${buttonClassName("segmentedItem")} h-auto w-full justify-start rounded-xl px-2 py-2 text-left`}
          >
            <span className="type-body-small">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
