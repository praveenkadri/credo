"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { EntityAvatar } from "@/components/brand/brand-visuals";
import {
  employeeCompensationSummary,
  employeeInitials,
  formatDateLabel,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { cn } from "@/lib/utils";
import type { EmployeeRecord } from "@/lib/data/employees";

const COMPANY_LABELS: Record<string, string> = {
  northline: "Northline Foods",
  willow: "Willow Creative",
  harbor: "Harbor Logistics",
};

export function EmployeeListPage({
  companyId,
  companyName,
  compact = false,
  employees,
}: {
  companyId?: string;
  companyName?: string;
  compact?: boolean;
  employees: EmployeeRecord[];
}) {
  const c = useContent();
  const view = c.employee;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [payrollFilter, setPayrollFilter] = useState<"all" | "ready" | "excluded">("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const companyEmployees = useMemo(
    () => (companyId ? employees.filter((employee) => employee.companyId === companyId) : employees),
    [companyId, employees]
  );

  const filteredEmployees = useMemo(() => {
    return companyEmployees.filter((employee) => {
      const matchesFilter = filter === "all" ? true : employee.status === filter;
      const matchesCompany = companyId || companyFilter === "all" ? true : employee.companyId === companyFilter;
      const matchesPayroll =
        payrollFilter === "all"
          ? true
          : payrollFilter === "ready"
            ? employee.payrollSettings.eligibleForPayroll
            : !employee.payrollSettings.eligibleForPayroll;
      const matchesRole = roleFilter === "all" ? true : employee.role === roleFilter || employee.department === roleFilter;
      const matchesQuery =
        query.trim().length === 0
          ? true
          : [employee.name, employee.role, employee.email]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(query.trim().toLowerCase());

      return matchesFilter && matchesCompany && matchesPayroll && matchesRole && matchesQuery;
    });
  }, [companyEmployees, companyFilter, companyId, filter, payrollFilter, query, roleFilter]);

  const companyOptions = useMemo(() => {
    return Array.from(new Set(companyEmployees.map((employee) => employee.companyId).filter(Boolean) as string[]));
  }, [companyEmployees]);

  const roleOptions = useMemo(() => {
    return Array.from(new Set(companyEmployees.flatMap((employee) => [employee.department, employee.role]).filter(Boolean) as string[])).slice(0, 8);
  }, [companyEmployees]);

  const hasActiveFilters = query.trim().length > 0 || filter !== "all" || companyFilter !== "all" || payrollFilter !== "all" || roleFilter !== "all";

  const totalEmployees = companyEmployees.length;
  const activeEmployees = companyEmployees.filter((employee) => employee.status === "active").length;
  const payrollReadyCount = companyEmployees.filter((employee) => employee.payrollSettings.eligibleForPayroll).length;
  const listTitle = companyName ? "Company team" : "Employees";

  return (
    <div className="w-full pb-12">
      <section className="shell-enter pb-5 pt-3 md:pb-7 md:pt-5">
        {companyId ? (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Link href={routes.company(companyId)} className={buttonClassName("secondary")}>
              <span aria-hidden="true">←</span> Back to company
            </Link>
            <span className="type-caption text-neutral-400">{companyName} / Employees</span>
          </div>
        ) : null}

        <div className="max-w-[720px]">
          <p className="text-[12px] font-medium leading-tight text-[var(--credo-muted-strong)]">
            {companyName ? "Company team workspace" : "Team workspace"}
          </p>
          <h1 className="mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--credo-ink)] md:text-[42px]">
            {listTitle}
          </h1>
          <p className="mt-3 max-w-[640px] text-[15px] font-medium leading-[1.45] text-[var(--credo-muted-strong)]">
            {companyName
              ? "Manage employee profiles, payroll readiness, and generated records for this company."
              : "Manage employee profiles, payroll readiness, and generated records."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium leading-none text-[var(--credo-muted)]">
            <span className="rounded-full bg-[var(--credo-bronze-soft)] px-3 py-1.5 text-[var(--credo-green-950)]">
              {totalEmployees} {totalEmployees === 1 ? "employee" : "employees"}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
            <span>{activeEmployees} active</span>
            <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
            <span className={payrollReadyCount > 0 ? "text-[var(--credo-green-800)]" : ""}>
              {payrollReadyCount > 0 ? `${payrollReadyCount} payroll ready` : "Payroll setup pending"}
            </span>
          </div>
        </div>

        <div className="mt-7 rounded-[22px] bg-[var(--credo-surface-warm)] p-2.5 shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[var(--credo-border)]">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <div className="w-full lg:max-w-[300px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={view.searchPlaceholder}
              className="h-9 rounded-[14px] border-0 bg-[var(--credo-cream)] pl-3.5 text-[13px] shadow-none ring-1 ring-[rgba(91,77,58,0.1)] placeholder:text-[var(--credo-muted)] hover:bg-[var(--credo-cream-strong)] focus:bg-[var(--credo-cream)]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {([
              { id: "all", label: view.filters.all },
              { id: "active", label: view.filters.active },
              { id: "inactive", label: view.filters.inactive },
            ] as const).map((option) => (
              <Button
                key={option.id}
                variant={filter === option.id ? "chipActive" : "chip"}
                className={cn(
                  "h-8 px-3",
                  filter === option.id
                    ? "bg-[var(--credo-taupe)] text-[var(--credo-green-950)] shadow-[inset_0_0_0_1px_rgba(91,77,58,0.08)]"
                    : "text-[var(--credo-muted)] hover:bg-[var(--credo-taupe-wash)] hover:text-[var(--credo-ink)]"
                )}
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-1 flex-wrap gap-1.5 lg:justify-end">
            {!companyId ? (
              <FilterSelect label="Company" value={companyFilter} onChange={setCompanyFilter}>
                <option value="all">All companies</option>
                {companyOptions.map((id) => (
                  <option key={id} value={id}>{COMPANY_LABELS[id] ?? id}</option>
                ))}
              </FilterSelect>
            ) : null}

            <FilterSelect label="Payroll" value={payrollFilter} onChange={(value) => setPayrollFilter(value as typeof payrollFilter)}>
              <option value="all">Payroll readiness</option>
              <option value="ready">Payroll ready</option>
              <option value="excluded">Excluded</option>
            </FilterSelect>

            {roleOptions.length ? (
              <FilterSelect label="Role" value={roleFilter} onChange={setRoleFilter}>
                <option value="all">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </FilterSelect>
            ) : null}

            {hasActiveFilters ? (
              <button
                type="button"
                className={`${buttonClassName("subtle")} h-8 rounded-full px-3 text-[12px] text-[var(--credo-muted)] hover:bg-[var(--credo-taupe-wash)] hover:text-[var(--credo-ink)]`}
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  setCompanyFilter("all");
                  setPayrollFilter("all");
                  setRoleFilter("all");
                }}
              >
                Clear filters
              </button>
            ) : null}
          </div>
          </div>
        </div>
      </section>

      <section className="mt-2 shell-enter shell-enter-delay-1">
        {filteredEmployees.length === 0 ? (
          <div className="rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
            <h2 className="text-[15px] font-semibold leading-tight text-[var(--credo-ink)]">
              {hasActiveFilters ? "No employees match these filters" : "No employees yet"}
            </h2>
            <p className="mt-1.5 max-w-[560px] text-[13px] leading-[1.45] text-[var(--credo-muted)]">
              {hasActiveFilters
                ? "The current filters are hiding any available employee profiles."
                : "Employee profiles will appear here once they are added."}
            </p>
            <div className="mt-4 grid gap-4 border-t border-[rgba(91,77,58,0.1)] pt-4 md:grid-cols-3">
              <QuietStatus label="Profiles" value={hasActiveFilters ? "Filtered" : "None yet"} />
              <QuietStatus label="Payroll" value="After setup" />
              <QuietStatus label="Documents" value="After records" />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
            {(compact ? filteredEmployees.slice(0, 5) : filteredEmployees).map((employee, index) => (
              <Link
                key={employee.id}
                href={routes.employee(employee.id)}
                className={[
                  "group flex items-center gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[rgba(184,135,79,0.08)]",
                  index > 0 ? "border-t border-[rgba(91,77,58,0.1)]" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <EntityAvatar type="employee" initials={employeeInitials(employee.name)} size="md" />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="type-body-strong truncate text-[#1f221c]">{employee.name}</p>
                    <span className="type-caption inline-flex h-6 items-center rounded-full bg-[var(--credo-bronze-soft)] px-2.5 font-medium text-[var(--credo-green-950)]">
                      {employee.status === "active" ? view.active : view.inactive}
                    </span>
                  </div>
                  <p className="type-body-small mt-1 truncate text-[var(--credo-muted)]">
                    {[
                      employee.companyId ? COMPANY_LABELS[employee.companyId] ?? employee.companyId : undefined,
                      employee.role,
                      employeeCompensationSummary(employee),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>

                <div className="hidden min-w-[132px] text-right md:block">
                  <p className="type-caption text-[var(--credo-muted)]">Payroll</p>
                  <p className="type-body-strong mt-1 text-[#1f221c]">
                    {employee.payrollSettings.eligibleForPayroll ? "Ready" : "Excluded"}
                  </p>
                </div>

                <div className="hidden min-w-[132px] text-right lg:block">
                  <p className="type-caption text-[var(--credo-muted)]">{view.lastPaidDate}</p>
                  <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">
                    {employee.activity.lastPaidDate ? formatDateLabel(employee.activity.lastPaidDate) : c.common.noDataFallback}
                  </p>
                </div>

                <span className="inline-flex size-5 shrink-0 items-center justify-center text-[var(--credo-bronze-700)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" aria-hidden="true">
                  <svg viewBox="0 0 16 16" className="size-4" fill="none">
                    <path d="m6.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuietStatus({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-caption text-[var(--credo-muted)]">{label}</p>
      <p className="type-body-small mt-1 font-medium text-[#1f221c]">{value}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-8 rounded-full border-0 bg-[var(--credo-cream)] px-3 text-[12px] font-medium text-[var(--credo-muted)] ring-1 ring-[rgba(91,77,58,0.1)]",
          "transition-colors duration-[160ms] hover:bg-[var(--credo-taupe-wash)] hover:text-[var(--credo-ink)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        )}
      >
        {children}
      </select>
    </label>
  );
}
