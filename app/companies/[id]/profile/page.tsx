import { CompanyProfileView } from "@/components/companies/company-profile-view";
import { getCompanyProfile } from "@/lib/data/companies";
import Link from "next/link";
import { SoftNotice } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";

function ProfileState({
  title,
  detail,
  retryHref,
  variant = "error",
}: {
  title: string;
  detail: string;
  retryHref?: string;
  variant?: "warning" | "error";
}) {
  return (
    <div className="w-full pb-12">
      <section className="mt-2 px-6 py-5">
        <SoftNotice title={title} description={detail} variant={variant} />
        {retryHref ? (
          <Link href={retryHref} className={`mt-4 ${buttonClassName("secondary")}`}>
            Try again
          </Link>
        ) : null}
      </section>
    </div>
  );
}

export default async function CompanyProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  try {
    const profile = await getCompanyProfile(id);

    if (!profile) {
      return (
        <ProfileState
          title="Company not found"
          detail="This company may have been removed or is not available in your workspace."
          variant="warning"
        />
      );
    }

    return (
      <CompanyProfileView
        profile={profile}
        successToastMessage={query.saved === "1" ? "Details saved" : undefined}
      />
    );
  } catch {
    return (
      <ProfileState
        title="We couldn’t load this company profile"
        detail="Try again. If this keeps happening, check your connection and data access settings."
        retryHref={`/companies/${id}/profile`}
      />
    );
  }
}
