import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

type DecisionSurfaceSectionProps = {
  className?: string;
};

export function DecisionSurfaceSection({ className = "" }: DecisionSurfaceSectionProps) {
  return (
    <section className={`${MARKETING_SHELL.container} py-14 md:py-[4.5rem] ${className}`} id="how">
      <div className="mx-auto max-w-[1260px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">Decision surface</p>
          <h2 className="mt-2 text-[38px] font-extrabold leading-[0.96] tracking-[-0.05em] text-[#080807] sm:text-[52px]">
            Not just a dashboard. A decision surface.
          </h2>
          <p className="mx-auto mt-2 max-w-[680px] text-[18px] font-medium leading-[1.36] text-[#242520]">
            Credo brings movement, readiness, and exceptions into one view so operators can act before work gets stuck.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#ffffff_0%,#f8faf4_42%,#edf3e8_100%)] shadow-[0_2px_4px_rgba(31,34,28,0.035),0_28px_68px_rgba(31,34,28,0.1)] ring-1 ring-[#deded8]">
          <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#e1e4dc] px-6 py-6 md:px-8 lg:px-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-primary)]">Credo workspace</p>
              <p className="mt-1 text-[18px] font-semibold text-[#11110f]">Thursday operating view</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-[#183012] ring-1 ring-[#eaeaea]">
                Readiness 82%
              </span>
              <span className="rounded-full bg-[#fff2d9] px-3 py-1.5 text-[11px] font-bold text-[#33220c] ring-1 ring-[#ead7b6]">
                1 blocker
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.34fr)_minmax(320px,0.66fr)]">
            <section className="bg-[#e8f1e3] px-6 py-8 md:px-8 md:py-9 lg:px-10 lg:py-10">
              <div className="flex min-h-[420px] flex-col justify-between gap-10">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#183012]">Approvals</p>
                      <h3 className="mt-2.5 max-w-[680px] text-[42px] font-extrabold leading-[0.91] tracking-[-0.06em] text-[#050504] md:text-[58px]">
                        2 payroll approvals need final review.
                      </h3>
                    </div>
                    <div className="border-l border-[#cfdcc8] pl-5">
                      <p className="numeric-tabular text-[42px] font-bold tracking-[-0.045em] text-[#030302]">3 of 4</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#183012]">Confirmed</p>
                    </div>
                  </div>
                  <p className="mt-3 max-w-[620px] text-[16px] font-medium leading-[1.34] text-[#20221c]">
                    Funding is confirmed. Final approvers can clear the run before work moves downstream.
                  </p>

                  <div className="mt-8 border-y border-[#cfdcc8] py-5">
                    <div className="flex items-center justify-between text-[12px] font-bold text-[#183012]">
                      <span>Approval path</span>
                      <span>Final approver pending</span>
                    </div>
                    <div className="mt-3 h-3 rounded-full bg-[#d5e0cf] ring-1 ring-[#c8d6c1]">
                      <div className="h-3 w-3/4 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-0 border-y border-[#cfdcc8] sm:grid-cols-3 sm:border-y-0">
                  {[
                    ["Payroll", "$128,430 prepared"],
                    ["Employees", "42 included"],
                    ["Companies", "3 active"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-b border-[#cfdcc8] py-4 sm:border-b-0 sm:border-l sm:px-5 sm:first:border-l-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#183012]">{label}</p>
                      <p className="mt-1 text-[15px] font-bold text-[#080807]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="border-t border-[#e1e4dc] bg-[#fbfcf8] lg:border-l lg:border-t-0">
              <div className="flex h-full flex-col">
                <section className="px-6 py-6 md:px-8 lg:px-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#20211d]">Next action</p>
                      <p className="mt-1.5 text-[28px] font-extrabold leading-[0.95] tracking-[-0.045em] text-[#050504]">
                        Review payroll approvals
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--brand-primary)] px-3 py-1.5 text-[11px] font-bold text-white">
                      Open
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] font-medium leading-[1.34] text-[#242520]">
                    Northlake Services is waiting on one final approver.
                  </p>
                </section>

                <section className="border-y border-[#ead7b6] bg-[#fff1d8] px-6 py-6 md:px-8 lg:px-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3a250b]">Compliance</p>
                    <span className="rounded-full bg-[var(--brand-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                      Alert
                    </span>
                  </div>
                  <p className="mt-1.5 text-[22px] font-extrabold leading-[0.98] tracking-[-0.03em] text-[#080807]">Tax document package needs review</p>
                  <p className="mt-1.5 text-[13px] font-medium leading-[1.34] text-[#34230d]">
                    The package is drafted and waiting on one director signature.
                  </p>
                </section>

                <section className="px-6 py-6 md:px-8 lg:px-7">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#20211d]">Readiness</p>
                      <p className="mt-1.5 text-[18px] font-bold leading-[1.08] text-[#11110f]">Morning operating check</p>
                    </div>
                    <span className="text-[13px] font-bold text-[#183012]">82% ready</span>
                  </div>
                  <div className="mt-5 divide-y divide-[#e1e4dc]">
                    {[
                      ["Aster Health Group", "Ready"],
                      ["Northlake Services", "Needs review"],
                      ["Ridgeview Partners", "Compliance alert"],
                    ].map(([name, state]) => (
                      <div key={name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <p className="text-[13px] font-bold text-[#11110f]">{name}</p>
                        <p className="text-[12px] font-semibold text-[#242520]">{state}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
