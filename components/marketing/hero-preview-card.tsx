const companyRows = [
  ["Northstar Studio", "Payroll ready", "bg-[var(--marketing-status-bg)] text-[var(--marketing-green)] ring-[var(--marketing-status-border)]"],
  ["Evergreen Dental", "Documents pending", "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-[rgba(184,135,79,0.2)]"],
  ["Maple Home Care", "Team updated", "bg-[var(--marketing-cream-strong)] text-[var(--marketing-muted)] ring-[var(--marketing-border)]"],
] as const;

const chips = ["3 active companies", "12 employees"] as const;

export function HeroPreviewCard() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] px-1 py-4 sm:px-3">
      <div
        className="absolute inset-x-10 bottom-2 top-12 rounded-[34px] bg-[rgba(239,229,213,0.13)] opacity-60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 top-10 hidden h-24 w-24 rounded-[24px] bg-[rgba(239,229,213,0.12)] ring-1 ring-white/10 lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute -right-1 bottom-14 hidden h-32 w-32 rounded-full bg-[rgba(251,250,244,0.11)] blur-md lg:block"
        aria-hidden="true"
      />

      <article className="relative overflow-hidden rounded-[30px] border border-white/42 bg-[var(--marketing-cream)] p-4 shadow-[0_24px_68px_rgba(3,16,11,0.22),0_0_0_1px_rgba(255,255,255,0.2)_inset] sm:p-5">
        <div className="rounded-[24px] border border-[var(--marketing-border)] bg-white/78 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.88)] sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-4 border-b border-[var(--marketing-border)] pb-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--marketing-green)]">Credo overview</p>
              <p className="numeric-tabular mt-3 text-[38px] font-semibold leading-none tracking-[-0.045em] text-[var(--marketing-text)] sm:text-[46px]">
                $18,420
              </p>
              <p className="mt-1 text-[13px] font-medium text-[var(--marketing-muted)]">payroll ready</p>
            </div>
            <div className="rounded-[18px] bg-[var(--credo-bronze-pale)] px-3.5 py-3 text-right ring-1 ring-[rgba(184,135,79,0.18)]">
              <p className="numeric-tabular text-[22px] font-semibold tracking-[-0.03em] text-[var(--marketing-green)]">6</p>
              <p className="mt-1 text-[11px] font-medium text-[var(--marketing-muted)]">documents</p>
            </div>
          </div>

          <div className="divide-y divide-[var(--marketing-border)]">
            {companyRows.map(([company, status, tone]) => (
              <div key={company} className="flex items-center justify-between gap-3 py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[var(--marketing-cream-strong)] text-[12px] font-semibold text-[var(--marketing-green)] ring-1 ring-[var(--marketing-border)]">
                    {company.charAt(0)}
                  </span>
                  <p className="truncate text-[14px] font-semibold text-[var(--marketing-text)]">{company}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${tone}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-2 flex flex-wrap gap-2 border-t border-[var(--marketing-border)] pt-4">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-[var(--marketing-status-bg)] px-3 py-1.5 text-[12px] font-semibold text-[var(--marketing-green)] ring-1 ring-[var(--marketing-status-border)]"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
