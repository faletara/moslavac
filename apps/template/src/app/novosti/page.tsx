import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchNewsPaginated } from "@/lib/payload/getNews";
import { getTenant } from "@/lib/payload/getTenant";
import { formatDateShort } from "@/lib/helpers/date";

export const metadata: Metadata = {
  title: "Novosti",
  description:
    "Najnovije vijesti, najave i izvještaji s utakmica te sva događanja u klubu.",
  alternates: { canonical: "/novosti" },
};

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function NewsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  // Payload uses 1-based pages; URL param is also 1-based
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
    <div className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <header className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <p>
          Aktualno · Novosti kluba
        </p>
        <h1>
          Vijesti
        </h1>
      </header>

      <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
        {docs.length === 0 ? (
          <p className="py-16">
            Nema dostupnih vijesti.
          </p>
        ) : (
          <div>
            {docs.map((doc) => {
              const thumbnailUrl =
                doc.thumbnail && typeof doc.thumbnail === "object"
                  ? doc.thumbnail.url
                  : null;
              const date = doc.publishedAt ?? doc.createdAt;
              return (
                <div key={doc.id}>
                  <Link
                    href={`/novosti/${doc.slug ?? doc.id}`}
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 sm:gap-8 sm:py-8"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden sm:size-28">
                      <Image
                        src={thumbnailUrl || fallback}
                        alt={doc.title}
                        fill
                        sizes="(min-width: 640px) 7rem, 5rem"
                        className={
                          thumbnailUrl ? "object-cover" : "object-contain p-3"
                        }
                      />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p>
                        {formatDateShort(date)}
                      </p>
                      <h2 className="line-clamp-2">
                        {doc.title}
                      </h2>
                    </div>
                    <ArrowRight className="hidden size-5 sm:block" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between gap-4 sm:mt-16">
            <Link
              href={page > 2 ? `/novosti?page=${page - 1}` : "/novosti"}
              aria-disabled={page <= 1}
              className={`flex items-center gap-3 ${
                page <= 1 ? "pointer-events-none" : ""
              }`}
            >
              Prethodna
            </Link>

            <span>
              {String(page).padStart(2, "0")} —{" "}
              {String(totalPages).padStart(2, "0")}
            </span>

            <Link
              href={`/novosti?page=${page + 1}`}
              aria-disabled={page >= totalPages}
              className={`flex items-center gap-3 ${
                page >= totalPages ? "pointer-events-none" : ""
              }`}
            >
              Sljedeća
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
