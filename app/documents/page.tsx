import { DocumentsPage } from "@/components/documents/documents-page";
import { WorkspaceLockedState } from "@/components/system/workspace-locked-state";
import { getCurrentUser } from "@/lib/auth/session";
import { listDocumentsForToken } from "@/lib/data/documents";

export default async function DocumentsRoute() {
  const user = await getCurrentUser();

  if (!user) {
    return <WorkspaceLockedState />;
  }

  const documents = await listDocumentsForToken(user.accessToken);
  return <DocumentsPage documents={documents} />;
}
