import { EmployeeProfilePage } from "@/components/employees/employee-profile-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getEmployeeForToken } from "@/lib/data/employees";
import { notFound } from "next/navigation";

export default async function EmployeeProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const employee = await getEmployeeForToken(id, user.accessToken);

  if (!employee) {
    notFound();
  }

  return <EmployeeProfilePage employee={employee} />;
}
