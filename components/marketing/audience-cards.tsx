const AUDIENCES = [
  "Service businesses",
  "Healthcare clinics",
  "Contractors",
  "Retail operators",
  "Consultants",
];

export function AudienceCards() {
  return (
    <section className="mx-auto mt-24 w-full max-w-[1180px] px-5 lg:px-7">
      <h2 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">
        Made for businesses that need clarity.
      </h2>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {AUDIENCES.map((audience) => (
          <article key={audience} className="rounded-2xl bg-white/65 p-4 ring-1 ring-neutral-200/50">
            <p className="text-[14px] font-medium text-neutral-900">{audience}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
