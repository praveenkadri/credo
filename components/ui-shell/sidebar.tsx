"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/ui-shell/nav-icon";
import { PRIMARY_NAV_ITEMS, type PrimaryNavItem } from "@/components/ui-shell/primary-nav-items";
import { routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";

type SidebarNavItem = PrimaryNavItem & {
  label: string;
};

type NavigationState = {
  hasCompanies: boolean;
  hasEmployees: boolean;
  hasPayrollRuns: boolean;
  hasDocuments: boolean;
  hasCompanyActivity: boolean;
  hasComplianceDetails: boolean;
  hasPayrollSetupStarted: boolean;
  hasPayrollSetupComplete: boolean;
};

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
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

function SidebarNavItem({ item, pathname }: { item: SidebarNavItem; pathname: string }) {
  const active = item.isActive(pathname);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "group/nav relative flex h-[37px] items-center gap-2.5 rounded-[8px] px-4 text-[13px] font-medium leading-none outline-none transition-[background-color,color] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        "focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.22)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--credo-surface-warm)]",
        active
          ? "bg-transparent text-[var(--credo-green-950)]"
          : "text-[#5F665E] hover:bg-[var(--credo-bronze-pale)] hover:text-[var(--credo-green-950)]",
      ].join(" ")}
    >
      {active ? (
        <span
          className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-[var(--credo-green-800)]"
          aria-hidden="true"
        />
      ) : null}
      <NavIcon icon={item.icon} label={item.label} tone={item.tone} active={active} collapsed={false} density="sidebar" />
      <span className={active ? "text-[var(--credo-green-950)]" : "text-[#5F665E] group-hover/nav:text-[var(--credo-green-950)]"}>
        {item.label}
      </span>
    </Link>
  );
}

export default function Sidebar({ collapsed: _collapsed, onToggle: _onToggle }: SidebarProps) {
  const pathname = usePathname();
  const c = useContent();
  const nav = c.navigation;
  const [navigationState, setNavigationState] = useState<NavigationState>(DEFAULT_NAVIGATION_STATE);

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

  const labels: Record<PrimaryNavItem["id"], string> = {
    overview: nav.overview,
    companies: "Companies",
    employees: nav.employees,
    workflows: "Workflows",
    payroll: nav.payroll,
    documents: nav.documents,
    insights: "Reports",
    compliance: nav.compliance,
  };

  const navItems = PRIMARY_NAV_ITEMS
    .filter((item) => shouldShowSidebarNavItem(item, pathname, navigationState))
    .map((item) => ({ ...item, label: labels[item.id] }));

  return (
    <aside
      className="relative hidden h-full w-[232px] shrink-0 border-r border-[var(--credo-border)] bg-[var(--credo-surface-warm)] px-4 py-5 lg:flex lg:flex-col"
      aria-label="Sidebar"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-[var(--credo-border)] pb-3.5">
          <SidebarBrandMark />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-bold leading-[1.1] text-[var(--credo-ink)]">
              Credo
            </div>
            <div className="mt-1 truncate text-[11px] font-medium leading-none text-[var(--credo-muted)]">
              Payroll workspace
            </div>
          </div>
        </div>

        <nav className="mt-[18px] flex flex-col gap-1.5" aria-label="Primary navigation">
          {navItems.map((item) => (
            <SidebarNavItem key={item.id} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="flex-1" />
      </div>
    </aside>
  );
}

function SidebarBrandMark() {
  return (
    <span
      className="relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-[var(--credo-green-950)] text-[var(--credo-surface-warm)] shadow-[0_10px_22px_rgba(18,54,44,0.12)] ring-1 ring-[rgba(184,135,79,0.18)]"
      aria-hidden="true"
    >
      <span className="absolute inset-[5px] rounded-[9px] bg-white/[0.07]" />
      <span className="absolute right-[7px] top-[7px] size-1.5 rounded-full bg-[var(--credo-bronze)]" />
      <span className="relative -mt-px text-[18px] font-semibold leading-none tracking-[-0.055em]">
        C
      </span>
    </span>
  );
}

function shouldShowSidebarNavItem(item: PrimaryNavItem, pathname: string, state: NavigationState) {
  if (item.id === "overview" || item.id === "companies") {
    return true;
  }

  if (item.isActive(pathname)) {
    return true;
  }

  if (item.id === "employees") {
    return state.hasCompanies || state.hasEmployees || pathname.startsWith(routes.employees) || pathname.startsWith(routes.team);
  }

  if (item.id === "workflows") {
    return state.hasCompanies || pathname.startsWith(routes.workflows);
  }

  if (item.id === "payroll") {
    return state.hasEmployees || state.hasPayrollRuns || state.hasPayrollSetupComplete || pathname.startsWith(routes.payroll);
  }

  if (item.id === "documents") {
    return state.hasDocuments || state.hasPayrollRuns || pathname.startsWith(routes.documents);
  }

  if (item.id === "insights") {
    return state.hasPayrollRuns || state.hasDocuments || state.hasCompanyActivity || pathname.startsWith(routes.insights);
  }

  if (item.id === "compliance") {
    return state.hasComplianceDetails || pathname.startsWith(routes.compliance);
  }

  return false;
}
