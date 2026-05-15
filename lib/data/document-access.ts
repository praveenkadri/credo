import "server-only";

import { requireCurrentUser } from "@/lib/auth/session";
import {
  requireAuthenticatedSupabaseClient,
  toSafeSupabaseErrorMessage,
} from "@/lib/supabase/client";

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60;
const MAX_SIGNED_URL_TTL_SECONDS = 300;

const DOCUMENT_ACCESS_SELECT = [
  "id",
  "company_id",
  "type",
  "document_type_id",
  "generation_status",
  "storage_bucket",
  "storage_path",
  "file_name",
  "mime_type",
  "file_size_bytes",
].join(",");

type SupabaseClient = ReturnType<typeof requireAuthenticatedSupabaseClient>;

type DocumentAccessRow = {
  id: string;
  company_id?: string | null;
  type?: string | null;
  document_type_id?: string | null;
  generation_status?: string | null;
  storage_bucket?: string | null;
  storage_path?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | string | null;
};

export type CreateDocumentSignedUrlOptions = {
  expiresInSeconds?: number;
  sessionAccessToken?: string;
  download?: boolean;
};

export type DocumentSignedUrlResult = {
  signedUrl: string;
  expiresAt: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
};

export type DocumentFileAccessState = {
  documentId: string;
  canAccess: boolean;
  hasFile: boolean;
  generationStatus: string;
  fileName?: string;
  mimeType?: string;
  fileSizeBytes?: number;
  error?: string;
};

export async function createDocumentSignedUrl(
  documentId: string,
  options: CreateDocumentSignedUrlOptions = {}
): Promise<DocumentSignedUrlResult> {
  const accessToken = await resolveAccessToken(options.sessionAccessToken);
  const client = requireAuthenticatedSupabaseClient(accessToken);
  await requireAuthenticatedUser(client);

  const document = await loadAccessibleDocument(client, documentId);
  const bucket = requiredDocumentField(document.storage_bucket, "Document file is not available.");
  const path = requiredDocumentField(document.storage_path, "Document file is not available.");

  const exists = await storageObjectExists(client, bucket, path);
  if (!exists) {
    throw new Error("Document file is not available.");
  }

  const expiresIn = normalizeExpiry(options.expiresInSeconds);
  const signedUrlOptions = options.download
    ? { download: document.file_name?.trim() || undefined }
    : undefined;
  const { data, error } = await client.storage.from(bucket).createSignedUrl(path, expiresIn, signedUrlOptions);

  if (error || !data?.signedUrl) {
    throw new Error(`Unable to create document access link: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return {
    signedUrl: data.signedUrl,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    fileName: document.file_name?.trim() || undefined,
    mimeType: document.mime_type?.trim() || undefined,
    fileSizeBytes: toOptionalNumber(document.file_size_bytes),
  };
}

export async function getDocumentFileAccessState(
  documentId: string,
  options: { sessionAccessToken?: string } = {}
): Promise<DocumentFileAccessState> {
  try {
    const accessToken = await resolveAccessToken(options.sessionAccessToken);
    const client = requireAuthenticatedSupabaseClient(accessToken);
    await requireAuthenticatedUser(client);
    const document = await loadAccessibleDocument(client, documentId);
    const bucket = document.storage_bucket?.trim();
    const path = document.storage_path?.trim();
    const hasFile = Boolean(bucket && path && (await storageObjectExists(client, bucket, path)));

    return {
      documentId: document.id,
      canAccess: true,
      hasFile,
      generationStatus: document.generation_status?.trim() || "pending",
      fileName: document.file_name?.trim() || undefined,
      mimeType: document.mime_type?.trim() || undefined,
      fileSizeBytes: toOptionalNumber(document.file_size_bytes),
    };
  } catch (error) {
    return {
      documentId,
      canAccess: false,
      hasFile: false,
      generationStatus: "unavailable",
      error: safeDocumentAccessError(error),
    };
  }
}

async function resolveAccessToken(sessionAccessToken?: string) {
  const token = sessionAccessToken?.trim();
  if (token) return token;
  return (await requireCurrentUser()).accessToken;
}

async function loadAccessibleDocument(client: SupabaseClient, documentId: string) {
  const id = documentId.trim();
  if (!id) throw new Error("Document id is required.");

  const { data, error } = await client
    .from("documents")
    .select(DOCUMENT_ACCESS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to load document: ${toSafeSupabaseErrorMessage(error)}`);
  }

  if (!data) {
    throw new Error("Document is unavailable.");
  }

  return data as unknown as DocumentAccessRow;
}

async function storageObjectExists(client: SupabaseClient, bucket: string, path: string) {
  const { data, error } = await client
    .schema("storage")
    .from("objects")
    .select("id")
    .eq("bucket_id", bucket)
    .eq("name", path)
    .maybeSingle();

  if (error) {
    throw new Error(`Unable to verify document file: ${toSafeSupabaseErrorMessage(error)}`);
  }

  return Boolean(data);
}

async function requireAuthenticatedUser(client: SupabaseClient) {
  const { data, error } = await client.auth.getUser();
  if (error || !data.user?.id) {
    throw new Error("Sign in required to access this document.");
  }
}

function normalizeExpiry(value?: number) {
  if (!value || !Number.isFinite(value)) return DEFAULT_SIGNED_URL_TTL_SECONDS;
  return Math.max(1, Math.min(Math.floor(value), MAX_SIGNED_URL_TTL_SECONDS));
}

function requiredDocumentField(value: string | null | undefined, message: string) {
  const normalized = value?.trim() ?? "";
  if (!normalized) throw new Error(message);
  return normalized;
}

function toOptionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? next : undefined;
}

function safeDocumentAccessError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (/sign in|auth|jwt|permission|row-level security/i.test(message)) {
    return "Sign in required to access this document.";
  }

  if (/unavailable|not available|required/i.test(message)) {
    return message;
  }

  return "Document file is unavailable.";
}
