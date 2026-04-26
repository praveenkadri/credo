"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ClientRedirect({ href }: { href: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentQuery = searchParams.toString();
    const currentHref = currentQuery ? `${pathname}?${currentQuery}` : pathname;

    if (currentHref === href) {
      return;
    }

    router.replace(href);
  }, [href, pathname, router, searchParams]);

  return null;
}
