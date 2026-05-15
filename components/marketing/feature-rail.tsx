import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";

const features = [
  {
    number: "01",
    iconTone: "after:w-3.5",
    title: "Track companies",
    copy: "Keep every business profile, address, and owner detail organized.",
  },
  {
    number: "02",
    iconTone: "after:w-2",
    title: "Manage teams",
    copy: "Add employees, roles, payroll details, and records without scattered files.",
  },
  {
    number: "03",
    iconTone: "after:w-4",
    title: "Run payroll",
    copy: "Prepare payroll from a guided workspace with clear status and history.",
  },
  {
    number: "04",
    iconTone: "after:w-2.5",
    title: "Keep documents ready",
    copy: "Generate and find letters, pay stubs, and company records when needed.",
  },
] as const;

export function FeatureRail() {
  return (
    <section id="features" className="bg-[var(--marketing-cream)] py-18 md:py-24">
      <div className={MARKETING_SHELL.container}>
        <div className="max-w-[760px]">
          <p className={MARKETING_STYLE.eyebrow}>What Credo helps with</p>
          <h2 className={`mt-4 ${MARKETING_STYLE.heading}`}>
            All the context around your companies, organized without the noise.
          </h2>
          <p className={`mt-5 max-w-[650px] ${MARKETING_STYLE.body}`}>
            Credo connects the operational details a growing business needs - companies, teams, payroll, and documents -
            into one focused workspace.
          </p>
        </div>

        <div className="mt-14 divide-y divide-[var(--marketing-border)] border-y border-[var(--marketing-border)]">
          {features.map((feature) => (
            <article key={feature.number} className={MARKETING_STYLE.rowItem}>
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[var(--credo-bronze-pale)] text-[12px] font-semibold text-[var(--marketing-green)] ring-1 ring-[rgba(184,135,79,0.18)]">
                  {feature.number}
                </span>
                <span
                  className={`relative hidden size-8 rounded-xl bg-[var(--marketing-accent-wash)] ring-1 ring-[var(--marketing-status-border)] after:absolute after:left-2 after:top-1/2 after:h-1.5 after:-translate-y-1/2 after:rounded-full after:bg-[var(--marketing-green)] sm:inline-flex ${feature.iconTone}`}
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-[21px] font-semibold leading-[1.2] tracking-[-0.022em] text-[var(--marketing-text)]">
                {feature.title}
              </h3>
              <p className="max-w-[560px] text-[15px] leading-[1.65] text-[var(--marketing-muted)]">{feature.copy}</p>
              <span
                className="hidden size-7 items-center justify-center rounded-full text-[15px] font-semibold text-[var(--marketing-green)] opacity-60 transition group-hover:translate-x-0.5 group-hover:opacity-100 sm:inline-flex"
                aria-hidden="true"
              >
                →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
