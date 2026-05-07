import { Skeleton } from "@/components/ui/skeleton";

export default function NewsDetailLoading() {
  return (
    <div className="container mx-auto mt-8 max-w-3xl space-y-6 px-4">
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-3 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}
