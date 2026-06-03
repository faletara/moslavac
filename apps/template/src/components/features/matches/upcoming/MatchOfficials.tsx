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
      <section className="mt-20 sm:mt-28">
        <Skeleton className="mx-auto h-4 w-24" />
        <div className="mx-auto mt-8 max-w-md space-y-2">
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
    <section className="mt-20 sm:mt-28">
      <div className="flex flex-col items-center gap-6">
        <p>Sudačka ekipa</p>
        <h2>Suci</h2>
      </div>

      <ul className="mx-auto mt-12 max-w-2xl">
        {officials.map((official, i) => (
          <li
            key={`${official.personId ?? official.name}-${i}`}
            className="grid grid-cols-[auto_1fr] items-center gap-6 py-4 sm:gap-10"
          >
            <span>{official.role ?? ""}</span>
            <span className="text-right">{official.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
