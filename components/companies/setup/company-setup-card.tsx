export function CompanySetupCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-[28px] bg-[#fafaf7] p-7 shadow-[0_1px_1px_rgba(31,34,28,0.02)] md:p-8">
      {children}
    </section>
  );
}
