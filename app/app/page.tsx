import { OverviewPageClient } from "@/components/overview/overview-page-client";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompaniesForToken, getCompanyProfileForToken, getCompanySetupPrompts } from "@/lib/data/companies";

export default async function AppDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const query = await searchParams;
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const companies = await getCompaniesForToken(user.accessToken).catch(() => null);

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
    return (
      <OverviewPageClient
        companies={[]}
        isEmpty
        successToastMessage={query.deleted === "1" ? "Company deleted" : undefined}
      />
    );
  }

  try {
    const profile = await getCompanyProfileForToken(companies[0].id, user.accessToken);
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
