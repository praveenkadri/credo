import {
  companies as overviewCompanies,
  statePillToneMap,
  stateToneMap,
} from "@/components/overview/overview-data";
import { getCompanyDetailPageData, type CompanyDetail } from "@/components/company-detail/company-detail-data";
import { routes } from "@/lib/routes";
import {
  SIGN_IN_REQUIRED_MESSAGE,
  createSupabaseClientForToken,
  requireAuthenticatedSupabaseClient,
  toSafeSupabaseErrorMessage,
} from "@/lib/supabase/client";
import { sanitizeAuditDetails } from "@/lib/audit/sanitize";

const SUPABASE_TABLES = {
  companies: "companies",
  employees: "employees",
  payrollRuns: "payroll_runs",
  documents: "documents",
  auditLogs: "audit_logs",
  companyDeletionAudit: "company_deletion_audit",
} as const;

const STORAGE_BUCKET_CANDIDATES = ["company-assets", "assets", "uploads"];
const COMPANY_OPTIONAL_IDENTITY_COLUMNS = [
  "user_id",
  "workspace_id",
  "owner_id",
  "organization_id",
  "created_by",
] as const;
const COMPANY_OPTIONAL_PROFILE_COLUMNS = [
  "legal_name",
  "country",
  "formatted_address",
  "address_source",
  "address_verified",
  "address_has_subpremise",
  "latitude",
  "longitude",
  "hst_number",
  "bin_number",
  "business_number",
  "fiscal_year_end",
  "plan_override",
] as const;
const COMPANY_SOFT_DELETE_COLUMNS = [
  "deleted_at",
  "deleted_by",
  "delete_reason",
  "delete_reason_note",
] as const;

let cachedCompanyIdentityColumns: Set<string> | null = null;
let cachedCompanyProfileColumns: Set<string> | null = null;
let cachedCompanySoftDeleteColumns: Set<string> | null = null;

interface SupabaseCompanyRow {
  id: string;
  name: string;
  user_id?: string | null;
  owner_id?: string | null;
  created_by?: string | null;
  address: string | null;
  address_line2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  logo_url: string | null;
  director_name: string | null;
  director_title: string | null;
  signature_url: string | null;
  payroll_account_number: string | null;
  hst_number?: string | null;
  bin_number?: string | null;
  business_number?: string | null;
  created_at?: string | null;
  updated_at: string;
  plan_override: string | null;
  setup_completed_at?: string | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  delete_reason?: string | null;
  delete_reason_note?: string | null;
}

interface SupabaseEmployeeRow {
  company_id: string;
}

interface SupabasePayrollRunRow {
  company_id: string;
  total: number;
  run_status: string;
  saved_at: string;
}

type CompanyProfileMeta = {
  legalName?: string;
  sameAsCompanyName?: boolean;
  establishedDate?: string | null;
  country?: string;
  formattedAddress?: string;
  addressSource?: string;
  addressVerified?: boolean;
  latitude?: string;
  longitude?: string;
  hstNumber?: string;
  binNumber?: string;
  businessNumber?: string;
  fiscalYearEnd?: string;
};

export type CompanyProfile = {
  id: string;
  companyName: string;
  legalName: string;
  sameAsCompanyName: boolean;
  establishedDate: string;
  logoUrl: string;
  streetAddress: string;
  unitSuite: string;
  city: string;
  provinceState: string;
  postalCode: string;
  country: string;
  hstNumber: string;
  payrollNumber: string;
  binNumber: string;
  businessNumber: string;
  fiscalYearEnd: string;
  directorName: string;
  directorTitle: string;
  signatureUrl: string;
  setupCompletedAt?: string;
};

export type CompanyDeleteSummary = {
  id: string;
  name: string;
  employeeCount: number;
  payrollNumber: string;
  hstNumber: string;
  binNumber: string;
  businessNumber: string;
};

export type CompanyProfileInput = {
  companyName: string;
  legalName: string;
  sameAsCompanyName?: boolean;
  establishedDate?: string;
  logoFile?: File | null;
  existingLogoUrl?: string;
  streetAddress?: string;
  unitSuite?: string;
  city?: string;
  provinceState?: string;
  postalCode?: string;
  country?: string;
  formattedAddress?: string;
  addressSource?: string;
  addressVerified?: boolean;
  addressHasSubpremise?: boolean;
  latitude?: string;
  longitude?: string;
  hstNumber?: string;
  payrollNumber?: string;
  binNumber?: string;
  businessNumber?: string;
  fiscalYearEnd?: string;
  directorName?: string;
  directorTitle?: string;
  signatureFile?: File | null;
  existingSignatureUrl?: string;
};

export type MissingCompanyDetailsCategory =
  | "tax_details"
  | "address"
  | "authorization"
  | "company_profile";

export type CompanySetupPrimaryPrompt = {
  title: string;
  description: string;
  cta: string;
  href: string;
};

export type CompanySetupPromptResult = {
  primaryPrompt?: CompanySetupPrimaryPrompt;
  prompts: CompanySetupPrimaryPrompt[];
};

export type CompanyWorkspaceSummary = {
  employeeCount: number;
  payrollRunCount: number;
  documentCount: number;
};

export type CompanyCompleteness = {
  isComplete: boolean;
  missing: MissingCompanyDetailsCategory[];
  primaryPrompt?: CompanySetupPrimaryPrompt;
};

export type DashboardActivityState = {
  hasCompanies: boolean;
  hasActivity: boolean;
};

export type OverviewCompany = (typeof overviewCompanies)[number];
type CompanyState = OverviewCompany["state"];

type CompanyHealthState = CompanyDetail["status"];

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

function relativeTimeLabel(timestamp: string | null | undefined) {
  if (!timestamp) return "recently";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "recently";

  const diffMs = date.getTime() - Date.now();
  const minutes = Math.round(diffMs / 60000);
  const absMinutes = Math.abs(minutes);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absMinutes < 60) {
    return formatter.format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) {
    return formatter.format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return formatter.format(days, "day");
}

function normalizeRunStatus(status: string | null | undefined) {
  const value = (status ?? "").toLowerCase();

  if (value.includes("fund")) return "funding due";
  if (value.includes("review") || value.includes("draft") || value.includes("pending")) return "prepared";
  if (value.includes("complete") || value.includes("approved") || value.includes("paid")) return "completed";

  return "prepared";
}

