import { ComingSoonPage } from "@/components/ui-shell/coming-soon-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";

export default async function InsightsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  return (
    <ComingSoonPage
      title="Payroll reports"
      description="Track payroll activity, company totals, and records over time."
      visual="insights"
    />
  );
}
