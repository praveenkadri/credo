"use client";

import { useEffect, useState } from "react";
import { RunPayrollModal } from "@/components/payroll/run-payroll-modal";

export function RunPayrollPageClient({ autoOpenWizard = false }: { autoOpenWizard?: boolean }) {
  const [open, setOpen] = useState(autoOpenWizard);

  useEffect(() => {
    if (autoOpenWizard) {
      setOpen(true);
    }
  }, [autoOpenWizard]);

  return <RunPayrollModal open={open} onClose={() => setOpen(false)} />;
}
