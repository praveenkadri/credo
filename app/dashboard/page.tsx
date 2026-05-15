import { redirect } from "next/navigation";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { routes } from "@/lib/routes";

export default async function DashboardAliasPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  redirect(routes.overview);
}
