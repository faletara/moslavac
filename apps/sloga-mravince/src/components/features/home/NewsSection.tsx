import Image from "next/image";
import Link from "next/link";
import { formatDateLong } from "@/lib/helpers/date";
import type { News } from "@/types/news";

function NewsCard({ item, crestSrc }: { item: News; crestSrc: string }) {
  const href = item.slug ? `/novosti/${item.slug}` : "#";
  return (
    <Link
      href={href}
      className="group block w-[78vw] max-w-xs shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-white">
        {item.thumbnailPath ? (
          <Image
            src={item.thumbnailPath}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white">
            {/* Blagi radijalni tonovi za dubinu */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f2f3f5_65%,#e7e9ed_100%)]" />
            <div className="relative aspect-square h-[64%] transition-transform duration-500 ease-out group-hover:scale-105">
              <Image
                src={crestSrc}
                alt=""
                fill
                sizes="220px"
                className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
              />
            </div>
          </div>
        )}
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-club-red">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {formatDateLong(item.date)}
      </p>
    </Link>
  );
}

/** Grid najnovijih vijesti na naslovnici (Monaco stil) + CTA na sve vijesti. */
export default function NewsSection({
  news,
  crestSrc,
}: {
  news: News[];
  crestSrc: string;
}) {
  const items = news.filter((n) => n.slug).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <h2 className="text-3xl font-bold uppercase tracking-tight md:text-4xl">
        Novosti
      </h2>

      <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible sm:pb-0 md:mt-10 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} crestSrc={crestSrc} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/novosti"
          className="inline-flex items-center rounded-full bg-club-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105"
        >
          Sve vijesti
        </Link>
      </div>
    </section>
  );
}
