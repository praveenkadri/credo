import { CredoBrandMark } from "@/components/ui-shell/credo-brand-mark";
import { APP_LAYOUT } from "@/components/ui-shell/layout-constants";
import { cn } from "@/lib/utils";

export function CompanySetupShell({
  children,
  mode = "default",
}: {
  children: React.ReactNode;
  mode?: "first" | "default";
}) {
  const isFirstMode = mode === "first";

  return (
    <div className="relative w-full pb-8">
      {isFirstMode ? <CredoBrandMark anchored /> : null}
      <div className={cn("mx-auto mt-2 w-full shell-enter", APP_LAYOUT.focusedContentMaxWidth)}>
        {children}
      </div>
    </div>
  );
}
