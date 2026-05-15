import { EmployeeListPage } from "@/components/employees/employee-list-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { listEmployeesForToken } from "@/lib/data/employees";

export default async function TeamPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const employees = await listEmployeesForToken(undefined, user.accessToken);
  return <EmployeeListPage employees={employees} />;
}
