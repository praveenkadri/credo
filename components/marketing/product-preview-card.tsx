import { MARKETING_STYLE } from "@/components/marketing/marketing-layout";

type ProductPreviewCardProps = {
  tone?: "light" | "dark";
  title: string;
  rows: Array<[string, string]>;
};

export function ProductPreviewCard({ tone = "light", title, rows }: ProductPreviewCardProps) {
  const isDark = tone === "dark";

  return (
    <article
      className={[
        "overflow-hidden p-4",
        isDark
          ? `${MARKETING_STYLE.darkCard} text-white`
          : `${MARKETING_STYLE.softCard} text-[var(--marketing-text)]`,
      ].join(" ")}
    >
      <div
        className={[
          "rounded-[21px] border p-5",
          isDark
            ? "border-white/[0.1] bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border-[var(--marketing-border)] bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-4">
          <p className={["text-[15px] font-semibold tracking-[-0.01em]", isDark ? "text-white" : "text-[var(--marketing-text)]"].join(" ")}>
            {title}
          </p>
          <span className={["size-2.5 rounded-full", isDark ? "bg-[var(--credo-bronze)]" : "bg-[var(--marketing-green)]"].join(" ")} />
        </div>

        <div className={["mt-5 divide-y", isDark ? "divide-white/[0.1]" : "divide-[var(--marketing-border)]"].join(" ")}>
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <span className={["text-[13px] font-medium", isDark ? "text-white/68" : "text-[var(--marketing-muted)]"].join(" ")}>
                {label}
              </span>
              <span className={["text-right text-[13px] font-semibold", isDark ? "text-white" : "text-[var(--marketing-text)]"].join(" ")}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
