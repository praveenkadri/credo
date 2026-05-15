"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { RightRailCard } from "@/components/overview/right-rail-card";
import { RightRailSection } from "@/components/overview/right-rail-section";
import { rightRail } from "@/components/overview/overview-data";
import { CompanyRightRailForId } from "@/components/company-detail/company-right-rail";
import { DocumentsRightRail } from "@/components/documents/documents-right-rail";
import { EmployeeRightRail } from "@/components/employees/employee-right-rail";
import { PayrollRightRail } from "@/components/payroll/payroll-right-rail";
import { WorkflowsHelpPanel } from "@/components/workflows/workflows-help-panel";
import { buttonClassName } from "@/components/ui-primitives/button";
import { getRouteCompanyId, getRouteEmployeeId, isEmployeeDetailPath, isOverviewPath, routes } from "@/lib/routes";

type NavigationState = {
  hasCompanies: boolean;
  hasEmployees: boolean;
  hasPayrollRuns: boolean;
  hasDocuments: boolean;
  hasCompanyActivity: boolean;
  hasComplianceDetails: boolean;
  hasPayrollSetupStarted: boolean;
  hasPayrollSetupComplete: boolean;
  addEmployeeHref?: string;
  payrollSetupHref?: string;
};

type NextAction = {
  label: string;
  href: string;
  title: string;
  description: string;
  note: string;
  cardDescription?: string;
};

const DEFAULT_NAVIGATION_STATE: NavigationState = {
  hasCompanies: false,
  hasEmployees: false,
  hasPayrollRuns: false,
  hasDocuments: false,
  hasCompanyActivity: false,
  hasComplianceDetails: false,
  hasPayrollSetupStarted: false,
  hasPayrollSetupComplete: false,
};

export default function RightRail() {
  const pathname = usePathname();
  const [navigationState, setNavigationState] = useState<NavigationState>(DEFAULT_NAVIGATION_STATE);
  const companyId = useMemo(() => getRouteCompanyId(pathname), [pathname]);
  const employeeId = useMemo(() => getRouteEmployeeId(pathname), [pathname]);

  useEffect(() => {
    let active = true;

    fetch("/api/dashboard/navigation-state")
      .then((response) => {
        if (!response.ok) return DEFAULT_NAVIGATION_STATE;
        return response.json() as Promise<NavigationState>;
      })
      .then((payload) => {
        if (active) {
          setNavigationState({ ...DEFAULT_NAVIGATION_STATE, ...payload });
        }
      })
      .catch(() => {
        if (active) {
          setNavigationState(DEFAULT_NAVIGATION_STATE);
        }
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  if (companyId) {
    return <CompanyRightRailForId companyId={companyId} />;
  }

  if (employeeId && isEmployeeDetailPath(pathname)) {
    return <EmployeeRightRail employeeId={employeeId} />;
  }

  if (pathname === routes.employees || pathname === routes.team) {
    return <EmployeesHubRail state={navigationState} />;
  }

  if (pathname.startsWith(routes.documents)) {
    return <DocumentsRightRail />;
  }

  if (pathname.startsWith(routes.payroll)) {
    return <PayrollRightRail />;
  }

  if (pathname.startsWith(routes.workflows)) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-3 flex flex-col gap-3 pb-4">
          <WorkflowsHelpPanel className="shell-enter" />
        </div>
      </div>
    );
  }

  if (pathname.startsWith(routes.insights)) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-3 flex flex-col gap-3 pb-4">
          <NextStepCard action={getOverviewNextAction(navigationState)} />
        </div>
      </div>
    );
  }

  if (pathname.startsWith(routes.compliance)) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-3 flex flex-col gap-3 pb-4">
          <NextStepCard action={getOverviewNextAction(navigationState)} />
        </div>
      </div>
    );
  }

  const isDashboardPath = isOverviewPath(pathname);
  if (isDashboardPath) {
    return (
      <div className="flex flex-col">
        <div className="sticky top-3 flex flex-col gap-3 pb-4">
          <OverviewRail action={getOverviewNextAction(navigationState)} state={navigationState} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
        <div className="sticky top-3 flex flex-col gap-3 pb-4">
          <RightRailCard title="Today" eyebrow="Operational focus" tone="soft" className="shell-enter">
          <RightRailSection items={rightRail.todayItems} emptyMessage="No items due today" />
        </RightRailCard>

        <RightRailCard
          title="Next"
          eyebrow="Upcoming"
          className="shell-enter shell-enter-delay-1"
          tone="inset"
        >
          <RightRailSection items={rightRail.nextItems} emptyMessage="No upcoming deadlines" />
        </RightRailCard>
      </div>
    </div>
  );
}