function deriveOverviewState(runStatus: string | null | undefined): { state: CompanyState; detail: string } {
  if (!runStatus) {
    return { state: "Healthy", detail: "No activity yet" };
  }

  const normalized = normalizeRunStatus(runStatus);

  if (normalized === "funding due") {
    return { state: "Funding due", detail: "Funding due" };
  }

  if (normalized === "prepared") {
    return { state: "Needs review", detail: "Review pending" };
  }

  return { state: "Healthy", detail: "Run in normal range" };
}

function toCompanyHealth(state: CompanyState): CompanyHealthState {
  if (state === "Funding due") return "Funding due";
  if (state === "Needs review") return "Needs review";
  return "Healthy";
}

function latestRunsByCompany(runs: SupabasePayrollRunRow[]) {
  const byCompany = new Map<string, SupabasePayrollRunRow>();

  for (const run of runs) {
    if (!byCompany.has(run.company_id)) {
      byCompany.set(run.company_id, run);
    }
  }

  return byCompany;
}

function employeeCountsByCompany(employees: SupabaseEmployeeRow[]) {
  const counts = new Map<string, number>();

  for (const employee of employees) {
    counts.set(employee.company_id, (counts.get(employee.company_id) ?? 0) + 1);
  }

  return counts;
}

function slugifyCompanyId(name: string) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const safeBase = base || "company";
  return `${safeBase}-${crypto.randomUUID().slice(0, 8)}`;
}

function parsePlanOverride(value: string | null | undefined): CompanyProfileMeta {
  if (!value) return {};

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as CompanyProfileMeta;
  } catch {
    return {};
  }
}

function serializePlanOverride(meta: CompanyProfileMeta) {
  return JSON.stringify(meta);
}

function hasContent(value: string | null | undefined) {
  return Boolean(value && value.trim());
}

function normalizeCompanyMatchText(value: string | null | undefined) {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return normalized || null;
}

type SupabaseErrorLike = {
  message: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
};

export type DeleteCompanyReason =
  | "Created by mistake"
  | "Company is no longer active"
  | "Duplicate company"
  | "Moved to another system"
  | "Testing/demo data"
  | "Other";

export class CompanyCreateError extends Error {
  code?: string;
  details?: string | null;
  hint?: string | null;
  field?: "companyName" | "legalName" | "address";
  userMessage: string;

  constructor({
    message,
    userMessage,
    code,
    details,
    hint,
    field,
  }: {
    message: string;
    userMessage: string;
    code?: string;
    details?: string | null;
    hint?: string | null;
    field?: "companyName" | "legalName" | "address";
  }) {
    super(message);
    this.name = "CompanyCreateError";
    this.code = code;
    this.details = details;
    this.hint = hint;
    this.field = field;
    this.userMessage = userMessage;
  }
}

function mapCreateCompanyInsertError(error: SupabaseErrorLike) {
  const message = error.message.toLowerCase();
  const details = String(error.details ?? "").toLowerCase();
  const combined = `${message} ${details}`;

  if (
    error.code === "23505" &&
    (combined.includes("duplicate company") ||
      combined.includes("already exists") ||
      combined.includes("business number") ||
      combined.includes("payroll number") ||
      combined.includes("hst number"))
  ) {
    return new CompanyCreateError({
      message: `Failed to create company: ${error.message}`,
      userMessage:
        "A company with matching legal details already exists in this workspace. Review the company name, tax IDs, and payroll number and try again.",
      code: error.code,
      hint: error.hint,
      field: "legalName",
    });
  }

  if (
    error.code === "42501" ||
    combined.includes("row-level security") ||
    combined.includes("permission denied") ||
    combined.includes("jwt")
  ) {
    return new CompanyCreateError({
      message: `Failed to create company: ${error.message}`,
      userMessage: "Create is blocked by database access policy. Run the Credo RLS script and try again.",
      code: error.code,
      hint: error.hint,
    });
  }

  if (error.code === "23502") {
    if (
      combined.includes("column \"user_id\"") ||
      combined.includes("column \"workspace_id\"") ||
      combined.includes("column \"owner_id\"") ||
      combined.includes("column \"organization_id\"") ||
      combined.includes("column \"created_by\"")
    ) {
      return new CompanyCreateError({
        message: `Failed to create company: ${error.message}`,
        userMessage: "We couldn’t verify your workspace. Please sign in again and try creating the company.",
        code: error.code,
        hint: error.hint,
      });
    }

    if (combined.includes("column \"name\"")) {
      return new CompanyCreateError({
        message: `Failed to create company: ${error.message}`,
        userMessage: "Company name is missing. Add it and try again.",
        code: error.code,
        hint: error.hint,
        field: "companyName",
      });
    }

    if (
      combined.includes("column \"address\"") ||
      combined.includes("column \"city\"") ||
      combined.includes("column \"province\"") ||
      combined.includes("column \"postal_code\"")
    ) {
      return new CompanyCreateError({
        message: `Failed to create company: ${error.message}`,
        userMessage: "Address is required. Add the address and try again.",
        code: error.code,
        hint: error.hint,
        field: "address",
      });
    }
  }

  return new CompanyCreateError({
    message: `Failed to create company: ${error.message}`,
    userMessage: "Database insert failed. Check required company fields and try again.",
    code: error.code,
    hint: error.hint,
  });
}

function isPlanOverrideConstraintError(error: SupabaseErrorLike) {
  const combined = `${error.message} ${String(error.details ?? "")}`.toLowerCase();
  return error.code === "23514" && combined.includes("plan_override_check");
}

type DuplicateCheckCompanyRow = {
  id: string;
  name: string;
  legal_name?: string | null;
  city?: string | null;
  province?: string | null;
  payroll_account_number?: string | null;
  hst_number?: string | null;
  business_number?: string | null;
  workspace_id?: string | null;
  organization_id?: string | null;
  deleted_at?: string | null;
};

async function getCompanyIdentityColumns(client: ReturnType<typeof createSupabaseClientForToken>) {
  if (cachedCompanyIdentityColumns) {
    return cachedCompanyIdentityColumns;
  }

  const availableColumns = new Set<string>();

  await Promise.all(
    COMPANY_OPTIONAL_IDENTITY_COLUMNS.map(async (column) => {
      const { error } = await client.from(SUPABASE_TABLES.companies).select(column).limit(1);
      if (!error) {
        availableColumns.add(column);
      }
    })
  );

  cachedCompanyIdentityColumns = availableColumns;
  return availableColumns;
}

