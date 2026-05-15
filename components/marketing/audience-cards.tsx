import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

const AUDIENCES = [
  {
    name: "Aster Clinic",
    type: "Healthcare clinic",
    payroll: "Payroll ready",
    documents: "T4 package current",
    invoices: "5 invoices staged",
  },
  {
    name: "Northline Build Co.",
    type: "Contractor",
    payroll: "2 approvals pending",
    documents: "WCB letter missing",
    invoices: "Progress billing today",
  },
  {
    name: "Harbour Retail",
    type: "Retail operator",
    payroll: "Funding scheduled",
    documents: "Policy packet signed",
    invoices: "Vendor credits under review",
  },
];

type AudienceCardsProps = {
  className?: string;
};

export function AudienceCards({ className = "" }: AudienceCardsProps) {
  return (
    <section id="operators" className={`${MARKETING_SHELL.container} ${MARKETING_SHELL.sectionSpacing} ${className}`}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] md:items-center">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">Operators</p>
          <h2 className="mt-3 text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">
            Different businesses, same readable workspace.
          </h2>
        </div>

        <div className="overflow-hidden rounded-[28px] bg-[#fbfbf8] ring-1 ring-black/[0.045]">
          <div className="border-b border-black/[0.07] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Across the workspace</p>
            <p className="mt-1 text-[14px] font-medium text-neutral-900">The same system adapts to different operating realities</p>
          </div>

          <div className="divide-y divide-black/[0.07]">
            {AUDIENCES.map((audience) => (
              <article key={audience.name} className="grid gap-4 px-5 py-4 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start">
                <div>
                  <p className="text-[14px] font-medium text-neutral-900">{audience.name}</p>
                  <p className="mt-1 text-[12px] text-neutral-500">{audience.type}</p>
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-[16px] bg-[var(--brand-primary-soft)] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">Payroll</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-900">{audience.payroll}</p>
                  </div>
                  <div className="rounded-[16px] bg-[#f3f4f4] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">Documents</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-900">{audience.documents}</p>
                  </div>
                  <div className="rounded-[16px] bg-[#f4efe6] px-3 py-3">
                    <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">Invoices</p>
                    <p className="mt-1 text-[12px] font-medium text-neutral-900">{audience.invoices}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
