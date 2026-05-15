import Link from "next/link";
import { BrandIcon, EntityAvatar, type BrandIconName, type BrandTone } from "@/components/brand/brand-visuals";
import type { CompanyProfile } from "@/lib/data/companies";
import { SuccessToast } from "@/components/system/SuccessToast";
import { buttonClassName } from "@/components/ui-primitives/button";
import { DetailField, DetailFieldGrid } from "@/components/ui-patterns/detail-field-grid";
import { APP_LAYOUT } from "@/components/ui-shell/layout-constants";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

function SectionCard({
  title,
  editHref,
  icon,
  tone = "sand",
  children,
}: {
  title: string;
  editHref: string;
  icon: BrandIconName;
  tone?: BrandTone;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-[#fafaf7] p-6 shadow-[0_1px_1px_rgba(31,34,28,0.02)] md:p-7">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <BrandIcon icon={icon} tone={tone} size="sm" />
          <h2 className="type-card-title">{title}</h2>
        </div>
        <Link
          href={editHref}
          className={buttonClassName("subtle")}
        >
          Edit
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function CompanyProfileView({
  profile,
  mode = "profile",
  footer,
  successToastMessage,
}: {
  profile: CompanyProfile;
  mode?: "profile" | "confirm";
  footer?: React.ReactNode;
  successToastMessage?: string;
}) {
  const isConfirm = mode === "confirm";
  const backHref = isConfirm ? routes.companyProfileEdit(profile.id) : routes.company(profile.id);
  const heading = isConfirm ? "Review company profile" : "Company profile";
  const description = isConfirm
    ? "Confirm these details before completing company setup."
    : "Review company information, tax details, and authorization settings.";

  return (
    <div className="w-full pb-12">
      <SuccessToast message={successToastMessage} />
      <div className={cn("mx-auto mt-5 w-full shell-enter", APP_LAYOUT.focusedContentMaxWidth)}>
        <Link
          href={backHref}
          className={buttonClassName("secondary")}
        >
          <span aria-hidden="true">←</span> Back
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <EntityAvatar type="company" name={profile.companyName} size="md" />
          <h1 className="type-page-title">{heading}</h1>
        </div>
        <p className={cn("type-body mt-2 text-neutral-600", APP_LAYOUT.focusedDescriptionMaxWidth)}>
          {description}
        </p>

        <div className="mt-8 space-y-5">
          <SectionCard title="Company identity" icon="building" tone="sand" editHref={routes.companyProfileSectionEdit(profile.id, "identity")}>
            <DetailFieldGrid>
              <DetailField label="Company name" value={profile.companyName} />
              <DetailField label="Legal name" value={profile.legalName} />
              <DetailField label="Business established" value={profile.establishedDate} />
            </DetailFieldGrid>
            {profile.logoUrl ? (
              <div className="mt-4 rounded-2xl bg-[#f3f4ef] p-3">
                <p className="type-caption text-neutral-500">Company logo</p>
                <img src={profile.logoUrl} alt="Company logo" className="mt-2 h-16 w-16 rounded-xl object-cover" />
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Address" icon="profile" tone="sky" editHref={routes.companyProfileSectionEdit(profile.id, "address")}>
            <DetailFieldGrid>
              <DetailField label="Street address" value={profile.streetAddress} />
              <DetailField label="Unit/suite" value={profile.unitSuite} />
              <DetailField label="City" value={profile.city} />
              <DetailField label="Province/state" value={profile.provinceState} />
              <DetailField label="Postal code" value={profile.postalCode} />
              <DetailField label="Country" value={profile.country} />
            </DetailFieldGrid>
          </SectionCard>

          <SectionCard title="Tax details" icon="tax" tone="lavender" editHref={routes.companyProfileSectionEdit(profile.id, "tax")}>
            <DetailFieldGrid>
              <DetailField label="HST number" value={profile.hstNumber} />
              <DetailField label="Payroll number" value={profile.payrollNumber} />
              <DetailField label="BIN number" value={profile.binNumber} />
              <DetailField label="Business number" value={profile.businessNumber} />
              <DetailField label="Fiscal year end" value={profile.fiscalYearEnd} />
            </DetailFieldGrid>
          </SectionCard>

          <SectionCard title="Authorization" icon="compliance" tone="sand" editHref={routes.companyProfileSectionEdit(profile.id, "authorization")}>
            <DetailFieldGrid>
              <DetailField label="Director name" value={profile.directorName} />
              <DetailField label="Director title" value={profile.directorTitle} />
            </DetailFieldGrid>
            {profile.signatureUrl ? (
              <div className="mt-4 rounded-2xl bg-[#f3f4ef] p-3">
                <p className="type-caption text-neutral-500">Director signature</p>
                <img
                  src={profile.signatureUrl}
                  alt="Director signature"
                  className="mt-2 h-14 w-[180px] rounded-xl object-contain"
                />
              </div>
            ) : (
              <p className="type-caption mt-3 text-neutral-500">Missing information</p>
            )}
          </SectionCard>

          <SectionCard title="Documents/assets" icon="document" tone="lavender" editHref={routes.companyProfileSectionEdit(profile.id, "identity")}>
            <DetailFieldGrid>
              <DetailField label="Company logo" value={profile.logoUrl ? "Uploaded" : ""} />
              <DetailField label="Director signature" value={profile.signatureUrl ? "Uploaded" : ""} />
            </DetailFieldGrid>
          </SectionCard>
        </div>
        {footer ? <div className="mt-6">{footer}</div> : null}
        {!isConfirm ? (
          <div className="mt-8 border-t border-black/[0.04] pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="type-card-title">Delete company</h2>
                <p className="type-body-small mt-1 text-neutral-600">
                  Remove this company from active workspace views.
                </p>
              </div>
              <Link href={routes.companyDelete(profile.id)} className={buttonClassName("destructive")}>
                Delete company
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
