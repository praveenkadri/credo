export function CompanySetupCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[28px] bg-white/70 p-7 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:p-8">
      {children}
    </section>
  );
}
