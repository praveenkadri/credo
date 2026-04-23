"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroGraph } from "@/components/ui-patterns/hero-graph";
import { ListRow } from "@/components/ui-patterns/list-row";
import { StatBlock } from "@/components/ui-patterns/stat-block";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";

const COMPANIES = [
  {
    id: "aster-health-group",
    name: "Aster Health Group",
    lastActivity: "Payroll run prepared 2h ago",
    payrollAmount: "$128,430.00",
    employeeCount: 94,
  },
  {
    id: "northline-services",
    name: "Northline Services",
    lastActivity: "Draft approved yesterday",
    payrollAmount: "$84,920.00",
    employeeCount: 61,
  },
  {
    id: "summit-industrial",
    name: "Summit Industrial",
    lastActivity: "Timesheets locked today",
    payrollAmount: "$214,580.00",
    employeeCount: 143,
  },
  {
    id: "willow-hospitality",
    name: "Willow Hospitality",
    lastActivity: "Funding reminder sent 1d ago",
    payrollAmount: "$71,240.00",
    employeeCount: 48,
  },
  {
    id: "harbor-retail-partners",
    name: "Harbor Retail Partners",
    lastActivity: "New hire synced 3d ago",
    payrollAmount: "$167,390.00",
    employeeCount: 119,
  },
];

const ACTIVITY_ROWS = [
  "Payroll run created for Aster Health Group",
  "Invoice batch approved for Northline Services",
  "Document package exported for Summit Industrial",
  "Quarterly report generated for Willow Hospitality",
  "Funding reminder sent for Harbor Retail Partners",
];

function OperationalPulse() {
  return (
    <SurfacePanel
      title="Operational pulse"
      eyebrow="Summary"
      tone="soft"
      compact
      className="mt-5 shell-enter shell-enter-delay-2"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatBlock
          quiet
          label="Payroll runs in progress"
          value="3"
          helper="Runs currently progressing through review."
        />
        <StatBlock
          quiet
          label="Invoices pending send"
          value="18"
          helper="Invoices queued for release in this cycle."
        />
        <StatBlock
          quiet
          label="Documents generated this week"
          value="9"
          helper="Document output remains above the previous week."
          badgeText="+12%"
        />
      </div>
    </SurfacePanel>
  );
}

function SurfaceList({ items }: { items: string[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <ListRow
          key={item}
          as="div"
          title={item}
          className="px-2 py-2.5"
          marker={<span className="h-1.5 w-1.5 rounded-full bg-[#93988f]/75" />}
        />
      ))}
    </div>
  );
}

function CompaniesSection() {
  const router = useRouter();
  const AVATAR_TONES = ["bg-neutral-100", "bg-neutral-100/85", "bg-neutral-100/70"];

  const initialsFor = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <section className="mt-6 shell-enter shell-enter-delay-2">
      <div className="-mx-3 mb-3 flex items-end justify-between gap-3 px-3">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">Companies</p>
          <h2 className="mt-1 text-[18px] font-medium tracking-[-0.02em] text-neutral-700">Your companies</h2>
        </div>
        <Link
          href="/companies/new"
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-[#5f645c] transition-colors duration-150 hover:bg-[#f7f8f4] hover:text-[#1f221c] md:mr-7"
        >
          Add company
        </Link>
      </div>

      <div className="divide-y divide-[#e8ece3]">
        {COMPANIES.map((company, index) => (
          <div
            key={company.id}
            role="link"
            tabIndex={0}
            onClick={() => router.push(`/companies/${company.id}`)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                router.push(`/companies/${company.id}`);
              }
            }}
            className="group -mx-3 grid cursor-pointer gap-y-4 rounded-xl px-3 py-6 transition-all duration-200 ease-out hover:translate-x-[1px] hover:bg-neutral-50/60 hover:shadow-[0_1px_0_rgba(0,0,0,0.02)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(31,34,28,0.08)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-center md:gap-x-6 md:gap-y-0"
          >
            <div className="flex min-w-0 items-start gap-3.5">
              <span
                className={[
                  "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-medium tracking-[0.02em] text-neutral-600 ring-1 ring-neutral-200/60",
                  AVATAR_TONES[index % AVATAR_TONES.length],
                ].join(" ")}
              >
                {initialsFor(company.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium leading-5 tracking-[-0.01em] text-[#242721] transition-colors duration-200 group-hover:text-neutral-900">
                  {company.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] leading-[1.3] text-[#6e736b] transition-colors duration-200 group-hover:text-neutral-600">
                  {company.lastActivity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 md:justify-self-end">
              <div className="text-right leading-tight">
                <p className="text-[16px] font-[600] leading-5 tracking-tight text-[#1f221c]">{company.payrollAmount}</p>
                <p className="text-[12px] text-neutral-500">{company.employeeCount} employees</p>
              </div>
              <span className="text-[18px] leading-none text-neutral-300 transition duration-200 group-hover:translate-x-1 group-hover:text-neutral-500">
                ›
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="w-full pb-20">
      <div className="mb-4 cursor-default">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#93988f]">Overview</p>
        <h1 className="mt-px text-[40px] font-semibold tracking-[-0.043em] text-[#1f221c]">
          Credo workspace
        </h1>
        <p className="mt-1 max-w-3xl text-[15px] leading-[1.68] text-[#6e736b]">
          Multi-company payroll and invoicing operations in one calm surface. Move
          between Companies, Activity, Payroll, Invoices, Documents, Reports, and
          Settings from the navigation rail.
        </p>
      </div>

      <section className="pb-10">
        <HeroGraph
          title="Cash movement"
          valueLabel="Portfolio value"
          currentValue="$18,403.77"
          deltaText="+$191.50 past day →"
          deltaPositive
          activeRange="1D"
          mode="Value"
          className="shell-enter shell-enter-delay-1"
        />

        <CompaniesSection />

        <OperationalPulse />

        <SurfacePanel
          title="Activity"
          eyebrow="Timeline"
          compact
          tone="soft"
          className="mt-6 shell-enter shell-enter-delay-4"
        >
          <SurfaceList items={ACTIVITY_ROWS} />
        </SurfacePanel>
      </section>
    </div>
  );
}
