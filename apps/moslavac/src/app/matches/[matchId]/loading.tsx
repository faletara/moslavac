import { Skeleton } from "@/components/ui/skeleton";

export default function MatchInfoLoading() {
  return (
    <div className="container mx-auto mt-8 max-w-4xl space-y-6 px-4">
      <Skeleton className="h-48" />
      <Skeleton className="h-64" />
      <Skeleton className="h-48" />
    </div>
  );
}
