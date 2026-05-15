"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandIcon } from "@/components/brand/brand-visuals";
import {
  employeeCompensationSummary,
  formatDateLabel,
  type EmployeeRecord,
} from "@/lib/data/employees";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";

type EmployeeSlide = {
  title: string;
  description: string;
  icon: "person" | "profile" | "payroll";
  fields: { label: string; value: string }[];
};

type EmployeeNextStep = {
  label: string;
  copy: string;
  href: string;
};

export function EmployeeRightRail({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<EmployeeRecord | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/employees?id=${encodeURIComponent(employeeId)}`)
      .then((response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ employee?: EmployeeRecord | null }>;
      })
      .then((payload) => {
        if (active) {
          setEmployee(payload?.employee ?? null);
        }
      })
      .catch(() => {
        if (active) {
          setEmployee(null);
        }
      });

    return () => {
      active = false;
    };
  }, [employeeId]);

  if (!employee) return null;

  return <EmployeeRailContent employee={employee} />;
}

function EmployeeRailContent({ employee }: { employee: EmployeeRecord }) {
  const c = useContent();
  const view = c.employee;
  const profileState = getEmployeeProfileState(employee);
  const nextStep = getEmployeeNextStep(employee, profileState);
  const guidance = getPayrollGuidance(employee, profileState);
  const slides = useMemo<EmployeeSlide[]>(
    () => [
      {
        title: "Personal info",
        description: "Core employee details used for records and communication.",
        icon: "person",
        fields: [
          { label: "Full name", value: employee.name || "Employee" },
          { label: "Email", value: employee.email || "Not added" },
          { label: "Phone", value: employee.phone || "Not added" },
          { label: "SIN status", value: sinStatus(employee.identity.sin) },
        ],
      },
      {
        title: "Employment info",
        description: "Role, status, and work details connected to this employee.",
        icon: "profile",
        fields: [
          { label: "Role / title", value: employee.role || "Not added" },
          { label: "Employment type", value: employmentTypeLabel(view, employee.employmentType) },
          { label: "Start date", value: employee.startDate ? formatDateLabel(employee.startDate) : "Not added" },
          { label: "Status", value: employee.status === "active" ? view.active : view.inactive },
          { label: "Work location", value: employee.workLocation || "Not added" },
        ],
      },
      {
        title: "Payroll info",
        description: "Compensation and payroll setup details for future runs.",
        icon: "payroll",
        fields: [
          { label: "Pay type", value: rateTypeLabel(view, employee.compensation.rateType) },
          { label: "Pay rate", value: employee.compensation.rateAmount > 0 ? employeeCompensationSummary(employee) : "Not added" },
          { label: "Pay schedule", value: payScheduleLabel(view, employee.compensation.paySchedule) },
          { label: "Payroll setup", value: profileState.payrollComplete ? "Ready" : "Pending" },
          { label: "TD1 / tax form", value: employee.identity.taxProvince ? "Added" : "Not added" },
        ],
      },
    ],
    [employee, profileState.payrollComplete, view]
  );

  return (
    <div className="flex flex-col">
      <div className="sticky top-3 flex flex-col gap-3 pb-4">
        <EmployeeRailSection title="Next step" className="shell-enter">
          <p className="mb-3 text-[13px] leading-[1.42] text-[var(--credo-muted)]">{nextStep.copy}</p>
          <Link
            href={nextStep.href}
            className="type-button inline-flex h-9 w-full items-center justify-center rounded-full bg-[var(--credo-green-800)] px-4 text-[13px] font-semibold text-white shadow-none transition-colors duration-[160ms] hover:bg-[var(--credo-green-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
          >
            {nextStep.label}
          </Link>
        </EmployeeRailSection>

        <EmployeeDetailsCarousel slides={slides} className="shell-enter shell-enter-delay-1" />

        <GuidanceCard title={guidance.title} copy={guidance.copy} href={guidance.href} className="shell-enter shell-enter-delay-2" />
      </div>
    </div>
  );
}

function EmployeeDetailsCarousel({
  slides,
  className,
}: {
  slides: EmployeeSlide[];
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToSlide(index: number) {
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(nextIndex) as HTMLElement | null;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(nextIndex);
  }

  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    const index = Math.round(scroller.scrollLeft / width);
    setActiveIndex(Math.max(0, Math.min(index, slides.length - 1)));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToSlide(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToSlide(activeIndex - 1);
    }
  }

  return (
    <section className={className}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Employee detail cards"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-[26px] outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[var(--action-ring)] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div key={slide.title} className="min-w-full snap-start">
            <EmployeeMiniCard
              {...slide}
              activeIndex={activeIndex}
              slideCount={slides.length}
              onPrevious={() => scrollToSlide(activeIndex - 1)}
              onNext={() => scrollToSlide(activeIndex + 1)}
              isCurrent={index === activeIndex}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function EmployeeRailSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "rounded-[26px] bg-[var(--credo-surface)] p-5 shadow-[0_10px_34px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="mb-3 text-[19px] font-semibold leading-[1.12] text-[var(--credo-ink)]">{title}</h2>
      {children}
    </section>
  );
}

function EmployeeMiniCard({
  title,
  description,
  icon,
  fields,
  activeIndex,
  slideCount,
  onPrevious,
  onNext,
  isCurrent,
}: EmployeeSlide & {
  activeIndex: number;
  slideCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isCurrent: boolean;
}) {
  return (
    <div className="relative min-h-[198px] overflow-hidden rounded-[26px] bg-[var(--credo-bronze-pale)] p-[18px] shadow-[0_12px_38px_rgba(23,26,23,0.04),inset_0_1px_0_rgba(255,255,255,0.58)] ring-1 ring-[rgba(216,203,185,0.86)]">
      {isCurrent ? (
        <span className="sr-only">
          Slide {activeIndex + 1} of {slideCount}
        </span>
      ) : null}
      <div className="relative z-10 flex h-full min-h-[162px] flex-col justify-between">
        <div>
          <h3 className="max-w-[212px] text-[18px] font-semibold leading-[1.12] tracking-[-0.01em] text-[var(--credo-ink)]">{title}</h3>
          <p className="mt-2 max-w-[230px] text-[12.5px] leading-[1.36] text-[var(--credo-muted)]">
            {description}
          </p>
        </div>
        <div className="mt-3.5 space-y-1.5">
          {fields.map((field) => (
            <InfoField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </div>
      <BrandIcon
        icon={icon}
        tone="sand"
        size="lg"
        className="absolute right-[18px] top-[54px] size-8 rounded-[13px] bg-[var(--credo-surface-warm)]/72 text-[var(--credo-muted-strong)] opacity-70 ring-1 ring-[rgba(91,77,58,0.08)] [&_svg]:size-3.5"
      />
      <div className="absolute right-[18px] top-[18px] z-20 flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous employee detail card"
          onClick={onPrevious}
          className="inline-flex size-[26px] items-center justify-center rounded-full bg-[var(--credo-surface-warm)]/84 text-[var(--credo-muted-strong)] shadow-[0_4px_10px_rgba(42,35,25,0.04)] ring-1 ring-[rgba(91,77,58,0.09)] transition hover:bg-[var(--credo-cream)] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <ArrowIcon direction="left" className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Next employee detail card"
          onClick={onNext}
          className="inline-flex size-[26px] items-center justify-center rounded-full bg-[var(--credo-surface-warm)]/84 text-[var(--credo-muted-strong)] shadow-[0_4px_10px_rgba(42,35,25,0.04)] ring-1 ring-[rgba(91,77,58,0.09)] transition hover:bg-[var(--credo-cream)] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <ArrowIcon className="size-3" />
        </button>
      </div>
    </div>
  );
}

function GuidanceCard({
  title,
  copy,
  href,
  className,
}: {
  title: string;
  copy: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group flex min-h-10 items-center justify-between gap-4 rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-3.5 shadow-[0_8px_28px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)] transition-colors duration-[180ms] hover:bg-[var(--credo-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold leading-tight text-[var(--credo-ink)]">
          {title}
        </span>
        <span className="mt-1 block max-w-[270px] text-[13px] font-normal leading-[1.38] text-[var(--credo-muted)]">
          {copy}
        </span>
      </span>
      <ArrowIcon className="size-4 shrink-0 text-[var(--credo-bronze-700)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" />
    </Link>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-[rgba(91,77,58,0.1)] pt-2 first:border-t-0 first:pt-0">
      <span className="text-[11.5px] leading-tight text-[var(--credo-muted)]">{label}</span>
      <span className="min-w-0 truncate text-right text-[11.5px] font-medium leading-tight text-[var(--credo-ink)]">{value}</span>
    </div>
  );
}

function ArrowIcon({ direction = "right", className = "size-4" }: { direction?: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      {direction === "left" ? (
        <path d="m9.75 4.5-3.5 3.5 3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m6.25 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function getEmployeeNextStep(
  employee: EmployeeRecord,
  state: ReturnType<typeof getEmployeeProfileState>
): EmployeeNextStep {
  if (!state.profileComplete) {
    return {
      label: "Complete profile",
      copy: "Add missing employee details before payroll is run.",
      href: routes.employeeEdit(employee.id),
    };
  }

  if (!state.payrollComplete) {
    return {
      label: "Add payroll details",
      copy: "Set up compensation and tax details for this employee.",
      href: routes.employeeEditSection(employee.id, "compensation"),
    };
  }

  if (employee.status === "active" && employee.companyId && employee.payrollSettings.eligibleForPayroll) {
    return {
      label: "Run payroll",
      copy: "Create a payroll run for this employee when ready.",
      href: routes.runPayrollForCompany(employee.companyId),
    };
  }

  return {
    label: "Edit employee",
    copy: "Review employee details before payroll is run.",
    href: routes.employeeEdit(employee.id),
  };
}

function getPayrollGuidance(
  employee: EmployeeRecord,
  state: ReturnType<typeof getEmployeeProfileState>
) {
  if (!state.profileComplete) {
    return {
      title: "Complete profile",
      copy: "Add missing employee details so payroll records stay accurate.",
      href: routes.employeeEdit(employee.id),
    };
  }

  if (!state.payrollComplete) {
    return {
      title: "Set up payroll",
      copy: "Add compensation and tax details before the next run.",
      href: routes.employeeEditSection(employee.id, "compensation"),
    };
  }

  if (employee.status === "active" && employee.companyId && employee.payrollSettings.eligibleForPayroll) {
    return {
      title: "Run payroll",
      copy: "Create a payroll run for this employee when ready.",
      href: routes.runPayrollForCompany(employee.companyId),
    };
  }

  return {
    title: "Review setup",
    copy: "Confirm employee details before running payroll.",
    href: routes.employeeEdit(employee.id),
  };
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

function sinStatus(value?: string) {
  const lastFour = value?.replace(/\D/g, "").slice(-4);
  return lastFour ? `•••• ${lastFour}` : "Not added";
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
