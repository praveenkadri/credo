export const layoutTokens = {
  railWidth: "clamp(340px,24vw,414px)",
  pageGap: "1.5rem",
  chartHeight: 248,
  cardRadius: "24px",
} as const;

export const motionTokens = {
  fast: "120ms",
  base: "180ms",
  slow: "240ms",
  easeStandard: "cubic-bezier(0.2,0,0,1)",
  easeOutSoft: "cubic-bezier(0.16,1,0.3,1)",
  easeInOutSoft: "cubic-bezier(0.4,0,0.2,1)",
} as const;

export const shadowTokens = {
  whisper: "0_1px_1px_rgba(15,23,42,0.02),0_8px_24px_rgba(15,23,42,0.03)",
  cardBase: "0_8px_30px_rgba(15,23,42,0.035)",
  cardHover: "0_8px_24px_rgba(15,23,42,0.05)",
  railCard: "0_8px_30px_rgba(15,23,42,0.04)",
  tooltip: "0_4px_14px_rgba(15,23,42,0.08)",
} as const;
