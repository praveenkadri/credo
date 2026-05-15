import { PayrollPage } from "@/components/payroll/payroll-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompaniesForToken } from "@/lib/data/companies";
import { listEmployeesForToken } from "@/lib/data/employees";
import { listPayrollRunsForToken } from "@/lib/data/payroll";

export default async function PayrollRoute({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const [allRuns, companies] = await Promise.all([
    listPayrollRunsForToken(user.accessToken),
    getCompaniesForToken(user.accessToken),
  ]);
  const selectedCompany = (companyId ? companies.find((company) => company.id === companyId) : null) ?? companies[0] ?? null;
  const runs = companyId && selectedCompany
    ? allRuns.filter((run) => run.companyId === selectedCompany.id)
    : allRuns;
  const employees = selectedCompany
    ? (await listEmployeesForToken(selectedCompany.id, user.accessToken)).filter(
        (employee) => employee.status === "active" && employee.payrollSettings.eligibleForPayroll
      )
    : [];

  return (
    <PayrollPage
      runs={runs}
      companyId={selectedCompany?.id}
      companyName={selectedCompany?.name}
      employees={employees}
      hasCompanies={companies.length > 0}
      hasExplicitCompany={Boolean(companyId)}
    />
  );
}
