"use client";

import Link from "next/link";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { buttonClassName } from "@/components/ui-primitives/button";
import { createPayrollHref, getPayrollFilters } from "@/lib/payroll-workspace";
import { useContent } from "@/lib/useContent";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function PayrollRightRail() {
  const c = useContent();
  const view = c.runPayroll;
  const searchParams = useSearchParams();
  const filters = getPayrollFilters(searchParams);

  return (
    <div className="flex flex-col">
      <div className="sticky top-6 flex flex-col gap-4 pb-4">
        <RightRailCard title={view.filtersPanel.title} eyebrow={view.filtersPanel.eyebrow} tone="soft" className="shell-enter">
          <div className="space-y-5">
            <FilterGroup
              title={view.filtersPanel.quickLabel}
              items={view.filtersPanel.quickFilters.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.quick === item.id,
                href: createPayrollHref(filters, { quick: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.statusLabel}
              items={view.filtersPanel.statuses.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.status === item.id,
                href: createPayrollHref(filters, { status: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.companyLabel}
              items={view.filtersPanel.companies.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.company === item.id,
                href: createPayrollHref(filters, { company: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.teamLabel}
              items={view.filtersPanel.teams.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.team === item.id,
                href: createPayrollHref(filters, { team: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.employeeLabel}
              items={view.filtersPanel.employees.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.employee === item.id,
                href: createPayrollHref(filters, { employee: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.payrollTypeLabel}
              items={view.filtersPanel.payrollTypes.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.payrollType === item.id,
                href: createPayrollHref(filters, { payrollType: item.id }),
              }))}
            />

            <FilterGroup
              title={view.filtersPanel.dateRangeLabel}
              items={view.filtersPanel.dateRanges.map((item) => ({
                id: item.id,
                label: item.label,
                active: filters.dateRange === item.id,
                href: createPayrollHref(filters, { dateRange: item.id }),
              }))}
            />
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
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link key={item.id} href={item.href} className={cn(buttonClassName(item.active ? "chipActive" : "chip"), "h-8 px-3 text-[12px]")}>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
