import { cn } from "@/lib/utils";

export type NavIconName =
  | "overview"
  | "companies"
  | "employees"
  | "workflows"
  | "payroll"
  | "documents"
  | "insights"
  | "compliance"
  | "team"
  | "settings";

export type NavIconTone = "olive" | "sky" | "peach" | "lavender" | "sand" | "neutral";

const ICON_STROKE_WIDTH = 1.8;
const ICON_SIZE = 18;
const SIDEBAR_ICON_STROKE_WIDTH = 1.7;
const SIDEBAR_ICON_SIZE = 17;
const ICON_VIEWBOX = "0 0 18 18";

export function NavIcon({
  icon,
  label,
  tone: _tone,
  active,
  collapsed,
  density = "default",
  className,
}: {
  icon: NavIconName;
  label: string;
  tone: NavIconTone;
  active: boolean;
  collapsed: boolean;
  density?: "default" | "sidebar";
  className?: string;
}) {
  const sidebar = density === "sidebar";

  return (
    <span
      className={cn(
        "relative z-10 inline-flex shrink-0 items-center justify-center duration-[150ms] ease-[cubic-bezier(0.2,0,0,1)] group-active/nav:scale-[0.98]",
        sidebar
          ? "size-[17px] transition-[color,transform]"
          : "size-8 rounded-[13px] transition-[background-color,box-shadow,color,transform]",
        active ? (sidebar ? "text-[#155A43]" : "text-[var(--credo-green-800)]") : "",
        !active
          ? sidebar
            ? "text-[#5F665E] group-hover/nav:text-[var(--credo-green-800)]"
            : "text-[var(--credo-muted-strong)] group-hover/nav:text-[var(--credo-green-800)]"
          : "",
        collapsed ? "mx-auto" : "",
        className
      )}
      aria-hidden="true"
      data-label={label}
    >
      <NavSvgIcon
        icon={icon}
        size={sidebar ? SIDEBAR_ICON_SIZE : ICON_SIZE}
        strokeWidth={sidebar ? SIDEBAR_ICON_STROKE_WIDTH : ICON_STROKE_WIDTH}
      />
    </span>
  );
}

function NavSvgIcon({ icon, size, strokeWidth }: { icon: NavIconName; size: number; strokeWidth: number }) {
  return (
    <svg width={size} height={size} viewBox={ICON_VIEWBOX} fill="none" aria-hidden="true">
      {icon === "overview" ? (
        <>
          <rect x="3.2" y="3.3" width="4.6" height="4.6" rx="1.15" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="10.2" y="3.3" width="4.6" height="4.6" rx="1.15" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="3.2" y="10.1" width="4.6" height="4.6" rx="1.15" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M10.5 11.9H14.5M12.5 9.9V13.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      ) : null}
      {icon === "companies" ? (
        <>
          <path d="M4.1 14.4V4.1C4.1 3.6 4.5 3.2 5 3.2H10.5C11 3.2 11.4 3.6 11.4 4.1V14.4M11.4 7.2H13.2C13.7 7.2 14.1 7.6 14.1 8.1V14.4M6.3 6.1H8.9M6.3 8.6H8.9M6.3 11.1H8.9M3.2 14.4H14.8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {icon === "employees" ? (
        <>
          <circle cx="7.4" cy="6.2" r="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M3.9 14.1C4.7 12.2 5.9 11.3 7.5 11.3C9.1 11.3 10.3 12.2 11.1 14.1M11 8.1C11.5 7.7 12.1 7.4 12.8 7.4C13.9 7.4 14.8 8.3 14.8 9.4M12.6 11.9C13.5 12.1 14.1 12.8 14.6 14.1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {icon === "workflows" ? (
        <>
          <rect x="3.4" y="3.5" width="4.2" height="4.2" rx="1.05" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="10.4" y="10.3" width="4.2" height="4.2" rx="1.05" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M7.8 5.6H10.2C11.8 5.6 12.7 6.5 12.7 8V10M10.2 12.4H7.8C6.2 12.4 5.3 11.5 5.3 10V7.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.2 4.6L10.4 5.7L9.2 6.8M8.8 13.4L7.6 12.3L8.8 11.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {icon === "payroll" ? (
        <>
          <rect x="3.3" y="3.6" width="11.4" height="10.8" rx="1.6" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M6.1 6.7H11.9M6.1 9.1H11.9M6.1 11.5H9.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M13.2 11.1C12.6 11.1 12.2 11.5 12.2 12C12.2 12.6 12.6 12.9 13.2 12.9C13.8 12.9 14.2 12.6 14.2 12C14.2 11.5 13.8 11.1 13.2 11.1Z" fill="currentColor" />
        </>
      ) : null}
      {icon === "documents" ? (
        <>
          <path d="M5 3.2H10.5L13.3 6V13.1C13.3 13.9 12.7 14.5 11.9 14.5H5.1C4.3 14.5 3.7 13.9 3.7 13.1V4.6C3.7 3.8 4.3 3.2 5 3.2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.4 3.4V6.1H13.1M6.2 8.4H10.8M6.2 10.7H10.8M6.2 13H8.6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {icon === "insights" ? (
        <>
          <path d="M3.5 14.2H14.5M4.6 11.8L7.3 9.2L9.8 10.6L13.4 6.2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.2 6.1H13.5V7.4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5.2 14.1V12.2M8.1 14.1V10.4M11 14.1V11.4M13.9 14.1V8.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      ) : null}
      {icon === "compliance" ? (
        <>
          <path d="M9 2.9L13.7 4.6V8.7C13.7 11.3 12.1 13.5 9 14.8C5.9 13.5 4.3 11.3 4.3 8.7V4.6L9 2.9Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.1 8.8L8.4 10.1L11.1 7.4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : null}
      {icon === "team" ? (
        <>
          <circle cx="7" cy="6.5" r="1.9" stroke="currentColor" strokeWidth={strokeWidth} />
          <circle cx="12.2" cy="7.6" r="1.55" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M4 14C4.8 12.1 6.1 11.2 7.8 11.2C9.4 11.2 10.7 12.1 11.6 14M10.4 13.9C10.9 12.8 11.7 12.2 12.8 12.2C13.7 12.2 14.4 12.8 14.9 13.9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      ) : null}
      {icon === "settings" ? (
        <>
          <circle cx="9" cy="9" r="2.05" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M9 3.1V4.6M9 13.4V14.9M14.9 9H13.4M4.6 9H3.1M13.2 4.8L12.1 5.9M5.9 12.1L4.8 13.2M13.2 13.2L12.1 12.1M5.9 5.9L4.8 4.8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
