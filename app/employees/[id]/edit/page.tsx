import { notFound, redirect } from "next/navigation";
import { EmployeeFormPage } from "@/components/employees/employee-form-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getEmployeeForToken } from "@/lib/data/employees";
import type { EmployeeEditSection } from "@/lib/routes";

const VALID_SECTIONS = new Set<EmployeeEditSection>(["personal", "employment", "identity", "compensation", "payroll"]);

export default async function EditEmployeeRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ section?: string }>;
}) {
  const { id } = await params;
  const { section } = await searchParams;

  if (!section || !VALID_SECTIONS.has(section as EmployeeEditSection)) {
    redirect(`/employees/${id}`);
  }

  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const employee = await getEmployeeForToken(id, user.accessToken);

  if (!employee) {
    notFound();
  }

  return <EmployeeFormPage mode="edit" employeeId={id} focusSection={section as EmployeeEditSection} existingEmployee={employee} />;
}
