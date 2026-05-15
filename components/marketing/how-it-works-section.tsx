import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";

const steps = [
  {
    title: "Add companies and team members",
    copy: "Create the company workspace, add employees, and keep the core payroll details in one place.",
  },
  {
    title: "Prepare payroll and records",
    copy: "Review upcoming runs, readiness states, and employee details before records are generated.",
  },
  {
    title: "Keep documents and history organized",
    copy: "Store generated documents and private records with the company and employee context they belong to.",
  },
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[var(--marketing-cream)] py-18 md:py-24">
      <div className={MARKETING_SHELL.container}>
        <div className="max-w-[760px]">
          <p className={MARKETING_STYLE.eyebrow}>How it works</p>
          <h2 className={`mt-4 ${MARKETING_STYLE.heading}`}>
            Set up the company once, then follow a clearer operating rhythm.
          </h2>
          <p className={`mt-5 max-w-[620px] ${MARKETING_STYLE.body}`}>
            Credo turns scattered admin work into a repeatable workflow your team can understand.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className={MARKETING_STYLE.stepCard}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--marketing-green)]">
                Step 0{index + 1}
              </p>
              <h3 className="mt-7 max-w-[280px] text-[21px] font-semibold leading-[1.2] tracking-[-0.022em] text-[var(--marketing-text)]">
                {step.title}
              </h3>
              <p className="mt-4 text-[14px] leading-[1.65] text-[var(--marketing-muted)]">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
