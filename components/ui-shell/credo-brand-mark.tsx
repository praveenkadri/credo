import { BRAND_MARK } from "@/components/ui-shell/layout-constants";
import { cn } from "@/lib/utils";

export function CredoBrandMark({
  anchored = false,
  className,
}: {
  anchored?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        BRAND_MARK.typography,
        anchored ? `absolute ${BRAND_MARK.insetX} ${BRAND_MARK.insetY}` : "",
        className
      )}
    >
      Credo
    </div>
  );
}
