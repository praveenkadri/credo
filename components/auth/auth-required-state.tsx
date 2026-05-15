import Link from "next/link";

type AuthRequiredStateProps = {
  signInHref?: string;
};

export function AuthRequiredState({ signInHref }: AuthRequiredStateProps) {
  return (
    <div className="w-full pb-12">
      <section className="mt-2 px-6 py-5">
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-4 py-3 text-[14px] text-amber-950">
          <div className="font-medium">Sign in required to access Credo workspace.</div>
          {signInHref ? (
            <Link
              href={signInHref}
              className="mt-2 inline-flex text-[13px] font-medium text-[var(--action-text)] underline decoration-black/20 underline-offset-4 hover:decoration-black/50"
            >
              Sign in
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
}

