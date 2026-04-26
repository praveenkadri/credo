import { CompanyProfileSectionEditPage } from "@/components/companies/profile-section-edit-page";

export default async function CompanyProfileIdentityEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return CompanyProfileSectionEditPage({
    companyId: id,
    title: "Edit company identity",
    description: "Update core profile details when ready.",
    section: "identity",
  });
}
