"use client";

import Link from "next/link";
import { useMemo } from "react";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { useEmployeesStore } from "@/hooks/useEmployeesStore";
import {
  employeeCompensationSummary,
  formatDateLabel,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { buttonClassName } from "@/components/ui-primitives/button";

export function EmployeeRightRail({ employeeId }: { employeeId: string }) {
  const c = useContent();
  const view = c.employee;
  const { employees } = useEmployeesStore();
  const employee = useMemo(() => employees.find((item) => item.id === employeeId) ?? null, [employeeId, employees]);

  if (!employee) return null;

  return (
    <div className="flex flex-col">
      <div className="sticky top-6 flex flex-col gap-4 pb-4">
        <RightRailCard
          title={view.quickSummary.title}
          eyebrow={view.quickSummary.eyebrow}
          tone="soft"
          className="shell-enter"
        >
          <div className="space-y-4">
            <SummaryRow label={view.rateAmount} value={employeeCompensationSummary(employee)} />
            <SummaryRow label={view.paySchedule} value={payScheduleLabel(view, employee.compensation.paySchedule)} />
            <SummaryRow label={view.startDate} value={formatDateLabel(employee.startDate)} />
            <SummaryRow
              label={view.lastPaidDate}
              value={employee.activity.lastPaidDate ? formatDateLabel(employee.activity.lastPaidDate) : c.common.noDataFallback}
            />
            <span className="inline-flex h-8 items-center rounded-full bg-[var(--action-primary-muted)] px-3 text-[12px] font-medium text-[var(--action-text)]">
              {employee.payrollSettings.eligibleForPayroll ? view.quickSummary.payrollReady : view.quickSummary.payrollExcluded}
            </span>
          </div>
        </RightRailCard>

        <RightRailCard title={view.activity} eyebrow={view.quickSummary.eyebrow} tone="inset" className="shell-enter shell-enter-delay-1">
          <div className="space-y-2.5">
            <Link href={routes.documents} className={`${buttonClassName("secondary")} w-full`}>
              {view.activityLinks.documents}
            </Link>
            <Link href={routes.payroll} className={`${buttonClassName("outline")} w-full`}>
              {view.activityLinks.payrollHistory}
            </Link>
          </div>
        </RightRailCard>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-caption text-neutral-400">{label}</p>
      <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{value}</p>
    </div>
  );
}

function payScheduleLabel(view: ReturnType<typeof useContent>["employee"], paySchedule: string) {
  if (paySchedule === "weekly") return view.weekly;
  if (paySchedule === "monthly") return view.monthly;
  return view.biWeekly;
}
