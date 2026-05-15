"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/auth/session";
import { submitPayrollRun, type SubmitPayrollRunInput } from "@/lib/data/payroll";
import { routes } from "@/lib/routes";
import { requireAuthenticatedSupabaseClient, toSafeAppErrorMessage } from "@/lib/supabase/client";

export type SubmitPayrollRunActionState = {
  payrollRunId?: string;
  warning?: string;
  error?: string;
};

export async function submitPayrollRunAction(input: SubmitPayrollRunInput): Promise<SubmitPayrollRunActionState> {
  try {
    const user = await requireCurrentUser();
    await assertCompanyAccess(input.companyId, user.accessToken);
    const result = await submitPayrollRun(input, user.accessToken);
    revalidatePath(routes.payroll);
    revalidatePath(routes.documents);
    revalidatePath(routes.payrollRun(result.payrollRun.id));
    for (const documentId of result.payStubDocumentIds) {
      revalidatePath(routes.document(documentId));
    }
    revalidatePath(routes.overview);
    if (input.companyId) {
      revalidatePath(routes.company(input.companyId));
      revalidatePath(routes.companyEmployees(input.companyId));
    }

    return {
      payrollRunId: result.payrollRun.id,
      warning: result.failedPayStubDocumentIds.length > 0
        ? "Payroll was submitted, but some pay stubs need to be regenerated."
        : undefined,
    };
  } catch (error) {
    const message = toSafeAppErrorMessage(error);
    return { error: `Failed to submit payroll run: ${message}` };
  }
}

async function assertCompanyAccess(companyId: string, accessToken: string) {
  const client = requireAuthenticatedSupabaseClient(accessToken);
  const { data, error } = await client
    .from("companies")
    .select("id")
    .eq("id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(`company access check failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Company is unavailable or you do not have access.");
  }
}
