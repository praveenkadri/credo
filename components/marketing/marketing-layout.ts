export const MARKETING_SHELL = {
  container: "mx-auto w-full max-w-[1240px] px-5 sm:px-6 lg:px-8",
  narrowContainer: "mx-auto w-full max-w-[980px] px-5 sm:px-6 lg:px-7",
  sectionSpacing: "py-18 md:py-24",
  heroSpacing: "pt-10 pb-16 md:pt-18 md:pb-24",
} as const;

export const MARKETING_STYLE = {
  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.17em] text-[var(--marketing-green)]",
  eyebrowOnDark: "text-[11px] font-semibold uppercase tracking-[0.17em] text-[#c8c1b2]",
  heading:
    "text-[32px] font-semibold leading-[1.1] tracking-[-0.034em] text-[var(--marketing-text)] sm:text-[44px]",
  body: "text-[16px] leading-[1.7] text-[var(--marketing-muted)] sm:text-[17px]",
  primaryCta:
    "marketing-button inline-flex h-11 items-center justify-center rounded-full bg-[var(--marketing-green)] px-5 text-[13px] font-semibold text-[var(--marketing-cream)] shadow-[var(--marketing-shadow-button)] transition hover:bg-[var(--marketing-green-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary-ring)]",
  primaryCtaOnDark:
    "marketing-button inline-flex h-12 items-center justify-center rounded-full bg-[var(--marketing-cream)] px-6 text-[14px] font-semibold text-[var(--marketing-green)] shadow-[0_18px_42px_rgba(3,16,11,0.2)] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
  secondaryCtaOnDark:
    "marketing-button inline-flex h-12 items-center justify-center rounded-full border border-[rgba(239,229,213,0.28)] px-5 text-[14px] font-semibold text-white/78 transition hover:border-[rgba(239,229,213,0.42)] hover:bg-[rgba(239,229,213,0.08)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(239,229,213,0.34)]",
  softCard:
    "rounded-[26px] border border-[var(--marketing-border)] bg-[var(--marketing-cream)] shadow-[var(--marketing-shadow-soft)]",
  darkCard:
    "rounded-[26px] border border-white/[0.1] bg-[var(--marketing-green)] shadow-[var(--marketing-shadow-dark)]",
  rowItem:
    "group grid gap-4 rounded-[22px] px-1 py-7 transition duration-200 hover:bg-[rgba(239,229,213,0.42)] sm:grid-cols-[92px_minmax(170px,0.48fr)_minmax(0,1fr)_28px] sm:items-start sm:px-4",
  stepCard:
    "rounded-[26px] border border-[var(--marketing-border)] bg-[rgba(251,250,244,0.72)] p-6 shadow-[var(--marketing-shadow-soft)] transition duration-200 hover:border-[var(--marketing-border-strong)] hover:bg-[var(--marketing-cream)]",
} as const;
