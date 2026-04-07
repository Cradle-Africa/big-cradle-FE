import { Skeleton } from "@/components/ui/skeleton";

export function TopPipelinesSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white p-4 border border-gray-100 rounded-md h-full">

      {/* Title */}
      <Skeleton className="h-5 w-32 mb-4 bg-gray-200" />

      {/* Table header */}
      <div className="flex gap-4 mb-3 border-b pb-2">
        <div className="flex-1">
          <Skeleton className="h-4 w-32 bg-gray-200" /> {/* Pipeline name */}
        </div>
        <div className="flex-1">
          <Skeleton className="h-4 w-20 bg-gray-200" /> {/* Responses */}
        </div>
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2 border-b">
          <div className="flex-1">
            <Skeleton className="h-4 w-32 bg-gray-200" /> {/* Pipeline name value */}
          </div>
          <div className="flex-1">
            <Skeleton className="h-4 w-20 bg-gray-200" /> {/* Responses value */}
          </div>
        </div>
      ))}

    </div>
  );
}