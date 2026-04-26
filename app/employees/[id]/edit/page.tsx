import { redirect } from "next/navigation";
import { EmployeeFormPage } from "@/components/employees/employee-form-page";
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

  return <EmployeeFormPage mode="edit" employeeId={id} focusSection={section as EmployeeEditSection} />;
}
