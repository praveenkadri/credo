export function isNextRedirectError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeDigest = (error as { digest?: unknown }).digest;
  return typeof maybeDigest === "string" && maybeDigest.startsWith("NEXT_REDIRECT");
}
