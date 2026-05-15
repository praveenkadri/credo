import { cn } from "@/lib/utils";

export function DetailFieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

export function DetailField({
  label,
  value,
  emptyLabel = "Missing information",
  numeric = false,
}: {
  label: string;
  value?: string;
  emptyLabel?: string;
  numeric?: boolean;
}) {
  const hasValue = Boolean(value?.trim());

  return (
    <div className="min-w-0 rounded-2xl bg-[#f7f7f4] px-4 py-3.5">
      <p className="type-eyebrow text-neutral-400">{label}</p>
      <p
        className={cn(
          "type-body mt-1 truncate",
          numeric ? "numeric-tabular" : "",
          hasValue ? "text-[#1f221c]" : "text-neutral-500"
        )}
      >
        {hasValue ? value : emptyLabel}
      </p>
    </div>
  );
}
