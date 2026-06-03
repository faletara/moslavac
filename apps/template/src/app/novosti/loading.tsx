import { Skeleton } from "@/components/ui/skeleton";

export default function NewsListLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Skeleton className="h-px w-16" />
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-24 w-3/4 sm:h-32" />
      </header>

      <div className="mx-auto mt-16 max-w-4xl space-y-0 sm:mt-20">
        {["n1", "n2", "n3", "n4", "n5", "n6"].map((key) => (
          <div key={key} className="flex items-center gap-6 py-8">
            <Skeleton className="h-24 w-32 shrink-0 sm:h-28 sm:w-40" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
