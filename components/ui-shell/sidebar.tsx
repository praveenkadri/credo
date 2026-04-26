"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui-primitives/avatar";
import { Tooltip } from "@/components/ui-primitives/tooltip";
import { SIDEBAR_WIDTH } from "@/components/ui-shell/layout-constants";
import { CredoBrandMark } from "@/components/ui-shell/credo-brand-mark";
import { isOverviewPath, isPayrollPath, routes } from "@/lib/routes";
import { useContent } from "@/lib/useContent";

type NavItem = {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
  icon: () => JSX.Element;
};

const ICON_STROKE_WIDTH = 1.45;
const ICON_SIZE = 18;
const ICON_VIEWBOX = "0 0 18 18";

function OverviewIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <rect x="3.3" y="3.3" width="4.6" height="4.6" rx="1.05" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <rect x="10.1" y="3.3" width="4.6" height="4.6" rx="1.05" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <rect x="3.3" y="10.1" width="4.6" height="4.6" rx="1.05" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <rect x="10.1" y="10.1" width="4.6" height="4.6" rx="1.05" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
    </svg>
  );
}

function PayrollIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <rect x="3.4" y="3.6" width="11.2" height="10.8" rx="1.35" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <path d="M6.2 6.9H12M6.2 9H12M6.2 11.1H12" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
      <path d="M4.9 6.9H5.2M4.9 9H5.2M4.9 11.1H5.2" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <path d="M5 3.4H11L13 5.5V13.1C13 13.8 12.4 14.4 11.7 14.4H5.3C4.6 14.4 4 13.8 4 13.1V4.7C4 4 4.6 3.4 5.3 3.4H5Z" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8 3.5V5.8H13" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.4 8.1H10.5M6.4 10.1H10.5M6.4 12.1H9.1" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <circle cx="7" cy="6.8" r="1.9" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <circle cx="11.8" cy="7.8" r="1.55" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} />
      <path d="M4.2 13.6C5 11.9 6.2 11 7.9 11C9.5 11 10.8 11.8 11.7 13.6" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
      <path d="M10.3 13.6C10.8 12.5 11.6 11.9 12.7 11.9C13.6 11.9 14.3 12.4 14.8 13.6" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
    </svg>
  );
}

function InsightsIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <path d="M3.9 14H14.1" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" />
      <path d="M4.7 12.2L7.7 9.3L10 10.8L13.1 6.9" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.7 6.9H13.1V8.3" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ComplianceIcon() {
  return (
    <svg width={ICON_SIZE} height={ICON_SIZE} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      <path d="M9 2.9L13.8 4.6V8.7C13.8 11.3 12.2 13.6 9 14.9C5.8 13.6 4.2 11.3 4.2 8.7V4.6L9 2.9Z" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.1 8.9L8.4 10.2L11 7.6" stroke="currentColor" strokeWidth={ICON_STROKE_WIDTH} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    href: routes.overview,
    isActive: isOverviewPath,
    icon: OverviewIcon,
  },
  { label: "Team", href: routes.team, isActive: (pathname) => pathname.startsWith(routes.team), icon: TeamIcon },
  {
    label: "Payroll",
    href: routes.payroll,
    isActive: isPayrollPath,
    icon: PayrollIcon,
  },
  {
    label: "Documents",
    href: routes.documents,
    isActive: (pathname) => pathname.startsWith(routes.documents),
    icon: DocumentsIcon,
  },
  {
    label: "Insights",
    href: routes.insights,
    isActive: (pathname) => pathname.startsWith(routes.insights),
    icon: InsightsIcon,
  },
  {
    label: "Compliance",
    href: routes.compliance,
    isActive: (pathname) => pathname.startsWith(routes.compliance),
    icon: ComplianceIcon,
  },
];

