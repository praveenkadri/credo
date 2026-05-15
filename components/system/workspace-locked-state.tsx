import { SoftNotice } from "@/components/system/SoftNotice";

export function WorkspaceLockedState() {
  return (
    <div className="w-full pb-12">
      <section className="mt-2 px-6 py-5">
        <SoftNotice
          title="Workspace locked"
          description="Sign in required to access Credo workspace."
          variant="warning"
        />
      </section>
    </div>
  );
}
