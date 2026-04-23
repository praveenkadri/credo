import Link from "next/link";
import { CompanyAccountRow } from "@/components/overview/company-account-row";

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
    <section className="mt-4 shell-enter shell-enter-delay-2">
      <div className="-mx-3 mb-3 grid items-end gap-3 px-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">Companies</p>
          <h2 className="mt-1 text-[13px] font-medium tracking-[-0.01em] text-neutral-700">Your companies</h2>
        </div>
        <Link
          href="/companies/new"
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-[#5f645c] transition-colors duration-150 hover:bg-[#f7f8f4] hover:text-[#1f221c] md:mr-7 md:justify-self-end"
        >
          Add company
        </Link>
      </div>

      <div className="space-y-4">
        {companies.map((company) => (
          <CompanyAccountRow key={company.id} {...company} />
        ))}
      </div>
    </section>
  );
}
