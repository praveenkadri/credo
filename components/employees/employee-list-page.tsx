"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useEmployeesStore } from "@/hooks/useEmployeesStore";
import {
  employeeCompensationSummary,
  employeeInitials,
  formatDateLabel,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";

export function EmployeeListPage() {
  const c = useContent();
  const view = c.employee;
  const { employees } = useEmployeesStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesFilter = filter === "all" ? true : employee.status === filter;
      const matchesQuery =
        query.trim().length === 0
          ? true
          : [employee.name, employee.role, employee.email]
              .filter(Boolean)
              .join(" ")
              .toLowerCase()
              .includes(query.trim().toLowerCase());

      return matchesFilter && matchesQuery;
    });
  }, [employees, filter, query]);

  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-neutral-400">{view.profileTitle}</p>
            <h1 className="type-page-title mt-2 md:text-[42px]">
              {view.listTitle}
            </h1>
          </div>

          <Link href={routes.employeesNew} className={buttonClassName("primary")}>
            {view.addEmployee}
          </Link>
        </div>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full max-w-[320px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={view.searchPlaceholder}
              className="rounded-full pl-4"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { id: "all", label: view.filters.all },
              { id: "active", label: view.filters.active },
              { id: "inactive", label: view.filters.inactive },
            ] as const).map((option) => (
              <Button
                key={option.id}
                variant={filter === option.id ? "chipActive" : "chip"}
                className="h-8 px-3"
                onClick={() => setFilter(option.id)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 shell-enter shell-enter-delay-1">
        {filteredEmployees.length === 0 ? (
          <div className="rounded-[30px] bg-white/45 px-6 py-10 ring-1 ring-neutral-200/45">
            <div className="mx-auto max-w-[520px] text-center">
              <h2 className="type-card-title text-[#1f221c]">{view.noEmployeesTitle}</h2>
              <p className="type-body mt-3 text-neutral-600">{view.noEmployeesDescription}</p>
              <div className="mt-6 flex justify-center">
                <Link href={routes.employeesNew} className={buttonClassName("secondary")}>
                  {view.addEmployee}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[30px] bg-white/35 ring-1 ring-neutral-200/40">
            {filteredEmployees.map((employee, index) => (
              <Link
                key={employee.id}
                href={routes.employee(employee.id)}
                className={[
                  "flex items-center gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55",
                  index > 0 ? "border-t border-neutral-200/50" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1f1ec] text-[13px] font-medium tracking-[0.02em] text-[var(--action-text)]">
                  {employeeInitials(employee.name)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="type-body-strong truncate text-[#1f221c]">{employee.name}</p>
                    <span className="type-caption inline-flex h-6 items-center rounded-full bg-[var(--action-primary-muted)] px-2.5 font-medium text-[var(--action-text)]">
                      {employee.status === "active" ? view.active : view.inactive}
                    </span>
                  </div>
                  <p className="type-body-small mt-1 text-neutral-600">
                    {[employee.role, employeeCompensationSummary(employee)].filter(Boolean).join(" · ")}
                  </p>
                </div>

                <div className="hidden text-right md:block">
                  <p className="type-caption text-neutral-500">{view.lastPaidDate}</p>
                  <p className="type-body-strong numeric-tabular mt-1 text-[#1f221c]">
                    {employee.activity.lastPaidDate ? formatDateLabel(employee.activity.lastPaidDate) : c.common.noDataFallback}
                  </p>
                </div>

                <span className="text-[18px] text-neutral-400">›</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
