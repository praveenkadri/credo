import { buttonClassName } from "@/components/ui-primitives/button";

export function ReviewSectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/50">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold text-[#1f221c]">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className={`${buttonClassName("noticeAction")} h-7 px-2 text-[12px]`}
        >
          Edit
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}