async function getCompanyProfileColumns(client: ReturnType<typeof createSupabaseClientForToken>) {
  if (cachedCompanyProfileColumns) {
    return cachedCompanyProfileColumns;
  }

  const availableColumns = new Set<string>();

  await Promise.all(
    COMPANY_OPTIONAL_PROFILE_COLUMNS.map(async (column) => {
      const { error } = await client.from(SUPABASE_TABLES.companies).select(column).limit(1);
      if (!error) {
        availableColumns.add(column);
      }
    })
  );

  cachedCompanyProfileColumns = availableColumns;
  return availableColumns;
}

async function getCompanySoftDeleteColumns(client: ReturnType<typeof createSupabaseClientForToken>) {
  if (cachedCompanySoftDeleteColumns) {
    return cachedCompanySoftDeleteColumns;
  }

  const availableColumns = new Set<string>();

  await Promise.all(
    COMPANY_SOFT_DELETE_COLUMNS.map(async (column) => {
      const { error } = await client.from(SUPABASE_TABLES.companies).select(column).limit(1);
      if (!error) {
        availableColumns.add(column);
      }
    })
  );

  cachedCompanySoftDeleteColumns = availableColumns;
  return availableColumns;
}

async function assertNoDuplicateCompany(
  client: ReturnType<typeof createSupabaseClientForToken>,
  input: CompanyProfileInput,
  options: {
    resolvedWorkspaceId: string;
    identityColumns: Set<string>;
    profileColumns: Set<string>;
    softDeleteColumns: Set<string>;
  }
) {
  const columns = ["id", "name", "city", "province", "payroll_account_number"];

  if (options.profileColumns.has("legal_name")) columns.push("legal_name");
  if (options.profileColumns.has("hst_number")) columns.push("hst_number");
  if (options.profileColumns.has("business_number")) columns.push("business_number");
  if (options.identityColumns.has("workspace_id")) columns.push("workspace_id");
  if (options.identityColumns.has("organization_id")) columns.push("organization_id");
  if (options.softDeleteColumns.has("deleted_at")) columns.push("deleted_at");

  let query = client.from(SUPABASE_TABLES.companies).select(columns.join(","));
  if (options.softDeleteColumns.has("deleted_at")) {
    query = query.is("deleted_at", null);
  }

  const { data, error } = await query.limit(500);

  if (error) {
    return;
  }

  const rows = (((data as unknown) as DuplicateCheckCompanyRow[] | null) ?? []).filter((row) => {
    if (!options.softDeleteColumns.has("deleted_at")) return true;
    return !row.deleted_at;
  });

  const nextScope = options.resolvedWorkspaceId.trim();
  const nextBusinessNumber = normalizeCompanyMatchText(input.businessNumber);
  const nextPayrollNumber = normalizeCompanyMatchText(input.payrollNumber);
  const nextHstNumber = normalizeCompanyMatchText(input.hstNumber);
  const nextLegalName = normalizeCompanyMatchText(input.legalName || input.companyName);
  const nextCity = normalizeCompanyMatchText(input.city);
  const nextProvince = normalizeCompanyMatchText(input.provinceState);

  const scopedRows = rows.filter((row) => {
    if (!nextScope) return true;

    const rowScope = String(row.workspace_id ?? row.organization_id ?? "").trim();
    return rowScope ? rowScope === nextScope : true;
  });

  const duplicate =
    scopedRows.find((row) => {
      const rowBusinessNumber = normalizeCompanyMatchText(row.business_number);
      return nextBusinessNumber && rowBusinessNumber === nextBusinessNumber;
    }) ??
    scopedRows.find((row) => {
      const rowPayrollNumber = normalizeCompanyMatchText(row.payroll_account_number);
      return nextPayrollNumber && rowPayrollNumber === nextPayrollNumber;
    }) ??
    scopedRows.find((row) => {
      const rowHstNumber = normalizeCompanyMatchText(row.hst_number);
      return nextHstNumber && rowHstNumber === nextHstNumber;
    }) ??
    scopedRows.find((row) => {
      if (nextBusinessNumber || nextPayrollNumber || nextHstNumber) return false;

      const rowLegalName = normalizeCompanyMatchText(row.legal_name ?? row.name);
      const rowCity = normalizeCompanyMatchText(row.city);
      const rowProvince = normalizeCompanyMatchText(row.province);

      return Boolean(
        nextLegalName &&
          nextCity &&
          nextProvince &&
          rowLegalName === nextLegalName &&
          rowCity === nextCity &&
          rowProvince === nextProvince
      );
    });

  if (duplicate) {
    throw new CompanyCreateError({
      message: `Duplicate company detected before insert: ${duplicate.name}`,
      userMessage:
        "A company with matching legal details already exists in this workspace. Review the company name, tax IDs, and payroll number and try again.",
      code: "23505",
      field: "legalName",
    });
  }
}

export function getMissingCompanyDetails(company: CompanyProfile): MissingCompanyDetailsCategory[] {
  const missing: MissingCompanyDetailsCategory[] = [];

  const addressIncomplete =
    !hasContent(company.streetAddress) ||
    !hasContent(company.city) ||
    !hasContent(company.provinceState) ||
    !hasContent(company.postalCode) ||
    !hasContent(company.country);

  const taxIncomplete =
    !hasContent(company.payrollNumber) ||
    !hasContent(company.hstNumber) ||
    (!hasContent(company.binNumber) && !hasContent(company.businessNumber));

  const authorizationIncomplete =
    !hasContent(company.directorName) ||
    !hasContent(company.directorTitle) ||
    !hasContent(company.signatureUrl);

  const profileIncomplete =
    !hasContent(company.logoUrl) ||
    !hasContent(company.establishedDate) ||
    !hasContent(company.fiscalYearEnd);

  if (taxIncomplete) missing.push("tax_details");
  if (addressIncomplete) missing.push("address");
  if (authorizationIncomplete) missing.push("authorization");
  if (profileIncomplete) missing.push("company_profile");

  return missing;
}

export function hasCompletePayrollDetails(company: CompanyProfile) {
  return !getMissingCompanyDetails(company).includes("tax_details");
}

export function getCompanySetupPrompts(company: CompanyProfile): CompanySetupPromptResult {
  const missing = getMissingCompanyDetails(company);

  const prompts: CompanySetupPrimaryPrompt[] = missing.map((category) => {
    if (category === "tax_details") {
      return {
        title: "Company setup is incomplete",
        description: "Add tax details when ready.",
        cta: "Complete setup",
        href: routes.companyProfileSectionEdit(company.id, "tax"),
      };
    }

    if (category === "address") {
      return {
        title: "Address details are missing",
        description: "Add your company address to support payroll and documents.",
        cta: "Update address",
        href: routes.companyProfileSectionEdit(company.id, "address"),
      };
    }

    if (category === "authorization") {
      return {
        title: "Authorization details are missing",
        description: "Add director details and signature when ready.",
        cta: "Update profile",
        href: routes.companyProfileSectionEdit(company.id, "authorization"),
      };
    }

    return {
      title: "Company profile is incomplete",
      description: "Add logo and fiscal details when convenient.",
      cta: "Update profile",
      href: routes.companyProfileSectionEdit(company.id, "identity"),
    };
  });

  return {
    prompts,
    primaryPrompt: prompts[0],
  };
}

