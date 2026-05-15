"use client";

import Link from "next/link";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { createPayrollHref, getPayrollFilters } from "@/lib/payroll-workspace";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { useSearchParams } from "next/navigation";
import { buttonClassName } from "@/components/ui-primitives/button";

export function PayrollRightRail() {
  const c = useContent();
  const view = c.runPayroll;
  const searchParams = useSearchParams();
  const filters = getPayrollFilters(searchParams);
  const hasActiveFilters = Object.values(filters).some((value) => value !== "all");
  const statusItems = view.filtersPanel.statuses.map((item) => ({
    id: item.id,
    label: item.label,
    active: filters.status === item.id,
    href: createPayrollHref(filters, { status: item.id }),
  }));
  const companyItems = view.filtersPanel.companies.map((item) => ({
    id: item.id,
    label: item.label,
    active: filters.company === item.id,
    href: createPayrollHref(filters, { company: item.id }),
  }));
  const dateRangeItems = view.filtersPanel.dateRanges.map((item) => ({
    id: item.id,
    label: item.label,
    active: filters.dateRange === item.id,
    href: createPayrollHref(filters, { dateRange: item.id }),
  }));
  const moreFilterGroups = [
    {
      title: view.filtersPanel.teamLabel,
      items: view.filtersPanel.teams.map((item) => ({
        id: item.id,
        label: item.label,
        active: filters.team === item.id,
        href: createPayrollHref(filters, { team: item.id }),
      })),
    },
    {
      title: view.filtersPanel.employeeLabel,
      items: view.filtersPanel.employees.map((item) => ({
        id: item.id,
        label: item.label,
        active: filters.employee === item.id,
        href: createPayrollHref(filters, { employee: item.id }),
      })),
    },
    {
      title: view.filtersPanel.payrollTypeLabel,
      items: view.filtersPanel.payrollTypes.map((item) => ({
        id: item.id,
        label: item.label,
        active: filters.payrollType === item.id,
        href: createPayrollHref(filters, { payrollType: item.id }),
      })),
    },
  ];
  const moreFiltersActive = moreFilterGroups.some((group) => group.items.some((item) => item.active && item.id !== "all"));

  return (
    <div className="flex flex-col">
      <div className="sticky top-3 flex flex-col gap-3 pb-4">
        <RightRailCard title={view.filtersPanel.title} eyebrow={view.filtersPanel.eyebrow} tone="soft" className="shell-enter">
          <div className="space-y-4">
            {hasActiveFilters ? (
              <div className="flex justify-end">
                <Link href={routes.payroll} className={buttonClassName("subtle")}>
                  Clear filters
                </Link>
              </div>
            ) : null}

            <FilterGroup title={view.filtersPanel.statusLabel} items={statusItems} />
            <FilterGroup title={view.filtersPanel.companyLabel} items={companyItems} />
            <FilterGroup title={view.filtersPanel.dateRangeLabel} items={dateRangeItems} />

            <details className="border-t border-black/[0.04] pt-3" open={moreFiltersActive ? true : undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-2 py-2 transition-colors duration-[160ms] hover:bg-[#f1f2ef]">
                <span>
                  <span className="type-caption block text-neutral-500">More filters</span>
                  {moreFiltersActive ? <span className="type-caption mt-0.5 block text-[#1f221c]">Additional filters applied</span> : null}
                </span>
                <span className="type-caption text-neutral-400" aria-hidden="true">▾</span>
              </summary>
              <div className="mt-2 space-y-3">
                {moreFilterGroups.map((group) => (
                  <FilterGroup key={group.title} title={group.title} items={group.items} nested />
                ))}
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
  nested = false,
  limit = 4,
}: {
  title: string;
  items: Array<{ id: string; label: string; active: boolean; href: string }>;
  nested?: boolean;
  limit?: number;
}) {
  const activeItem = items.find((item) => item.active) ?? items[0];
  const visibleItems = limitItems(items, limit);
  const hiddenItems = items.filter((item) => !visibleItems.some((visible) => visible.id === item.id));

  return (
    <details className={nested ? "" : "border-t border-black/[0.04] pt-3 first:border-t-0 first:pt-0"} open={activeItem?.id !== "all" ? true : undefined}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-2 py-2 transition-colors duration-[160ms] hover:bg-[#f1f2ef]">
        <span>
          <span className="type-caption block text-neutral-500">{title}</span>
          <span className="type-caption mt-0.5 block text-[#1f221c]">{activeItem?.label ?? "All"}</span>
        </span>
        <span className="type-caption text-neutral-400" aria-hidden="true">▾</span>
      </summary>
      <div className="mt-1 space-y-1">
        <FilterItems items={visibleItems} />
        {hiddenItems.length > 0 ? (
          <details>
            <summary className={`${buttonClassName("rowActionQuiet")} h-8 cursor-pointer list-none px-2`}>
              More
            </summary>
            <div className="mt-1 space-y-1">
              <FilterItems items={hiddenItems} />
            </div>
          </details>
        ) : null}
      </div>
    </details>
  );
}

function FilterItems({ items }: { items: Array<{ id: string; label: string; active: boolean; href: string }> }) {
  return (
    <>
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
    </>
  );
}

function limitItems(items: Array<{ id: string; label: string; active: boolean; href: string }>, limit: number) {
  const visible = items.slice(0, limit);
  const activeItem = items.find((item) => item.active);

  if (!activeItem || visible.some((item) => item.id === activeItem.id)) {
    return visible;
  }

  return [...visible.slice(0, Math.max(limit - 1, 0)), activeItem];
}
