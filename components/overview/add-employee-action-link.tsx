"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

type NavCompany = {
  id: string;
  name: string;
  initials: string;
  href: string;
};

export function AddEmployeeActionLink({ className = "" }: { className?: string }) {
  const [companies, setCompanies] = useState<NavCompany[]>([]);
  const [storedCompanyId, setStoredCompanyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/companies/nav")
      .then((response) => response.json() as Promise<{ companies: NavCompany[] }>)
      .then((payload) => {
        if (active) {
          setCompanies(payload.companies ?? []);
        }
      })
      .catch(() => {
        if (active) {
          setCompanies([]);
        }
      });

    if (typeof window !== "undefined") {
      setStoredCompanyId(window.localStorage.getItem("credo:selected-company-id"));
    }

    return () => {
      active = false;
    };
  }, []);

  const href = useMemo(() => {
    if (companies.length === 0) {
      return routes.companiesNew;
    }

    const selectedCompany = storedCompanyId
      ? companies.find((company) => company.id === storedCompanyId)
      : null;

    if (selectedCompany) {
      return routes.employeesNewForCompany(selectedCompany.id);
    }

    if (companies.length === 1) {
      return routes.employeesNewForCompany(companies[0].id);
    }

    return routes.companiesForEmployeeCreation();
  }, [companies, storedCompanyId]);

  return (
    <Link href={href} className={`${buttonClassName("secondary")} ${className}`}>
      Add employee
    </Link>
  );
}
