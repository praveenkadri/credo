import Link from "next/link";
import { CompanyAccountList } from "@/components/overview/company-account-list";
import { EmptyState } from "@/components/system/EmptyState";
import { SoftNotice } from "@/components/system/SoftNotice";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { buttonClassName } from "@/components/ui-primitives/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompaniesForToken } from "@/lib/data/companies";
import { routes } from "@/lib/routes";

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ intent?: string }>;
}) {
  const query = await searchParams;
  const isAddingEmployee = query.intent === "add-employee";
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  try {
    const companies = await getCompaniesForToken(user.accessToken);

    return (
      <div className="w-full pb-12">
        <section className="shell-enter">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="type-page-title md:text-[42px]">
                {isAddingEmployee ? "Choose a company for this employee" : "Your companies"}
              </h1>
              <p className="type-body mt-3 max-w-[720px] text-neutral-600">
                {isAddingEmployee
                  ? "Select the company this employee belongs to before creating their profile."
                  : "Manage each company as the home for employees, payroll, and documents."}
              </p>
            </div>
            <Link href={routes.companiesNew} className={buttonClassName("primary")}>
              Add company
            </Link>
          </div>
        </section>

        {companies.length ? (
          <CompanyAccountList companies={companies} intent={isAddingEmployee ? "add-employee" : undefined} showTitle={false} />
        ) : (
          <section className="mt-8 rounded-[28px] bg-[#fafaf7] px-6 py-10 shell-enter shell-enter-delay-1">
            <EmptyState
              title="No companies yet"
              description="Add a company before creating employees, payroll runs, or documents."
              ctaLabel="Add company"
              ctaHref={routes.companiesNew}
              variant="warning"
              visualType="company"
            />
          </section>
        )}
      </div>
    );
  } catch {
    return (
      <div className="w-full pb-12">
        <section className="mt-2 px-6 py-5">
          <SoftNotice
            title="We couldn’t load companies"
            description="Try again. If this keeps happening, check your connection and data access settings."
            variant="error"
          />
        </section>
      </div>
    );
  }
}
