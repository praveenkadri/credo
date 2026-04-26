"use client";

import { useEffect, useMemo, useState } from "react";
import {
  EMPLOYEE_STORAGE_KEY,
  getSeedEmployees,
  normalizeEmployeeRecord,
  type EmployeeRecord,
} from "@/lib/data/employees";

export function useEmployeesStore() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>(() => getSeedEmployees());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(EMPLOYEE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EmployeeRecord[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployees(parsed.map((employee) => normalizeEmployeeRecord(employee)));
        }
      }
    } catch {}

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    window.localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
  }, [employees, ready]);

  const activeEmployees = useMemo(() => employees.filter((employee) => employee.status === "active"), [employees]);

  function saveEmployee(nextEmployee: EmployeeRecord) {
    const normalizedEmployee = normalizeEmployeeRecord(nextEmployee);

    setEmployees((current) => {
      const existingIndex = current.findIndex((employee) => employee.id === normalizedEmployee.id);
      if (existingIndex === -1) {
        return [...current, normalizedEmployee];
      }

      return current.map((employee) => (employee.id === normalizedEmployee.id ? normalizedEmployee : employee));
    });
  }

  function deactivateEmployee(employeeId: string) {
    setEmployees((current) =>
      current.map((employee) =>
        employee.id === employeeId
          ? {
              ...employee,
              status: "inactive",
              payrollSettings: {
                ...employee.payrollSettings,
                defaultInPayroll: false,
              },
            }
          : employee
      )
    );
  }

  return {
    employees,
    activeEmployees,
    ready,
    saveEmployee,
    deactivateEmployee,
  };
}
