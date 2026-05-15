"use client";

import Link from "next/link";
import { useState } from "react";
import { useActionState } from "react";
import {
  authButtonClassName,
  authErrorClassName,
  authGhostLinkClassName,
  authInputClassName,
  authLabelClassName,
  authPasswordToggleClassName,
} from "@/components/auth/auth-screen";
import { routes } from "@/lib/routes";
import { loginAction, type LoginActionState } from "./actions";

const initialState: LoginActionState = {};

export function LoginForm({ initialError, next }: { initialError?: string; next?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const error = state.error ?? initialError;

  return (
    <form action={formAction} className="mt-8 grid gap-5 transition duration-300 ease-out">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="grid gap-2">
        <label htmlFor="email" className={authLabelClassName}>
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className={authInputClassName} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="password" className={authLabelClassName}>
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${authInputClassName} pr-24`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className={authPasswordToggleClassName}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {error ? (
        <p className={authErrorClassName} role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <div className="grid gap-3 pt-1 text-center text-[14px] font-medium leading-[1.6] text-[var(--credo-muted)]">
        <Link href={routes.forgotPassword} className={authGhostLinkClassName}>
          Forgot password?
        </Link>
        <p>
          New to Credo?{" "}
          <Link href={routes.signup} className={authGhostLinkClassName}>
            Create an account
          </Link>
        </p>
      </div>
    </form>
  );
}
