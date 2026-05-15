"use server";

import { revalidatePath } from "next/cache";

import { createDocumentSignedUrl } from "@/lib/data/document-access";
import { generateAndStorePayStubPdf } from "@/lib/data/document-generation";
import { requireCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { toSafeAppErrorMessage } from "@/lib/supabase/client";

export type GeneratePayStubPdfActionState = {
  documentId?: string;
  payrollRunId?: string;
  error?: string;
};

export type CreateDocumentSignedUrlActionState = {
  signedUrl?: string;
  expiresAt?: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  error?: string;
};

export async function createDocumentSignedUrlAction(
  documentId: string
): Promise<CreateDocumentSignedUrlActionState> {
  const trimmedDocumentId = documentId.trim();
  if (!trimmedDocumentId) return { error: "Document id is required." };

  try {
    return await createDocumentSignedUrl(trimmedDocumentId);
  } catch (error) {
    return { error: `Unable to open document: ${toSafeAppErrorMessage(error)}` };
  }
}

export async function generatePayStubPdfAction(documentId: string): Promise<GeneratePayStubPdfActionState> {
  return generatePayStubPdfActionInternal(documentId, false);
}

export async function regeneratePayStubPdfAction(documentId: string): Promise<GeneratePayStubPdfActionState> {
  return generatePayStubPdfActionInternal(documentId, true);
}

async function generatePayStubPdfActionInternal(
  documentId: string,
  allowRegeneration: boolean
): Promise<GeneratePayStubPdfActionState> {
  const trimmedDocumentId = documentId.trim();
  if (!trimmedDocumentId) return { error: "Document id is required." };

  try {
    const accessToken = (await requireCurrentUser()).accessToken;
    const result = await generateAndStorePayStubPdf(trimmedDocumentId, accessToken, { allowRegeneration });
    revalidateGeneratedDocumentPaths(result.documentId, result.payrollRunId);

    return {
      documentId: result.documentId,
      payrollRunId: result.payrollRunId,
    };
  } catch (error) {
    return { error: `Failed to generate pay stub PDF: ${toSafeAppErrorMessage(error)}` };
  }
}

function revalidateGeneratedDocumentPaths(documentId: string, payrollRunId?: string) {
  revalidatePath(routes.documents);
  revalidatePath(`/documents/${documentId}`);
  revalidatePath(routes.payroll);

  if (payrollRunId) {
    revalidatePath(routes.payrollRun(payrollRunId));
  }
}
