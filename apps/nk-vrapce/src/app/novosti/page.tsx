import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { BrandedHero } from "@/components/features/BrandedHero";
import { formatDateShort } from "@/lib/helpers/date";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";

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

      <div className="mx-auto mt-16 w-full max-w-4xl px-6 pb-24 sm:mt-20 lg:px-8">
        {docs.length === 0 ? (
          <p className="py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nema dostupnih vijesti.
          </p>
        ) : (
          <StaggerContainer
            className="divide-y divide-border/60 border-y border-border/60"
            staggerChildren={0.06}
          >
            {docs.map((doc) => {
              const thumbnailUrl =
                doc.thumbnail && typeof doc.thumbnail === "object"
                  ? doc.thumbnail.url
                  : null;
              const date = doc.publishedAt ?? doc.createdAt;
              return (
                <StaggerItem key={doc.id}>
                  <Link
                    href={`/novosti/${doc.slug ?? doc.id}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 sm:gap-8 sm:py-8"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden bg-muted sm:size-28">
                      <Image
                        src={thumbnailUrl || fallback}
                        alt={doc.title}
                        fill
                        sizes="(min-width: 640px) 7rem, 5rem"
                        className={`transition-transform duration-500 group-hover:scale-105 ${
                          thumbnailUrl ? "object-cover" : "object-contain p-3"
                        }`}
                      />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                        {formatDateShort(date)}
                      </p>
                      <h2 className="line-clamp-2 text-base font-bold leading-snug tracking-tight transition-colors group-hover:text-brand-blue sm:text-xl">
                        {doc.title}
                      </h2>
                    </div>
                    <ArrowRight className="hidden size-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-blue sm:block" />
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
