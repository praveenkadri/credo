"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Avatar } from "@/components/ui-primitives/avatar";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { getRouteCompanyId, routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";
import { cn } from "@/lib/utils";

type NavCompany = {
  id: string;
  name: string;
  initials: string;
  href: string;
};

export default function Topbar({ className }: { className?: string }) {
  const c = useContent();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [companies, setCompanies] = useState<NavCompany[]>([]);
  const [storedCompanyId, setStoredCompanyId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const routeCompanyId = useMemo(() => getRouteCompanyId(pathname), [pathname]);

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

  const selectedCompany =
    companies.find((company) => company.id === routeCompanyId) ??
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

  return (
    <header className={cn("relative z-20 flex items-center", className)}>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <div className="relative min-w-0 shrink-0" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-10 max-w-[260px] items-center gap-2 rounded-full bg-[#f6f5f0] px-2.5 pr-3 text-sm font-medium text-[#575b55] transition-all duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f1f0ea] hover:text-[#1f221c] active:scale-[0.98] active:duration-[90ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40 motion-reduce:active:scale-100"
          >
            <Avatar initials={selectedCompany?.initials ?? "C"} compact />
            <span className="truncate text-[13px] text-[#1f221c]">
              {selectedCompany?.name ?? c.topbar.workspaceName}
            </span>
            <span className="text-[13px] text-neutral-500">▾</span>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute left-0 top-[calc(100%+8px)] z-50 w-[280px] overflow-hidden rounded-[24px] bg-white/70 p-1.5 backdrop-blur-md ring-1 ring-white/50 shadow-[0_1px_2px_rgba(15,23,42,0.02),0_10px_26px_rgba(15,23,42,0.05)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2),rgba(255,255,255,0.04))] [&>*]:relative [&>*]:z-[1] animate-[dropdownIn_160ms_cubic-bezier(0.2,0,0,1)_both] motion-reduce:animate-[dropdownFadeIn_160ms_linear_both]"
            >
              <div className="px-2 pb-1 pt-1 text-[10px] font-medium uppercase tracking-[0.11em] text-neutral-500">
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
                        className="flex w-full items-center gap-2.5 rounded-2xl px-2 py-2 text-left transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
                      >
                        <Avatar initials={company.initials} compact />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-[#1f221c]">{company.name}</span>
                        {isCurrent ? <span className="text-[11px] text-neutral-500">{c.common.current}</span> : null}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="px-2 pb-2 pt-1 text-[12px] text-neutral-600">{c.topbar.noCompanies}</p>
              )}
              <div className="mt-1 border-t border-neutral-200/70 pt-1">
                <Link
                  href={routes.companiesNew}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 items-center rounded-2xl px-2 text-[13px] font-medium text-neutral-700 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/70 hover:text-neutral-900"
                >
                  {c.topbar.addCompany}
                </Link>
                <Link
                  href={routes.overview}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-9 items-center rounded-2xl px-2 text-[13px] font-medium text-neutral-700 transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/70 hover:text-neutral-900"
                >
                  {c.topbar.manageCompanies}
                </Link>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden w-[260px] md:block">
            <Input placeholder={c.topbar.searchWorkspacePlaceholder} className="h-10 rounded-full border-0 bg-[#f6f5f0] pl-3.5 hover:bg-[#f1f0ea] focus:bg-[#f1f0ea]" />
          </div>
          <Button className="hidden h-10 rounded-full bg-[#f6f5f0] px-4 text-[#575b55] hover:bg-[#f1f0ea] sm:inline-flex">
            {c.topbar.today}
          </Button>
          <Button
            variant="icon"
            aria-label={c.common.notifications}
            className="size-10 rounded-full bg-[#f6f5f0] text-[#575b55] hover:bg-[#f1f0ea]"
          >
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M8 2.8C6.1 2.8 4.6 4.3 4.6 6.2V8.6L3.4 10.3H12.6L11.4 8.6V6.2C11.4 4.3 9.9 2.8 8 2.8Z"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M6.9 11.7C7.1 12.2 7.5 12.5 8 12.5C8.5 12.5 8.9 12.2 9.1 11.7" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
            </svg>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f6f5f0] px-2.5 pr-3 text-sm font-medium text-[#575b55] transition-colors duration-[160ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f1f0ea] hover:text-[#1f221c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
          >
            <Avatar initials="C" compact />
            <span className="hidden sm:block">{c.topbar.workspaceName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
