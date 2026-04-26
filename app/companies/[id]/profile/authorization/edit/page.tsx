import { CompanyProfileSectionEditPage } from "@/components/companies/profile-section-edit-page";

export default async function CompanyProfileAuthorizationEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return CompanyProfileSectionEditPage({
    companyId: id,
    title: "Edit authorization",
    description: "Update director details and signature when ready.",
    section: "authorization",
  });
}
