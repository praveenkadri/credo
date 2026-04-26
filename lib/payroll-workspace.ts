import { routes } from "@/lib/routes";
import { parseDateOnly } from "@/lib/payroll-calculations";
import { useContent } from "@/lib/useContent";

export type PayrollQuickFilterId = "all" | "action-required" | "completed" | "off-cycle";
export type PayrollStatusFilterId = "all" | "draft" | "completed";
export type PayrollCompanyFilterId = "all" | "northline" | "willow" | "harbor";
export type PayrollTeamFilterId = "all" | "operations" | "client-success" | "finance" | "leadership";
export type PayrollEmployeeFilterId = "all" | "maya-chen" | "jonas-patel" | "amelia-brooks" | "noah-singh";
export type PayrollTypeFilterId = "all" | "regular" | "bonus" | "off-cycle";
export type PayrollDateRangeId = "all" | "april-2026" | "q1-2026" | "fy-2026" | "fy-2025";

export type PayrollFilters = {
  quick: PayrollQuickFilterId;
  status: PayrollStatusFilterId;
  company: PayrollCompanyFilterId;
  team: PayrollTeamFilterId;
  employee: PayrollEmployeeFilterId;
  payrollType: PayrollTypeFilterId;
  dateRange: PayrollDateRangeId;
};

export type PayrollRunRecord = {
  id: string;
  payPeriod: string;
  status: Exclude<PayrollStatusFilterId, "all">;
  statusLabel: string;
  employeesCount: number;
  totalAmount: number;
  companyId: Exclude<PayrollCompanyFilterId, "all">;
  companyLabel: string;
  teamId: Exclude<PayrollTeamFilterId, "all">;
  teamLabel: string;
  employeeIds: Array<Exclude<PayrollEmployeeFilterId, "all">>;
  employeeSummary: string;
  payrollType: Exclude<PayrollTypeFilterId, "all">;
  payrollTypeLabel: string;
  payDate: string;
  viewHref: string;
  downloadHref: string;
  downloadName: string;
};

const DEFAULT_FILTERS: PayrollFilters = {
  quick: "all",
  status: "all",
  company: "all",
  team: "all",
  employee: "all",
  payrollType: "all",
  dateRange: "all",
};

export function getPayrollFilters(searchParams: URLSearchParams | ReadonlyURLSearchParamsLike): PayrollFilters {
  return {
    quick: normalizePayrollQuickFilter(searchParams.get("quick")),
    status: normalizePayrollStatusFilter(searchParams.get("status")),
    company: normalizePayrollCompanyFilter(searchParams.get("company")),
    team: normalizePayrollTeamFilter(searchParams.get("team")),
    employee: normalizePayrollEmployeeFilter(searchParams.get("employee")),
    payrollType: normalizePayrollTypeFilter(searchParams.get("payrollType")),
    dateRange: normalizePayrollDateRange(searchParams.get("dateRange")),
  };
}

export function createPayrollHref(filters: PayrollFilters, updates: Partial<PayrollFilters>) {
  const next = { ...filters, ...updates };
  return routes.payrollView({
    quick: next.quick !== DEFAULT_FILTERS.quick ? next.quick : undefined,
    status: next.status !== DEFAULT_FILTERS.status ? next.status : undefined,
    company: next.company !== DEFAULT_FILTERS.company ? next.company : undefined,
    team: next.team !== DEFAULT_FILTERS.team ? next.team : undefined,
    employee: next.employee !== DEFAULT_FILTERS.employee ? next.employee : undefined,
    payrollType: next.payrollType !== DEFAULT_FILTERS.payrollType ? next.payrollType : undefined,
    dateRange: next.dateRange !== DEFAULT_FILTERS.dateRange ? next.dateRange : undefined,
  });
}

