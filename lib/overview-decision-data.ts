export type CompanyOperationalState =
  | "Healthy"
  | "Needs review"
  | "Funding due"
  | "Invoice backlog"
  | "Filing soon";

export type CompanyRecord = {
  id: string;
  name: string;
  lastActivity: string;
  payrollAmount: string;
  employeeCount: number;
  state: CompanyOperationalState;
  stateDetail: string;
  fundingDueInDays?: number;
};

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  timing: string;
  needsReviewToday?: boolean;
};

export type PriorityAction = {
  id: string;
  title: string;
  detail: string;
  company: string;
  urgency: "High" | "Medium";
};

export type OperationalEvent = {
  id: string;
  title: string;
  detail: string;
};

export type WatchlistItem = {
  id: string;
  title: string;
  detail: string;
};

export type DeadlineItem = {
  id: string;
  title: string;
  dueLabel: string;
};

export const COMPANIES: CompanyRecord[] = [
  {
    id: "aster-health-group",
    name: "Aster Health Group",
    lastActivity: "Payroll run prepared 2h ago",
    payrollAmount: "$128,430.00",
    employeeCount: 94,
    state: "Healthy",
    stateDetail: "Run in normal range",
  },
  {
    id: "northline-services",
    name: "Northline Services",
    lastActivity: "Draft approved yesterday",
    payrollAmount: "$84,920.00",
    employeeCount: 61,
    state: "Needs review",
    stateDetail: "2 edits",
  },
  {
    id: "summit-industrial",
    name: "Summit Industrial",
    lastActivity: "Timesheets locked today",
    payrollAmount: "$214,580.00",
    employeeCount: 143,
    state: "Healthy",
    stateDetail: "No outlier shifts",
  },
  {
    id: "willow-hospitality",
    name: "Willow Hospitality",
    lastActivity: "Funding reminder sent 1d ago",
    payrollAmount: "$71,240.00",
    employeeCount: 48,
    state: "Funding due",
    stateDetail: "Funding due",
    fundingDueInDays: 2,
  },
  {
    id: "harbor-retail-partners",
    name: "Harbor Retail Partners",
    lastActivity: "New hire synced 3d ago",
    payrollAmount: "$167,390.00",
    employeeCount: 119,
    state: "Healthy",
    stateDetail: "Hiring changes reconciled",
  },
];

export const ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "payroll-review",
    title: "Payroll reviews needed",
    detail: "Northline has 2 edited entries awaiting sign-off.",
    timing: "Today",
    needsReviewToday: true,
  },
  {
    id: "invoice-backlog",
    title: "Invoice backlog growing",
    detail: "12 invoices are older than 5 days across 2 companies.",
    timing: "Today",
    needsReviewToday: true,
  },
  {
    id: "funding-window",
    title: "Funding due soon",
    detail: "Willow payroll account needs funding confirmation.",
    timing: "2 days",
  },
  {
    id: "filing-window",
    title: "Compliance window approaching",
    detail: "Q2 filing prep opens for Harbor on Monday.",
    timing: "4 days",
  },
];

export const PRIORITY_ACTIONS: PriorityAction[] = [
  {
    id: "approve-northline-edits",
    title: "Approve Northline payroll edits",
    detail: "Unblocks today's run and keeps payout timeline intact.",
    company: "Northline Services",
    urgency: "High",
  },
  {
    id: "release-overdue-invoices",
    title: "Release overdue invoice batch",
    detail: "Clears 12 stale invoices and reduces carry-over risk.",
    company: "Aster + Harbor",
    urgency: "High",
  },
  {
    id: "confirm-willow-funding",
    title: "Confirm Willow funding transfer",
    detail: "Prevents late payroll movement due in 2 days.",
    company: "Willow Hospitality",
    urgency: "Medium",
  },
];

export const OPERATIONAL_EVENTS: OperationalEvent[] = [
  {
    id: "northline-edits",
    title: "Northline payroll edits flagged for review",
    detail: "Review requested.",
  },
  {
    id: "invoice-backlog-threshold",
    title: "Invoice aging threshold crossed in 2 companies",
    detail: "Release batch recommended.",
  },
  {
    id: "willow-funding-reminder",
    title: "Funding reminder escalated for Willow",
    detail: "Final confirmation pending.",
  },
  {
    id: "summit-run-healthy",
    title: "Summit payroll run completed without intervention",
    detail: "Marked healthy.",
  },
];

export const WATCHLIST_ITEMS: WatchlistItem[] = [
  {
    id: "harbor-filing",
    title: "Harbor filing prep",
    detail: "Document packet starts Monday.",
  },
  {
    id: "aster-invoice-lag",
    title: "Aster invoice lag",
    detail: "4 invoices near aging threshold.",
  },
];

export const UPCOMING_DEADLINES: DeadlineItem[] = [
  {
    id: "willow-funding-deadline",
    title: "Willow payroll funding cutoff",
    dueLabel: "In 2 days",
  },
  {
    id: "northline-approval-cutoff",
    title: "Northline payroll approval cutoff",
    dueLabel: "Today, 3:00 PM",
  },
  {
    id: "harbor-compliance-window",
    title: "Harbor Q2 filing window opens",
    dueLabel: "Monday",
  },
];

export function getOperatingSummary() {
  const healthyCompanies = COMPANIES.filter((company) => company.state === "Healthy").length;
  return `${healthyCompanies} companies healthy`;
}

export function getAttentionBannerText() {
  const reviewToday = ATTENTION_ITEMS.filter((item) => item.needsReviewToday).length;
  const nextFundingDue = COMPANIES.filter((company) => typeof company.fundingDueInDays === "number")
    .map((company) => company.fundingDueInDays as number)
    .sort((a, b) => a - b)[0];

  if (typeof nextFundingDue === "number") {
    return `${reviewToday} items to review · Funding due in ${nextFundingDue} days`;
  }

  return `${reviewToday} items to review`;
}

export function getChartInterpretation() {
  const hasFundingPressure = ATTENTION_ITEMS.some((item) => item.id === "funding-window");
  if (hasFundingPressure) {
    return "No unusual outflows; funding pressure is rising in 1 company.";
  }
  return "No unusual outflows across active payroll and invoice cycles.";
}
