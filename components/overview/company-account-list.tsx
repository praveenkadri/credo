import { surfaceClass } from "@/components/ui/surface";
import { buttonClassName } from "@/components/ui-primitives/button";
import { cn } from "@/lib/utils";
import { CompanyAccountRow } from "@/components/overview/company-account-row";
import { routes } from "@/lib/routes";

type CompanyAccount = {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  state: string;
  stateDetail: string;
  statusTone: string;
  statusPillTone: string;
  lastActivity: string;
  payrollAmount: string;
  employeeCount: number;
  href: string;
};

export function CompanyAccountList({
  companies,
  intent,
  showTitle = true,
}: {
  companies: CompanyAccount[];
  intent?: "add-employee";
  showTitle?: boolean;
}) {
  const isAddingEmployee = intent === "add-employee";

  return (
    <section className="mt-8 shell-enter shell-enter-delay-2">
      <div className={cn("mb-4 grid items-center gap-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]", !showTitle && "mb-3")}>
        {showTitle ? (
          <div>
            <h2 className="text-[22px] font-semibold leading-[1.12] text-[var(--credo-ink)]">
              {isAddingEmployee ? "Choose a company for this employee" : "Your companies"}
            </h2>
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
        {companies.length ? (
          <button
            type="button"
            className={`${buttonClassName("secondary")} h-9 rounded-full bg-[var(--credo-surface)] px-4 text-[12.5px] text-[var(--credo-muted-strong)] ring-[var(--credo-border)] hover:bg-[var(--credo-bronze-pale)] md:justify-self-end`}
          >
            Company type
            <span className="ml-1 text-[var(--credo-bronze-700)]" aria-hidden="true">⌄</span>
          </button>
        ) : null}
      </div>

      <div className="space-y-3.5">
        {companies.length ? (
          companies.map((company) => (
            <CompanyAccountRow
              key={company.id}
              {...company}
              href={isAddingEmployee ? routes.employeesNewForCompany(company.id) : company.href}
            />
          ))
        ) : (
          <div className={cn("px-6 py-5", surfaceClass("accountRow"))}>
            <p className="type-body-strong text-[#1f221c]">No companies yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
