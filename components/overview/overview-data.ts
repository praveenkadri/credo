import {
  COMPANIES,
  UPCOMING_DEADLINES,
  getAttentionBannerText,
  getChartInterpretation,
} from "@/lib/overview-decision-data";

export const stateToneMap: Record<string, string> = {
  Healthy: "text-[#5f685d]",
  "Needs review": "text-[#5f6457]",
  "Funding due": "text-[#6a6252]",
  "Invoice backlog": "text-[#615f57]",
  "Filing soon": "text-[#5d6456]",
};

export const statePillToneMap: Record<string, string> = {
  Healthy: "bg-white/75 text-[#5f685d] ring-white/70",
  "Needs review": "bg-white/80 text-[#5f6457] ring-white/75",
  "Funding due": "bg-white/80 text-[#6a6252] ring-white/75",
  "Invoice backlog": "bg-white/75 text-[#615f57] ring-white/70",
  "Filing soon": "bg-white/75 text-[#5d6456] ring-white/70",
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
  title: "Cash movement",
  valueLabel: "Portfolio value",
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
