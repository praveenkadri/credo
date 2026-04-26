import { cn } from "@/lib/utils";
import { surfaceClass } from "@/components/ui/surface";
import { SoftNotice } from "@/components/system/SoftNotice";
import { SkeletonBlock } from "@/components/system/SkeletonBlock";
import { StateTransition } from "@/components/system/StateTransition";

export default function Loading() {
  return (
    <div className="w-full pb-12">
      <StateTransition className={cn("mt-2 px-6 py-5", surfaceClass("chartSurface"))}>
        <SoftNotice
          title="Loading company data…"
          description="Please wait while we fetch your latest company updates."
          variant="info"
        />
        <SkeletonBlock className="mt-3 h-3 w-28" rounded="rounded-full" />
        <SkeletonBlock className="mt-3 h-10 w-72" rounded="rounded-full" />
        <SkeletonBlock className="mt-5 h-[248px]" rounded="rounded-xl" />
      </StateTransition>
      <StateTransition className={cn("mt-4 px-6 py-5", surfaceClass("accountRow"))} delayMs={40}>
        <SkeletonBlock className="h-3 w-24" rounded="rounded-full" />
        <SkeletonBlock className="mt-3 h-5 w-44" rounded="rounded-full" />
        <SkeletonBlock className="mt-4 h-20" rounded="rounded-2xl" />
        <SkeletonBlock className="mt-3 h-20" rounded="rounded-2xl" />
      </StateTransition>
    </div>
  );
}
