import Link from "next/link";
import { buttonClassName } from "@/components/ui-primitives/button";
import { surfaceClass } from "@/components/ui/surface";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function ComingSoonPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full pb-12">
      <section className={cn("shell-enter px-6 py-6", surfaceClass("softGlass"))}>
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-400">Workspace</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-neutral-900">{title}</h1>
        <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-neutral-600">{description}</p>

        <div className="mt-5 flex items-center gap-3">
          <Link
            href={routes.overview}
            className={buttonClassName("primary")}
          >
            Go to overview
          </Link>
          <Link
            href={routes.companiesNew}
            className={buttonClassName("secondary")}
          >
            Add company
          </Link>
        </div>
      </section>
    </div>
  );
}
