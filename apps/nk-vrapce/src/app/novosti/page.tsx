import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
import { formatDateShort } from "@/lib/helpers/date";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";

type NewsDoc = Awaited<
  ReturnType<typeof fetchNewsPaginated>
>["docs"][number];

function newsThumb(doc: NewsDoc): string | null {
  return doc.thumbnail && typeof doc.thumbnail === "object"
    ? doc.thumbnail.url
    : null;
}

export const metadata: Metadata = {
  title: "Vijesti i obavijesti",
  description:
    "Najnovije vijesti, najave i izvještaji s utakmica te sva događanja u NK Vrapče.",
  alternates: { canonical: "/novosti" },
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? "1"));

  const [result, tenant] = await Promise.all([
    fetchNewsPaginated({ page, size: 10 }),
    getTenant(),
  ]);

  const logo = tenant.branding?.logo;
  const fallback = !logo
    ? ""
    : typeof logo === "string"
      ? logo
      : (logo.url ?? "");

  const { docs, totalPages } = result;

  return (
    <>
      <BrandedHero
        eyebrow="Aktualno"
        title="Vijesti"
        description="Najnovije vijesti, najave i izvještaji s utakmica te sva događanja u klubu."
      />

      <div className="mx-auto mt-16 w-full max-w-5xl px-6 pb-24 sm:mt-20 lg:px-8">
        {/* Brojač + oznaka stranice — arhivski list, ne homepage hero */}
        <div className="mb-8 flex items-end justify-between border-b border-line pb-5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-brand-blue">
            Sve objave
          </span>
          {totalPages > 1 && (
            <span className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground tabular-nums">
              Stranica {String(page).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
            </span>
          )}
        </div>

        {docs.length === 0 ? (
          <p className="py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nema dostupnih vijesti.
          </p>
        ) : (
          <StaggerContainer
            className="divide-y divide-line border-b border-line"
            staggerChildren={0.05}
          >
            {docs.map((doc) => {
              const thumbnailUrl = newsThumb(doc);
              const date = doc.publishedAt ?? doc.createdAt;
              return (
                <StaggerItem key={doc.id}>
                  <Link
                    href={`/novosti/${doc.slug ?? doc.id}`}
                    className="group grid grid-cols-[6rem_1fr] items-stretch gap-5 py-5 sm:grid-cols-[13rem_1fr] sm:gap-7 sm:py-6"
                  >
                    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-2 sm:aspect-[16/10]">
                      <Image
                        src={thumbnailUrl || fallback}
                        alt={doc.title}
                        fill
                        sizes="(min-width: 640px) 13rem, 6rem"
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          thumbnailUrl ? "object-cover" : "object-contain p-3 opacity-40"
                        }`}
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center gap-2 sm:gap-3">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-brand-blue sm:text-[0.65rem]">
                        {formatDateShort(date)}
                      </p>
                      <h2 className="line-clamp-3 text-balance font-display text-lg font-extrabold uppercase leading-[1.05] tracking-tight text-ink transition-colors group-hover:text-brand-blue-dark sm:text-2xl">
                        {doc.title}
                      </h2>
                      {doc.excerpt && (
                        <p className="hidden line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:block">
                          {doc.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between gap-4 sm:mt-16">
            <Link
              href={page > 2 ? `/novosti?page=${page - 1}` : "/novosti"}
              aria-disabled={page <= 1}
              className={`group flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs ${
                page <= 1 ? "pointer-events-none opacity-30" : ""
              }`}
            >
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-12 sm:w-8" />
              Prethodna
            </Link>

            <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground tabular-nums sm:text-xs">
              {String(page).padStart(2, "0")} —{" "}
              {String(totalPages).padStart(2, "0")}
            </span>

            <Link
              href={`/novosti?page=${page + 1}`}
              aria-disabled={page >= totalPages}
              className={`group flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground sm:text-xs ${
                page >= totalPages ? "pointer-events-none opacity-30" : ""
              }`}
            >
              Sljedeća
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-12 sm:w-8" />
            </Link>
          </nav>
        )}
      </div>
    </>
  );
}