function EmployeesHubRail({ state }: { state: NavigationState }) {
  const guidance = getEmployeeHubGuidance(state);

  return (
    <div className="flex flex-col">
      <div className="sticky top-3 flex flex-col gap-3 pb-4">
        <section className="shell-enter rounded-[26px] bg-[var(--credo-surface)] p-5 shadow-[0_10px_34px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)]">
          <h2 className="mb-3 text-[19px] font-semibold leading-[1.12] text-[var(--credo-ink)]">Next step</h2>
          <p className="mb-3 text-[13px] leading-[1.42] text-[var(--credo-muted)]">
            Add the first employee to unlock payroll setup, records, and documents.
          </p>
          <Link
            href={state.addEmployeeHref ?? routes.employeesNew}
            className={`${buttonClassName("primary")} h-9 w-full rounded-full px-4 text-[13px] leading-none shadow-none`}
          >
            Add employee
          </Link>
        </section>

        <Link
          href={routes.employees}
          className="group shell-enter shell-enter-delay-1 relative min-h-[184px] overflow-hidden rounded-[26px] bg-[var(--credo-bronze-pale)] p-[18px] shadow-[0_12px_38px_rgba(23,26,23,0.04),inset_0_1px_0_rgba(255,255,255,0.58)] ring-1 ring-[rgba(216,203,185,0.86)] transition-colors duration-[180ms] hover:bg-[var(--credo-bronze-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <div className="relative z-10 max-w-[235px]">
            <h2 className="text-[18px] font-semibold leading-[1.12] tracking-[-0.01em] text-[var(--credo-ink)]">Employee records</h2>
            <p className="mt-2 text-[12.5px] leading-[1.36] text-[var(--credo-muted)]">
              Profiles, payroll details, and documents stay connected here.
            </p>
          </div>
          <div className="absolute bottom-[18px] left-[18px] right-[18px] z-10 space-y-1.5">
            <RailRecordLine label="Profiles" value={state.hasEmployees ? "Started" : "None yet"} />
            <RailRecordLine label="Payroll readiness" value={state.hasPayrollSetupComplete ? "Ready" : "Pending"} />
            <RailRecordLine label="Documents" value={state.hasDocuments ? "Ready" : "After records"} />
          </div>
          <span className="absolute right-[18px] top-[18px] z-20 inline-flex size-[26px] items-center justify-center rounded-full bg-[var(--credo-surface-warm)]/84 text-[var(--credo-bronze-700)] shadow-[0_4px_10px_rgba(42,35,25,0.04)] ring-1 ring-[rgba(91,77,58,0.09)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" aria-hidden="true">
            <ArrowIcon className="size-3.5" />
          </span>
          <FeatureCardGraphic />
        </Link>

        <Link
          href={guidance.href}
          className="group shell-enter shell-enter-delay-2 flex min-h-10 items-center justify-between gap-4 rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-3.5 shadow-[0_8px_28px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)] transition-colors duration-[180ms] hover:bg-[var(--credo-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold leading-tight text-[var(--credo-ink)]">
              {guidance.title}
            </span>
            <span className="mt-1 block max-w-[270px] text-[13px] font-normal leading-[1.38] text-[var(--credo-muted)]">
              {guidance.copy}
            </span>
          </span>
          <ArrowIcon className="size-4 shrink-0 text-[var(--credo-bronze-700)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" />
        </Link>
      </div>
    </div>
  );
}

function RailRecordLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-[rgba(91,77,58,0.1)] pt-2 first:border-t-0 first:pt-0">
      <span className="text-[11.5px] leading-tight text-[var(--credo-muted)]">{label}</span>
      <span className="min-w-0 truncate text-right text-[11.5px] font-medium leading-tight text-[var(--credo-ink)]">{value}</span>
    </div>
  );
}