export function getCompanyCompleteness(company: CompanyProfile): CompanyCompleteness {
  const missing = getMissingCompanyDetails(company);
  const { primaryPrompt } = getCompanySetupPrompts(company);

  return {
    isComplete: missing.length === 0,
    missing,
    primaryPrompt,
  };
}

async function uploadCompanyAsset(
  client: ReturnType<typeof createSupabaseClientForToken>,
  companyId: string,
  file: File | null | undefined,
  kind: "logo" | "signature"
) {
  if (!file || file.size === 0) {
    return null;
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${companyId}/${kind}-${Date.now()}.${ext}`;

  for (const bucket of STORAGE_BUCKET_CANDIDATES) {
    try {
      const { error: uploadError } = await client.storage.from(bucket).upload(path, file, { upsert: true });
      if (uploadError) {
        continue;
      }

      const { data } = client.storage.from(bucket).getPublicUrl(path);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } catch {
      // Continue to next bucket. TODO: Replace with explicit configured bucket once storage policy is finalized.
      continue;
    }
  }

  return null;
}

export async function uploadCompanyLogo(
  companyId: string,
  file: File | null | undefined,
  sessionAccessToken?: string
) {
  return uploadCompanyAsset(requireAuthenticatedSupabaseClient(sessionAccessToken), companyId, file, "logo");
}

export async function uploadDirectorSignature(
  companyId: string,
  file: File | null | undefined,
  sessionAccessToken?: string
) {
  return uploadCompanyAsset(requireAuthenticatedSupabaseClient(sessionAccessToken), companyId, file, "signature");
}

export async function getCompanies(): Promise<OverviewCompany[]> {
  return getCompaniesForToken();
}

export async function getCompaniesForToken(accessToken?: string): Promise<OverviewCompany[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companiesQuery = client
    .from(SUPABASE_TABLES.companies)
    .select("id,name,payroll_account_number,created_at,updated_at")
    .order("name", { ascending: true });

  if (hasDeletedAtColumn) {
    companiesQuery = companiesQuery.is("deleted_at", null);
  }

  const [
    { data: companiesData, error: companiesError },
    { data: employeesData, error: employeesError },
    { data: runsData, error: runsError },
  ] = await Promise.all([
    companiesQuery,
    client.from(SUPABASE_TABLES.employees).select("company_id"),
    client
      .from(SUPABASE_TABLES.payrollRuns)
      .select("company_id,total,run_status,saved_at")
      .order("saved_at", { ascending: false }),
  ]);

  if (companiesError) {
    throw new Error(`Failed to load companies: ${companiesError.message}`);
  }

  if (employeesError) {
    throw new Error(`Failed to load employee counts: ${employeesError.message}`);
  }

  if (runsError) {
    throw new Error(`Failed to load payroll runs: ${runsError.message}`);
  }

  const companies = (companiesData as SupabaseCompanyRow[]) ?? [];
  const employeeCounts = employeeCountsByCompany((employeesData as SupabaseEmployeeRow[]) ?? []);
  const latestRuns = latestRunsByCompany((runsData as SupabasePayrollRunRow[]) ?? []);

  return companies.map((company) => {
    const latestRun = latestRuns.get(company.id);
    const employeeCount = employeeCounts.get(company.id) ?? 0;
    const { state, detail } = deriveOverviewState(latestRun?.run_status);
    const runStatus = normalizeRunStatus(latestRun?.run_status);

    return {
      id: company.id,
      name: company.name,
      initials: initialsFor(company.name),
      avatarTone: "bg-neutral-100/70",
      state,
      stateDetail: detail,
      statusTone: stateToneMap[state],
      statusPillTone: statePillToneMap[state],
      lastActivity: latestRun
        ? `Payroll run ${runStatus} ${relativeTimeLabel(latestRun.saved_at)}`
        : "No activity yet",
      payrollAmount: formatCurrency(latestRun?.total),
      employeeCount,
      createdAt: company.created_at ?? company.updated_at,
      href: routes.company(company.id),
    };
  });
}

export async function hasActiveCompanies(): Promise<boolean> {
  return hasActiveCompaniesForToken();
}

export async function hasActiveCompaniesForToken(accessToken?: string): Promise<boolean> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let query = client.from(SUPABASE_TABLES.companies).select("id", { count: "exact", head: true });

  if (hasDeletedAtColumn) {
    query = query.is("deleted_at", null);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to check company state: ${error.message}`);
  }

  return (count ?? 0) > 0;
}

export async function getDashboardActivityState(): Promise<DashboardActivityState> {
  return getDashboardActivityStateForToken();
}

export async function getDashboardActivityStateForToken(accessToken?: string): Promise<DashboardActivityState> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companiesCountQuery = client.from(SUPABASE_TABLES.companies).select("id", { count: "exact", head: true });
  let activeCompanyIds: string[] = [];

  if (hasDeletedAtColumn) {
    companiesCountQuery = companiesCountQuery.is("deleted_at", null);
    const { data: activeCompanies, error: activeCompaniesError } = await client
      .from(SUPABASE_TABLES.companies)
      .select("id")
      .is("deleted_at", null);

    if (activeCompaniesError) {
      throw new Error(`Failed to load active company IDs: ${activeCompaniesError.message}`);
    }

    activeCompanyIds = ((activeCompanies as { id: string }[] | null) ?? []).map((company) => company.id);
  }

  let payrollCountQuery = client.from(SUPABASE_TABLES.payrollRuns).select("id", { count: "exact", head: true });
  if (hasDeletedAtColumn) {
    if (!activeCompanyIds.length) {
      payrollCountQuery = payrollCountQuery.eq("company_id", "__none__");
    } else {
      payrollCountQuery = payrollCountQuery.in("company_id", activeCompanyIds);
    }
  }

  const [{ count: companyCount, error: companyError }, { count: payrollCount, error: payrollError }] =
    await Promise.all([companiesCountQuery, payrollCountQuery]);

  if (companyError) {
    throw new Error(`Failed to load dashboard company state: ${companyError.message}`);
  }

  if (payrollError) {
    throw new Error(`Failed to load dashboard payroll state: ${payrollError.message}`);
  }

  let auditCount = 0;
  let auditCountQuery = client.from(SUPABASE_TABLES.auditLogs).select("id", { count: "exact", head: true });
  if (hasDeletedAtColumn) {
    if (!activeCompanyIds.length) {
      auditCountQuery = auditCountQuery.eq("company_id", "__none__");
    } else {
      auditCountQuery = auditCountQuery.in("company_id", activeCompanyIds);
    }
  }
  const { count, error: auditError } = await auditCountQuery;

  if (!auditError) {
    auditCount = count ?? 0;
  }

  const hasCompanies = (companyCount ?? 0) > 0;
  const hasActivity = (payrollCount ?? 0) > 0 || auditCount > 0;

  return { hasCompanies, hasActivity };
}

