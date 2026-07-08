import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InkPageHero } from "@/components/layout/InkPageHero";
import { formatDateShort } from "@/lib/helpers/date";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";
import type { PayloadMedia } from "@/lib/payload/types";
import type { News } from "@/types/news";

export const revalidate = 60;

type NewsWithSlug = News & { slug: string };

interface Props {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(value?: string): number {
  const page = Number(value ?? "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function hasSlug(item: News): item is NewsWithSlug {
  return Boolean(item.slug);
}

function getCrestSrc(logo: string | PayloadMedia | null | undefined): string {
  if (!logo) return "/crest.png";
  return typeof logo === "string" ? logo : (logo.url ?? "/crest.png");
}

function NewsThumb({
  item,
  crestSrc,
  sizes,
  priority = false,
  className,
}: {
  item: NewsWithSlug;
  crestSrc: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className ?? ""}`}>
      {item.thumbnailPath ? (
        <Image
          src={item.thumbnailPath}
          alt={item.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,#ffffff_0%,#f2f3f5_65%,#e7e9ed_100%)]" />
          <div className="relative aspect-square h-3/5 transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src={crestSrc}
              alt=""
              fill
              priority={priority}
              sizes="220px"
              className="object-contain drop-shadow-[0_12px_28px_rgba(0,0,0,0.16)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function LeadStory({
  item,
  crestSrc,
}: {
  item: NewsWithSlug;
  crestSrc: string;
}) {
  return (
    <Link href={`/novosti/${item.slug}`} className="group relative block">
      <NewsThumb
        item={item}
        crestSrc={crestSrc}
        sizes="(max-width: 1024px) 100vw, 46vw"
        priority
        className="aspect-16/10 clip-corner"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/90 via-black/28 via-55% to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <p className="flex flex-wrap items-center gap-3">
          <span className="bg-club-red px-2 py-0.5 text-[0.58rem] font-black uppercase text-white">
            Izdvojeno
          </span>
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl uppercase leading-tight text-white sm:text-5xl">
          {item.title}
        </h2>
      </div>
    </Link>
  );
}

function NewsCard({
  item,
  crestSrc,
}: {
  item: NewsWithSlug;
  crestSrc: string;
}) {
  return (
    <Link href={`/novosti/${item.slug}`} className="group block">
      <NewsThumb
        item={item}
        crestSrc={crestSrc}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-16/10 clip-corner"
      />
      <div className="mt-5">
        <p className="text-xs font-bold uppercase text-club-red">
          {formatDateShort(item.date)}
        </p>
        <h2 className="mt-2 line-clamp-3 text-balance font-display text-2xl uppercase leading-tight text-foreground transition-colors group-hover:text-club-red">
          {item.title}
        </h2>
        {item.excerpt && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}

function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const previousHref = page > 2 ? `/novosti?page=${page - 1}` : "/novosti";
  const nextHref = `/novosti?page=${page + 1}`;
  const previousDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className="mt-14 flex items-center justify-between gap-4 border-t border-foreground/10 pt-8">
      <Link
        href={previousHref}
        aria-disabled={previousDisabled}
        className={`group inline-flex items-center gap-3 text-xs font-black uppercase text-foreground transition-colors hover:text-club-red ${
          previousDisabled ? "pointer-events-none opacity-30" : ""
        }`}
      >
        <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Prethodna
      </Link>

      <span className="hidden text-xs font-bold uppercase text-muted-foreground tabular-nums sm:inline">
        {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
      </span>

      <Link
        href={nextHref}
        aria-disabled={nextDisabled}
        className={`group inline-flex items-center gap-3 text-xs font-black uppercase text-foreground transition-colors hover:text-club-red ${
          nextDisabled ? "pointer-events-none opacity-30" : ""
        }`}
      >
        Sljedeća
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </nav>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenant();
  const description = `Najnovije vijesti, najave i izvještaji s utakmica te sva događanja u klubu ${tenant.displayName}.`;

  return {
    title: "Novosti",
    description,
    alternates: { canonical: "/novosti" },
    openGraph: {
      title: `Novosti | ${tenant.displayName}`,
      description,
    },
    twitter: {
      title: `Novosti | ${tenant.displayName}`,
      description,
    },
  };
}

export default async function NewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const [tenant, result] = await Promise.all([
    getTenant(),
    fetchNewsPaginated({ page, size: 13 }),
  ]);

  const crestSrc = getCrestSrc(tenant.branding?.logo);
  const items = result.content.filter(hasSlug);
  const lead = items[0];
  const archiveItems = items;
  const totalPages = Math.max(result.totalPages, 1);

  return (
    <div className="bg-background">
      <InkPageHero title="Novosti" watermark="Novosti">
        {lead && <LeadStory item={lead} crestSrc={crestSrc} />}
      </InkPageHero>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-foreground/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground">
              Arhiva objava
            </p>
            <h2 className="mt-3 font-display text-5xl uppercase leading-none text-foreground sm:text-6xl">
              Sve vijesti
            </h2>
          </div>
          {result.totalPages > 1 && (
            <span className="text-xs font-bold uppercase text-muted-foreground tabular-nums">
              Stranica {String(page).padStart(2, "0")} /{" "}
              {String(totalPages).padStart(2, "0")}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="py-16 text-center text-xs font-bold uppercase text-muted-foreground">
            Nema dostupnih vijesti.
          </p>
        ) : (
          <div className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {archiveItems.map((item) => (
              <article key={item.id}>
                <NewsCard item={item} crestSrc={crestSrc} />
              </article>
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} />
      </section>
    </div>
  );
}
