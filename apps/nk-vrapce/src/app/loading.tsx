import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto mt-8 max-w-6xl space-y-8 px-4">
      <Skeleton className="h-96 w-full" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}