export async function getCompanyById(id: string): Promise<CompanyDetail | null> {
  return getCompanyByIdForToken(id);
}

export async function getCompanyByIdForToken(id: string, accessToken?: string): Promise<CompanyDetail | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companyQuery = client
    .from(SUPABASE_TABLES.companies)
    .select("id,name,payroll_account_number,updated_at")
    .eq("id", id);

  if (hasDeletedAtColumn) {
    companyQuery = companyQuery.is("deleted_at", null);
  }

  const [
    { data: companyRow, error: companyError },
    { count: employeeCount, error: employeeCountError },
    { data: latestRunRows, error: latestRunError },
  ] = await Promise.all([
    companyQuery.maybeSingle(),
    client
      .from(SUPABASE_TABLES.employees)
      .select("id", { count: "exact", head: true })
      .eq("company_id", id),
    client
      .from(SUPABASE_TABLES.payrollRuns)
      .select("company_id,total,run_status,saved_at")
      .eq("company_id", id)
      .order("saved_at", { ascending: false })
      .limit(1),
  ]);

  if (companyError) {
    throw new Error(`Failed to load company ${id}: ${companyError.message}`);
  }

  if (employeeCountError) {
    throw new Error(`Failed to load company ${id} employee count: ${employeeCountError.message}`);
  }

  if (latestRunError) {
    throw new Error(`Failed to load company ${id} latest payroll run: ${latestRunError.message}`);
  }

  if (!companyRow) {
    return null;
  }

  const company = companyRow as SupabaseCompanyRow;
  const latestRun = (latestRunRows as SupabasePayrollRunRow[] | null)?.[0];

  const { state } = deriveOverviewState(latestRun?.run_status);
  const healthState = toCompanyHealth(state);
  const runStatus = normalizeRunStatus(latestRun?.run_status);

  const fallback = getCompanyDetailPageData(id).companyDetail;

  return {
    ...fallback,
    id: company.id,
    name: company.name,
    initials: initialsFor(company.name),
    avatarTone: "bg-neutral-100/70",
    status: healthState,
    statusPillTone: statePillToneMap[healthState],
    employeeCount: employeeCount ?? 0,
    subtitle: `Payroll account · ${employeeCount ?? 0} employees`,
    primaryValue: formatCurrency(latestRun?.total),
    primaryLabel: latestRun ? "Latest payroll run" : "No payroll runs yet",
    preparedAt: latestRun
      ? `Payroll run ${runStatus} ${relativeTimeLabel(latestRun.saved_at)}`
      : `Company updated ${relativeTimeLabel(company.updated_at)}`,
    runSignal: state === "Healthy" ? "Run in normal range" : "Review recommended",
  };
}

export async function getCompanyWorkspaceSummaryForToken(
  id: string,
  accessToken?: string
): Promise<CompanyWorkspaceSummary> {
  const client = requireAuthenticatedSupabaseClient(accessToken);

  const [
    { count: employeeCount, error: employeeError },
    { count: payrollRunCount, error: payrollError },
    { count: documentCount, error: documentError },
  ] = await Promise.all([
    client.from(SUPABASE_TABLES.employees).select("id", { count: "exact", head: true }).eq("company_id", id),
    client.from(SUPABASE_TABLES.payrollRuns).select("id", { count: "exact", head: true }).eq("company_id", id),
    client.from(SUPABASE_TABLES.documents).select("id", { count: "exact", head: true }).eq("company_id", id),
  ]);

  const firstError = employeeError ?? payrollError ?? documentError;
  if (firstError) {
    throw new Error(`Failed to load workspace summary for company ${id}: ${toSafeSupabaseErrorMessage(firstError)}`);
  }

  return {
    employeeCount: employeeCount ?? 0,
    payrollRunCount: payrollRunCount ?? 0,
    documentCount: documentCount ?? 0,
  };
}

export async function getCompanyProfile(id: string): Promise<CompanyProfile | null> {
  return getCompanyProfileForToken(id);
}

export async function getCompanyProfileForToken(id: string, accessToken?: string): Promise<CompanyProfile | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);

  return getCompanyProfileWithClient(client, id);
}

