import {
  companies as overviewCompanies,
  statePillToneMap,
  stateToneMap,
} from "@/components/overview/overview-data";
import { getCompanyDetailPageData, type CompanyDetail } from "@/components/company-detail/company-detail-data";
import { createClient } from "@supabase/supabase-js";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase/client";

const SUPABASE_TABLES = {
  companies: "companies",
  employees: "employees",
  payrollRuns: "payroll_runs",
  auditLogs: "audit_logs",
  companyDeletionAudit: "company_deletion_audit",
} as const;

const STORAGE_BUCKET_CANDIDATES = ["company-assets", "assets", "uploads"];
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
  sessionAccessToken?: string;
  sessionUserId?: string;
  sessionWorkspaceId?: string;
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
    error.code === "42501" ||
    combined.includes("row-level security") ||
    combined.includes("permission denied") ||
    combined.includes("jwt")
  ) {
    return new CompanyCreateError({
      message: `Failed to create company: ${error.message}`,
      userMessage: "Create is blocked by database access policy. Run the Credo RLS script and try again.",
      code: error.code,
      details: error.details,
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
        details: error.details,
        hint: error.hint,
      });
    }

    if (combined.includes("column \"name\"")) {
      return new CompanyCreateError({
        message: `Failed to create company: ${error.message}`,
        userMessage: "Company name is missing. Add it and try again.",
        code: error.code,
        details: error.details,
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
        details: error.details,
        hint: error.hint,
        field: "address",
      });
    }
  }

  return new CompanyCreateError({
    message: `Failed to create company: ${error.message}`,
    userMessage: "Database insert failed. Check required company fields and try again.",
    code: error.code,
    details: error.details,
    hint: error.hint,
  });
}

function isPlanOverrideConstraintError(error: SupabaseErrorLike) {
  const combined = `${error.message} ${String(error.details ?? "")}`.toLowerCase();
  return error.code === "23514" && combined.includes("plan_override_check");
}

