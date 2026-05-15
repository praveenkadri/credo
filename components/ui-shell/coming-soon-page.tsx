import Link from "next/link";
import type * as React from "react";
import { BrandIcon, EmptyStateVisual, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import { buttonClassName } from "@/components/ui-primitives/button";
import { EmptyStateHeader, PreviewModuleGrid, type PreviewModule, type ReadinessItem } from "@/components/ui-patterns/empty-preview";
import { surfaceClass } from "@/components/ui/surface";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function ComingSoonPage({
  title,
  description,
  visual = "workspace",
}: {
  title: string;
  description: string;
  visual?: "compliance" | "insights" | "workspace";
}) {
  const pageVisual = getComingSoonVisual(visual);
  const preview = getPreviewContent(visual);

  return (
    <div className="w-full pb-12">
      <section className={cn("shell-enter px-5 py-5", surfaceClass("softGlass"))}>
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(230px,0.65fr)_minmax(0,1.35fr)]">
          <div>
            <div className="flex items-start gap-3">
              <BrandIcon icon={pageVisual.icon} tone={pageVisual.tone} size="md" />
              <div>
                <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-neutral-900">{title}</h1>
                <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-neutral-600">{description}</p>
              </div>
            </div>
            <EmptyStateVisual type={pageVisual.emptyType} className="mx-0 mt-5 h-[88px] rounded-[24px] bg-white/55" />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={routes.overview} className={buttonClassName("primary")}>
                Go to overview
              </Link>
              <Link href={routes.companiesNew} className={buttonClassName("secondary")}>
                Add company
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <EmptyStateHeader
              eyebrow={preview.statusEyebrow}
              title={preview.statusTitle}
              description={preview.statusDescription}
            />
            <PreviewModuleGrid items={preview.modules} />
            <div className="border-t border-black/[0.06] pt-4">
              <p className="type-caption text-neutral-400">Recommended first action</p>
              <p className="type-body-small mt-1 text-neutral-600">
                {preview.readiness[0]?.label}. {preview.readiness[0]?.detail}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function getComingSoonVisual(visual: "compliance" | "insights" | "workspace"): {
  icon: BrandIconName;
  tone: BrandTone;
  emptyType: React.ComponentProps<typeof EmptyStateVisual>["type"];
} {
  if (visual === "compliance") return { icon: "compliance", tone: "olive", emptyType: "compliance" };
  if (visual === "insights") return { icon: "insight", tone: "olive", emptyType: "insights" };
  return { icon: "team", tone: "lavender", emptyType: "team" };
}

function getPreviewContent(visual: "compliance" | "insights" | "workspace"): {
  statusEyebrow: string;
  statusTitle: string;
  statusDescription: string;
  modules: PreviewModule[];
  readiness: ReadinessItem[];
} {
  if (visual === "insights") {
    return {
      statusEyebrow: "Preview",
      statusTitle: "Insights will fill in after operating data exists",
      statusDescription:
        "This page explains trends across payroll, documents, companies, and team activity. It is empty because there are not enough completed runs or records to summarize yet.",
      modules: [
        {
          title: "Payroll trend",
          description: "Gross payroll, employee count, and run cadence by period.",
          icon: "payroll",
          tone: "olive",
          meta: "After payroll",
        },
        {
          title: "Document flow",
          description: "Generated files, missing records, and document readiness by company.",
          icon: "document",
          tone: "olive",
          meta: "After documents",
        },
        {
          title: "Company health",
          description: "Setup completion, recent activity, and operational attention signals.",
          icon: "building",
          tone: "olive",
          meta: "After setup",
        },
        {
          title: "Team coverage",
          description: "Eligibility, active employees, and payroll profile completeness.",
          icon: "team",
          tone: "olive",
          meta: "After employees",
        },
      ],
      readiness: [
        {
          label: "Set up a company",
          detail: "Insights need at least one company workspace as the reporting anchor.",
          status: "First",
          href: routes.companiesNew,
        },
        {
          label: "Run payroll and generate records",
          detail: "Completed runs and documents create the first meaningful trend lines.",
          status: "Next",
          href: routes.runPayroll,
        },
      ],
    };
  }

  if (visual === "compliance") {
    return {
      statusEyebrow: "Readiness",
      statusTitle: "Compliance modules are waiting on setup data",
      statusDescription:
        "This page monitors filing readiness, approvals, and required document workflows. It is empty because company details, employees, and payroll records are not complete enough to assess yet.",
      modules: [
        {
          title: "Company registration",
          description: "Business identity, addresses, tax numbers, and authorization status.",
          icon: "building",
          tone: "olive",
          meta: "Foundation",
        },
        {
          title: "Payroll filings",
          description: "Remittance, pay period, and generated payroll document readiness.",
          icon: "tax",
          tone: "olive",
          meta: "Payroll",
        },
        {
          title: "Employee records",
          description: "Tax identity, eligibility, and missing employee document checks.",
          icon: "person",
          tone: "olive",
          meta: "Team",
        },
        {
          title: "Approvals",
          description: "Review tasks and filing packets will appear when workflows exist.",
          icon: "approve",
          tone: "olive",
          meta: "Review",
        },
      ],
      readiness: [
        {
          label: "Complete company profile",
          detail: "Tax, address, fiscal, and authorization fields power filing checks.",
          status: "First",
          href: routes.companiesNew,
        },
        {
          label: "Add employees and payroll runs",
          detail: "Compliance readiness becomes useful once employee and payroll records exist.",
          status: "Next",
          href: routes.employeesNew,
        },
      ],
    };
  }

  return {
    statusEyebrow: "Setup",
    statusTitle: "Workspace modules appear after setup",
    statusDescription:
      "Add a company and employee records to begin filling this workspace with operational activity.",
    modules: [
      {
        title: "Company setup",
        description: "Business identity and payroll configuration.",
        icon: "building",
        tone: "olive",
      },
      {
        title: "Team records",
        description: "Employees, compensation, and payroll readiness.",
        icon: "team",
        tone: "olive",
      },
    ],
    readiness: [
      {
        label: "Add company",
        detail: "Create the first workspace anchor.",
        status: "First",
        href: routes.companiesNew,
      },
    ],
  };
}
