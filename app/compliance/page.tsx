import { ComingSoonPage } from "@/components/ui-shell/coming-soon-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";

export default async function CompliancePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  return (
    <ComingSoonPage
      title="Compliance overview"
      description="Review setup items and company details needed for payroll readiness."
      visual="compliance"
    />
  );
}
