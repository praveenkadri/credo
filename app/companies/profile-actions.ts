"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { confirmCompany, createCompany, softDeleteCompany, type DeleteCompanyReason, updateCompany } from "@/lib/data/companies";
import { isNextRedirectError } from "@/lib/is-next-redirect-error";
import { routes } from "@/lib/routes";
import { en } from "@/content/en";

export type CompanyProfileActionState = {
  error?: string;
};

export type DeleteCompanyActionState = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
};

function parseProfileInput(formData: FormData) {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const sameAsCompanyName = formData.get("sameAsCompanyName") === "on";
  const legalNameRaw = String(formData.get("legalName") ?? "").trim();
  const legalName = sameAsCompanyName ? companyName : legalNameRaw;

  if (!companyName) {
    return { error: en.actions.profile.companyNameRequired };
  }

  if (!legalName) {
    return { error: en.actions.profile.legalNameRequired };
  }

  const logoFileValue = formData.get("logoFile");
  const signatureFileValue = formData.get("signatureFile");

  const logoFile = logoFileValue instanceof File && logoFileValue.size > 0 ? logoFileValue : null;
  const signatureFile =
    signatureFileValue instanceof File && signatureFileValue.size > 0 ? signatureFileValue : null;

  return {
    input: {
      companyName,
      legalName,
      sameAsCompanyName,
      establishedDate: String(formData.get("establishedDate") ?? "").trim(),
      logoFile,
      existingLogoUrl: String(formData.get("existingLogoUrl") ?? "").trim(),
      streetAddress: String(formData.get("streetAddress") ?? "").trim(),
      unitSuite: String(formData.get("unitSuite") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      provinceState: String(formData.get("provinceState") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      formattedAddress: String(formData.get("formattedAddress") ?? "").trim(),
      addressSource: String(formData.get("addressSource") ?? "").trim(),
      addressVerified: String(formData.get("addressVerified") ?? "").trim() === "true",
      addressHasSubpremise: String(formData.get("addressHasSubpremise") ?? "").trim() === "true",
      latitude: String(formData.get("latitude") ?? "").trim(),
      longitude: String(formData.get("longitude") ?? "").trim(),
      sessionAccessToken: String(formData.get("sessionAccessToken") ?? "").trim(),
      sessionUserId: String(formData.get("sessionUserId") ?? "").trim(),
      sessionWorkspaceId: String(formData.get("sessionWorkspaceId") ?? "").trim(),
      hstNumber: String(formData.get("hstNumber") ?? "").trim(),
      payrollNumber: String(formData.get("payrollNumber") ?? "").trim(),
      binNumber: String(formData.get("binNumber") ?? "").trim(),
      businessNumber: String(formData.get("businessNumber") ?? "").trim(),
      fiscalYearEnd: String(formData.get("fiscalYearEnd") ?? "").trim(),
      directorName: String(formData.get("directorName") ?? "").trim(),
      directorTitle: String(formData.get("directorTitle") ?? "").trim(),
      signatureFile,
      existingSignatureUrl: String(formData.get("existingSignatureUrl") ?? "").trim(),
    },
  };
}

export async function createCompanyProfileAction(
  _prevState: CompanyProfileActionState,
  formData: FormData
): Promise<CompanyProfileActionState> {
  const parsed = parseProfileInput(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    const { id } = await createCompany(parsed.input);

    revalidatePath("/");

    if (id) {
      revalidatePath(routes.company(id));
      revalidatePath(routes.companyProfile(id));
      redirect(routes.companyCreated(id));
    }

    redirect(routes.home);
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: en.actions.profile.saveError };
  }
}

export async function updateCompanyProfileAction(
  companyId: string,
  _prevState: CompanyProfileActionState,
  formData: FormData
): Promise<CompanyProfileActionState> {
  const parsed = parseProfileInput(formData);
  if ("error" in parsed) {
    return { error: parsed.error };
  }

  try {
    await updateCompany(companyId, parsed.input);

    revalidatePath("/");
    revalidatePath(routes.company(companyId));
    revalidatePath(routes.companyProfile(companyId));
    redirect(routes.companyProfileSaved(companyId));
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: en.actions.profile.updateError };
  }
}

export async function confirmCompanyProfileAction(
  companyId: string,
  _prevState: CompanyProfileActionState
): Promise<CompanyProfileActionState> {
  try {
    await confirmCompany(companyId);
    revalidatePath("/");
    revalidatePath(routes.company(companyId));
    revalidatePath(routes.companyProfile(companyId));
    revalidatePath(routes.companyConfirm(companyId));
    redirect(routes.companyConfirmed(companyId));
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return { error: en.actions.profile.confirmError };
  }
}

const DELETE_REASONS: DeleteCompanyReason[] = [
  en.company.delete.reasons.createdByMistake,
  en.company.delete.reasons.noLongerActive,
  en.company.delete.reasons.duplicate,
  en.company.delete.reasons.movedSystem,
  en.company.delete.reasons.testingData,
  en.company.delete.reasons.other,
];

export async function deleteCompanyAction(
  companyId: string,
  _prevState: DeleteCompanyActionState,
  formData: FormData
): Promise<DeleteCompanyActionState> {
  const acknowledged = formData.get("confirmDelete") === "on";
  const reason = String(formData.get("deleteReason") ?? "").trim();
  const reasonNote = String(formData.get("deleteReasonNote") ?? "").trim();
  const sessionAccessToken = String(formData.get("sessionAccessToken") ?? "").trim();

  if (!acknowledged) {
    return {
      error: en.company.delete.acknowledgeError,
    };
  }

  if (!reason || !DELETE_REASONS.includes(reason as DeleteCompanyReason)) {
    return {
      error: en.company.delete.reasonRequiredError,
    };
  }

  try {
    const { redirectTo } = await softDeleteCompany({
      companyId,
      reason: reason as DeleteCompanyReason,
      reasonNote,
      sessionAccessToken,
    });

    revalidatePath("/");
    revalidatePath(routes.overview);
    revalidatePath(routes.dashboardAlias);
    revalidatePath(routes.companiesNew);
    revalidatePath(routes.company(companyId));
    revalidatePath(routes.companyProfile(companyId));

    return {
      success: true,
      redirectTo,
    };
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return {
      error: error instanceof Error ? error.message : en.company.delete.genericDeleteError,
    };
  }
}
