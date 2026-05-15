"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getSeedEmployees,
  normalizeEmployeeRecord,
  type EmployeeRecord,
} from "@/lib/data/employees";

export function useEmployeesStore(initialEmployees?: EmployeeRecord[], companyId?: string) {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() =>
    (initialEmployees ?? []).map((employee) => normalizeEmployeeRecord(employee))
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (initialEmployees) {
      setEmployees(initialEmployees.map((employee) => normalizeEmployeeRecord(employee)));
      setReady(true);
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams();
    if (companyId) params.set("companyId", companyId);

    async function loadEmployees() {
      try {
        const response = await fetch(`/api/employees${params.size ? `?${params.toString()}` : ""}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Employee request failed with ${response.status}`);
        }

        const payload = (await response.json()) as { employees?: EmployeeRecord[] };
        setEmployees((payload.employees ?? []).map((employee) => normalizeEmployeeRecord(employee)));
      } catch (error) {
        if (controller.signal.aborted) return;
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to load Supabase employees; using demo fallback.", error);
          // Dev/demo fallback only. Must stay disabled in production.
          setEmployees(getSeedEmployees());
        } else {
          setEmployees([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setReady(true);
        }
      }
    }

    loadEmployees();
    return () => controller.abort();
  }, [companyId, initialEmployees]);

  const activeEmployees = useMemo(() => employees.filter((employee) => employee.status === "active"), [employees]);

  return {
    employees,
    activeEmployees,
    ready,
  };
}
