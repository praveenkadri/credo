import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/auth/auth-screen";
import { getCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset password | Credo",
};

export default async function ForgotPasswordPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(routes.overview);
  }

  return (
    <AuthScreen
      title="Reset your password"
      subtitle="Enter your email and we'll send a secure link to help you get back into Credo."
    >
      <ForgotPasswordForm />
    </AuthScreen>
  );
}
