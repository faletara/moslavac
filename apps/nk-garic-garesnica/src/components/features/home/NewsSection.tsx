import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { FadeInView } from "@/components/animations";
import { formatDateShort } from "@/lib/helpers/date";
import type { News } from "@/types/news";

type NewsSectionProps = {
  news: News[];
  /** Grb kluba za fallback pločicu kad članak nema sliku. */
  crestUrl: string | null;
};

function articleImage(article: News): string | null {
  return article.thumbnailPath ?? article.imagePaths[0] ?? null;
}

/** Brandirani fallback — puna royal ploha s halftone rasterom dresa i grbom. */
function CrestFallback({ crestUrl }: { crestUrl: string | null }) {
  return (
    <div className="relative flex h-full items-center justify-center bg-club">
      <span
        aria-hidden
        className="halftone halftone-fade-t absolute inset-0 opacity-60"
        // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
        // standardna svojstva, pa ga inline stil ovdje mora proširiti.
        style={
          { "--halftone-color": "rgba(255,255,255,0.4)" } as React.CSSProperties
        }
      />
      {crestUrl && (
        <Image
          src={crestUrl}
          alt=""
          width={200}
          height={250}
          sizes="200px"
          className="relative h-[52%] w-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
        />
      )}
    </div>
  );
}

function NewsMeta({ article }: { article: News }) {
  return (
    <div className="font-mono text-[13px] tabular-nums text-white/80">
      {formatDateShort(article.date)}
    </div>
  );
}

/**
 * Naslovnica članka — fotografija sa scrimom, naslov i meta žive NA slici,
 * isti jezik za vodeći članak i bočne mini-naslovnice.
 */
function CoverCard({
  article,
  crestUrl,
  sizes,
  lead = false,
}: {
  article: News;
  crestUrl: string | null;
  sizes: string;
  lead?: boolean;
}) {
  const image = articleImage(article);

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_36px_-22px_rgba(15,23,42,0.35)] ring-1 ring-inset ring-black/10 sm:rounded-3xl ${
        lead ? "aspect-16/10 lg:h-full lg:aspect-auto" : "aspect-16/10"
      }`}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
      ) : (
        <CrestFallback crestUrl={crestUrl} />
      )}

      {/* Scrim — naslov mora ostati čitljiv na svakoj fotografiji. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, oklch(0.14 0.05 262 / 0.92), oklch(0.14 0.05 262 / 0.15) 55%, transparent 78%)",
        }}
      />

      {/* Na mobitelu su sve kartice isti format — tipografija i padding se
          razdvajaju tek od sm naviše, gdje vodeći članak dobiva svoj stupac. */}
      <div className={`absolute inset-x-0 bottom-0 p-5 ${lead ? "sm:p-9" : "sm:p-6"}`}>
        <h3
          className={`max-w-2xl text-balance font-display text-2xl uppercase leading-[1.05] tracking-wide text-white ${
            lead ? "sm:text-4xl" : "sm:text-2xl"
          }`}
        >
          {article.title}
        </h3>
        <div className="mt-3">
          <NewsMeta article={article} />
        </div>
      </div>
    </article>
  );
}

export default function NewsSection({ news, crestUrl }: NewsSectionProps) {
  if (news.length === 0) return null;

  const [lead, ...others] = news;

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative mx-auto w-full max-w-350 px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <FadeInView>
            <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-tight text-foreground lg:text-8xl">
              Novosti
            </h2>
          </FadeInView>

          <FadeInView delay={0.1}>
            {/* Namjerno zadržano dok ruta /novosti ne postoji — veži `href` kad
                nastane. Do tada je ovo kontrola bez odredišta. */}
            <span className="group inline-flex items-center gap-2.5 rounded-full bg-foreground px-6 py-3.5 text-background transition-colors hover:bg-club">
              <span className="font-mono text-sm font-bold uppercase tracking-wide">
                Sve vijesti
              </span>
              <ArrowUpRight
                className="size-4.5 text-club transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                strokeWidth={2}
              />
            </span>
          </FadeInView>
        </div>

        {/* Vodeći članak kao velika naslovnica, ostali kao mini-naslovnice u
            desnom stupcu — ista visina stupaca, bez praznog prostora. */}
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <FadeInView className="lg:col-span-7">
            <CoverCard
              article={lead}
              crestUrl={crestUrl}
              sizes="(max-width: 1024px) 100vw, 60vw"
              lead
            />
          </FadeInView>

          <div className="grid grid-cols-1 content-start gap-6 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1 lg:gap-8">
            {others.map((article, i) => (
              <FadeInView key={article.id} delay={0.08 + i * 0.08}>
                <CoverCard
                  article={article}
                  crestUrl={crestUrl}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                />
              </FadeInView>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