function getEmployeeHubGuidance(state: NavigationState) {
  if (!state.hasEmployees) {
    return {
      title: "Prepare payroll",
      copy: "Add employees before creating payroll runs and generated records.",
      href: state.addEmployeeHref ?? routes.employeesNew,
    };
  }

  if (!state.hasPayrollSetupComplete) {
    return {
      title: "Complete setup",
      copy: "Add payroll details so future runs are ready and accurate.",
      href: state.payrollSetupHref ?? routes.companiesAlias,
    };
  }

  return {
    title: "Run payroll",
    copy: "Create the next payroll run when ready.",
    href: routes.runPayroll,
  };
}

function OverviewRail({ action, state }: { action: NextAction; state: NavigationState }) {
  const showSetupReminder =
    state.hasCompanies && !state.hasPayrollSetupComplete && action.label !== "Complete payroll setup";
  const showWorkspaceBreakdown = state.hasPayrollRuns || state.hasDocuments;

  return (
    <>
      <NextStepCard action={action} />
      <GuidanceCard action={action} />

      {showSetupReminder ? (
        <section className="shell-enter shell-enter-delay-1 rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-3.5 shadow-[0_8px_28px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)]">
          <Link
            href={state.payrollSetupHref ?? routes.companiesAlias}
            className="group flex min-h-10 items-center justify-between gap-4 rounded-[14px] text-[var(--credo-ink)] outline-none transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.22)]"
          >
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold">Complete setup</span>
              <span className="mt-1 block text-[13px] font-normal leading-[1.38] text-[var(--credo-muted)]">
                Add payroll details so future runs are ready and accurate.
              </span>
            </span>
            <ArrowIcon className="size-4 shrink-0 text-[var(--credo-bronze-700)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" />
          </Link>
        </section>
      ) : null}

      {showWorkspaceBreakdown ? <WorkspaceBreakdown state={state} /> : null}
    </>
  );
}

function WorkspaceBreakdown({ state }: { state: NavigationState }) {
  return (
    <section className="shell-enter shell-enter-delay-1 rounded-[28px] bg-white p-5 shadow-[0_24px_70px_rgba(31,34,28,0.07)]">
      <h2 className="text-[19px] font-semibold tracking-[-0.03em] text-[#4f524d]">Workspace breakdown</h2>
      <div className="mt-5 flex h-10 overflow-hidden rounded-lg bg-[#e8e9e5]">
        <span className="basis-[54%] bg-[var(--brand-primary)]" />
        <span className="basis-[28%] bg-[#6e8f7b]" />
        <span className="basis-[18%] bg-[#9db7a7]" />
      </div>
      <div className="mt-5 space-y-3">
        <BreakdownRow label="Payroll" value={state.hasPayrollRuns ? "Active" : "Pending"} tone="bg-[var(--brand-primary)]" />
        <BreakdownRow label="Documents" value={state.hasDocuments ? "Ready" : "Pending"} tone="bg-[#6e8f7b]" />
        <BreakdownRow label="Compliance" value={state.hasComplianceDetails ? "Started" : "Pending"} tone="bg-[#9db7a7]" />
      </div>
    </section>
  );
}

function NextStepCard({ action }: { action: NextAction }) {
  return (
    <section className="shell-enter rounded-[26px] bg-[var(--credo-surface)] p-5 shadow-[0_10px_34px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)]">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--credo-bronze-700)]">NEXT STEP</p>
      <h2 className="mt-2 text-[19px] font-semibold leading-[1.12] text-[var(--credo-ink)]">
        {action.label}
      </h2>
      {action.cardDescription ? (
        <p className="mt-2 max-w-[310px] text-[13px] font-normal leading-[1.42] text-[var(--credo-muted)]">
          {action.cardDescription}
        </p>
      ) : null}
      <Link
        href={action.href}
        className={`${buttonClassName("primary")} mt-4 h-9 w-full rounded-full px-4 text-[13px] leading-none shadow-none`}
      >
        {action.label}
      </Link>
    </section>
  );
}