export function getPayrollRuns(view: ReturnType<typeof useContent>["runPayroll"]): PayrollRunRecord[] {
  return [
    createRun({
      id: "northline-apr-16-30",
      payPeriod: view.runs.items.northlineApril.payPeriod,
      status: "draft",
      statusLabel: view.runs.statuses.draft,
      employeesCount: 8,
      totalAmount: 42800,
      companyId: "northline",
      companyLabel: view.runs.entities.companies.northline,
      teamId: "operations",
      teamLabel: view.runs.entities.teams.operations,
      employeeIds: ["maya-chen", "jonas-patel"],
      employeeSummary: view.runs.items.northlineApril.employeeSummary,
      payrollType: "regular",
      payrollTypeLabel: view.runs.types.regular,
      payDate: "2026-04-30",
      downloadName: "northline-payroll-apr-30-2026.txt",
      previewLines: [
        view.runs.items.northlineApril.payPeriod,
        view.runs.statuses.draft,
        view.runs.entities.companies.northline,
        view.runs.types.regular,
      ],
    }),
    createRun({
      id: "willow-apr-16-30",
      payPeriod: view.runs.items.willowApril.payPeriod,
      status: "completed",
      statusLabel: view.runs.statuses.completed,
      employeesCount: 5,
      totalAmount: 24120,
      companyId: "willow",
      companyLabel: view.runs.entities.companies.willow,
      teamId: "client-success",
      teamLabel: view.runs.entities.teams.clientSuccess,
      employeeIds: ["amelia-brooks"],
      employeeSummary: view.runs.items.willowApril.employeeSummary,
      payrollType: "regular",
      payrollTypeLabel: view.runs.types.regular,
      payDate: "2026-04-29",
      downloadName: "willow-payroll-apr-29-2026.txt",
      previewLines: [
        view.runs.items.willowApril.payPeriod,
        view.runs.statuses.completed,
        view.runs.entities.companies.willow,
        view.runs.types.regular,
      ],
    }),
    createRun({
      id: "harbor-apr-bonus",
      payPeriod: view.runs.items.harborBonus.payPeriod,
      status: "draft",
      statusLabel: view.runs.statuses.draft,
      employeesCount: 2,
      totalAmount: 9800,
      companyId: "harbor",
      companyLabel: view.runs.entities.companies.harbor,
      teamId: "leadership",
      teamLabel: view.runs.entities.teams.leadership,
      employeeIds: ["maya-chen", "amelia-brooks"],
      employeeSummary: view.runs.items.harborBonus.employeeSummary,
      payrollType: "bonus",
      payrollTypeLabel: view.runs.types.bonus,
      payDate: "2026-04-12",
      downloadName: "harbor-bonus-apr-12-2026.txt",
      previewLines: [
        view.runs.items.harborBonus.payPeriod,
        view.runs.statuses.draft,
        view.runs.entities.companies.harbor,
        view.runs.types.bonus,
      ],
    }),
    createRun({
      id: "northline-mar-off-cycle",
      payPeriod: view.runs.items.northlineMarchOffCycle.payPeriod,
      status: "completed",
      statusLabel: view.runs.statuses.completed,
      employeesCount: 1,
      totalAmount: 1840,
      companyId: "northline",
      companyLabel: view.runs.entities.companies.northline,
      teamId: "finance",
      teamLabel: view.runs.entities.teams.finance,
      employeeIds: ["jonas-patel"],
      employeeSummary: view.runs.items.northlineMarchOffCycle.employeeSummary,
      payrollType: "off-cycle",
      payrollTypeLabel: view.runs.types.offCycle,
      payDate: "2026-03-28",
      downloadName: "northline-off-cycle-mar-28-2026.txt",
      previewLines: [
        view.runs.items.northlineMarchOffCycle.payPeriod,
        view.runs.statuses.completed,
        view.runs.entities.companies.northline,
        view.runs.types.offCycle,
      ],
    }),
    createRun({
      id: "harbor-dec-year-end",
      payPeriod: view.runs.items.harborYearEnd.payPeriod,
      status: "completed",
      statusLabel: view.runs.statuses.completed,
      employeesCount: 6,
      totalAmount: 33760,
      companyId: "harbor",
      companyLabel: view.runs.entities.companies.harbor,
      teamId: "operations",
      teamLabel: view.runs.entities.teams.operations,
      employeeIds: ["noah-singh"],
      employeeSummary: view.runs.items.harborYearEnd.employeeSummary,
      payrollType: "regular",
      payrollTypeLabel: view.runs.types.regular,
      payDate: "2025-12-31",
      downloadName: "harbor-year-end-dec-31-2025.txt",
      previewLines: [
        view.runs.items.harborYearEnd.payPeriod,
        view.runs.statuses.completed,
        view.runs.entities.companies.harbor,
        view.runs.types.regular,
      ],
    }),
  ];
}

