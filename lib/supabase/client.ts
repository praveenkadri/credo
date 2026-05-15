import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const SIGN_IN_REQUIRED_MESSAGE = "Sign in required to access this workspace.";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class SignInRequiredError extends Error {
  constructor(message = SIGN_IN_REQUIRED_MESSAGE) {
    super(message);
    this.name = "SignInRequiredError";
  }
}

export function requireSupabaseAccessToken(accessToken?: string | null) {
  const token = accessToken?.trim() ?? "";
  if (!token) {
    throw new SignInRequiredError();
  }

  return token;
}

export function createSupabaseClientForToken(accessToken: string) {
  const token = requireSupabaseAccessToken(accessToken);

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function requireAuthenticatedSupabaseClient(accessToken?: string | null) {
  return createSupabaseClientForToken(requireSupabaseAccessToken(accessToken));
}

export function isSignInRequiredError(error: unknown) {
  return error instanceof SignInRequiredError;
}

export function isSupabaseAuthRequiredError(error: unknown) {
  const candidate = error as { code?: unknown; message?: unknown } | null;
  const code = typeof candidate?.code === "string" ? candidate.code : "";
  const message = typeof candidate?.message === "string" ? candidate.message.toLowerCase() : "";

  return (
    code === "42501" ||
    code === "PGRST301" ||
    message.includes("permission denied") ||
    message.includes("row-level security") ||
    message.includes("jwt") ||
    message.includes("session")
  );
}

export function toSafeSupabaseErrorMessage(error: unknown) {
  return isSupabaseAuthRequiredError(error)
    ? SIGN_IN_REQUIRED_MESSAGE
    : error instanceof Error
      ? error.message
      : String(error);
}

export function toSafeAppErrorMessage(error: unknown) {
  if (isSignInRequiredError(error) || isSupabaseAuthRequiredError(error)) {
    return SIGN_IN_REQUIRED_MESSAGE;
  }

  return error instanceof Error ? error.message : String(error);
}
