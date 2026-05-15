import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/auth/auth-screen";
import { getCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Create workspace | Credo",
};

export default async function SignupPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(routes.overview);
  }

  return (
    <AuthScreen
      title="Create your Credo account"
      subtitle="Start organizing companies, payroll, employees, and documents from one clean workspace."
    >
      <SignupForm />
    </AuthScreen>
  );
}
