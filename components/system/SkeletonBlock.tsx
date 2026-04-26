import { cn } from "@/lib/utils";

export function SkeletonBlock({
  className,
  rounded = "rounded-xl",
  subtle = false,
}: {
  className?: string;
  rounded?: "rounded-full" | "rounded-lg" | "rounded-xl" | "rounded-2xl";
  subtle?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton-block w-full",
        subtle ? "bg-neutral-200/55" : "bg-neutral-200/70",
        rounded,
        className
      )}
    />
  );
}
