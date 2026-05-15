import { routes } from "@/lib/routes";
import type { PayrollRateType } from "@/lib/payroll-calculations";
import {
  requireAuthenticatedSupabaseClient,
  toSafeSupabaseErrorMessage,
} from "@/lib/supabase/client";

export type EmployeeStatus = "active" | "inactive";
export type EmploymentType = "fullTime" | "partTime" | "contractor";
export type PaySchedule = "weekly" | "biWeekly" | "monthly";

export type EmployeeAddress = {
  streetAddress: string;
  unit?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export type EmployeeIdentity = {
  sin?: string;
  sinExpiryDate?: string;
  dateOfBirth?: string;
  taxProvince?: string;
};

export type EmployeeRecord = {
  id: string;
  companyId?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  workLocation?: string;
  status: EmployeeStatus;
  startDate: string;
  employmentType: EmploymentType;
  address: EmployeeAddress;
  identity: EmployeeIdentity;
  compensation: {
    rateType: PayrollRateType;
    rateAmount: number;
    paySchedule: PaySchedule;
    additionalRates: Array<{ id: string; label: string; amount: number; rateType: PayrollRateType }>;
  };
  workSchedule: {
    hoursPerDay: number;
    hoursPerWeek: number;
    workingDays: string[];
    overrides: string[];
  };
  payrollSettings: {
    eligibleForPayroll: boolean;
    defaultInPayroll: boolean;
    paymentMethod?: string;
    taxProfile: string;
  };
  activity: {
    lastPaidDate?: string;
  };
};

export type EmployeeFormValues = {
  name: string;
  email: string;
  phone: string;
  streetAddress: string;
  unit: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  role: string;
  status: EmployeeStatus;
  startDate: string;
  employmentType: EmploymentType;
  department: string;
  workLocation: string;
  sin: string;
  hasSinExpiry: boolean;
  sinExpiryDate: string;
  dateOfBirth: string;
  taxProvince: string;
  rateType: PayrollRateType;
  rateAmount: string;
  paySchedule: PaySchedule;
  hoursPerDay: string;
  hoursPerWeek: string;
  eligibleForPayroll: boolean;
  defaultInPayroll: boolean;
  paymentMethod: string;
};

const DEFAULT_WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
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
  "address_line_1",
  "address_line_2",
  "city",
  "province",
  "postal_code",
  "country",
  "formatted_address",
  "sin_last_four",
  "sin_status",
  "date_of_birth",
  "tax_province",
  "rate_type",
  "rate_amount",
  "pay_schedule",
  "hours_per_day",
  "hours_per_week",
  "eligible_for_payroll",
  "default_in_payroll",
  "payment_method",
  "notes",
  "created_at",
  "updated_at",
].join(",");

