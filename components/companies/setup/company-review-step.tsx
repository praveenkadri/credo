import { ReviewSectionCard } from "@/components/companies/setup/review-section-card";
import type { CompanySetupStep, CompanySetupValues } from "@/components/companies/setup/types";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 py-1.5 md:grid-cols-[170px_minmax(0,1fr)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-neutral-400">{label}</p>
      <p className="text-[13px] text-neutral-700">{value.trim() ? value : "Not set"}</p>
    </div>
  );
}

export function CompanyReviewStep({
  values,
  hasLogoFile,
  hasSignatureFile,
  onEditStep,
}: {
  values: CompanySetupValues;
  hasLogoFile: boolean;
  hasSignatureFile: boolean;
  onEditStep: (step: CompanySetupStep) => void;
}) {
  return (
    <div className="space-y-4">
      <ReviewSectionCard title="Company identity" onEdit={() => onEditStep(1)}>
        <Row label="Company name" value={values.companyName} />
        <Row label="Legal name" value={values.legalName} />
        <Row label="Established" value={values.establishedDate} />
        <Row label="Logo" value={hasLogoFile ? "Ready" : "Not uploaded"} />
      </ReviewSectionCard>

      <ReviewSectionCard title="Address" onEdit={() => onEditStep(3)}>
        <Row label="Address" value={values.streetAddress} />
        <Row label="Unit/suite" value={values.unitSuite} />
        <Row label="City" value={values.city} />
        <Row label="Province" value={values.provinceState} />
        <Row label="Postal code" value={values.postalCode} />
        <Row label="Country" value={values.country} />
      </ReviewSectionCard>

      <ReviewSectionCard title="Tax details" onEdit={() => onEditStep(5)}>
        <Row label="BIN number" value={values.binNumber} />
        <Row label="Payroll number" value={values.payrollNumber} />
        <Row label="HST number" value={values.hstNumber} />
        <Row label="Business number" value={values.businessNumber} />
        <Row label="Fiscal year end" value={values.fiscalYearEnd} />
      </ReviewSectionCard>

      <ReviewSectionCard title="Authorization" onEdit={() => onEditStep(7)}>
        <Row label="Director name" value={values.directorName} />
        <Row label="Director title" value={values.directorTitle} />
        <Row label="Signature" value={hasSignatureFile ? "Ready" : "Not uploaded"} />
      </ReviewSectionCard>
    </div>
  );
}
