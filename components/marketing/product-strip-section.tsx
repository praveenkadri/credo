import { MARKETING_SHELL, MARKETING_STYLE } from "@/components/marketing/marketing-layout";
import { ProductPreviewCard } from "@/components/marketing/product-preview-card";

const companyRows: Array<[string, string]> = [
  ["Profile", "Complete"],
  ["Team", "8 employees"],
  ["Documents", "4 ready"],
];

const payrollRows: Array<[string, string]> = [
  ["May 15", "Draft"],
  ["May 31", "Ready"],
  ["June 15", "Scheduled"],
];

function SectionCopy({
  eyebrow,
  title,
  copy,
  bullets,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  bullets: string[];
}) {
  return (
    <div className="max-w-[520px]">
      <p className={MARKETING_STYLE.eyebrow}>{eyebrow}</p>
      <h2 className={`mt-4 ${MARKETING_STYLE.heading}`}>
        {title}
      </h2>
      <p className="mt-5 text-[16px] leading-[1.7] text-[var(--marketing-muted)]">{copy}</p>
      <div className="mt-7 space-y-3">
        {bullets.map((bullet) => (
          <div key={bullet} className="flex items-center gap-3 text-[14px] font-semibold text-[var(--marketing-text)]">
            <span className="size-1.5 rounded-full bg-[var(--marketing-green)]" />
            <span>{bullet}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductStripSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--marketing-beige)] py-18 md:py-24">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(91,77,58,0.22),transparent)]"
        aria-hidden="true"
      />
      <div className={`${MARKETING_SHELL.container} space-y-16 md:space-y-20`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(320px,0.72fr)] lg:items-center">
          <SectionCopy
            eyebrow="Company operations"
            title="A clean ledger for what each company needs."
            copy="Credo keeps company records, people, payroll, and documents connected, so the next action is always clear."
            bullets={["Company details stay current", "Employees and records stay linked"]}
          />
          <div className="mx-auto w-full max-w-[430px] lg:justify-self-end">
            <ProductPreviewCard title="Company workspace" rows={companyRows} />
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(320px,0.72fr)_minmax(0,0.92fr)] lg:items-center">
          <div className="mx-auto w-full max-w-[430px] lg:justify-self-start">
            <ProductPreviewCard tone="dark" title="Payroll run" rows={payrollRows} />
          </div>
          <div className="lg:justify-self-end">
            <SectionCopy
              eyebrow="Payroll planning"
              title="Turn payroll into a practical monthly workflow."
              copy="Plan upcoming runs, review employee details, and keep generated records connected to the right company."
              bullets={["Guided payroll preparation", "Documents generated in context"]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
