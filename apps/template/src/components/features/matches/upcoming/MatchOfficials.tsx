"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { HnsMatchInfo } from "@/types/hns";

interface MatchOfficialsProps {
  refereeData: HnsMatchInfo | undefined;
  isLoading: boolean;
}

export default function MatchOfficials({
  refereeData,
  isLoading,
}: MatchOfficialsProps) {
  if (isLoading) {
    return (
      <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
        <Skeleton className="mx-auto h-4 w-24" />
        <div className="mt-8 space-y-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </section>
    );
  }

  const officials = (refereeData?.matchOfficials ?? []).filter(
    (o) => (o.name ?? "").trim() !== "",
  );

  if (officials.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Suci
      </h2>

      <ul className="mx-auto mt-8 max-w-md divide-y divide-border/40">
        {officials.map((official, i) => (
          <li
            key={`${official.personId ?? official.name}-${i}`}
            className="flex items-center justify-between py-3"
          >
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              {official.role ?? ""}
            </span>
            <span className="text-sm font-semibold">{official.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
