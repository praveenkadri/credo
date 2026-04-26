export function EditorialWordStack() {
  const words = ["Payroll", "Invoices", "Documents", "Compliance", "Companies"];

  return (
    <section className="mx-auto mt-24 w-full max-w-[980px] px-5 text-center lg:px-7" id="product">
      <div className="space-y-2">
        {words.map((word) => (
          <p key={word} className="text-[44px] font-medium leading-[1.03] tracking-[-0.035em] text-neutral-900 sm:text-[64px]">
            {word}
          </p>
        ))}
      </div>
    </section>
  );
}
