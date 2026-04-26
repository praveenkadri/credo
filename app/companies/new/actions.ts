"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CompanyCreateError, createCompany } from "@/lib/data/companies";
import { isNextRedirectError } from "@/lib/is-next-redirect-error";
import { routes } from "@/lib/routes";
import { en } from "@/content/en";

export type CreateCompanySetupActionState = {
  fieldErrors?: {
    companyName?: string;
    address?: string;
  };
  error?: {
    title: string;
    description: string;
  };
};

export async function createCompanySetupAction(
  _prevState: CreateCompanySetupActionState,
  formData: FormData
): Promise<CreateCompanySetupActionState> {
  const companyName = String(formData.get("companyName") ?? "").trim();
  const sameAsCompanyName = formData.get("sameAsCompanyName") === "on";
  const legalNameRaw = String(formData.get("legalName") ?? "").trim();
  const legalName = sameAsCompanyName ? companyName : legalNameRaw;

  if (!companyName) {
    return {
      fieldErrors: { companyName: en.company.create.companyNameRequired },
    };
  }

  if (!legalName) {
    return {
      error: {
        title: en.actions.createCompany.cannotCreateTitle,
        description: en.actions.createCompany.legalNameMissing,
      },
    };
  }

  const streetAddress = String(formData.get("streetAddress") ?? "").trim();
  if (!streetAddress) {
    return {
      fieldErrors: { address: en.company.create.addressRequired },
    };
  }

  const addressSource = String(formData.get("addressSource") ?? "").trim();
  const addressVerified = String(formData.get("addressVerified") ?? "").trim() === "true";
  const addressHasSubpremise = String(formData.get("addressHasSubpremise") ?? "").trim() === "true";
  const latitude = String(formData.get("latitude") ?? "").trim();
  const longitude = String(formData.get("longitude") ?? "").trim();
  const formattedAddress = String(formData.get("formattedAddress") ?? "").trim();
  const sessionAccessToken = String(formData.get("sessionAccessToken") ?? "").trim();
  const sessionUserId = String(formData.get("sessionUserId") ?? "").trim();
  const sessionWorkspaceId = String(formData.get("sessionWorkspaceId") ?? "").trim();

  const logoFileValue = formData.get("logoFile");
  const signatureFileValue = formData.get("signatureFile");

  const logoFile = logoFileValue instanceof File && logoFileValue.size > 0 ? logoFileValue : null;
  const signatureFile =
    signatureFileValue instanceof File && signatureFileValue.size > 0 ? signatureFileValue : null;

  try {
    const { id } = await createCompany({
      companyName,
      legalName,
      sameAsCompanyName,
      establishedDate: String(formData.get("establishedDate") ?? "").trim(),
      logoFile,
      streetAddress,
      unitSuite: String(formData.get("unitSuite") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      provinceState: String(formData.get("provinceState") ?? "").trim(),
      postalCode: String(formData.get("postalCode") ?? "").trim(),
      country: String(formData.get("country") ?? "").trim(),
      formattedAddress,
      addressSource,
      addressVerified,
      addressHasSubpremise,
      latitude,
      longitude,
      sessionAccessToken,
      sessionUserId,
      sessionWorkspaceId,
      hstNumber: String(formData.get("hstNumber") ?? "").trim(),
      payrollNumber: String(formData.get("payrollNumber") ?? "").trim(),
      binNumber: String(formData.get("binNumber") ?? "").trim(),
      businessNumber: String(formData.get("businessNumber") ?? "").trim(),
      fiscalYearEnd: String(formData.get("fiscalYearEnd") ?? "").trim(),
      directorName: String(formData.get("directorName") ?? "").trim(),
      directorTitle: String(formData.get("directorTitle") ?? "").trim(),
      signatureFile,
    });

    revalidatePath("/");

    if (id) {
      revalidatePath(routes.company(id));
      revalidatePath(routes.companyProfile(id));
      redirect(routes.companyCreated(id));
    }

    redirect(routes.overview);
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    if (error instanceof CompanyCreateError) {
      const debugDetails =
        process.env.NODE_ENV !== "production"
          ? [error.code ? `code=${error.code}` : "", error.message].filter(Boolean).join(" · ")
          : "";
      const description = debugDetails ? `${error.userMessage} (${debugDetails})` : error.userMessage;

      if (error.field === "companyName") {
        return { fieldErrors: { companyName: description } };
      }

      if (error.field === "address") {
        return { fieldErrors: { address: description } };
      }

      return {
        error: {
          title: en.actions.createCompany.cannotCreateTitle,
          description,
        },
      };
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("createCompanySetupAction failed", error);
    }

    return {
      error: {
        title: en.actions.createCompany.cannotCreateTitle,
        description: en.actions.createCompany.genericDescription,
      },
    };
  }
}
