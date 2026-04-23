"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeroGraph } from "@/components/ui-patterns/hero-graph";
import {
  COMPANIES,
  getAttentionBannerText,
  getChartInterpretation,
} from "@/lib/overview-decision-data";

const STATE_TONE: Record<string, string> = {
  Healthy: "text-[#5f685d]",
  "Needs review": "text-[#5f6457]",
  "Funding due": "text-[#6a6252]",
  "Invoice backlog": "text-[#615f57]",
  "Filing soon": "text-[#5d6456]",
};

const STATE_PILL_TONE: Record<string, string> = {
  Healthy: "bg-white/75 text-[#5f685d] ring-white/70",
  "Needs review": "bg-white/80 text-[#5f6457] ring-white/75",
  "Funding due": "bg-white/80 text-[#6a6252] ring-white/75",
  "Invoice backlog": "bg-white/75 text-[#615f57] ring-white/70",
  "Filing soon": "bg-white/75 text-[#5d6456] ring-white/70",
};

type BannerVariant = "neutral" | "attention" | "critical";
const BANNER_STYLES: Record<BannerVariant, string> = {
  neutral: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
  attention: "border border-neutral-200/60 bg-neutral-100/70 text-neutral-700",
  critical: "border border-red-100/70 bg-red-50/60 text-neutral-700",
};

function AttentionBanner({
  variant = "attention",
  exiting = false,
  onDismiss,
}: {
  variant?: BannerVariant;
  exiting?: boolean;
  onDismiss: () => void;
}) {
  return (
    <div
      className={[
        "banner-enter flex w-full items-center justify-between overflow-hidden rounded-lg px-3.5 py-2.5 transition-[opacity,transform,max-height,margin] duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)]",
        exiting ? "mb-0 max-h-0 -translate-y-1 opacity-0 py-0" : "mb-3 max-h-14 translate-y-0 opacity-100",
        BANNER_STYLES[variant],
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <p className="text-[12px] font-medium tracking-[-0.005em]">{getAttentionBannerText()}</p>
      <div className="ml-4 flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-7 items-center rounded-md px-2 text-[11px] font-medium text-neutral-600 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-800"
        >
          View
        </button>
        <button
          type="button"
          aria-label="Dismiss attention banner"
          onClick={onDismiss}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[13px] text-neutral-500 transition-colors duration-[120ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/55 hover:text-neutral-700"
        >
          ×
        </button>
      </div>
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

      <div className="space-y-4">
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
            className="group relative grid cursor-pointer gap-y-4 rounded-[24px] bg-white/70 px-6 py-5 ring-1 ring-white/60 shadow-[0_8px_30px_rgba(15,23,42,0.035)] transition-all duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.03))] hover:-translate-y-[1px] hover:bg-white/85 hover:shadow-[0_12px_34px_rgba(15,23,42,0.055)] active:translate-y-0 active:scale-[0.998] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(31,34,28,0.08)] md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)] md:items-center md:gap-x-6 md:gap-y-0 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
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
                <div className="flex items-center gap-2">
                  <p className="truncate text-[16px] font-semibold leading-5 tracking-[-0.015em] text-[#242721] transition-colors duration-200 group-hover:text-neutral-900">
                    {company.name}
                  </p>
                  <span
                    className={[
                      "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium ring-1",
                      STATE_PILL_TONE[company.state],
                    ].join(" ")}
                  >
                    {company.state}
                  </span>
                </div>
                <p className="mt-1 truncate text-[13px] leading-[1.35] text-[#6e736b] transition-colors duration-200 group-hover:text-neutral-600">
                  {company.stateDetail}
                  <span className="mx-1 text-neutral-400">·</span>
                  <span className={STATE_TONE[company.state]}>{company.lastActivity}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 md:justify-self-end">
              <div className="text-right leading-tight">
                <p className="text-[24px] font-semibold leading-6 tracking-[-0.02em] text-[#1f221c]">{company.payrollAmount}</p>
                <p className="mt-1 text-[12px] text-neutral-500">{company.employeeCount} employees</p>
              </div>
              <span className="text-[18px] leading-none text-neutral-300 transition-transform duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] group-hover:translate-x-[2px] group-hover:text-neutral-400">
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
  const [bannerExiting, setBannerExiting] = useState(false);

  useEffect(() => {
    if (!bannerExiting) return;
    const timer = setTimeout(() => {
      setBannerDismissed(true);
      setBannerExiting(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [bannerExiting]);

  const dismissBanner = () => {
    setBannerExiting(true);
  };

  return (
    <div className="w-full pb-12">
      {!bannerDismissed ? (
        <AttentionBanner variant="attention" exiting={bannerExiting} onDismiss={dismissBanner} />
      ) : null}

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
          className="shell-enter shell-enter-delay-2"
        />

        <CompaniesSection />
      </section>
    </div>
  );
}
