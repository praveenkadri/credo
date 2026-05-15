"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/brand/brand-visuals";
import { type DirectDepositField } from "@/components/company-detail/company-detail-data";
import {
  getCompanyByIdForToken,
  getCompanyProfileForToken,
  getCompanyWorkspaceSummaryForToken,
  hasCompletePayrollDetails,
  type CompanyProfile,
  type CompanyWorkspaceSummary,
} from "@/lib/data/companies";
import { routes } from "@/lib/routes";
import { supabase } from "@/lib/supabase/client";

type CompanyBankingInfo = {
  institutionNumber: string;
  bankName: string;
  transitNumber: string;
  accountNumber: string;
};

function maskIdentifier(value: string) {
  const normalized = value.trim();
  if (!normalized) return "Not added";

  const visibleChars = normalized.replace(/\s/g, "").length <= 6 ? 2 : 4;
  let remainingVisible = visibleChars;

  return Array.from(normalized)
    .reverse()
    .map((char) => {
      if (/\s/.test(char) || char === "-") return char;
      if (remainingVisible > 0) {
        remainingVisible -= 1;
        return char;
      }
      return "*";
    })
    .reverse()
    .join("");
}

function directDepositFieldsForProfile(profile: CompanyProfile | null): DirectDepositField[] {
  return [
    { id: "bin", label: "BIN number", value: profile?.binNumber ?? "", displayValue: maskIdentifier(profile?.binNumber ?? "") },
    {
      id: "payroll",
      label: "Payroll number",
      value: profile?.payrollNumber ?? "",
      displayValue: maskIdentifier(profile?.payrollNumber ?? ""),
    },
    { id: "hst", label: "HST number", value: profile?.hstNumber ?? "", displayValue: maskIdentifier(profile?.hstNumber ?? "") },
  ];
}

function bankingInfoForProfile(profile: CompanyProfile | null): CompanyBankingInfo {
  const source = (profile ?? {}) as Partial<Record<string, unknown>>;
  const institutionNumber = readProfileString(source, "institutionNumber", "institution_number", "bankInstitutionNumber");
  const transitNumber = readProfileString(source, "transitNumber", "transit_number", "bankTransitNumber");
  const accountNumber = readProfileString(source, "accountNumber", "account_number", "bankAccountNumber");
  const explicitBankName = readProfileString(source, "bankName", "bank_name");

  return {
    institutionNumber,
    bankName: institutionNumber ? explicitBankName || resolveCanadianBankName(institutionNumber) : "",
    transitNumber,
    accountNumber,
  };
}

