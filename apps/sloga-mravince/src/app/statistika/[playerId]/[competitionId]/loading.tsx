import { Skeleton } from "@/components/ui/skeleton";

export default function PlayerStatsLoading() {
  return (
    <div className="bg-background">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden bg-ink-deep">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-club-red" />
        <div className="mx-auto grid min-h-[30rem] max-w-6xl content-center gap-10 px-6 py-16 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <Skeleton className="mx-auto aspect-[4/5] w-full max-w-sm rounded-none bg-white/10 lg:mx-0" />
          <div className="space-y-5">
            <Skeleton className="h-3 w-40 bg-white/10" />
            <Skeleton className="h-16 w-72 bg-white/10 sm:h-24 sm:w-96" />
            <Skeleton className="h-3 w-52 bg-white/10" />
          </div>
        </div>
      </section>

      {/* Stats skeleton */}
      <div className="mx-auto w-full max-w-5xl space-y-16 px-6 pt-16 sm:pt-24 lg:px-8">
        <div className="grid grid-cols-2 gap-px border-y border-border/60 md:grid-cols-4">
          {["s1", "s2", "s3", "s4"].map((key) => (
            <div
              key={key}
              className="flex flex-col items-center gap-3 py-12 sm:py-14"
            >
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-2 w-20" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-1 w-full" />
        </div>
      </div>
    </div>
  );
}