function createSupabaseClientForToken(accessToken: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new CompanyCreateError({
      message: "Missing Supabase environment variables",
      userMessage: "We couldn’t verify your workspace. Please sign in again and try creating the company.",
    });
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

function createSupabaseClientForCreate(accessToken?: string) {
  const token = accessToken?.trim() ?? "";
  if (!token) {
    return supabase;
  }

  return createSupabaseClientForToken(token);
}

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

async function uploadCompanyAsset(companyId: string, file: File | null | undefined, kind: "logo" | "signature") {
  if (!file || file.size === 0) {
    return null;
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${companyId}/${kind}-${Date.now()}.${ext}`;

  for (const bucket of STORAGE_BUCKET_CANDIDATES) {
    try {
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (uploadError) {
        continue;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
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

export async function uploadCompanyLogo(companyId: string, file: File | null | undefined) {
  return uploadCompanyAsset(companyId, file, "logo");
}

export async function uploadDirectorSignature(companyId: string, file: File | null | undefined) {
  return uploadCompanyAsset(companyId, file, "signature");
}

export async function getCompanies(): Promise<OverviewCompany[]> {
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companiesQuery = supabase
    .from(SUPABASE_TABLES.companies)
    .select("id,name,payroll_account_number,updated_at")
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
    supabase.from(SUPABASE_TABLES.employees).select("company_id"),
    supabase
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
      href: routes.company(company.id),
    };
  });
}

export async function hasActiveCompanies(): Promise<boolean> {
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let query = supabase.from(SUPABASE_TABLES.companies).select("id", { count: "exact", head: true });

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
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companiesCountQuery = supabase.from(SUPABASE_TABLES.companies).select("id", { count: "exact", head: true });
  let activeCompanyIds: string[] = [];

  if (hasDeletedAtColumn) {
    companiesCountQuery = companiesCountQuery.is("deleted_at", null);
    const { data: activeCompanies, error: activeCompaniesError } = await supabase
      .from(SUPABASE_TABLES.companies)
      .select("id")
      .is("deleted_at", null);

    if (activeCompaniesError) {
      throw new Error(`Failed to load active company IDs: ${activeCompaniesError.message}`);
    }

    activeCompanyIds = ((activeCompanies as { id: string }[] | null) ?? []).map((company) => company.id);
  }

  let payrollCountQuery = supabase.from(SUPABASE_TABLES.payrollRuns).select("id", { count: "exact", head: true });
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
  let auditCountQuery = supabase.from(SUPABASE_TABLES.auditLogs).select("id", { count: "exact", head: true });
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
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companyQuery = supabase
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
    supabase
      .from(SUPABASE_TABLES.employees)
      .select("id", { count: "exact", head: true })
      .eq("company_id", id),
    supabase
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
    subtitle: `Payroll account · ${employeeCount ?? 0} employees`,
    primaryValue: formatCurrency(latestRun?.total),
    primaryLabel: latestRun ? "Latest payroll run" : "No payroll runs yet",
    preparedAt: latestRun
      ? `Payroll run ${runStatus} ${relativeTimeLabel(latestRun.saved_at)}`
      : `Company updated ${relativeTimeLabel(company.updated_at)}`,
    runSignal: state === "Healthy" ? "Run in normal range" : "Review recommended",
  };
}

export async function getCompanyProfile(id: string): Promise<CompanyProfile | null> {
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let profileQuery = supabase
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
  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let companyQuery = supabase
    .from(SUPABASE_TABLES.companies)
    .select("id,name,payroll_account_number,hst_number,bin_number,business_number")
    .eq("id", id);

  if (hasDeletedAtColumn) {
    companyQuery = companyQuery.is("deleted_at", null);
  }

  const [{ data: companyData, error: companyError }, { count: employeeCount, error: employeeCountError }] =
    await Promise.all([
      companyQuery.maybeSingle(),
      supabase.from(SUPABASE_TABLES.employees).select("id", { count: "exact", head: true }).eq("company_id", id),
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

export async function createCompany(input: CompanyProfileInput): Promise<{ id: string | null }> {
  const companyName = input.companyName.trim();
  const legalName = input.legalName.trim();
  const streetAddress = input.streetAddress?.trim() ?? "";
  const sessionAccessToken = input.sessionAccessToken?.trim() ?? "";

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

  const writeClient = createSupabaseClientForCreate(sessionAccessToken);
  let authUserId = "";
  let appMeta: Record<string, unknown> = {};
  let userMeta: Record<string, unknown> = {};
  let authUserError: { code?: string; message?: string } | null = null;

  if (sessionAccessToken) {
    const { data, error } = await writeClient.auth.getUser();
    authUserError = error ? { code: error.code, message: error.message } : null;
    authUserId = data.user?.id ?? "";
    appMeta = (data.user?.app_metadata as Record<string, unknown> | undefined) ?? {};
    userMeta = (data.user?.user_metadata as Record<string, unknown> | undefined) ?? {};

    if (error && process.env.NODE_ENV !== "production") {
      console.error("createCompany auth lookup failed", {
        error,
      });
    }
  }

  const sessionUserId = input.sessionUserId?.trim() || authUserId;

  const now = new Date().toISOString();
  const id = slugifyCompanyId(companyName);

  const logoUrl = (await uploadCompanyLogo(id, input.logoFile)) ?? "";
  const signatureUrl = (await uploadDirectorSignature(id, input.signatureFile)) ?? "";

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
    input.sessionWorkspaceId?.trim() ||
    String(appMeta.workspace_id ?? userMeta.workspace_id ?? appMeta.organization_id ?? userMeta.organization_id ?? "");

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

  if (identityColumns.has("user_id") && sessionUserId) {
    insertPayload.user_id = sessionUserId;
  }

  if (identityColumns.has("owner_id") && sessionUserId) {
    insertPayload.owner_id = sessionUserId;
  }

  if (identityColumns.has("created_by") && sessionUserId) {
    insertPayload.created_by = sessionUserId;
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
      sessionUserId,
      sessionWorkspaceId: resolvedWorkspaceId || null,
      hasAccessToken: Boolean(sessionAccessToken),
      authLookupError: authUserError,
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
        details: error.details,
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
        details: error.details,
        hint: error.hint,
        payload: insertPayload,
        resolvedSessionUserId: sessionUserId,
        resolvedWorkspaceId: resolvedWorkspaceId || null,
      });
    }

    throw mapCreateCompanyInsertError(error);
  }

  return { id: (data as { id: string } | null)?.id ?? id };
}

export async function updateCompany(id: string, input: CompanyProfileInput): Promise<{ id: string }> {
  const existing = await getCompanyProfile(id);
  if (!existing) {
    throw new Error("Company not found");
  }

  const companyName = input.companyName.trim();
  const legalName = input.legalName.trim();

  if (!companyName) {
    throw new Error("Company name is required");
  }

  if (!legalName) {
    throw new Error("Legal name is required");
  }

  const logoUpload = await uploadCompanyLogo(id, input.logoFile);
  const signatureUpload = await uploadDirectorSignature(id, input.signatureFile);

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

  const profileColumns = await getCompanyProfileColumns(supabase as ReturnType<typeof createSupabaseClientForToken>);
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

  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let updateQuery = supabase.from(SUPABASE_TABLES.companies).update(updatePayload).eq("id", id);
  if (hasDeletedAtColumn) {
    updateQuery = updateQuery.is("deleted_at", null);
  }

  let { error } = await updateQuery;

  if (error && isPlanOverrideConstraintError(error)) {
    const retryPayload = { ...updatePayload };
    delete retryPayload.plan_override;
    let retryQuery = supabase.from(SUPABASE_TABLES.companies).update(retryPayload).eq("id", id);
    if (hasDeletedAtColumn) {
      retryQuery = retryQuery.is("deleted_at", null);
    }
    const retry = await retryQuery;
    error = retry.error;
  }

  if (error) {
    throw new Error(`Failed to update company ${id}: ${error.message}`);
  }

  return { id };
}

export async function confirmCompany(id: string): Promise<{ id: string }> {
  const now = new Date().toISOString();

  const softDeleteColumns = await getCompanySoftDeleteColumns(
    supabase as ReturnType<typeof createSupabaseClientForToken>
  );
  const hasDeletedAtColumn = softDeleteColumns.has("deleted_at");

  let confirmQuery = supabase
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
    let fallbackQuery = supabase
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

    throw new Error(`Failed to confirm company ${id}: ${fallbackError.message}`);
  }

  throw new Error(`Failed to confirm company ${id}: ${error.message}`);
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
    company_snapshot: company,
    related_counts: relatedCounts,
  });

  if (auditInsertError) {
    throw new Error(`Failed to write delete audit for company ${companyId}: ${auditInsertError.message}`);
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
    throw new Error(`Failed to delete company ${companyId}: ${companyUpdateError.message}`);
  }

  const { count: remainingCompanies, error: remainingError } = await writeClient
    .from(SUPABASE_TABLES.companies)
    .select("id", { head: true, count: "exact" })
    .is("deleted_at", null)
    .or(`owner_id.eq.${authUserId},user_id.eq.${authUserId},created_by.eq.${authUserId}`);

  if (remainingError) {
    throw new Error(`Failed to check remaining companies: ${remainingError.message}`);
  }

  return {
    redirectTo: (remainingCompanies ?? 0) > 0 ? routes.overviewDeleted() : routes.firstCompanySetup(),
  };
}
