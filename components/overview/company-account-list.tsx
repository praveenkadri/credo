import Link from "next/link";
import { surfaceClass } from "@/components/ui/surface";
import { EmptyState } from "@/components/system/EmptyState";
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

export function CompanyAccountList({ companies }: { companies: CompanyAccount[] }) {
  return (
    <section className="mt-6 shell-enter shell-enter-delay-2">
      <div className="mb-3 grid items-end gap-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <div>
          <p className="type-caption text-neutral-400">Companies</p>
          <h2 className="type-body-small mt-1 text-neutral-700">Your companies</h2>
        </div>
        <Link
          href={routes.companiesNew}
          className="type-button inline-flex h-8 items-center rounded-lg px-2.5 text-[#5f645c] transition-colors duration-150 hover:bg-[#f7f8f4] hover:text-[#1f221c] md:justify-self-end"
        >
          Add company
        </Link>
      </div>

      <div className="space-y-4">
        {companies.length ? (
          companies.map((company) => <CompanyAccountRow key={company.id} {...company} />)
        ) : (
          <div className={cn("px-6 py-5", surfaceClass("accountRow"))}>
            <EmptyState
              title="No companies yet"
              description="Add your first company to start tracking payroll and operations activity."
              ctaLabel="Add company"
              ctaHref={routes.companiesNew}
              variant="warning"
            />
          </div>
        )}
      </div>
    </section>
  );
}
