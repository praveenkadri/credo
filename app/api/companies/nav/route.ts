import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getCompaniesForToken } from "@/lib/data/companies";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ companies: [] }, { status: 401 });
  }

  try {
    const companies = await getCompaniesForToken(user.accessToken);
    const navCompanies = companies.map((company) => ({
      id: company.id,
      name: company.name,
      initials: company.initials,
      href: company.href,
    }));

    return NextResponse.json({ companies: navCompanies });
  } catch {
    return NextResponse.json({ companies: [] });
  }
}
