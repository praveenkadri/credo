import { surfaceClass } from "@/components/ui/surface";
import { EmptyState } from "@/components/system/EmptyState";
import { cn } from "@/lib/utils";

export function CashMovementNoActivity() {
  return (
    <section className={cn(surfaceClass("chartSurface"), "shell-enter shell-enter-delay-2 px-5 py-4") }>
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#93988f]">Cash movement</p>
        <h2 className="mt-2 text-[60px] font-medium leading-none tracking-[-0.05em] text-neutral-950">$0.00</h2>
        <p className="mt-2 text-[17px] font-medium tracking-[-0.02em] text-[#6e736b]">No payroll activity yet</p>
      </div>

      <div className="mt-3 h-[280px]">
        <EmptyState
          title="No company activity yet"
          description="Run payroll or create invoices to start tracking activity."
          variant="warning"
          className="flex h-full flex-col justify-center text-center"
        />
      </div>
    </section>
  );
}
