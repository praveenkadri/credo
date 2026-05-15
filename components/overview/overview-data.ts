import {
  COMPANIES,
  UPCOMING_DEADLINES,
  getAttentionBannerText,
  getChartInterpretation,
} from "@/lib/overview-decision-data";

export const stateToneMap: Record<string, string> = {
  Healthy: "text-[var(--credo-green-950)]",
  "Needs review": "text-[var(--credo-bronze-700)]",
  "Funding due": "text-[var(--credo-bronze-700)]",
  "Invoice backlog": "text-[var(--credo-muted-strong)]",
  "Filing soon": "text-[var(--credo-green-800)]",
};

export const statePillToneMap: Record<string, string> = {
  Healthy: "bg-[var(--credo-taupe-wash)] text-[var(--credo-green-950)] ring-[rgba(91,77,58,0.18)]",
  "Needs review": "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-[var(--credo-taupe-strong)]",
  "Funding due": "bg-[var(--credo-bronze-pale)] text-[var(--credo-bronze-700)] ring-[var(--credo-taupe-strong)]",
  "Invoice backlog": "bg-[var(--credo-bronze-pale)] text-[var(--credo-muted-strong)] ring-[var(--credo-taupe-strong)]",
  "Filing soon": "bg-[var(--credo-cream-muted)] text-[var(--credo-green-800)] ring-[var(--credo-taupe-strong)]",
};

function initialsFor(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const avatarTones = ["bg-neutral-50/60", "bg-neutral-50/55", "bg-neutral-50/50"];

export const companies = COMPANIES.map((company, index) => ({
  ...company,
  href: `/companies/${company.id}`,
  initials: initialsFor(company.name),
  avatarTone: avatarTones[index % avatarTones.length],
  statusTone: stateToneMap[company.state],
  statusPillTone: statePillToneMap[company.state],
}));

export const cashMovementChart = {
  title: "Net revenue",
  valueLabel: "Net revenue",
  currentValue: "$18,403.77",
  deltaText: "+$191.50 past day",
  deltaPositive: true,
  activeRange: "1D",
  mode: "Value" as const,
  interpretation: getChartInterpretation(),
  ranges: ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "ALL"],
};

export const attentionBanner = {
  message: getAttentionBannerText(),
  variant: "attention" as const,
};

export const rightRail = {
  todayItems: UPCOMING_DEADLINES.filter((item) => item.dueLabel.startsWith("Today")).map(
    (item) => `${item.title} (${item.dueLabel.replace("Today, ", "")})`
  ),
  nextItems: UPCOMING_DEADLINES.filter((item) => !item.dueLabel.startsWith("Today")).map(
    (item) => `${item.title} (${item.dueLabel})`
  ),
};
