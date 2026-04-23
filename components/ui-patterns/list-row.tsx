import * as React from "react";

type ListRowProps = {
  title?: string;
  description?: string;
  marker?: React.ReactNode;
  rightSlot?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: "button" | "div";
};

export function ListRow({
  title,
  description,
  marker,
  rightSlot,
  className,
  onClick,
  as = "button",
}: ListRowProps) {
  const rowClass = [
    "group flex w-full items-start gap-3 rounded-xl bg-transparent px-3 py-3 text-left transition-colors duration-[180ms] ease-[cubic-bezier(0.2,0,0,1)] hover:bg-[#f3f4ef]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {marker ? (
        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#f7f7f4] text-[#6e736b]">
          {marker}
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        {title ? <p className="text-sm font-medium text-[#1f221c]">{title}</p> : null}
        {description ? (
          <p className="mt-1 text-sm leading-5 text-[#6e736b]">{description}</p>
        ) : null}
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </>
  );

  if (as === "div") {
    return <div className={rowClass}>{content}</div>;
  }

  return (
    <button type="button" className={rowClass} onClick={onClick}>
      {content}
    </button>
  );
}
