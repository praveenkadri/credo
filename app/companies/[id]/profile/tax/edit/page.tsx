import { CompanyProfileSectionEditPage } from "@/components/companies/profile-section-edit-page";

export default async function CompanyProfileTaxEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return CompanyProfileSectionEditPage({
    companyId: id,
    title: "Edit tax details",
    description: "Add tax and payroll identifiers when convenient.",
    section: "tax",
  });
}
