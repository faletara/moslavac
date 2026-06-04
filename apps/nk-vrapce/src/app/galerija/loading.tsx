import { Skeleton } from "@/components/ui/skeleton";

export default function GalerijaLoading() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 pt-16 pb-24 sm:pt-24 lg:px-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <Skeleton className="h-px w-16" />
        <Skeleton className="h-3 w-40" />
        <Skeleton className="h-16 w-72" />
      </div>
      <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {["a1", "a2", "a3", "a4", "a5", "a6"].map((key) => (
          <div key={key} className="space-y-4">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
