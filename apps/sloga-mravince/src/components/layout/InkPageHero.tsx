import type { ReactNode } from "react";

interface InkPageHeroProps {
  title: string | string[];
  watermark: string;
  children?: ReactNode;
}

export function InkPageHero({ title, watermark, children }: InkPageHeroProps) {
  const lines = Array.isArray(title) ? title : [title];
  const hasAside = Boolean(children);

  return (
    <section className="relative isolate overflow-hidden bg-ink-deep text-chalk">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-club-red" />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-[0.06]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-8 -z-10 select-none font-display text-9xl uppercase leading-none text-white/[0.035] sm:text-[12rem] lg:text-[17rem]"
      >
        {watermark}
      </div>

      <div
        className={`mx-auto grid min-h-[28rem] max-w-6xl content-center items-center gap-10 px-6 py-14 sm:min-h-[30rem] sm:py-16 lg:px-8 ${
          hasAside ? "lg:grid-cols-[0.88fr_1.12fr]" : ""
        }`}
      >
        <h1 className="max-w-4xl font-display text-6xl uppercase leading-none text-chalk sm:text-8xl lg:text-9xl">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        {hasAside && <div className="w-full lg:justify-self-end">{children}</div>}
      </div>
    </section>
  );
}
