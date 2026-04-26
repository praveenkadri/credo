"use client";

import { useEffect } from "react";

const COMPANY_SETUP_DRAFT_KEY = "credo:create-company:draft";

export function ClearCreateCompanyDraft({ shouldClear }: { shouldClear: boolean }) {
  useEffect(() => {
    if (!shouldClear) return;
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(COMPANY_SETUP_DRAFT_KEY);
  }, [shouldClear]);

  return null;
}
