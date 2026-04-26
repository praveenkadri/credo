import { redirect } from "next/navigation";
import { OverviewPageClient } from "@/components/overview/overview-page-client";
import { getCompanies, getCompanyProfile, getCompanySetupPrompts } from "@/lib/data/companies";
import { routes } from "@/lib/routes";

export default async function AppDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const query = await searchParams;

  const companies = await getCompanies().catch(() => null);

  if (companies === null) {
    return (
      <OverviewPageClient
        companies={[]}
        isEmpty
        isError
        showCompaniesSection={false}
        successToastMessage={query.deleted === "1" ? "Company deleted" : undefined}
      />
    );
  }

  if (!companies.length) {
    redirect(routes.firstCompanySetup());
  }

  try {
    const profile = await getCompanyProfile(companies[0].id);
    const setupPrompt = profile ? getCompanySetupPrompts(profile).primaryPrompt : undefined;

    return (
      <OverviewPageClient
        companies={companies}
        setupPrompt={setupPrompt}
        successToastMessage={query.deleted === "1" ? "Company deleted" : undefined}
      />
    );
  } catch {
    return (
      <OverviewPageClient
        companies={companies}
        successToastMessage={query.deleted === "1" ? "Company deleted" : undefined}
      />
    );
  }
}
