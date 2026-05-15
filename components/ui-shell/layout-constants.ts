export const SIDEBAR_COOKIE_KEY = "credo-sidebar-collapsed";

export const SIDEBAR_WIDTH = {
  collapsed: "w-[232px]",
  expanded: "w-[232px]",
} as const;

export const APP_LAYOUT = {
  containerMaxWidth: "max-w-none",
  focusedContainerMaxWidth: "max-w-[1360px]",
  focusedContentMaxWidth: "max-w-[960px]",
  focusedDescriptionMaxWidth: "max-w-[720px]",
  contentPaddingX: "px-4 md:px-6 2xl:px-8",
  contentPaddingBottom: "pb-6 md:pb-8",
  mainRailGap: "gap-8 2xl:gap-12",
  withRailColumns: "flex",
  mainColumnWidthClass: "min-w-0 flex-1",
  rightRailWidthClass: "hidden w-[clamp(360px,24vw,480px)] shrink-0 xl:block",
  topbarHeight: "h-14",
  pageTopSpacing: "pt-3",
} as const;

export const BRAND_MARK = {
  insetX: "left-4",
  insetY: "top-3",
  typography: "text-[18px] font-semibold tracking-[-0.03em] text-[var(--text-primary)]",
} as const;