function GuidanceCard({ action }: { action: NextAction }) {
  return (
      <section className="shell-enter shell-enter-delay-1 relative min-h-[204px] overflow-hidden rounded-[28px] bg-[var(--credo-bronze-pale)] p-5 shadow-[0_12px_38px_rgba(23,26,23,0.04)] ring-1 ring-[rgba(216,203,185,0.86)]">
        <div className="relative z-10 max-w-[285px]">
          <h2 className="text-[20px] font-semibold leading-[1.08] text-[var(--credo-ink)]">
            {action.title}
          </h2>
          <p className="mt-2.5 text-[13px] font-normal leading-[1.42] text-[var(--credo-muted)]">
            {action.description}
          </p>
        </div>

        <Link
          href={action.href}
          aria-label={action.label}
          className="absolute bottom-5 left-5 z-10 inline-flex size-9 items-center justify-center rounded-full bg-[var(--credo-green-950)] text-white shadow-[0_8px_18px_rgba(18,54,44,0.14)] transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[var(--credo-green-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.24)]"
        >
          <ArrowIcon className="size-[18px]" />
        </Link>

        <FeatureCardGraphic />
      </section>
  );
}

function FeatureCardGraphic() {
  return (
    <div className="absolute bottom-5 right-5 h-[108px] w-[122px] opacity-85" aria-hidden="true">
      <div className="absolute bottom-0 right-0 h-[88px] w-[72px] rounded-[22px] bg-white/52 shadow-[inset_0_0_0_1px_rgba(184,135,79,0.1)]" />
      <div className="absolute bottom-4 right-11 h-[104px] w-[72px] rounded-[24px] bg-[var(--credo-surface-warm)] shadow-[0_10px_24px_rgba(23,26,23,0.045)] ring-1 ring-white/75" />
      <div className="absolute bottom-7 right-[74px] h-[58px] w-[42px] rounded-[18px] bg-[rgba(232,226,216,0.82)] shadow-[0_8px_18px_rgba(23,26,23,0.035)] ring-1 ring-white/55" />
      <span className="absolute bottom-[78px] right-[56px] h-[3px] w-7 rounded-full bg-[var(--credo-green-800)]/75" />
      <span className="absolute bottom-[66px] right-[56px] h-[3px] w-10 rounded-full bg-[var(--credo-taupe-strong)]/80" />
      <span className="absolute bottom-[58px] right-[82px] size-2 rounded-full bg-[var(--credo-green-800)] ring-2 ring-[var(--credo-surface-warm)]" />
      <span className="absolute bottom-[42px] right-[30px] size-2 rounded-full bg-[var(--credo-bronze)] ring-2 ring-[var(--credo-surface-warm)]" />
    </div>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <path d="M4 8h7M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BreakdownRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`size-3 rounded-full ${tone}`} aria-hidden="true" />
        <p className="truncate text-[14px] font-semibold tracking-[-0.015em] text-[#3f423d]">{label}</p>
      </div>
      <p className="numeric-tabular text-[14px] font-medium text-[#3f423d]">{value}</p>
    </div>
  );
}

function getOverviewNextAction(state: NavigationState): NextAction {
  const note = "Unlocks payroll and documents.";

  if (!state.hasCompanies) {
    return {
      label: "Add company",
      href: routes.firstCompanySetup(),
      title: "Add your first company",
      description: "Create the workspace for payroll, people, and records.",
      note,
    };
  }

  if (!state.hasEmployees) {
    return {
      label: "Add employee",
      href: state.addEmployeeHref ?? routes.employeesNew,
      title: "Unlock payroll",
      description: "Employee details help Credo calculate payroll and keep records connected.",
      cardDescription: "Add your first employee to unlock payroll setup, records, and documents.",
      note,
    };
  }

  if (!state.hasPayrollSetupComplete) {
    return {
      label: "Complete payroll setup",
      href: state.payrollSetupHref ?? routes.companiesAlias,
      title: "Finish payroll setup",
      description: "Add the required company payroll details before running the first pay period.",
      note,
    };
  }

  if (!state.hasPayrollRuns) {
    return {
      label: "Run payroll",
      href: routes.runPayroll,
      title: "Run your first payroll",
      description: "Prepare the pay period and generate the first records for this workspace.",
      note,
    };
  }

  if (state.hasDocuments) {
    return {
      label: "View documents",
      href: routes.documents,
      title: "Review generated documents",
      description: "Pay stubs, company files, and employee records are ready in the document library.",
      note,
    };
  }

  return {
    label: "Review payroll",
    href: routes.payroll,
    title: "Review payroll activity",
    description: "Keep an eye on submitted runs, totals, and generated payroll records.",
    note,
  };
}
