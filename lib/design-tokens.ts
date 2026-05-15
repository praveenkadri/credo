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
  whisper: "0_1px_1px_rgba(23,26,23,0.025),0_8px_24px_rgba(23,26,23,0.035)",
  cardBase: "0_8px_30px_rgba(23,26,23,0.04)",
  cardHover: "0_8px_24px_rgba(23,26,23,0.055)",
  railCard: "0_8px_30px_rgba(23,26,23,0.045)",
  tooltip: "0_4px_14px_rgba(23,26,23,0.08)",
} as const;

export const brandVisualTokens = {
  primary: "#155A43",
  primaryHover: "#0F6B4D",
  primarySoft: "#F1E7D8",
  primaryRing: "rgba(21,90,67,0.24)",
  primaryBorder: "rgba(21,90,67,0.18)",
  olive: {
    bg: "#F3EADC",
    fg: "#12362C",
  },
  sky: {
    bg: "#F8F5EE",
    fg: "#4D5948",
  },
  peach: {
    bg: "#F1E7D8",
    fg: "#8A6130",
  },
  lavender: {
    bg: "#E8E2D8",
    fg: "#6E5F4D",
  },
  sand: {
    bg: "#F1E7D8",
    fg: "#8A6130",
  },
  ink: "#171A17",
  muted: "#6F746D",
  border: "#E1DACF",
  surface: "#FFFFFF",
  offwhite: "#F6F4EF",
} as const;
