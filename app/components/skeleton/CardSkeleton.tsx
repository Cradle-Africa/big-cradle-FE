import { Skeleton } from "@/components/ui/skeleton";

interface SummaryCardSkeletonProps {
  count?: number;
}

export function CardSkeleton({ count = 1 }: SummaryCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-100">
          <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36 bg-gray-200" />
            <Skeleton className="h-6 w-10 bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}