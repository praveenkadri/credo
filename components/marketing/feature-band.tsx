import { MARKETING_SHELL } from "@/components/marketing/marketing-layout";

type StatusRow = {
  name: string;
  detail: string;
  state: string;
  tone: string;
};

type WorkflowStep = {
  label: string;
  detail: string;
  state: string;
  tone: string;
};

type FeatureBandProps = {
  id?: string;
  className?: string;
  eyebrow: string;
  title: string;
  description: string;
  supportingLines: string[];
  variant: "company-context" | "workflow";
  statusRows?: StatusRow[];
  workflowSteps?: WorkflowStep[];
};

export function FeatureBand({
  id,
  className = "",
  eyebrow,
  title,
  description,
  supportingLines,
  variant,
  statusRows,
  workflowSteps,
}: FeatureBandProps) {
  return (
    <section id={id} className={`${MARKETING_SHELL.container} ${MARKETING_SHELL.sectionSpacing} ${className}`}>
      <div className="grid gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="max-w-[500px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">{eyebrow}</p>
          <h2 className="mt-3 text-[35px] font-semibold leading-[1.08] tracking-[-0.04em] text-neutral-950 sm:text-[46px]">
            {title}
          </h2>
          <p className="mt-4 max-w-[560px] text-[17px] leading-[1.55] text-neutral-600">{description}</p>
          <div className="mt-6 divide-y divide-black/[0.08]">
            {supportingLines.map((line) => (
              <p key={line} className="py-3 text-[14px] leading-[1.65] text-neutral-700">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          {variant === "company-context" && statusRows ? (
            <div className="overflow-hidden rounded-[30px] bg-[#fbfbf8] ring-1 ring-black/[0.05] shadow-[0_1px_2px_rgba(31,34,28,0.03)]">
              <div className="flex items-center justify-between border-b border-black/[0.07] px-5 py-4 sm:px-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Workspace context</p>
                  <p className="mt-1 text-[14px] font-medium text-neutral-900">Company switcher and live readiness</p>
                </div>
                <span className="rounded-full bg-[var(--brand-primary-soft)] px-3 py-1 text-[11px] font-medium text-[var(--brand-primary)] ring-1 ring-[var(--brand-primary-border)]">3 active entities</span>
              </div>

              <div className="border-b border-black/[0.07] bg-[#f4f5f0] px-5 py-3 sm:px-6">
                <div className="flex flex-wrap gap-2">
                  {statusRows.map((row, index) => (
                    <span
                      key={row.name}
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${index === 0 ? "bg-white text-neutral-900 ring-1 ring-black/[0.06]" : "bg-transparent text-neutral-500"}`}
                    >
                      {row.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3">
                <div className="space-y-2">
                  {statusRows.map((row) => (
                    <article key={row.name} className="rounded-[22px] bg-white/8 px-4 py-4 ring-1 ring-black/[0.035]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[14px] font-medium text-neutral-900">{row.name}</p>
                          <p className="mt-1 text-[12px] text-neutral-600">{row.detail}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${row.tone}`}>{row.state}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {variant === "workflow" && workflowSteps ? (
            <div className="overflow-hidden rounded-[30px] bg-[#fbfbf8] ring-1 ring-black/[0.05] shadow-[0_1px_2px_rgba(31,34,28,0.03)]">
              <div className="border-b border-black/[0.07] px-5 py-4 sm:px-6">
                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">Workflow run</p>
                <p className="mt-1 text-[14px] font-medium text-neutral-900">From review to send without leaving the workspace</p>
              </div>

              <div className="grid gap-3 p-3 lg:grid-cols-[170px_minmax(0,1fr)]">
                <div className="rounded-[22px] bg-[var(--brand-primary-soft)] p-3">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">Queue</p>
                  <div className="mt-3 space-y-2">
                    {workflowSteps.map((step, index) => (
                      <div key={step.label} className={`rounded-[16px] px-3 py-2 ${index === 0 ? "bg-white ring-1 ring-black/[0.05]" : "bg-white/55"}`}>
                        <p className="text-[12px] font-medium text-neutral-900">{step.label}</p>
                        <p className="mt-0.5 text-[11px] text-neutral-600">{step.state}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {workflowSteps.map((step) => (
                    <article key={step.label} className="rounded-[22px] px-4 py-4 ring-1 ring-black/[0.035]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-neutral-500">{step.label}</p>
                          <p className="mt-2 text-[14px] text-neutral-800">{step.detail}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${step.tone}`}>{step.state}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
