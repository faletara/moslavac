import { Skeleton } from "@/components/ui/skeleton";

export default function MatchesListLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-12 px-4 py-12">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-72" />
      </div>
      <div className="space-y-4">
        {["m1", "m2", "m3", "m4", "m5", "m6", "m7"].map((key) => (
          <div
            key={key}
            className="flex items-center gap-4 border-b border-border/60 py-4"
          >
            <Skeleton className="h-3 w-20" />
            <div className="flex flex-1 items-center justify-center gap-4">
              <Skeleton className="size-11 rounded-full" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="size-11 rounded-full" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </section>
  );
}
