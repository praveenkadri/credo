"use client";

import { useEffect, useMemo, useState } from "react";
import { BrandIcon, EmptyStateVisual, toneForPayrollStatus } from "@/components/brand/brand-visuals";
import { buttonClassName } from "@/components/ui-primitives/button";
import { EmptyStateHeader } from "@/components/ui-patterns/empty-preview";
import { RunPayrollModal } from "@/components/payroll/run-payroll-modal";
import {
  createPayrollHref,
  filterPayrollRuns,
  formatPayrollMoney,
  formatPayrollMonthLabel,
  getPayrollFilters,
  type PayrollRunRecord,
} from "@/lib/payroll-workspace";
import { routes } from "@/lib/routes";
import type { EmployeeRecord } from "@/lib/data/employees";
import { useContent } from "@/lib/useContent";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function PayrollPage({
  runs,
  companyId,
  companyName,
  employees,
  hasCompanies,
  hasExplicitCompany,
}: {
  runs: PayrollRunRecord[];
  companyId?: string;
  companyName?: string;
  employees: EmployeeRecord[];
  hasCompanies: boolean;
  hasExplicitCompany: boolean;
}) {
  const c = useContent();
  const view = c.runPayroll;
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = getPayrollFilters(searchParams);
  const shouldOpenWizard = searchParams.get("run") === "1";
  const [wizardOpen, setWizardOpen] = useState(shouldOpenWizard);

  const filteredRuns = useMemo(() => filterPayrollRuns(runs, filters), [filters, runs]);
  const hasActiveFilters = Object.values(filters).some((value) => value !== "all");
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

  useEffect(() => {
    if (shouldOpenWizard) {
      setWizardOpen(true);
    }
  }, [shouldOpenWizard]);

  useEffect(() => {
    if (hasExplicitCompany || typeof window === "undefined") return;
    const storedCompanyId = window.localStorage.getItem("credo:selected-company-id");
    if (!storedCompanyId || storedCompanyId === companyId) return;

    const next = new URLSearchParams(searchParams.toString());
    next.set("companyId", storedCompanyId);
    router.replace(`${routes.payroll}?${next.toString()}`, { scroll: false });
  }, [companyId, hasExplicitCompany, router, searchParams]);

  function openWizard() {
    setWizardOpen(true);
    const next = new URLSearchParams(searchParams.toString());
    next.set("run", "1");
    if (companyId) next.set("companyId", companyId);
    router.replace(`${routes.payroll}?${next.toString()}`, { scroll: false });
  }

  function closeWizard() {
    setWizardOpen(false);
    const next = new URLSearchParams(searchParams.toString());
    next.delete("run");
    if (companyId) next.set("companyId", companyId);
    const query = next.toString();
    router.replace(query ? `${routes.payroll}?${query}` : routes.payroll, { scroll: false });
  }

  return (
    <>
      <div className="w-full pb-12">
        <section className="shell-enter">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-start gap-3">
                <BrandIcon icon="payroll" tone="olive" size="md" />
                <div>
                  <h1 className="type-page-title md:text-[42px]">Payroll runs</h1>
                  <p className="type-body mt-3 max-w-[720px] text-neutral-600">
                    Review payroll activity, prepare upcoming runs, and keep payment records connected.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={openWizard} className={buttonClassName("primary")}>
                {view.actions.runPayroll}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-7 shell-enter shell-enter-delay-1">
          <div className="mb-4 flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hidden" aria-label="Payroll quick filters">
            {view.filtersPanel.quickFilters.map((item) => (
              <a
                key={item.id}
                href={createPayrollHref(filters, { quick: item.id })}
                aria-current={filters.quick === item.id ? "true" : undefined}
                className={buttonClassName(filters.quick === item.id ? "chipActive" : "chip")}
              >
                {item.label}
              </a>
            ))}
          </div>

          {groupedRuns.length === 0 ? (
            <div className="rounded-[28px] bg-[#f7f7f4] p-5">
              <EmptyStateHeader
                eyebrow="Payroll readiness"
                title={hasActiveFilters ? view.page.empty.title : "No payroll runs yet"}
                description={
                  hasActiveFilters
                    ? "Payroll runs live here once they are drafted or submitted. The current filters are hiding any matching runs."
                    : "This page tracks drafted and submitted payroll runs. It is empty because no run has been created for this workspace yet."
                }
              />
              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(230px,0.72fr)_minmax(0,1.28fr)]">
                <div className="rounded-[24px] bg-white/60 p-4">
                  <EmptyStateVisual type="payroll" className="mx-0 h-[88px]" />
                  <p className="type-body-small mt-2 text-neutral-600">
                    After setup, this area groups payroll by month with status, employee count, totals, and links to generated records.
                  </p>
                </div>
                <div className="border-t border-black/[0.06] pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
                  <p className="type-caption text-neutral-400">What will appear</p>
                  <p className="type-body mt-2 max-w-[560px] text-neutral-600">
                    Draft and completed runs will collect here by month, with employee count, totals, status, and document links.
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <QuietStatus label="Company" value={hasCompanies ? companyName ?? "Ready" : "Needed"} />
                    <QuietStatus label="Employees" value={employees.length > 0 ? `${employees.length} ready` : "Needed"} />
                    <QuietStatus label="Documents" value="After first run" />
                  </div>
                </div>
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

                  <div className="rounded-[28px] bg-[#fafaf7]">
                    {group.items.map((run, index) => (
                      <div
                        key={run.id}
                        className={cn(
                          "grid gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f3f4ef] md:grid-cols-[minmax(0,1.4fr)_96px_130px_auto] md:items-center md:gap-5",
                          index > 0 && "border-t border-black/[0.04]"
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="type-caption inline-flex h-8 items-center gap-2 rounded-full bg-[#f1f2ef] px-3 font-medium text-[var(--action-text)]">
                              <BrandIcon icon={run.status === "completed" ? "check" : "payroll"} tone={toneForPayrollStatus(run.status)} size="sm" className="size-5 rounded-lg [&_svg]:size-3" />
                              {run.statusLabel}
                            </span>
                            <span className="type-caption text-neutral-400">{run.payrollTypeLabel}</span>
                          </div>
                          <p className="type-body-strong numeric-tabular mt-2 text-[#1f221c]">{run.payPeriod}</p>
                          <div className="type-body-small mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-neutral-600">
                            <a href={routes.company(run.companyId)} className="rounded-md underline-offset-4 hover:text-[#1f221c] hover:underline">
                              {run.companyLabel}
                            </a>
                            <span className="text-neutral-400">·</span>
                            <span>{run.teamLabel}</span>
                            <span className="text-neutral-400">·</span>
                            <span>{run.employeeSummary}</span>
                          </div>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="type-caption text-neutral-400">{view.page.columns.employees}</p>
                          <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{run.employeesCount}</p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="type-caption text-neutral-400">{view.page.columns.total}</p>
                          <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">{formatPayrollMoney(run.totalAmount)}</p>
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
                          {run.status === "draft" ? (
                            <button type="button" onClick={openWizard} className={buttonClassName("rowAction")}>
                              {view.page.actions.continue}
                            </button>
                          ) : run.viewHref ? (
                            <a href={run.viewHref} className={buttonClassName("rowAction")}>
                              {view.page.actions.view}
                            </a>
                          ) : (
                            <button type="button" className={buttonClassName("rowAction")} disabled>
                              {view.page.actions.view}
                            </button>
                          )}
                          {run.viewHref || run.downloadHref ? (
                            <details className="relative z-10">
                              <summary className={`${buttonClassName("rowActionQuiet")} cursor-pointer list-none`}>
                                More
                              </summary>
                              <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[180px] rounded-[20px] bg-[#fafaf7] p-1.5 shadow-[0_1px_1px_rgba(31,34,28,0.02),0_8px_24px_rgba(31,34,28,0.03)]">
                                {run.viewHref ? (
                                <a href={run.viewHref} target="_blank" rel="noreferrer" className={buttonClassName("menuItem")}>
                                  {view.page.actions.view}
                                </a>
                              ) : null}
                                {run.downloadHref ? (
                                  <a href={run.downloadHref} download={run.downloadName} className={buttonClassName("menuItem")}>
                                    {view.page.actions.download}
                                  </a>
                                ) : null}
                              </div>
                            </details>
                          ) : null}
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

      <RunPayrollModal
        open={wizardOpen}
        onClose={closeWizard}
        companyId={companyId}
        companyName={companyName}
        employees={employees}
        hasCompanies={hasCompanies}
      />
    </>
  );
}

function QuietStatus({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-caption text-neutral-400">{label}</p>
      <p className="type-body-small mt-1 font-medium text-[#1f221c]">{value}</p>
    </div>
  );
}
