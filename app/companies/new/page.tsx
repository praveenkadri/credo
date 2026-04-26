import { CompanySetupFlow } from "@/components/companies/setup/company-setup-flow";
import { CompanySetupShell } from "@/components/companies/setup/company-setup-shell";
import { hasActiveCompanies } from "@/lib/data/companies";
import { ClientRedirect } from "@/components/system/client-redirect";
import { routes } from "@/lib/routes";

export default async function NewCompanyPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = params?.mode === "first" ? "first" : "default";

  if (mode === "first") {
    const hasCompanies = await hasActiveCompanies().catch(() => false);
    if (hasCompanies) {
      return <ClientRedirect href={routes.overview} />;
    }
  }

  return (
    <CompanySetupShell mode={mode}>
      <CompanySetupFlow mode={mode} />
    </CompanySetupShell>
  );
}
