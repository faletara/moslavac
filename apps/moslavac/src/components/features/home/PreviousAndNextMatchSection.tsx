"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { NextMatchHero } from "./previous-next/NextMatchHero";
import { PreviousMatchCard } from "./previous-next/PreviousMatchCard";

function isValidMatch<T extends object>(match: T | null | undefined): match is T {
  return match != null && Object.keys(match).length > 0;
}

function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center gap-10 md:gap-14">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-px w-12" />
        <Skeleton className="h-3 w-64" />
      </div>
      <div className="flex w-full items-center justify-center gap-12 md:gap-20">
        <Skeleton className="size-20 rounded-full sm:size-24 md:size-32" />
        <Skeleton className="h-8 w-12" />
        <Skeleton className="size-20 rounded-full sm:size-24 md:size-32" />
      </div>
      <div className="flex gap-3 sm:gap-4 md:gap-5">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-24 w-18 rounded-lg sm:h-28 sm:w-24 md:h-32 md:w-28"
          />
        ))}
      </div>
      <Skeleton className="h-3 w-56" />
    </div>
  );
}

function PreviousSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-3 w-48 self-center" />
    </div>
  );
}

export default function PreviousAndNextMatchSection() {
  const { data: nextMatch, isLoading: nextLoading } =
    api.competitions.useGetNextMatch();
  const { data: previousMatch, isLoading: prevLoading } =
    api.competitions.useGetPreviousMatch();

  if (nextLoading || prevLoading) {
    return (
      <section>
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-20">
          <HeroSkeleton />
        </div>
        <div className="bg-foreground/3">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-20">
            <PreviousSkeleton />
          </div>
        </div>
      </section>
    );
  }

  const hasNext = isValidMatch(nextMatch);
  const hasPrev = isValidMatch(previousMatch);

  if (!hasNext && !hasPrev) return null;

  return (
    <section>
      {hasNext && nextMatch != null && (
        <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-20">
          <NextMatchHero match={nextMatch} />
        </div>
      )}
      {hasPrev && previousMatch != null && (
        <div className="bg-foreground/3">
          <div className="mx-auto w-full max-w-4xl px-4 py-12 md:py-20">
            <PreviousMatchCard match={previousMatch} />
          </div>
        </div>
      )}
    </section>
  );
}
