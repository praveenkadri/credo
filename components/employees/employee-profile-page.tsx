"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEmployeesStore } from "@/hooks/useEmployeesStore";
import {
  employeeCompensationSummary,
  employeeInitials,
  formatDateLabel,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { buttonClassName } from "@/components/ui-primitives/button";
import { SoftNotice } from "@/components/system/SoftNotice";

export function EmployeeProfilePage({ employeeId }: { employeeId: string }) {
  const c = useContent();
  const view = c.employee;
  const router = useRouter();
  const { employees, deactivateEmployee } = useEmployeesStore();
  const employee = useMemo(() => employees.find((item) => item.id === employeeId) ?? null, [employeeId, employees]);

  if (!employee) {
    return (
      <div className="w-full pb-12">
        <section className="mt-2 px-6 py-5">
          <SoftNotice title={view.noEmployeesTitle} description={view.noEmployeesDescription} variant="warning" />
        </section>
      </div>
    );
  }

  return (
    <div className="w-full pb-12">
      <header className="shell-enter">
        <Link href={routes.employees} className={buttonClassName("secondary")}>
          ← {view.listTitle}
        </Link>

        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1f1ec] text-[16px] font-medium tracking-[0.02em] text-[var(--action-text)]">
              {employeeInitials(employee.name)}
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="type-page-title">{employee.name}</h1>
                <span className="type-caption inline-flex h-7 items-center rounded-full bg-[var(--action-primary-muted)] px-3 font-medium text-[var(--action-text)]">
                  {employee.status === "active" ? view.active : view.inactive}
                </span>
              </div>
              <p className="type-body mt-2 text-neutral-600">
                {[employee.role, employee.email].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                deactivateEmployee(employee.id);
                router.refresh();
              }}
              className={buttonClassName("outline")}
            >
              {view.deactivate}
            </button>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <EmployeeSection title={view.employmentDetails} editHref={routes.employeeEditSection(employee.id, "employment")}>
          <SectionGrid
            items={[
              { label: view.role, value: employee.role || c.common.noDataFallback },
              { label: view.startDate, value: formatDateLabel(employee.startDate) },
              { label: view.employmentType, value: employmentTypeLabel(view, employee.employmentType) },
              { label: view.department, value: employee.department || c.common.noDataFallback },
              { label: view.workLocation, value: employee.workLocation || c.common.noDataFallback },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.personalDetails} editHref={routes.employeeEditSection(employee.id, "personal")}>
          <SectionGrid
            items={[
              { label: view.fullName, value: employee.name },
              { label: view.email, value: employee.email || c.common.noDataFallback },
              { label: view.phone, value: employee.phone || c.common.noDataFallback },
              { label: view.employeeAddress, value: formatAddress(employee) || c.common.noDataFallback },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.taxAndIdentity} editHref={routes.employeeEditSection(employee.id, "identity")}>
          <SectionGrid
            items={[
              { label: view.sin, value: maskSin(employee.identity.sin) || c.common.noDataFallback },
              { label: view.sinExpiryDate, value: employee.identity.sinExpiryDate ? formatDateLabel(employee.identity.sinExpiryDate) : c.common.noDataFallback },
              { label: view.dateOfBirth, value: employee.identity.dateOfBirth ? formatDateLabel(employee.identity.dateOfBirth) : c.common.noDataFallback },
              { label: view.taxProvince, value: employee.identity.taxProvince || c.common.noDataFallback },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.compensation} editHref={routes.employeeEditSection(employee.id, "compensation")}>
          <SectionGrid
            items={[
              { label: view.rateType, value: rateTypeLabel(view, employee.compensation.rateType) },
              { label: view.rateAmount, value: employeeCompensationSummary(employee) },
              { label: view.paySchedule, value: payScheduleLabel(view, employee.compensation.paySchedule) },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.workSchedule} editHref={routes.employeeEditSection(employee.id, "compensation")}>
          <SectionGrid
            items={[
              { label: view.hoursPerDay, value: String(employee.workSchedule.hoursPerDay) },
              { label: view.hoursPerWeek, value: String(employee.workSchedule.hoursPerWeek) },
              { label: view.workingDays, value: employee.workSchedule.workingDays.join(", ") },
              {
                label: view.overrides,
                value: employee.workSchedule.overrides.length ? employee.workSchedule.overrides.join(", ") : c.common.noDataFallback,
              },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.payrollSettings} editHref={routes.employeeEditSection(employee.id, "payroll")}>
          <SectionGrid
            items={[
              { label: view.eligibleForPayroll, value: employee.payrollSettings.eligibleForPayroll ? view.active : view.inactive },
              { label: view.defaultInPayroll, value: employee.payrollSettings.defaultInPayroll ? view.active : view.inactive },
              { label: view.paymentMethod, value: employee.payrollSettings.paymentMethod || view.paymentMethodPlaceholder },
              { label: view.taxProfile, value: employee.payrollSettings.taxProfile },
            ]}
          />
        </EmployeeSection>

        <EmployeeSection title={view.activity}>
          <SectionGrid
            items={[
              {
                label: view.lastPaidDate,
                value: employee.activity.lastPaidDate ? formatDateLabel(employee.activity.lastPaidDate) : c.common.noDataFallback,
              },
            ]}
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href={routes.documents} className={buttonClassName("secondary")}>
              {view.activityLinks.documents}
            </Link>
            <span className="inline-flex h-11 items-center rounded-full bg-[var(--action-primary-soft)] px-[22px] text-[14px] font-semibold text-[var(--action-text)]">
              {view.activityLinks.payrollHistory}
            </span>
          </div>
        </EmployeeSection>
      </div>
    </div>
  );
}

function EmployeeSection({
  title,
  children,
  editHref,
}: {
  title: string;
  children: React.ReactNode;
  editHref?: string;
}) {
  return (
    <section className="shell-enter rounded-[28px] bg-white/50 p-6 ring-1 ring-neutral-200/45 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="type-card-title">{title}</h2>
        {editHref ? <EditSectionLink href={editHref} title={title} /> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EditSectionLink({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      aria-label={`Edit ${title}`}
      className="inline-flex size-10 items-center justify-center rounded-full bg-white/75 text-[#575b55] ring-1 ring-neutral-200/60 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white hover:text-[#1f221c]"
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
        <path
          d="M10.9 3.2L12.8 5.1M4.1 11.9L5.9 11.5L12.1 5.3C12.6 4.8 12.6 4 12.1 3.5L11.3 2.7C10.8 2.2 10 2.2 9.5 2.7L3.3 8.9L2.9 10.7L2.6 12.4L4.1 11.9Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Link>
  );
}

function SectionGrid({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <p className="type-eyebrow text-neutral-400">{item.label}</p>
          <p className="type-body-strong numeric-tabular mt-2 text-[#1f221c]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

function employmentTypeLabel(view: ReturnType<typeof useContent>["employee"], employmentType: string) {
  if (employmentType === "partTime") return view.partTime;
  if (employmentType === "contractor") return view.contractor;
  return view.fullTime;
}

function rateTypeLabel(view: ReturnType<typeof useContent>["employee"], rateType: string) {
  if (rateType === "daily") return view.daily;
  if (rateType === "weekly") return view.weekly;
  if (rateType === "biWeekly") return view.biWeekly;
  if (rateType === "monthly") return view.monthly;
  if (rateType === "annual") return view.annual;
  return view.hourly;
}

function payScheduleLabel(view: ReturnType<typeof useContent>["employee"], paySchedule: string) {
  if (paySchedule === "weekly") return view.weekly;
  if (paySchedule === "monthly") return view.monthly;
  return view.biWeekly;
}

function formatAddress(employee: Parameters<typeof employeeCompensationSummary>[0]) {
  return [
    employee.address.streetAddress,
    employee.address.unit,
    employee.address.city,
    employee.address.province,
    employee.address.postalCode,
    employee.address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function maskSin(value?: string) {
  const normalized = value?.replace(/\D/g, "") ?? "";
  if (!normalized) return "";
  return `•••••${normalized.slice(-4)}`;
}
