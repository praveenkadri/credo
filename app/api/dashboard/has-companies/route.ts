import { NextResponse } from "next/server";
import { getDashboardActivityState } from "@/lib/data/companies";

export async function GET() {
  try {
    const state = await getDashboardActivityState();
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ hasCompanies: false, hasActivity: false });
  }
}
