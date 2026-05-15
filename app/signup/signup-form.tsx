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
import { signupAction, type SignupActionState } from "./actions";

const initialState: SignupActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-5 transition duration-300 ease-out">
      <div className="grid gap-2">
        <label htmlFor="name" className={authLabelClassName}>
          Full name
        </label>
        <input id="name" name="name" type="text" autoComplete="name" required className={authInputClassName} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="email" className={authLabelClassName}>
          Work email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={authInputClassName} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className={authLabelClassName}>
          Create password
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required className={authInputClassName} />
      </div>

      {state.error ? (
        <p className={authErrorClassName} role="alert">
          {state.error}
        </p>
      ) : null}

      {state.message ? (
        <p className={authSuccessClassName} role="status">
          {state.message}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-[12px] font-medium leading-[1.6] text-[var(--text-muted-2)]">
        By signing up, you agree to our Terms and Privacy Policy.
      </p>

      <p className="text-center text-[14px] font-medium leading-[1.6] text-[var(--credo-muted)]">
        Already have an account?{" "}
        <Link href={routes.login} className={authGhostLinkClassName}>
          Sign in
        </Link>
      </p>
    </form>
  );
}
