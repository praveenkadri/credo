import { isOverviewPath, isPayrollPath, routes } from "@/lib/routes";
import type { NavIconName, NavIconTone } from "@/components/ui-shell/nav-icon";

export type PrimaryNavItemId =
  | "overview"
  | "companies"
  | "employees"
  | "workflows"
  | "payroll"
  | "documents"
  | "insights"
  | "compliance";

export type PrimaryNavItem = {
  id: PrimaryNavItemId;
  href: string;
  isActive: (pathname: string) => boolean;
  icon: NavIconName;
  tone: NavIconTone;
};

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  {
    id: "overview",
    href: routes.overview,
    isActive: isOverviewPath,
    icon: "overview",
    tone: "olive",
  },
  {
    id: "companies",
    href: routes.companiesAlias,
    isActive: (pathname) => pathname.startsWith(routes.companiesAlias),
    icon: "companies",
    tone: "sand",
  },
  {
    id: "employees",
    href: routes.employees,
    isActive: (pathname) => pathname.startsWith(routes.employees) || pathname.startsWith(routes.team),
    icon: "employees",
    tone: "neutral",
  },
  {
    id: "workflows",
    href: routes.workflows,
    isActive: (pathname) => pathname.startsWith(routes.workflows),
    icon: "workflows",
    tone: "sand",
  },
  {
    id: "payroll",
    href: routes.payroll,
    isActive: isPayrollPath,
    icon: "payroll",
    tone: "olive",
  },
  {
    id: "documents",
    href: routes.documents,
    isActive: (pathname) => pathname.startsWith(routes.documents),
    icon: "documents",
    tone: "sand",
  },
  {
    id: "insights",
    href: routes.insights,
    isActive: (pathname) => pathname.startsWith(routes.insights),
    icon: "insights",
    tone: "neutral",
  },
  {
    id: "compliance",
    href: routes.compliance,
    isActive: (pathname) => pathname.startsWith(routes.compliance),
    icon: "compliance",
    tone: "sand",
  },
];
