import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

type EditorialWordStackProps = {
  className?: string;
};

export function EditorialWordStack({ className = "" }: EditorialWordStackProps) {
  const modules = [
    {
      title: "Payroll",
      body: "Funding, approvals, and readiness stay visible in the same operating flow.",
      tone: "bg-[var(--brand-primary-soft)]",
    },
    {
      title: "Invoices",
      body: "Billing moves beside the rest of the work instead of breaking into a separate tool chain.",
      tone: "bg-[#f7f7f7]",
    },
    {
      title: "Documents",
      body: "Letters, summaries, and packets draw from the same current company context.",
      tone: "bg-[#f3f4f4]",
    },
    {
      title: "Compliance",
      body: "Readiness, signatures, and missing pieces stay attached to the work they belong to.",
      tone: "bg-[#f4efe6]",
    },
  ];

  return (
    <section className={`${MARKETING_SHELL.container} ${MARKETING_SHELL.sectionSpacing} ${className}`} id="product">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
        <div className="max-w-[470px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">Product surface</p>
          <h2 className="mt-3 text-[38px] font-semibold leading-[1.02] tracking-[-0.045em] text-neutral-950 sm:text-[50px]">
            One operating surface for work that usually gets split apart.
          </h2>
          <p className="mt-5 max-w-[42ch] text-[18px] leading-[1.62] text-neutral-600">
            Payroll, company records, employee details, and documents are presented as connected parts of the same
            working environment, so teams keep context as they move across the day.
          </p>
        </div>

        <div className="overflow-hidden rounded-[30px] bg-[#fbfbf8] ring-1 ring-black/[0.045] shadow-[0_1px_2px_rgba(31,34,28,0.03)]">
          <div className="border-b border-black/[0.07] px-5 py-4 sm:px-6">
            <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Connected workflows</p>
            <p className="mt-1 text-[14px] font-medium text-neutral-900">Shared data, shared status, shared next actions</p>
          </div>

          <div className="p-2 sm:p-3">
            {modules.map((module, index) => (
              <article
                key={module.title}
                className={`${module.tone} ${index === 0 ? "rounded-t-[22px]" : ""} ${index === modules.length - 1 ? "rounded-b-[22px]" : ""} relative grid gap-3 px-4 py-4 sm:grid-cols-[132px_minmax(0,1fr)] sm:items-center sm:px-5`}
              >
                {index < modules.length - 1 ? <div className="absolute inset-x-4 bottom-0 h-px bg-black/[0.06] sm:inset-x-5" /> : null}
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-neutral-500">{module.title}</p>
                <p className="max-w-[42ch] text-[15px] leading-[1.65] text-neutral-700">{module.body}</p>
              </article>
            ))}
          </div>

          <div className="border-t border-black/[0.07] bg-white/55 px-5 py-4 sm:px-6">
            <article
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <p className="text-[13px] text-neutral-600">The system keeps every workflow in the same visual language and operating rhythm.</p>
              <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-500">One workspace</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
