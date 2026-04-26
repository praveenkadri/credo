import Link from "next/link";
import { CompanyProfileForm } from "@/components/companies/company-profile-form";
import { getCompanyProfile } from "@/lib/data/companies";
import { SoftNotice } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

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

export async function CompanyProfileSectionEditPage({
  companyId,
  title,
  description,
  section,
}: {
  companyId: string;
  title: string;
  description: string;
  section: "identity" | "address" | "tax" | "authorization";
}) {
  try {
    const profile = await getCompanyProfile(companyId);

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
      <div className="w-full pb-12">
        <div className="mx-auto mt-5 w-full max-w-[720px] shell-enter">
          <Link
            href={routes.companyProfile(companyId)}
            className={buttonClassName("secondary")}
          >
            ← Back
          </Link>

          <h1 className="mt-6 text-[34px] font-semibold tracking-[-0.04em] text-[#1f221c]">{title}</h1>
          <p className="mt-2 max-w-[640px] text-[14px] leading-[1.5] text-neutral-600">{description}</p>

          <div className="mt-8">
            <CompanyProfileForm mode="edit" companyId={companyId} defaultProfile={profile} focusSection={section} />
          </div>
        </div>
      </div>
    );
  } catch {
    return (
      <ProfileState
        title="We couldn’t load this company profile"
        detail="Try again. If this keeps happening, check your connection and data access settings."
        retryHref={routes.companyProfileSectionEdit(companyId, section)}
      />
    );
  }
}
