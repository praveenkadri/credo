import {
  getCompanyDetailPageData,
  type CompanyActivityGroupData,
  type CompanyActivityItem,
} from "@/components/company-detail/company-detail-data";
import { requireAuthenticatedSupabaseClient, toSafeSupabaseErrorMessage } from "@/lib/supabase/client";

const SUPABASE_TABLES = {
  auditLogs: "audit_logs",
  payrollRuns: "payroll_runs",
  documents: "documents",
  employees: "employees",
} as const;

interface SupabaseAuditLogRow {
  id: string;
  company_id: string | null;
  action: string;
  entity_type: string;
  entity_name: string;
  details: string | null;
  at: string;
}

interface SupabasePayrollActivityRow {
  id: string;
  company_id: string;
  total?: number | string | null;
  run_status?: string | null;
  saved_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface SupabaseDocumentActivityRow {
  id: string;
  company_id: string;
  title?: string | null;
  type?: string | null;
  status?: string | null;
  generation_status?: string | null;
  generated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface SupabaseEmployeeActivityRow {
  id: string;
  company_id: string;
  full_name?: string | null;
  status?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

type ActivityEvent = CompanyActivityItem & {
  timestamp: string;
};

function isExplicitDemoActivityEnabled() {
  return (
    process.env.CREDO_DEMO_MODE === "1" ||
    process.env.CREDO_DEMO_MODE === "true" ||
    process.env.NEXT_PUBLIC_CREDO_DEMO_MODE === "1" ||
    process.env.NEXT_PUBLIC_CREDO_DEMO_MODE === "true"
  );
}

function titleCase(input: string) {
  return input
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
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

function groupLabelForDate(timestamp: string) {
  const eventDate = new Date(timestamp);
  const now = new Date();

  if (Number.isNaN(eventDate.getTime())) {
    return "Recent";
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEvent = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  const diffMs = startOfToday.getTime() - startOfEvent.getTime();
  const diffDays = Math.round(diffMs / 86400000);

  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays <= 7) return "Last week";

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(eventDate);
}

function iconForLog(row: SupabaseAuditLogRow): CompanyActivityItem["icon"] {
  const action = row.action.toLowerCase();
  const entityType = row.entity_type.toLowerCase();

  if (action.includes("payroll") || entityType.includes("payroll")) return "payroll";
  if (action.includes("invoice") || entityType.includes("invoice")) return "invoice";
  if (action.includes("employee") || entityType.includes("employee")) return "person";
  if (action.includes("document") || entityType.includes("letter") || action.includes("tax")) return "document";

  return "check";
}

function rightPrimaryForAction(action: string) {
  const value = action.toLowerCase();

  if (value.includes("approved")) return "Approved";
  if (value.includes("completed") || value.includes("received")) return "Completed";
  if (value.includes("generated") || value.includes("created")) return "Ready";
  if (value.includes("added") || value.includes("synced")) return "Synced";
  if (value.includes("prepared")) return "Prepared";

  return "Logged";
}

function formatCurrency(value: number | string | null | undefined) {
  const numericValue = typeof value === "string" ? Number(value) : value;

  if (typeof numericValue !== "number" || Number.isNaN(numericValue)) {
    return "Logged";
  }

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function normalizeStatus(value: string | null | undefined) {
  return titleCase(value?.trim() || "logged");
}

function eventTimestamp(...values: Array<string | null | undefined>) {
  return values.find((value) => value && !Number.isNaN(new Date(value).getTime())) ?? null;
}

function auditLogToEvent(row: SupabaseAuditLogRow): ActivityEvent {
  return {
    id: `audit-${row.id}`,
    timestamp: row.at,
    title: titleCase(row.action),
    subtitle: row.entity_name ? `${row.entity_name} · ${titleCase(row.entity_type)}` : titleCase(row.entity_type),
    rightPrimary: rightPrimaryForAction(row.action),
    rightSecondary: relativeTimeLabel(row.at),
    icon: iconForLog(row),
    expandedNote: row.details ?? undefined,
  };
}

function payrollRunToEvent(row: SupabasePayrollActivityRow): ActivityEvent | null {
  const timestamp = eventTimestamp(row.saved_at, row.updated_at, row.created_at);
  if (!timestamp) return null;

  return {
    id: `payroll-${row.id}`,
    timestamp,
    title: "Payroll run recorded",
    subtitle: `Payroll · ${normalizeStatus(row.run_status)}`,
    rightPrimary: formatCurrency(row.total),
    rightSecondary: relativeTimeLabel(timestamp),
    icon: "payroll",
  };
}

function documentToEvent(row: SupabaseDocumentActivityRow): ActivityEvent | null {
  const timestamp = eventTimestamp(row.generated_at, row.created_at, row.updated_at);
  if (!timestamp) return null;

  return {
    id: `document-${row.id}`,
    timestamp,
    title: row.generated_at ? "Document generated" : "Document added",
    subtitle: row.title?.trim() || titleCase(row.type || "document"),
    rightPrimary: normalizeStatus(row.generation_status || row.status),
    rightSecondary: relativeTimeLabel(timestamp),
    icon: "document",
  };
}

function employeeToEvent(row: SupabaseEmployeeActivityRow): ActivityEvent | null {
  const timestamp = eventTimestamp(row.created_at, row.updated_at);
  if (!timestamp) return null;

  const updatedAt = row.updated_at ? new Date(row.updated_at).getTime() : 0;
  const createdAt = row.created_at ? new Date(row.created_at).getTime() : 0;
  const isUpdate = updatedAt > createdAt + 1000;
  const isInactive = row.status === "inactive";

  return {
    id: `employee-${row.id}-${isUpdate ? "updated" : "created"}`,
    timestamp,
    title: isInactive ? "Employee deactivated" : isUpdate ? "Employee updated" : "Employee added",
    subtitle: row.full_name?.trim() || "Employee profile",
    rightPrimary: isInactive ? "Inactive" : "Active",
    rightSecondary: relativeTimeLabel(timestamp),
    icon: "person",
  };
}

export async function getCompanyActivity(companyId: string): Promise<CompanyActivityGroupData[]> {
  return getCompanyActivityForToken(companyId);
}

export async function getCompanyActivityForToken(
  companyId: string,
  accessToken?: string
): Promise<CompanyActivityGroupData[]> {
  const client = requireAuthenticatedSupabaseClient(accessToken);

  const [
    { data: auditData, error: auditError },
    { data: payrollData, error: payrollError },
    { data: documentData, error: documentError },
    { data: employeeData, error: employeeError },
  ] = await Promise.all([
    client
      .from(SUPABASE_TABLES.auditLogs)
      .select("id,company_id,action,entity_type,entity_name,details,at")
      .eq("company_id", companyId)
      .order("at", { ascending: false })
      .limit(40),
    client
      .from(SUPABASE_TABLES.payrollRuns)
      .select("id,company_id,total,run_status,saved_at,created_at,updated_at")
      .eq("company_id", companyId)
      .order("saved_at", { ascending: false })
      .limit(20),
    client
      .from(SUPABASE_TABLES.documents)
      .select("id,company_id,title,type,status,generation_status,generated_at,created_at,updated_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false })
      .limit(20),
    client
      .from(SUPABASE_TABLES.employees)
      .select("id,company_id,full_name,status,created_at,updated_at")
      .eq("company_id", companyId)
      .order("updated_at", { ascending: false })
      .limit(20),
  ]);

  const firstError = auditError ?? payrollError ?? documentError ?? employeeError;
  if (firstError) {
    throw new Error(`Failed to load activity for company ${companyId}: ${toSafeSupabaseErrorMessage(firstError)}`);
  }

  const events = [
    ...(((auditData as SupabaseAuditLogRow[]) ?? []).map(auditLogToEvent)),
    ...(((payrollData as SupabasePayrollActivityRow[]) ?? []).map(payrollRunToEvent).filter(Boolean) as ActivityEvent[]),
    ...(((documentData as SupabaseDocumentActivityRow[]) ?? []).map(documentToEvent).filter(Boolean) as ActivityEvent[]),
    ...(((employeeData as SupabaseEmployeeActivityRow[]) ?? []).map(employeeToEvent).filter(Boolean) as ActivityEvent[]),
  ]
    .filter((event) => event.timestamp)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 40);

  if (!events.length && process.env.NODE_ENV !== "production" && isExplicitDemoActivityEnabled()) {
    // Dev/demo fallback only. Never enable this as production workspace data.
    return getCompanyDetailPageData(companyId).activityGroups;
  }

  const grouped = events.reduce<Record<string, CompanyActivityItem[]>>((acc, event) => {
    const label = groupLabelForDate(event.timestamp);

    if (!acc[label]) {
      acc[label] = [];
    }

    const { timestamp: _timestamp, ...item } = event;
    acc[label].push(item);

    return acc;
  }, {});

  return Object.entries(grouped).map(([label, items], index) => ({
    id: `${label.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    label,
    items,
  }));
}
