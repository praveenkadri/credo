export const SIDEBAR_COOKIE_KEY = "credo-sidebar-collapsed";

export const SIDEBAR_WIDTH = {
  collapsed: "w-[72px]",
  expanded: "w-[220px]",
} as const;

export const APP_LAYOUT = {
  containerMaxWidth: "max-w-[1280px]",
  contentPaddingX: "px-8",
  contentPaddingBottom: "pb-8 md:pb-10",
  mainRailGap: "gap-8",
  withRailColumns: "flex",
  mainColumnWidthClass: "min-w-0 flex-1",
  rightRailWidthClass: "hidden w-[320px] shrink-0 xl:block",
  topbarHeight: "h-16",
  pageTopSpacing: "pt-6",
} as const;

export const BRAND_MARK = {
  insetX: "left-4",
  insetY: "top-3",
  typography: "text-[18px] font-semibold tracking-[-0.038em] text-[#1f221c]",
} as const;
