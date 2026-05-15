import { EmployeeFormPage } from "@/components/employees/employee-form-page";
import { SoftNotice } from "@/components/system/SoftNotice";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompanyByIdForToken } from "@/lib/data/companies";

export default async function NewCompanyEmployeePage({
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
            description="Choose an active company before adding an employee."
            variant="warning"
          />
        </section>
      </div>
    );
  }

  return <EmployeeFormPage mode="create" companyId={company.id} companyName={company.name} />;
}
