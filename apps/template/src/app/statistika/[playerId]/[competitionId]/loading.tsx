import { Skeleton } from "@/components/ui/skeleton";

export default function PlayerStatsLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-16 px-4 py-16 sm:space-y-20 sm:py-24">
      <header className="flex flex-col items-center gap-8 text-center">
        <Skeleton className="size-32 sm:size-40" />
        <div className="space-y-3">
          <Skeleton className="mx-auto h-3 w-40" />
          <Skeleton className="mx-auto h-12 w-72 sm:h-16 sm:w-96" />
          <Skeleton className="mx-auto h-3 w-48" />
        </div>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((key) => (
          <div key={key} className="space-y-3 p-6">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-20" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-full" />
      </div>
    </section>
  );
}
