const FAQS = [
  "Is Credo for one company or many?",
  "Can I manage payroll and invoices together?",
  "Does Credo replace accounting software?",
  "Can I store company documents?",
  "How does compliance tracking work?",
];

export function FAQSection() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[980px] px-5 lg:px-7">
      <h2 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">FAQ</h2>

      <div className="mt-8 divide-y divide-neutral-200/70 rounded-[24px] bg-white/65 ring-1 ring-neutral-200/50">
        {FAQS.map((question) => (
          <div key={question} className="px-5 py-4">
            <p className="text-[15px] font-medium text-neutral-900">{question}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
