import { cn } from "@/lib/utils";

export function StateTransition({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  return (
    <div className={cn("state-transition-enter", className)} style={{ animationDelay: `${delayMs}ms` }}>
      {children}
    </div>
  );
}
