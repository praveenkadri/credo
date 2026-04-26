import {
  getCompanyDetailPageData,
  type CompanyActivityGroupData,
  type CompanyActivityItem,
} from "@/components/company-detail/company-detail-data";
import { supabase } from "@/lib/supabase/client";

const SUPABASE_TABLES = {
  auditLogs: "audit_logs",
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

export async function getCompanyActivity(companyId: string): Promise<CompanyActivityGroupData[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.auditLogs)
    .select("id,company_id,action,entity_type,entity_name,details,at")
    .eq("company_id", companyId)
    .order("at", { ascending: false })
    .limit(40);

  if (error) {
    throw new Error(`Failed to load activity for company ${companyId}: ${error.message}`);
  }

  const rows = (data as SupabaseAuditLogRow[]) ?? [];

  if (!rows.length) {
    return getCompanyDetailPageData(companyId).activityGroups;
  }

  const grouped = rows.reduce<Record<string, CompanyActivityItem[]>>((acc, row) => {
    const label = groupLabelForDate(row.at);

    if (!acc[label]) {
      acc[label] = [];
    }

    acc[label].push({
      id: row.id,
      title: titleCase(row.action),
      subtitle: row.entity_name ? `${row.entity_name} · ${titleCase(row.entity_type)}` : titleCase(row.entity_type),
      rightPrimary: rightPrimaryForAction(row.action),
      rightSecondary: relativeTimeLabel(row.at),
      icon: iconForLog(row),
      expandedNote: row.details ?? undefined,
    });

    return acc;
  }, {});

  return Object.entries(grouped).map(([label, items], index) => ({
    id: `${label.toLowerCase().replace(/\s+/g, "-")}-${index}`,
    label,
    items,
  }));
}
