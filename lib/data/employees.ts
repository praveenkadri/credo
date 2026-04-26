import { routes } from "@/lib/routes";
import type { PayrollRateType } from "@/lib/payroll-calculations";

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

export const EMPLOYEE_STORAGE_KEY = "credo:employees:v1";

const DEFAULT_WORKING_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const seedEmployees: EmployeeRecord[] = [
  {
    id: "maya-chen",
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
      sin: "512345678",
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
      sin: "478123456",
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
      sin: "401239876",
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
      sin: "589234761",
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

export function employeeProfileHref(id: string) {
  return routes.employee(id);
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

export function formValuesToEmployee(values: EmployeeFormValues, existingId?: string): EmployeeRecord {
  const name = values.name.trim();
  const id = existingId ?? slugify(name);

  return {
    id,
    name,
    email: values.email.trim() || undefined,
    phone: values.phone.trim() || undefined,
    role: values.role.trim() || undefined,
    department: values.department.trim() || undefined,
    workLocation: values.workLocation.trim() || undefined,
    status: values.status,
    startDate: values.startDate,
    employmentType: values.employmentType,
    address: {
      streetAddress: values.streetAddress.trim(),
      unit: values.unit.trim() || undefined,
      city: values.city.trim(),
      province: values.province.trim(),
      postalCode: values.postalCode.trim(),
      country: values.country.trim() || "Canada",
    },
    identity: {
      sin: values.sin.replace(/\s+/g, "") || undefined,
      sinExpiryDate: values.hasSinExpiry ? values.sinExpiryDate || undefined : undefined,
      dateOfBirth: values.dateOfBirth || undefined,
      taxProvince: values.taxProvince.trim() || undefined,
    },
    compensation: {
      rateType: values.rateType,
      rateAmount: Number(values.rateAmount || 0),
      paySchedule: values.paySchedule,
      additionalRates: [],
    },
    workSchedule: {
      hoursPerDay: Number(values.hoursPerDay || 8),
      hoursPerWeek: Number(values.hoursPerWeek || 40),
      workingDays: DEFAULT_WORKING_DAYS,
      overrides: [],
    },
    payrollSettings: {
      eligibleForPayroll: values.eligibleForPayroll,
      defaultInPayroll: values.defaultInPayroll,
      paymentMethod: values.paymentMethod.trim() || undefined,
      taxProfile: values.taxProvince.trim() ? `${values.taxProvince.trim()} payroll profile` : "Standard payroll profile",
    },
    activity: {},
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeEmployeeRecord(employee: EmployeeRecord): EmployeeRecord {
  return {
    ...employee,
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
