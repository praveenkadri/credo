"use client";

import Link from "next/link";
import {
  formatDateLabel,
  type EmployeeRecord,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { SoftNotice } from "@/components/system/SoftNotice";

const COMPANY_LABELS: Record<string, string> = {
  northline: "Northline Foods",
  willow: "Willow Creative",
  harbor: "Harbor Logistics",
};

export function EmployeeProfilePage({ employee }: { employee: EmployeeRecord | null }) {
  const c = useContent();
  const view = c.employee;

  if (!employee) {
    return (
      <div className="w-full pb-12">
        <section className="mt-2 px-6 py-5">
          <SoftNotice title={view.noEmployeesTitle} description={view.noEmployeesDescription} variant="warning" />
        </section>
      </div>
    );
  }

  const profileState = getEmployeeProfileState(employee);
  const statusLabel = employee.status === "active" ? view.active : view.inactive;
  const primaryLine = employee.role?.trim() || (employee.status === "active" ? "Active employee" : statusLabel);
  const supportLine = getProfileSupportLine(employee, profileState);
  const companyLabel = employee.companyId ? COMPANY_LABELS[employee.companyId] ?? employee.companyId : "";

  return (
    <div className="w-full pb-12">
      <header className="shell-enter pb-5 pt-3 md:pb-7 md:pt-5">
        <div className="max-w-[720px]">
          <p className="text-[12px] font-medium leading-tight text-[var(--credo-muted-strong)]">Employee profile</p>
          <p className="mt-4 text-[38px] font-semibold leading-[1.04] tracking-[-0.022em] text-[var(--credo-ink)] md:text-[46px]">
            {primaryLine}
          </p>
          <p className="mt-4 text-[15px] font-medium leading-[1.45] text-[var(--credo-muted-strong)]">
            {supportLine}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium leading-none text-[var(--credo-muted)]">
            <span className="rounded-full bg-[var(--credo-bronze-soft)] px-3 py-1.5 text-[var(--credo-green-950)]">
              {profileState.completed} of {profileState.total} complete
            </span>
            {employee.startDate ? (
              <>
                <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
                <span>Started {formatDateLabel(employee.startDate)}</span>
              </>
            ) : null}
            <span className="hidden h-1 w-1 rounded-full bg-[var(--credo-taupe-strong)] sm:inline-block" aria-hidden="true" />
            <span className="text-[var(--credo-green-800)]">{statusLabel}</span>
          </div>
        </div>
      </header>

      <div className="mt-3 space-y-9">
        <EmployeeSection title="Recent activity" delay="shell-enter-delay-1">
          {employee.activity.lastPaidDate ? (
            <div className="overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
              <InfoRow label="Last payroll activity" value={formatDateLabel(employee.activity.lastPaidDate)} />
            </div>
          ) : (
            <CompactEmptyState
              title="No recent activity yet"
              copy="Employee updates and payroll changes will appear here."
            />
          )}
        </EmployeeSection>

        <EmployeeSection title="Payroll history" delay="shell-enter-delay-2">
          {employee.activity.lastPaidDate ? (
            <div className="overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
              <InfoRow label={view.lastPaidDate} value={formatDateLabel(employee.activity.lastPaidDate)} />
            </div>
          ) : (
            <CompactEmptyState
              title="No payroll runs yet"
              copy="Payroll runs for this employee will appear here."
            />
          )}
        </EmployeeSection>

        <EmployeeSection title="Documents" delay="shell-enter-delay-2">
          <CompactEmptyState
            title="No documents yet"
            copy="Generated pay stubs and employee documents will appear here."
          />
        </EmployeeSection>

        <EmployeeSection title={view.employmentDetails} delay="shell-enter-delay-2">
          {hasEmploymentDetails(employee) ? (
            <div className="overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] shadow-[0_1px_0_rgba(255,255,255,0.74)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
              {companyLabel ? (
                <Link
                  href={routes.company(employee.companyId ?? "")}
                  className="group flex min-h-[62px] items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-[180ms] hover:bg-[rgba(184,135,79,0.08)]"
                >
                  <span className="min-w-0">
                    <span className="block text-[12px] leading-tight text-[var(--credo-muted)]">Company</span>
                    <span className="mt-1 block truncate text-[13px] font-medium text-[var(--credo-ink)]">{companyLabel}</span>
                  </span>
                  <ArrowIcon className="size-4 shrink-0 text-[var(--credo-bronze-700)] transition-colors group-hover:text-[var(--credo-green-800)]" />
                </Link>
              ) : null}
              <InfoRow label={view.role} value={employee.role || c.common.noDataFallback} divided={Boolean(companyLabel)} />
              <InfoRow label={view.employmentType} value={employmentTypeLabel(view, employee.employmentType)} divided />
              <InfoRow label={view.department} value={employee.department || c.common.noDataFallback} divided />
              <InfoRow label={view.workLocation} value={employee.workLocation || c.common.noDataFallback} divided />
              <InfoRow label={view.workSchedule} value={formatWorkSchedule(employee)} divided />
            </div>
          ) : (
            <CompactEmptyState
              title="No employment details yet"
              copy="Employment information connected to this employee will appear here."
            />
          )}
        </EmployeeSection>
      </div>
    </div>
  );
}

function EmployeeSection({
  title,
  children,
  delay,
}: {
  title: string;
  children: React.ReactNode;
  delay?: string;
}) {
  return (
    <section className={["shell-enter", delay, "mt-3"].filter(Boolean).join(" ")}>
      <h2 className="mb-4 text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[var(--credo-ink)]">{title}</h2>
      {children}
    </section>
  );
}

function CompactEmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.72)_inset] ring-1 ring-[rgba(91,77,58,0.1)]">
      <h3 className="text-[15px] font-semibold leading-tight text-[var(--credo-ink)]">{title}</h3>
      <p className="mt-1.5 max-w-[520px] text-[13px] leading-[1.45] text-[var(--credo-muted)]">{copy}</p>
    </div>
  );
}

