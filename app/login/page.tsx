import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "@/lib/auth/redirect";
import { getCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { AuthScreen } from "@/components/auth/auth-screen";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | Credo",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const query = await searchParams;
  const user = await getCurrentUser();

  if (user) {
    redirect(routes.overview);
  }

  const initialError = query.error === "callback" ? "We could not finish signing you in. Try again." : undefined;
  const next = getSafeRedirectPath(query.next, "");

  return (
    <AuthScreen
      title="Sign in to Credo"
      subtitle="Access your companies, payroll, employees, and documents in one calm workspace."
    >
      <LoginForm initialError={initialError} next={next} />
    </AuthScreen>
  );
}
