import { cn } from "@/lib/utils";

type FeatureBandProps = {
  id?: string;
  title: string;
  description: string;
  points: string[];
  visualRows?: [string, string][];
  cards?: { title: string; body: string }[];
};

export function FeatureBand({ id, title, description, points, visualRows, cards }: FeatureBandProps) {
  return (
    <section id={id} className="mx-auto mt-24 w-full max-w-[1180px] px-5 lg:px-7">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div>
          <h2 className="text-[35px] font-semibold leading-[1.14] tracking-[-0.03em] text-neutral-950 sm:text-[44px]">
            {title}
          </h2>
          <p className="mt-4 max-w-[560px] text-[17px] leading-[1.55] text-neutral-600">{description}</p>
          <ul className="mt-6 space-y-2.5 text-[15px] text-neutral-700">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn("rounded-[26px] bg-white/70 p-4 ring-1 ring-neutral-200/50") }>
          {visualRows ? (
            <div className="space-y-2.5">
              {visualRows.map(([rowTitle, rowMeta]) => (
                <div key={rowTitle} className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-neutral-200/40">
                  <p className="text-[13px] font-medium text-neutral-900">{rowTitle}</p>
                  <p className="text-[12px] text-neutral-600">{rowMeta}</p>
                </div>
              ))}
            </div>
          ) : null}

          {cards ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {cards.map((card) => (
                <article key={card.title} className="rounded-2xl bg-white/60 p-4 ring-1 ring-neutral-200/40">
                  <h3 className="text-[14px] font-medium text-neutral-900">{card.title}</h3>
                  <p className="mt-2 text-[12px] leading-[1.5] text-neutral-600">{card.body}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
