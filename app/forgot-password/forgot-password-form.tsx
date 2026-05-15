"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  authButtonClassName,
  authErrorClassName,
  authGhostLinkClassName,
  authInputClassName,
  authLabelClassName,
  authSuccessClassName,
} from "@/components/auth/auth-screen";
import { routes } from "@/lib/routes";
import { forgotPasswordAction, type ForgotPasswordActionState } from "./actions";

const initialState: ForgotPasswordActionState = {};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-5 transition duration-300 ease-out">
      <div className="grid gap-2">
        <label htmlFor="email" className={authLabelClassName}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={authInputClassName} />
      </div>

      {state.error ? (
        <p className={authErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <div className={authSuccessClassName} role="status">
          <p className="font-semibold text-[var(--credo-green-950)]">Check your email</p>
          <p className="mt-1 font-medium">We sent a password reset link if an account exists for this address.</p>
        </div>
      ) : null}

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-[14px] font-medium leading-[1.6] text-[var(--credo-muted)]">
        <Link href={routes.login} className={authGhostLinkClassName}>
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
