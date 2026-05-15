import { EmployeeFormPage } from "@/components/employees/employee-form-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompaniesForToken } from "@/lib/data/companies";
import { EmptyStateVisual } from "@/components/brand/brand-visuals";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";
import Link from "next/link";

export default async function NewEmployeePage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const companies = await getCompaniesForToken(user.accessToken);
  const company = (companyId ? companies.find((item) => item.id === companyId) : null) ?? companies[0];

  if (!company) {
    return (
      <div className="w-full pb-12">
        <section className="shell-enter rounded-[28px] bg-[#f7f7f4] px-6 py-10">
          <div className="mx-auto max-w-[520px] text-center">
            <EmptyStateVisual type="company" />
            <h1 className="type-card-title text-[#1f221c]">Create a company first</h1>
            <p className="type-body mt-3 text-neutral-600">
              Add an active company before adding employees to Team.
            </p>
            <div className="mt-6 flex justify-center">
              <Link href={routes.companiesNew} className={buttonClassName("secondary")}>
                Add company
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return <EmployeeFormPage mode="create" companyId={company.id} companyName={company.name} />;
}
