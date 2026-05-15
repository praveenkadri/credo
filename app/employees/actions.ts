"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEmployee,
  deactivateEmployee,
  mapEmployeeFormValuesToSupabaseInput,
  updateEmployee,
  type EmployeeFormValues,
  type EmployeeRecord,
} from "@/lib/data/employees";
import { requireCurrentUser } from "@/lib/auth/session";
import { isNextRedirectError } from "@/lib/is-next-redirect-error";
import { routes } from "@/lib/routes";
import { stringifyAuditDetails } from "@/lib/audit/sanitize";
import { requireAuthenticatedSupabaseClient, toSafeAppErrorMessage } from "@/lib/supabase/client";

export type EmployeeActionState = {
  error?: string;
};

export async function createEmployeeAction(
  values: EmployeeFormValues,
  companyId?: string
): Promise<EmployeeActionState> {
  const input = mapEmployeeFormValuesToSupabaseInput(values, companyId);
  values.sin = "";
  const validationError = validateEmployeeInput(input.full_name, input.company_id);
  if (validationError) return { error: validationError };

  try {
    const user = await requireCurrentUser();
    await assertCompanyAccess(input.company_id, user.accessToken);
    const employee = await createEmployee(input, user.accessToken);
    await writeEmployeeAuditLog("employee_created", employee, user.accessToken);
    revalidateEmployeePaths(employee.id, employee.companyId);
    redirect(routes.employee(employee.id));
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    return { error: developerError("create employee", error) };
  }
}

export async function updateEmployeeAction(
  employeeId: string,
  values: EmployeeFormValues,
  companyId?: string
): Promise<EmployeeActionState> {
  const input = mapEmployeeFormValuesToSupabaseInput(values, companyId);
  values.sin = "";
  const validationError = validateEmployeeInput(input.full_name, input.company_id);
  if (validationError) return { error: validationError };

  try {
    const user = await requireCurrentUser();
    await assertCompanyAccess(input.company_id, user.accessToken);
    const employee = await updateEmployee(employeeId, input, user.accessToken);
    await writeEmployeeAuditLog("employee_updated", employee, user.accessToken);
    revalidateEmployeePaths(employee.id, employee.companyId);
    redirect(routes.employee(employee.id));
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    return { error: developerError(`update employee ${employeeId}`, error) };
  }
}

export async function deactivateEmployeeAction(employeeId: string): Promise<EmployeeActionState> {
  if (!employeeId.trim()) return { error: "Employee id is required." };

  try {
    const user = await requireCurrentUser();
    const employee = await deactivateEmployee(employeeId, user.accessToken);
    await writeEmployeeAuditLog("employee_deactivated", employee, user.accessToken);
    revalidateEmployeePaths(employee.id, employee.companyId);
    return {};
  } catch (error) {
    return { error: developerError(`deactivate employee ${employeeId}`, error) };
  }
}

function validateEmployeeInput(name: string, companyId: string) {
  if (!name.trim()) return "Employee name is required.";
  if (!companyId.trim()) return "Company is required before saving an employee.";
  return "";
}

function revalidateEmployeePaths(employeeId: string, companyId?: string) {
  revalidatePath(routes.employees);
  revalidatePath(routes.employee(employeeId));
  revalidatePath(routes.overview);
  if (companyId) {
    revalidatePath(routes.company(companyId));
    revalidatePath(routes.companyEmployees(companyId));
  }
}

async function writeEmployeeAuditLog(
  action: "employee_created" | "employee_updated" | "employee_deactivated",
  employee: EmployeeRecord,
  sessionAccessToken?: string
) {
  const writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);
  const { error } = await writeClient.from("audit_logs").insert({
    company_id: employee.companyId ?? null,
    action,
    entity_type: "employee",
    entity_name: employee.name,
    details: stringifyAuditDetails({
      employeeId: employee.id,
      status: employee.status,
      eligibleForPayroll: employee.payrollSettings.eligibleForPayroll,
      defaultInPayroll: employee.payrollSettings.defaultInPayroll,
    }),
    at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`employee audit log failed: ${error.message}`);
  }
}

async function assertCompanyAccess(companyId: string, accessToken: string) {
  const writeClient = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await writeClient
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(`company access check failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Company is unavailable or you do not have access.");
  }
}

function developerError(action: string, error: unknown) {
  const message = toSafeAppErrorMessage(error);
  return `Failed to ${action}: ${message}`;
}
