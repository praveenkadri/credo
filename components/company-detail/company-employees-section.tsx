"use client";

import Link from "next/link";
import { useMemo } from "react";
import { EntityAvatar } from "@/components/brand/brand-visuals";
import { useEmployeesStore } from "@/hooks/useEmployeesStore";
import { employeeCompensationSummary, employeeInitials } from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { buttonClassName } from "@/components/ui-primitives/button";

export function CompanyEmployeesSection({
  companyId,
}: {
  companyId: string;
}) {
  const { employees } = useEmployeesStore(undefined, companyId);
  const companyEmployees = useMemo(
    () => employees.filter((employee) => employee.companyId === companyId),
    [companyId, employees]
  );
  const previewEmployees = companyEmployees.slice(0, 4);

  return (
    <section className="mt-9 shell-enter shell-enter-delay-2">
      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[var(--credo-ink)]">Employees</h2>
        </div>
        {previewEmployees.length ? (
          <div className="flex flex-wrap gap-2">
            <Link href={routes.companyEmployees(companyId)} className={buttonClassName("secondary")}>
              View all
            </Link>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
        {previewEmployees.length ? (
          previewEmployees.map((employee, index) => (
            <Link
              key={employee.id}
              href={routes.employee(employee.id)}
              className={[
                "flex min-h-[78px] items-center gap-4 px-5 py-4 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[rgba(184,135,79,0.08)]",
                index > 0 ? "border-t border-[rgba(91,77,58,0.1)]" : "",
              ].join(" ")}
            >
              <EntityAvatar type="employee" initials={employeeInitials(employee.name)} size="md" />
              <div className="min-w-0 flex-1">
                <p className="type-body-strong truncate text-[#1f221c]">{employee.name}</p>
                <p className="type-body-small mt-1 truncate text-neutral-600">
                  {[employee.role, employeeCompensationSummary(employee)].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="inline-flex size-5 items-center justify-center text-neutral-400" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="size-4" fill="none">
                  <path d="m6.5 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          ))
        ) : (
          <div className="px-5 py-4">
            <h3 className="text-[15px] font-semibold leading-tight text-[var(--credo-ink)]">No employees yet</h3>
            <p className="mt-1.5 max-w-[520px] text-[13px] leading-[1.45] text-[var(--credo-muted)]">
              Employees connected to this company will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