function InfoRow({ label, value, divided = false }: { label: string; value: string; divided?: boolean }) {
  return (
    <div className={["flex min-h-[58px] items-center justify-between gap-4 px-5 py-3.5", divided ? "border-t border-[rgba(91,77,58,0.1)]" : ""].join(" ")}>
      <span className="text-[12px] leading-tight text-[var(--credo-muted)]">{label}</span>
      <span className="min-w-0 max-w-[62%] truncate text-right text-[13px] font-medium leading-tight text-[var(--credo-ink)]">{value}</span>
    </div>
  );
}

function employmentTypeLabel(view: ReturnType<typeof useContent>["employee"], employmentType: string) {
  if (employmentType === "partTime") return view.partTime;
  if (employmentType === "contractor") return view.contractor;
  return view.fullTime;
}

function getEmployeeProfileState(employee: EmployeeRecord) {
  const checks = [
    Boolean(employee.name?.trim() && employee.email?.trim()),
    Boolean(employee.role?.trim() && employee.startDate),
    Boolean(employee.compensation.rateAmount > 0 && employee.compensation.paySchedule),
    Boolean(employee.payrollSettings.eligibleForPayroll && employee.identity.taxProvince),
  ];

  return {
    completed: checks.filter(Boolean).length,
    total: checks.length,
    profileComplete: checks[0] && checks[1],
    payrollComplete: checks[2] && checks[3],
  };
}

function getProfileSupportLine(
  employee: EmployeeRecord,
  state: ReturnType<typeof getEmployeeProfileState>
) {
  if (employee.status === "inactive") return "Inactive employee";
  if (!state.profileComplete) return "Payroll setup pending";
  if (!state.payrollComplete) return "Payroll details pending";
  if (employee.payrollSettings.eligibleForPayroll) return "Payroll ready";
  return "Payroll setup pending";
}

function hasEmploymentDetails(employee: EmployeeRecord) {
  return Boolean(
    employee.companyId ||
      employee.role ||
      employee.startDate ||
      employee.department ||
      employee.workLocation ||
      employee.workSchedule.workingDays.length
  );
}

function formatWorkSchedule(employee: EmployeeRecord) {
  const hours = employee.workSchedule.hoursPerWeek ? `${employee.workSchedule.hoursPerWeek} hrs/week` : "";
  const days = employee.workSchedule.workingDays.length ? employee.workSchedule.workingDays.join(", ") : "";
  return [hours, days].filter(Boolean).join(" · ") || "Not provided";
}

function ArrowIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="m6.25 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
