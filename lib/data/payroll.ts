import { calculateGrossPay, parseDateOnly, type PayrollRateType } from "@/lib/payroll-calculations";
import { mapSupabaseEmployeeToEmployeeRecord } from "@/lib/data/employees";
import { generateAndStorePayStubPdf } from "@/lib/data/document-generation";
import { stringifyAuditDetails } from "@/lib/audit/sanitize";
import {
  formatPayrollDateLabel,
  type PayrollFilters,
  type PayrollRunRecord,
  type PayrollStatusFilterId,
  type PayrollTypeFilterId,
} from "@/lib/payroll-workspace";
import { type DocumentRecord } from "@/lib/documents-workspace";
import { mapSupabaseDocumentToWorkspaceDocument, resolveDocumentStorageAvailability } from "@/lib/data/documents";
import { routes } from "@/lib/routes";
import {
  requireAuthenticatedSupabaseClient,
  toSafeSupabaseErrorMessage,
} from "@/lib/supabase/client";

const DEDUCTION_RATE = 0.2542;

const PAYROLL_RUN_SELECT = [
  "id",
  "company_id",
  "pay_period_start",
  "pay_period_end",
  "pay_date",
  "payroll_type",
  "gross_pay",
  "deductions",
  "net_pay",
  "employee_count",
  "run_status",
  "submitted_at",
  "created_at",
  "updated_at",
].join(",");

const PAYROLL_EMPLOYEE_SELECT = [
  "id",
  "payroll_run_id",
  "company_id",
  "employee_id",
  "employee_name",
  "rate_type",
  "rate_amount",
  "total_hours",
  "gross_pay",
  "deductions",
  "net_pay",
  "manual_hours_override",
  "created_at",
  "updated_at",
].join(",");

const PAYROLL_DOCUMENT_SELECT = [
  "id",
  "company_id",
  "employee_id",
  "payroll_run_id",
  "type",
  "title",
  "status",
  "file_url",
  "storage_bucket",
  "storage_path",
  "file_name",
  "mime_type",
  "file_size_bytes",
  "generation_status",
  "source_kind",
  "generated_at",
  "created_at",
  "updated_at",
].join(",");

const EMPLOYEE_SELECT = [
  "id",
  "company_id",
  "full_name",
  "status",
  "email",
  "phone",
  "role",
  "department",
  "work_location",
  "start_date",
  "employment_type",
  "rate_type",
  "rate_amount",
  "pay_schedule",
  "hours_per_day",
  "hours_per_week",
  "eligible_for_payroll",
  "default_in_payroll",
  "payment_method",
  "notes",
].join(",");

