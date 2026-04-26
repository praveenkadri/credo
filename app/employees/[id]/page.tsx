import { EmployeeProfilePage } from "@/components/employees/employee-profile-page";

export default async function EmployeeProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EmployeeProfilePage employeeId={id} />;
}
