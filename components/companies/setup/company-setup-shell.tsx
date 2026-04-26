import { CredoBrandMark } from "@/components/ui-shell/credo-brand-mark";

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
      <div className="mx-auto mt-2 w-full max-w-[700px] shell-enter">
        {children}
      </div>
    </div>
  );
}
