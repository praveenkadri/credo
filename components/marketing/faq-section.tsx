import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

const FAQS = [
  [
    "Is Credo for one company or many?",
    "It works well for a single business and stays organized when you need to manage several entities side by side.",
  ],
  [
    "Can I manage payroll and invoices together?",
    "Yes. Payroll, invoicing, company records, and document workflows are designed to sit in one operational rhythm.",
  ],
  [
    "Does Credo replace accounting software?",
    "No. Credo is the operating layer for payroll and business workflows, not a full general ledger.",
  ],
  [
    "Can I store company documents?",
    "Yes. The workspace keeps document readiness and company records visible so teams know what is prepared and what is missing.",
  ],
  [
    "How does compliance tracking work?",
    "Credo surfaces missing signatures, readiness states, and upcoming actions so compliance work does not disappear into email.",
  ],
] as const;

type FAQSectionProps = {
  className?: string;
};

export function FAQSection({ className = "" }: FAQSectionProps) {
  return (
    <section className={`${MARKETING_SHELL.narrowContainer} ${MARKETING_SHELL.sectionSpacing} ${className}`} id="faq">
      <div className="mx-auto max-w-[760px]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">FAQ</p>
        <h2 className="mt-2 text-center text-[34px] font-extrabold leading-[0.98] tracking-[-0.045em] text-[#080807] sm:text-[44px]">
          Common questions, without the noise.
        </h2>

        <div className="mt-6 divide-y divide-[#ededed] border-y border-[#ededed]">
          {FAQS.map(([question, answer]) => (
            <div key={question} className="py-4 transition-colors duration-150 ease-out hover:bg-[#fbfbf7] motion-reduce:transition-none">
              <p className="text-[15px] font-semibold text-[#11110f]">{question}</p>
              <p className="mt-1 max-w-[70ch] text-[14px] font-medium leading-[1.36] text-[#242520]">{answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
