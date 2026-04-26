import Link from "next/link";
import { CompanyDeleteFlow } from "@/components/companies/company-delete-flow";
import { getCompanyDeleteSummary } from "@/lib/data/companies";
import { SoftNotice } from "@/components/system/SoftNotice";
import { buttonClassName } from "@/components/ui-primitives/button";
import { en } from "@/content/en";

function DeleteState({
  title,
  detail,
  retryHref,
  variant = "error",
}: {
  title: string;
  detail: string;
  retryHref?: string;
  variant?: "warning" | "error";
}) {
  return (
    <div className="w-full pb-12">
      <section className="mt-2 px-6 py-5">
        <SoftNotice title={title} description={detail} variant={variant} />
        {retryHref ? (
          <Link href={retryHref} className={`mt-4 ${buttonClassName("secondary")}`}>
            {en.common.tryAgain}
          </Link>
        ) : null}
      </section>
    </div>
  );
}

export default async function CompanyDeletePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const summary = await getCompanyDeleteSummary(id);

    if (!summary) {
      return (
        <DeleteState
          title={en.company.delete.pageState.notFoundTitle}
          detail={en.company.delete.pageState.notFoundDetail}
          variant="warning"
        />
      );
    }

    return (
      <CompanyDeleteFlow summary={summary} />
    );
  } catch {
    return (
      <DeleteState
        title={en.company.delete.pageState.loadErrorTitle}
        detail={en.company.delete.pageState.loadErrorDetail}
        retryHref={`/companies/${id}/delete`}
      />
    );
  }
}
