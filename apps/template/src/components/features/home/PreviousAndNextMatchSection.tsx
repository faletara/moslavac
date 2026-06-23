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
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-12 w-72" />
      </div>
      <div className="flex w-full items-center justify-center gap-12 md:gap-20">
        <Skeleton className="size-20 rounded-full sm:size-24 md:size-32" />
        <Skeleton className="h-10 w-16" />
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

/**
 * Match centar — the dark scoreboard world that continues straight out of the
 * hero: upcoming fixture with countdown, then the latest result as a band.
 */
export default function PreviousAndNextMatchSection() {
  const { data, isLoading } = api.competitions.useGetMatchSlots();

  if (isLoading) {
    return (
      <section id="utakmice" className="dark scroll-mt-20 bg-navy-deep text-foreground">
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
          <HeroSkeleton />
        </div>
        <div className="border-t border-foreground/10 bg-foreground/[0.03]">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
            <PreviousSkeleton />
          </div>
        </div>
      </section>
    );
  }

  const nextMatch = data?.next ?? null;
  const previousMatch = data?.previous ?? null;
  const hasNext = isValidMatch(nextMatch);
  const hasPrev = isValidMatch(previousMatch);

  if (!hasNext && !hasPrev) return null;

  return (
    <section id="utakmice" className="dark relative scroll-mt-20 overflow-hidden bg-navy-deep text-foreground">
      {/* Faint centre glow keeps the scoreboard lit */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-club/10 blur-[140px]"
      />
      {hasNext && nextMatch != null && (
        <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
          <NextMatchHero match={nextMatch} />
        </div>
      )}
      {hasPrev && previousMatch != null && (
        <div className="border-t border-foreground/10 bg-foreground/[0.03]">
          <div className="mx-auto w-full max-w-5xl px-4 py-16 md:py-20">
            <PreviousMatchCard match={previousMatch} />
          </div>
        </div>
      )}
    </section>
  );
}
