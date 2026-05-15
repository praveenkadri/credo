import { PayrollRunDetailPage } from "@/components/payroll/payroll-run-detail-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getPayrollRunForToken, listPayrollRunDocumentsForToken, listPayrollRunEmployeesForToken } from "@/lib/data/payroll";
import { notFound } from "next/navigation";

export default async function PayrollRunDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const run = await getPayrollRunForToken(id, user.accessToken);

  if (!run) {
    notFound();
  }

  const [lineItems, documents] = await Promise.all([
    listPayrollRunEmployeesForToken(id, user.accessToken),
    listPayrollRunDocumentsForToken(id, user.accessToken),
  ]);

  return <PayrollRunDetailPage run={run} lineItems={lineItems} documents={documents} />;
}