function readProfileString(source: Partial<Record<string, unknown>>, ...keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function resolveCanadianBankName(institutionNumber: string) {
  const normalized = institutionNumber.replace(/\D/g, "").padStart(3, "0").slice(-3);
  const names: Record<string, string> = {
    "001": "Bank of Montreal",
    "002": "The Bank of Nova Scotia",
    "003": "Royal Bank of Canada",
    "004": "The Toronto-Dominion Bank",
    "006": "National Bank of Canada",
    "010": "Canadian Imperial Bank of Commerce",
    "016": "HSBC Bank Canada / RBC transition",
    "030": "Canadian Western Bank",
    "039": "Laurentian Bank of Canada",
    "219": "ATB Financial",
    "260": "Citibank Canada",
    "269": "Simplii Financial",
    "540": "Manulife Bank of Canada",
    "614": "Tangerine Bank",
    "621": "KOHO Financial",
    "809": "Central 1 Credit Union",
    "815": "Federation des caisses Desjardins du Quebec",
    "828": "Wealthsimple Payments",
  };

  return names[normalized] ?? "Unknown bank";
}

export function CompanyRightRail({
  companyId,
  directDepositFields,
  bankingInfo,
  payrollDetailsComplete,
  workspaceSummary,
  showFundingDueCard = false,
}: {
  companyId: string;
  directDepositFields: DirectDepositField[];
  bankingInfo: CompanyBankingInfo;
  payrollDetailsComplete: boolean;
  workspaceSummary: CompanyWorkspaceSummary;
  showFundingDueCard?: boolean;
}) {
  const guidance = getPayrollGuidance({ companyId, payrollDetailsComplete, workspaceSummary });
  const bankingSlides = useMemo(
    () => [
      {
        title: "Direct deposit / BIN",
        description: "Payroll identifiers used for company deposits and reporting.",
        icon: "document" as const,
        fields: [
          { label: "BIN number", value: directDepositFields.find((field) => field.id === "bin")?.displayValue ?? "Not added" },
          { label: "Payroll number", value: directDepositFields.find((field) => field.id === "payroll")?.displayValue ?? "Not added" },
          { label: "HST number", value: directDepositFields.find((field) => field.id === "hst")?.displayValue ?? "Not added" },
        ],
      },
      {
        title: "Banking info",
        description: "Account details connected to payroll funding and deposits.",
        icon: "building" as const,
        fields: [
          { label: "Institution number", value: bankingInfo.institutionNumber || "Not added" },
          { label: "Bank name", value: bankingInfo.bankName || "Not available" },
          { label: "Transit number", value: bankingInfo.transitNumber || "Not added" },
          { label: "Account number", value: bankingInfo.accountNumber ? maskIdentifier(bankingInfo.accountNumber) : "Not added" },
        ],
      },
    ],
    [bankingInfo.accountNumber, bankingInfo.bankName, bankingInfo.institutionNumber, bankingInfo.transitNumber, directDepositFields]
  );

  return (
    <div className="flex flex-col">
      <div className="sticky top-3 flex flex-col gap-3 pb-4">
        <CompanyRailSection title="Next step" className="shell-enter">
          <p className="mb-3 text-[13px] leading-[1.42] text-[var(--credo-muted)]">
            Start by adding the first employee to unlock payroll and documents.
          </p>
          <Link
            href={routes.employeesNewForCompany(companyId)}
            className="type-button inline-flex h-9 w-full items-center justify-center rounded-full bg-[var(--credo-green-800)] px-4 text-[13px] font-semibold text-white shadow-none transition-colors duration-[160ms] hover:bg-[var(--credo-green-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
          >
            Add employee
          </Link>
        </CompanyRailSection>

        <BankingCarousel slides={bankingSlides} className="shell-enter shell-enter-delay-1" />

        <GuidanceCard title={guidance.title} copy={guidance.copy} href={guidance.href} className="shell-enter shell-enter-delay-2" />
      </div>
    </div>
  );
}

function getPayrollGuidance({
  companyId,
  payrollDetailsComplete,
  workspaceSummary,
}: {
  companyId: string;
  payrollDetailsComplete: boolean;
  workspaceSummary: CompanyWorkspaceSummary;
}) {
  if (!payrollDetailsComplete) {
    return {
      title: "Complete setup",
      copy: "Add payroll details so future runs are ready and accurate.",
      href: routes.companyProfileSectionEdit(companyId, "tax"),
    };
  }

  if (workspaceSummary.employeeCount === 0) {
    return {
      title: "Add employee",
      copy: "Create the first employee profile before running payroll.",
      href: routes.employeesNewForCompany(companyId),
    };
  }

  return {
    title: "Run payroll",
    copy: "Create the first payroll run for this company.",
    href: routes.runPayrollForCompany(companyId),
  };
}

function BankingCarousel({
  slides,
  className,
}: {
  slides: {
    title: string;
    description: string;
    icon: "building" | "document";
    fields: { label: string; value: string }[];
  }[];
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToSlide(index: number) {
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    const scroller = scrollerRef.current;
    const slide = scroller?.children.item(nextIndex) as HTMLElement | null;
    slide?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    setActiveIndex(nextIndex);
  }

  function onScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const width = scroller.clientWidth || 1;
    const index = Math.round(scroller.scrollLeft / width);
    setActiveIndex(Math.max(0, Math.min(index, slides.length - 1)));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToSlide(activeIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToSlide(activeIndex - 1);
    }
  }

  return (
    <section className={className}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label="Company banking cards"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth rounded-[26px] outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-[var(--action-ring)] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div key={slide.title} className="min-w-full snap-start">
            <BankingMiniCard
              {...slide}
              activeIndex={activeIndex}
              slideCount={slides.length}
              onPrevious={() => scrollToSlide(activeIndex - 1)}
              onNext={() => scrollToSlide(activeIndex + 1)}
              isCurrent={index === activeIndex}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function GuidanceCard({
  title,
  copy,
  href,
  className,
}: {
  title: string;
  copy: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "group flex min-h-10 items-center justify-between gap-4 rounded-[22px] bg-[var(--credo-surface-warm)] px-5 py-3.5 shadow-[0_8px_28px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)] transition-colors duration-[180ms] hover:bg-[var(--credo-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold leading-tight text-[var(--credo-ink)]">
          {title}
        </span>
        <span className="mt-1 block max-w-[270px] text-[13px] font-normal leading-[1.38] text-[var(--credo-muted)]">
          {copy}
        </span>
      </span>
      <ArrowIcon className="size-4 shrink-0 text-[var(--credo-bronze-700)] transition-colors duration-[180ms] group-hover:text-[var(--credo-green-800)]" />
    </Link>
  );
}

function ArrowIcon({ direction = "right", className = "size-4" }: { direction?: "left" | "right"; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      {direction === "left" ? (
        <path d="m9.75 4.5-3.5 3.5 3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m6.25 4.5 3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function CompanyRailSection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={[
        "rounded-[26px] bg-[var(--credo-surface)] p-5 shadow-[0_10px_34px_rgba(23,26,23,0.035)] ring-1 ring-[var(--credo-border)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className="mb-3 text-[19px] font-semibold leading-[1.12] text-[var(--credo-ink)]">{title}</h2>
      {children}
    </section>
  );
}

function BankingMiniCard({
  title,
  description,
  icon,
  fields,
  activeIndex,
  slideCount,
  onPrevious,
  onNext,
  isCurrent,
}: {
  title: string;
  description: string;
  icon: "building" | "document";
  fields: { label: string; value: string }[];
  activeIndex: number;
  slideCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isCurrent: boolean;
}) {
  return (
    <div className="relative min-h-[198px] overflow-hidden rounded-[26px] bg-[var(--credo-bronze-pale)] p-[18px] shadow-[0_12px_38px_rgba(23,26,23,0.04),inset_0_1px_0_rgba(255,255,255,0.58)] ring-1 ring-[rgba(216,203,185,0.86)]">
      {isCurrent ? (
        <span className="sr-only">
          Slide {activeIndex + 1} of {slideCount}
        </span>
      ) : null}
      <div className="relative z-10 flex h-full min-h-[162px] flex-col justify-between">
        <div>
          <h3 className="max-w-[212px] text-[18px] font-semibold leading-[1.12] tracking-[-0.01em] text-[var(--credo-ink)]">{title}</h3>
          <p className="mt-2 max-w-[230px] text-[12.5px] leading-[1.36] text-[var(--credo-muted)]">
            {description}
          </p>
        </div>
        <div className="mt-3.5 space-y-1.5">
          {fields.map((field) => (
            <InfoField key={field.label} label={field.label} value={field.value} />
          ))}
        </div>
      </div>
      <BrandIcon
        icon={icon}
        tone="sand"
        size="lg"
        className="absolute right-[18px] top-[54px] size-8 rounded-[13px] bg-[var(--credo-surface-warm)]/72 text-[var(--credo-muted-strong)] opacity-70 ring-1 ring-[rgba(91,77,58,0.08)] [&_svg]:size-3.5"
      />
      <div className="absolute right-[18px] top-[18px] z-20 flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous banking card"
          onClick={onPrevious}
          className="inline-flex size-[26px] items-center justify-center rounded-full bg-[var(--credo-surface-warm)]/84 text-[var(--credo-muted-strong)] shadow-[0_4px_10px_rgba(42,35,25,0.04)] ring-1 ring-[rgba(91,77,58,0.09)] transition hover:bg-[var(--credo-cream)] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <ArrowIcon direction="left" className="size-3" />
        </button>
        <button
          type="button"
          aria-label="Next banking card"
          onClick={onNext}
          className="inline-flex size-[26px] items-center justify-center rounded-full bg-[var(--credo-surface-warm)]/84 text-[var(--credo-muted-strong)] shadow-[0_4px_10px_rgba(42,35,25,0.04)] ring-1 ring-[rgba(91,77,58,0.09)] transition hover:bg-[var(--credo-cream)] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--action-ring)]"
        >
          <ArrowIcon className="size-3" />
        </button>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-t border-[rgba(91,77,58,0.1)] pt-2 first:border-t-0 first:pt-0">
      <span className="text-[11.5px] leading-tight text-[var(--credo-muted)]">{label}</span>
      <span className="min-w-0 truncate text-right text-[11.5px] font-medium leading-tight text-[var(--credo-ink)]">{value}</span>
    </div>
  );
}

export function CompanyRightRailForId({ companyId }: { companyId: string }) {
  const [directDepositFields, setDirectDepositFields] = useState<DirectDepositField[]>(() =>
    directDepositFieldsForProfile(null)
  );
  const [bankingInfo, setBankingInfo] = useState<CompanyBankingInfo>(() => bankingInfoForProfile(null));
  const [workspaceSummary, setWorkspaceSummary] = useState<CompanyWorkspaceSummary>({
    employeeCount: 0,
    payrollRunCount: 0,
    documentCount: 0,
  });
  const [payrollDetailsComplete, setPayrollDetailsComplete] = useState(false);
  const [showFundingDueCard, setShowFundingDueCard] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession()
      .then(({ data }) => {
        const accessToken = data.session?.access_token;
        return accessToken
          ? Promise.all([
              getCompanyByIdForToken(companyId, accessToken),
              getCompanyProfileForToken(companyId, accessToken),
              getCompanyWorkspaceSummaryForToken(companyId, accessToken),
            ])
          : null;
      })
      .then((result) => {
        if (!active) return;
        const company = result?.[0] ?? null;
        const profile = result?.[1] ?? null;
        const summary = result?.[2] ?? { employeeCount: 0, payrollRunCount: 0, documentCount: 0 };
        setShowFundingDueCard(company?.status === "Funding due");
        setDirectDepositFields(directDepositFieldsForProfile(profile));
        setBankingInfo(bankingInfoForProfile(profile));
        setWorkspaceSummary(summary);
        setPayrollDetailsComplete(profile ? hasCompletePayrollDetails(profile) : false);
      })
      .catch(() => {
        if (!active) return;
        setShowFundingDueCard(false);
        setDirectDepositFields(directDepositFieldsForProfile(null));
        setBankingInfo(bankingInfoForProfile(null));
        setWorkspaceSummary({ employeeCount: 0, payrollRunCount: 0, documentCount: 0 });
        setPayrollDetailsComplete(false);
      });

    return () => {
      active = false;
    };
  }, [companyId]);

  return (
    <CompanyRightRail
      companyId={companyId}
      directDepositFields={directDepositFields}
      bankingInfo={bankingInfo}
      payrollDetailsComplete={payrollDetailsComplete}
      workspaceSummary={workspaceSummary}
      showFundingDueCard={showFundingDueCard}
    />
  );
}
