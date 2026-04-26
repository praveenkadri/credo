import { NextResponse } from "next/server";
import { getCompanies } from "@/lib/data/companies";

export async function GET() {
  try {
    const companies = await getCompanies();
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