type SupabasePayrollRunRow = {
  id: string;
  company_id: string;
  pay_period_start?: string | null;
  pay_period_end?: string | null;
  pay_date?: string | null;
  payroll_type?: string | null;
  gross_pay?: number | string | null;
  deductions?: number | string | null;
  net_pay?: number | string | null;
  employee_count?: number | null;
  run_status?: string | null;
  submitted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PayrollEmployeeLine = {
  employeeId: string;
  employeeName?: string;
  rateType: PayrollRateType;
  rateAmount: number;
  totalHours: number;
  manualHoursOverride: boolean;
};

export type SubmitPayrollRunInput = {
  companyId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  payrollType: string;
  employees: PayrollEmployeeLine[];
};

export type PayrollRunEmployeeRecord = {
  id: string;
  payrollRunId: string;
  companyId: string;
  employeeId: string | null;
  employeeName: string;
  rateType: PayrollRateType;
  rateAmount: number;
  totalHours: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  manualHoursOverride: boolean;
};

export type SubmitPayrollRunResult = {
  payrollRun: PayrollRunRecord;
  lineItems: PayrollRunEmployeeRecord[];
  payStubDocumentIds: string[];
  generatedPayStubDocumentIds: string[];
  failedPayStubDocumentIds: string[];
};

export async function listPayrollRuns(_filters?: Partial<PayrollFilters>): Promise<PayrollRunRecord[]> {
  return listPayrollRunsForToken(undefined, _filters);
}

export async function listPayrollRunsForToken(
  accessToken?: string,
  _filters?: Partial<PayrollFilters>
): Promise<PayrollRunRecord[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const [{ data, error }, { data: companiesData, error: companiesError }] = await Promise.all([
    client
    .from("payroll_runs")
    .select(PAYROLL_RUN_SELECT)
      .order("pay_date", { ascending: false }),
    client.from("companies").select("id,name"),
  ]);

  if (error) {
    throw new Error(`Failed to load payroll runs: ${toSafeSupabaseErrorMessage(error)}`);
  }

  if (companiesError) {
    throw new Error(`Failed to load payroll company labels: ${toSafeSupabaseErrorMessage(companiesError)}`);
  }

  const companyLabels = new Map(
    (((companiesData as unknown) as Array<{ id: string; name: string }> | null) ?? []).map((company) => [company.id, company.name])
  );

  return (((data as unknown) as SupabasePayrollRunRow[] | null) ?? []).map((row) =>
    mapSupabasePayrollRunToWorkspaceRun(row, companyLabels.get(row.company_id))
  );
}

export async function getPayrollRun(payrollRunId: string): Promise<PayrollRunRecord | null> {
  return getPayrollRunForToken(payrollRunId);
}

export async function getPayrollRunForToken(payrollRunId: string, accessToken?: string): Promise<PayrollRunRecord | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("payroll_runs")
    .select(PAYROLL_RUN_SELECT)
    .eq("id", payrollRunId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load payroll run ${payrollRunId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  if (!data) return null;

  const row = (data as unknown) as SupabasePayrollRunRow;
  const { data: companyData, error: companyError } = await client
    .from("companies")
    .select("id,name")
    .eq("id", row.company_id)
    .maybeSingle();

  if (companyError) {
    throw new Error(`Failed to load payroll run company ${row.company_id}: ${toSafeSupabaseErrorMessage(companyError)}`);
  }

  const companyLabel = (((companyData as unknown) as { name?: string | null } | null)?.name) ?? undefined;

  return mapSupabasePayrollRunToWorkspaceRun(row, companyLabel);
}

export async function listPayrollRunEmployees(payrollRunId: string): Promise<PayrollRunEmployeeRecord[]> {
  return listPayrollRunEmployeesForToken(payrollRunId);
}

export async function listPayrollRunEmployeesForToken(
  payrollRunId: string,
  accessToken?: string
): Promise<PayrollRunEmployeeRecord[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("payroll_run_employees")
    .select(PAYROLL_EMPLOYEE_SELECT)
    .eq("payroll_run_id", payrollRunId)
    .order("employee_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load payroll employees for run ${payrollRunId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return (((data as unknown) as Record<string, unknown>[] | null) ?? []).map(mapPayrollEmployeeLine);
}

export const listPayrollEmployees = listPayrollRunEmployees;

export async function listPayrollRunDocuments(payrollRunId: string): Promise<DocumentRecord[]> {
  return listPayrollRunDocumentsForToken(payrollRunId);
}

export async function listPayrollRunDocumentsForToken(
  payrollRunId: string,
  accessToken?: string
): Promise<DocumentRecord[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("documents")
    .select(PAYROLL_DOCUMENT_SELECT)
    .eq("payroll_run_id", payrollRunId)
    .order("generated_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load payroll documents for run ${payrollRunId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  const documentRows = (((data as unknown) as Array<{
    company_id?: string | null;
    employee_id?: string | null;
  } & Parameters<typeof mapSupabaseDocumentToWorkspaceDocument>[0]> | null) ?? []);
  const companyIds = Array.from(new Set(documentRows.map((row) => row.company_id).filter(Boolean) as string[]));
  const employeeIds = Array.from(new Set(documentRows.map((row) => row.employee_id).filter(Boolean) as string[]));

  const [{ data: companiesData, error: companiesError }, { data: employeesData, error: employeesError }] = await Promise.all([
    companyIds.length
      ? client.from("companies").select("id,name").in("id", companyIds)
      : Promise.resolve({ data: [], error: null }),
    employeeIds.length
      ? client.from("employees").select("id,full_name").in("id", employeeIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (companiesError) {
    throw new Error(`Failed to load payroll document company labels: ${toSafeSupabaseErrorMessage(companiesError)}`);
  }

  if (employeesError) {
    throw new Error(`Failed to load payroll document employee labels: ${toSafeSupabaseErrorMessage(employeesError)}`);
  }

  const companyLabels = new Map(
    (((companiesData as unknown) as Array<{ id: string; name: string }> | null) ?? []).map((company) => [company.id, company.name])
  );
  const employeeLabels = new Map(
    (((employeesData as unknown) as Array<{ id: string; full_name?: string | null }> | null) ?? []).map((employee) => [
      employee.id,
      employee.full_name ?? employee.id,
    ])
  );
  const availableFiles = await resolveDocumentStorageAvailability(client, documentRows);

  return documentRows.map((row) => mapSupabaseDocumentToWorkspaceDocument(row, { companyLabels, employeeLabels, availableFiles }));
}

export async function submitPayrollRun(
  input: SubmitPayrollRunInput,
  sessionAccessToken?: string
): Promise<SubmitPayrollRunResult> {
  validateSubmitInput(input);
  const writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);

  const employeeIds = input.employees.map((employee) => employee.employeeId);
  const { data: employeeRows, error: employeeError } = await writeClient
    .from("employees")
    .select(EMPLOYEE_SELECT)
    .in("id", employeeIds);

  if (employeeError) {
    throw new Error(`Failed to validate payroll employees: ${toSafeSupabaseErrorMessage(employeeError)}`);
  }

  const employees = (((employeeRows as unknown) as Array<Parameters<typeof mapSupabaseEmployeeToEmployeeRecord>[0]> | null) ?? [])
    .map(mapSupabaseEmployeeToEmployeeRecord);
  const employeesById = new Map(employees.map((employee) => [employee.id, employee]));

  if (employeesById.size !== employeeIds.length) {
    throw new Error("Payroll submission includes employees that could not be loaded.");
  }

  const invalidCompanyEmployee = employees.find((employee) => employee.companyId !== input.companyId);
  if (invalidCompanyEmployee) {
    throw new Error(`Employee ${invalidCompanyEmployee.id} does not belong to company ${input.companyId}.`);
  }

  const calculatedLines = input.employees.map((line) => {
    const employee = employeesById.get(line.employeeId);
    if (!employee) {
      throw new Error(`Employee ${line.employeeId} could not be loaded for payroll.`);
    }

    const totalHours = roundMoney(line.totalHours);
    const grossPay = calculateGrossPay({
      rateType: employee.compensation.rateType,
      rateAmount: employee.compensation.rateAmount,
      totalHours,
      hoursPerDay: employee.workSchedule.hoursPerDay,
      hoursPerWeek: employee.workSchedule.hoursPerWeek,
      startDate: input.payPeriodStart,
      endDate: input.payPeriodEnd,
    });
    const deductions = roundMoney(grossPay * DEDUCTION_RATE);
    const netPay = roundMoney(grossPay - deductions);

    return {
      employee,
      totalHours,
      grossPay,
      deductions,
      netPay,
      manualHoursOverride: line.manualHoursOverride,
    };
  });

  const grossPay = roundMoney(calculatedLines.reduce((total, line) => total + line.grossPay, 0));
  const deductions = roundMoney(calculatedLines.reduce((total, line) => total + line.deductions, 0));
  const netPay = roundMoney(grossPay - deductions);
  const payrollRunId = crypto.randomUUID();
  const submittedAt = new Date().toISOString();

  const { data: runRow, error: runError } = await writeClient
    .from("payroll_runs")
    .insert({
      id: payrollRunId,
      company_id: input.companyId,
      pay_period_start: input.payPeriodStart,
      pay_period_end: input.payPeriodEnd,
      pay_date: input.payDate,
      payroll_type: normalizePayrollTypeForDb(input.payrollType),
      gross_pay: grossPay,
      deductions,
      net_pay: netPay,
      employee_count: calculatedLines.length,
      submitted_at: submittedAt,
      total: netPay,
      run_status: "completed",
      saved_at: submittedAt,
      notes: "MVP payroll submission. Deductions use a provisional flat calculation.",
    })
    .select(PAYROLL_RUN_SELECT)
    .single();

  if (runError) {
    throw new Error(`Failed to create payroll run: ${toSafeSupabaseErrorMessage(runError)}`);
  }

  const linePayloads = calculatedLines.map((line) => ({
    payroll_run_id: payrollRunId,
    company_id: input.companyId,
    employee_id: line.employee.id,
    employee_name: line.employee.name,
    rate_type: line.employee.compensation.rateType,
    rate_amount: line.employee.compensation.rateAmount,
    total_hours: line.totalHours,
    gross_pay: line.grossPay,
    deductions: line.deductions,
    net_pay: line.netPay,
    manual_hours_override: line.manualHoursOverride,
  }));

  const { data: lineRows, error: lineError } = await writeClient
    .from("payroll_run_employees")
    .insert(linePayloads)
    .select(PAYROLL_EMPLOYEE_SELECT);

  if (lineError) {
    throw new Error(`Payroll run ${payrollRunId} was created, but line items failed: ${toSafeSupabaseErrorMessage(lineError)}`);
  }

  const documentPayloads = calculatedLines.map((line) => ({
    company_id: input.companyId,
    employee_id: line.employee.id,
    payroll_run_id: payrollRunId,
    type: "pay_stub",
    document_type_id: "pay-stub",
    title: `Pay stub — ${line.employee.name} — ${input.payDate}`,
    status: "generated",
    generated_at: submittedAt,
    document_date: input.payDate,
    source_kind: "generated",
  }));

  const { data: documentRows, error: documentsError } = await writeClient
    .from("documents")
    .insert(documentPayloads)
    .select("id");

  if (documentsError) {
    throw new Error(`Payroll run ${payrollRunId} was created, but pay stub documents failed: ${toSafeSupabaseErrorMessage(documentsError)}`);
  }

  const payStubDocumentIds = (((documentRows as unknown) as Array<{ id?: string | null }> | null) ?? [])
    .map((row) => row.id)
    .filter((id): id is string => Boolean(id));
  const generatedPayStubDocumentIds: string[] = [];
  const failedPayStubDocumentIds: string[] = [];

  for (const documentId of payStubDocumentIds) {
    try {
      await generateAndStorePayStubPdf(documentId, sessionAccessToken);
      generatedPayStubDocumentIds.push(documentId);
    } catch {
      failedPayStubDocumentIds.push(documentId);
    }
  }

  const { error: auditError } = await writeClient.from("audit_logs").insert({
    company_id: input.companyId,
    action: "payroll_submitted",
    entity_type: "payroll_run",
    entity_name: `Payroll ${input.payPeriodStart} to ${input.payPeriodEnd}`,
    details: stringifyAuditDetails({
      payrollRunId,
      payDate: input.payDate,
      employeeCount: calculatedLines.length,
      grossPay,
      deductions,
      netPay,
      deductionRate: DEDUCTION_RATE,
    }),
    at: submittedAt,
  });

  if (auditError) {
    throw new Error(`Payroll run ${payrollRunId} was created, but audit logging failed: ${toSafeSupabaseErrorMessage(auditError)}`);
  }

  return {
    payrollRun: mapSupabasePayrollRunToWorkspaceRun((runRow as unknown) as SupabasePayrollRunRow),
    lineItems: (((lineRows as unknown) as Record<string, unknown>[] | null) ?? []).map(mapPayrollEmployeeLine),
    payStubDocumentIds,
    generatedPayStubDocumentIds,
    failedPayStubDocumentIds,
  };
}

export function mapSupabasePayrollRunToWorkspaceRun(row: SupabasePayrollRunRow, companyLabel?: string): PayrollRunRecord {
  const payPeriodStart = row.pay_period_start ?? "";
  const payPeriodEnd = row.pay_period_end ?? "";
  const payDate = row.pay_date ?? payPeriodEnd;
  const payrollType = normalizePayrollType(row.payroll_type);
  const status = normalizeStatus(row.run_status ?? (row.submitted_at ? "completed" : "draft"));
  const totalAmount = toNumber(row.net_pay ?? row.gross_pay, 0);
  const payPeriod = payPeriodStart && payPeriodEnd
    ? `${formatPayrollDateLabel(payPeriodStart)} - ${formatPayrollDateLabel(payPeriodEnd)}`
    : "Payroll run";

  return {
    id: row.id,
    payPeriod,
    payPeriodStart,
    payPeriodEnd,
    status,
    statusLabel: status === "completed" ? "Completed" : "Draft",
    employeesCount: row.employee_count ?? 0,
    totalAmount,
    grossPay: toNumber(row.gross_pay, 0),
    deductions: toNumber(row.deductions, 0),
    netPay: toNumber(row.net_pay, totalAmount),
    companyId: row.company_id,
    companyLabel: companyLabel ?? row.company_id,
    teamId: "operations",
    teamLabel: "Team",
    employeeIds: [],
    employeeSummary: `${row.employee_count ?? 0} employees`,
    payrollType,
    payrollTypeLabel: payrollType === "off-cycle" ? "Off-cycle" : payrollType === "bonus" ? "Bonus" : "Standard",
    payDate,
    submittedAt: row.submitted_at ?? row.created_at ?? undefined,
    viewHref: routes.payrollRun(row.id),
  };
}

function validateSubmitInput(input: SubmitPayrollRunInput) {
  if (!input.companyId?.trim()) throw new Error("companyId is required.");
  if (!input.payPeriodStart || !input.payPeriodEnd || !input.payDate) {
    throw new Error("Pay period start, pay period end, and pay date are required.");
  }

  const start = parseDateOnly(input.payPeriodStart);
  const end = parseDateOnly(input.payPeriodEnd);
  const payDate = parseDateOnly(input.payDate);

  if (!start || !end || !payDate) throw new Error("Payroll dates must be valid YYYY-MM-DD values.");
  if (start > end) throw new Error("Pay period start must be before or equal to pay period end.");
  if (!input.employees.length) throw new Error("At least one employee is required for payroll submission.");
}

function mapPayrollEmployeeLine(row: Record<string, unknown>): PayrollRunEmployeeRecord {
  return {
    id: String(row.id ?? ""),
    payrollRunId: String(row.payroll_run_id ?? ""),
    companyId: String(row.company_id ?? ""),
    employeeId: row.employee_id ? String(row.employee_id) : null,
    employeeName: String(row.employee_name ?? ""),
    rateType: normalizeRateType(String(row.rate_type ?? "")),
    rateAmount: toNumber(row.rate_amount, 0),
    totalHours: toNumber(row.total_hours, 0),
    grossPay: toNumber(row.gross_pay, 0),
    deductions: toNumber(row.deductions, 0),
    netPay: toNumber(row.net_pay, 0),
    manualHoursOverride: Boolean(row.manual_hours_override),
  };
}

function normalizePayrollType(value?: string | null): Exclude<PayrollTypeFilterId, "all"> {
  if (value === "bonus") return "bonus";
  if (value === "off-cycle" || value === "off_cycle") return "off-cycle";
  return "regular";
}

function normalizePayrollTypeForDb(value: string) {
  if (value.toLowerCase() === "bonus") return "bonus";
  if (value.toLowerCase().includes("off")) return "off_cycle";
  return "regular";
}

function normalizeStatus(value?: string | null): Exclude<PayrollStatusFilterId, "all"> {
  return value === "completed" ? "completed" : "draft";
}

function normalizeRateType(value: string): PayrollRateType {
  if (value === "daily" || value === "weekly" || value === "biWeekly" || value === "monthly" || value === "annual") return value;
  if (value === "bi_weekly") return "biWeekly";
  return "hourly";
}

function toNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}