type SupabaseEmployeeRow = {
  id: string;
  company_id: string;
  full_name?: string | null;
  status?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  department?: string | null;
  work_location?: string | null;
  start_date?: string | null;
  employment_type?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  formatted_address?: string | null;
  sin_last_four?: string | null;
  sin_status?: string | null;
  date_of_birth?: string | null;
  tax_province?: string | null;
  rate_type?: string | null;
  rate_amount?: number | string | null;
  pay_schedule?: string | null;
  hours_per_day?: number | string | null;
  hours_per_week?: number | string | null;
  eligible_for_payroll?: boolean | null;
  default_in_payroll?: boolean | null;
  payment_method?: string | null;
  notes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type EmployeeSupabaseInput = {
  company_id: string;
  full_name: string;
  status?: EmployeeStatus;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  department?: string | null;
  work_location?: string | null;
  start_date?: string | null;
  employment_type?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  country?: string | null;
  formatted_address?: string | null;
  sin_last_four?: string | null;
  sin_status?: string;
  date_of_birth?: string | null;
  tax_province?: string | null;
  rate_type?: string;
  rate_amount?: number;
  pay_schedule?: string | null;
  hours_per_day?: number;
  hours_per_week?: number;
  eligible_for_payroll?: boolean;
  default_in_payroll?: boolean;
  payment_method?: string | null;
  notes?: string | null;
};

// Dev/demo fallback only. Never enable this as production workspace data.
// Normal employee CRUD reads and writes Supabase.
const seedEmployees: EmployeeRecord[] = [
  {
    id: "maya-chen",
    companyId: "northline",
    name: "Maya Chen",
    email: "maya@credo.test",
    phone: "416-555-0133",
    role: "Operations lead",
    department: "Operations",
    workLocation: "Toronto office",
    status: "active",
    startDate: "2024-02-12",
    address: {
      streetAddress: "180 Front Street West",
      unit: "Suite 710",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M5V 3J1",
      country: "Canada",
    },
    identity: {
      sin: "*****5678",
      dateOfBirth: "1991-04-18",
      taxProvince: "Ontario",
    },
    employmentType: "fullTime",
    compensation: {
      rateType: "monthly",
      rateAmount: 6250,
      paySchedule: "monthly",
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: 8,
      hoursPerWeek: 40,
      workingDays: DEFAULT_WORKING_DAYS,
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: true,
      defaultInPayroll: true,
      paymentMethod: "Direct deposit coming soon",
      taxProfile: "Standard payroll profile",
    },
    activity: {
      lastPaidDate: "2026-04-19",
    },
  },
  {
    id: "jonas-patel",
    companyId: "northline",
    name: "Jonas Patel",
    email: "jonas@credo.test",
    phone: "647-555-0171",
    role: "Operations coordinator",
    department: "Operations",
    workLocation: "Hybrid",
    status: "active",
    startDate: "2024-08-05",
    address: {
      streetAddress: "725 Queen Street East",
      city: "Toronto",
      province: "Ontario",
      postalCode: "M4M 1H1",
      country: "Canada",
    },
    identity: {
      sin: "*****3456",
      dateOfBirth: "1996-09-03",
      taxProvince: "Ontario",
    },
    employmentType: "fullTime",
    compensation: {
      rateType: "hourly",
      rateAmount: 48,
      paySchedule: "biWeekly",
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: 8,
      hoursPerWeek: 40,
      workingDays: DEFAULT_WORKING_DAYS,
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: true,
      defaultInPayroll: true,
      paymentMethod: "Direct deposit coming soon",
      taxProfile: "Standard payroll profile",
    },
    activity: {
      lastPaidDate: "2026-04-19",
    },
  },
  {
    id: "amelia-brooks",
    companyId: "willow",
    name: "Amelia Brooks",
    email: "amelia@credo.test",
    phone: "437-555-0114",
    role: "Client success manager",
    department: "Client success",
    workLocation: "Remote",
    status: "active",
    startDate: "2023-11-20",
    address: {
      streetAddress: "1090 Rue de la Montagne",
      unit: "Apt 402",
      city: "Montreal",
      province: "Quebec",
      postalCode: "H3G 1Y4",
      country: "Canada",
    },
    identity: {
      sin: "*****9876",
      dateOfBirth: "1989-12-11",
      taxProvince: "Quebec",
    },
    employmentType: "fullTime",
    compensation: {
      rateType: "annual",
      rateAmount: 77000,
      paySchedule: "biWeekly",
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: 8,
      hoursPerWeek: 40,
      workingDays: DEFAULT_WORKING_DAYS,
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: true,
      defaultInPayroll: true,
      paymentMethod: "Direct deposit coming soon",
      taxProfile: "Standard payroll profile",
    },
    activity: {
      lastPaidDate: "2026-04-19",
    },
  },
  {
    id: "noah-singh",
    companyId: "harbor",
    name: "Noah Singh",
    email: "noah@credo.test",
    phone: "905-555-0188",
    role: "Field team lead",
    department: "Field",
    workLocation: "On-site",
    status: "inactive",
    startDate: "2024-01-15",
    address: {
      streetAddress: "44 King Street South",
      city: "Waterloo",
      province: "Ontario",
      postalCode: "N2J 1N8",
      country: "Canada",
    },
    identity: {
      sin: "*****4761",
      sinExpiryDate: "2027-01-15",
      dateOfBirth: "1993-07-22",
      taxProvince: "Ontario",
    },
    employmentType: "partTime",
    compensation: {
      rateType: "daily",
      rateAmount: 345,
      paySchedule: "weekly",
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: 8,
      hoursPerWeek: 24,
      workingDays: ["Mon", "Tue", "Wed"],
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: false,
      defaultInPayroll: false,
      paymentMethod: "Cheque placeholder",
      taxProfile: "Seasonal payroll profile",
    },
    activity: {
      lastPaidDate: "2026-03-28",
    },
  },
];

export function getSeedEmployees() {
  return seedEmployees.map((employee) => normalizeEmployeeRecord(employee));
}

export function employeeInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function employeeCompensationSummary(employee: EmployeeRecord) {
  const amount = formatCurrency(employee.compensation.rateAmount);
  switch (employee.compensation.rateType) {
    case "hourly":
      return `${amount}/hr`;
    case "daily":
      return `${amount}/day`;
    case "weekly":
      return `${amount}/week`;
    case "biWeekly":
      return `${amount}/bi-weekly`;
    case "monthly":
      return `${amount}/month`;
    case "annual":
      return `${amount}/year`;
    default:
      return amount;
  }
}

export function employeeProfileHref(id: string, companyId?: string) {
  return companyId ? `${routes.companyEmployees(companyId)}/${id}` : routes.employee(id);
}

export function employeeEditHref(id: string) {
  return routes.employeeEdit(id);
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDateLabel(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function emptyEmployeeFormValues(): EmployeeFormValues {
  return {
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    unit: "",
    city: "",
    province: "",
    postalCode: "",
    country: "Canada",
    role: "",
    status: "active",
    startDate: "2026-04-26",
    employmentType: "fullTime",
    department: "",
    workLocation: "",
    sin: "",
    hasSinExpiry: false,
    sinExpiryDate: "",
    dateOfBirth: "",
    taxProvince: "",
    rateType: "hourly",
    rateAmount: "",
    paySchedule: "biWeekly",
    hoursPerDay: "8",
    hoursPerWeek: "40",
    eligibleForPayroll: true,
    defaultInPayroll: true,
    paymentMethod: "Direct deposit coming soon",
  };
}

export function employeeToFormValues(employee: EmployeeRecord): EmployeeFormValues {
  const normalized = normalizeEmployeeRecord(employee);

  return {
    name: normalized.name,
    email: normalized.email ?? "",
    phone: normalized.phone ?? "",
    streetAddress: normalized.address.streetAddress,
    unit: normalized.address.unit ?? "",
    city: normalized.address.city,
    province: normalized.address.province,
    postalCode: normalized.address.postalCode,
    country: normalized.address.country,
    role: normalized.role ?? "",
    status: normalized.status,
    startDate: normalized.startDate,
    employmentType: normalized.employmentType,
    department: normalized.department ?? "",
    workLocation: normalized.workLocation ?? "",
    sin: normalized.identity.sin ?? "",
    hasSinExpiry: Boolean(normalized.identity.sinExpiryDate),
    sinExpiryDate: normalized.identity.sinExpiryDate ?? "",
    dateOfBirth: normalized.identity.dateOfBirth ?? "",
    taxProvince: normalized.identity.taxProvince ?? "",
    rateType: normalized.compensation.rateType,
    rateAmount: String(normalized.compensation.rateAmount),
    paySchedule: normalized.compensation.paySchedule,
    hoursPerDay: String(normalized.workSchedule.hoursPerDay),
    hoursPerWeek: String(normalized.workSchedule.hoursPerWeek),
    eligibleForPayroll: normalized.payrollSettings.eligibleForPayroll,
    defaultInPayroll: normalized.payrollSettings.defaultInPayroll,
    paymentMethod: normalized.payrollSettings.paymentMethod ?? "Direct deposit coming soon",
  };
}

export async function listEmployees(companyId?: string): Promise<EmployeeRecord[]> {
  return listEmployeesForToken(companyId);
}

export async function listEmployeesForToken(companyId?: string, accessToken?: string): Promise<EmployeeRecord[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  let query = client
    .from("employees")
    .select(EMPLOYEE_SELECT)
    .order("full_name", { ascending: true });

  if (companyId) {
    query = query.eq("company_id", companyId);
  } else {
    const { data: activeCompanies, error: companiesError } = await client
      .from("companies")
      .select("id")
      .eq("status", "active");

    if (companiesError) {
      throw new Error(`Failed to load active company scope for employees: ${toSafeSupabaseErrorMessage(companiesError)}`);
    }

    const companyIds = ((activeCompanies as Array<{ id: string }> | null) ?? []).map((company) => company.id);
    if (!companyIds.length) {
      return [];
    }

    query = query.in("company_id", companyIds);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load employees${companyId ? ` for company ${companyId}` : ""}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return (((data as unknown) as SupabaseEmployeeRow[] | null) ?? []).map(mapSupabaseEmployeeToEmployeeRecord);
}

export async function getEmployee(employeeId: string): Promise<EmployeeRecord | null> {
  return getEmployeeForToken(employeeId);
}

export async function getEmployeeForToken(employeeId: string, accessToken?: string): Promise<EmployeeRecord | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("employees")
    .select(EMPLOYEE_SELECT)
    .eq("id", employeeId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load employee ${employeeId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return data ? mapSupabaseEmployeeToEmployeeRecord((data as unknown) as SupabaseEmployeeRow) : null;
}

export async function createEmployee(input: EmployeeSupabaseInput, sessionAccessToken?: string): Promise<EmployeeRecord> {
  if (!input.company_id?.trim()) {
    throw new Error("Cannot create employee without company_id.");
  }

  if (!input.full_name?.trim()) {
    throw new Error("Cannot create employee without full_name.");
  }

  const writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);
  const { data, error } = await writeClient
    .from("employees")
    .insert(input)
    .select(EMPLOYEE_SELECT)
    .single();

  if (error) {
    throw new Error(`Failed to create employee for company ${input.company_id}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return mapSupabaseEmployeeToEmployeeRecord((data as unknown) as SupabaseEmployeeRow);
}

export async function updateEmployee(
  employeeId: string,
  input: Partial<EmployeeSupabaseInput>,
  sessionAccessToken?: string
): Promise<EmployeeRecord> {
  if (!employeeId.trim()) {
    throw new Error("Cannot update employee without employeeId.");
  }

  const writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);
  const { data, error } = await writeClient
    .from("employees")
    .update(input)
    .eq("id", employeeId)
    .select(EMPLOYEE_SELECT)
    .single();

  if (error) {
    throw new Error(`Failed to update employee ${employeeId}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return mapSupabaseEmployeeToEmployeeRecord((data as unknown) as SupabaseEmployeeRow);
}

export async function deactivateEmployee(employeeId: string, sessionAccessToken?: string): Promise<EmployeeRecord> {
  return updateEmployee(employeeId, {
    status: "inactive",
    default_in_payroll: false,
  }, sessionAccessToken);
}

export function mapSupabaseEmployeeToEmployeeRecord(row: SupabaseEmployeeRow): EmployeeRecord {
  const sinLastFour = row.sin_last_four?.replace(/\D/g, "").slice(-4);

  return normalizeEmployeeRecord({
    id: row.id,
    companyId: row.company_id,
    name: row.full_name ?? "",
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    role: row.role ?? undefined,
    department: row.department ?? undefined,
    workLocation: row.work_location ?? undefined,
    status: row.status === "inactive" ? "inactive" : "active",
    startDate: row.start_date ?? "",
    employmentType: mapEmploymentTypeFromDb(row.employment_type),
    address: {
      streetAddress: row.address_line_1 ?? row.formatted_address ?? "",
      unit: row.address_line_2 ?? undefined,
      city: row.city ?? "",
      province: row.province ?? "",
      postalCode: row.postal_code ?? "",
      country: row.country ?? "Canada",
    },
    identity: {
      sin: sinLastFour ? `*****${sinLastFour}` : undefined,
      dateOfBirth: row.date_of_birth ?? undefined,
      taxProvince: row.tax_province ?? undefined,
    },
    compensation: {
      rateType: mapRateTypeFromDb(row.rate_type),
      rateAmount: toNumber(row.rate_amount, 0),
      paySchedule: mapPayScheduleFromDb(row.pay_schedule),
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: toNumber(row.hours_per_day, 8),
      hoursPerWeek: toNumber(row.hours_per_week, 40),
      workingDays: DEFAULT_WORKING_DAYS,
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: row.eligible_for_payroll ?? true,
      defaultInPayroll: row.default_in_payroll ?? true,
      paymentMethod: row.payment_method ?? "Direct deposit coming soon",
      taxProfile: row.tax_province ? `${row.tax_province} payroll profile` : "Standard payroll profile",
    },
    activity: {},
  });
}

export function mapEmployeeFormValuesToSupabaseInput(values: EmployeeFormValues, companyId?: string): EmployeeSupabaseInput {
  const name = values.name.trim();
  const resolvedCompanyId = companyId?.trim() ?? "";
  const sinDigits = values.sin.replace(/\D/g, "");
  const hasSin = sinDigits.length > 0;

  return {
    company_id: resolvedCompanyId,
    full_name: name,
    status: values.status,
    email: nullableText(values.email),
    phone: nullableText(values.phone),
    role: nullableText(values.role),
    department: nullableText(values.department),
    work_location: nullableText(values.workLocation),
    start_date: nullableText(values.startDate),
    employment_type: values.employmentType,
    address_line_1: nullableText(values.streetAddress),
    address_line_2: nullableText(values.unit),
    city: nullableText(values.city),
    province: nullableText(values.province),
    postal_code: nullableText(values.postalCode),
    country: nullableText(values.country) ?? "Canada",
    formatted_address: nullableText(formatAddressLine(values)),
    sin_last_four: hasSin ? sinDigits.slice(-4) : null,
    sin_status: hasSin ? "provided" : "not_provided",
    date_of_birth: nullableText(values.dateOfBirth),
    tax_province: nullableText(values.taxProvince),
    rate_type: values.rateType || "hourly",
    rate_amount: toNumber(values.rateAmount, 0),
    pay_schedule: values.paySchedule,
    hours_per_day: toNumber(values.hoursPerDay, 8),
    hours_per_week: toNumber(values.hoursPerWeek, 40),
    eligible_for_payroll: values.eligibleForPayroll,
    default_in_payroll: values.defaultInPayroll,
    payment_method: nullableText(values.paymentMethod),
  };
}

function nullableText(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed ? trimmed : null;
}

function toNumber(value: number | string | null | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatAddressLine(values: EmployeeFormValues) {
  return [values.streetAddress, values.unit, values.city, values.province, values.postalCode, values.country]
    .filter((item) => item.trim())
    .join(", ");
}

function mapEmploymentTypeFromDb(value?: string | null): EmploymentType {
  if (value === "partTime" || value === "part_time") return "partTime";
  if (value === "contractor") return "contractor";
  return "fullTime";
}

function mapRateTypeFromDb(value?: string | null): PayrollRateType {
  if (value === "daily" || value === "weekly" || value === "biWeekly" || value === "monthly" || value === "annual") {
    return value;
  }
  if (value === "bi_weekly") return "biWeekly";
  return "hourly";
}

function mapPayScheduleFromDb(value?: string | null): PaySchedule {
  if (value === "weekly" || value === "monthly") return value;
  return "biWeekly";
}

export function normalizeEmployeeRecord(employee: EmployeeRecord): EmployeeRecord {
  return {
    ...employee,
    companyId: employee.companyId ?? undefined,
    phone: employee.phone ?? undefined,
    department: employee.department ?? undefined,
    workLocation: employee.workLocation ?? undefined,
    address: {
      streetAddress: employee.address?.streetAddress ?? "",
      unit: employee.address?.unit ?? undefined,
      city: employee.address?.city ?? "",
      province: employee.address?.province ?? "",
      postalCode: employee.address?.postalCode ?? "",
      country: employee.address?.country ?? "Canada",
    },
    identity: {
      sin: employee.identity?.sin ?? undefined,
      sinExpiryDate: employee.identity?.sinExpiryDate ?? undefined,
      dateOfBirth: employee.identity?.dateOfBirth ?? undefined,
      taxProvince: employee.identity?.taxProvince ?? undefined,
    },
    compensation: {
      ...employee.compensation,
      rateType: employee.compensation?.rateType ?? "hourly",
      rateAmount: employee.compensation?.rateAmount ?? 0,
      paySchedule: employee.compensation?.paySchedule ?? "biWeekly",
      additionalRates: [...(employee.compensation?.additionalRates ?? [])],
    },
    workSchedule: {
      ...employee.workSchedule,
      hoursPerDay: employee.workSchedule?.hoursPerDay ?? 8,
      hoursPerWeek: employee.workSchedule?.hoursPerWeek ?? 40,
      workingDays: [...(employee.workSchedule?.workingDays ?? DEFAULT_WORKING_DAYS)],
      overrides: [...(employee.workSchedule?.overrides ?? [])],
    },
    payrollSettings: {
      ...employee.payrollSettings,
      eligibleForPayroll: employee.payrollSettings?.eligibleForPayroll ?? true,
      defaultInPayroll: employee.payrollSettings?.defaultInPayroll ?? true,
      paymentMethod: employee.payrollSettings?.paymentMethod ?? "Direct deposit coming soon",
      taxProfile: employee.payrollSettings?.taxProfile ?? "Standard payroll profile",
    },
    activity: {
      ...employee.activity,
    },
  };
}
