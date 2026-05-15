import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getCompanyProfileForToken,
  getCompanySetupPrompts,
  getCompaniesForToken,
  hasCompletePayrollDetails,
} from "@/lib/data/companies";
import { routes } from "@/lib/routes";
import { requireAuthenticatedSupabaseClient } from "@/lib/supabase/client";

type NavigationState = {
  hasCompanies: boolean;
  hasEmployees: boolean;
  hasPayrollRuns: boolean;
  hasDocuments: boolean;
  hasCompanyActivity: boolean;
  hasComplianceDetails: boolean;
  hasPayrollSetupStarted: boolean;
  hasPayrollSetupComplete: boolean;
  addEmployeeHref?: string;
  payrollSetupHref?: string;
  userFirstName?: string;
};

const emptyState: NavigationState = {
  hasCompanies: false,
  hasEmployees: false,
  hasPayrollRuns: false,
  hasDocuments: false,
  hasCompanyActivity: false,
  hasComplianceDetails: false,
  hasPayrollSetupStarted: false,
  hasPayrollSetupComplete: false,
};

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(emptyState, { status: 401 });
  }

  try {
    const companies = await getCompaniesForToken(user.accessToken);
    const companyIds = companies.map((company) => company.id);
    const userFirstName = getUserFirstName(user.userMetadata, user.email);

    if (!companyIds.length) {
      return NextResponse.json({ ...emptyState, userFirstName });
    }

    const client = requireAuthenticatedSupabaseClient(user.accessToken);
    const [
      { count: employeeCount, error: employeeError },
      { count: payrollRunCount, error: payrollRunError },
      { count: documentCount, error: documentError },
      { count: activityCount, error: activityError },
      profiles,
    ] = await Promise.all([
      client.from("employees").select("id", { count: "exact", head: true }).in("company_id", companyIds),
      client.from("payroll_runs").select("id", { count: "exact", head: true }).in("company_id", companyIds),
      client.from("documents").select("id", { count: "exact", head: true }).in("company_id", companyIds),
      client.from("audit_logs").select("id", { count: "exact", head: true }).in("company_id", companyIds),
      Promise.all(companyIds.map((companyId) => getCompanyProfileForToken(companyId, user.accessToken).catch(() => null))),
    ]);

    if (employeeError ?? payrollRunError ?? documentError) {
      return NextResponse.json(emptyState);
    }

    const hasPayrollSetupStarted = profiles.some((profile) =>
      profile
        ? Boolean(
            profile.setupCompletedAt ||
              profile.payrollNumber ||
              profile.hstNumber ||
              profile.binNumber ||
              profile.businessNumber
          )
        : false
    );
    const hasPayrollSetupComplete = profiles.some((profile) =>
      profile ? Boolean(profile.setupCompletedAt) || hasCompletePayrollDetails(profile) : false
    );
    const primaryCompany = companies[0];
    const primaryProfile = profiles.find(Boolean);
    const payrollSetupHref = primaryProfile
      ? getCompanySetupPrompts(primaryProfile).primaryPrompt?.href ?? routes.companyProfileSectionEdit(primaryProfile.id, "tax")
      : primaryCompany
        ? routes.companyProfileSectionEdit(primaryCompany.id, "tax")
        : routes.companiesAlias;
    const addEmployeeHref =
      companies.length === 1 && primaryCompany
        ? routes.employeesNewForCompany(primaryCompany.id)
        : routes.companiesForEmployeeCreation();

    return NextResponse.json({
      hasCompanies: true,
      hasEmployees: (employeeCount ?? 0) > 0,
      hasPayrollRuns: (payrollRunCount ?? 0) > 0,
      hasDocuments: (documentCount ?? 0) > 0,
      hasCompanyActivity: (payrollRunCount ?? 0) > 0 || (activityError ? false : (activityCount ?? 0) > 0),
      hasComplianceDetails: hasPayrollSetupStarted || hasPayrollSetupComplete,
      hasPayrollSetupStarted,
      hasPayrollSetupComplete,
      addEmployeeHref,
      payrollSetupHref,
      userFirstName,
    } satisfies NavigationState);
  } catch {
    return NextResponse.json(emptyState);
  }
}

function getUserFirstName(metadata: Record<string, unknown>, email?: string) {
  const name = firstString(
    metadata.first_name,
    metadata.firstName,
    metadata.given_name,
    metadata.name,
    metadata.full_name,
    metadata.displayName
  );
  const fallback = email?.split("@")[0];
  const source = name ?? fallback;
  const first = source?.trim().split(/\s+/)[0];
  return first || undefined;
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}
