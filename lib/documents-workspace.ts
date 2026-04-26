import { routes } from "@/lib/routes";
import { parseDateOnly } from "@/lib/payroll-calculations";
import { useContent } from "@/lib/useContent";

export type DocumentQuickFilterId = "all" | "payroll" | "employee" | "tax" | "company";
export type DocumentCompanyFilterId = "all" | "northline" | "willow" | "harbor";
export type DocumentTeamFilterId = "all" | "operations" | "client-success" | "finance" | "leadership";
export type DocumentEmployeeFilterId = "all" | "maya-chen" | "jonas-patel" | "amelia-brooks" | "noah-singh";
export type DocumentDateRangeId = "all" | "april-2026" | "q1-2026" | "fy-2026" | "fy-2025";

export type DocumentsFilters = {
  quick: DocumentQuickFilterId;
  company: DocumentCompanyFilterId;
  team: DocumentTeamFilterId;
  employee: DocumentEmployeeFilterId;
  dateRange: DocumentDateRangeId;
};

export type DocumentRecord = {
  id: string;
  title: string;
  typeId: "pay-stub" | "payroll-run" | "letter" | "tax-form";
  typeLabel: string;
  companyId: Exclude<DocumentCompanyFilterId, "all">;
  companyLabel: string;
  teamId: Exclude<DocumentTeamFilterId, "all">;
  teamLabel: string;
  employeeId?: Exclude<DocumentEmployeeFilterId, "all">;
  employeeLabel?: string;
  date: string;
  openHref: string;
  downloadName: string;
};

const DEFAULT_FILTERS: DocumentsFilters = {
  quick: "all",
  company: "all",
  team: "all",
  employee: "all",
  dateRange: "all",
};

export function getDocumentsFilters(searchParams: URLSearchParams | ReadonlyURLSearchParamsLike): DocumentsFilters {
  return {
    quick: normalizeDocumentQuickFilter(searchParams.get("quick")),
    company: normalizeDocumentCompanyFilter(searchParams.get("company")),
    team: normalizeDocumentTeamFilter(searchParams.get("team")),
    employee: normalizeDocumentEmployeeFilter(searchParams.get("employee")),
    dateRange: normalizeDocumentDateRange(searchParams.get("dateRange")),
  };
}

export function createDocumentsHref(filters: DocumentsFilters, updates: Partial<DocumentsFilters>) {
  const next = { ...filters, ...updates };
  return routes.documentsView({
    quick: next.quick !== DEFAULT_FILTERS.quick ? next.quick : undefined,
    company: next.company !== DEFAULT_FILTERS.company ? next.company : undefined,
    team: next.team !== DEFAULT_FILTERS.team ? next.team : undefined,
    employee: next.employee !== DEFAULT_FILTERS.employee ? next.employee : undefined,
    dateRange: next.dateRange !== DEFAULT_FILTERS.dateRange ? next.dateRange : undefined,
  });
}

