import { Skeleton } from "@/components/ui/skeleton";

export default function SeasonLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8">
      <div className="space-y-3">
        {["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"].map((key) => (
          <div
            key={key}
            className="flex items-center gap-4 border-b border-border/60 py-4"
          >
            <Skeleton className="h-3 w-16" />
            <div className="flex flex-1 items-center justify-center gap-4">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-9 rounded-full" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}
