export function ProductSurfaceMock() {
  return (
    <div className="rounded-[28px] bg-white/70 p-5 ring-1 ring-neutral-200/50 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <section className="rounded-2xl bg-neutral-50/80 p-4">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Cash movement</p>
            <p className="mt-1 text-[34px] font-semibold tracking-[-0.03em] text-neutral-900">$128,430.00</p>
            <p className="mt-1 text-[12px] text-neutral-600">Payroll run prepared 2h ago</p>
          </section>

          <section className="space-y-2">
            {[
              ["Aster Health Group", "Ready", "Run in normal range"],
              ["Northlake Services", "Needs review", "No activity yet"],
              ["Ridgeview Partners", "Funding due", "Funding due tomorrow"],
            ].map(([name, status, note]) => (
              <div
                key={name}
                className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-neutral-200/40"
              >
                <div>
                  <p className="text-[13px] font-medium text-neutral-900">{name}</p>
                  <p className="text-[12px] text-neutral-600">{note}</p>
                </div>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-neutral-600 ring-1 ring-neutral-200/60">
                  {status}
                </span>
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-3">
          <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/40">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Today</p>
            <p className="mt-1 text-[13px] font-medium text-neutral-800">Review payroll approvals</p>
          </div>
          <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/40">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Next</p>
            <p className="mt-1 text-[13px] font-medium text-neutral-800">Generate invoice batch</p>
          </div>
          <div className="rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/40">
            <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Status</p>
            <p className="mt-1 text-[13px] font-medium text-neutral-800">Payroll status: Ready</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
