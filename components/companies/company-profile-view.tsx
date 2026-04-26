import Link from "next/link";
import type { CompanyProfile } from "@/lib/data/companies";
import { SuccessToast } from "@/components/system/SuccessToast";
import { buttonClassName } from "@/components/ui-primitives/button";
import { routes } from "@/lib/routes";

function SectionCard({
  title,
  editHref,
  children,
}: {
  title: string;
  editHref: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] bg-white/70 p-6 ring-1 ring-neutral-200/40 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[16px] font-semibold tracking-[-0.02em] text-[#1f221c]">{title}</h2>
        <Link
          href={editHref}
          className="inline-flex h-8 items-center rounded-lg px-2.5 text-[12px] font-medium text-neutral-600 transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-white/60 hover:text-neutral-900"
        >
          Edit
        </Link>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid gap-1.5 py-2 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
      <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-neutral-400">{label}</p>
      <p className="text-[14px] text-neutral-700">{value?.trim() ? value : "Missing information"}</p>
    </div>
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
      <div className="mx-auto mt-5 w-full max-w-[720px] shell-enter">
        <Link
          href={backHref}
          className={buttonClassName("secondary")}
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-[34px] font-semibold tracking-[-0.04em] text-[#1f221c]">{heading}</h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-[1.5] text-neutral-600">
          {description}
        </p>

        <div className="mt-8 space-y-5">
          <SectionCard title="Company identity" editHref={routes.companyProfileSectionEdit(profile.id, "identity")}>
            <div className="space-y-1">
              <Row label="Company name" value={profile.companyName} />
              <Row label="Legal name" value={profile.legalName} />
              <Row label="Business established" value={profile.establishedDate} />
            </div>
            {profile.logoUrl ? (
              <div className="mt-4 rounded-2xl bg-white/60 p-3 ring-1 ring-neutral-200/50">
                <p className="text-[12px] text-neutral-500">Company logo</p>
                <img src={profile.logoUrl} alt="Company logo" className="mt-2 h-16 w-16 rounded-xl object-cover" />
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="Address" editHref={routes.companyProfileSectionEdit(profile.id, "address")}>
            <div className="space-y-1">
              <Row label="Street address" value={profile.streetAddress} />
              <Row label="Unit/suite" value={profile.unitSuite} />
              <Row label="City" value={profile.city} />
              <Row label="Province/state" value={profile.provinceState} />
              <Row label="Postal code" value={profile.postalCode} />
              <Row label="Country" value={profile.country} />
            </div>
          </SectionCard>

          <SectionCard title="Tax details" editHref={routes.companyProfileSectionEdit(profile.id, "tax")}>
            <div className="space-y-1">
              <Row label="HST number" value={profile.hstNumber} />
              <Row label="Payroll number" value={profile.payrollNumber} />
              <Row label="BIN number" value={profile.binNumber} />
              <Row label="Business number" value={profile.businessNumber} />
              <Row label="Fiscal year end" value={profile.fiscalYearEnd} />
            </div>
          </SectionCard>

          <SectionCard title="Authorization" editHref={routes.companyProfileSectionEdit(profile.id, "authorization")}>
            <div className="space-y-1">
              <Row label="Director name" value={profile.directorName} />
              <Row label="Director title" value={profile.directorTitle} />
            </div>
            {profile.signatureUrl ? (
              <div className="mt-4 rounded-2xl bg-white/60 p-3 ring-1 ring-neutral-200/50">
                <p className="text-[12px] text-neutral-500">Director signature</p>
                <img
                  src={profile.signatureUrl}
                  alt="Director signature"
                  className="mt-2 h-14 w-[180px] rounded-xl object-contain"
                />
              </div>
            ) : (
              <p className="mt-3 text-[13px] text-neutral-500">Missing information</p>
            )}
          </SectionCard>

          <SectionCard title="Documents/assets" editHref={routes.companyProfileSectionEdit(profile.id, "identity")}>
            <div className="space-y-1">
              <Row label="Company logo" value={profile.logoUrl ? "Uploaded" : ""} />
              <Row label="Director signature" value={profile.signatureUrl ? "Uploaded" : ""} />
            </div>
          </SectionCard>
        </div>
        {footer ? <div className="mt-6">{footer}</div> : null}
      </div>
    </div>
  );
}