export function getDocumentRecords(view: ReturnType<typeof useContent>["documents"]): DocumentRecord[] {
  return [
    createRecord({
      id: "maya-paystub-apr",
      title: view.items.mayaPaystubApril.title,
      typeId: "pay-stub",
      typeLabel: view.types.payStub,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "operations",
      teamLabel: view.entities.teams.operations,
      employeeId: "maya-chen",
      employeeLabel: view.entities.employees.mayaChen,
      date: "2026-04-19",
      downloadName: "maya-chen-pay-stub-apr-19-2026.txt",
      previewLines: [view.items.mayaPaystubApril.title, view.types.payStub, view.entities.companies.northline, "Apr 19, 2026"],
    }),
    createRecord({
      id: "northline-run-apr",
      title: view.items.northlinePayrollRun.title,
      typeId: "payroll-run",
      typeLabel: view.types.payrollRun,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "finance",
      teamLabel: view.entities.teams.finance,
      date: "2026-04-18",
      downloadName: "northline-payroll-run-apr-18-2026.txt",
      previewLines: [view.items.northlinePayrollRun.title, view.types.payrollRun, view.entities.companies.northline, "Apr 18, 2026"],
    }),
    createRecord({
      id: "jonas-paystub-apr",
      title: view.items.jonasPaystubApril.title,
      typeId: "pay-stub",
      typeLabel: view.types.payStub,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "operations",
      teamLabel: view.entities.teams.operations,
      employeeId: "jonas-patel",
      employeeLabel: view.entities.employees.jonasPatel,
      date: "2026-04-19",
      downloadName: "jonas-patel-pay-stub-apr-19-2026.txt",
      previewLines: [view.items.jonasPaystubApril.title, view.types.payStub, view.entities.companies.northline, "Apr 19, 2026"],
    }),
    createRecord({
      id: "amelia-letter-bonus",
      title: view.items.ameliaBonusLetter.title,
      typeId: "letter",
      typeLabel: view.types.letter,
      companyId: "willow",
      companyLabel: view.entities.companies.willow,
      teamId: "client-success",
      teamLabel: view.entities.teams.clientSuccess,
      employeeId: "amelia-brooks",
      employeeLabel: view.entities.employees.ameliaBrooks,
      date: "2026-04-12",
      downloadName: "amelia-brooks-bonus-letter.txt",
      previewLines: [view.items.ameliaBonusLetter.title, view.types.letter, view.entities.companies.willow, "Apr 12, 2026"],
    }),
    createRecord({
      id: "board-resolution-apr",
      title: view.items.boardResolution.title,
      typeId: "letter",
      typeLabel: view.types.letter,
      companyId: "harbor",
      companyLabel: view.entities.companies.harbor,
      teamId: "leadership",
      teamLabel: view.entities.teams.leadership,
      date: "2026-04-08",
      downloadName: "board-resolution-package-apr-2026.txt",
      previewLines: [view.items.boardResolution.title, view.types.letter, view.entities.companies.harbor, "Apr 8, 2026"],
    }),
    createRecord({
      id: "employment-verification-maya",
      title: view.items.mayaVerificationLetter.title,
      typeId: "letter",
      typeLabel: view.types.letter,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "operations",
      teamLabel: view.entities.teams.operations,
      employeeId: "maya-chen",
      employeeLabel: view.entities.employees.mayaChen,
      date: "2026-03-22",
      downloadName: "maya-chen-employment-verification.txt",
      previewLines: [view.items.mayaVerificationLetter.title, view.types.letter, view.entities.companies.northline, "Mar 22, 2026"],
    }),
    createRecord({
      id: "roe-noah",
      title: view.items.noahRoe.title,
      typeId: "tax-form",
      typeLabel: view.types.taxForm,
      companyId: "harbor",
      companyLabel: view.entities.companies.harbor,
      teamId: "operations",
      teamLabel: view.entities.teams.operations,
      employeeId: "noah-singh",
      employeeLabel: view.entities.employees.noahSingh,
      date: "2026-03-28",
      downloadName: "noah-singh-record-of-employment.txt",
      previewLines: [view.items.noahRoe.title, view.types.taxForm, view.entities.companies.harbor, "Mar 28, 2026"],
    }),
    createRecord({
      id: "t4-2025-maya",
      title: view.items.mayaT4.title,
      typeId: "tax-form",
      typeLabel: view.types.taxForm,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "finance",
      teamLabel: view.entities.teams.finance,
      employeeId: "maya-chen",
      employeeLabel: view.entities.employees.mayaChen,
      date: "2025-12-31",
      downloadName: "maya-chen-t4-2025.txt",
      previewLines: [view.items.mayaT4.title, view.types.taxForm, view.entities.companies.northline, "Dec 31, 2025"],
    }),
    createRecord({
      id: "t4-2025-jonas",
      title: view.items.jonasT4.title,
      typeId: "tax-form",
      typeLabel: view.types.taxForm,
      companyId: "northline",
      companyLabel: view.entities.companies.northline,
      teamId: "finance",
      teamLabel: view.entities.teams.finance,
      employeeId: "jonas-patel",
      employeeLabel: view.entities.employees.jonasPatel,
      date: "2025-12-31",
      downloadName: "jonas-patel-t4-2025.txt",
      previewLines: [view.items.jonasT4.title, view.types.taxForm, view.entities.companies.northline, "Dec 31, 2025"],
    }),
  ];
}

export function filterDocuments(records: DocumentRecord[], filters: DocumentsFilters) {
  return records.filter((record) => {
    const matchesQuick =
      filters.quick === "all"
        ? true
        : filters.quick === "payroll"
          ? record.typeId === "pay-stub" || record.typeId === "payroll-run"
          : filters.quick === "employee"
            ? Boolean(record.employeeId)
            : filters.quick === "tax"
              ? record.typeId === "tax-form"
              : !record.employeeId;

    const matchesCompany = filters.company === "all" || record.companyId === filters.company;
    const matchesTeam = filters.team === "all" || record.teamId === filters.team;
    const matchesEmployee = filters.employee === "all" || record.employeeId === filters.employee;
    const matchesDate = matchesDocumentDateRange(record.date, filters.dateRange);

    return matchesQuick && matchesCompany && matchesTeam && matchesEmployee && matchesDate;
  });
}

export function formatWorkspaceMonthLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatWorkspaceDateLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

type ReadonlyURLSearchParamsLike = {
  get(name: string): string | null;
};

function createRecord({
  previewLines,
  ...record
}: Omit<DocumentRecord, "openHref"> & { previewLines: string[] }) {
  const body = [...previewLines, "", "Mock document preview for the Credo documents workspace."].join("\n");
  return {
    ...record,
    openHref: `data:text/plain;charset=utf-8,${encodeURIComponent(body)}`,
  };
}

function matchesDocumentDateRange(date: string, range: DocumentDateRangeId) {
  if (range === "all") return true;
  if (range === "april-2026") return date.startsWith("2026-04");
  if (range === "q1-2026") return date >= "2026-01-01" && date <= "2026-03-31";
  if (range === "fy-2026") return date.startsWith("2026");
  return date.startsWith("2025");
}

function normalizeDocumentQuickFilter(value: string | null): DocumentQuickFilterId {
  if (value === "payroll" || value === "employee" || value === "tax" || value === "company") {
    return value;
  }

  return "all";
}

function normalizeDocumentCompanyFilter(value: string | null): DocumentCompanyFilterId {
  if (value === "northline" || value === "willow" || value === "harbor") {
    return value;
  }

  return "all";
}

function normalizeDocumentTeamFilter(value: string | null): DocumentTeamFilterId {
  if (value === "operations" || value === "client-success" || value === "finance" || value === "leadership") {
    return value;
  }

  return "all";
}

function normalizeDocumentEmployeeFilter(value: string | null): DocumentEmployeeFilterId {
  if (value === "maya-chen" || value === "jonas-patel" || value === "amelia-brooks" || value === "noah-singh") {
    return value;
  }

  return "all";
}

function normalizeDocumentDateRange(value: string | null): DocumentDateRangeId {
  if (value === "april-2026" || value === "q1-2026" || value === "fy-2026" || value === "fy-2025") {
    return value;
  }

  return "all";
}
