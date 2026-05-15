import { EmployeeListPage } from "@/components/employees/employee-list-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompanyByIdForToken } from "@/lib/data/companies";
import { listEmployeesForToken } from "@/lib/data/employees";
import { SoftNotice } from "@/components/system/SoftNotice";

export default async function CompanyEmployeesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const company = await getCompanyByIdForToken(id, user.accessToken);

  if (!company) {
    return (
      <div className="w-full pb-12">
        <section className="mt-2 px-6 py-5">
          <SoftNotice
            title="Company not found"
            description="This company may have been removed or is not available in your workspace."
            variant="warning"
          />
        </section>
      </div>
    );
  }

  const employees = await listEmployeesForToken(company.id, user.accessToken);

  return <EmployeeListPage companyId={company.id} companyName={company.name} employees={employees} />;
}
