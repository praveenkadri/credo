const DECISIONS = [
  ["Today", "2 payroll approvals"],
  ["Next", "Invoice batch at 3:00 PM"],
  ["Needs review", "Tax document package"],
  ["Ready to send", "11 invoices prepared"],
];

export function DecisionSurfaceSection() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[1180px] px-5 lg:px-7" id="how">
      <h2 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">
        Not just a dashboard. A decision surface.
      </h2>
      <p className="mt-4 max-w-[760px] text-[17px] leading-[1.55] text-neutral-600">
        Credo highlights what needs review, what is ready, and what is coming next so operators can move fast without
        noise.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DECISIONS.map(([title, body]) => (
          <article key={title} className="rounded-2xl bg-white/70 p-4 ring-1 ring-neutral-200/50">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">{title}</p>
            <p className="mt-2 text-[14px] font-medium text-neutral-900">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
