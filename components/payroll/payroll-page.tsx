"use client";

import { useMemo, useState } from "react";
import { buttonClassName } from "@/components/ui-primitives/button";
import { RunPayrollModal } from "@/components/payroll/run-payroll-modal";
import {
  filterPayrollRuns,
  formatPayrollDateLabel,
  formatPayrollMoney,
  formatPayrollMonthLabel,
  getPayrollFilters,
  getPayrollRuns,
} from "@/lib/payroll-workspace";
import { useContent } from "@/lib/useContent";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function PayrollPage() {
  const c = useContent();
  const view = c.runPayroll;
  const searchParams = useSearchParams();
  const filters = getPayrollFilters(searchParams);
  const [wizardOpen, setWizardOpen] = useState(false);

  const runs = useMemo(() => getPayrollRuns(view), [view]);
  const filteredRuns = useMemo(() => filterPayrollRuns(runs, filters), [filters, runs]);
  const groupedRuns = useMemo(() => {
    const groups = new Map<string, typeof filteredRuns>();

    filteredRuns.forEach((run) => {
      const key = run.payDate.slice(0, 7);
      const current = groups.get(key) ?? [];
      current.push(run);
      groups.set(key, current);
    });

    return Array.from(groups.entries())
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([key, items]) => ({
        key,
        label: formatPayrollMonthLabel(`${key}-01`),
        items,
      }));
  }, [filteredRuns]);

  return (
    <>
      <div className="w-full pb-12">
        <section className="shell-enter">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="type-eyebrow text-neutral-400">{view.page.eyebrow}</p>
              <h1 className="type-page-title mt-2 md:text-[42px]">{view.page.title}</h1>
              <p className="type-body mt-3 max-w-[720px] text-neutral-600">{view.page.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => setWizardOpen(true)} className={buttonClassName("primary")}>
                {view.actions.runPayroll}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 shell-enter shell-enter-delay-1">
          {groupedRuns.length === 0 ? (
            <div className="rounded-[30px] bg-white/40 px-6 py-10 ring-1 ring-neutral-200/45">
              <div className="mx-auto max-w-[520px] text-center">
                <h2 className="type-card-title text-[#1f221c]">{view.page.empty.title}</h2>
                <p className="type-body mt-3 text-neutral-600">{view.page.empty.description}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {groupedRuns.map((group) => (
                <section key={group.key}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="type-eyebrow text-neutral-500">{group.label}</h2>
                    <span className="type-caption text-neutral-400">
                      {group.items.length} {group.items.length === 1 ? view.page.runCount.single : view.page.runCount.plural}
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-[28px] bg-white/30 ring-1 ring-neutral-200/40">
                    {group.items.map((run, index) => (
                      <div
                        key={run.id}
                        className={cn(
                          "grid gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:items-center md:gap-6",
                          index > 0 && "border-t border-neutral-200/50"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="type-caption inline-flex h-8 items-center rounded-full bg-[var(--action-primary-muted)] px-3 font-medium text-[var(--action-text)]">
                              {run.statusLabel}
                            </span>
                            <span className="type-caption text-neutral-400">{run.payrollTypeLabel}</span>
                          </div>
                          <p className="type-body-strong numeric-tabular mt-2 text-[#1f221c]">{run.payPeriod}</p>
                          <p className="type-body-small mt-1 text-neutral-600">
                            {[run.companyLabel, run.teamLabel, run.employeeSummary, formatPayrollDateLabel(run.payDate)].join(" · ")}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left md:min-w-[220px] md:grid-cols-1 md:text-right">
                          <div>
                            <p className="type-caption text-neutral-400">{view.page.columns.employees}</p>
                            <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{run.employeesCount}</p>
                          </div>
                          <div>
                            <p className="type-caption text-neutral-400">{view.page.columns.total}</p>
                            <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{formatPayrollMoney(run.totalAmount)}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
                          <a href={run.viewHref} target="_blank" rel="noreferrer" className={buttonClassName("ghost") + " h-9 px-4"}>
                            {view.page.actions.view}
                          </a>
                          {run.status === "draft" ? (
                            <button type="button" onClick={() => setWizardOpen(true)} className={buttonClassName("secondary") + " h-9 px-4"}>
                              {view.page.actions.continue}
                            </button>
                          ) : null}
                          <a href={run.downloadHref} download={run.downloadName} className={buttonClassName("outline") + " h-9 px-4"}>
                            {view.page.actions.download}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </div>

      <RunPayrollModal open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
