import { CompanyProfileSectionEditPage } from "@/components/companies/profile-section-edit-page";

export default async function CompanyProfileAddressEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return CompanyProfileSectionEditPage({
    companyId: id,
    title: "Edit company address",
    description: "Add or update address details for payroll and documents.",
    section: "address",
  });
}
