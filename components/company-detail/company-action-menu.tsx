"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui-primitives/button";
import { CompanyIcon } from "@/components/company-detail/company-detail-icons";
import type { RightRailAction } from "@/components/company-detail/company-detail-data";

const actionClassName = [
  buttonClassName("menuItem"),
  "group h-auto gap-3 py-2.5 text-[#2f342a]",
].join(" ");

export function CompanyActionMenu({ actions }: { actions: RightRailAction[] }) {
  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const content = (
          <>
            <CompanyIcon name={action.icon} className="size-7 rounded-xl [&_svg]:size-3.5" />
            <span>{action.label}</span>
          </>
        );

        return action.href ? (
          <Link key={action.id} href={action.href} className={actionClassName} aria-label={action.label}>
            {content}
          </Link>
        ) : null;
      })}
    </div>
  );
}
