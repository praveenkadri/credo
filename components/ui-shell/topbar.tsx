"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui-primitives/avatar";
import { Button, buttonClassName } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { NavIcon } from "@/components/ui-shell/nav-icon";
import { PRIMARY_NAV_ITEMS, type PrimaryNavItem } from "@/components/ui-shell/primary-nav-items";
import { getRouteCompanyId, getRouteEmployeeId, isEmployeeDetailPath, isOverviewPath, routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

type NavCompany = {
  id: string;
  name: string;
  initials: string;
  href: string;
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
  userFirstName?: string;
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

type EmployeeContext = {
  id: string;
  name: string;
};

export default function Topbar({ className }: { className?: string }) {
  const c = useContent();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [companies, setCompanies] = useState<NavCompany[]>([]);
  const [navigationState, setNavigationState] = useState<NavigationState>(DEFAULT_NAVIGATION_STATE);
  const [employeeContext, setEmployeeContext] = useState<EmployeeContext | null>(null);
  const [storedCompanyId, setStoredCompanyId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const routeCompanyId = useMemo(() => getRouteCompanyId(pathname), [pathname]);
  const routeEmployeeId = useMemo(() => getRouteEmployeeId(pathname), [pathname]);

  useEffect(() => {
    let active = true;

    fetch("/api/companies/nav")
      .then((response) => response.json() as Promise<{ companies: NavCompany[] }>)
      .then((payload) => {
        if (!active) return;
        setCompanies(payload.companies ?? []);
      })
      .catch(() => {
        if (!active) return;
        setCompanies([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!routeEmployeeId || routeEmployeeId === "new") {
      setEmployeeContext(null);
      return;
    }

    let active = true;

    fetch(`/api/employees?id=${encodeURIComponent(routeEmployeeId)}`)
      .then((response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ employee?: EmployeeContext | null }>;
      })
      .then((payload) => {
        if (!active) return;
        const employee = payload?.employee;
        setEmployeeContext(employee?.name ? { id: employee.id, name: employee.name } : null);
      })
      .catch(() => {
        if (active) {
          setEmployeeContext(null);
        }
      });

    return () => {
      active = false;
    };
  }, [routeEmployeeId]);

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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("credo:selected-company-id");
    setStoredCompanyId(saved);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) return;
      setMenuOpen(false);
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  const routeCompany = routeCompanyId ? companies.find((company) => company.id === routeCompanyId) : undefined;
  const selectedCompany =
    routeCompany ??
    companies.find((company) => company.id === storedCompanyId) ??
    companies[0];

  useEffect(() => {
    if (!selectedCompany || typeof window === "undefined") return;
    window.localStorage.setItem("credo:selected-company-id", selectedCompany.id);
    setStoredCompanyId(selectedCompany.id);
  }, [selectedCompany?.id]);

  function selectCompany(company: NavCompany) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("credo:selected-company-id", company.id);
      setStoredCompanyId(company.id);
    }
    setMenuOpen(false);
    router.push(company.href || routes.company(company.id));
  }

  const mobileLabels: Record<PrimaryNavItem["id"], string> = {
    overview: c.navigation.overview,
    companies: c.topbar.companiesLabel,
    employees: c.navigation.employees,
    workflows: "Workflows",
    payroll: c.navigation.payroll,
    documents: c.navigation.documents,
    insights: "Reports",
    compliance: c.navigation.compliance,
  };
  const mobileNavItems = PRIMARY_NAV_ITEMS
    .filter((item) => shouldShowNavItem(item, pathname, navigationState))
    .map((item) => ({ ...item, label: mobileLabels[item.id] }));
  const pageTitle = getPageTitle(pathname, mobileLabels);
  const topbarContext = getTopbarContext({
    pathname,
    pageTitle,
    userFirstName: navigationState.userFirstName,
    selectedCompanyName: routeCompany?.name,
    employeeName: employeeContext?.name,
  });

  return (
    <header className={cn("relative z-20 flex items-center", className)}>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}
            className={`${buttonClassName("toolbarIcon")} shrink-0 lg:hidden`}
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M3.5 5H12.5M3.5 8H12.5M3.5 11H12.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </svg>
          </button>

          <h1 className="truncate py-0.5 text-[16px] font-semibold leading-[1.3] text-[var(--text-primary)]">
            {topbarContext}
          </h1>

          <div className="relative hidden min-w-0 shrink-0" ref={menuRef}>
          <Button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            variant="rowActionQuiet"
            className="h-10 max-w-[260px] gap-2 bg-[var(--credo-bg)] px-2.5 pr-3 text-[var(--text-secondary)] ring-1 ring-[var(--brand-primary-border)]"
          >
            <span className="relative shrink-0">
              <Avatar initials={selectedCompany?.initials ?? "C"} compact />
              <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[var(--brand-primary)] ring-2 ring-[var(--credo-bg)]" aria-hidden="true" />
            </span>
            <span className="truncate text-[var(--text-primary)]">
              {selectedCompany?.name ?? c.topbar.workspaceName}
            </span>
            <span className="type-caption text-neutral-500" aria-hidden="true">▾</span>
          </Button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] overflow-hidden rounded-[24px] bg-[var(--surface-warm)] p-1.5 shadow-[0_1px_1px_rgba(23,26,23,0.025),0_8px_24px_rgba(23,26,23,0.035)] ring-1 ring-[var(--border-soft)] [&>*]:relative [&>*]:z-[1] animate-[dropdownIn_160ms_cubic-bezier(0.2,0,0,1)_both] motion-reduce:animate-[dropdownFadeIn_160ms_linear_both]"
            >
              <div className="type-eyebrow px-2 pb-1 pt-1 text-neutral-500">
                {c.topbar.companiesLabel}
              </div>
              {companies.length ? (
                <div className="space-y-0.5">
                  {companies.map((company) => {
                    const isCurrent = company.id === selectedCompany?.id;
                    return (
                      <button
                        key={company.id}
                        type="button"
                        role="menuitem"
                        onClick={() => selectCompany(company)}
                        className={cn(
                          buttonClassName("menuItem"),
                          "gap-2.5 py-2",
                          isCurrent && "bg-[var(--credo-icon-wash)] ring-1 ring-[var(--brand-primary-border)]"
                        )}
                      >
                        <Avatar initials={company.initials} compact />
                        <span className="type-body-small min-w-0 flex-1 truncate text-[var(--text-primary)]">{company.name}</span>
                        {isCurrent ? (
                          <span className="flex items-center gap-1.5">
                            <span className="size-1.5 rounded-full bg-[var(--brand-primary)]" aria-hidden="true" />
                            <span className="type-caption text-[var(--brand-primary)]">{c.common.current}</span>
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="type-caption px-2 pb-2 pt-1 text-neutral-600">{c.topbar.noCompanies}</p>
              )}
              <div className="mt-1 pt-1">
                <Link
                  href={routes.companiesAlias}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className={buttonClassName("menuItem")}
                >
                  {c.topbar.manageCompanies}
                </Link>
              </div>
            </div>
          ) : null}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3">
          <div className="hidden w-[260px]">
            <Input placeholder={c.topbar.searchWorkspacePlaceholder} className="h-10 rounded-xl border-0 bg-[var(--credo-bg)] pl-3.5 hover:bg-[var(--credo-taupe)] focus:bg-[var(--credo-taupe)]" />
          </div>
          <Link
            href={routes.logout}
            className="-mr-2 inline-flex h-10 cursor-pointer items-center rounded-[6px] border-0 bg-transparent px-2 text-[13px] font-medium leading-none text-[var(--text-secondary)] shadow-none transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-transparent hover:text-[var(--credo-green-950)] active:text-[var(--credo-green-900)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
          >
            Sign out
          </Link>
        </div>
      </div>
      {navOpen ? (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 cursor-default bg-black/20"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[min(88vw,340px)] bg-[var(--surface-warm)] p-3 shadow-[0_24px_80px_rgba(23,26,23,0.18)]">
            <div className="mb-3 flex h-10 items-center justify-between">
              <span className="text-[18px] font-semibold tracking-[-0.038em] text-[var(--text-primary)]">Credo</span>
              <Button
                type="button"
                variant="toolbarIcon"
                aria-label="Close navigation"
                onClick={() => setNavOpen(false)}
                className="bg-[var(--credo-taupe)]"
              >
                <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                  <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
                </svg>
              </Button>
            </div>
            <nav className="space-y-1" aria-label="Primary navigation">
              {mobileNavItems.map((item) => {
                const active = item.isActive(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group/nav type-button relative flex h-11 items-center gap-2.5 rounded-xl px-3 transition-[color,transform] duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] active:scale-[0.99]",
                      active
                        ? "bg-[var(--credo-icon-wash)] text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary-border)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--interactive-hover)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <span
                      className={cn(
                        "pointer-events-none absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--brand-primary)] transition-opacity duration-[140ms]",
                        active ? "opacity-100" : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                    <NavIcon icon={item.icon} label={item.label} tone={item.tone} active={active} collapsed={false} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function getPageTitle(pathname: string, labels: Record<PrimaryNavItem["id"], string>) {
  if (pathname.startsWith(routes.companiesAlias)) return labels.companies;
  if (pathname.startsWith(routes.team) || pathname.startsWith(routes.employees)) return labels.employees;
  if (pathname.startsWith(routes.workflows)) return labels.workflows;
  if (pathname.startsWith(routes.payroll)) return labels.payroll;
  if (pathname.startsWith(routes.documents)) return labels.documents;
  if (pathname.startsWith(routes.insights)) return labels.insights;
  if (pathname.startsWith(routes.compliance)) return labels.compliance;
  return "Overview";
}

function getTopbarContext({
  pathname,
  pageTitle,
  userFirstName,
  selectedCompanyName,
  employeeName,
}: {
  pathname: string;
  pageTitle: string;
  userFirstName?: string;
  selectedCompanyName?: string;
  employeeName?: string;
}) {
  if (isOverviewPath(pathname)) {
    return userFirstName ? `Good morning, ${userFirstName}` : "Good morning";
  }

  if (pathname === routes.companiesAlias) {
    return "Company hub";
  }

  if (pathname === routes.companiesNew) {
    return "Create company";
  }

  if (/^\/companies\/[^/]+\/delete$/.test(pathname)) {
    return "Delete company";
  }

  if (/^\/companies\/[^/]+\/profile(?:\/edit|\/[^/]+\/edit)$/.test(pathname)) {
    return "Edit company";
  }

  if (/^\/companies\/[^/]+\/confirm$/.test(pathname)) {
    return "Review company";
  }

  if (pathname === routes.employees || pathname === routes.team) {
    return "Employees hub";
  }

  if (pathname === routes.workflows) {
    return "Workflows hub";
  }

  if (isEmployeeDetailPath(pathname)) {
    return employeeName?.trim() || "Employee";
  }

  if (selectedCompanyName && pathname.startsWith(routes.companiesAlias)) {
    return selectedCompanyName;
  }

  if (/^\/companies\/[^/]+$/.test(pathname)) {
    return "Company";
  }

  if (/^\/payroll\/[^/]+/.test(pathname)) {
    return "Payroll run";
  }

  if (/^\/documents\/[^/]+/.test(pathname)) {
    return "Document";
  }

  return pageTitle;
}

function shouldShowNavItem(item: PrimaryNavItem, pathname: string, state: NavigationState) {
  if (item.id === "overview" || item.id === "companies") {
    return true;
  }

  if (item.isActive(pathname)) {
    return true;
  }

  if (item.id === "employees") {
    return state.hasEmployees || pathname.startsWith(routes.employees) || pathname.startsWith(routes.team);
  }

  if (item.id === "workflows") {
    return state.hasCompanies || pathname.startsWith(routes.workflows);
  }

  if (item.id === "payroll") {
    return state.hasEmployees || state.hasPayrollRuns || pathname.startsWith(routes.payroll);
  }

  if (item.id === "documents") {
    return state.hasDocuments || state.hasPayrollRuns || pathname.startsWith(routes.documents);
  }

  if (item.id === "insights") {
    return state.hasPayrollRuns || pathname.startsWith(routes.insights);
  }

  if (item.id === "compliance") {
    return (state.hasEmployees && state.hasComplianceDetails) || pathname.startsWith(routes.compliance);
  }

  return false;
}
