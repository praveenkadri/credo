"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";

export type SignupActionState = {
  error?: string;
  message?: string;
};

export async function signupAction(
  _previousState: SignupActionState,
  formData: FormData
): Promise<SignupActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Enter your name, work email, and password to create your account." };
  }

  if (password.length < 6) {
    return { error: "Use a password with at least 6 characters." };
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { name, full_name: name } : undefined,
      emailRedirectTo: origin ? `${origin}${routes.authCallback}?next=${encodeURIComponent(routes.overview)}` : undefined,
    },
  });

  if (error) {
    return { error: "We could not create your workspace with those details." };
  }

  if (!data.session) {
    return { message: "Check your email to confirm your account, then sign in to Credo." };
  }

  redirect(routes.overview);
}
