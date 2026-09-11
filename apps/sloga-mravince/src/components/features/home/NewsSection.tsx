import Image from "next/image";
import Link from "next/link";
import { FadeInView } from "@/components/animations";
import { formatDateLong } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import type { News } from "@/types/news";
import NewsFallbackArt from "@/components/features/news/NewsFallbackArt";
import SectionHead from "./SectionHead";

/** Slika vijesti ili tipografski plakat kad vijest nema naslovnu sliku. */
function Thumb({
  item,
  clubName,
  size,
  sizes,
  className,
}: {
  item: News;
  clubName: string;
  size: "card" | "row";
  sizes: string;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      {item.thumbnailPath ? (
        <Image
          src={item.thumbnailPath}
          alt={item.title}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <NewsFallbackArt clubName={clubName} size={size} />
        </div>
      )}
    </div>
  );
}

/** Velika udarna vijest — slika s ink scrimom i Anton naslovom preko dna. */
function FeatureCard({ item, clubName }: { item: News; clubName: string }) {
  return (
    <Link href={`/novosti/${item.slug}`} className="group relative block">
      <Thumb
        item={item}
        clubName={clubName}
        size="card"
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="aspect-16/11 clip-corner lg:aspect-auto lg:h-full lg:min-h-130"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/25 via-55% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
        <p className="flex items-center gap-3">
          <span className="bg-club-red px-2 py-0.5 text-[0.58rem] font-black uppercase tracking-[0.24em] text-white">
            Izdvojeno
          </span>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-white/60">
            {formatDateLong(item.date)}
          </span>
        </p>
        <h3 className="mt-4 max-w-xl pt-[0.14em] font-display text-3xl uppercase leading-[1.14] text-white sm:text-4xl md:text-5xl">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}

/** Redak u bočnoj listi — mala slika + naslov + datum, hairline ispod. */
function ListRow({
  item,
  clubName,
}: {
  item: News;
  clubName: string;
}) {
  return (
    <Link
      href={`/novosti/${item.slug}`}
      className="group flex items-center gap-5 border-b border-foreground/10 py-5 first:pt-0 last:border-b-0"
    >
      <Thumb
        item={item}
        clubName={clubName}
        size="row"
        sizes="128px"
        className="aspect-4/3 w-28 shrink-0 clip-corner sm:w-32"
      />
      <div className="min-w-0">
        <h3 className="line-clamp-3 font-bold leading-snug tracking-tight transition-colors group-hover:text-club-red sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-1.5 text-xs text-muted-foreground">
          {formatDateLong(item.date)}
        </p>
      </div>
    </Link>
  );
}

/**
 * Editorial news grid: velika udarna vijest lijevo, numerirana lista desno,
 * ostatak u donjem redu kartica. Sve s hover zoomom i crvenim akcentima.
 */
export default function NewsSection({
  news,
  clubName,
}: {
  news: News[];
  clubName: string;
}) {
  const items = news.filter((n) => n.slug).slice(0, 8);
  if (items.length === 0) return null;

  const [feature, ...rest] = items;
  const side = rest.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <SectionHead
        title="Novosti"
        link={{ href: "/novosti", label: "Sve vijesti" }}
      />

      <FadeInView className="mt-12 md:mt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <FeatureCard item={feature} clubName={clubName} />
          </div>
          {side.length > 0 && (
            <div className="flex flex-col justify-center lg:col-span-5">
              {side.map((item) => (
                <ListRow key={item.id} item={item} clubName={clubName} />
              ))}
            </div>
          )}
        </div>
      </FadeInView>
      <div className="mt-12 sm:hidden">
        <Link
          href="/novosti"
          className="inline-flex w-full items-center justify-center gap-3 bg-ink-deep px-8 py-4 text-xs font-black uppercase tracking-[0.18em] text-white"
        >
          Sve vijesti →
        </Link>
      </div>
    </section>
  );
}