export function filterPayrollRuns(records: PayrollRunRecord[], filters: PayrollFilters) {
  return records.filter((record) => {
    const matchesQuick =
      filters.quick === "all"
        ? true
        : filters.quick === "action-required"
          ? record.status === "draft"
          : filters.quick === "completed"
            ? record.status === "completed"
            : record.payrollType === "off-cycle";

    const matchesStatus = filters.status === "all" || record.status === filters.status;
    const matchesCompany = filters.company === "all" || record.companyId === filters.company;
    const matchesTeam = filters.team === "all" || record.teamId === filters.team;
    const matchesEmployee = filters.employee === "all" || record.employeeIds.includes(filters.employee);
    const matchesType = filters.payrollType === "all" || record.payrollType === filters.payrollType;
    const matchesDate = matchesPayrollDateRange(record.payDate, filters.dateRange);

    return matchesQuick && matchesStatus && matchesCompany && matchesTeam && matchesEmployee && matchesType && matchesDate;
  });
}

export function formatPayrollMonthLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatPayrollDateLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatPayrollMoney(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

type ReadonlyURLSearchParamsLike = {
  get(name: string): string | null;
};

function createRun({
  previewLines,
  ...record
}: Omit<PayrollRunRecord, "viewHref" | "downloadHref"> & { previewLines: string[] }) {
  const body = [...previewLines, "", "Mock payroll run preview for the Credo payroll workspace."].join("\n");
  const href = `data:text/plain;charset=utf-8,${encodeURIComponent(body)}`;

  return {
    ...record,
    viewHref: href,
    downloadHref: href,
  };
}

function matchesPayrollDateRange(date: string, range: PayrollDateRangeId) {
  if (range === "all") return true;
  if (range === "april-2026") return date.startsWith("2026-04");
  if (range === "q1-2026") return date >= "2026-01-01" && date <= "2026-03-31";
  if (range === "fy-2026") return date.startsWith("2026");
  return date.startsWith("2025");
}

function normalizePayrollQuickFilter(value: string | null): PayrollQuickFilterId {
  if (value === "action-required" || value === "completed" || value === "off-cycle") {
    return value;
  }

  return "all";
}

function normalizePayrollStatusFilter(value: string | null): PayrollStatusFilterId {
  if (value === "draft" || value === "completed") {
    return value;
  }

  return "all";
}

function normalizePayrollCompanyFilter(value: string | null): PayrollCompanyFilterId {
  if (value === "northline" || value === "willow" || value === "harbor") {
    return value;
  }

  return "all";
}

function normalizePayrollTeamFilter(value: string | null): PayrollTeamFilterId {
  if (value === "operations" || value === "client-success" || value === "finance" || value === "leadership") {
    return value;
  }

  return "all";
}

function normalizePayrollEmployeeFilter(value: string | null): PayrollEmployeeFilterId {
  if (value === "maya-chen" || value === "jonas-patel" || value === "amelia-brooks" || value === "noah-singh") {
    return value;
  }

  return "all";
}

function normalizePayrollTypeFilter(value: string | null): PayrollTypeFilterId {
  if (value === "regular" || value === "bonus" || value === "off-cycle") {
    return value;
  }

  return "all";
}

function normalizePayrollDateRange(value: string | null): PayrollDateRangeId {
  if (value === "april-2026" || value === "q1-2026" || value === "fy-2026" || value === "fy-2025") {
    return value;
  }

  return "all";
}
