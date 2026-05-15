import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        credo: {
          primary: "var(--brand-primary)",
          hover: "var(--brand-primary-hover)",
          soft: "var(--brand-primary-soft)",
          ring: "var(--brand-primary-ring)",
          border: "var(--brand-primary-border)",
          ink: "var(--brand-ink)",
        },
      },
      boxShadow: {
        whisper: "0 18px 38px rgba(15, 23, 42, 0.06)",
      },
      letterSpacing: {
        tightest: "-0.035em",
      },
    },
  },
  plugins: [],
};

export default config;
