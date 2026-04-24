import { CompanyDetailPage } from "@/components/company-detail/company-detail-page";

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CompanyDetailPage companyId={id} />;
}
