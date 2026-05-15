import Link from "next/link";
import { BrandIcon, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import { WorkflowsHelpPanel } from "@/components/workflows/workflows-help-panel";
import { cn } from "@/lib/utils";

type WorkflowAction = {
  title: string;
  description: string;
  href?: string;
  icon: BrandIconName;
  tone?: BrandTone;
  badge?: string;
  emphasis?: "recommended" | "setup";
  actionTone?: "core" | "subtle" | "maintenance";
  status?: string;
  lockedReason?: string;
};

type WorkflowSection = {
  title: string;
  actions: WorkflowAction[];
};

export function WorkflowsPage({ sections }: { sections: WorkflowSection[] }) {
  return (
    <div className="w-full pb-12">
      <section className="shell-enter">
        <div className="max-w-3xl">
          <h1 className="text-[32px] font-[650] leading-[1.08] tracking-[-0.025em] text-[var(--credo-ink)] md:text-[38px]">
            What would you like to do?
          </h1>
          <p className="mt-3 max-w-[720px] text-[14.5px] font-normal leading-[1.5] text-[var(--credo-muted)]">
            Start common company, employee, payroll, and document tasks from one place.
          </p>
        </div>
      </section>

      <div className="mt-7 space-y-7">
        {sections.map((section) => (
          <WorkflowSectionView key={section.title} section={section} />
        ))}
      </div>

      <WorkflowsHelpPanel className="mt-8 xl:hidden" />
    </div>
  );
}

function WorkflowSectionView({ section }: { section: WorkflowSection }) {
  if (!section.actions.length) {
    return null;
  }

  return (
    <section className="shell-enter shell-enter-delay-1">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[21px] font-[650] leading-[1.18] text-[var(--credo-ink)]">{section.title}</h2>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {section.actions.map((action) => (
          <WorkflowActionCard key={`${section.title}-${action.title}`} action={action} />
        ))}
      </div>
    </section>
  );
}

function WorkflowActionCard({ action }: { action: WorkflowAction }) {
  const isRecommended = action.emphasis === "recommended";
  const isSetup = action.emphasis === "setup";
  const isDisabled = !action.href;
  const isCoreAction = action.actionTone === "core";
  const isMaintenance = action.actionTone === "maintenance";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <BrandIcon
            icon={action.icon}
            tone={action.tone ?? "sand"}
            size="sm"
            className={cn(
              "size-[34px] [&_svg]:size-4",
              action.href && !isSetup && !isMaintenance
                ? "bg-[var(--credo-surface)] text-[var(--credo-green-800)] ring-[rgba(225,218,207,0.9)]"
                : "",
              isCoreAction ? "bg-[var(--credo-icon-wash)] text-[var(--credo-green-800)] ring-[rgba(91,77,58,0.18)]" : "",
              isRecommended
                ? "bg-[var(--credo-icon-wash)] text-[var(--credo-green-800)] ring-[rgba(91,77,58,0.2)]"
                : "",
              isSetup ? "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-[rgba(184,135,79,0.16)]" : "",
              isMaintenance ? "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-[rgba(184,135,79,0.14)]" : "",
              isDisabled ? "bg-[rgba(232,226,216,0.52)] text-[rgba(111,116,109,0.72)] ring-[rgba(225,218,207,0.64)]" : ""
            )}
          />
          {action.badge ? (
            <span
              className={cn(
                "mt-0.5 inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold leading-none",
                isRecommended
                  ? "bg-[var(--credo-icon-wash)] text-[var(--credo-green-800)] ring-1 ring-[rgba(91,77,58,0.18)]"
                  : "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-1 ring-[rgba(184,135,79,0.16)]"
              )}
            >
              {action.badge}
            </span>
          ) : null}
        </div>
        {action.href ? (
          <span
            className="mt-1 inline-flex size-7 items-center justify-center rounded-full bg-[var(--credo-green-800)] text-[13px] leading-none text-white transition-[background-color,transform] duration-[160ms] group-hover:translate-x-0.5 group-hover:bg-[var(--credo-green-950)]"
            aria-hidden="true"
          >
            →
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-[16.5px] font-semibold leading-[1.25] text-[var(--credo-ink)]">{action.title}</h3>
      <p className="mt-2 text-[13px] font-normal leading-[1.45] text-[var(--credo-muted)]">{action.description}</p>
      {action.status || action.lockedReason ? (
        <p className="mt-4 text-[12px] font-medium leading-[1.35] text-[var(--credo-muted)]">
          {action.lockedReason ?? action.status}
        </p>
      ) : null}
    </>
  );

  const className = cn(
    "group relative min-h-[146px] overflow-hidden rounded-[22px] bg-[var(--credo-surface-warm)] p-[18px] text-left ring-1 ring-[var(--credo-border)] transition-[background-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
    action.href
      ? "block hover:bg-[var(--credo-bronze-pale)] hover:ring-[#D8CBB9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(21,90,67,0.26)]"
      : "cursor-default opacity-70",
    isSetup ? "hover:bg-[var(--credo-bronze-pale)] hover:ring-[rgba(184,135,79,0.22)]" : ""
  );

  if (!action.href) {
    return (
      <article className={className} aria-disabled="true">
        {content}
      </article>
    );
  }

  return (
    <Link href={action.href} className={className}>
      {content}
    </Link>
  );
}
