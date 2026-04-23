"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroGraph } from "@/components/ui-patterns/hero-graph";
import { ListRow } from "@/components/ui-patterns/list-row";
import { StatBlock } from "@/components/ui-patterns/stat-block";
import { SurfacePanel } from "@/components/ui-patterns/surface-panel";
import {
  COMPANIES,
  OPERATIONAL_EVENTS,
  getAttentionBannerText,
  getChartInterpretation,
  getOperatingSummary,
} from "@/lib/overview-decision-data";

const STATE_TONE: Record<string, string> = {
  Healthy: "text-[#5f685d]",
  "Needs review": "text-neutral-700",
  "Funding due": "text-[#6a6252]",
  "Invoice backlog": "text-[#5f6557]",
  "Filing soon": "text-[#5d6456]",
};

type BannerVariant = "neutral" | "attention" | "critical";

const BANNER_STYLES: Record<BannerVariant, string> = {
  neutral: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
  attention: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
  critical: "border border-red-100/70 bg-red-50/60 text-neutral-700",
};

function AttentionBanner({
  variant = "attention",
  onDismiss,
}: {
  variant?: BannerVariant;
  onDismiss: () => void;
}) {
  return (
    <div
      className={[
        "mb-3 flex w-full items-center justify-between rounded-lg px-3.5 py-2.5",
        BANNER_STYLES[variant],
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <p className="text-[12px] font-medium tracking-[-0.005em]">{getAttentionBannerText()}</p>
      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-150 hover:bg-white/45 hover:text-neutral-700"
        >
          View
        </button>
        <button
          type="button"
          aria-label="Dismiss attention banner"
          onClick={onDismiss}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-neutral-500 transition-colors duration-150 hover:bg-white/45 hover:text-neutral-700"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function OperationalPulse() {
  return (
    <SurfacePanel
      title="Operational pulse"
      eyebrow="Interpreted signals"
      tone="soft"
      compact
      className="mt-6 shell-enter shell-enter-delay-3"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatBlock
          quiet
          label="Payroll flow"
          value="3 runs progressing normally"
          helper="No intervention needed."
        />
        <StatBlock
          quiet
          label="Invoice pressure"
          value="Backlog forming in 1 company"
          helper="12 invoices older than five days."
        />
        <StatBlock
          quiet
          label="Compliance readiness"
          value="2 filings inside seven-day window"
          helper="1 packet pending review."
        />
      </div>
    </SurfacePanel>
  );
}

function SurfaceList() {
  return (
    <div className="space-y-1">
      {OPERATIONAL_EVENTS.map((event) => (
        <ListRow
          key={event.id}
          as="div"
          title={event.title}
          className="px-2 py-2.5"
          marker={<span className="h-1.5 w-1.5 rounded-full bg-[#93988f]/75" />}
        />
      ))}
    </div>
  );
}

function CompaniesSection() {
  const router = useRouter();
  const AVATAR_TONES = ["bg-neutral-50/60", "bg-neutral-50/55", "bg-neutral-50/50"];

  const initialsFor = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

  return (
    <section className="mt-4 shell-enter shell-enter-delay-2">
      <div className="-mx-3 mb-3 grid items-end gap-3 px-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-neutral-400">Companies</p>
          <h2 className="mt-1 text-[13px] font-medium tracking-[-0.01em] text-neutral-700">Your companies</h2>
        </div>
        <Link
          href="/companies/new"
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-[#5f645c] transition-colors duration-150 hover:bg-[#f7f8f4] hover:text-[#1f221c] md:mr-7 md:justify-self-end"
        >
          Add company
        </Link>
      </div>

      <div className="space-y-2">
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
            className="group relative grid cursor-pointer gap-y-4 rounded-2xl bg-white/38 px-3 py-6 backdrop-blur-sm ring-1 ring-white/35 shadow-[0_1px_1px_rgba(15,23,42,0.02),0_8px_24px_rgba(15,23,42,0.03)] transition-all duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.16),rgba(255,255,255,0.02))] hover:-translate-y-[1px] hover:bg-white/48 hover:shadow-[0_4px_18px_rgba(15,23,42,0.05)] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(31,34,28,0.08)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-center md:gap-x-6 md:gap-y-0"
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
                <p className="mt-1 text-[12px] leading-[1.35] text-neutral-500">
                  <span className={["font-medium", STATE_TONE[company.state]].join(" ")}>{company.state}</span>
                  <span className="text-neutral-400"> · </span>
                  <span>{company.stateDetail}</span>
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
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="w-full pb-12">
      {!bannerDismissed ? (
        <AttentionBanner variant="attention" onDismiss={() => setBannerDismissed(true)} />
      ) : null}

      <div className="mb-4 cursor-default">
        <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#93988f]">Overview</p>
        <h1 className="mt-px text-[40px] font-semibold tracking-[-0.043em] text-[#1f221c]">
          Credo workspace
        </h1>
        <p className="mt-1 max-w-3xl text-[15px] leading-[1.68] text-[#6e736b]">
          {getOperatingSummary()}
        </p>
      </div>

      <section className="pb-10">
        <HeroGraph
          title="Cash movement"
          valueLabel="Portfolio value"
          currentValue="$18,403.77"
          deltaText="+$191.50 past day"
          deltaPositive
          activeRange="1D"
          mode="Value"
          interpretation={getChartInterpretation()}
          className="mt-4 shell-enter shell-enter-delay-2"
        />

        <CompaniesSection />

        <OperationalPulse />

        <SurfacePanel
          title="Activity"
          eyebrow="Important events"
          compact
          tone="soft"
          className="mt-6 shell-enter shell-enter-delay-4"
        >
          <SurfaceList />
        </SurfacePanel>
      </section>
    </div>
  );
}
