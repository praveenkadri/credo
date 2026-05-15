import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getEmployeeForToken, listEmployeesForToken } from "@/lib/data/employees";
import { toSafeAppErrorMessage } from "@/lib/supabase/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("id")?.trim() || undefined;
  const companyId = searchParams.get("companyId")?.trim() || undefined;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ employees: [] }, { status: 401 });
  }

  try {
    if (employeeId) {
      const employee = await getEmployeeForToken(employeeId, user.accessToken);
      return NextResponse.json({ employee });
    }

    const employees = await listEmployeesForToken(companyId, user.accessToken);
    return NextResponse.json({ employees });
  } catch (error) {
    const message = toSafeAppErrorMessage(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
