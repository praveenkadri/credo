const companyRows = [
  ["Aster Health Group", "Payroll ready", "All documents current", "ready"],
  ["Northlake Services", "Needs review", "One approval pending", "review"],
  ["Ridgeview Partners", "Funding due", "Transfer scheduled", "neutral"],
] as const;

const nextActions = [
  ["Today", "Review payroll approvals"],
  ["Next", "Send invoice batch"],
  ["Documents", "Director signature needed"],
] as const;

const statusTone = {
  ready: "bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] ring-[var(--brand-primary-border)]",
  review: "bg-[#f7f1df] text-[#6d5018] ring-[#eadfbd]",
  neutral: "bg-[#f1f2ef] text-[#575b55] ring-black/[0.04]",
} as const;

export function ProductSurfaceMock() {
  return (
    <div className="group relative isolate px-2 py-4 sm:px-4">
      <div
        className="absolute inset-x-10 bottom-1 top-12 -z-20 rounded-[28px] bg-[var(--brand-primary-soft)] shadow-[0_26px_58px_rgba(31,34,28,0.1)]"
        aria-hidden="true"
      />
      <div
        className="absolute -inset-x-1 bottom-8 top-3 -z-10 rounded-[28px] bg-white/[0.62] shadow-[0_16px_36px_rgba(31,34,28,0.08)] backdrop-blur-md"
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 z-20 hidden rounded-full bg-white/[0.86] px-3 py-1.5 text-[11px] font-semibold text-[var(--brand-primary)] shadow-[0_10px_24px_rgba(31,34,28,0.1),inset_0_0_0_1px_rgba(234,234,234,0.82)] backdrop-blur-md sm:block">
        Live operating view
      </div>

      <div className="relative overflow-hidden rounded-[26px] bg-white/[0.82] p-2.5 shadow-[0_2px_5px_rgba(31,34,28,0.05),0_24px_52px_rgba(31,34,28,0.1)] backdrop-blur-xl transition-transform duration-150 ease-out group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="rounded-[22px] bg-[#fbfbf8] p-3 shadow-[inset_0_0_0_1px_rgba(222,222,216,0.54)]">
          <div className="flex items-center justify-between border-b border-[#e4e4de] px-2 pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#575b55]">Credo workspace</p>
              <p className="mt-1 text-[15px] font-semibold text-[#11110f]">Thursday payroll run</p>
            </div>
            <div className="rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary-border)]">
              Funding ready
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_218px]">
            <div className="space-y-3">
              <section className="rounded-[20px] bg-[var(--brand-primary-soft)] p-4 shadow-[inset_0_0_0_1px_rgba(33,76,58,0.09),0_8px_22px_rgba(31,34,28,0.035)]">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-end">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]">Cash movement</p>
                    <p className="numeric-tabular mt-1 text-[46px] font-semibold tracking-[-0.045em] text-[#030302] sm:text-[52px]">
                      $128,430
                    </p>
                    <p className="max-w-[34ch] text-[12px] font-medium text-[#20221c]">
                      Net payroll prepared for 42 employees across 3 companies.
                    </p>
                  </div>

                  <div className="rounded-[18px] bg-white/[0.86] px-3.5 py-3.5 shadow-[inset_0_0_0_1px_rgba(222,222,216,0.68),0_7px_16px_rgba(31,34,28,0.045)]">
                    <div className="flex items-center justify-between text-[13px] text-[#151713]">
                      <span className="font-semibold">Approvals</span>
                      <span className="numeric-tabular font-semibold text-[#080807]">3 of 4</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-[var(--credo-taupe)] ring-1 ring-[var(--brand-primary-border)]">
                      <div className="h-2.5 w-3/4 rounded-full bg-[var(--brand-primary)]" />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-[#20221c]">
                      <span>Funding check</span>
                      <span className="text-[var(--brand-primary)]">Ready</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] bg-white/[0.82] p-4 shadow-[inset_0_0_0_1px_rgba(222,222,216,0.56),0_6px_18px_rgba(31,34,28,0.035)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#575b55]">Company statuses</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#11110f]">Morning check-in</p>
                  </div>
                  <span className="text-[11px] font-medium text-[#6e736b]">Updated 9:14 AM</span>
                </div>

                <div className="mt-3 divide-y divide-[#deded8]">
                  {companyRows.map(([name, status, note, tone]) => (
                    <div key={name} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-[13px] font-semibold text-[#11110f]">{name}</p>
                        <p className="mt-1 text-[12px] font-medium text-[#575b55]">{note}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusTone[tone]}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[20px] bg-[#f7f1df]/80 p-4 shadow-[inset_0_0_0_1px_rgba(222,214,196,0.6),0_6px_18px_rgba(31,34,28,0.035)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6d5018]">Documents</p>
                    <p className="mt-1 text-[15px] font-semibold text-[#11110f]">Packages prepared after payroll</p>
                  </div>
                  <span className="numeric-tabular text-[16px] font-semibold text-[#050504]">18 files</span>
                </div>
              </section>
            </div>

            <aside className="rounded-[20px] bg-white/[0.82] p-3.5 shadow-[inset_0_0_0_1px_rgba(222,222,216,0.56),0_6px_18px_rgba(31,34,28,0.035)]">
              <div className="divide-y divide-[#deded8]">
                {nextActions.map(([label, action]) => (
                  <div key={label} className="px-1 py-3 first:pt-1 last:pb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--brand-primary)]">{label}</p>
                    <p className="mt-2 text-[15px] font-semibold text-[#11110f]">{action}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
