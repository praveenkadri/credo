import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";

const trustItems = [
  "Private records stay tied to the right company, employee, and document history.",
  "Multi-company workspaces keep separate businesses organized without duplicate admin systems.",
  "Payroll records, generated documents, and readiness states stay visible before work goes out.",
  "Credo organizes operations and reduces payroll mistakes without becoming a money-movement layer.",
] as const;

export function TrustSection() {
  return (
    <section id="trust" className="bg-[var(--credo-bg)] py-18 md:py-24">
      <div className={`${MARKETING_SHELL.container} grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.8fr)] lg:items-start`}>
        <div className="max-w-[650px]">
          <p className={MARKETING_STYLE.eyebrow}>Trust and clarity</p>
          <h2 className={`mt-4 ${MARKETING_STYLE.heading}`}>
            Built to make business administration feel less fragile.
          </h2>
          <p className={`mt-5 max-w-[580px] ${MARKETING_STYLE.body}`}>
            Credo is designed for small teams and multi-company operators who need calm, structured workflows instead
            of spreadsheet sprawl.
          </p>

          <div className={`${MARKETING_STYLE.softCard} mt-9 max-w-[440px] p-6 text-[15px] font-semibold leading-[1.55] text-[var(--marketing-text)]`}>
            Keep company profiles, employee records, payroll activity, and private documents organized in one place.
          </div>
        </div>

        <div className="divide-y divide-[var(--marketing-border)] border-y border-[var(--marketing-border)]">
          {trustItems.map((item) => (
            <div key={item} className="flex gap-4 py-5">
              <span className="mt-1.5 size-2 rounded-full bg-[var(--marketing-green)] shadow-[0_0_0_4px_rgba(91,77,58,0.1)]" />
              <p className="text-[15px] font-semibold leading-[1.58] text-[var(--marketing-text)]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
