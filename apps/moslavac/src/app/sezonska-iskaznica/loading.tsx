import { Skeleton } from "@/components/ui/skeleton";

export default function SeasonTicketLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-24 px-6 py-16 sm:space-y-32 sm:py-24 lg:px-8">
      <section className="flex flex-col items-center gap-8 text-center">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-28 w-3/4 sm:h-40" />
        <Skeleton className="h-5 w-2/3" />
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-1/2" />
        </div>
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        {["p1", "p2", "p3", "p4"].map((key) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-border/60 py-4"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-64" />
          </div>
        ))}
      </section>
    </div>
  );
}
