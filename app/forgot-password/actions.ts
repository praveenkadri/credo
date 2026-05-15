"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export type ForgotPasswordActionState = {
  error?: string;
  message?: string;
};

export async function forgotPasswordAction(
  _previousState: ForgotPasswordActionState,
  formData: FormData
): Promise<ForgotPasswordActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Enter your email to receive a recovery link." };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}${routes.authCallback}?next=${encodeURIComponent(routes.overview)}` : undefined,
  });

  if (error) {
    return { error: "We could not send a recovery link. Try again in a moment." };
  }

  return { message: "Check your email for a recovery link from Credo." };
}

