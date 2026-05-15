import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/lib/routes";

export const authInputClassName =
  "h-[52px] w-full rounded-[18px] border border-[var(--credo-border)] bg-[var(--credo-cream-muted)] px-4 text-[15px] font-medium text-[var(--credo-ink)] outline-none transition duration-200 placeholder:text-[var(--text-faint)] hover:border-[var(--credo-taupe-strong)] hover:bg-[var(--credo-cream)] focus:border-[var(--credo-green-800)] focus:bg-white focus:ring-4 focus:ring-[rgba(18,54,44,0.14)]";

export const authButtonClassName =
  "inline-flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--credo-green-950)] px-6 text-[15px] font-semibold text-[var(--credo-cream)] shadow-[0_16px_34px_rgba(18,54,44,0.18)] transition duration-200 hover:bg-[var(--credo-green-900)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(18,54,44,0.18)] disabled:cursor-not-allowed disabled:opacity-60";

export const authGhostLinkClassName =
  "font-semibold text-[var(--credo-green-950)] underline-offset-4 transition duration-200 hover:text-[var(--credo-green-800)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(18,54,44,0.18)]";

export const authLabelClassName = "text-[13px] font-semibold text-[var(--credo-muted-strong)]";

export const authErrorClassName =
  "rounded-[18px] bg-[var(--credo-bronze-pale)] px-4 py-3 text-[13px] font-medium leading-[1.55] text-[var(--credo-bronze-700)] ring-1 ring-[rgba(184,135,79,0.2)]";

export const authSuccessClassName =
  "rounded-[20px] bg-[var(--credo-taupe-wash)] px-4 py-4 text-[13px] font-medium leading-[1.55] text-[var(--credo-green-950)] ring-1 ring-[rgba(91,77,58,0.18)]";

export const authPasswordToggleClassName =
  "absolute right-3 top-1/2 inline-flex h-8 -translate-y-1/2 items-center justify-center rounded-full px-3 text-[12px] font-semibold text-[var(--credo-muted-strong)] transition hover:bg-[var(--credo-taupe-wash)] hover:text-[var(--credo-green-950)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(18,54,44,0.18)]";

const proofLines = [
  "Run company admin with clarity",
  "Keep payroll and documents together",
  "Manage teams across companies",
  "Private, secure, and simple to use",
] as const;

export function CredoAuthMonogram({ className = "" }: { className?: string }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center font-semibold tracking-[-0.04em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]",
        className ? "" : "size-10 rounded-2xl bg-white/[0.12] text-[18px] text-white ring-1 ring-white/[0.16]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      C
    </span>
  );
}

export function AuthScreen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--credo-bg)] text-[var(--credo-ink)]">
      <section className="grid min-h-screen lg:grid-cols-[minmax(0,1.04fr)_minmax(440px,0.96fr)]">
        <aside className="relative min-h-[460px] overflow-hidden bg-[var(--credo-green-900)] px-6 py-7 text-white sm:px-8 lg:min-h-screen lg:px-12 lg:py-10 xl:px-16">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(239,229,213,0.16),rgba(239,229,213,0)_30%),radial-gradient(circle_at_78%_28%,rgba(184,135,79,0.11),rgba(184,135,79,0)_34%),linear-gradient(180deg,rgba(255,255,255,0.035),rgba(5,24,17,0.3))]"
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(251,250,244,0.72)_1px,transparent_1px),linear-gradient(90deg,rgba(251,250,244,0.72)_1px,transparent_1px)] [background-size:42px_42px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full bg-[var(--credo-beige)]/10 blur-3xl" aria-hidden="true" />

          <div className="relative flex h-full min-h-[376px] flex-col lg:min-h-0">
            <Link href={routes.home} className="inline-flex w-fit items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(239,229,213,0.36)]">
              <CredoAuthMonogram className="size-9 rounded-[12px] bg-[var(--credo-taupe-wash)] text-[15px] text-[var(--credo-green-950)] ring-1 ring-white/20" />
              <span>
                <span className="block text-[21px] font-semibold leading-none tracking-[-0.04em] text-[var(--credo-cream)]">Credo</span>
                <span className="mt-1 block text-[12px] font-medium tracking-[-0.01em] text-white/56">
                  Business operating system
                </span>
              </span>
            </Link>

            <div className="mt-12 max-w-[560px] lg:mt-auto">
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[#c8c1b2]">
                Multi-company payroll &amp; operations
              </p>
              <h2 className="mt-5 text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-[var(--credo-cream)] sm:text-[50px] lg:text-[60px]">
                A calmer way to manage payroll, documents, and companies.
              </h2>
              <p className="mt-5 max-w-[460px] text-[16px] font-medium leading-7 text-white/68">
                Track companies, employees, payroll, and documents in one organized workspace.
              </p>
            </div>

            <div className="relative mt-9 grid gap-3 sm:grid-cols-2 lg:mb-8 lg:max-w-[520px]">
              {proofLines.map((line) => (
                <div key={line} className="flex items-center gap-3 text-[13px] font-medium leading-5 text-white/78">
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--credo-bronze)]" aria-hidden="true" />
                  <span>{line}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto hidden max-w-[430px] rounded-[28px] bg-[rgba(251,250,244,0.08)] p-4 shadow-[0_24px_64px_rgba(3,16,11,0.2)] ring-1 ring-[rgba(239,229,213,0.14)] backdrop-blur-md lg:block">
              <div className="rounded-[22px] border border-[rgba(239,229,213,0.12)] bg-white/[0.055] p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/52">May payroll</p>
                    <p className="mt-2 text-[22px] font-semibold tracking-[-0.035em] text-white">$18,420 ready</p>
                  </div>
                  <span className="rounded-full bg-[var(--credo-taupe-wash)] px-3 py-1.5 text-[12px] font-semibold text-[var(--credo-green-950)] ring-1 ring-[rgba(91,77,58,0.16)]">
                    Review run
                  </span>
                </div>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/[0.12]">
                  <div className="h-full w-3/4 rounded-full bg-[var(--credo-bronze)]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Companies", "Employees", "Documents"].map((item) => (
                    <span key={item} className="rounded-full bg-white/[0.07] px-3 py-1.5 text-[12px] font-semibold text-white/72 ring-1 ring-[rgba(239,229,213,0.12)]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-[620px] items-center justify-center bg-[var(--credo-bg)] px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12">
          <div className="w-full max-w-[470px] rounded-[32px] border border-[var(--credo-border)] bg-[var(--credo-surface-warm)] px-5 py-7 shadow-[0_28px_78px_rgba(42,35,25,0.1),0_1px_0_rgba(255,255,255,0.78)_inset] sm:px-8 sm:py-9">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.17em] text-[var(--credo-green-950)]">
                Secure workspace access
              </p>
              <h1 className="mt-3 text-[31px] font-semibold leading-[1.1] tracking-[-0.036em] text-[var(--credo-ink)] sm:text-[36px]">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-4 max-w-[390px] text-[15px] font-medium leading-7 text-[var(--credo-muted)]">
                  {subtitle}
                </p>
              ) : null}
              {children}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