function NavRow({
  item,
  collapsed,
  pathname,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
}) {
  const active = item.isActive(pathname);

  const button = (
    <Link
      href={item.href}
      aria-label={collapsed ? item.label : undefined}
      className={[
        "group relative flex cursor-pointer items-center transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        collapsed ? "size-10 self-center justify-center rounded-xl" : "h-10 w-full gap-2.5 rounded-xl px-2.5",
        active
          ? "bg-neutral-100/80 text-neutral-900"
          : "text-[#6e736b] hover:bg-neutral-100/70 hover:text-neutral-900",
      ].join(" ")}
    >
      <span
        className={[
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)]",
          active ? "bg-neutral-100/80 opacity-100" : "",
        ].join(" ")}
        aria-hidden="true"
      />
      <span
        className={[
          "relative z-10 flex size-5 shrink-0 items-center justify-center transition-[color,opacity] duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)]",
          active ? "text-[#575b55] opacity-100" : "text-[#93988f] opacity-85 group-hover:text-[#6e736b] group-hover:opacity-100",
        ].join(" ")}
      >
        {item.icon()}
      </span>
      <span
        className={[
          "relative z-10 min-w-0 overflow-hidden transition-[max-width] duration-200 ease-out motion-reduce:transition-none",
          collapsed ? "max-w-0" : "max-w-[164px]",
        ].join(" ")}
      >
        <span
          className={[
            "block whitespace-nowrap text-sm font-medium leading-[1.35] tracking-[-0.02em] transition-[opacity,transform,color] duration-[170ms] ease-out motion-reduce:transition-none",
            active ? "text-[#1f221c]" : "text-[#6e736b] group-hover:text-[#1f221c]",
            collapsed ? "translate-x-1 opacity-0" : "translate-x-0 opacity-100",
          ].join(" ")}
          aria-hidden={collapsed}
        >
          {item.label}
        </span>
      </span>
    </Link>
  );

  if (!collapsed) return button;

  return (
    <Tooltip label={item.label} className="w-full">
      <span className="w-full">{button}</span>
    </Tooltip>
  );
}

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const c = useContent();
  const nav = c.navigation;

  const navItems = [
    { ...NAV_ITEMS[0], label: nav.overview },
    { ...NAV_ITEMS[1], label: nav.team },
    { ...NAV_ITEMS[2], label: nav.payroll },
    { ...NAV_ITEMS[3], label: nav.documents },
    { ...NAV_ITEMS[4], label: nav.insights },
    { ...NAV_ITEMS[5], label: nav.compliance },
  ];

  return (
    <aside
      className={[
        "relative hidden h-full shrink-0 bg-transparent md:flex md:flex-col",
        "transition-[width] duration-[240ms] ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none",
        collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
      ].join(" ")}
      aria-label="Sidebar"
    >
      <div className="flex h-full flex-col px-3 py-3">
        <div className={collapsed ? "flex justify-center" : "flex items-center justify-between"}>
          {!collapsed ? <CredoBrandMark className="pl-1" /> : null}

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggle}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl bg-transparent text-[#6e736b] transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/70 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300/40"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4 5H12M4 8H12M4 11H12" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={collapsed ? "mt-4 flex flex-col gap-1.5" : "mt-5 flex flex-col gap-1"}>
          {navItems.map((item) => (
            <NavRow key={item.label} item={item} collapsed={collapsed} pathname={pathname} />
          ))}
        </div>

        <div className="flex-1" />

        <div className={collapsed ? "pt-3 flex justify-center" : "pt-4"}>
          {collapsed ? (
            <Tooltip label="Credo workspace">
              <button
                type="button"
                aria-label="Credo workspace"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#242421] text-[12.5px] font-medium text-white transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)]"
              >
                C
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[#575b55] transition-colors duration-[140ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-neutral-100/70 hover:text-neutral-900"
            >
              <Avatar initials="C" />
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-medium tracking-[-0.016em]">
                  Credo workspace
                </div>
                <div className="truncate text-[12.5px] text-[#93988f]">
                  Operations
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