async function getCompanyProfileWithClient(
  client: ReturnType<typeof createSupabaseClientForToken>,
  id: string
): Promise<CompanyProfile | null> {
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let profileQuery = client
    .from(SUPABASE_TABLES.companies)
    .select(
      "id,name,address,address_line2,city,province,postal_code,logo_url,director_name,director_title,signature_url,payroll_account_number,plan_override,setup_completed_at"
    )
    .eq("id", id);

  if (hasDeletedAtColumn) {
    profileQuery = profileQuery.is("deleted_at", null);
  }

  const { data, error } = await profileQuery.maybeSingle();

  if (error) {
    throw new Error(`Failed to load company profile ${id}: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const row = data as SupabaseCompanyRow;
  const meta = parsePlanOverride(row.plan_override);

  return {
    id: row.id,
    companyName: row.name,
    legalName: meta.legalName ?? row.name,
    sameAsCompanyName: meta.sameAsCompanyName ?? !meta.legalName,
    establishedDate: meta.establishedDate ?? "",
    logoUrl: row.logo_url ?? "",
    streetAddress: row.address ?? "",
    unitSuite: row.address_line2 ?? "",
    city: row.city ?? "",
    provinceState: row.province ?? "",
    postalCode: row.postal_code ?? "",
    country: meta.country ?? "",
    hstNumber: meta.hstNumber ?? "",
    payrollNumber: row.payroll_account_number ?? "",
    binNumber: meta.binNumber ?? "",
    businessNumber: meta.businessNumber ?? "",
    fiscalYearEnd: meta.fiscalYearEnd ?? "",
    directorName: row.director_name ?? "",
    directorTitle: row.director_title ?? "",
    signatureUrl: row.signature_url ?? "",
    setupCompletedAt: row.setup_completed_at ?? undefined,
  };
}

export async function getCompanyDeleteSummary(id: string): Promise<CompanyDeleteSummary | null> {
  return getCompanyDeleteSummaryForToken(id);
}

export async function getCompanyDeleteSummaryForToken(
  id: string,
  accessToken?: string
): Promise<CompanyDeleteSummary | null> {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    client
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companyQuery = client
    .from(SUPABASE_TABLES.companies)
    .select("id,name,payroll_account_number,hst_number,bin_number,business_number")
    .eq("id", id);

  if (hasDeletedAtColumn) {
    companyQuery = companyQuery.is("deleted_at", null);
  }

  const [{ data: companyData, error: companyError }, { count: employeeCount, error: employeeCountError }] =
    await Promise.all([
      companyQuery.maybeSingle(),
      client.from(SUPABASE_TABLES.employees).select("id", { count: "exact", head: true }).eq("company_id", id),
    ]);

  if (companyError) {
    throw new Error(`Failed to load company delete summary ${id}: ${companyError.message}`);
  }

  if (employeeCountError) {
    throw new Error(`Failed to load employee count for ${id}: ${employeeCountError.message}`);
  }

  if (!companyData) {
    return null;
  }

  const company = companyData as SupabaseCompanyRow;
  return {
    id: company.id,
    name: company.name,
    employeeCount: employeeCount ?? 0,
    payrollNumber: company.payroll_account_number ?? "",
    hstNumber: company.hst_number ?? "",
    binNumber: company.bin_number ?? "",
    businessNumber: company.business_number ?? "",
  };
}

export async function createCompany(input: CompanyProfileInput, accessToken: string): Promise<{ id: string | null }> {
  const companyName = input.companyName.trim();
  const legalName = input.legalName.trim();
  const streetAddress = input.streetAddress?.trim() ?? "";
  const sessionAccessToken = accessToken.trim();

  if (!companyName) {
    throw new CompanyCreateError({
      message: "Company name is required",
      userMessage: "Company name is missing. Add it and try again.",
      field: "companyName",
    });
  }

  if (!legalName) {
    throw new CompanyCreateError({
      message: "Legal name is required",
      userMessage: "Legal name is required. Add it and try again.",
      field: "legalName",
    });
  }

  if (!streetAddress) {
    throw new CompanyCreateError({
      message: "Address is required",
      userMessage: "Address is required. Add the address and try again.",
      field: "address",
    });
  }

  let writeClient: ReturnType<typeof createSupabaseClientForToken>;
  try {
    writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);
  } catch {
    throw new CompanyCreateError({
      message: "Missing authenticated Supabase session",
      userMessage: SIGN_IN_REQUIRED_MESSAGE,
    });
  }

  let appMeta: Record<string, unknown> = {};
  let userMeta: Record<string, unknown> = {};

  const { data: authData, error: authError } = await writeClient.auth.getUser();
  const authUserId = authData.user?.id ?? "";
  if (authError || !authUserId) {
    if (authError && process.env.NODE_ENV !== "production") {
      console.error("createCompany auth lookup failed", { error: authError });
    }

    throw new CompanyCreateError({
      message: authError?.message ?? "Missing authenticated Supabase user",
      userMessage: SIGN_IN_REQUIRED_MESSAGE,
    });
  }

  appMeta = (authData.user?.app_metadata as Record<string, unknown> | undefined) ?? {};
  userMeta = (authData.user?.user_metadata as Record<string, unknown> | undefined) ?? {};

  const now = new Date().toISOString();
  const id = slugifyCompanyId(companyName);

  const logoUrl = (await uploadCompanyAsset(writeClient, id, input.logoFile, "logo")) ?? "";
  const signatureUrl = (await uploadCompanyAsset(writeClient, id, input.signatureFile, "signature")) ?? "";

  const meta: CompanyProfileMeta = {
    legalName,
    sameAsCompanyName: !!input.sameAsCompanyName,
    establishedDate: input.establishedDate || null,
    country: input.country?.trim() || "",
    formattedAddress: input.formattedAddress?.trim() || "",
    addressSource: input.addressSource?.trim() || "",
    addressVerified: !!input.addressVerified,
    latitude: input.latitude?.trim() || "",
    longitude: input.longitude?.trim() || "",
    hstNumber: input.hstNumber?.trim() || "",
    binNumber: input.binNumber?.trim() || "",
    businessNumber: input.businessNumber?.trim() || "",
    fiscalYearEnd: input.fiscalYearEnd?.trim() || "",
  };

  const identityColumns = await getCompanyIdentityColumns(writeClient);
  const profileColumns = await getCompanyProfileColumns(writeClient);
  const resolvedWorkspaceId =
    String(appMeta.workspace_id ?? userMeta.workspace_id ?? appMeta.organization_id ?? userMeta.organization_id ?? "");

  const softDeleteColumns = await getCompanySoftDeleteColumns(writeClient);

  await assertNoDuplicateCompany(writeClient, input, {
    resolvedWorkspaceId,
    identityColumns,
    profileColumns,
    softDeleteColumns,
  });

  const insertPayload: Record<string, unknown> = {
    id,
    name: companyName,
    address: streetAddress || null,
    address_line2: input.unitSuite?.trim() || null,
    city: input.city?.trim() || null,
    province: input.provinceState?.trim() || null,
    postal_code: input.postalCode?.trim() || null,
    logo_url: logoUrl || null,
    director_name: input.directorName?.trim() || null,
    director_title: input.directorTitle?.trim() || null,
    signature_url: signatureUrl || null,
    payroll_account_number: input.payrollNumber?.trim() || null,
    created_at: now,
    updated_at: now,
    billing_override: false,
  };

  if (profileColumns.has("legal_name")) {
    insertPayload.legal_name = legalName;
  }
  if (profileColumns.has("country")) {
    insertPayload.country = input.country?.trim() || null;
  }
  if (profileColumns.has("formatted_address")) {
    insertPayload.formatted_address = input.formattedAddress?.trim() || null;
  }
  if (profileColumns.has("address_source")) {
    insertPayload.address_source = input.addressSource?.trim() || null;
  }
  if (profileColumns.has("address_verified")) {
    insertPayload.address_verified = Boolean(input.addressVerified);
  }
  if (profileColumns.has("address_has_subpremise")) {
    insertPayload.address_has_subpremise = Boolean(input.addressHasSubpremise);
  }
  if (profileColumns.has("latitude")) {
    insertPayload.latitude = input.latitude?.trim() || null;
  }
  if (profileColumns.has("longitude")) {
    insertPayload.longitude = input.longitude?.trim() || null;
  }
  if (profileColumns.has("hst_number")) {
    insertPayload.hst_number = input.hstNumber?.trim() || null;
  }
  if (profileColumns.has("bin_number")) {
    insertPayload.bin_number = input.binNumber?.trim() || null;
  }
  if (profileColumns.has("business_number")) {
    insertPayload.business_number = input.businessNumber?.trim() || null;
  }
  if (profileColumns.has("fiscal_year_end")) {
    insertPayload.fiscal_year_end = input.fiscalYearEnd?.trim() || null;
  }
  if (profileColumns.has("plan_override")) {
    insertPayload.plan_override = serializePlanOverride(meta);
  }

  if (identityColumns.has("user_id") && authUserId) {
    insertPayload.user_id = authUserId;
  }

  if (identityColumns.has("owner_id") && authUserId) {
    insertPayload.owner_id = authUserId;
  }

  if (identityColumns.has("created_by") && authUserId) {
    insertPayload.created_by = authUserId;
  }

  if (identityColumns.has("workspace_id") && resolvedWorkspaceId) {
    insertPayload.workspace_id = resolvedWorkspaceId;
  }

  if (identityColumns.has("organization_id") && resolvedWorkspaceId) {
    insertPayload.organization_id = resolvedWorkspaceId;
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("createCompany identity fields", {
      optionalColumnsAvailable: Array.from(identityColumns),
      profileColumnsAvailable: Array.from(profileColumns),
      authUserId,
      authWorkspaceId: resolvedWorkspaceId || null,
      hasAccessToken: Boolean(sessionAccessToken),
    });
  }

  let { data, error } = await writeClient
    .from(SUPABASE_TABLES.companies)
    .insert(insertPayload)
    .select("id")
    .maybeSingle();

  if (error && isPlanOverrideConstraintError(error)) {
    if (process.env.NODE_ENV !== "production") {
      console.error("createCompany retrying without plan_override due to legacy constraint", {
        code: error.code,
        message: error.message,
        hint: error.hint,
      });
    }

    const retryPayload = { ...insertPayload };
    delete retryPayload.plan_override;
    const retry = await writeClient
      .from(SUPABASE_TABLES.companies)
      .insert(retryPayload)
      .select("id")
      .maybeSingle();
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("createCompany insert failed", {
        code: error.code,
        message: error.message,
        hint: error.hint,
        resolvedAuthUserId: authUserId,
        resolvedWorkspaceId: resolvedWorkspaceId || null,
      });
    }

    throw mapCreateCompanyInsertError(error);
  }

  return { id: (data as { id: string } | null)?.id ?? id };
}

export async function updateCompany(id: string, input: CompanyProfileInput, accessToken: string): Promise<{ id: string }> {
  const writeClient = requireAuthenticatedSupabaseClient(accessToken);

  const companyName = input.companyName.trim();
  const legalName = input.legalName.trim();

  if (!companyName) {
    throw new Error("Company name is required");
  }

  if (!legalName) {
    throw new Error("Legal name is required");
  }

  const existing = await getCompanyProfileWithClient(writeClient, id);
  if (!existing) {
    throw new Error("Company not found");
  }

  const logoUpload = await uploadCompanyAsset(writeClient, id, input.logoFile, "logo");
  const signatureUpload = await uploadCompanyAsset(writeClient, id, input.signatureFile, "signature");

  const meta: CompanyProfileMeta = {
    legalName,
    sameAsCompanyName: !!input.sameAsCompanyName,
    establishedDate: input.establishedDate || null,
    country: input.country?.trim() || "",
    hstNumber: input.hstNumber?.trim() || "",
    binNumber: input.binNumber?.trim() || "",
    businessNumber: input.businessNumber?.trim() || "",
    fiscalYearEnd: input.fiscalYearEnd?.trim() || "",
  };

  const profileColumns = await getCompanyProfileColumns(writeClient);
  const updatePayload: Record<string, unknown> = {
    name: companyName,
    address: input.streetAddress?.trim() || null,
    address_line2: input.unitSuite?.trim() || null,
    city: input.city?.trim() || null,
    province: input.provinceState?.trim() || null,
    postal_code: input.postalCode?.trim() || null,
    logo_url: logoUpload || input.existingLogoUrl || existing.logoUrl || null,
    director_name: input.directorName?.trim() || null,
    director_title: input.directorTitle?.trim() || null,
    signature_url: signatureUpload || input.existingSignatureUrl || existing.signatureUrl || null,
    payroll_account_number: input.payrollNumber?.trim() || null,
    updated_at: new Date().toISOString(),
  };
  if (profileColumns.has("legal_name")) {
    updatePayload.legal_name = legalName;
  }
  if (profileColumns.has("country")) {
    updatePayload.country = input.country?.trim() || null;
  }
  if (profileColumns.has("formatted_address")) {
    updatePayload.formatted_address = input.formattedAddress?.trim() || null;
  }
  if (profileColumns.has("address_source")) {
    updatePayload.address_source = input.addressSource?.trim() || null;
  }
  if (profileColumns.has("address_verified")) {
    updatePayload.address_verified = Boolean(input.addressVerified);
  }
  if (profileColumns.has("address_has_subpremise")) {
    updatePayload.address_has_subpremise = Boolean(input.addressHasSubpremise);
  }
  if (profileColumns.has("latitude")) {
    updatePayload.latitude = input.latitude?.trim() || null;
  }
  if (profileColumns.has("longitude")) {
    updatePayload.longitude = input.longitude?.trim() || null;
  }
  if (profileColumns.has("hst_number")) {
    updatePayload.hst_number = input.hstNumber?.trim() || null;
  }
  if (profileColumns.has("bin_number")) {
    updatePayload.bin_number = input.binNumber?.trim() || null;
  }
  if (profileColumns.has("business_number")) {
    updatePayload.business_number = input.businessNumber?.trim() || null;
  }
  if (profileColumns.has("fiscal_year_end")) {
    updatePayload.fiscal_year_end = input.fiscalYearEnd?.trim() || null;
  }
  if (profileColumns.has("plan_override")) {
    updatePayload.plan_override = serializePlanOverride(meta);
  }

  const softDeleteColumns = await getCompanySoftDeleteColumns(writeClient);
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let updateQuery = writeClient.from(SUPABASE_TABLES.companies).update(updatePayload).eq("id", id);
  if (hasDeletedAtColumn) {
    updateQuery = updateQuery.is("deleted_at", null);
  }

  let { error } = await updateQuery;

  if (error && isPlanOverrideConstraintError(error)) {
    const retryPayload = { ...updatePayload };
    delete retryPayload.plan_override;
    let retryQuery = writeClient.from(SUPABASE_TABLES.companies).update(retryPayload).eq("id", id);
    if (hasDeletedAtColumn) {
      retryQuery = retryQuery.is("deleted_at", null);
    }
    const retry = await retryQuery;
    error = retry.error;
  }

  if (error) {
    throw new Error(`Failed to update company ${id}: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return { id };
}

export async function confirmCompany(id: string, sessionAccessToken: string): Promise<{ id: string }> {
  const writeClient = requireAuthenticatedSupabaseClient(sessionAccessToken);
  const now = new Date().toISOString();

  const softDeleteColumns = await getCompanySoftDeleteColumns(writeClient);
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let confirmQuery = writeClient
    .from(SUPABASE_TABLES.companies)
    .update({ setup_completed_at: now, updated_at: now })
    .eq("id", id);
  if (hasDeletedAtColumn) {
    confirmQuery = confirmQuery.is("deleted_at", null);
  }
  const { error } = await confirmQuery;

  if (!error) {
    return { id };
  }

  if (error.message.toLowerCase().includes("setup_completed_at")) {
    let fallbackQuery = writeClient
      .from(SUPABASE_TABLES.companies)
      .update({ updated_at: now })
      .eq("id", id);
    if (hasDeletedAtColumn) {
      fallbackQuery = fallbackQuery.is("deleted_at", null);
    }
    const { error: fallbackError } = await fallbackQuery;

    if (!fallbackError) {
      return { id };
    }

    throw new Error(`Failed to confirm company ${id}: ${toSafeSupabaseErrorMessage(fallbackError)}`);
  }

  throw new Error(`Failed to confirm company ${id}: ${toSafeSupabaseErrorMessage(error)}`);
}

export async function softDeleteCompany({
  companyId,
  reason,
  reasonNote,
  sessionAccessToken,
}: {
  companyId: string;
  reason: DeleteCompanyReason;
  reasonNote?: string;
  sessionAccessToken: string;
}): Promise<{ redirectTo: string }> {
  const token = sessionAccessToken.trim();
  if (!token) {
    throw new Error("We couldn’t verify your session. Please sign in again and try deleting this company.");
  }

  const writeClient = createSupabaseClientForToken(token);
  const softDeleteColumns = await getCompanySoftDeleteColumns(writeClient);
  if (!softDeleteColumns.has("deleted_at")) {
    throw new Error("Company delete is not available until the latest database migration is applied.");
  }

  const { data: authData, error: authError } = await writeClient.auth.getUser();
  if (authError || !authData.user?.id) {
    throw new Error("We couldn’t verify your session. Please sign in again and try deleting this company.");
  }

  const authUserId = authData.user.id;

  const { data: companyData, error: companyError } = await writeClient
    .from(SUPABASE_TABLES.companies)
    .select("*")
    .eq("id", companyId)
    .maybeSingle();

  if (companyError) {
    throw new Error(`Failed to load company ${companyId}: ${companyError.message}`);
  }

  if (!companyData) {
    throw new Error("Company not found.");
  }

  const company = companyData as SupabaseCompanyRow;
  if (company.deleted_at) {
    return { redirectTo: routes.overviewDeleted() };
  }

  const ownerId = company.owner_id ?? company.user_id ?? company.created_by ?? "";
  if (!ownerId || ownerId !== authUserId) {
    throw new Error("Only the company owner can delete this company.");
  }

  const [
    { count: employeeCount },
    { count: payrollCount },
    { count: activityCount },
  ] = await Promise.all([
    writeClient.from(SUPABASE_TABLES.employees).select("id", { head: true, count: "exact" }).eq("company_id", companyId),
    writeClient.from(SUPABASE_TABLES.payrollRuns).select("id", { head: true, count: "exact" }).eq("company_id", companyId),
    writeClient.from(SUPABASE_TABLES.auditLogs).select("id", { head: true, count: "exact" }).eq("company_id", companyId),
  ]);

  const deletedAt = new Date().toISOString();
  const relatedCounts = {
    employee_count: employeeCount ?? 0,
    payroll_run_count: payrollCount ?? 0,
    activity_count: activityCount ?? 0,
    invoice_count: null,
    document_count: null,
  };

  const { error: auditInsertError } = await writeClient.from(SUPABASE_TABLES.companyDeletionAudit).insert({
    company_id: companyId,
    deleted_by: authUserId,
    deleted_at: deletedAt,
    reason,
    reason_note: reasonNote?.trim() || null,
    company_snapshot: sanitizeAuditDetails({
      id: company.id,
      name: company.name,
      owner_id: company.owner_id,
      user_id: company.user_id,
      created_by: company.created_by,
      deleted_at: company.deleted_at,
    }),
    related_counts: relatedCounts,
  });

  if (auditInsertError) {
    throw new Error(`Failed to write delete audit for company ${companyId}: ${toSafeSupabaseErrorMessage(auditInsertError)}`);
  }

  const { error: companyUpdateError } = await writeClient
    .from(SUPABASE_TABLES.companies)
    .update({
      deleted_at: deletedAt,
      deleted_by: authUserId,
      delete_reason: reason,
      delete_reason_note: reasonNote?.trim() || null,
      updated_at: deletedAt,
    })
    .eq("id", companyId);

  if (companyUpdateError) {
    throw new Error(`Failed to delete company ${companyId}: ${toSafeSupabaseErrorMessage(companyUpdateError)}`);
  }

  const { count: remainingCompanies, error: remainingError } = await writeClient
    .from(SUPABASE_TABLES.companies)
    .select("id", { head: true, count: "exact" })
    .is("deleted_at", null)
    .or(`owner_id.eq.${authUserId},user_id.eq.${authUserId},created_by.eq.${authUserId}`);

  if (remainingError) {
    throw new Error(`Failed to check remaining companies: ${toSafeSupabaseErrorMessage(remainingError)}`);
  }

  return {
    redirectTo: (remainingCompanies ?? 0) > 0 ? routes.overviewDeleted() : routes.firstCompanySetup(),
  };
}
