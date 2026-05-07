"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTenantLogo } from "@/components/providers/TenantProvider";
import { formatDateShort } from "@/lib/helpers/date";

const skeletonKeys = ["sk1", "sk2", "sk3", "sk4", "sk5"];

export default function NewsPage() {
  const [page, setPage] = useState(0);
  const logo = useTenantLogo();
  const fallback = logo?.url ?? "";

  const { data, isLoading, error } = api.news.useGetNewsPaginated({
    page,
    size: 10,
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <span className="h-px w-12 bg-foreground" />
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          Aktualno · Novosti kluba
        </p>
        <h1 className="select-none text-[15vw] font-black uppercase leading-[0.85] tracking-tighter sm:text-[7rem] md:text-[8rem]">
          Vijesti
        </h1>
      </header>

      <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
        {isLoading ? (
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {skeletonKeys.map((k) => (
              <li
                key={k}
                className="grid grid-cols-[auto_1fr] items-center gap-6 py-6 sm:gap-8 sm:py-8"
              >
                <Skeleton className="size-20 shrink-0 sm:size-28" />
                <div className="space-y-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>Greška pri učitavanju vijesti.</AlertDescription>
          </Alert>
        ) : !data || data.content.length === 0 ? (
          <p className="py-16 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Nema dostupnih vijesti.
          </p>
        ) : (
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {data.content.map((news) => (
              <li key={news.id}>
                <Link
                  href={`/news/${news.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 sm:gap-8 sm:py-8"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-sm bg-muted sm:size-28">
                    <Image
                      src={news.thumbnailPath || fallback}
                      alt={news.title}
                      fill
                      sizes="(min-width: 640px) 7rem, 5rem"
                      className={`transition-transform duration-500 group-hover:scale-105 ${
                        news.thumbnailPath
                          ? "object-cover"
                          : "object-contain p-3"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                      {formatDateShort(news.date)}
                    </p>
                    <h2 className="line-clamp-2 text-base font-bold uppercase leading-tight tracking-tight transition-colors group-hover:text-muted-foreground sm:text-2xl">
                      {news.title}
                    </h2>
                  </div>
                  <ArrowRight className="hidden size-5 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {data && data.totalPages > 1 && (
          <nav className="mt-12 flex items-center justify-between gap-4 sm:mt-16">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="group flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30 sm:text-xs"
            >
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-12 sm:w-8" />
              Prethodna
            </button>

            <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground tabular-nums sm:text-xs">
              {String(page + 1).padStart(2, "0")} —{" "}
              {String(data.totalPages).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((p) => Math.min(data.totalPages - 1, p + 1))
              }
              disabled={page >= data.totalPages - 1}
              className="group flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30 sm:text-xs"
            >
              Sljedeća
              <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-12 sm:w-8" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
