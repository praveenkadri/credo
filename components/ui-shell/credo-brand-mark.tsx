import { BRAND_MARK } from "@/components/ui-shell/layout-constants";
import { cn } from "@/lib/utils";

export function CredoBrandMark({
  anchored = false,
  compact = false,
  tone = "brand",
  className,
}: {
  anchored?: boolean;
  compact?: boolean;
  tone?: "brand" | "workspace";
  className?: string;
}) {
  const isWorkspace = tone === "workspace";
  const mark = (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[16px]",
        compact ? "size-10" : "size-9",
        isWorkspace
          ? "bg-[var(--credo-green-950)] text-[#fbfaf6] shadow-[0_12px_24px_rgba(18,54,44,0.14)] ring-1 ring-[rgba(184,135,79,0.22)]"
          : "bg-[var(--credo-green-950)] text-[#fbfaf6] shadow-[0_14px_30px_rgba(18,54,44,0.16),inset_0_1px_0_rgba(255,255,255,0.14)]"
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "absolute inset-[5px] rounded-[12px]",
          isWorkspace ? "bg-white/[0.07]" : "bg-white/[0.07]"
        )}
      />
      <span
        className={cn(
          "absolute right-[7px] top-[7px] size-1.5 rounded-full",
          isWorkspace ? "bg-[var(--credo-accent)] shadow-[0_0_0_3px_rgba(184,135,79,0.1)]" : "bg-[var(--credo-accent)]"
        )}
      />
      <span className="relative -mt-px text-[18px] font-semibold leading-none tracking-[-0.055em]">
        C
      </span>
    </span>
  );

  if (compact) {
    return (
      <span
        className={cn(
          anchored ? `absolute ${BRAND_MARK.insetX} ${BRAND_MARK.insetY}` : "",
          className
        )}
        aria-label="Credo"
      >
        {mark}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5",
        anchored ? `absolute ${BRAND_MARK.insetX} ${BRAND_MARK.insetY}` : "",
        className
      )}
      aria-label="Credo"
    >
      {mark}
      <span className={BRAND_MARK.typography}>Credo</span>
    </div>
  );
}
