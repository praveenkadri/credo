import { statePillToneMap } from "@/components/overview/overview-data";

export type CompanyHealth = "Healthy" | "Needs review" | "Funding due";

export type CompanyDetail = {
  id: string;
  name: string;
  initials: string;
  avatarTone: string;
  status: CompanyHealth;
  statusPillTone: string;
  subtitle: string;
  primaryValue: string;
  primaryLabel: string;
  preparedAt: string;
  runSignal: string;
};

export type CompanyActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  rightPrimary: string;
  rightSecondary?: string;
  icon: "payroll" | "invoice" | "person" | "document" | "check";
  expandedNote?: string;
};

export type CompanyActivityGroupData = {
  id: string;
  label: string;
  items: CompanyActivityItem[];
};

export type CompanyQuickAction = {
  id: string;
  label: string;
  icon: "plus" | "run";
};

export type RightRailAction = {
  id: string;
  label: string;
  icon: "person" | "invoice" | "upload" | "report" | "approve" | "settings";
};

export type DirectDepositField = {
  id: string;
  label: string;
  value: string;
};

const defaultCompanyDetail: CompanyDetail = {
  id: "aster-health",
  name: "Aster Health Group",
  initials: "AH",
  avatarTone: "bg-neutral-50/60",
  status: "Healthy",
  statusPillTone: statePillToneMap.Healthy,
  subtitle: "Payroll account · 94 employees",
  primaryValue: "$128,430.00",
  primaryLabel: "Next payroll prepared",
  preparedAt: "Payroll run prepared 2h ago",
  runSignal: "Run in normal range",
};

const defaultActivityGroups: CompanyActivityGroupData[] = [
  {
    id: "yesterday",
    label: "Yesterday",
    items: [
      {
        id: "payroll-prepared",
        title: "Payroll run prepared",
        subtitle: "Aster Health Group · Payroll",
        rightPrimary: "$128,430.00",
        rightSecondary: "Prepared",
        icon: "payroll",
        expandedNote: "Ready for funding confirmation and final approval.",
      },
      {
        id: "invoice-batch-approved",
        title: "Invoice batch approved",
        subtitle: "12 invoices · Accounts receivable",
        rightPrimary: "$18,920.00",
        rightSecondary: "Approved",
        icon: "invoice",
        expandedNote: "Batch moved to posting queue.",
      },
    ],
  },
  {
    id: "last-week",
    label: "Last week",
    items: [
      {
        id: "employee-added",
        title: "Employee added",
        subtitle: "Priya Shah · Payroll profile",
        rightPrimary: "Synced",
        icon: "person",
        expandedNote: "Profile synced to payroll and benefits records.",
      },
      {
        id: "tax-document-generated",
        title: "Tax document generated",
        subtitle: "HST filing package",
        rightPrimary: "Ready",
        icon: "document",
        expandedNote: "Package is available for review before filing.",
      },
    ],
  },
  {
    id: "april-1-2026",
    label: "April 1, 2026",
    items: [
      {
        id: "funding-confirmed",
        title: "Funding confirmation received",
        subtitle: "Payroll funding · Operating account",
        rightPrimary: "Completed",
        icon: "check",
        expandedNote: "Funding confirmation arrived from banking partner.",
      },
    ],
  },
];

const defaultQuickActions: CompanyQuickAction[] = [
  { id: "add-invoice", label: "Add invoice", icon: "plus" },
  { id: "run-payroll", label: "Run payroll", icon: "run" },
];

const defaultRightRailActions: RightRailAction[] = [
  { id: "add-employee", label: "Add employee", icon: "person" },
  { id: "create-invoice", label: "Create invoice", icon: "invoice" },
  { id: "upload-document", label: "Upload document", icon: "upload" },
  { id: "generate-report", label: "Generate report", icon: "report" },
  { id: "review-approvals", label: "Review approvals", icon: "approve" },
  { id: "company-settings", label: "Company settings", icon: "settings" },
];

const defaultDirectDepositFields: DirectDepositField[] = [
  { id: "bin", label: "BIN number", value: "001234" },
  { id: "payroll", label: "Payroll number", value: "RP0001" },
  { id: "hst", label: "HST number", value: "123456789 RT0001" },
];

const companyProfiles: Record<string, Partial<CompanyDetail>> = {
  "aster-health": defaultCompanyDetail,
};

export function getCompanyDetailPageData(id: string) {
  const profile = companyProfiles[id] ?? {};

  const companyDetail: CompanyDetail = {
    ...defaultCompanyDetail,
    ...profile,
    id,
    statusPillTone: statePillToneMap[(profile.status ?? defaultCompanyDetail.status) as CompanyHealth],
  };

  return {
    companyDetail,
    activityGroups: defaultActivityGroups,
    quickActions: defaultQuickActions,
    rightRailActions: defaultRightRailActions,
    directDepositFields: defaultDirectDepositFields,
    companyInfo: ["Company profile", "Payroll setup", "Tax setup"],
  };
}
