import { CompanyDetailPage } from "@/components/company-detail/company-detail-page";
import { getCompanyById } from "@/lib/data/companies";
import { getCompanyActivity } from "@/lib/data/company-activity";
import Link from "next/link";
import { SoftNotice } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";

function CompanyState({
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

export default async function CompanyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string; confirmed?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;

  try {
    const [company, activityGroups] = await Promise.all([getCompanyById(id), getCompanyActivity(id)]);

    if (!company) {
      return (
        <CompanyState
          title="Company not found"
          detail="This company may have been removed or is not available in your workspace."
          variant="warning"
        />
      );
    }

    const successToastMessage =
      query.created === "1"
        ? "Company created"
        : query.confirmed === "1"
          ? "Company confirmed"
          : undefined;

    return (
      <CompanyDetailPage
        company={company}
        activityGroups={activityGroups}
        successToastMessage={successToastMessage}
        clearCreateCompanyDraft={query.created === "1"}
      />
    );
  } catch {
    return (
      <CompanyState
        title="We couldn’t load this company"
        detail="Try again. If this keeps happening, check your connection and data access settings."
        retryHref={`/companies/${id}`}
      />
    );
  }
}
