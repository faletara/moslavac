import { Skeleton } from "@/components/ui/skeleton";

const cardKeys = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];

export default function FirstTeamLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-24 px-6 py-16 sm:py-24 lg:px-8">
      <header className="flex flex-col items-center gap-8 text-center">
        <span className="h-px w-12" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-24 w-72 sm:h-32 sm:w-96" />
        <Skeleton className="h-3 w-64" />
      </header>

      <section className="space-y-12 sm:space-y-16">
        <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 pb-6 sm:gap-x-10">
          <Skeleton className="h-12 w-14 sm:h-16 sm:w-20" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-48 sm:h-12 sm:w-64" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
          {cardKeys.map((k) => (
            <div key={k} className="flex flex-col gap-5">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
