const helpItems = [
  {
    title: "What do I need before payroll?",
    text: "Add a company, complete payroll details, and create at least one employee.",
  },
  {
    title: "Why add employees first?",
    text: "Employee profiles power payroll calculations, pay stubs, and records.",
  },
  {
    title: "Where do documents come from?",
    text: "Documents appear after payroll activity or manual uploads.",
  },
  {
    title: "Can I change company details later?",
    text: "Yes. Company details can be updated before future payroll runs.",
  },
];

export function WorkflowsHelpPanel({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <div className="rounded-[26px] bg-[var(--credo-surface-warm)] p-5 shadow-[0_10px_34px_rgba(23,26,23,0.025)] ring-1 ring-[var(--credo-border)]">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--credo-bronze-700)]">Setup guidance</p>
        <div className="mt-3 divide-y divide-[rgba(225,218,207,0.72)]">
          {helpItems.map((item, index) => (
            <details key={item.title} className="group py-3 first:pt-0 last:pb-0" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-1 py-0.5 text-[13px] font-semibold leading-[1.35] text-[var(--credo-ink)] outline-none transition-colors duration-[160ms] hover:bg-[var(--credo-bronze-pale)] hover:text-[var(--credo-green-950)] focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.22)]">
                {item.title}
                <span className="text-[rgba(143,99,53,0.72)] transition-[color,transform] duration-[160ms] group-hover:text-[var(--credo-green-800)] group-open:rotate-90" aria-hidden="true">
                  →
                </span>
              </summary>
              <p className="mt-2 max-w-[320px] text-[12.5px] font-normal leading-[1.45] text-[var(--credo-muted)]">
                {item.text}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
