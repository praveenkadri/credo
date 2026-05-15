import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getDashboardActivityStateForToken } from "@/lib/data/companies";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ hasCompanies: false, hasActivity: false }, { status: 401 });
  }

  try {
    const state = await getDashboardActivityStateForToken(user.accessToken);
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ hasCompanies: false, hasActivity: false });
  }
}
