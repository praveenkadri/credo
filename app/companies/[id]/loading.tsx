import { cn } from "@/lib/utils";
import { surfaceClass } from "@/components/ui/surface";
import { SoftNotice } from "@/components/system/SoftNotice";
import { SkeletonBlock } from "@/components/system/SkeletonBlock";
import { StateTransition } from "@/components/system/StateTransition";

export default function LoadingCompany() {
  return (
    <div className="w-full pb-12">
      <StateTransition className={cn("mt-2 px-6 py-5", surfaceClass("accountRow"))}>
        <SoftNotice
          title="Loading company data…"
          description="We’re loading company details and recent activity."
          variant="info"
        />
        <SkeletonBlock className="mt-4 h-11 w-56" rounded="rounded-full" />
        <SkeletonBlock className="mt-3 h-8 w-40" rounded="rounded-full" />
        <SkeletonBlock className="mt-5 h-28" rounded="rounded-2xl" />
      </StateTransition>

      <StateTransition className="mt-5 space-y-3" delayMs={40}>
        <SkeletonBlock className="h-20" rounded="rounded-2xl" />
        <SkeletonBlock className="h-20" rounded="rounded-2xl" />
        <SkeletonBlock className="h-20" rounded="rounded-2xl" />
      </StateTransition>
    </div>
  );
}
